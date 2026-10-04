locals {
  # The browser app's entity GUID, built the way New Relic builds it:
  # base64 of "<account>|BROWSER|APPLICATION|<app ID>", without padding.
  browser_guid = replace(base64encode("${var.account_id}|BROWSER|APPLICATION|${var.browser_application_id}"), "=", "")

  # Every alert condition and service level on browser data is scoped to
  # the app and the environment, so UAT and deploy previews (same app, see
  # scripts/newrelic/build-info.js) never trip a production alert.
  browser_where = "entityGuid = '${local.browser_guid}' AND environment = '${var.environment}'"

  # Log records from netlify/edge-functions/lib/telemetry.js.
  edge_where = "service.name = 'parkspot-edge' AND environment = '${var.environment}'"

  # Match AjaxRequest URLs with '%<host>%': the agent records the host with
  # its port (maya-in.parkspot.in:443), so '<host>/' wouldn't match.
  maya_host = trimprefix(var.maya_origin, "https://")

  # Failed Maya calls that count against its availability: 5xx answers and
  # timeouts. src/services/api.js reports a call without an answer as
  # status 0 with axios's error code. ECONNABORTED is a timeout, unless the
  # message is "Request aborted": the browser dropped the request, and the
  # agent doesn't record it as a call either. Network failures
  # (ERR_NETWORK) are left out, since most are visitors going offline.
  maya_bad = "source = 'maya' AND (status >= 500 OR (error_code = 'ECONNABORTED' AND errorMessage != 'Request aborted'))"

  # Errors that count against browser availability: all but the ones
  # src/services/api.js reports for a Maya 4xx answer (no spot for a
  # search, an expired session), which is the API's verdict on the request
  # rather than the page failing. NRQL's != is false when the attribute is
  # missing, hence the IS NULL.
  browser_failure = "(source IS NULL OR source != 'maya' OR status = 0 OR status >= 500)"
}
