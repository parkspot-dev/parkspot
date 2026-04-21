// Pure functions that turn a parsed URL into the SEO metadata object the
// edge function injects into the HTML response. No I/O, no globals -- so
// these functions can be unit-tested in Node/jsdom without a Deno runtime.

import { areaDisplayName, cityFromSlug } from './areas.js';
import { friendlySpotName, parseSpotId } from './spot-id.js';

const SITE_ORIGIN = 'https://www.parkspot.in';
const BRAND_SUFFIX = 'ParkSpot';
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/assets/og/og-default.jpg`;

/**
 * @typedef {Object} MetaPayload
 * @property {string} title
 * @property {string} description
 * @property {string} canonical
 * @property {string} ogTitle
 * @property {string} ogDescription
 * @property {string} ogUrl
 * @property {string} ogImage
 * @property {string} ogType
 * @property {string} h1           (not injected yet -- reserved for Phase 2)
 * @property {object} jsonLd       (schema.org structured data)
 */

/**
 * @param {URL} url
 * @param {{ sitesCount?: number } | null} enhancement
 * @returns {MetaPayload}
 */
export function buildAreaPageMeta(url, enhancement = null) {
    const [, citySlug, areaPart] = url.pathname.split('/');
    const areaSlug = (areaPart || '').replace(/^parking-near-/, '');
    const cityInfo = cityFromSlug(citySlug) || { display: capitalize(citySlug), state: '' };
    const areaDisplay = areaDisplayName(areaSlug);

    const sitesCount = enhancement && Number.isFinite(enhancement.sitesCount)
        ? enhancement.sitesCount : null;

    const title = `Car Parking near ${areaDisplay}, ${cityInfo.display} — Book Online | ${BRAND_SUFFIX}`;

    const countPhrase = sitesCount && sitesCount > 0
        ? `${sitesCount} verified parking ${sitesCount === 1 ? 'spot' : 'spots'} available. `
        : '';

    const description =
        `${countPhrase}Find and book secure monthly car parking near ${areaDisplay}, ` +
        `${cityInfo.display}. 24/7 access, cashless booking, verified owners. ` +
        `Reserve your spot on ${BRAND_SUFFIX}.`;

    const canonical = `${SITE_ORIGIN}${url.pathname}${url.pathname.endsWith('/') ? '' : '/'}`;

    return {
        title,
        description,
        canonical,
        ogTitle: `Car Parking near ${areaDisplay}, ${cityInfo.display}`,
        ogDescription: description,
        ogUrl: canonical,
        ogImage: DEFAULT_OG_IMAGE,
        ogType: 'website',
        h1: `Car Parking near ${areaDisplay}, ${cityInfo.display}`,
        jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'Place',
            'name': `Parking near ${areaDisplay}, ${cityInfo.display}`,
            'address': {
                '@type': 'PostalAddress',
                'addressLocality': cityInfo.display,
                'addressRegion': cityInfo.state || undefined,
                'addressCountry': 'IN',
            },
            'url': canonical,
        },
    };
}

/**
 * @param {URL} url
 * @param {{ name?: string, address?: string, rate?: number } | null} enhancement
 * @returns {MetaPayload}
 */
export function buildSpotDetailMeta(url, enhancement = null) {
    const segments = url.pathname.split('/').filter(Boolean);
    const rawSpotIdSegment = segments[1] || '';
    const parsed = parseSpotId(rawSpotIdSegment);
    const cityDisplay = parsed.cityDisplay || 'India';
    const friendly = enhancement?.name?.trim() || friendlySpotName(parsed);

    const title = `${friendly} in ${cityDisplay} — Book on ${BRAND_SUFFIX}`;

    const locationClause = enhancement?.address
        ? ` at ${enhancement.address}`
        : ` in ${cityDisplay}`;
    const priceClause = enhancement?.rate
        ? ` Monthly rent from ₹${formatMoney(enhancement.rate)}.`
        : '';

    const description =
        `Book ${friendly}${locationClause}.${priceClause} Secure, verified, cashless ` +
        `parking on ${BRAND_SUFFIX}. 24/7 access and easy online booking.`;

    // Preserve the original (possibly encoded) spot segment so the canonical
    // URL exactly matches what the user / bot requested.
    const canonical = `${SITE_ORIGIN}/spot-details/${rawSpotIdSegment}`;

    return {
        title,
        description,
        canonical,
        ogTitle: `${friendly} in ${cityDisplay}`,
        ogDescription: description,
        ogUrl: canonical,
        ogImage: DEFAULT_OG_IMAGE,
        ogType: 'website',
        h1: `${friendly} in ${cityDisplay}`,
        jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'ParkingFacility',
            'name': friendly,
            'identifier': parsed.id,
            'url': canonical,
            'address': {
                '@type': 'PostalAddress',
                'addressLocality': cityDisplay,
                'addressRegion': parsed.stateDisplay || undefined,
                'addressCountry': 'IN',
            },
            ...(enhancement?.rate
                ? {
                    'priceRange': `₹${formatMoney(enhancement.rate)}/month`,
                }
                : {}),
        },
    };
}

function capitalize(s) {
    if (!s) return '';
    return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}

function formatMoney(n) {
    const num = Number(n);
    if (!Number.isFinite(num)) return String(n);
    return num.toLocaleString('en-IN');
}
