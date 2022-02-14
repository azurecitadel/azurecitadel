---
title: "Enable Monitoring"
description: "What's going on in those clusters?"
slug: enable-azure-monitor
menu:
  side:
    parent: arc-kubernetes
    identifier: arc-kubernetes-monitoring
series:
 - arc-kubernetes
weight: 20
---

## Background

It would be great to see application and infrastructure level metrics being reported across all clusters in a single place to allow you to diagnose errors before your customers even notice.

## Challenge 7

*Persona: Operations*

### Operations

* Set up Azure Monitor and Container Insights to get visibility into your cluster and application health
* Set an alert with an action for when Node CPU % is more than 80%
* Create a workbook for standard operations
* Add an Azure Policy to enforce monitoring of your cluster

### Application Developer

* Use Azure Monitor and Container Insights to view the various default workbooks

## Success Criteria

* An alert rule exists for when Node CPU % exceeds 80%
* Cluster is compliant with Azure Policy enforcing monitoring

## References

* [Azure Monitor for Kubernetes](https://docs.microsoft.com/azure/azure-monitor/containers/container-insights-enable-arc-enabled-clusters)
* [Enforce with Policy](https://docs.microsoft.com/azure/azure-monitor/containers/container-insights-enable-aks-policy)
* [Alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/alerts/alerts-log#create-a-log-alert-rule-with-the-azure-portal)