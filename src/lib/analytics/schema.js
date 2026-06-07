// Event schema — single source of truth for event names, lead types,
// and the dev-mode validator that catches schema drift before a bad
// payload escapes to GTM.
//
// Mirrors `campaign-conversion-tracking/events.csv` and Appendix A of
// `campaign-conversion-tracking/plan.md`. Update those docs whenever
// this file changes.
//
// `validateEvent()` is intentionally a no-op outside dev so production
// pays zero validation cost — the validator is a static-analysis tool
// for engineers, not a runtime safety net.

/**
 * GA4 / parkspot event names. Use these constants instead of raw
 * strings at every call site so renames are a single-file edit.
 */
export const EVENTS = Object.freeze({
    PAGE_VIEW: 'page_view',
    FUNNEL_VIEW: 'funnel_view',
    FORM_START: 'form_start',
    FORM_ERROR: 'form_error',
    FORM_SUBMIT_ATTEMPT: 'form_submit_attempt',
    IMAGE_UPLOAD_START: 'image_upload_start',
    IMAGE_UPLOAD_COMPLETE: 'image_upload_complete',
    GENERATE_LEAD: 'generate_lead',
    LEAD_CONFIRMED: 'lead_confirmed',
    SEARCH: 'search',
    VIEW_SEARCH_RESULTS: 'view_search_results',
    VIEW_ITEM_LIST: 'view_item_list',
    SELECT_ITEM: 'select_item',
    VIEW_ITEM: 'view_item',
    BEGIN_CHECKOUT: 'begin_checkout',
    PAYMENT_INITIATED: 'payment_initiated',
    PURCHASE: 'purchase',
    PURCHASE_CONFIRMED: 'purchase_confirmed',
    // Identity / user-property updates. Not in the funnel taxonomy but
    // still flow through `track()` (or `identify()`).
    IDENTIFY: 'identify',
    SET_USER_PROPERTY: 'set_user_property',
});

/**
 * Lead-type values for the `lead_type` param on `generate_lead`.
 * Locked by §1.4 of plan.md.
 */
export const LEAD_TYPES = Object.freeze({
    PARKING_SEEKER: 'parking_seeker',
    PARKING_OWNER: 'parking_owner',
    CONTACT: 'contact',
    TENTATIVE_BOOKING_AUTH: 'tentative_booking_auth',
    TENTATIVE_BOOKING_GUEST: 'tentative_booking_guest',
});

// Required-param table per Appendix A. Keys are event names; values
// are arrays of param names that MUST be present when the event is
// pushed. Globals merged by the wrapper (page_path, gclid, utm_*,
// client_id) are not validated here — those come from outside the
// component's hands.
const REQUIRED_PARAMS = Object.freeze({
    [EVENTS.PAGE_VIEW]: ['page_path', 'page_title'],
    [EVENTS.FUNNEL_VIEW]: ['funnel_name'],
    [EVENTS.FORM_START]: ['funnel_name', 'step_index'],
    [EVENTS.FORM_ERROR]: ['funnel_name', 'error_fields'],
    [EVENTS.FORM_SUBMIT_ATTEMPT]: ['funnel_name'],
    [EVENTS.IMAGE_UPLOAD_START]: ['funnel_name', 'image_count'],
    [EVENTS.IMAGE_UPLOAD_COMPLETE]: [
        'funnel_name',
        'image_count',
        'duration_ms',
    ],
    [EVENTS.GENERATE_LEAD]: [
        'funnel_name',
        'lead_type',
        'value',
        'currency',
        'enhanced_conversion_data',
    ],
    [EVENTS.LEAD_CONFIRMED]: ['funnel_name'],
    [EVENTS.SEARCH]: ['search_term'],
    [EVENTS.VIEW_SEARCH_RESULTS]: ['funnel_name', 'item_count'],
    [EVENTS.VIEW_ITEM_LIST]: ['funnel_name', 'items'],
    [EVENTS.SELECT_ITEM]: ['funnel_name', 'items'],
    [EVENTS.VIEW_ITEM]: ['funnel_name', 'items'],
    [EVENTS.BEGIN_CHECKOUT]: ['funnel_name', 'value', 'currency', 'items'],
    [EVENTS.PAYMENT_INITIATED]: [
        'funnel_name',
        'payment_provider',
        'value',
        'currency',
        'transaction_id',
    ],
    [EVENTS.PURCHASE]: [
        'funnel_name',
        'transaction_id',
        'value',
        'currency',
        'items',
        'enhanced_conversion_data',
    ],
    [EVENTS.PURCHASE_CONFIRMED]: ['funnel_name', 'transaction_id'],
    [EVENTS.IDENTIFY]: ['user_id'],
    [EVENTS.SET_USER_PROPERTY]: [],
});

