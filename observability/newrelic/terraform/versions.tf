terraform {
  required_version = ">= 1.5"

  required_providers {
    newrelic = {
      source = "newrelic/newrelic"
      # 3.99 fixed removing a condition's critical or warning block.
      version = "~> 3.100"
    }
  }
}
