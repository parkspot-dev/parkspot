// SSR-safe wrapper around `window.dataLayer.push` and a `gtag()` shim.
//
// The whole analytics stack flows through these two helpers. Components
// must not touch `window.dataLayer` directly — that breaks vite-ssg
// prerender (no `window` during SSR) and bypasses the dev-mode PII
// validator wired up in `index.js`.
//
// Both `push` and `gtag` are no-ops when `typeof window === 'undefined'`.

/**
 * Push an event payload onto `window.dataLayer`. No-op on the server.
 *
 * @param {Record<string, unknown>} payload
 *   The full event object (including the `event` key). Callers are
 *   expected to have already merged attribution / globals via
 *   `index.js#track()` — this function does no enrichment of its own.
 * @return {boolean} `true` if pushed, `false` if no-op'd (SSR).
 */
export function push(payload) {
    if (typeof window === 'undefined') return false;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    return true;
}

/**
 * Minimal `gtag()` shim. Mirrors the one Google's snippet installs
 * (forwards `arguments` onto `dataLayer`) but is SSR-safe.
 *
 * Used by `consent.js` for Consent Mode v2 default/update calls. Kept
 * here (not in consent.js) so any future caller that needs the shim —
 * e.g. setting `gtag('config', ...)` — has one canonical entry point.
 *
 * @param {...unknown} args Variadic — passed through to `dataLayer`.
 * @return {boolean} `true` if pushed, `false` if no-op'd (SSR).
 */
export function gtag(...args) {
    if (typeof window === 'undefined') return false;
    window.dataLayer = window.dataLayer || [];
    // GTM's own shim uses the actual `arguments` object (not an array)
    // so it's distinguishable from an event push. We mimic that shape.
    window.dataLayer.push(args);
    return true;
}
