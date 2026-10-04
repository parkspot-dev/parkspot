output "dashboard_url" {
  description = "The ParkSpot web dashboard; null without manage_account_resources."
  value       = one(newrelic_one_dashboard.web[*].permalink)
}

output "alert_policy_id" {
  description = "The web alert policy of this environment."
  value       = newrelic_alert_policy.web.id
}

output "service_level_guids" {
  description = "The SLI GUID of each service level, by key."
  value       = { for key, slo in newrelic_service_level.this : key => slo.sli_guid }
}

output "browser_entity_guid" {
  description = "The browser app's entity GUID, used to scope browser queries."
  value       = local.browser_guid
}
