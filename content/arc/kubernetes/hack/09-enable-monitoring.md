---
title: "Enable Monitoring"
description: "What's going on in those clusters?"
slug: enable-azure-monitor
menu:
  side:
    parent: arc-k8s
    identifier: arc-k8s-monitoring
series:
 - arc-k8s-hack
weight: 20
---

## Background

It would be great to see application and infrastructure level metrics being reported across all clusters in a single place to allow you to diagnose errors before your customers even notice.

## Challenge

*Persona: Operations*

### Operations

* Set up Azure Monitor to see the traffic flowing
* Fire an alert on an error
* Create a workbook for standard operations
* Ensure policy exists for enforcing monitoring

### Application Developer

* Use Azure Monitor to see the traffic flowing

**Stretch** Can you create a load test using someth
* Create a [load test](example.com) to get insights into peak application load

## Success Criteria
## References

* [Azure Monitor for Kubernetes](https://docs.microsoft.com/azure/azure-monitor/containers/container-insights-enable-arc-enabled-clusters)
* [Enforce with Policy](https://docs.microsoft.com/azure/azure-monitor/containers/container-insights-enable-aks-policy)