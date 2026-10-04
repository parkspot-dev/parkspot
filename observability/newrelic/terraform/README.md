# New Relic alerts, service levels and dashboard

The New Relic side of the web app's reporting, as Terraform: the alert
policy and its conditions, the service levels and their burn alerts, the
"ParkSpot web" dashboard, where alerts are sent, and the pipeline rules that
can drop data before it is stored. What the browser app and the edge
functions report, and what each alert means, is in
[`../README.md`](../README.md).

| File                                                 | What it holds                                                                                                                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `alerts.tf`                                          | The policy `ParkSpot web (<environment>)` and its NRQL conditions, one per entry in `local.condition_specs`                                                         |
| `service-levels.tf`                                  | Service levels over a rolling 28 days, one per entry in `local.slos`, and their error budget burn conditions                                                        |
| `dashboards.tf`                                      | The "ParkSpot web" dashboard: Overview, Web vitals, Errors, Funnels and payments, Maya API, Edge, Releases, Ingest                                                  |
| `notifications.tf`                                   | The email and Slack channels, and the workflow that sends the policy's issues to them                                                                               |
| `ingest-rules.tf`                                    | Pipeline cloud rules, all off until `pipeline_rules` turns one on                                                                                                   |
| `locals.tf`                                          | The browser app's entity GUID and the `WHERE` clauses the queries share                                                                                             |
| `variables.tf`                                       | Every input, with its default: environment, thresholds, SLO targets, ingest budget, where alerts go                                                                 |
| `outputs.tf`                                         | The dashboard URL, the policy ID, the SLI GUIDs and the entity GUID                                                                                                 |
| `providers.tf`, `versions.tf`, `.terraform.lock.hcl` | Provider setup. The lock file pins the provider's checksums for Linux, macOS (Intel and Apple silicon) and Windows, so every machine installs the same build of it. |

Changes are applied from a workstation, after the pull request is merged, so
the account matches master. CI (`.github/workflows/newrelic-terraform.yml`)
only checks the formatting and runs `terraform validate`: it has no New
Relic key and never runs `plan` or `apply`. Anything edited in the New Relic
UI on these resources is put back by the next apply; change the `.tf` files
instead.

## First apply

You need:

- **Terraform 1.5 or later.** CI uses 1.16.5.
- **A user key** (`NRAK-...`), created under the user menu > API keys >
  Create a key > User. It acts with its user's permissions, so create it as a
  user who can manage alerts, dashboards, service levels, workflows and
  pipeline rules (the All Product Admin role covers them all). The browser
  key (`NRBR-...`) and the license key (`...NRAL`) don't work here.

The provider reads the key from `NEW_RELIC_API_KEY` only, never from a
variable, so it stays out of tfvars files and out of the state. Don't put it
in a file in this folder.

```bash
cd observability/newrelic/terraform
read -rs NEW_RELIC_API_KEY && export NEW_RELIC_API_KEY   # paste, then Enter; keeps it out of shell history
cp terraform.tfvars.example terraform.tfvars             # git ignores *.tfvars; set alert_emails at least
terraform init
terraform plan          # read it: what will be created, changed or destroyed
terraform apply         # shows the plan again and asks before it changes anything
terraform output dashboard_url
```

Saved plan files (`terraform plan -out=...`) aren't git-ignored, so either
leave them out as above or keep them outside the repository.

With the defaults (production), the first apply creates:

