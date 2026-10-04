variable "account_id" {
  description = "New Relic account of the browser app and the edge logs (NEW_RELIC_ACCOUNT_ID in .env.production)."
  type        = number
  default     = 7629005

  validation {
    condition     = var.account_id > 0 && floor(var.account_id) == var.account_id
    error_message = "account_id must be a positive whole number."
  }
}

variable "browser_application_id" {
  description = "ID of the New Relic Browser app (NEW_RELIC_BROWSER_APPLICATION_ID in .env.production)."
  type        = number
  default     = 1589185089

  validation {
    condition     = var.browser_application_id > 0 && floor(var.browser_application_id) == var.browser_application_id
    error_message = "browser_application_id must be a positive whole number."
  }
}

variable "region" {
  description = "Data center of the account: US or EU."
  type        = string
  default     = "US"

  validation {
    condition     = contains(["US", "EU"], var.region)
    error_message = "region must be US or EU."
  }
}

variable "environment" {
  description = "Value of the environment attribute the alerts and service levels watch (NEW_RELIC_ENVIRONMENT, else Netlify's CONTEXT)."
  type        = string
  default     = "production"

  validation {
    # Same rule as scripts/newrelic/build-info.js.
    condition     = can(regex("^[a-z][a-z0-9-]{0,31}$", var.environment))
    error_message = "environment must be lowercase letters, digits and \"-\", start with a letter and be at most 32 characters."
  }
}

variable "maya_origin" {
  description = "Origin of the Maya API this environment calls (VITE_MAYA_API_DOMAIN)."
  type        = string
  default     = "https://maya-in.parkspot.in"

  validation {
    condition     = can(regex("^https://[a-z0-9.-]+$", var.maya_origin))
    error_message = "maya_origin must be an https origin, without a path or a trailing slash."
  }
}

variable "alert_emails" {
  description = "Addresses that get an email when an alert opens or closes. Empty: no email."
  type        = list(string)
  default     = []

  validation {
    condition     = alltrue([for email in var.alert_emails : can(regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", email))])
    error_message = "alert_emails must be email addresses."
  }
}

variable "slack" {
  description = "Slack destination ID (created in the New Relic UI, since it needs OAuth) and the ID of the channel to post to. Null: no Slack."
  type = object({
    destination_id = string
    channel_id     = string
  })
  default = null
}

variable "runbook_base_url" {
  description = "Page with a runbook section per alert; each condition links to #<its key>."
  type        = string
  default     = "https://github.com/parkspot-dev/parkspot/blob/master/observability/newrelic/README.md"
}

variable "manage_account_resources" {
  description = "Create the resources that cover the whole account: the dashboard (it has its own environment picker), the ingest alert and the pipeline rules. Turn off in the state of a second environment."
  type        = bool
  default     = true
}

variable "thresholds" {
  description = "Alert thresholds. Web vitals are in seconds (CLS has no unit), like PageViewTiming."
  type = object({
    lcp_warning_seconds        = optional(number, 2.5)
    lcp_critical_seconds       = optional(number, 4)
    inp_warning_seconds        = optional(number, 0.2)
    inp_critical_seconds       = optional(number, 0.5)
    cls_warning                = optional(number, 0.1)
    cls_critical               = optional(number, 0.25)
    js_error_rate_deviations   = optional(number, 3)
    payment_failed_per_hour    = optional(number, 3)
    edge_unchanged_per_hour    = optional(number, 10)
    browser_no_traffic_seconds = optional(number, 21600)
  })
  default = {}

  validation {
    condition = (
      var.thresholds.lcp_warning_seconds < var.thresholds.lcp_critical_seconds &&
      var.thresholds.inp_warning_seconds < var.thresholds.inp_critical_seconds &&
      var.thresholds.cls_warning < var.thresholds.cls_critical
    )
    error_message = "Each web vital's warning threshold must be below its critical one."
  }

  validation {
    condition     = var.thresholds.js_error_rate_deviations >= 1 && var.thresholds.js_error_rate_deviations <= 1000
    error_message = "thresholds.js_error_rate_deviations must be between 1 and 1000 (New Relic's limits for baseline conditions)."
  }

  validation {
    condition     = var.thresholds.browser_no_traffic_seconds >= 30 && var.thresholds.browser_no_traffic_seconds <= 172800
    error_message = "thresholds.browser_no_traffic_seconds must be between 30 and 172800 (New Relic's limits for loss of signal)."
  }
}

variable "slo_targets" {
  description = "Service level objectives, in percent of good events over 28 days."
  type = object({
    browser_availability = optional(number, 99)
    lcp                  = optional(number, 75)
    inp                  = optional(number, 75)
    cls                  = optional(number, 75)
    maya_availability    = optional(number, 99.5)
    payment_resolution   = optional(number, 99)
  })
  default = {}

  validation {
    condition     = alltrue([for target in values(var.slo_targets) : target > 0 && target < 100])
    error_message = "slo_targets must be above 0 and below 100."
  }
}

variable "ingest_budget" {
  description = "Monthly data ingest to stay under. 100 GB is the free tier's allowance."
  type = object({
    monthly_gb       = optional(number, 100)
    warning_percent  = optional(number, 80)
    critical_percent = optional(number, 90)
  })
  default = {}

  validation {
    condition = (
      var.ingest_budget.monthly_gb > 0 &&
      var.ingest_budget.warning_percent > 0 &&
      var.ingest_budget.warning_percent < var.ingest_budget.critical_percent &&
      var.ingest_budget.critical_percent <= 100
    )
    error_message = "ingest_budget needs monthly_gb above 0 and 0 < warning_percent < critical_percent <= 100."
  }
}

variable "pipeline_rules" {
  description = "Pipeline cloud rules that drop data before it is stored. All off: turn one on when the Ingest page of the dashboard shows it is needed."
  type = object({
    edge_info_logs           = optional(bool, false)
    edge_non_production_logs = optional(bool, false)
  })
  default = {}
}
