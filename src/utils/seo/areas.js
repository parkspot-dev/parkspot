// Shared SEO utility: re-exports the city / area slug helpers used by the
// Netlify edge function so the Vue client can build **identical** metadata
// on SPA route changes. Keeping a single source of truth prevents drift
// between the server-injected <head> (initial HTML) and the client-side
// updates produced by @unhead/vue.
//
// NOTE: the physical implementation still lives under netlify/edge-functions
// because it was placed there before this refactor. We re-export instead of
// moving the file to avoid touching the already-deployed edge function.

export {
    AREA_OVERRIDES,
    CITIES,
    areaDisplayName,
    cityFromSlug,
} from '../../../netlify/edge-functions/lib/areas.js';
