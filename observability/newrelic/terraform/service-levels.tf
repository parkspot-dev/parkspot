# Service levels on the browser app, over a rolling 28 days. Each entry in
# local.slos is one SLI/SLO: `valid` events, and either `good` or `bad`
# ones (the other is null). With burn_alerts, New Relic's fast and slow
# burn conditions join the alert policy and link to the runbook section
# with the SLO's key.
#
# Web vitals use the Core Web Vitals "good" bounds and a 75% target, the
# way Google scores them. Their budget is 25% of page loads, so the error
# budget can't burn faster than 4x, below the fast burn threshold
# (13.44x at 28 days): the p75 conditions in alerts.tf watch them instead.

locals {
  slo_period_days = 28

  slos = {
    # Only one error per session has firstErrorInSession, so a session
    # whose first error is a Maya 4xx answer isn't counted even if a crash
    # follows. The JavaScript error rate condition still sees that crash.
    browser_availability = {
      name        = "Browser availability"
      description = "Page views, with the first JavaScript error of each session as a bad event (New Relic's recommended browser SLI) unless it reports a Maya 4xx answer."
      target      = var.slo_targets.browser_availability
      valid       = { from = "PageView", where = local.browser_where }
      good        = null
      bad         = { from = "JavaScriptError", where = "${local.browser_where} AND firstErrorInSession IS true AND ${local.browser_failure}" }
      burn_alerts = true
    }

    lcp = {
      name        = "LCP good"
      description = "Page loads with a Largest Contentful Paint of ${var.thresholds.lcp_warning_seconds} s or less."
      target      = var.slo_targets.lcp
      valid       = { from = "PageViewTiming", where = "${local.browser_where} AND largestContentfulPaint IS NOT NULL" }
      good        = { from = "PageViewTiming", where = "${local.browser_where} AND largestContentfulPaint <= ${var.thresholds.lcp_warning_seconds}" }
      bad         = null
      burn_alerts = false
    }

    inp = {
      name        = "INP good"
      description = "Pages with an Interaction to Next Paint of ${var.thresholds.inp_warning_seconds} s or less."
      target      = var.slo_targets.inp
      valid       = { from = "PageViewTiming", where = "${local.browser_where} AND interactionToNextPaint IS NOT NULL" }
      good        = { from = "PageViewTiming", where = "${local.browser_where} AND interactionToNextPaint <= ${var.thresholds.inp_warning_seconds}" }
      bad         = null
      burn_alerts = false
    }

    cls = {
      name        = "CLS good"
      description = "Pages with a Cumulative Layout Shift of ${var.thresholds.cls_warning} or less when first hidden."
      target      = var.slo_targets.cls
      valid       = { from = "PageViewTiming", where = "${local.browser_where} AND timingName = 'pageHide' AND cumulativeLayoutShift IS NOT NULL" }
      good        = { from = "PageViewTiming", where = "${local.browser_where} AND timingName = 'pageHide' AND cumulativeLayoutShift <= ${var.thresholds.cls_warning}" }
      bad         = null
      burn_alerts = false
    }

    maya_availability = {
      name        = "Maya API availability"
      description = "Maya calls from the browser, with the 5xx answers and timeouts src/services/api.js reports as bad events. Network failures are not counted."
      target      = var.slo_targets.maya_availability
      valid       = { from = "AjaxRequest", where = "${local.browser_where} AND requestUrl LIKE '%${local.maya_host}%'" }
      good        = null
      bad         = { from = "JavaScriptError", where = "${local.browser_where} AND ${local.maya_bad}" }
      burn_alerts = true
    }

    payment_resolution = {
      name        = "Payment status resolved"
      description = "Payment status checks that ended paid, pending or failed rather than unknown."
      target      = var.slo_targets.payment_resolution
      valid       = { from = "PageAction", where = "${local.browser_where} AND actionName = 'payment_status'" }
      good        = null
      bad         = { from = "PageAction", where = "${local.browser_where} AND actionName = 'payment_status' AND status = 'unknown'" }
      # payment_status_unknown in alerts.tf already fires on the first one.
      burn_alerts = false
    }
  }

  burn_alerts = {
    for pair in setproduct([for key, slo in local.slos : key if slo.burn_alerts], ["fast_burn", "slow_burn"]) :
    "${pair[0]}_${pair[1]}" => { slo = pair[0], alert_type = pair[1] }
  }
}

resource "newrelic_service_level" "this" {
  for_each = local.slos

  guid        = local.browser_guid
  name        = "${each.value.name} (${var.environment})"
  description = each.value.description

  events {
    account_id = var.account_id

    valid_events {
      from  = each.value.valid.from
      where = each.value.valid.where
    }

    dynamic "good_events" {
      for_each = each.value.good == null ? [] : [each.value.good]
      content {
        from  = good_events.value.from
        where = good_events.value.where
      }
    }

    dynamic "bad_events" {
      for_each = each.value.bad == null ? [] : [each.value.bad]
      content {
        from  = bad_events.value.from
        where = bad_events.value.where
      }
    }
  }

  objective {
    target = each.value.target

    time_window {
      rolling {
        count = local.slo_period_days
        unit  = "DAY"
      }
    }
  }
}

# Fast burn: 2% of the budget in an hour. Slow burn: 5% in 6 hours.
data "newrelic_service_level_alert_helper" "this" {
  for_each = local.burn_alerts

  alert_type    = each.value.alert_type
  sli_guid      = newrelic_service_level.this[each.value.slo].sli_guid
  slo_target    = local.slos[each.value.slo].target
  slo_period    = local.slo_period_days
  is_bad_events = local.slos[each.value.slo].bad != null
}

# Set up the way New Relic's service level docs set up burn rate alerts.
resource "newrelic_nrql_alert_condition" "slo_burn" {
  for_each = local.burn_alerts

  policy_id   = newrelic_alert_policy.web.id
  name        = "${local.slos[each.value.slo].name}: ${each.value.alert_type == "fast_burn" ? "fast" : "slow"} error budget burn"
  description = "${data.newrelic_service_level_alert_helper.this[each.key].tolerated_budget_consumption}% of the ${local.slo_period_days}-day error budget of \"${local.slos[each.value.slo].name}\" used within ${data.newrelic_service_level_alert_helper.this[each.key].evaluation_period / 3600} h."
  runbook_url = "${var.runbook_base_url}#${each.value.slo}"
  type        = "static"
  enabled     = true

  violation_time_limit_seconds = 259200

  nrql {
    query = data.newrelic_service_level_alert_helper.this[each.key].nrql
  }

  critical {
    operator              = "above_or_equals"
    threshold             = data.newrelic_service_level_alert_helper.this[each.key].threshold
    threshold_duration    = 900
    threshold_occurrences = "at_least_once"
  }

  fill_option        = "none"
  aggregation_window = data.newrelic_service_level_alert_helper.this[each.key].evaluation_period
  aggregation_method = "event_flow"
  aggregation_delay  = 120
  slide_by           = each.value.alert_type == "fast_burn" ? 60 : 900
}
