// Build-time helper for fetching SEO data from Firebase RTDB via the public
// REST API. Used by:
//   1. `src/utils/seo/included-routes.js#fetchAllSeoSlugs` to enumerate the
//      area-page slugs vite-ssg should prerender
//   2. `src/store/seoPages/index.js#loadPage` (SSR branch) to bake per-route
//      data into the prerendered HTML during `serverPrefetch`
//   3. `scripts/generate-sitemap.js` to emit `dist/sitemap.xml`
//
// This file MUST be safe to import both inside the Node SSR pass and inside
// the Vite SSR bundle. It uses the global `fetch` available in Node 18+ and
// never reaches for `window`/`document`.
//
// CONCURRENCY MODEL: every consumer reads from a single in-memory snapshot
// of `/seo-pages.json`. We fetch it once on the first request, share the
// in-flight promise across concurrent callers, and serve all subsequent
// per-slug lookups from the cache. This replaced an earlier design that
// did one RTDB request per slug — that design raced RTDB's connection
// limits during vite-ssg's parallel prerender pass and silently produced
// empty area pages for ~10–15 % of slugs whenever a request timed out
// (see Netlify build dated 2026-05-22 for the failure mode).
//
// FAILURE MODE: the bulk fetch is the single point of failure. If it
// throws (network, non-2xx, timeout) the caller's promise rejects and we
// reset the in-flight promise so a subsequent call can retry. The cache
// is intentionally NOT populated with an empty object on failure — that
// would silently mask a network outage as an empty SEO catalogue.

const DB_BASE = 'https://parkspot-a4313-default-rtdb.firebaseio.com';

// City-name set used to split the flat slug list into per-city buckets.
// Adjust when a new city ships.
const HYDERABAD_SLUGS = new Set(['hyderabad']);

const DEFAULT_TIMEOUT_MS = 5000;

// The bulk fetch pulls the full `/seo-pages.json` payload (~50 slugs ×
// ~4 KB each ≈ 200 KB). Build hosts can be transiently slow, so we allow
// six times the per-request budget. Still bounded so a hung RTDB cannot
// stall the build forever.
const BULK_TIMEOUT_MS = 30000;

// Module-level cache; populated on the first call to `fetchSeoPage` or
// `fetchAllSeoSlugs`. `bulkPagesPromise` holds the in-flight promise so
// concurrent callers share a single network request.
let bulkPagesCache = null;
let bulkPagesPromise = null;

/**
 * Internal: fetch JSON from a path relative to `DB_BASE`. Throws on non-2xx.
 *
 * @param {string} path        — must start with `/`.
 * @param {object} [options]
 * @param {number} [options.timeoutMs]
 * @returns {Promise<*>}
 */
export async function fetchJson(path, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    if (typeof path !== 'string' || !path.startsWith('/')) {
        throw new TypeError(
            `[rtdb-build] path must be a string starting with "/", got: ${path}`,
        );
    }

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
        const res = await fetch(`${DB_BASE}${path}`, {
            signal: ctrl.signal,
            headers: { accept: 'application/json' },
        });
        if (!res.ok) {
            throw new Error(`RTDB ${path} -> HTTP ${res.status}`);
        }
        return await res.json();
    } finally {
        clearTimeout(timer);
    }
}

/**
 * Split a flat slug list into the per-city buckets the route table expects.
 * Exported for unit testing.
 *
 * @param {string[]} slugs
 * @returns {{ bangalore: string[], hyderabad: string[] }}
 */
export function splitSlugsByCity(slugs) {
    const all = Array.isArray(slugs) ? slugs : [];
    const bangalore = [];
    const hyderabad = [];
    for (const slug of all) {
        if (typeof slug !== 'string' || !slug) {
            continue;
        }
        if (HYDERABAD_SLUGS.has(slug)) {
            hyderabad.push(slug);
        } else {
            bangalore.push(slug);
        }
    }
    // Stable lexicographic order — important for deterministic builds.
    bangalore.sort();
    hyderabad.sort();
    return { bangalore, hyderabad };
}

/**
 * Internal: fetch the full /seo-pages tree once and cache it. Subsequent
 * callers — including concurrent ones in vite-ssg's parallel render pass —
 * share the in-flight promise so we issue exactly one RTDB request per
 * build.
 *
 * On failure we clear `bulkPagesPromise` (but not `bulkPagesCache`) so a
 * later call can retry. We do not retry here because (a) the failure modes
 * we actually saw were 5 s timeouts in a stampede of 50+ concurrent
 * requests, which collapsing to a single request already fixes, and (b)
 * keeping the caller in control of the retry policy lets the build fail
 * loudly when RTDB is genuinely down rather than rendering 50 empty pages.
 *
 * @returns {Promise<Record<string, unknown>>}
 */
async function ensureBulkLoaded() {
    if (bulkPagesCache !== null) {
        return bulkPagesCache;
    }
    if (bulkPagesPromise !== null) {
        return bulkPagesPromise;
    }
    bulkPagesPromise = (async () => {
        try {
            const payload = await fetchJson('/seo-pages.json', {
                timeoutMs: BULK_TIMEOUT_MS,
            });
            bulkPagesCache =
                payload && typeof payload === 'object' && !Array.isArray(payload)
                    ? payload
                    : {};
            return bulkPagesCache;
        } catch (err) {
            // Drop the in-flight promise so a later caller can retry.
            bulkPagesPromise = null;
            throw err;
        }
    })();
    return bulkPagesPromise;
}

/**
 * Enumerate the slugs that exist under `/seo-pages` in RTDB, split by city.
 *
 * @returns {Promise<{ bangalore: string[], hyderabad: string[] }>}
 */
export async function fetchAllSeoSlugs() {
    const all = await ensureBulkLoaded();
    return splitSlugsByCity(Object.keys(all));
}

/**
 * Fetch the full payload for a single SEO page (the `Sites[]` and any
 * other page-level metadata stored under that slug). Used by
 * `PageNearBy.vue#serverPrefetch` so the spot list ships in the
 * prerendered HTML.
 *
 * Returns `null` for slugs that don't exist in the bulk catalogue (rather
 * than throwing) so a stale route lingering in `routes.js` or a typo in
 * `enumerateAreaPages` cannot crash the whole build.
 *
 * @param {string} slug — case-sensitive RTDB key under `/seo-pages`.
 * @returns {Promise<unknown | null>}
 */
export async function fetchSeoPage(slug) {
    if (typeof slug !== 'string' || !slug) {
        throw new TypeError(
            `[rtdb-build] fetchSeoPage(slug): slug must be a non-empty string, got: ${slug}`,
        );
    }
    const all = await ensureBulkLoaded();
    return Object.prototype.hasOwnProperty.call(all, slug) ? all[slug] : null;
}

// Internal constants + test hooks. Not part of the public API.
export const __internals = {
    DB_BASE,
    HYDERABAD_SLUGS,
    DEFAULT_TIMEOUT_MS,
    BULK_TIMEOUT_MS,
    /**
     * Reset the module-level cache. Vitest-only: production callers must
     * never invoke this — it would defeat the whole point of the cache.
     */
    resetCache() {
        bulkPagesCache = null;
        bulkPagesPromise = null;
    },
};
