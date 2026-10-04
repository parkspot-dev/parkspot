# SEO Injection Edge Function

Per-URL `<title>`, `<meta description>`, `<link rel="canonical">`, Open Graph
and JSON-LD metadata injection.

## Status (2026-05-22)

This function originally handled three URL patterns. After the vite-ssg
migration (Phase 1 + Phase 2 in `ssg-research/`), **area pages**
(`/bangalore/parking-near-*`, `/hyderabad/parking-near-*`) are now fully
prerendered at build time and no longer need edge-side rewriting. The
function is currently bound only to `/spot-details/*`, which remains
SPA + edge-injected head until Phase 3 prerenders that pattern too.

The area-page handler code (`AREA_PATH_REGEX`, `fetchAreaEnhancement`,
`buildAreaPageMeta`) is intentionally retained as a rollback escape
hatch — adding two `[[edge_functions]]` entries back to `netlify.toml`
restores the previous behaviour without any code change. See
`ssg-research/04-integration-plan.md` § 2.4 (area retirement) and § 3.5
(spot-detail safety net).

## Why

ParkSpot currently ships a pure client-rendered SPA. Every URL returns the
same `index.html` shell with the same default `<title>` and `<meta
description>`. Search-engine crawlers, social-share bots, Google Ads quality
scoring, and Dynamic Search Ad (DSA) page feeds all rely on the initial HTML
response -- content injected by the client-side app after hydration does not
count.

Migrating to full SSR (Nuxt 3 or `vite-ssg`) is the long-term fix. This edge
function is a short-term, additive step that gives us **~80% of the SEO value
for ~5% of the engineering cost**: rewrite the `<head>` at the Netlify edge
before the byte stream leaves the CDN.

## Paths handled

| URL pattern              | Example                                                    | Current owner |
|--------------------------|------------------------------------------------------------|---------------|
| `/spot-details/<spotId>` | `/spot-details/HYD%23REQ%23104` (decodes to `HYD#REQ#104`) | **Edge function** (until Phase 3) |
| ~~`/bangalore/parking-near-<area>`~~ | ~~`/bangalore/parking-near-marathahalli/`~~ | vite-ssg prerender (Phase 2) |
| ~~`/hyderabad/parking-near-<area>`~~ | ~~`/hyderabad/parking-near-hitech-city/`~~  | vite-ssg prerender (Phase 2) |

Every other URL is **completely untouched** -- the edge function returns
early before calling `context.next()`.

## Backward-compatibility guarantees

1. `netlify.toml` is additive. No `[build]` block is declared, so the Netlify
   UI's build command and publish directory stay authoritative.
2. `_redirects` (`/* /index.html 200`) is unchanged; the SPA fallback still
   owns every non-matched route.
3. If the upstream response isn't `text/html`, the edge function returns it
   verbatim.
4. If the response body is missing `</head>` (i.e. not our shell), the
   rewriter returns the input unchanged.
5. Any error -- JSON parse failure, Firebase REST timeout, unexpected HTML
   shape -- causes the function to fall through and the browser receives the
   original SPA response.
6. Client-side routing and hydration are unaffected: the `<div id="app">`
   node and all existing body content / scripts are preserved byte-for-byte.
7. The existing LocalBusiness JSON-LD block in `index.html` is preserved; a
   **second, route-scoped** JSON-LD block is appended alongside it.
