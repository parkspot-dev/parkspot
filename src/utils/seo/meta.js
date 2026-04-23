// Shared SEO utility: re-exports the pure meta builders from the Netlify
// edge function. Importing from a single place guarantees the metadata the
// user sees on a full-page load (edge-injected) matches what @unhead/vue
// produces on a client-side navigation. See ./areas.js for full rationale.

export {
    buildAreaPageMeta,
    buildSpotDetailMeta,
} from '../../../netlify/edge-functions/lib/meta.js';
