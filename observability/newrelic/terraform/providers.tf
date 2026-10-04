# The key comes from NEW_RELIC_API_KEY (a user key, NRAK-...), never from a
# variable, so it can't end up in a tfvars file or in the state.
provider "newrelic" {
  account_id = var.account_id
  region     = var.region
}
