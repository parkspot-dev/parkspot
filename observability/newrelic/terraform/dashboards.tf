# The "ParkSpot web" dashboard. One dashboard serves every environment: its
# Environment picker fills {{environment}} in each query (quoted, since the
# replacement strategy is "string"). Widgets follow the time picker unless
# ignore_time_range is set. Only with manage_account_resources, so a second
# state (UAT) doesn't make a copy.
#
# To add a widget, give it a free row/column on a 12-column grid; the
# attributes each event carries are listed in ../README.md.

locals {
  dashboard_browser_where = "entityGuid = '${local.browser_guid}' AND environment = {{environment}}"
  dashboard_edge_where    = "service.name = 'parkspot-edge' AND environment = {{environment}}"
  # Each environment calls its own Maya host (maya-in, maya-uat); see
  # maya_host in locals.tf for the pattern.
  dashboard_maya_where = "${local.dashboard_browser_where} AND requestUrl LIKE '%maya-%.parkspot.in%'"

  # The widgets that show all three web vitals, one entry each. Bounds are
  # the alert thresholds, in seconds (CLS has no unit).
  dashboard_vitals = [
    {
      title    = "LCP p75 (s)"
      query    = "SELECT percentile(largestContentfulPaint, 75) FROM PageViewTiming WHERE ${local.dashboard_browser_where} AND largestContentfulPaint IS NOT NULL"
      warning  = var.thresholds.lcp_warning_seconds
      critical = var.thresholds.lcp_critical_seconds
    },
    {
      title    = "INP p75 (s)"
      query    = "SELECT percentile(interactionToNextPaint, 75) FROM PageViewTiming WHERE ${local.dashboard_browser_where} AND interactionToNextPaint IS NOT NULL"
      warning  = var.thresholds.inp_warning_seconds
      critical = var.thresholds.inp_critical_seconds
    },
    {
      title    = "CLS p75"
      query    = "SELECT percentile(cumulativeLayoutShift, 75) FROM PageViewTiming WHERE ${local.dashboard_browser_where} AND timingName = 'pageHide' AND cumulativeLayoutShift IS NOT NULL"
      warning  = var.thresholds.cls_warning
      critical = var.thresholds.cls_critical
    },
  ]

  # Lead forms, by funnel_name. Each tracks funnel_view, form_start,
  # form_submit_attempt and generate_lead; add a form here to get its
  # funnel, three to a row at the bottom of the Funnels page.
  dashboard_lead_funnels = [
    { funnel_name = "contact", title = "Contact form" },
    { funnel_name = "so_register", title = "Parking owner sign-up" },
    { funnel_name = "vo_lead", title = "Parking request" },
  ]

  # Error messages src/telemetry/error-filter.js groups. RLIKE matches the
  # whole message.
  dashboard_chunk_load_errors = "errorMessage RLIKE '(?i).*(Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Unable to preload CSS).*'"
  dashboard_network_errors    = "errorMessage RLIKE '(?i)(Unhandled Promise Rejection: )?(Network Error|Failed to fetch|Load failed|NetworkError when attempting to fetch resource[.])'"
}

