// Netlify Edge Function: per-URL SEO metadata injection.
//
// For the two URL patterns below the edge function intercepts the SPA
// response, injects route-specific <title>, <meta name="description">,
// <link rel="canonical">, Open Graph tags, and a JSON-LD structured-data
// block into the <head>, then forwards the transformed HTML.
//
// Patterns handled (backward-compatible; any other path passes through):
//   1. /<city>/parking-near-<area>            (city = bangalore | hyderabad)
//   2. /spot-details/<spotId>                 (spotId may contain %23)
//
// Design goals:
//   - Never break the site. Any error, timeout, or unexpected shape causes
//     the original SPA response to be returned unchanged.
//   - Zero impact on unmatched routes (function exits before touching the
//     response body).
//   - No external SDKs. Firebase enhancement uses a plain REST fetch with a
//     short timeout and falls back to template metadata when unavailable.
//   - Observable. Every handled request reports its outcome and timings to
//     New Relic after the response is sent (see lib/telemetry.js).
//
// Registered in netlify.toml via the `path` field on `[[edge_functions]]`.

import { applyMetaToHtml } from './lib/html-rewrite.js';
import { fetchAreaEnhancement } from './lib/firebase-rest.js';
import { buildAreaPageMeta, buildSpotDetailMeta } from './lib/meta.js';
import { startTelemetry } from './lib/telemetry.js';

const AREA_PATH_REGEX = /^\/(bangalore|hyderabad)\/parking-near-[^/]+\/?$/i;
const SPOT_PATH_REGEX = /^\/spot-details\/[^/]+\/?$/i;

// Telemetry names routes like the Vue router does (src/router/routes.js),
// so edge records and browser data facet alike.
const AREA_ROUTE_NAMES = {
    bangalore: 'discover',
    hyderabad: 'discover-hyderabad',
};

export default async (request, context) => {
    let telemetry;
    try {
        const url = new URL(request.url);

        const isAreaPage = AREA_PATH_REGEX.test(url.pathname);
        const isSpotPage = SPOT_PATH_REGEX.test(url.pathname);
        if (!isAreaPage && !isSpotPage) {
            return; // Non-matching path: let Netlify serve normally.
        }

        telemetry = startTelemetry('seo-inject', request, context);
        telemetry.set({
            route_name: isAreaPage
                ? AREA_ROUTE_NAMES[url.pathname.split('/')[1].toLowerCase()]
                : 'spot-detail',
        });

        // Fetch the original SPA shell that would have been served.
        const upstream = await context.next();
        telemetry.set({
            status: upstream.status,
            upstream_ms: telemetry.elapsed(),
        });

        const contentType = upstream.headers.get('content-type') || '';
        if (!contentType.toLowerCase().includes('text/html')) {
            telemetry.finish('not_html');
            return upstream; // Asset / API / redirect -- leave alone.
        }

        const originalHtml = await upstream.text();

        let meta;
        if (isAreaPage) {
            const areaSlug = url.pathname
                .split('/')
                .filter(Boolean)[1]
                ?.replace(/^parking-near-/, '') ?? '';
            const enrichmentStart = telemetry.elapsed();
            const enhancement = await fetchAreaEnhancement(areaSlug);
            telemetry.set({
                enriched: enhancement !== null,
                enrichment_ms: telemetry.elapsed() - enrichmentStart,
            });
            meta = buildAreaPageMeta(url, enhancement);
        } else {
            // Future: look up spot record to enrich name / rate / address.
            meta = buildSpotDetailMeta(url, null);
        }

        const transformed = applyMetaToHtml(originalHtml, meta);

        // Preserve every header from the upstream response (cache, security,
        // etc.) and just swap in the new body.
        const headers = new Headers(upstream.headers);
        headers.delete('content-length'); // Body size is about to change.
        const response = new Response(transformed, {
            status: upstream.status,
            statusText: upstream.statusText,
            headers,
        });
        // applyMetaToHtml hands back the shell untouched when it finds no
        // </head> or a rewrite throws; only this tells that apart from
        // success.
        if (transformed === originalHtml) {
            telemetry.finish('unchanged', { level: 'warn' });
        } else {
            telemetry.finish('injected');
        }
        return response;
    } catch (err) {
        // Last-resort guard: on ANY unexpected error, fall through so the
        // original SPA response is still delivered.
        console.error('[seo-inject] fell through due to error:', err);
        telemetry?.finish('error', { error: err });
        return;
    }
};

// Routes the function handles. Netlify uses these in addition to any paths
// defined in netlify.toml — the union of both is what actually triggers
// the function.
//
// Area paths (`/bangalore/parking-near-:area`,
// `/hyderabad/parking-near-:area`) were removed here when those routes
// migrated to vite-ssg prerender. The handler code above (AREA_PATH_REGEX,
// fetchAreaEnhancement, buildAreaPageMeta) stays in place so a rollback
// only needs to restore the path entries — no code change.
// See `ssg-research/04-integration-plan.md` § 2.4.
export const config = {
    path: [
        '/spot-details/:spotId',
    ],
};