// PII keys that must NEVER appear at the top level of any event. They
// are allowed only inside `enhanced_conversion_data` on `generate_lead`
// and `purchase`. This is the dev-mode counterpart to GA4's own PII
// scan — we'd rather throw locally than have Google reject the
// property and yank our analytics access.
const PII_KEYS = Object.freeze([
    'email',
    'email_address',
    'phone',
    'phone_number',
]);

const EVENTS_WITH_ENHANCED_CONVERSION_DATA = Object.freeze([
    EVENTS.GENERATE_LEAD,
    EVENTS.PURCHASE,
]);

function isKnownEvent(eventName) {
    return Object.values(EVENTS).includes(eventName);
}

function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Throws a descriptive Error if the (eventName, params) pair violates
 * the schema. Called from `index.js#track()` only when
 * `import.meta.env.DEV === true` so production callers pay nothing.
 *
 * Validation rules:
 *   - Event must be a known name (per `EVENTS`).
 *   - All entries in `REQUIRED_PARAMS[eventName]` must be present and
 *     not `undefined` / `null` / empty string. (`0` and `false` are OK.)
 *   - Top-level keys must not include any PII. PII may appear inside
 *     `enhanced_conversion_data`, and only on `generate_lead` /
 *     `purchase`.
 *
 * @param {string} eventName
 * @param {Record<string, unknown>} params
 * @throws {Error} on any violation.
 */
export function validateEvent(eventName, params = {}) {
    if (!isKnownEvent(eventName)) {
        throw new Error(
            `[analytics] Unknown event "${eventName}". ` +
                `Add it to EVENTS in src/lib/analytics/schema.js or use a known event.`,
        );
    }

    const required = REQUIRED_PARAMS[eventName] || [];
    for (const key of required) {
        const value = params[key];
        const missing =
            value === undefined ||
            value === null ||
            (typeof value === 'string' && value.length === 0);
        if (missing) {
            throw new Error(
                `[analytics] Event "${eventName}" is missing required param "${key}". ` +
                    `See schema.js / plan.md Appendix A.`,
            );
        }
    }

    // Top-level PII check.
    for (const piiKey of PII_KEYS) {
        if (hasOwn(params, piiKey)) {
            throw new Error(
                `[analytics] Event "${eventName}" carries PII at the top level ` +
                    `("${piiKey}"). PII is allowed only inside ` +
                    `enhanced_conversion_data on generate_lead/purchase. ` +
                    `Did you forget to wrap it?`,
            );
        }
    }

    // `enhanced_conversion_data` is only valid on conversion events.
    if (
        hasOwn(params, 'enhanced_conversion_data') &&
        !EVENTS_WITH_ENHANCED_CONVERSION_DATA.includes(eventName)
    ) {
        throw new Error(
            `[analytics] enhanced_conversion_data is only allowed on ` +
                `${EVENTS_WITH_ENHANCED_CONVERSION_DATA.join('/')} ` +
                `events; saw it on "${eventName}".`,
        );
    }
}

/**
 * Test-only export so unit tests can assert against the same required-
 * param table the validator uses without re-importing the dictionary
 * via a brittle internal path.
 *
 * @return {Record<string, ReadonlyArray<string>>}
 */
export function _getRequiredParams() {
    return REQUIRED_PARAMS;
}

/**
 * Test-only export — same rationale as `_getRequiredParams`.
 *
 * @return {ReadonlyArray<string>}
 */
export function _getPiiKeys() {
    return PII_KEYS;
}
