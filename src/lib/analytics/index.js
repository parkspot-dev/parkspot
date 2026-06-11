// Public API of the analytics layer. Components import from this
// module — never from `dataLayer.js` directly — so the SSR guards,
// attribution merging, and dev-mode validation all run uniformly.
//
//   import { track, identify, setUserProperty, EVENTS, LEAD_TYPES } from '@/lib/analytics';
//
// The wrapper is deliberately small. Anything not directly tied to
// "merge globals → validate → push" lives in a sibling module.

import { push } from './dataLayer.js';
import { getStored as getAttribution } from './attribution.js';
import { EVENTS, LEAD_TYPES, validateEvent } from './schema.js';

export { EVENTS, LEAD_TYPES };
export { setDefault as setDefaultConsent, update as updateConsent } from './consent.js';

function isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function isDev() {
    // `import.meta.env.DEV` is replaced statically by Vite during the
    // build, so this branch is dead-code-eliminated in production.
    try {
        return Boolean(import.meta && import.meta.env && import.meta.env.DEV);
    } catch {
        return false;
    }
}

function readPageDefaults() {
    if (!isBrowser()) return {};
    const defaults = {};
    try {
        defaults.page_path =
            window.location.pathname + (window.location.search || '');
    } catch {
        // Some embedded contexts forbid `location` access. Skip silently.
    }
    try {
        if (document.title) defaults.page_title = document.title;
    } catch {
        // Same as above.
    }
    return defaults;
}

/**
 * Push a tracking event. SSR-safe (no-op when there is no `window`).
 *
 * Behaviour:
 *   1. On the server, returns immediately.
 *   2. Reads `page_path` / `page_title` from `window.location` /
 *      `document.title` as defaults — overridable by `params`.
 *   3. Merges attribution (gclid, gbraid, wbraid, utm_*) from storage.
 *   4. In dev, validates against `schema.js` (throws on violation).
 *   5. Pushes `{ event: eventName, ...mergedParams }` onto dataLayer.
 *
 * @param {string} eventName One of `EVENTS.*`.
 * @param {Record<string, unknown>} [params] Per-event params. May
 *   override page-default fields and attribution.
 * @return {boolean} `true` if pushed, `false` if no-op'd.
 */
export function track(eventName, params = {}) {
    if (!isBrowser()) return false;

    const merged = {
        ...readPageDefaults(),
        ...getAttribution(),
        ...params,
    };

    if (isDev()) {
        // Validation is dev-only — production never throws because
        // `isDev()` returns false and Vite tree-shakes the import path.
        validateEvent(eventName, merged);
    }

    return push({ event: eventName, ...merged });
}

/**
 * Set the user identity. Emits an `identify` event so GTM can forward
 * `user_id` to GA4 and the user-properties bag to GA4 user dimensions.
 *
 * Note: pass internal user IDs only — never email/phone (Google
 * rejects PII in `user_id`).
 *
 * @param {string} userId
 * @param {Record<string, unknown>} [userProperties]
 * @return {boolean} `true` if pushed, `false` if no-op'd.
 */
export function identify(userId, userProperties = {}) {
    if (!isBrowser()) return false;
    return track(EVENTS.IDENTIFY, {
        user_id: userId,
        user_properties: userProperties || {},
    });
}

/**
 * Set a single user property. Convenience over `identify()` when the
 * user ID hasn't changed but a property has (e.g. `city` becomes
 * known after geolocation resolves).
 *
 * @param {string} key
 * @param {unknown} value
 * @return {boolean} `true` if pushed, `false` if no-op'd.
 */
export function setUserProperty(key, value) {
    if (!isBrowser()) return false;
    return track(EVENTS.SET_USER_PROPERTY, {
        user_properties: { [key]: value },
    });
}
