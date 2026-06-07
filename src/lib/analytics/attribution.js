// Attribution capture: reads campaign click-ids and UTM params from the
// current URL on entry, persists them so they survive SPA navigation,
// and exposes a merge API that every `track()` call uses.
//
// Storage strategy:
//   - sessionStorage.parkspot_attrib  → JSON of { gclid, gbraid, wbraid,
//     utm_source, utm_medium, utm_campaign, utm_content, utm_term }
//   - cookie parkspot_gclid (90 days, SameSite=Lax, Secure)
//     → mirrors `gclid` only. Google Ads attribution window is 90 days,
//       which exceeds a typical session — we keep the click-id alive
//       across browser restarts so a delayed conversion still attributes.
//
// All exports are SSR-safe: every function bails early when there is no
// `window` / `document` / `sessionStorage` (vite-ssg prerender).

const STORAGE_KEY = 'parkspot_attrib';
const GCLID_COOKIE = 'parkspot_gclid';
const GCLID_COOKIE_DAYS = 90;

const ATTRIBUTION_KEYS = [
    'gclid',
    'gbraid',
    'wbraid',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
];

function isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function safeSessionStorage() {
    if (!isBrowser()) return null;
    try {
        // Touch the API — Safari private mode throws on access.
        return window.sessionStorage;
    } catch {
        return null;
    }
}

function readGclidCookie() {
    if (!isBrowser()) return null;
    const cookies = document.cookie ? document.cookie.split(';') : [];
    for (const raw of cookies) {
        const [name, ...rest] = raw.trim().split('=');
        if (name === GCLID_COOKIE) {
            return decodeURIComponent(rest.join('='));
        }
    }
    return null;
}

function writeGclidCookie(value) {
    if (!isBrowser()) return;
    const expires = new Date(
        Date.now() + GCLID_COOKIE_DAYS * 24 * 60 * 60 * 1000,
    ).toUTCString();
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie =
        `${GCLID_COOKIE}=${encodeURIComponent(value)}; ` +
        `expires=${expires}; path=/; SameSite=Lax${secure}`;
}

/**
 * Read attribution params from `window.location.search` and persist
 * any values that are present. Idempotent — safe to call on every
 * route change, but in practice it is called once at app boot from
 * `src/main.js`.
 *
 * @return {Record<string, string>|null} The captured params, or `null`
 *   if SSR / no params present.
 */
export function captureFromUrl() {
    if (!isBrowser()) return null;
    const search = window.location.search;
    if (!search) return getStored();

    const params = new URLSearchParams(search);
    const captured = {};
    for (const key of ATTRIBUTION_KEYS) {
        const value = params.get(key);
        if (value) captured[key] = value;
    }
    if (Object.keys(captured).length === 0) return getStored();

    // Merge with existing stored values so a subsequent landing that
    // carries only `utm_*` (no gclid) doesn't blow away an earlier gclid.
    const merged = { ...(readStored() || {}), ...captured };
    writeStored(merged);
    if (captured.gclid) writeGclidCookie(captured.gclid);
    return getStored();
}

/**
 * Read raw attribution from sessionStorage (without cookie merge).
 * Mainly internal — most callers want `getStored()`.
 *
 * @return {Record<string, string>|null}
 */
export function readStored() {
    const ss = safeSessionStorage();
    if (!ss) return null;
    try {
        const raw = ss.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
        return null;
    }
}

/**
 * Write attribution to sessionStorage. Overwrites any existing value.
 *
 * @param {Record<string, string>} attribution
 * @return {boolean} `true` if written, `false` if SSR / quota error.
 */
export function writeStored(attribution) {
    const ss = safeSessionStorage();
    if (!ss) return false;
    try {
        ss.setItem(STORAGE_KEY, JSON.stringify(attribution || {}));
        return true;
    } catch {
        return false;
    }
}

/**
 * Get the merged attribution view used by every `track()` call.
 * Cookie-stored `gclid` wins over sessionStorage when both exist —
 * the cookie is the longer-lived, authoritative source for Ads.
 *
 * @return {Record<string, string>} Empty object on SSR.
 */
export function getStored() {
    if (!isBrowser()) return {};
    const stored = readStored() || {};
    const cookieGclid = readGclidCookie();
    if (cookieGclid) {
        return { ...stored, gclid: cookieGclid };
    }
    return stored;
}
