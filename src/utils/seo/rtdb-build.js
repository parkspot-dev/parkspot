// Build-time helper for fetching SEO data from Firebase RTDB via the public
// REST API. Used by:
//   1. `src/main.js#includedRoutes` to enumerate area-page slugs at build time
//   2. `src/views/PageNearBy.vue#serverPrefetch` to bake per-route data into
//      the prerendered HTML
//   3. `scripts/generate-sitemap.js` to emit `dist/sitemap.xml`
//
// This file MUST be safe to import both inside the Node SSR pass (Phase 1+2)
// and inside the Vite SSR bundle (for `serverPrefetch`). It uses the global
// `fetch` available in Node 18+ and never reaches for `window`/`document`.
//
// PERFORMANCE: `fetchAllSeoSlugs` uses RTDB's `shallow=true` query so it pulls
// only the top-level keys (~5 KB) instead of the full ~200 KB payload.
//
// FAILURE MODE: every public function rejects on HTTP non-2xx or network
// timeout. The consumer is responsible for catching and degrading gracefully
// (we cannot decide here whether a partial result should fail the whole
// build).

const DB_BASE = 'https://parkspot-a4313-default-rtdb.firebaseio.com';

// City-name set used to split the flat slug list into per-city buckets. Today
// only "hyderabad" is its own city; every other slug belongs to bangalore.
// Adjust this set when a new city ships.
const HYDERABAD_SLUGS = new Set(['hyderabad']);

const DEFAULT_TIMEOUT_MS = 5000;

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
 * Split a flat slug list (as returned by `seo-pages.json?shallow=true`) into
 * the per-city buckets that the route table expects.
 *
 * Exported for unit testing — exposes the city-classification logic without
 * requiring a network call.
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
    // Stable order in the output is important for deterministic builds.
    bangalore.sort();
    hyderabad.sort();
    return { bangalore, hyderabad };
}

/**
 * Cheap one-shot fetch of just the keys under `/seo-pages`. The
 * `shallow=true` parameter tells RTDB to return `{ <key>: true }` instead of
 * the full tree.
 *
 * @returns {Promise<{ bangalore: string[], hyderabad: string[] }>}
 */
export async function fetchAllSeoSlugs() {
    const shallow = await fetchJson('/seo-pages.json?shallow=true');
    return splitSlugsByCity(Object.keys(shallow || {}));
}

/**
 * Fetch the full payload for a single SEO page (the `Sites[]` and any other
 * page-level metadata stored under that slug). Used by
 * `PageNearBy.vue#serverPrefetch` so the spot list ships in the prerendered
 * HTML.
 *
 * @param {string} slug — case-sensitive RTDB key under `/seo-pages`.
 * @returns {Promise<*>}
 */
export async function fetchSeoPage(slug) {
    if (typeof slug !== 'string' || !slug) {
        throw new TypeError(
            `[rtdb-build] fetchSeoPage(slug): slug must be a non-empty string, got: ${slug}`,
        );
    }
    const encoded = encodeURIComponent(slug);
    return await fetchJson(`/seo-pages/${encoded}.json`);
}

// Internal constants exposed for unit tests. Not part of the public API.
export const __internals = {
    DB_BASE,
    HYDERABAD_SLUGS,
    DEFAULT_TIMEOUT_MS,
};