resource "newrelic_one_dashboard" "web" {
  count = var.manage_account_resources ? 1 : 0

  name        = "ParkSpot web"
  description = "Browser app, edge functions and Maya calls of parkspot.in. Managed by Terraform in observability/newrelic/terraform: change it there, not in the UI."
  permissions = "public_read_only"

  variable {
    name                 = "environment"
    title                = "Environment"
    type                 = "nrql"
    default_values       = [var.environment]
    is_multi_selection   = false
    replacement_strategy = "string"

    nrql_query {
      account_ids = [var.account_id]
      query       = "SELECT uniques(environment) FROM PageView WHERE entityGuid = '${local.browser_guid}' SINCE 1 week ago"
    }

    options {
      ignore_time_range = true
    }
  }

  page {
    name        = "Overview"
    description = "Traffic, errors, web vitals and Maya health at a glance."

    widget_billboard {
      title  = "Page views"
      row    = 1
      column = 1
      width  = 2

      nrql_query {
        account_id = var.account_id
        query      = "SELECT count(*) AS 'Page views' FROM PageView WHERE ${local.dashboard_browser_where} COMPARE WITH 1 week ago"
      }
    }

    widget_billboard {
      title  = "Sessions with a JavaScript error (%)"
      row    = 1
      column = 3
      width  = 2

      nrql_query {
        account_id = var.account_id
        query      = "SELECT filter(uniqueCount(session), WHERE eventType() = 'JavaScriptError') / filter(uniqueCount(session), WHERE eventType() = 'PageView') * 100 AS '%' FROM JavaScriptError, PageView WHERE ${local.dashboard_browser_where}"
      }
    }

    dynamic "widget_billboard" {
      for_each = local.dashboard_vitals
      content {
        title    = widget_billboard.value.title
        row      = 1
        column   = 5 + widget_billboard.key * 2
        width    = 2
        warning  = widget_billboard.value.warning
        critical = widget_billboard.value.critical

        nrql_query {
          account_id = var.account_id
          query      = widget_billboard.value.query
        }
      }
    }

    widget_billboard {
      title  = "Maya 5xx answers and timeouts"
      row    = 1
      column = 11
      width  = 2

      nrql_query {
        account_id = var.account_id
        query      = "SELECT count(*) AS 'Failed calls' FROM JavaScriptError WHERE ${local.dashboard_browser_where} AND ${local.maya_bad}"
      }
    }

    widget_line {
      title  = "Page views by device"
      row    = 4
      column = 1
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT count(*) FROM PageView WHERE ${local.dashboard_browser_where} FACET deviceType TIMESERIES AUTO"
      }
    }

    widget_line {
      title  = "JavaScript errors per 100 page views"
      row    = 4
      column = 7
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT filter(count(*), WHERE eventType() = 'JavaScriptError') / filter(count(*), WHERE eventType() = 'PageView') * 100 AS 'Errors per 100 page views' FROM JavaScriptError, PageView WHERE ${local.dashboard_browser_where} TIMESERIES AUTO"
      }
    }

    dynamic "widget_line" {
      for_each = local.dashboard_vitals
      content {
        title            = widget_line.value.title
        row              = 7
        column           = 1 + widget_line.key * 4
        width            = 4
        is_label_visible = true

        nrql_query {
          account_id = var.account_id
          query      = "${widget_line.value.query} TIMESERIES AUTO"
        }

        threshold {
          name     = "Needs improvement"
          from     = widget_line.value.warning
          to       = widget_line.value.critical
          severity = "warning"
        }
      }
    }

    widget_markdown {
      title  = "About this dashboard"
      row    = 10
      column = 1
      width  = 12
      height = 2
      text   = <<-EOT
        Browser data comes from the New Relic Browser app, edge data from the `parkspot-edge` log records. Every widget follows the time picker and the **Environment** picker, except on the Ingest page.

        What each alert means and what to do about it: [runbooks](${var.runbook_base_url}#runbooks).
      EOT
    }
  }

  page {
    name        = "Web vitals"
    description = "Core Web Vitals at the 75th percentile, the way Google scores them."

    dynamic "widget_line" {
      for_each = local.dashboard_vitals
      content {
        title  = "${widget_line.value.title} by device"
        row    = 1
        column = 1 + widget_line.key * 4
        width  = 4

        nrql_query {
          account_id = var.account_id
          query      = "${widget_line.value.query} FACET deviceType TIMESERIES AUTO"
        }
      }
    }

    dynamic "widget_bar" {
      for_each = local.dashboard_vitals
      content {
        title  = "${widget_bar.value.title} by route"
        row    = 4
        column = 1 + widget_bar.key * 4
        width  = 4

        nrql_query {
          account_id = var.account_id
          query      = "${widget_bar.value.query} FACET route_name LIMIT 20"
        }
      }
    }

    widget_line {
      title  = "First Contentful Paint p75 (s) by device"
      row    = 7
      column = 1
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT percentile(firstContentfulPaint, 75) FROM PageViewTiming WHERE ${local.dashboard_browser_where} AND firstContentfulPaint IS NOT NULL FACET deviceType TIMESERIES AUTO"
      }
    }

    widget_line {
      title  = "Route changes p75 (s) by route"
      row    = 7
      column = 7
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT percentile(duration, 75) FROM BrowserInteraction WHERE ${local.dashboard_browser_where} AND category = 'Route change' FACET browserInteractionName TIMESERIES AUTO"
      }
    }
  }

  page {
    name        = "Errors"
    description = "JavaScript errors: uncaught, and the ones the app reports with a source."

    widget_table {
      title  = "Top errors"
      row    = 1
      column = 1
      width  = 12
      height = 4

      nrql_query {
        account_id = var.account_id
        query      = "SELECT uniqueCount(session) AS 'Sessions', count(*) AS 'Errors', latest(errorClass) AS 'Class', latest(source) AS 'Source', latest(route_name) AS 'Last route' FROM JavaScriptError WHERE ${local.dashboard_browser_where} FACET errorMessage LIMIT 50"
      }
    }

    widget_line {
      title  = "Uncaught and reported errors"
      row    = 5
      column = 1
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT filter(count(*), WHERE source IS NULL) AS 'Uncaught', filter(count(*), WHERE source IS NOT NULL) AS 'Reported by the app' FROM JavaScriptError WHERE ${local.dashboard_browser_where} TIMESERIES AUTO"
      }
    }

    widget_line {
      title  = "Reported errors by source"
      row    = 5
      column = 7
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT count(*) FROM JavaScriptError WHERE ${local.dashboard_browser_where} AND source IS NOT NULL FACET source TIMESERIES AUTO"
      }
    }

    widget_line {
      title  = "Errors by release"
      row    = 8
      column = 1
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT count(*) FROM JavaScriptError WHERE ${local.dashboard_browser_where} FACET application.version TIMESERIES AUTO LIMIT 5"
      }
    }

    widget_bar {
      title  = "Sessions with errors by browser"
      row    = 8
      column = 7
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT uniqueCount(session) FROM JavaScriptError WHERE ${local.dashboard_browser_where} FACET userAgentName, userAgentOS LIMIT 10"
      }
    }

    widget_line {
      title  = "Stale chunks (tabs open across a deploy)"
      row    = 11
      column = 1
      width  = 4

      nrql_query {
        account_id = var.account_id
        query      = "SELECT count(*) FROM JavaScriptError WHERE ${local.dashboard_browser_where} AND ${local.dashboard_chunk_load_errors} TIMESERIES AUTO"
      }
    }

    widget_line {
      title  = "Network failures"
      row    = 11
      column = 5
      width  = 4

      nrql_query {
        account_id = var.account_id
        query      = "SELECT count(*) FROM JavaScriptError WHERE ${local.dashboard_browser_where} AND ${local.dashboard_network_errors} TIMESERIES AUTO"
      }
    }

    widget_line {
      title  = "Frustrated clicks"
      row    = 11
      column = 9
      width  = 4

      nrql_query {
        account_id = var.account_id
        query      = "SELECT filter(count(*), WHERE rageClick IS true) AS 'Rage clicks', filter(count(*), WHERE deadClick IS true) AS 'Dead clicks', filter(count(*), WHERE errorClick IS true) AS 'Error clicks' FROM UserAction WHERE ${local.dashboard_browser_where} TIMESERIES AUTO"
      }
    }

    widget_table {
      title  = "Where visitors get frustrated"
      row    = 14
      column = 1
      width  = 12

      nrql_query {
        account_id = var.account_id
        query      = "SELECT filter(count(*), WHERE rageClick IS true) AS 'Rage clicks', filter(count(*), WHERE deadClick IS true) AS 'Dead clicks', filter(count(*), WHERE errorClick IS true) AS 'Error clicks' FROM UserAction WHERE ${local.dashboard_browser_where} AND (rageClick IS true OR deadClick IS true OR errorClick IS true) FACET route_name, target LIMIT 20"
      }
    }
  }

  page {
    name        = "Funnels and payments"
    description = "Booking and lead funnels by session, and the outcome of payment status checks."

    widget_funnel {
      title  = "Booking request"
      row    = 1
      column = 1
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT funnel(session, WHERE actionName = 'view_item' AS 'Viewed a spot', WHERE actionName = 'begin_checkout' AS 'Opened the booking form', WHERE actionName = 'form_start' AS 'Started filling it in', WHERE actionName = 'generate_lead' AS 'Sent the request') FROM PageAction WHERE ${local.dashboard_browser_where} AND funnel_name = 'booking'"
      }
    }

    # Payment starts from a payment link, often in another session than
    # the booking request, so it gets a funnel of its own.
    widget_funnel {
      title  = "Payment"
      row    = 1
      column = 7
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT funnel(session, WHERE actionName = 'payment_initiated' AS 'Started paying', WHERE actionName = 'purchase' AS 'Paid', WHERE actionName = 'purchase_confirmed' AS 'Saw the confirmation') FROM PageAction WHERE ${local.dashboard_browser_where} AND funnel_name = 'booking'"
      }
    }

    widget_line {
      title  = "Payment status checks"
      row    = 4
      column = 1
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT count(*) FROM PageAction WHERE ${local.dashboard_browser_where} AND actionName = 'payment_status' FACET status TIMESERIES AUTO"
      }
    }

    widget_bar {
      title  = "Failed payments by error code"
      row    = 4
      column = 7
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT count(*) FROM PageAction WHERE ${local.dashboard_browser_where} AND actionName = 'payment_status' AND status = 'failed' FACET error_code"
      }
    }

    widget_bar {
      title  = "Unexpected order statuses (payment status unknown)"
      row    = 7
      column = 1
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT count(*) FROM PageAction WHERE ${local.dashboard_browser_where} AND actionName = 'payment_status' AND status = 'unknown' AND order_status IS NOT NULL FACET order_status"
      }
    }

    widget_bar {
      title  = "Form errors by field"
      row    = 7
      column = 7
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT count(*) FROM PageAction WHERE ${local.dashboard_browser_where} AND actionName = 'form_error' FACET funnel_name, error_fields LIMIT 20"
      }
    }

    dynamic "widget_funnel" {
      for_each = local.dashboard_lead_funnels
      content {
        title  = widget_funnel.value.title
        row    = 10 + floor(widget_funnel.key / 3) * 3
        column = 1 + widget_funnel.key % 3 * 4
        width  = 4

        nrql_query {
          account_id = var.account_id
          query      = "SELECT funnel(session, WHERE actionName = 'funnel_view' AS 'Saw the form', WHERE actionName = 'form_start' AS 'Started it', WHERE actionName = 'form_submit_attempt' AS 'Submitted it', WHERE actionName = 'generate_lead' AS 'Lead created') FROM PageAction WHERE ${local.dashboard_browser_where} AND funnel_name = '${widget_funnel.value.funnel_name}'"
        }
      }
    }
  }

  page {
    name        = "Maya API"
    description = "Maya calls as the browser sees them."

    widget_line {
      title  = "Maya calls"
      row    = 1
      column = 1
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT count(*) AS 'Calls' FROM AjaxRequest WHERE ${local.dashboard_maya_where} TIMESERIES AUTO"
      }
    }

    widget_line {
      title  = "Maya errors by status (0: no answer)"
      row    = 1
      column = 7
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT count(*) FROM JavaScriptError WHERE ${local.dashboard_browser_where} AND source = 'maya' FACET status TIMESERIES AUTO"
      }
    }

    widget_bar {
      title  = "Busiest endpoints"
      row    = 4
      column = 1
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT count(*) FROM AjaxRequest WHERE ${local.dashboard_maya_where} FACET groupedRequestUrl LIMIT 20"
      }
    }

    widget_table {
      title  = "Failing endpoints"
      row    = 4
      column = 7
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT filter(count(*), WHERE status >= 500) AS '5xx', filter(count(*), WHERE status >= 400 AND status < 500) AS '4xx', filter(count(*), WHERE status = 0) AS 'No answer', uniqueCount(session) AS 'Sessions' FROM JavaScriptError WHERE ${local.dashboard_browser_where} AND source = 'maya' FACET method, endpoint LIMIT 50"
      }
    }

    widget_line {
      title  = "Maya calls without an answer"
      row    = 7
      column = 1
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT count(*) FROM JavaScriptError WHERE ${local.dashboard_browser_where} AND source = 'maya' AND status = 0 FACET error_code, errorMessage TIMESERIES AUTO"
      }
    }

    widget_markdown {
      title  = "About this page"
      row    = 7
      column = 7
      width  = 6
      text   = <<-EOT
        Calls are the browser agent's AjaxRequest events to the Maya host. Errors are the failed calls `src/services/api.js` reports (`source = 'maya'`), with the endpoint's IDs replaced by `:id`.

        A call without an answer has status 0 and axios's `error_code`: `ECONNABORTED` for a timeout, or with the message "Request aborted" for a request the browser dropped; `ERR_NETWORK` when the request failed, or when the answer had no CORS headers. The Maya availability service level counts 5xx answers and timeouts.

        Maya's own view of these requests needs the [backend contract](${var.runbook_base_url}#maya-backend-contract).
      EOT
    }
  }

  page {
    name        = "Edge"
    description = "The seo-inject edge function, from its log records. Counts are sampling-aware."

    widget_line {
      title  = "Requests by outcome"
      row    = 1
      column = 1
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT sum(1 / sample_rate) FROM Log WHERE ${local.dashboard_edge_where} FACET edge_function, outcome TIMESERIES AUTO"
      }
    }

    widget_pie {
      title  = "Requests by client"
      row    = 1
      column = 7
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT sum(1 / sample_rate) FROM Log WHERE ${local.dashboard_edge_where} FACET client"
      }
    }

    widget_bar {
      title  = "Time to respond p95 (ms) by client"
      row    = 4
      column = 1
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT percentile(duration_ms, 95) FROM Log WHERE ${local.dashboard_edge_where} FACET client"
      }
    }

    widget_line {
      title  = "Upstream and total time (ms)"
      row    = 4
      column = 7
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT percentile(upstream_ms, 50, 95), percentile(duration_ms, 50, 95) FROM Log WHERE ${local.dashboard_edge_where} AND upstream_ms IS NOT NULL TIMESERIES AUTO"
      }
    }

    widget_table {
      title  = "Warnings and errors"
      row    = 7
      column = 1
      width  = 12
      height = 4

      nrql_query {
        account_id = var.account_id
        query      = "SELECT edge_function, outcome, route_name, status, error.class, error.message, request_id, deploy_id FROM Log WHERE ${local.dashboard_edge_where} AND level != 'info' LIMIT 100"
      }
    }

    widget_markdown {
      title  = "About this page"
      row    = 11
      column = 1
      width  = 12
      height = 2
      text   = <<-EOT
        Each record stands for `1 / sample_rate` requests, hence `sum(1 / sample_rate)` for counts. Warnings and errors are never sampled, so with `NEW_RELIC_EDGE_SAMPLE_RATE` below 1 they weigh more in the timing percentiles than they should. Find a request in Netlify's Edge Functions log by its `request_id`.
      EOT
    }
  }

  page {
    name        = "Releases"
    description = "Production deployments, and how each release does."

    widget_table {
      # The Netlify plugin records production deploys only, so this table
      # doesn't follow the Environment picker.
      title  = "Deployments (production)"
      row    = 1
      column = 1
      width  = 12

      nrql_query {
        account_id = var.account_id
        query      = "SELECT * FROM ChangeTrackingEvent WHERE entity.guid = '${local.browser_guid}' LIMIT 20"
      }
    }

    widget_line {
      title  = "JavaScript errors per 100 page views by release"
      row    = 4
      column = 1
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT filter(count(*), WHERE eventType() = 'JavaScriptError') / filter(count(*), WHERE eventType() = 'PageView') * 100 FROM JavaScriptError, PageView WHERE ${local.dashboard_browser_where} FACET application.version TIMESERIES AUTO LIMIT 5"
      }
    }

    widget_line {
      title  = "LCP p75 (s) by release"
      row    = 4
      column = 7
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT percentile(largestContentfulPaint, 75) FROM PageViewTiming WHERE ${local.dashboard_browser_where} AND largestContentfulPaint IS NOT NULL FACET application.version TIMESERIES AUTO LIMIT 5"
      }
    }

    widget_bar {
      title  = "Page views by release"
      row    = 7
      column = 1
      width  = 12

      nrql_query {
        account_id = var.account_id
        query      = "SELECT count(*) FROM PageView WHERE ${local.dashboard_browser_where} FACET application.version LIMIT 10"
      }
    }
  }

  page {
    name        = "Ingest"
    description = "Data ingested by the whole account, against the monthly budget."

    widget_billboard {
      title             = "Ingested this month (GB)"
      row               = 1
      column            = 1
      width             = 4
      ignore_time_range = true
      warning           = var.ingest_budget.monthly_gb * var.ingest_budget.warning_percent / 100
      critical          = var.ingest_budget.monthly_gb * var.ingest_budget.critical_percent / 100

      nrql_query {
        account_id = var.account_id
        query      = "SELECT latest(GigabytesIngested) AS 'GB' FROM NrMTDConsumption WHERE productLine = 'DataPlatform' SINCE 1 day ago"
      }
    }

    widget_billboard {
      title             = "Monthly pace of the last 7 days (GB)"
      row               = 1
      column            = 5
      width             = 4
      ignore_time_range = true
      warning           = var.ingest_budget.monthly_gb * var.ingest_budget.warning_percent / 100
      critical          = var.ingest_budget.monthly_gb * var.ingest_budget.critical_percent / 100

      nrql_query {
        account_id = var.account_id
        query      = "SELECT rate(sum(GigabytesIngested), 30 days) AS 'GB' FROM NrConsumption WHERE productLine = 'DataPlatform' SINCE 7 days ago"
      }
    }

    widget_markdown {
      title  = "About this page"
      row    = 1
      column = 9
      width  = 4
      text   = <<-EOT
        Account-wide: the Environment picker doesn't apply here, and the top row ignores the time picker too. The budget is ${var.ingest_budget.monthly_gb} GB a month; past the free tier's 100 GB, New Relic may limit or stop data collection until the next month. [What to turn down](${var.runbook_base_url}#ingest_budget), cheapest first.
      EOT
    }

    widget_stacked_bar {
      title             = "Daily ingest by source (GB), last 3 months"
      row               = 4
      column            = 1
      width             = 12
      ignore_time_range = true

      nrql_query {
        account_id = var.account_id
        query      = "SELECT sum(GigabytesIngested) FROM NrConsumption WHERE productLine = 'DataPlatform' FACET usageMetric TIMESERIES 1 day SINCE 3 months ago"
      }
    }

    widget_bar {
      title  = "Browser and log data by event type (GB)"
      row    = 7
      column = 1
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT bytecountestimate() / 10e8 AS 'GB' FROM PageView, PageViewTiming, PageAction, UserAction, BrowserInteraction, AjaxRequest, JavaScriptError, BrowserPerformance, Span, Log FACET eventType()"
      }
    }

    widget_line {
      title  = "Edge log data (GB) by level"
      row    = 7
      column = 7
      width  = 6

      nrql_query {
        account_id = var.account_id
        query      = "SELECT bytecountestimate() / 10e8 AS 'GB' FROM Log WHERE service.name = 'parkspot-edge' FACET level TIMESERIES AUTO"
      }
    }
  }
}