8. Telemetry (see [below](#telemetry-new-relic)) is posted after the
   response through `context.waitUntil`, with its own timeout, and never
   throws: a missing key or a New Relic outage changes nothing for visitors.

## Files

```
netlify/edge-functions/
├── seo-inject.js           # Entry point registered in netlify.toml
├── README.md               # This file
└── lib/
    ├── areas.js            # City / area slug display-name maps
    ├── spot-id.js          # Parsing for "HYD#REQ#104"-style spot IDs
    ├── meta.js             # Pure builders that return MetaPayload objects
    ├── html-rewrite.js     # Pure string transforms on the HTML shell
    ├── firebase-rest.js    # Optional RTDB enhancement (timeout-bounded)
    └── telemetry.js        # New Relic log record per handled request
```

Pure modules (every file under `lib/` except `firebase-rest.js` and
`telemetry.js`) are side-effect-free and covered by Vitest unit tests in
`tests/edge-functions/`. The two that talk to the network take a
`fetchImpl` for their tests, and `seo-inject.spec.js` runs the handler end
to end with Netlify's runtime stubbed out.

## Telemetry (New Relic)

No New Relic agent runs on the Deno edge, so `lib/telemetry.js` turns each
handled request into one log record and posts it to the
[New Relic Log API](https://docs.newrelic.com/docs/logs/log-api/introduction-log-api/)
with a plain `fetch`. Unmatched paths report nothing.

Env vars, set in the Netlify UI with the **Functions** scope. Values in
`netlify.toml` never reach edge functions.

| Variable | Default | Meaning |
|----------|---------|---------|
| `NEW_RELIC_LICENSE_KEY` | unset: nothing is sent | Ingest license key. Not the browser key, and not a user API key. |
| `NEW_RELIC_ENVIRONMENT` | the deploy context (`production`, `deploy-preview`, `branch-deploy`) | Environment tag. Set it to `uat` as a branch-specific value for the UAT branch: the `[context.uat.environment]` entry in `netlify.toml` only reaches the build (the browser agent). |
| `NEW_RELIC_EDGE_SAMPLE_RATE` | `1` | Share of `info` records to send, 0 to 1. `warn` and `error` records are always sent. |

Each record has the common attributes `service.name` (`parkspot-edge`),
`environment`, `deploy_id` and `edge_region`, and these per-request ones:

| Attribute | Meaning |
|-----------|---------|
| `edge_function` | `seo-inject` |
| `outcome` / `level` | `injected` / `info`, `not_html` / `info`, `unchanged` / `warn` (no `</head>` in the shell, or a rewrite failed), `error` / `error` (fell through) |
| `route_name` | Vue router route name: `spot-detail`, `discover`, `discover-hyderabad` |
| `status` | Upstream (SPA shell) status |
| `upstream_ms`, `duration_ms` | Time until `context.next()` resolved, and until the response was ready |
| `enriched`, `enrichment_ms` | Area pages only: whether the RTDB lookup found the area, and how long it took |
| `client` | User-agent class: `googlebot`, `google-ads`, `bingbot`, `facebook`, `whatsapp`, `telegram`, `twitter`, `linkedin`, `slack`, `other-bot`, `browser` or `none` |
| `request_id` | Netlify request ID, to find the request in the Edge Functions log |
| `sample_rate` | Each record stands for `1 / sample_rate` requests |
| `error.class`, `error.message`, `error.stack` | `error` records only |

Records carry no URL, user agent, IP or geo data. Attributes go through the
browser app's PII rules (`src/telemetry/sanitize.js`), and so does error text:
query strings, emails, phone and Aadhaar numbers, and tokens are masked; paths
are kept.

A record is about 0.5 KB (1-2 KB with a stack trace), so 100,000 requests
a month cost about 0.05 GB of the free tier's 100 GB. The work fits in
Netlify's 50 ms CPU budget per request, which also covers `waitUntil` work.

```sql
-- Outcomes over time (sampling-aware)
FROM Log SELECT sum(1 / sample_rate) WHERE service.name = 'parkspot-edge'
  FACET outcome TIMESERIES
-- Latency by client class
FROM Log SELECT percentile(duration_ms, 50, 95)
  WHERE service.name = 'parkspot-edge' FACET client
-- Recent failures
FROM Log SELECT request_id, error.class, error.message
  WHERE service.name = 'parkspot-edge' AND level != 'info' SINCE 1 day ago
```

If records stop arriving, look for `[newrelic]` lines in the Edge Functions
log: `the Log API answered 403` means a wrong key; the key itself is never
logged.

## Local testing

```bash
# Run just the edge-function unit tests.
npx vitest run tests/edge-functions

# End-to-end against a local Netlify dev server (requires netlify-cli).
npx netlify dev
curl -s http://localhost:8888/bangalore/parking-near-marathahalli/ \
    | grep -Ei '<title>|meta name="description"|rel="canonical"'
curl -s http://localhost:8888/spot-details/HYD%23REQ%23104 \
    | grep -Ei '<title>|meta name="description"|rel="canonical"'
```

## Acceptance checklist (post-deploy)

- [ ] `curl https://www.parkspot.in/spot-details/HYD%23REQ%23104 | grep '<title>'`
      returns a title containing `Hyderabad` and `#104`.
- [ ] `curl https://www.parkspot.in/bangalore/parking-near-marathahalli/ | grep '<title>'`
      returns a title containing `Marathahalli` and `Bengaluru`.
- [ ] Two spot URLs return **different** HTML bodies when their spot IDs differ.
- [ ] Two area URLs return **different** canonical links.
- [ ] `curl https://www.parkspot.in/` (home) returns the original default title
      -- the edge function must not run on non-matching paths.
- [ ] The [Rich Results Test](https://search.google.com/test/rich-results)
      validates the JSON-LD on both URL patterns.
- [ ] WhatsApp / Slack link unfurls show per-URL `og:title` and
      `og:description`.
- [ ] Googlebot (URL Inspection in Search Console) sees the route-specific
      title, not the generic shell title.
- [ ] With `NEW_RELIC_LICENSE_KEY` set, the spot-detail `curl` above shows
      up in New Relic within a minute:
      `FROM Log SELECT * WHERE service.name = 'parkspot-edge' SINCE 10 minutes ago`
      returns an `injected` record with `client` = `other-bot`.

## Future enhancements (out of scope for this PR)

- Enrich `/spot-details/*` metadata by looking up the exact spot record in
  RTDB (currently we only generate a template title -- enhancement hooks for
  this are already stubbed in `meta.js`).
- Inject an SEO-only `<h1>` before `<div id="app">` (the `h1` field is
  already on the `MetaPayload` object; only the HTML rewriter is gated).
- Add a per-URL `og:image` (e.g. a static map thumbnail of the area / spot).
- Replace this whole function with a real SSR setup (Nuxt 3 or `vite-ssg`).
