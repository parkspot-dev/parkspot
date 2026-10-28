// Callback for `newrelic.setErrorHandler()`. The agent runs it for every
// error it is about to record (uncaught errors, unhandled rejections and
// `noticeError()` calls alike) and the return value decides the outcome:
//   - truthy       -> the error is dropped
//   - { group: x } -> the error is recorded under fingerprint `x`
//   - falsy        -> the error is recorded as usual
// The agent only swallows its own rrweb/CSP noise, so browser and
// extension noise has to be filtered here.

// Messages that carry no actionable signal.
const IGNORED_MESSAGES = [
    // Benign layout-loop notice that Chrome and Safari report as an error.
    /ResizeObserver loop/i,
    // Cross-origin script failure with the details stripped by the
    // browser (GTM tags, Cashfree, ad scripts).
    /^Script error\.?$/i,
    // The visitor closed or replaced the Google sign-in popup.
    /\bauth\/(?:popup-closed-by-user|cancelled-popup-request|user-cancelled)\b/,
];

const EXTENSION_URL =
    /\b(?:chrome|moz|safari(?:-web)?|ms-browser)-extension:\/\//i;

// A tab opened before a deploy requests chunks that no longer exist.
const CHUNK_LOAD_ERROR =
    /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Unable to preload CSS/i;
// Offline / flaky-network failures from fetch and axios.
const NETWORK_ERROR =
    /^(?:Unhandled Promise Rejection: )?(?:Network Error|Failed to fetch|Load failed|NetworkError when attempting to fetch resource\.)$/i;

// Fingerprints that fold many near-identical errors into one Errors
// Inbox group. Add new groups here rather than at call sites.
const ERROR_GROUPS = [
    { group: 'chunk-load', pattern: CHUNK_LOAD_ERROR },
    { group: 'network', pattern: NETWORK_ERROR },
];

// Per-message cap within one window, so a render loop or a retry storm
// can't burn through the ingest budget.
export const RATE_LIMIT = 20;
export const RATE_WINDOW_MS = 60 * 1000;
// Distinct messages tracked per window before the counters reset.
const MAX_TRACKED_MESSAGES = 500;

function isExtensionError(error) {
    if (typeof error.sourceURL === 'string') {
        return EXTENSION_URL.test(error.sourceURL);
    }
    const stack = typeof error.stack === 'string' ? error.stack : '';
    // Only drop errors whose stack never touches a web page script, so an
    // extension that wraps `fetch` can't hide our own failures.
    return EXTENSION_URL.test(stack) && !/https?:\/\//i.test(stack);
}

/**
 * Build the `setErrorHandler` callback.
 * @param {{ limit?: number, windowMs?: number, now?: () => number }} [options]
 * @return {(error: unknown) => boolean | { group: string }}
 */
export function createErrorFilter({
    limit = RATE_LIMIT,
    windowMs = RATE_WINDOW_MS,
    now = Date.now,
} = {}) {
    const counts = new Map();
    let windowStart = now();

    return function filterError(error) {
        if (!error || typeof error !== 'object') return false;
        const message = String(error.message ?? '');
        if (IGNORED_MESSAGES.some((pattern) => pattern.test(message))) {
            return true;
        }
        if (isExtensionError(error)) return true;

        const time = now();
        if (
            time - windowStart >= windowMs ||
            counts.size >= MAX_TRACKED_MESSAGES
        ) {
            counts.clear();
            windowStart = time;
        }
        const key = `${error.name}|${message}`;
        const count = (counts.get(key) || 0) + 1;
        counts.set(key, count);
        if (count > limit) return true;

        const match = ERROR_GROUPS.find(({ pattern }) => pattern.test(message));
        return match ? { group: match.group } : false;
    };
}