| What                                     | How many                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| Alert policy "ParkSpot web (production)" | 1                                                                                           |
| NRQL conditions in it                    | 14: the 10 in `alerts.tf`, and a fast and a slow burn condition for 2 of the service levels |
| Service levels                           | 6: browser availability, LCP, INP, CLS, Maya API availability, payment status resolved      |
| Dashboard "ParkSpot web"                 | 1, with an Environment picker                                                               |
| Email destination, channel and workflow  | when `alert_emails` is set                                                                  |
| Slack channel (in the same workflow)     | when `slack` is set; see [Slack](#slack)                                                    |
| Pipeline cloud rules                     | none until one is turned on in `pipeline_rules`                                             |

Alerts start evaluating as soon as they exist. The JavaScript error rate
condition is a baseline condition: it learns from the app's own history,
so expect it to be noisy in its first week.

## State

The state is local (`terraform.tfstate`, git-ignored). It holds the IDs of
everything above, the queries and the alert email addresses, but not the
key. Keep a copy somewhere safe: without it Terraform no longer knows these
resources, and the next apply creates them all a second time.

Before a second person applies, move the state to a backend with locking,
so two applies can't run at once. For example S3 with `use_lockfile = true`,
Google Cloud Storage, or HCP Terraform with local execution: add the
`backend` block to `versions.tf`, then run `terraform init -migrate-state`.

If the state is lost anyway, either delete the policy, the service levels
and the dashboard in the UI and apply again, or bring them back with
`terraform import`.

## A second environment (UAT)

UAT reports to the same browser app as production, as `environment = 'uat'`
(see `netlify.toml` and `scripts/newrelic/build-info.js`). To alert on it,
give it its own state in a workspace and its own variables file:

```hcl
# uat.tfvars (git-ignored, like every *.tfvars)
environment              = "uat"
maya_origin              = "https://maya-uat.parkspot.in"
manage_account_resources = false
alert_emails             = []
slack                    = null
```

```bash
terraform workspace new uat                # once; later: terraform workspace select uat
terraform plan -var-file=uat.tfvars
terraform apply -var-file=uat.tfvars
terraform workspace select default         # back to production
```

- **`terraform.tfvars` is loaded in every workspace**, before `-var-file`. So
  `uat.tfvars` has to override whatever in it shouldn't reach UAT: the
  production alert addresses and Slack channel, above all.
- **`manage_account_resources = false`** leaves the resources that cover
  the whole account to the production state: the dashboard (its
  Environment picker already shows UAT), the ingest alert and the pipeline
  rules. The UAT state has its own policy with 13 conditions and its own 6
  service levels.
- Workspace states are kept in `terraform.tfstate.d/`, git-ignored too.

Deploy previews and branch deploys report as `deploy-preview` and
`branch-deploy`. They show up in the dashboard's Environment picker but get
no alerts.

## Set in the New Relic UI, not here

Some settings have no Terraform resource, or belong to the code:

| Setting                                                                         | Where                                                           | Value, and why                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Session replay sampling                                                         | Browser app (ID `1589185089`) > Settings > Application settings | **0%** of all sessions, **100%** of sessions with errors. The agent only starts recording once the cookie notice is acknowledged, and masks all text and inputs ([privacy](../README.md#privacy)).                             |
| Session trace sampling                                                          | Same page                                                       | **Default** mode: 90 traces an hour whatever the traffic. Custom rates grow with traffic. When the replay rates are higher, New Relic uses them for traces too.                                                                |
| Browser logs: automatic console capture                                         | Same page                                                       | **Off.** The app still has raw `console.log` calls, and some print API answers (`src/utils/apiCall.js`).                                                                                                                       |
| Browser logs: API logging level                                                 | Same page                                                       | **Warn.** What `log()` in `src/telemetry` sends: the `logger.warn` lines of the user store and `src/services/api.js`, already scrubbed.                                                                                        |
| Ajax deny list, distributed tracing, cookies, obfuscation rules, replay masking | Same page                                                       | Don't apply. They change the copy/paste snippet the UI shows, and the site doesn't use it: `scripts/newrelic/vite-plugin.js` builds the agent's configuration. Change it there. Sampling and log levels above do apply.        |
| Slack destination                                                               | Alerts > Destinations                                           | See [Slack](#slack).                                                                                                                                                                                                           |
| Edge functions' license key                                                     | Netlify UI, Functions scope                                     | [`netlify/edge-functions/README.md`](../../../netlify/edge-functions/README.md#telemetry-new-relic)                                                                                                                            |
| Build plugin's user key                                                         | Netlify UI, Builds scope                                        | [`netlify/plugins/newrelic/README.md`](../../../netlify/plugins/newrelic/README.md#setup)                                                                                                                                      |
| Service levels' default alert policy                                            | Leave it                                                        | New Relic keeps it at account level, so each service level's health follows its remaining error budget. It sends no notifications. Deleting it is permanent, and affects every service level in the account, existing and new. |

### Slack

The Slack destination needs an OAuth handshake, so it can't be created here:

1. Alerts > Destinations > Slack: sign in to the workspace and allow the New
   Relic app. For a private channel, invite the app to it in Slack.
2. Find the destination's ID, in the UI or with NerdGraph:

    ```graphql
    {
        actor {
            account(id: 7629005) {
                aiNotifications {
                    destinations(filters: { type: SLACK }) {
                        entities {
                            id
                            name
                        }
                    }
                }
            }
        }
    }
    ```

3. In Slack, the channel's details > About shows its ID (`C0...`).
4. Set both in `terraform.tfvars`, then plan and apply:

    ```hcl
    slack = {
      destination_id = "<destination ID>"
      channel_id     = "C0123456789"
    }
    ```

## EU accounts

Set `region = "EU"` in `terraform.tfvars`, together with the switches listed
in [`netlify/plugins/newrelic/README.md`](../../../netlify/plugins/newrelic/README.md#caveats)
(the agent's beacon, the source map and NerdGraph APIs, the edge Log API).

## Outputs

| Output                | Value                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| `dashboard_url`       | Link to the dashboard; null without `manage_account_resources`                                 |
| `alert_policy_id`     | ID of this environment's policy, for muting rules or a workflow defined elsewhere              |
| `service_level_guids` | SLI GUID of each service level, by key, for NerdGraph or `newrelic_service_level_alert_helper` |
| `browser_entity_guid` | The browser app's entity GUID, used to scope browser queries                                   |

## How it is built

- **Scoped by entity and environment.** Every alert condition and service
  level on browser data has
  `entityGuid = '<browser app>' AND environment = '<environment>'`
  (`locals.tf`), and every condition on edge logs
  `service.name = 'parkspot-edge' AND environment = '<environment>'`. All
  environments report to the same browser app, so a deploy preview never
  trips a production alert. The dashboard's Environment picker sets the
  environment instead (`dashboards.tf`), apart from the deployments table
  (production only) and the Ingest page (the whole account).
- **Counting with `filter()`.** A condition such as
  `SELECT filter(count(*), WHERE status = 'failed') FROM PageAction` sees the
  whole event stream, so a quiet window evaluates to 0 rather than to no
  data, and an issue closes as soon as things are healthy again.
- **Event flow or event timer.** Steady streams (page views, timings) and
  the two hourly counts below use `event_flow` with a 2-minute delay. The
  alerts on a single event (an unknown payment status, an edge function
  error) and the monthly ingest use `event_timer`, which evaluates a window
  a set time after its last event instead of waiting for later data.
  Cadence, the third method, isn't used: New Relic recommends the other two.
- **Sliding windows.** The hourly counts (failed payments, spot pages
  without SEO metadata) slide by 5 minutes, so an hour's total is checked
  every 5 minutes. On New Relic's compute-based pricing, sliding windows can
  use more compute; check before adding many.
- **Loss of signal.** "No page views" opens when no page view arrives for
  `browser_no_traffic_seconds` (6 hours). It only starts watching after the
  first one; its "below 0" threshold is there because New Relic requires a
  threshold, and never fires on its own.
- **Burn alerts from the helper.** The fast (2% of the budget in an hour)
  and slow (5% in 6 hours) burn conditions take their query, window and
  threshold from `newrelic_service_level_alert_helper`, the way New Relic's
  service level docs set them up.
- **Web vitals get p75 alerts, not burn alerts.** Their SLOs use Google's
  75% "good" target, so the budget is 25% of page loads and can burn at
  most 4 times as fast as allowed (every page load bad). The fast and slow
  burn thresholds for 28 days are 13.44 and 5.6, so a burn alert could never
  fire. The `*_p75` conditions watch the hourly p75 against the "needs
  improvement" (warning) and "poor" (critical) bounds instead.

## CI and local checks

The workflow runs on pull requests that change this folder:

```bash
terraform fmt -check -recursive -diff
terraform init -backend=false -input=false
NEW_RELIC_API_KEY=validate-only terraform validate -no-color
```

`validate` calls no API, but the provider refuses to start without a key,
hence the placeholder. Run `terraform fmt -recursive` before committing.

## Upgrading the provider

`versions.tf` allows any 3.x from 3.100 on, and the lock file pins the one
in use. To move to a newer release:

```bash
terraform init -upgrade
terraform providers lock -platform=linux_amd64 -platform=darwin_arm64 -platform=darwin_amd64 -platform=windows_amd64
terraform plan          # an upgrade on its own should show no changes
```

Read the provider's changelog for the versions skipped, and commit
`.terraform.lock.hcl` with the change.

## Changing alerts, service levels and the dashboard

See [How to extend](../README.md#how-to-extend): each alert needs a runbook
section, and each event or attribute a query uses is listed there.
