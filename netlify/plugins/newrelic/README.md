# New Relic build plugin

A local Netlify build plugin, registered in `netlify.toml`, that hands every
build to the New Relic Browser app the pages report to:

| Event         | What it does                                                                                                                                                                                                                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onPreBuild`  | Sets `NEW_RELIC_SOURCEMAPS=true` for the build command, so `scripts/newrelic/vite-plugin.js` writes a hidden source map next to every chunk: no `sourceMappingURL` comment, so browsers never ask for one.                                                                                                      |
| `onPostBuild` | Uploads the maps to the browser app ([source map API](https://docs.newrelic.com/docs/browser/new-relic-browser/browser-pro-features/upload-source-maps-api/)), then deletes every `.map` file under `assets/` in the publish directory. This runs before the deploy, so the original source is never published. |
| `onSuccess`   | Production deploys only: records a deployment marker through [change tracking](https://docs.newrelic.com/docs/change-tracking/change-tracking-graphql/). Its version is the `application.version` every page reports, which is the first 12 characters of the commit.                                           |

Errors in New Relic then show readable stack traces, and charts show where
each release started. The code lives in `scripts/newrelic/` (`release.js`,
`sourcemaps.js`, `change-tracking.js`), next to the browser agent's.

## Setup

Set these in the Netlify UI (Site configuration > Environment variables):

| Variable                     | Scope                                                                   | Meaning                                                                                                                                                                         |
| ---------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEW_RELIC_API_KEY`          | **Builds** only; mark it as containing secret values if the plan allows | User API key (`NRAK-...`). Without it the plugin uploads and records nothing, and only makes sure no source map is deployed.                                                    |
| `NEW_RELIC_SOURCEMAP_ORIGIN` | Builds                                                                  | Optional. The origin the scripts are served from, when that isn't Netlify's `URL` (production) or `DEPLOY_PRIME_URL` (other contexts), e.g. a custom domain on a branch deploy. |

The browser app itself (account, app ID, browser key) comes from
`.env.production`, the same values the agent is built with.

- **Use a user key.** It acts with its user's permissions, so create it as
  a user who can manage the browser app. A license key (`...NRAL`) or a
  browser key (`NRBR-...`) is refused.
- **Never give the user key the Functions or Runtime scope.** Edge functions
  only need the ingest license key (`NEW_RELIC_LICENSE_KEY`, Functions scope),
  so a leak from them can only send data.
- **Choose the deploy contexts that get it.** Every build that sees the key
  can use it, and that includes a build of someone else's pull request. Give
  it to Production (and the UAT branch) only, unless every pull request
  author is trusted. Without the key, deploy previews keep minified stack
  traces. If the repository takes pull requests from forks, set Netlify's
  sensitive variable policy to "Require approval".

## Deploy contexts

Every context reports to the same browser app, tagged with its own
`environment` (see `scripts/newrelic/build-info.js`).

| Context                                          | Source maps for                   | Deployment marker                                                           |
| ------------------------------------------------ | --------------------------------- | --------------------------------------------------------------------------- |
| `production`                                     | `URL` (`https://www.parkspot.in`) | yes, with the deploy ID as `groupId` and the deploy permalink as `deepLink` |
| `deploy-preview`, `branch-deploy` (UAT included) | `DEPLOY_PRIME_URL`                | no: markers from previews would clutter production's charts                 |
| `netlify build` on a laptop (`IS_LOCAL`)         | none                              | no                                                                          |

New Relic picks the map for a stack frame by the script's full URL, so a
site served from a domain other than the one the maps were uploaded for
keeps minified traces. Set `NEW_RELIC_SOURCEMAP_ORIGIN` for that context.

## When something fails

New Relic problems never block a deploy.

| Problem                                                   | Result                                                                                                                                        |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| No key, or the agent is off (`NEW_RELIC_BROWSER_ENABLED`) | Nothing is uploaded or recorded. Any `.map` file under `assets/` is still deleted.                                                            |
| Key or origin in the wrong shape                          | Warning in the build log, no source maps. After the deploy the plugin is marked as failed, with the reason. The value itself is never logged. |
| Upload fails (wrong key, New Relic unreachable)           | Warning, and the count in the deploy summary. Timeouts, network errors, 429 and 5xx get one retry. The maps are deleted all the same.         |
| `assets/` can't be read, or a source map can't be deleted | **The build fails**, so no map is ever published.                                                                                             |
| Marker fails                                              | The plugin is marked as failed after the deploy; the deploy itself is fine. There is no retry, since a retry could record the deploy twice.   |

## Checking it works

The deploy log has `[newrelic]` lines like these:

```text
[newrelic] hidden source maps on, for https://www.parkspot.in
[newrelic] 45 source maps uploaded, 0 already there, for https://www.parkspot.in
[newrelic] deployment marker for 0123456789ab: <change tracking ID>
```

and the deploy summary has "New Relic source maps: 45 of 45 source maps
uploaded to New Relic, then removed from the deploy".

```bash
# Maps New Relic has for the app (20 by default, at most 500 per call)
curl -s -H "Api-Key: $NEW_RELIC_API_KEY" \
    "https://sourcemaps.service.newrelic.com/v2/applications/1589185089/sourcemaps?limit=50"

# No map was deployed. The SPA fallback in _redirects answers a missing
# file with index.html, so expect text/html, not application/json.
curl -sI https://www.parkspot.in/assets/<chunk>.js.map | grep -i content-type
```

```sql
-- Deployment markers (entity.guid is the browser app's)
FROM ChangeTrackingEvent SELECT *
  WHERE entity.guid = 'NzYyOTAwNXxCUk9XU0VSfEFQUExJQ0FUSU9OfDE1ODkxODUwODk'
  SINCE 1 month ago
-- Errors by release
FROM JavaScriptError SELECT count(*) WHERE environment = 'production'
  FACET application.version SINCE 1 week ago
```

In the UI, markers show up on the browser app's charts, under **Change
tracking** in the app's left nav, and in All Capabilities > Change Tracking.

To look at the maps a build would upload:

```bash
NEW_RELIC_SOURCEMAPS=true npm run build
ls dist/assets/*.map   # delete them before serving dist anywhere
```

## Caveats

- **Locked deploys.** `onSuccess` runs once the deploy is ready, not when it
  is published. With auto publishing locked, the marker marks the build.
- **Retries and rollbacks.** "Retry deploy" builds the same commit again and
  records another marker with the same version and a new `groupId`.
  Publishing an older deploy in the Netlify UI runs no build, so it records
  no marker.
- **Scripts outside `assets/`.** Only Vite's output gets maps. Inline scripts
  (the agent loader, GTM) and files in `public/` keep their own stack traces.
- **EU accounts.** Switch `SOURCEMAP_API` in `scripts/newrelic/sourcemaps.js`
  to `https://sourcemaps.service.eu.newrelic.com` and `NERDGRAPH_API` in
  `scripts/newrelic/change-tracking.js` to `https://api.eu.newrelic.com/graphql`,
  together with the agent's beacon (`vite-plugin.js`) and the edge Log API
  (`netlify/edge-functions/lib/telemetry.js`).
