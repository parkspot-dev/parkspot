# Vendored New Relic Browser loader

`nr-loader-spa-<version>.min.js` is the standalone SPA loader that New
Relic publishes on its CDN. `../vite-plugin.js` inlines it into
`index.html` at build time, together with the `NREUM` config.

| File | Source |
| --- | --- |
| `nr-loader-spa-1.323.0.min.js` | https://js-agent.newrelic.com/nr-loader-spa-1.323.0.min.js |
| `nr-loader-spa-1.323.0.min.js.LICENSE.txt` | https://js-agent.newrelic.com/nr-loader-spa-1.323.0.min.js.LICENSE.txt |
| `LICENSE` | Apache License 2.0, from the `@newrelic/browser-agent` npm package |

## Why it is vendored

- **Copy/paste parity.** The npm package (`@newrelic/browser-agent`) only
  ships sources for bundlers. Bundling those into the app would start
  the agent after the app bundle has loaded, too late for errors thrown
  while the page boots (failed chunk loads included). The CDN loader is
  exactly what New Relic's copy/paste snippet contains: a standalone
  script that runs inline in the head, ahead of the app.
- **Reviewed upgrades.** A pinned file in git means the agent only
  changes through a reviewed commit. The plugin checks the file against
  `LOADER_SHA256` on every build, so a stray edit (including a
  reformat by Prettier, which is why this folder is in
  `.prettierignore`) fails the build instead of shipping.

At runtime the loader fetches the rest of the agent from
`js-agent.newrelic.com` (`nr-spa-<version>.min.js`, plus
`nr-spa-recorder-<version>.min.js` for session replay), always at the
loader's own version.

## Upgrading

1. Read the release notes for every version in between:
   https://docs.newrelic.com/docs/release-notes/new-relic-browser-release-notes/browser-agent-release-notes/
   Look for changed `init` defaults and for new features that collect
   data by default: on the free tier every new event type counts
   against the monthly ingest, so `resolveAgentConfig()` in
   `../vite-plugin.js` may need to turn them off. For session replay,
   check that `pauseReplay()` still stops a recording for the rest of the
   session, and that `[data-nr-block]` is still the default block
   selector: the routes and elements kept out of replays rely on both.
2. Download the loader and its license notice, and remove the old ones:
   ```sh
   v=1.324.0
   cd scripts/newrelic/vendor
   curl -fsSLO "https://js-agent.newrelic.com/nr-loader-spa-$v.min.js"
   curl -fsSLO "https://js-agent.newrelic.com/nr-loader-spa-$v.min.js.LICENSE.txt"
   shasum -a 256 "nr-loader-spa-$v.min.js"
   ```
3. Set `LOADER_VERSION` and `LOADER_SHA256` in `../vite-plugin.js`, and
   update the table above.
4. Run `npm run test:unit` and `npm run build`, then check that
   `dist/index.html` contains the new loader. After deploying, check in
   New Relic that the browser app reports the new agent version.
