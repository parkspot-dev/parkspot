# NRQL alert conditions on the browser app and the edge functions. Each
# entry in local.condition_specs becomes one condition. To add one, add an
# entry there and a runbook section with the same key to ../README.md
# (runbook_url links to it); a spec only lists what differs from
# local.condition_defaults.
#
# Counting conditions use filter() over the whole event stream: with other
# events flowing, a quiet window evaluates to 0 rather than to no data, so
# incidents close as soon as things are healthy again.

resource "newrelic_alert_policy" "web" {
  name = "ParkSpot web (${var.environment})"
  # One issue per condition, so a payment problem never hides behind an
  # open web vitals issue.
  incident_preference = "PER_CONDITION"
}

locals {
  # aggregation_delay applies to event_flow, aggregation_timer to
  # event_timer (the right choice for sparse events).
  condition_defaults = {
    type                           = "static"
    baseline_direction             = null
    aggregation_method             = "event_flow"
    aggregation_window             = 60
    aggregation_delay              = 120
    aggregation_timer              = 60
    slide_by                       = null
    fill_option                    = "none"
    fill_value                     = null
    expiration_duration            = null
    open_violation_on_expiration   = null
    close_violations_on_expiration = null
    violation_time_limit_seconds   = 86400
    warning                        = null
    critical                       = null
  }

  condition_specs = {
    js_error_rate = {
      name               = "JavaScript errors per page view"
      description        = "JavaScript errors per page view, against the baseline New Relic learns for this time of day and week."
      query              = "SELECT filter(count(*), WHERE eventType() = 'JavaScriptError') / filter(count(*), WHERE eventType() = 'PageView') FROM JavaScriptError, PageView WHERE ${local.browser_where}"
      type               = "baseline"
      baseline_direction = "upper_only"
      aggregation_window = 300
      fill_option        = "static"
      fill_value         = 0
      critical = {
        operator              = "above"
        threshold             = var.thresholds.js_error_rate_deviations
        threshold_duration    = 900
        threshold_occurrences = "all"
      }
    }

    payment_status_unknown = {
      name               = "Payment status unknown"
      description        = "A payer's browser could not find out whether their payment went through (payment_status 'unknown')."
      query              = "SELECT filter(count(*), WHERE actionName = 'payment_status' AND status = 'unknown') FROM PageAction WHERE ${local.browser_where}"
      aggregation_method = "event_timer"
      aggregation_window = 300
      aggregation_timer  = 120
      critical = {
        operator              = "above"
        threshold             = 0
        threshold_duration    = 300
        threshold_occurrences = "at_least_once"
      }
    }

    payment_failed_spike = {
      name               = "Failed payments"
      description        = "More than ${var.thresholds.payment_failed_per_hour} failed payments (payment_status 'failed') in an hour."
      query              = "SELECT filter(count(*), WHERE actionName = 'payment_status' AND status = 'failed') FROM PageAction WHERE ${local.browser_where}"
      aggregation_window = 3600
      # A sliding hour, evaluated every 5 minutes. With slide_by the
      # threshold duration counts in slide_by steps.
      slide_by = 300
      critical = {
        operator              = "above"
        threshold             = var.thresholds.payment_failed_per_hour
        threshold_duration    = 300
        threshold_occurrences = "at_least_once"
      }
    }

    edge_errors = {
      name               = "Edge function errors"
      description        = "An edge function threw and fell back to the page without its injected head."
      query              = "SELECT filter(count(*), WHERE level = 'error') FROM Log WHERE ${local.edge_where}"
      aggregation_method = "event_timer"
      aggregation_window = 300
      aggregation_timer  = 120
      critical = {
        operator              = "above"
        threshold             = 0
        threshold_duration    = 300
        threshold_occurrences = "at_least_once"
      }
    }

    edge_unchanged = {
      name = "Spot pages without SEO metadata"
      # 'unchanged' records are warn level, so sampling never thins them.
      description        = "More than ${var.thresholds.edge_unchanged_per_hour} spot pages in an hour where seo-inject left the shell unchanged (no </head>, or the rewrite failed)."
      query              = "SELECT filter(count(*), WHERE outcome = 'unchanged') FROM Log WHERE ${local.edge_where}"
      aggregation_window = 3600
      slide_by           = 300
      critical = {
        operator              = "above"
        threshold             = var.thresholds.edge_unchanged_per_hour
        threshold_duration    = 300
        threshold_occurrences = "at_least_once"
      }
    }

    browser_no_traffic = {
      name               = "No page views"
      description        = "No page view for ${var.thresholds.browser_no_traffic_seconds / 3600} hours: the site or the agent is down, or the agent was turned off."
      query              = "SELECT count(*) FROM PageView WHERE ${local.browser_where}"
      aggregation_window = 300
      # Loss of signal does the work. It only starts watching once the
      # signal has been seen.
      expiration_duration          = var.thresholds.browser_no_traffic_seconds
      open_violation_on_expiration = true
      # New Relic requires a threshold; a count is never below 0.
      critical = {
        operator              = "below"
        threshold             = 0
        threshold_duration    = 300
        threshold_occurrences = "all"
      }
    }

    # Account-wide: only with manage_account_resources (see below).
    ingest_budget = {
      name               = "Monthly ingest"
      description        = "Data ingested this month, against the ${var.ingest_budget.monthly_gb} GB budget (the free tier includes 100 GB)."
      query              = "SELECT latest(GigabytesIngested) FROM NrMTDConsumption WHERE productLine = 'DataPlatform'"
      aggregation_method = "event_timer"
      aggregation_window = 3600
      warning = {
        operator              = "above"
        threshold             = var.ingest_budget.monthly_gb * var.ingest_budget.warning_percent / 100
        threshold_duration    = 3600
        threshold_occurrences = "at_least_once"
      }
      critical = {
        operator              = "above"
        threshold             = var.ingest_budget.monthly_gb * var.ingest_budget.critical_percent / 100
        threshold_duration    = 3600
        threshold_occurrences = "at_least_once"
      }
    }

    # Web vitals: the p75 of an hour, above the "needs improvement" bound
    # (warning) or the "poor" bound (critical) for two hours in a row.
    lcp_p75 = {
      name               = "LCP p75"
      description        = "75th percentile Largest Contentful Paint, in seconds."
      query              = "SELECT percentile(largestContentfulPaint, 75) FROM PageViewTiming WHERE ${local.browser_where} AND largestContentfulPaint IS NOT NULL"
      aggregation_window = 3600
      warning = {
        operator              = "above"
        threshold             = var.thresholds.lcp_warning_seconds
        threshold_duration    = 7200
        threshold_occurrences = "all"
      }
      critical = {
        operator              = "above"
        threshold             = var.thresholds.lcp_critical_seconds
        threshold_duration    = 7200
        threshold_occurrences = "all"
      }
    }

    inp_p75 = {
      name               = "INP p75"
      description        = "75th percentile Interaction to Next Paint, in seconds."
      query              = "SELECT percentile(interactionToNextPaint, 75) FROM PageViewTiming WHERE ${local.browser_where} AND interactionToNextPaint IS NOT NULL"
      aggregation_window = 3600
      warning = {
        operator              = "above"
        threshold             = var.thresholds.inp_warning_seconds
        threshold_duration    = 7200
        threshold_occurrences = "all"
      }
      critical = {
        operator              = "above"
        threshold             = var.thresholds.inp_critical_seconds
        threshold_duration    = 7200
        threshold_occurrences = "all"
      }
    }

    cls_p75 = {
      name        = "CLS p75"
      description = "75th percentile Cumulative Layout Shift, as of the first time each page was hidden."
      # The agent adds the CLS so far to every timing; the pageHide timing
      # carries it once per page load, when the page is first hidden.
      query              = "SELECT percentile(cumulativeLayoutShift, 75) FROM PageViewTiming WHERE ${local.browser_where} AND timingName = 'pageHide' AND cumulativeLayoutShift IS NOT NULL"
      aggregation_window = 3600
      warning = {
        operator              = "above"
        threshold             = var.thresholds.cls_warning
        threshold_duration    = 7200
        threshold_occurrences = "all"
      }
      critical = {
        operator              = "above"
        threshold             = var.thresholds.cls_critical
        threshold_duration    = 7200
        threshold_occurrences = "all"
      }
    }
  }

  conditions = {
    for key, spec in local.condition_specs : key => merge(local.condition_defaults, spec)
    if var.manage_account_resources || key != "ingest_budget"
  }
}

