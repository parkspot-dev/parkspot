// Route enumeration for vite-ssg.
//
// Extracted from `src/main.js` so we can unit-test the filter in
// isolation. The function is re-exported as a top-level named export
// from `main.js` because that is the only location vite-ssg
// recognises — placing it in the `ViteSSG(...)`'s 4th-argument
// options object silently disables it (the slot is reserved for
// client-only options like `transformState`). See the upstream README
// "Custom Routes to Render" section for the contract.
//
// IMPORTANT: do NOT static-import `./rtdb-build.js` at module scope.
// `included-routes.js` is reachable from the client entry (`main.js`
// re-exports `includedRoutes`), so a static import would pull
// `rtdb-build.js` — its hardcoded RTDB REST URL and the bulk-cache
// machinery — into every browser page load. It would also defeat the
// matching `await import(...)` inside `store/seoPages/index.js` (vite
// emits an explicit warning about this in the build log:
// "rtdb-build.js is dynamically imported by store/seoPages but also
//  statically imported by included-routes, dynamic import will not move
//  module into another chunk"). Keeping the import dynamic and inside
// `includedRoutes` lets rollup code-split the module into its own
// chunk that's loaded only during vite-ssg's prerender pass.

// Exact paths that are SPA-only by design (client redirects, scratch
// pages, transactional status pages). Excluded from the prerender
// set so they never appear in search results.
export const SSG_EXCLUDED_EXACT = Object.freeze(
    new Set([
        '/app',
        '/temp',
        '/thank-you',
        '/error',
        // Legacy redirect target → `/internal/search-portal`. Excluding
        // the source path keeps vue-router away from any /internal/*
        // shape even if `crawl` were ever re-enabled.
        '/search-portal',
    ]),
);

const SSG_EXCLUDED_PREFIXES = Object.freeze([
    '/internal/',
    '/payment/',
    '/profile/',
    '/user/',
]);

/**
 * Filter the raw path list vite-ssg produces from the router definition.
 *
 * Drops:
 *   - auth-gated trees (`/internal/*`, `/payment/*`, `/profile/*`,
 *     `/user/*`) — guards in `routes.js` redirect unauthenticated callers,
 *     so prerendering them just ships SPA-shell HTML at the wrong URL.
 *   - paths with a `:` param placeholder — can't be prerendered without
 *     a slug list (those are produced separately by `enumerateAreaPages`).
 *   - paths in `SSG_EXCLUDED_EXACT` — see set documentation.
 *
 * @param { string[] } paths - candidate paths from vite-ssg.
 * @returns { string[] } the subset that should be statically rendered.
 */
export function filterStaticPaths(paths) {
    return paths.filter((p) => {
        if (typeof p !== 'string') return false;
        if (p.includes(':')) return false;
        if (SSG_EXCLUDED_EXACT.has(p)) return false;
        for (const prefix of SSG_EXCLUDED_PREFIXES) {
            if (p.startsWith(prefix)) return false;
        }
        return true;
    });
}

/**
 * Produce the trailing-slashed area-page URLs that vite-ssg should
 * render. Trailing slash matters: it makes vite-ssg emit the file at
 * `dist/<city>/parking-near-<slug>/index.html`, matching the canonical
 * URL the edge function (and `to-head.js`) already declares.
 *
 * @param { { bangalore: string[], hyderabad: string[] } } slugs
 * @returns { string[] }
 */
export function buildAreaPagePaths(slugs) {
    const { bangalore = [], hyderabad = [] } = slugs || {};
    return [
        ...bangalore.map((s) => `/bangalore/parking-near-${s}/`),
        ...hyderabad.map((s) => `/hyderabad/parking-near-${s}/`),
    ];
}

/**
 * vite-ssg hook. Returns the final list of paths to prerender.
 *
 * Failures during RTDB enumeration must NOT block the build — falling
 * back to the static path set still produces a useful SPA shell for
 * unknown routes (Netlify's `_redirects` catches them).
 *
 * @param { string[] } paths
 * @param { unknown }  _routes  (unused; kept for vite-ssg signature parity)
 * @returns { Promise<string[]> }
 */
export async function includedRoutes(paths, _routes) {
    const filtered = filterStaticPaths(paths);

    try {
        // Dynamic import — see file-header note. The specifier MUST stay
        // in literal form so rollup can statically analyse it and emit a
        // dedicated chunk.
        const { fetchAllSeoSlugs } = await import('./rtdb-build.js');
        const slugs = await fetchAllSeoSlugs();
        return [...filtered, ...buildAreaPagePaths(slugs)];
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(
            '[ssg] RTDB enumeration failed; shipping static routes only',
            err,
        );
        return filtered;
    }
}
