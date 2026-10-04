# New Relic reporting

What the web app reports to New Relic, how to read it, what to do when an
alert fires, and how to add to it. Everything goes to account `7629005`.
Browser data belongs to the browser app `1589185089` (entity GUID
`NzYyOTAwNXxCUk9XU0VSfEFQUExJQ0FUSU9OfDE1ODkxODUwODk`).

| Part              | Reports                                                                                                                                     | Code                                                                                                         | Setup                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Browser agent     | Page views, web vitals, AJAX calls, route changes, JavaScript errors, PageActions and logs from every page; replays of sessions with errors | `scripts/newrelic/vite-plugin.js` injects and configures the agent; `src/telemetry/` is what the app reports | `.env.production`, the browser app's settings ([list](terraform/README.md#set-in-the-new-relic-ui-not-here)) |
| Edge functions    | One log record per request `seo-inject` handles                                                                                             | `netlify/edge-functions/lib/telemetry.js`                                                                    | [`netlify/edge-functions/README.md`](../../netlify/edge-functions/README.md#telemetry-new-relic)             |
| Build plugin      | Source maps for every deploy, and a deployment marker for each production deploy                                                            | `netlify/plugins/newrelic/`, `scripts/newrelic/`                                                             | [`netlify/plugins/newrelic/README.md`](../../netlify/plugins/newrelic/README.md)                             |
| Terraform         | Alerts, service levels, the "ParkSpot web" dashboard, where alerts go                                                                       | `observability/newrelic/terraform/`                                                                          | [`terraform/README.md`](terraform/README.md)                                                                 |
| Maya (Go backend) | Nothing yet                                                                                                                                 |                                                                                                              | [Maya backend contract](#maya-backend-contract)                                                              |

## Environments and releases

Every event carries `environment`, so one browser app serves every deploy:

| `environment`    | Where from                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| `production`     | www.parkspot.in                                                                                   |
| `uat`            | The UAT branch deploy (`NEW_RELIC_ENVIRONMENT` in `netlify.toml`, and in the Netlify UI for edge) |
| `deploy-preview` | Pull request previews                                                                             |
| `branch-deploy`  | Other branch deploys                                                                              |
| `local`          | `npm run build` on a laptop. `npm run dev` has no agent.                                          |

`application.version` is the first 12 characters of the commit
(`scripts/newrelic/build-info.js`); builds outside Netlify have none.
Production deploys record a deployment marker with the same version, so
charts show where each release started. Always filter on `environment`
(the dashboard's picker does it): otherwise previews and UAT mix with
production.

## Reporting from the app

Every call goes through `@/telemetry`, never `window.newrelic` directly.
It scrubs PII, reports an error object only once, and does nothing during
SSR, when the agent is off, or when an ad blocker removed it.

```js
import { NR_EVENTS, reportError, trackEvent } from '@/telemetry';

try {
    await loadSomething();
} catch (error) {
    reportError(error, { source: 'payment_status' });
}

trackEvent(NR_EVENTS.PAYMENT_STATUS, { status: 'paid' });
```

| Function                                | For                                                                                                                     |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `reportError(error, attributes)`        | An error the app catches and recovers from. Uncaught errors and unhandled rejections are collected by the agent itself. |
| `trackEvent(name, attributes)`          | A business event (PageAction). Use a name from `NR_EVENTS`.                                                             |
| `log(level, message, attributes)`       | A log line. Kept only at or above the browser app's API logging level (Warn).                                           |
| `setAttribute(name, value, persist)`    | A page-level attribute added to every later event. `null` removes it.                                                   |
| `setUser(uid, { role })`, `clearUser()` | The signed-in user, by Firebase UID only. Called by the user store; a different user starts a new agent session.        |
| `setRouteName(name)`                    | Called by the Vue plugin (`src/telemetry/vue.js`) on every route change.                                                |
| `enableSessionReplay()`                 | Called by the cookie notice (`OrganismConsentNotice.vue`) once it is acknowledged.                                      |

`src/utils/logger.js` stays for existing call sites: `logger.error` is
`reportError`, `logger.warn` and `logger.info` are `log`, `logger.event` is
`trackEvent`.

Three rules:

1. **Give every reported error a `source`**, from the table below. The
   dashboards count errors without one as uncaught.
2. **Attributes are low-cardinality context:** status codes, endpoint
   patterns, route names, enum values. Never user data or raw URLs, and no
   IDs except the pseudonymous ones the facade sets itself.
3. **Add names before using them:** an event to `src/telemetry/events.js`,
   a source to the table below. Dashboards and alerts query these names.

What `src/telemetry/sanitize.js` does to attributes, whatever the caller
passes: keys that name personal or secret data are dropped (see
[Privacy](#privacy)), strings are scrubbed and cut to 256 characters,
arrays of plain values are joined with commas, GA4 `items` become
`item_count`, `item_id` and `price` (the sum), objects are dropped, and at
most 48 attributes are kept.

## Events and attributes

### On every browser event

| Attribute             | Set by                                  | Value                                                                                                  |
| --------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `environment`         | The build                               | See [Environments and releases](#environments-and-releases)                                            |
| `application.version` | The build                               | First 12 characters of the commit; missing outside Netlify                                             |
| `enduser.id`          | `setUser()`, kept for the session       | Firebase UID of the signed-in user                                                                     |
| `user_role`           | `setUser()`, kept for the session       | `admin`, `agent`, the user type in the Maya profile, or `unknown`                                      |
| `route_name`          | The Vue plugin, after each route change | The route's name in `src/router/routes.js`, else its path pattern (`/spot-details/:id`), never the URL |

`route_name` reaches the events recorded after the first route change; the
first page view of a load can miss it. New Relic's own attributes (`session`,
`deviceType`, `userAgentName`, `pageUrl`, `countryCode` and more) come on
top. `pageUrl` is reserved: don't set it as a custom attribute.

### JavaScriptError

Uncaught errors, unhandled rejections and `reportError()` calls. Each
reported error has a `source`:

| `source`           | Reported by                                                                         | Other attributes                                                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| none               | The agent: uncaught errors and unhandled rejections                                 |                                                                                                                                       |
| `vue`              | Vue's `errorHandler`: render, watcher and lifecycle errors (`src/telemetry/vue.js`) | `vue_info` (the hook, or the code from Vue's error reference), `component`                                                            |
| `router`           | `router.onError`: lazy route chunks that failed to load, guard exceptions           |                                                                                                                                       |
| `maya`             | The Maya client's error interceptor (`src/services/api.js`)                         | `status` (0: no answer), `error_code` (axios's code when there was no answer), `method`, `endpoint` (`/booking/:id/payments`), `ptid` |
| `http`             | `BaseApiService.handleErrors`, for the other API clients                            | `context`, `url`                                                                                                                      |
| `payment_validate` | `PagePaymentGateway.vue`, checking the payment link                                 |                                                                                                                                       |
| `payment_status`   | `PagePaymentGateway.vue`, fetching the payment status                               |                                                                                                                                       |
| `auth_bootstrap`   | The user store, loading the signed-in user's data from Maya                         |                                                                                                                                       |
| `auth_listener`    | The user store's Firebase auth listener                                             |                                                                                                                                       |
| `google_sign_in`   | The user store's Google sign-in. A closed or replaced popup isn't reported.         |                                                                                                                                       |

A Maya call without an answer has `status` 0 and one of two codes:
`ECONNABORTED` is the 10-second timeout, or the browser dropping the
request (message "Request aborted", for example when the visitor leaves the
page). `ERR_NETWORK` is a failed request, or an answer the browser withheld
because it had no CORS headers. `ptid` is a random ID per browser tab, to
tell tabs of one session apart.

`src/telemetry/error-filter.js` decides what the agent keeps:

- **Dropped:** "ResizeObserver loop" notices, cross-origin "Script error.",
  Google sign-in popups closed or replaced by the visitor, errors from
  browser extensions, and any one message past 20 times within a minute in
  a tab.
- **Grouped** in Errors Inbox under one fingerprint: `chunk-load` (a tab
  open across a deploy asks for chunks that no longer exist) and `network`
  (the visitor's connection failed).

The agent folds identical errors of one harvest into one event, so
`count(*)` undercounts repeats. To count people, use
`uniqueCount(session)`.

### PageAction

`actionName` is the event's name.

| `actionName`     | When                                                                                     | Attributes                                                                                                                                             |
| ---------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `payment_status` | The Cashfree return leg on `/payment/*`, once the page knows how the payment went        | `status`: `paid`, `pending`, `failed` or `unknown`; `error_code` with `failed`; `order_status` (Maya's raw `Status`) when the page didn't recognise it |
| Analytics events | Every `track()` call for one of `FORWARDED_ANALYTICS_EVENTS` (`src/telemetry/events.js`) | The call's own parameters, scrubbed: see below                                                                                                         |

The forwarded analytics events are `funnel_view`, `form_start`,
`form_error`, `form_submit_attempt`, `image_upload_start`,
`image_upload_complete`, `generate_lead`, `lead_confirmed`, `search`,
`view_search_results`, `select_item`, `view_item`, `begin_checkout`,
`payment_initiated`, `purchase` and `purchase_confirmed`. `page_view`,
`view_item_list`, `identify` and `set_user_property` aren't: the agent
covers page views, the list views are many and say little, and the user is
set with `setUser()`. Only what the call site passes is forwarded, not
GA4's page defaults or the ad attribution (`gclid`, `utm_*`). What can
arrive:

| Attribute                        | Meaning                                                                                                                                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `funnel_name`                    | `booking`, `contact`, `so_register` (parking owner sign-up) or `vo_lead` (parking request)                                                                                                          |
| `step_index`                     | The step's position in its funnel                                                                                                                                                                   |
| `error_fields`                   | `form_error`: the names of the fields that failed validation, comma-separated                                                                                                                       |
| `image_count`, `duration_ms`     | Image uploads                                                                                                                                                                                       |
| `lead_type`                      | `parking_seeker`, `parking_owner`, `contact`, `tentative_booking_auth` or `tentative_booking_guest`                                                                                                 |
| `value`, `currency`              | Amount and currency of a lead, a checkout or a payment                                                                                                                                              |
| `expected_rent`                  | The parking owner's expected rent (`so_register`)                                                                                                                                                   |
| `item_price`                     | Booking leads: the spot's rate, apart from the lead's `value`                                                                                                                                       |
| `payment_provider`               | `payment_initiated`                                                                                                                                                                                 |
| `item_count`, `item_id`, `price` | From GA4's `items`: how many, their IDs (usually spot IDs) comma-separated, and the sum of their prices. Never item names. `view_search_results` passes `item_count` itself: the number of results. |

Dropped on the way: `transaction_id` (Maya's booking ID on leads; on
payments it can carry the payment link's `p` value, or Cashfree's order
ID), `search_term` (a raw "lat,lng"), and `enhanced_conversion_data`
(email and phone for Google Ads). So `search` arrives with no attributes.
An item ID that repeats a dropped value is left out too: `purchase` falls
back to the transaction ID for its item ID when it has neither a spot ID
nor a booking ID.

The booking funnel runs from a spot page to the confirmation, and the
payment part often happens in a later session (the payment link is sent
once the booking is accepted). Its dashboard funnels count sessions, so
read the two halves separately.

### Log

Browser log lines from `log()`, with the browser app's API logging level at
Warn: the `[PSAuthKey Error]` warnings of the user store
(`src/store/user/index.js`) and of the Maya client (`src/services/api.js`,
with the method and the endpoint pattern). The text is scrubbed like error
messages and cut at 1,024 characters. Automatic console capture stays off:
raw `console.log` calls in the app print API answers.

Edge records are `Log` events too, with `service.name = 'parkspot-edge'`;
their attributes are listed in
[`netlify/edge-functions/README.md`](../../netlify/edge-functions/README.md#telemetry-new-relic).
`sample_rate` says how many requests each `info` record stands for, so
count them with `sum(1 / sample_rate)`.

### Collected by the agent

| Event                 | Notes                                                                                                                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PageView`            | One per full page load. `duration` and `backendDuration` are in seconds.                                                                                                                                         |
| `PageViewTiming`      | Web vitals, in **seconds** (`largestContentfulPaint` 2.5, not 2500); CLS has no unit. The agent adds the CLS so far to every timing: use `timingName = 'pageHide'` for one value per page load.                  |
| `BrowserInteraction`  | Route changes (with `route_name` as their name) and the initial load. The text of a click is kept only when it changed the route, and goes through the obfuscation rules.                                        |
| `AjaxRequest`         | XHR and fetch calls, except the analytics beacons on the deny list in `vite-plugin.js`. Bodies are never captured. Aborted requests aren't recorded. `requestUrl` has its query string removed by the agent.     |
| `UserAction`          | Clicks, key presses, copy, paste and scrolls, grouped by element, with rage, dead and error clicks flagged ("Frustrated clicks" on the dashboard). The element's tag, `id`, class and type only, never its text. |
| `ChangeTrackingEvent` | Deployment markers, production only, from the build plugin.                                                                                                                                                      |

## Privacy

None of this reaches New Relic, from the app or from the edge:

| Data                                             | Kept out by                                                                                                                                                                                               |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phone numbers and emails                         | Denied keys (`phone`, `mobile`, `email`, `cno`), and masked in any text: error messages, stacks, logs, URLs                                                                                               |
| Names                                            | Denied keys (`name`, `fullname`, `ownername`, `itemname` and the like)                                                                                                                                    |
| Vehicle numbers                                  | Denied keys (`vehicle`, `vehicleno`, `regno` and the like)                                                                                                                                                |
| Payment links, order and transaction IDs, hashes | Denied keys (`p`, `h`, `orderid`, `transactionid`, `hash`), and an item ID that repeats one of them is left out. Query strings and fragments are removed from URLs in any text, absolute or root-relative |
| UPI, bank and IFSC details, the UPI QR link      | Denied keys (`upi`, `upiurl`, `vpa`, `ifsc`, `bankaccount` and the like)                                                                                                                                  |
| KYC images and other uploads                     | Denied keys (`image`, `photo`, `file`, `document`, `blob`, `selfie`, `base64`, `aadhaar`); `data:` URLs and long base64 runs are masked; AJAX bodies are never captured                                   |
| Aadhaar numbers                                  | Denied keys (`aadhaar`, `idnumber`), and masked in any text: twelve digits, run together or in groups of four                                                                                             |
| Tokens: JWTs, `PSAuthKey`, Azure SAS tokens      | Denied keys (`token`, `authkey`, `sas`, `signature`); JWTs masked in text; SAS tokens live in query strings, which are removed                                                                            |
| Precise location and addresses                   | Denied keys (`lat`, `lng`, `latlng`, `searchterm`, and any key with `address` in it); the search box's text is masked in Mapbox geocoding paths                                                           |
| Ad identifiers and IP addresses                  | Denied keys (`gclid`, `gbraid`, `wbraid`, `enhanced_conversion_data`, `user_properties`, `ip`)                                                                                                            |
| Usernames in Maya paths                          | `auth/user/<username>/...` is masked                                                                                                                                                                      |

The same text rules are the agent's `init.obfuscate` setting, so what it
collects by itself (uncaught errors, AJAX and page URLs, click text) is
masked the same way. `enduser.id` (the Firebase UID), `ptid` and the
agent's `session` are pseudonymous IDs.

**Session replay** records only sessions with an error (the browser app's
sampling: 0% of all sessions, 100% of sessions with errors), only starts
once the visitor has acknowledged the cookie notice, and masks all text and
every input. The obfuscation rules don't apply to the replayed page; the
masking does, so never turn it off. Masking doesn't cover everything:

- **The page URL.** A replay keeps the full URL, query string included.
  Payment links (`p` and `h`), the thank-you page after a payment (`t`,
  the transaction ID) and the internal tools (`?mobile=`) carry data from
  the table above there, so their routes are kept out of replays with
  `meta: { sessionReplay: false }` in `src/router/routes.js`. The router
  guard in `src/telemetry/vue.js` pauses replay before such a page renders,
  and replay then stays off for the rest of the visitor's session.
- **Attributes and pixels.** Image sources, link targets and canvas pixels
  are recorded as they are. Anything inside `data-nr-block` is recorded as
  an empty box instead: the pending-payments QR code (the owner's UPI ID or
  bank account), the profile photo, upload previews (`data:` URLs of the
  photos) and KYC document previews. Block any new canvas, image or video
  that shows personal data the same way.

Known gaps, checked and accepted:

- **Click text.** `BrowserInteraction` keeps the obfuscated text of clicks
  that changed the route. These are labels of links and buttons.
- **Map tiles.** Mapbox tile requests keep the tile's coordinates in their
  path: the area on the screen, not the visitor's position.
- **Console capture.** Turning on automatic console capture in the browser
  app would send raw `console.log` output, API answers included. Keep it
  off.
- **Relative URLs.** Query strings are removed from absolute URLs and from
  paths that start with `/`, not from relative ones
  (`sites-and-spot-requests?mobile=...`). Report endpoint patterns
  (`endpointOf()` in `src/services/api.js`), never request URLs.
- **Searched places in replays.** A replay of the search results page keeps
  its URL, and with it the coordinates of the place searched for
  (`?latlng=`): where the visitor looked, not where they are. To keep the
  page out of replays, mark the `srp` route like the internal tools.
- **The first seconds of a replay.** The agent acts on a pause only once
  its replay code has loaded, shortly after replay starts. If an error has
  already turned on a full recording and the visitor opens an opted-out page
  in that time, what was recorded until then is sent first. The page's
  content is an empty box (`data-nr-block` on `<html>`), but its URL can be
  in the recording.

## Service levels

Over a rolling 28 days, all on the browser app (`terraform/service-levels.tf`):

| Key                    | Service level           | Target | Counts                                                                                 | Burn alerts                                     |
| ---------------------- | ----------------------- | ------ | -------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `browser_availability` | Browser availability    | 99%    | Page views; bad: the first JavaScript error of a session, unless it reports a Maya 4xx | yes                                             |
| `lcp`                  | LCP good                | 75%    | Page loads; good: LCP up to 2.5 s                                                      | no, see `lcp_p75`                               |
| `inp`                  | INP good                | 75%    | Pages; good: INP up to 0.2 s                                                           | no, see `inp_p75`                               |
| `cls`                  | CLS good                | 75%    | Pages; good: CLS up to 0.1 when first hidden                                           | no, see `cls_p75`                               |
| `maya_availability`    | Maya API availability   | 99.5%  | Maya calls from the browser; bad: 5xx answers and timeouts                             | yes                                             |
| `payment_resolution`   | Payment status resolved | 99%    | `payment_status` events; bad: `unknown`                                                | no, `payment_status_unknown` fires on the first |

Browser availability only counts each session's first error: a session
whose first error is a Maya 4xx answer isn't counted even if a crash
follows (the JavaScript error rate alert still sees the crash). Maya
availability doesn't count network failures, most of which are visitors
going offline, nor 5xx answers without CORS headers, which reach the
browser as network failures (see the [contract](#maya-backend-contract)).

## Runbooks

Every alert links to its section here. The alert policy is
`ParkSpot web (<environment>)`; the queries below are for production, so
change `environment` for UAT. The dashboard is "ParkSpot web"
(`terraform output dashboard_url`).

To roll back a release, publish the previous deploy in Netlify (Deploys,
then the deploy, then "Publish deploy"). It runs no build, so it records no
deployment marker: note it in the incident.

### `js_error_rate`

**JavaScript errors per page view** went more than 3 standard deviations
above the baseline New Relic learned for this time of the day and week, for
15 minutes.

1. On the dashboard's Errors page, look at "Top errors" and "Errors by
   release". An error that starts with a release points at that release.
2. Open the top group in Errors Inbox: the stack trace is mapped to source
   if the deploy uploaded its source maps.
3. A `chunk-load` group after a deploy is tabs that were open across it.
   It fades as they reload; nothing to fix unless it lasts.
4. Errors with `source = 'maya'`: see [`maya_availability`](#maya_availability).

```sql
FROM JavaScriptError SELECT count(*), uniqueCount(session)
  WHERE environment = 'production' FACET errorMessage, source SINCE 1 hour ago
FROM JavaScriptError SELECT uniqueCount(session)
  WHERE environment = 'production' FACET application.version TIMESERIES SINCE 1 day ago
```

### `payment_status_unknown`

**Payment status unknown:** a payer came back from Cashfree and their page
couldn't tell whether the payment went through. Either the
`/payment/status` call failed (a `payment_status` JavaScriptError says why)
or Maya answered with a `Status` the page doesn't know (`order_status`).
The payer may have paid.

1. Find the order in Cashfree and in Maya by the time of the event; New
   Relic has no order ID, on purpose. `enduser.id` is the payer's Firebase
   UID if they were signed in.
2. Make sure the booking matches what was paid, and tell the payer.
3. A new `order_status` value: handle it in `getStatus()` of
   `src/views/PagePaymentGateway.vue`.

```sql
FROM PageAction SELECT timestamp, order_status, enduser.id, route_name
  WHERE actionName = 'payment_status' AND status = 'unknown'
  AND environment = 'production' SINCE 1 day ago
FROM JavaScriptError SELECT timestamp, errorMessage
  WHERE source = 'payment_status' AND environment = 'production' SINCE 1 day ago
```

### `payment_failed_spike`

**Failed payments:** more than 3 (`payment_failed_per_hour`) payments in an
hour ended with an error code from Maya.

1. On the Funnels and payments page, "Failed payments by error code". One
   code for most of them points at Cashfree or a bank (check Cashfree's
   status page) or at Maya's checks; many codes is usually just more
   payments.
2. If traffic grew and the alert is noise, raise `payment_failed_per_hour`.

```sql
FROM PageAction SELECT count(*) WHERE actionName = 'payment_status'
  AND status = 'failed' AND environment = 'production'
  FACET error_code TIMESERIES SINCE 6 hours ago
```

### `edge_errors`

**Edge function errors:** `seo-inject` threw and the request fell through
to the plain SPA shell. Visitors still get the page; crawlers get it
without the spot's title, description and structured data.

1. Find the failing requests: `error.message` and `error.stack` say what
   threw. The Netlify Edge Functions log has the same error in full
   ("[seo-inject] fell through due to error"), found by `request_id`.
2. Right after a deploy, roll back. `seo-inject` only handles
   `/spot-details/*` and looks nothing up, so the only thing it waits for
   is the app shell: a record without `status` failed while fetching it
   (`context.next()`), one with `status` in the function's own code.

```sql
FROM Log SELECT timestamp, request_id, status, error.class, error.message
  WHERE service.name = 'parkspot-edge' AND environment = 'production'
  AND level = 'error' SINCE 1 hour ago
```

### `edge_unchanged`

**Spot pages without SEO metadata:** more than 10
(`edge_unchanged_per_hour`) pages in an hour where `seo-inject` left the
shell as it was: there was no `</head>` in it, or the rewrite failed.

1. Check `status`: an upstream error page has no app shell.
2. Check the latest deploy's `index.html` still has its `</head>`, and roll
   back if it doesn't.

```sql
FROM Log SELECT count(*) WHERE service.name = 'parkspot-edge'
  AND environment = 'production' AND outcome = 'unchanged'
  FACET route_name, status, client SINCE 3 hours ago
```

### `browser_no_traffic`

**No page views** from this environment for 6 hours
(`browser_no_traffic_seconds`). The site is down, the agent isn't on the
page, or New Relic stopped taking data.

1. Open www.parkspot.in. With the agent on, the page source has
   `NREUM.loader_config` and the network tab shows requests to
   `bam.nr-data.net`.
2. No agent: check `NEW_RELIC_BROWSER_ENABLED` in the Netlify UI, and the
   deploy log for `[newrelic]` errors.
3. Agent there but no data: check the account's ingest (see
   [`ingest_budget`](#ingest_budget)). Past the free tier's limit, New
   Relic can stop collecting until the next month.

### `ingest_budget`

**Monthly ingest:** this month's data passed 80% (warning) or 90%
(critical) of the 100 GB budget. Past 100 GB on the free tier, New Relic
may limit or stop collection until the month ends, and every alert here
goes blind with it.

1. On the dashboard's Ingest page, find what grew.
2. Turn down, cheapest first (in what is lost):
    1. **Pipeline rules.** `pipeline_rules = { edge_info_logs = true }` (and
       `edge_non_production_logs`) in `terraform.tfvars`, then apply. Edge
       warnings and errors stay.
    2. **Edge sampling.** `NEW_RELIC_EDGE_SAMPLE_RATE` (Functions scope),
       for example `0.1`, then redeploy. Counts stay right through
       `sample_rate`.
    3. **Previews.** `NEW_RELIC_BROWSER_ENABLED=false` for the
       deploy-preview and branch-deploy contexts in the Netlify UI.
    4. **Trace and replay sampling** in the browser app's settings. Takes
       effect without a deploy.
    5. **AJAX deny list.** Add hosts that make many calls and matter little
       (map tiles, Firebase) to `AJAX_DENY_LIST` in
       `scripts/newrelic/vite-plugin.js`.
    6. **Agent features.** Turn off a feature in `vite-plugin.js`, but not
       the session trace: session replay needs it.

```sql
FROM NrConsumption SELECT sum(GigabytesIngested)
  WHERE productLine = 'DataPlatform' FACET usageMetric SINCE 30 days ago
FROM PageView, PageViewTiming, PageAction, UserAction, BrowserInteraction, AjaxRequest, JavaScriptError, BrowserPerformance, Span, Log
  SELECT bytecountestimate() / 10e8 AS 'GB' FACET eventType() SINCE 1 week ago
```

### `lcp_p75`

**LCP p75:** the 75th percentile Largest Contentful Paint of an hour was
above 2.5 s (warning) or 4 s (critical) for 2 hours.

1. On the Web vitals page, find the routes and devices it comes from, and
   on the Releases page whether a release started it.
2. Usual causes: a large or late hero image, a slow Maya answer on a page
   that waits for it (spot details), a third-party script loaded early.

```sql
FROM PageViewTiming SELECT percentile(largestContentfulPaint, 75), count(*)
  WHERE environment = 'production' AND largestContentfulPaint IS NOT NULL
  FACET route_name, deviceType SINCE 1 day ago
```

### `inp_p75`

**INP p75:** the 75th percentile Interaction to Next Paint of an hour was
above 0.2 s (warning) or 0.5 s (critical) for 2 hours.

1. On the Web vitals page, find the routes it comes from.
2. Usual causes: long tasks after a click or a key press (the map, search
   filters, large lists re-rendering).

```sql
FROM PageViewTiming SELECT percentile(interactionToNextPaint, 75), count(*)
  WHERE environment = 'production' AND interactionToNextPaint IS NOT NULL
  FACET route_name, deviceType SINCE 1 day ago
```

### `cls_p75`

**CLS p75:** the 75th percentile Cumulative Layout Shift was above 0.1
(warning) or 0.25 (critical) for 2 hours, as of the first time each page
was hidden.

1. On the Web vitals page, find the routes it comes from.
2. Usual causes: images without a width and height, content inserted above
   what is already shown (banners, the cookie notice, late ads).

```sql
FROM PageViewTiming SELECT percentile(cumulativeLayoutShift, 75), count(*)
  WHERE environment = 'production' AND timingName = 'pageHide'
  AND cumulativeLayoutShift IS NOT NULL FACET route_name, deviceType SINCE 1 day ago
```

### `browser_availability`

**Browser availability: fast or slow error budget burn.** Sessions hit
JavaScript errors fast enough to use 2% of the 28-day error budget in an
hour (fast) or 5% in 6 hours (slow). Work through it like
[`js_error_rate`](#js_error_rate); the Overview page's "Sessions with a
JavaScript error (%)" shows the share of sessions hit.

### `maya_availability`

**Maya API availability: fast or slow error budget burn.** Maya calls from
the browser get 5xx answers or time out (after 10 s) often enough to use
2% of the 28-day budget in an hour, or 5% in 6 hours.

1. On the Maya API page, "Maya errors by status (0: no answer)" and
   "Failing endpoints" show whether it's one endpoint or all of them, and
   "Maya calls without an answer" whether it's timeouts.
2. Then Maya's own logs and health. Once Maya reports to New Relic, its
   transactions for the same calls are one click away (see the
   [contract](#maya-backend-contract)).

```sql
FROM JavaScriptError SELECT count(*) WHERE source = 'maya'
  AND environment = 'production'
  AND (status >= 500 OR (error_code = 'ECONNABORTED' AND errorMessage != 'Request aborted'))
  FACET endpoint, status, error_code SINCE 3 hours ago
```

## How to extend

Keep names and attributes in the tables above as you add them: the
dashboards and alerts are written against them.

**A new kind of handled error.** Report it with
`reportError(error, { source: '<where_it_was_caught>' })`, and add the
source to the [JavaScriptError](#javascripterror) table. "Reported errors
by source" picks it up. If it isn't the page failing (the way a Maya 4xx is
the API's answer), leave it out of `browser_failure` in
`terraform/locals.tf`.

**A business event.** Add a constant to `NR_EVENTS` in
`src/telemetry/events.js`, call `trackEvent(NR_EVENTS.X, attributes)`, and
add a row to the [PageAction](#pageaction) table. For an event that GA4
already gets through `track()`, add it to `FORWARDED_ANALYTICS_EVENTS`
instead; only the call's own parameters go to New Relic.

**A page-level attribute.** `setAttribute(name, value)`, set where the value
changes. Events take 64 custom attributes, and call sites can use up to 48
of them, so keep page-level ones few. Add it to the
[table](#on-every-browser-event).

**An alert.** Add an entry to `local.condition_specs` in
`terraform/alerts.tf` with only what differs from `condition_defaults`, and
a section under [Runbooks](#runbooks) headed with its key, like the others:
the alert links to `#<key>`. Try the query in the query builder over a week
first. At this traffic, a rate or a count over less than 15 minutes is
mostly noise: `js_error_rate` needs three 5-minute windows in a row, and
`payment_failed_spike`, `edge_unchanged` and the web vitals look at a whole
hour. A single window of 5 minutes only suits an alert on one event, such
as `payment_status_unknown`, or on loss of signal (`browser_no_traffic`).
Count with `filter()`, and use `event_timer` for sparse events.

**A service level.** An entry in `local.slos` in
`terraform/service-levels.tf`, a row in [Service levels](#service-levels),
and with `burn_alerts = true` a runbook section with its key. Burn alerts
can only fire with a target above 92.6% (fast burn is 13.44 times the
allowed rate over 28 days, slow burn 5.6).

**A dashboard widget.** In `terraform/dashboards.tf`, on a free row and
column of the 12-column grid, with `local.dashboard_browser_where` so the
Environment picker applies. A new web vital is an entry in
`dashboard_vitals`, a new lead form one in `dashboard_lead_funnels`.

**An error group.** Add `{ group, pattern }` to `ERROR_GROUPS` in
`src/telemetry/error-filter.js`, and the same pattern as an `RLIKE` local in
`dashboards.tf` to chart it. `RLIKE` matches the whole message, so wrap the
pattern in `.*`.

**Browser noise.** Add the message to `IGNORED_MESSAGES` in
`error-filter.js`. Dropped errors are gone for good, so match narrowly.

**A page with personal data in its URL or markup.** Give its route
`meta: { sessionReplay: false }` in `src/router/routes.js`, and add it to
`keptOut` and the count in `tests/router/routes.spec.js`: the test checks
that exactly those routes have it, every route under `/internal/` among
them. For one image, canvas or video, add `data-nr-block` to it instead.
See [Privacy](#privacy) for what replay masking doesn't cover.

**Dropping data before it's stored.** An entry in `local.pipeline_rule_specs`
(`terraform/ingest-rules.tf`) and an off-by-default flag in
`var.pipeline_rules`. Check the Ingest page first. These are pipeline cloud
rules: NRQL drop rules reached their end of life in 2026.

**Another environment.** It reports by itself once its Netlify context sets
`NEW_RELIC_ENVIRONMENT` (or keeps Netlify's context name). For alerts, give
it a Terraform workspace ([how](terraform/README.md#a-second-environment-uat)).

**The agent.** To upgrade it, see `scripts/newrelic/vendor/README.md`. Its
configuration is built in `scripts/newrelic/vite-plugin.js`; the browser
app's settings in the UI only control sampling and log levels.

Web vitals in `PageViewTiming` are in seconds, whatever some New Relic
pages say (the service level docs use 4000 ms for LCP): use `2.5`, not
`2500`.

## Maya backend contract

Maya doesn't report to New Relic yet. When it does, these let its data line
up with the browser's, and keep it as free of personal data:

1. **The Go agent, one app per environment.** `NEW_RELIC_APP_NAME` is
   `maya-production` or `maya-uat`, and `NEW_RELIC_LABELS` is
   `environment:production` or `environment:uat`, the same values as the
   browser's `environment`. `NEW_RELIC_LICENSE_KEY` is an ingest license
   key, kept with Maya's other secrets, never the browser key.
2. **W3C trace context.** Use the Go agent's HTTP integration for Maya's
   router, so incoming `traceparent` and `tracestate` headers continue the
   browser's trace; distributed tracing is on by default. The browser only
   sends them to origins listed in `NEW_RELIC_BROWSER_DT_ALLOWED_ORIGINS`,
   and that has to wait until Maya's CORS configuration allows both headers
   (`Access-Control-Allow-Headers`). Otherwise the preflight of every call
   fails. In that order: deploy the CORS change, set the variable in
   `.env.production` (and `netlify.toml` for UAT), then check in the
   browser's network tab that Maya calls carry `traceparent` and still
   succeed.
3. **The same user ID.** `txn.SetUserID(firebaseUID)`, so `enduser.id` means
   the same on both sides. Never a phone number or an email.
4. **The trace ID as correlation ID.** Log `trace.id`
   (`txn.GetTraceMetadata().TraceID`) with Maya's own log lines, to find a
   browser call in them. `ptid` stays in the browser: it isn't sent to
   Maya.
5. **No personal data in transactions.** The Go agent records the request
   path as `request.uri`, and some Maya paths hold the username (a phone
   number or an email): `auth/user/{UserName}/kycStatus`. Name transactions
   by route pattern, and leave `request.uri` out
   (`NEW_RELIC_ATTRIBUTES_EXCLUDE=request.uri`). Never add request or
   response bodies as attributes. High security mode
   (`NEW_RELIC_HIGH_SECURITY`, also set on the account) is the blunt
   alternative.
6. **CORS headers on error answers too.** The browser only shows the app a
   response's status when the response has CORS headers. A 500 without them
   arrives as `ERR_NETWORK` with status 0: a network failure, which the Maya
   availability service level doesn't count.
7. **4xx for the request's fault, 5xx for Maya's.** Browser availability
   leaves Maya 4xx answers out (no spot for a search, an expired session)
   and counts 5xx answers. A database error answered as a 400 hides an
   outage.
8. **Answer well within 10 seconds.** The Maya client gives up after 10 s
   (`src/services/api.js`), and the service level counts that as a
   failure. Keep the p99 far below it, and move slow work (uploads,
   reports) out of the request.

Once Maya reports, add its service levels and alerts next to the
browser's: an APM availability and latency SLI on `maya-production`
(`FROM Transaction`), scoped like the browser's.
