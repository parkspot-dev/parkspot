// PII scrubbing for everything the app and the edge functions hand to
// New Relic.
//
// Two layers, applied by the `@/telemetry` facade before any call into
// the browser agent (and by netlify/edge-functions/lib/telemetry.js to
// its log records):
//   1. Keys: attributes whose name identifies personal or secret data
//      (contact details, names, credentials, KYC, bank/UPI, location,
//      payment-link params) are dropped outright.
//   2. Values: free text (error messages, stack traces, log lines, URLs)
//      loses query strings, data: URLs, JWTs, base64 payloads, emails,
//      Indian mobile numbers and Aadhaar numbers.
//
// The value rules double as the agent's `init.obfuscate` config
// (OBFUSCATION_RULES, inlined by scripts/newrelic/vite-plugin.js), so the
// data the agent collects by itself (uncaught errors, AJAX paths, click
// text, resource URLs) is masked the same way. Keep this module pure and
// dependency-free: the build imports it in Node, and the edge functions
// in Deno.

// The agent caps custom attributes at 64 per event; the rest of the
// budget is left for the page-level ones (enduser.id, environment,
// application.version, route_name, user_role).
export const MAX_ATTRIBUTES = 48;
export const MAX_STRING_LENGTH = 256;

// Matched anywhere inside the normalized key, so "customer_phone",
// "PSAuthKey" and "bankAccountNo" are all caught.
const DENIED_KEY_FRAGMENTS = [
    'email',
    'phone',
    'mobile',
    'whatsapp',
    'password',
    'passwd',
    'secret',
    'token',
    'apikey',
    'licensekey',
    'authorization',
    'authkey',
    'cookie',
    'aadhaar',
    'aadhar',
    'ifsc',
    'vehicleno',
    'vehiclenum',
    'vehiclereg',
    'regno',
    'registrationnumber',
    'accountnumber',
    'accountno',
    'bankaccount',
    'address',
    'base64',
];

// Matched against the whole normalized key. Too short or too generic to
// use as fragments ("p" or "name" would match half the vocabulary).
const DENIED_KEYS = new Set([
    // People
    'name',
    'fullname',
    'firstname',
    'lastname',
    'middlename',
    'username',
    'displayname',
    'customername',
    'ownername',
    'contactname',
    'accountholdername',
    'itemname',
    // Contact number field used by the booking/lead forms
    'cno',
    // Payment-link params (`/payment/validate?p=&h=`) and other secrets.
    // `transaction_id` carries the `?p=` value, and `order_id` is the only
    // credential the public /payment/status lookup asks for (the booking
    // portal sends a `paymentId` as `order_id`). Cashfree's checkout opens
    // with a `PaymentSessionID`.
    'p',
    'h',
    'transactionid',
    'orderid',
    'paymentid',
    'paymentsessionid',
    'hash',
    'sig',
    'signature',
    'sas',
    'sasurl',
    'otp',
    'pin',
    'cvv',
    'pan',
    'card',
    'cardnumber',
    'upi',
    'upiid',
    'upiurl',
    'upiqr',
    'qrcode',
    'vpa',
    // Vehicle details
    'vehicle',
    'vehicles',
    // Precise location (search_term carries the raw "lat,lng" query;
    // Maya's sites have `Lat` and `Long`)
    'lat',
    'lng',
    'lon',
    'long',
    'latitude',
    'longitude',
    'latlng',
    'coords',
    'coordinates',
    'geolocation',
    'searchterm',
    'landmark',
    // Uploaded documents and images (KYC), and profile photos
    'image',
    'images',
    'photo',
    'photourl',
    'avatar',
    'file',
    'files',
    'document',
    'blob',
    'selfie',
    // Government ID numbers: the KYC form posts the Aadhaar number as
    // `IdNumber` (src/store/identityKyc)
    'idnumber',
    // Ad-platform payloads that only make sense in GA4/Google Ads
    'enhancedconversiondata',
    'userproperties',
    'gclid',
    'gbraid',
    'wbraid',
    // Network identifiers
    'ip',
    'ipaddress',
]);

