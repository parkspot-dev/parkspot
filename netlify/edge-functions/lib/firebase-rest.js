// Optional enhancement: fetch live data from the Firebase Realtime Database
// REST endpoint to enrich SEO metadata with real site counts / spot names.
//
// Every function here is best-effort:
//   - short timeout (defaults to 1.5 s)
//   - any error or non-2xx response resolves to `null`
//   - the edge function falls back to template-only metadata
//
// This keeps the critical request path resilient -- a Firebase outage must
// never break the static shell response.

const DB_BASE = 'https://parkspot-a4313-default-rtdb.firebaseio.com';
const DEFAULT_TIMEOUT_MS = 1500;

async function fetchJson(path, { timeoutMs = DEFAULT_TIMEOUT_MS, fetchImpl = fetch } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetchImpl(`${DB_BASE}${path}`, {
            method: 'GET',
            signal: controller.signal,
            headers: { 'accept': 'application/json' },
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    } finally {
        clearTimeout(timer);
    }
}

/**
 * Fetch the /seo-pages/<areaSlug> node and return a lightweight summary.
 * @param {string} areaSlug
 * @param {object} [opts]
 * @returns {Promise<{ sitesCount: number } | null>}
 */
export async function fetchAreaEnhancement(areaSlug, opts) {
    if (!areaSlug || typeof areaSlug !== 'string') return null;
    // Try both the raw slug and a lower-cased variant; the RTDB export uses
    // lower-case slugs for most areas but a couple of legacy CamelCase keys
    // (e.g. "BTM", "Yalahanka") exist too.
    const candidates = [areaSlug, areaSlug.toLowerCase()];
    const seen = new Set();
    for (const candidate of candidates) {
        if (seen.has(candidate)) continue;
        seen.add(candidate);
        const payload = await fetchJson(`/seo-pages/${encodeURIComponent(candidate)}.json`, opts);
        if (payload && Array.isArray(payload.Sites)) {
            return { sitesCount: payload.Sites.length };
        }
    }
    return null;
}
