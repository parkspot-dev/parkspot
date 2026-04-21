// Maps URL slugs to human-readable display strings used in SEO metadata.
// Keep this file dependency-free so it can be imported from both the
// Netlify Edge Function (Deno runtime) and Vitest unit tests (Node runtime).

export const CITIES = {
    bangalore: { display: 'Bengaluru', state: 'Karnataka' },
    hyderabad: { display: 'Hyderabad', state: 'Telangana' },
};

// Area slug -> display name. Not exhaustive; unknown slugs fall back to a
// title-cased version of the slug itself.
export const AREA_OVERRIDES = {
    'btm': 'BTM Layout',
    'hsr-layout': 'HSR Layout',
    'jp-nagar': 'JP Nagar',
    'jc-nagar': 'JC Nagar',
    'mg-road': 'MG Road',
    'hi-tech-city': 'Hi-Tech City',
    'high-ground': 'High Ground',
    'electronic-city': 'Electronic City',
    'city-market': 'City Market',
    'commercial-street': 'Commercial Street',
    'kempegowda-international-airport': 'Kempegowda International Airport',
    'chandra-layout': 'Chandra Layout',
    'kengeri-gate': 'Kengeri Gate',
    'kempapura-agrahara': 'Kempapura Agrahara',
    'jeevan-bima-nagar': 'Jeevan Bima Nagar',
    'mico-layout': 'Mico Layout',
};

/**
 * Convert an area slug (e.g. "hsr-layout" or "marathahalli") into a
 * human-readable display name (e.g. "HSR Layout", "Marathahalli").
 * @param {string} slug
 * @returns {string}
 */
export function areaDisplayName(slug) {
    if (!slug) return '';
    const normalized = String(slug).toLowerCase().trim();
    if (AREA_OVERRIDES[normalized]) return AREA_OVERRIDES[normalized];
    return normalized
        .split('-')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

/**
 * @param {string} slug
 * @returns {{display: string, state: string} | null}
 */
export function cityFromSlug(slug) {
    if (!slug) return null;
    return CITIES[String(slug).toLowerCase().trim()] || null;
}
