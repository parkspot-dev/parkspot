// Shared SEO utility: re-exports spot-id parsing helpers from the Netlify
// edge function so the client-side meta builder produces identical output
// on SPA navigation. See ./areas.js for the full rationale.

export {
    friendlySpotName,
    parseSpotId,
} from '../../../netlify/edge-functions/lib/spot-id.js';
