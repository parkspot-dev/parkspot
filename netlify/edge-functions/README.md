# SEO Injection Edge Function

Per-URL `<title>`, `<meta description>`, `<link rel="canonical">`, Open Graph
and JSON-LD metadata injection for two URL patterns, without moving off the
current Vue 3 + Vite SPA architecture.

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

| URL pattern                               | Example                                                      |
|-------------------------------------------|--------------------------------------------------------------|
| `/bangalore/parking-near-<area>`          | `/bangalore/parking-near-marathahalli/`                      |
| `/hyderabad/parking-near-<area>`          | `/hyderabad/parking-near-hitech-city/`                       |
| `/spot-details/<spotId>`                  | `/spot-details/HYD%23REQ%23104` (decodes to `HYD#REQ#104`)   |

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
    └── firebase-rest.js    # Optional RTDB enhancement (timeout-bounded)
```

Pure modules (every file under `lib/` except `firebase-rest.js`) are
side-effect-free and covered by Vitest unit tests in
`tests/edge-functions/`.

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

## Future enhancements (out of scope for this PR)

- Enrich `/spot-details/*` metadata by looking up the exact spot record in
  RTDB (currently we only generate a template title -- enhancement hooks for
  this are already stubbed in `meta.js`).
- Inject an SEO-only `<h1>` before `<div id="app">` (the `h1` field is
  already on the `MetaPayload` object; only the HTML rewriter is gated).
- Add a per-URL `og:image` (e.g. a static map thumbnail of the area / spot).
- Replace this whole function with a real SSR setup (Nuxt 3 or `vite-ssg`).