// data: URLs (inline uploads, canvas exports). Replaced before the URL
// rules below because their payload isn't a query string.
const DATA_URL = /\bdata:[^\s"'<>,;]*[;,][^\s"'<>)]*/gi;
// Query string or fragment of an absolute URL. A trailing `:line:col` is
// kept so stack frames still parse and map to source.
const URL_QUERY =
    /(\b[a-z][a-z\d+.-]{0,31}:\/\/[^\s?#"'<>()]+)[?#][^\s"'<>()]*?((?::\d+){0,2})(?=[\s"'<>()]|$)/gi;
// The same for a root-relative path ("/srp?latlng=..."), at the start of
// the text or after whitespace, a quote or "(".
const PATH_QUERY =
    /((?:^|[\s"'(])\/[^\s?#"'<>()]*)[?#][^\s"'<>()]*?((?::\d+){0,2})(?=[\s"'<>()]|$)/g;
// Maya routes with the username (a phone number or email) in the path:
// PATCH auth/user/{UserName}/kycStatus.
const USER_PATH = /(\bauth\/user\/)[^/?#\s"'<>()]+/gi;
// Mapbox geocoding has the visitor's search in the path
// (src/store/map: /geocoding/v5/mapbox.places/{query}.json). Everything
// after the endpoint goes: a search can hold a "/" ("12/3 MG Road"), and
// browsers don't percent-encode ' or () in paths.
const GEOCODING_QUERY = /(\/geocoding\/v5\/[\w.-]+\/)[^?#\s"<>]+/gi;
const JWT = /\beyJ[\w-]+\.[\w-]+\.[\w-]+/g;
// Raw file contents (KYC photos, uploads) that arrive without a data:
// prefix. IDs, chunk hashes and digests are far shorter than this.
const BASE64_BLOB = /[a-z\d+/]{200,}={0,2}/gi;
// Length limits keep matching linear on long input.
const EMAIL = /[a-z\d._%+-]{1,64}@[a-z\d.-]{1,253}\.[a-z]{2,}/gi;
// Indian mobile numbers: optional +91/91/0 prefix, then ten digits
// starting 6-9 with an optional space or hyphen after the fifth. It has
// to stand alone, so digit runs inside IDs and hashes are left alone.
// The leading group stands in for a lookbehind, which Safari < 16.4
// can't parse.
const PHONE =
    /(^|[^a-z\d])(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}(?![a-z\d])/gi;
// Aadhaar numbers: twelve digits starting 2-9, run together or in groups
// of four split by the same space or hyphen ("2345 6789 0123", as the KYC
// form shows them). Standalone like PHONE, and not right after a hyphen:
// the last group of a UUID can be twelve digits too.
const AADHAAR = /(^|[^a-z\d-])[2-9]\d{3}([\s-]?)\d{4}\2\d{4}(?![a-z\d])/gi;

/**
 * Value rules, in the shape of the browser agent's `init.obfuscate`
 * option. Order matters: data: URLs and query strings go first so the
 * later rules never see their payloads. Every regex must be global.
 */
export const OBFUSCATION_RULES = Object.freeze([
    { regex: DATA_URL, replacement: '[data-url]' },
    { regex: URL_QUERY, replacement: '$1$2' },
    { regex: PATH_QUERY, replacement: '$1$2' },
    { regex: USER_PATH, replacement: '$1[user]' },
    { regex: GEOCODING_QUERY, replacement: '$1[query]' },
    { regex: JWT, replacement: '[jwt]' },
    { regex: BASE64_BLOB, replacement: '[base64]' },
    { regex: EMAIL, replacement: '[email]' },
    { regex: PHONE, replacement: '$1[phone]' },
    { regex: AADHAAR, replacement: '$1[aadhaar]' },
]);

function normalizeKey(key) {
    return String(key)
        .toLowerCase()
        .replace(/[^a-z\d]/g, '');
}

/**
 * Whether an attribute name identifies personal or secret data.
 * @param {string} key
 * @return {boolean}
 */
export function isDeniedKey(key) {
    const normalized = normalizeKey(key);
    return (
        DENIED_KEYS.has(normalized) ||
        DENIED_KEY_FRAGMENTS.some((fragment) => normalized.includes(fragment))
    );
}

/**
 * Apply OBFUSCATION_RULES to free text: query strings, data: URLs, JWTs,
 * emails, phone and Aadhaar numbers, usernames in Maya paths and searches
 * in Mapbox geocoding paths are masked.
 * Non-strings are returned unchanged.
 * @param {unknown} value
 * @return {unknown}
 */
export function scrubText(value) {
    if (typeof value !== 'string' || value === '') return value;
    return OBFUSCATION_RULES.reduce(
        (text, { regex, replacement }) => text.replace(regex, replacement),
        value,
    );
}

function truncate(value) {
    return value.length > MAX_STRING_LENGTH
        ? value.slice(0, MAX_STRING_LENGTH)
        : value;
}

function isPrimitive(value) {
    return (
        typeof value === 'string' ||
        typeof value === 'boolean' ||
        (typeof value === 'number' && Number.isFinite(value))
    );
}

function sanitizeValue(value) {
    if (typeof value === 'string') return truncate(scrubText(value));
    if (isPrimitive(value)) return value;
    if (Array.isArray(value)) {
        const parts = value.filter(isPrimitive);
        return parts.length ? truncate(scrubText(parts.join(','))) : undefined;
    }
    // Objects, null, undefined, NaN, functions: nothing safe to send.
    return undefined;
}

// GA4-style `items: [{ item_id, item_name, price }]` arrays become flat,
// name-free attributes. An item ID that repeats the value of a denied key
// is left out: `purchase` falls back to its transaction_id when it has
// neither a spot ID nor a booking ID.
function flattenItems(items, deniedValues) {
    const flat = { item_count: items.length };
    const ids = items
        .map((item) => item?.item_id)
        .filter(
            (id) =>
                isPrimitive(id) && id !== '' && !deniedValues.has(String(id)),
        );
    if (ids.length) flat.item_id = truncate(scrubText(ids.join(',')));
    const prices = items
        .map((item) => item?.price)
        .filter((price) => price !== null && price !== '')
        .map(Number)
        .filter(Number.isFinite);
    if (prices.length) flat.price = prices.reduce((sum, p) => sum + p, 0);
    return flat;
}

/**
 * Return a copy of `attributes` that is safe to send as New Relic custom
 * attributes: denied keys dropped, strings scrubbed and truncated, arrays
 * of primitives joined, nested objects dropped, and at most
 * `MAX_ATTRIBUTES` entries.
 * @param {Record<string, unknown>} [attributes]
 * @return {Record<string, string|number|boolean>}
 */
export function sanitizeAttributes(attributes) {
    const clean = {};
    if (!attributes || typeof attributes !== 'object') return clean;
    const deniedValues = new Set(
        Object.entries(attributes)
            .filter(([key, value]) => isDeniedKey(key) && isPrimitive(value))
            .map(([, value]) => String(value)),
    );
    for (const [key, value] of Object.entries(attributes)) {
        if (Object.keys(clean).length >= MAX_ATTRIBUTES) break;
        if (isDeniedKey(key)) continue;
        if (key === 'items' && Array.isArray(value)) {
            Object.assign(clean, flattenItems(value, deniedValues));
            continue;
        }
        const safe = sanitizeValue(value);
        if (safe !== undefined) clean[key] = safe;
    }
    return clean;
}

// A new Error with the same name and the given message and stack.
function rebuildError(error, message, stack) {
    const clean = new Error(message);
    clean.name = typeof error.name === 'string' ? error.name : 'Error';
    clean.stack = stack;
    return clean;
}

// The agent also reports `error.cause`, one level deep: an Error cause by
// its message and stack, anything else stringified. Error and string
// causes are kept (scrubbed); other values could hold anything, so they
// are dropped.
function sanitizeCause(cause) {
    if (typeof cause === 'string') return scrubText(cause);
    if (!(cause instanceof Error)) return undefined;
    const message = scrubText(String(cause.message));
    const stack = scrubText(cause.stack);
    if (message === cause.message && stack === cause.stack) return cause;
    return rebuildError(cause, message, stack);
}

/**
 * Scrub an error's message, stack and cause. Returns the original error
 * when nothing needed scrubbing, so identity and extra properties
 * survive; otherwise a new Error with the same name and the scrubbed
 * message, stack and cause. Strings are scrubbed directly.
 * @param {unknown} error
 * @return {unknown}
 */
export function sanitizeError(error) {
    if (typeof error === 'string') return scrubText(error);
    if (!error || typeof error !== 'object') return error;
    const message = typeof error.message === 'string' ? error.message : '';
    const stack = typeof error.stack === 'string' ? error.stack : '';
    const cleanMessage = scrubText(message);
    const cleanStack = scrubText(stack);
    const cleanCause = sanitizeCause(error.cause);
    if (
        cleanMessage === message &&
        cleanStack === stack &&
        cleanCause === error.cause
    ) {
        return error;
    }
    const clean = rebuildError(error, cleanMessage, cleanStack);
    if (cleanCause !== undefined) clean.cause = cleanCause;
    return clean;
}
