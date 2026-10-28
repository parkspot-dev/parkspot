# Where the web policy's issues are sent: email, Slack, both or neither.
# With neither, issues still open in New Relic; nothing is sent.

resource "newrelic_notification_destination" "email" {
  count = length(var.alert_emails) > 0 ? 1 : 0

  name = "ParkSpot web alerts (${var.environment})"
  type = "EMAIL"

  property {
    key   = "email"
    value = join(",", var.alert_emails)
  }
}

resource "newrelic_notification_channel" "email" {
  count = length(newrelic_notification_destination.email)

  name           = "ParkSpot web alerts (${var.environment})"
  type           = "EMAIL"
  destination_id = newrelic_notification_destination.email[0].id
  product        = "IINT"

  property {
    key   = "subject"
    value = "ParkSpot ${var.environment}: {{ issueTitle }}"
  }
}

# The Slack destination can't be created here: it needs the OAuth
# handshake in the New Relic UI (see README.md).
resource "newrelic_notification_channel" "slack" {
  count = var.slack == null ? 0 : 1

  name           = "ParkSpot web alerts (${var.environment})"
  type           = "SLACK"
  destination_id = var.slack.destination_id
  product        = "IINT"

  property {
    key   = "channelId"
    value = var.slack.channel_id
  }
}

resource "newrelic_workflow" "web" {
  count = length(var.alert_emails) > 0 || var.slack != null ? 1 : 0

  name                  = "ParkSpot web (${var.environment})"
  muting_rules_handling = "DONT_NOTIFY_FULLY_MUTED_ISSUES"

  issues_filter {
    name = "ParkSpot web (${var.environment}) policy"
    type = "FILTER"

    predicate {
      attribute = "labels.policyIds"
      operator  = "EXACTLY_MATCHES"
      values    = [newrelic_alert_policy.web.id]
    }
  }

  dynamic "destination" {
    for_each = concat(
      newrelic_notification_channel.email[*].id,
      newrelic_notification_channel.slack[*].id,
    )
    content {
      channel_id            = destination.value
      notification_triggers = ["ACTIVATED", "ACKNOWLEDGED", "PRIORITY_CHANGED", "CLOSED"]
    }
  }
}
