// Public API for New Relic reporting. Every call into the browser agent
// goes through this module, so PII scrubbing, de-duplication and the SSR
// guard are applied in one place:
//
//   import { reportError, trackEvent, NR_EVENTS } from '@/telemetry';
//
// Each function is a silent no-op during SSR/prerender, when the agent is
// disabled for the build, or when an ad blocker removed it. Telemetry
// must never throw into the caller.
//
// The agent itself is configured at build time by
// scripts/newrelic/vite-plugin.js; see observability/newrelic/README.md
// for the events and attributes, and what dashboards and alerts expect.

import { sanitizeAttributes, sanitizeError, scrubText } from './sanitize.js';

export { NR_EVENTS } from './events.js';

const MAX_LOG_LENGTH = 1024;

// Errors already handed to the agent. One failed Maya call reaches the
// axios interceptor, the interceptor's fallback branch and the service's
// `handleErrors` with the same error object; only the first report (the
// one with the richest attributes) is kept.
let reported = new WeakSet();
let replayEnabled = false;
let replayAllowed = true;

/**
 * The browser agent API (`window.newrelic`), or undefined during SSR and
 * when the agent isn't on the page.
 * @return {object|undefined}
 */
export function getAgent() {
    return typeof window !== 'undefined' ? window.newrelic : undefined;
}

function call(method, ...args) {
    const agent = getAgent();
    if (typeof agent?.[method] !== 'function') return false;
    try {
        agent[method](...args);
        return true;
    } catch {
        return false;
    }
}

/**
 * Report a handled error. Uncaught errors and unhandled rejections are
 * collected by the agent on its own; use this for errors the app catches
 * and recovers from. Give it a `source` naming where the error was
 * caught: the dashboards count errors without one as uncaught. Other
 * attributes should be low-cardinality context (`status`, `endpoint`),
 * never user data.
 * @param {unknown} error An Error (preferred) or a message string.
 * @param {Record<string, unknown>} [attributes]
 */
export function reportError(error, attributes) {
    if (error === undefined || error === null || !getAgent()) return;
    if (typeof error === 'object') {
        if (reported.has(error)) return;
        reported.add(error);
    }
    const value =
        typeof error === 'object' || typeof error === 'string'
            ? error
            : String(error);
    call('noticeError', sanitizeError(value), sanitizeAttributes(attributes));
}

/**
 * Record a business event as a PageAction. Use a name from `NR_EVENTS`.
 * @param {string} name
 * @param {Record<string, unknown>} [attributes]
 */
export function trackEvent(name, attributes) {
    call('addPageAction', name, sanitizeAttributes(attributes));
}

/**
 * Send a log line to New Relic Logs. Whether it is kept depends on the
 * browser app's server-side logging level.
 * @param {'error'|'warn'|'info'|'debug'|'trace'} level
 * @param {unknown} message
 * @param {Record<string, unknown>} [attributes]
 */
export function log(level, message, attributes) {
    const text = scrubText(String(message ?? '')).slice(0, MAX_LOG_LENGTH);
    call('log', text, {
        level,
        customAttributes: sanitizeAttributes(attributes),
    });
}

/**
 * Set a page-level custom attribute that is added to every event the
 * agent sends from now on. Denied (PII) keys are ignored; `null` removes
 * the attribute.
 * @param {string} name
 * @param {string|number|boolean|null} value
 * @param {boolean} [persist] Keep it across page loads in the session.
 */
export function setAttribute(name, value, persist = false) {
    if (value === null) {
        call('setCustomAttribute', name, null);
        return;
    }
    const safe = sanitizeAttributes({ [name]: value })[name];
    if (safe !== undefined) call('setCustomAttribute', name, safe, persist);
}

/**
 * Tag all subsequent data with the signed-in user. Pass the Firebase UID
 * (pseudonymous) only, never a phone number or email. Switching from one
 * user to another starts a fresh agent session so data never mixes.
 * @param {string} userId
 * @param {{ role?: string }} [traits]
 */
export function setUser(userId, { role } = {}) {
    if (!userId) return;
    call('setUserId', String(userId), true);
    if (role) setAttribute('user_role', role, true);
}

/**
 * Forget the signed-in user. Ends the agent session if a user was set.
 */
export function clearUser() {
    call('setUserId', null, true);
    setAttribute('user_role', null);
}

/**
 * Name the current SPA route for BrowserInteraction events and tag
 * subsequent errors and PageActions with it.
 * @param {string} name Low-cardinality route name, never a raw URL.
 */
export function setRouteName(name) {
    call('setCurrentRouteName', name);
    setAttribute('route_name', name);
}

/**
 * Install the agent-level error filter (see ./error-filter.js).
 * @param {(error: unknown) => unknown} filter
 */
export function setErrorFilter(filter) {
    call('setErrorHandler', filter);
}

/**
 * Let session replay start. Replay is configured with
 * `autoStart: false`, so nothing is recorded until the visitor has
 * acknowledged the cookie notice. Which sessions are kept (errors only)
 * is decided by the sampling rates in the New Relic browser app settings.
 * Does nothing once `disableSessionReplay()` has been called on this page.
 */
export function enableSessionReplay() {
    if (replayEnabled || !replayAllowed) return;
    replayEnabled = call('start');
}

/**
 * Keep the rest of this page load out of session replays, for pages whose
 * URL or markup holds personal data that masking can't hide: replays mask
 * text and inputs, but keep the URL with its query string, and attributes
 * such as image sources. The agent stops any recording in progress, and
 * replay stays off for the rest of the visitor's session.
 *
 * The agent only acts on the pause once its replay code has loaded, and
 * what it recorded until then is sent first. `data-nr-block` on the root
 * element keeps that part empty: blocked content is recorded as an empty
 * placeholder.
 */
export function disableSessionReplay() {
    replayAllowed = false;
    if (!getAgent()) return;
    document.documentElement.setAttribute('data-nr-block', '');
    call('pauseReplay');
}

/**
 * Test-only: forget de-duplication and replay state between specs.
 */
export function _resetTelemetryState() {
    reported = new WeakSet();
    replayEnabled = false;
    replayAllowed = true;
    if (typeof document !== 'undefined') {
        document.documentElement.removeAttribute('data-nr-block');
    }
}
