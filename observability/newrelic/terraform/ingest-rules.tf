# Pipeline cloud rules: NRQL DELETE statements New Relic runs on incoming
# data, so whatever they match is never stored. Each entry in
# local.pipeline_rule_specs stays off until var.pipeline_rules turns it on.
# They act on the whole account, so only with manage_account_resources.
#
# Check what a rule would drop on the Ingest page of the dashboard before
# turning it on: dropped data is gone, for dashboards and alerts alike.

locals {
  pipeline_rule_specs = {
    # The records of requests that went fine (outcomes injected and
    # not_html). Warnings and errors, which the edge alerts watch, stay.
    # The edge page then only counts problems. A lower
    # NEW_RELIC_EDGE_SAMPLE_RATE thins these records out instead, at the
    # cost of a redeploy.
    edge_info_logs = {
      description = "Drop the info level log records of the ParkSpot edge functions."
      nrql        = "DELETE FROM Log WHERE service.name = 'parkspot-edge' AND level = 'info'"
    }

    # Deploy previews, branch deploys and UAT.
    edge_non_production_logs = {
      description = "Drop the log records of the ParkSpot edge functions outside production."
      nrql        = "DELETE FROM Log WHERE service.name = 'parkspot-edge' AND environment != 'production'"
    }
  }

  pipeline_rules = {
    for key, spec in local.pipeline_rule_specs : key => spec
    if var.manage_account_resources && var.pipeline_rules[key]
  }
}

resource "newrelic_pipeline_cloud_rule" "this" {
  for_each = local.pipeline_rules

  account_id  = var.account_id
  name        = "parkspot-${replace(each.key, "_", "-")}"
  description = each.value.description
  nrql        = each.value.nrql
}