resource "newrelic_nrql_alert_condition" "this" {
  for_each = local.conditions

  policy_id   = newrelic_alert_policy.web.id
  name        = each.value.name
  description = each.value.description
  runbook_url = "${var.runbook_base_url}#${each.key}"
  type        = each.value.type
  enabled     = true

  nrql {
    query = each.value.query
  }

  baseline_direction             = each.value.baseline_direction
  aggregation_method             = each.value.aggregation_method
  aggregation_window             = each.value.aggregation_window
  aggregation_delay              = each.value.aggregation_method == "event_timer" ? null : each.value.aggregation_delay
  aggregation_timer              = each.value.aggregation_method == "event_timer" ? each.value.aggregation_timer : null
  slide_by                       = each.value.slide_by
  fill_option                    = each.value.fill_option
  fill_value                     = each.value.fill_value
  expiration_duration            = each.value.expiration_duration
  open_violation_on_expiration   = each.value.open_violation_on_expiration
  close_violations_on_expiration = each.value.close_violations_on_expiration
  violation_time_limit_seconds   = each.value.violation_time_limit_seconds

  dynamic "critical" {
    for_each = each.value.critical == null ? [] : [each.value.critical]
    content {
      operator              = critical.value.operator
      threshold             = critical.value.threshold
      threshold_duration    = critical.value.threshold_duration
      threshold_occurrences = critical.value.threshold_occurrences
    }
  }

  dynamic "warning" {
    for_each = each.value.warning == null ? [] : [each.value.warning]
    content {
      operator              = warning.value.operator
      threshold             = warning.value.threshold
      threshold_duration    = warning.value.threshold_duration
      threshold_occurrences = warning.value.threshold_occurrences
    }
  }
}
