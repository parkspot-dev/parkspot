// Barrel export for the shared SEO utilities. Import from "@/utils/seo"
// to get the same metadata builders that the Netlify edge function uses
// for the initial HTML response.

export { areaDisplayName, cityFromSlug, CITIES, AREA_OVERRIDES } from './areas.js';
export { friendlySpotName, parseSpotId } from './spot-id.js';
export { buildAreaPageMeta, buildSpotDetailMeta } from './meta.js';
export { metaPayloadToHead } from './to-head.js';
