---
title: "Day 2"
description: "Sessions on day two of the enterprise-scale hack, customising the default deployment to match your design."
layout: series
menu:
  side:
    parent: es
    identifier: es-hack-day2
series:
 - es
weight: 6
draft: false
---

## Agenda

| **Time** | **Description**
|---|---|
| 09:30 | Day 2 kick off |
| 09:45 | Azure Policy in Enterprise-scale |
| 10:30 | **Hacking** - Bridging the gap from Enterprise-scale to customer requirements |
| 15:00 | **Within your group** - Show Policy and Management Group progress |
| 15:30 | Q&A, Day 2 closeout |

## Lightning talks ⚡

| **Time** | **Description**
|---|---|
| 11:00 - 11:30 | Azure Virtual WAN |
| 14:00 - 14:30 | Creating custom policies from scratch |

## Example Policy Matrix

| Requirement | Policy Definition (hyperlink) | Assigned Scope |
|- |- |- |
| Require built-in platform regulatory compliance security checks and reporting for all production environments (PCI, ISO27001, CIS etc.) | e.g. [Built-in][1] | e.g. Landing Zones |
| Azure Hybrid Use Benefit must be enabled on Production only VMs | |
| All subnets must be protected by NSGs | |
| All resources and resource groups must be tagged with: Cost-centre, environment, it-owner-contact, service-applicaiton | |
| Activity Logs for all subscriptions and diagnostics settings for all resources must be sent to Log Analytics workspace | |
| Block specified VM SKUs (M-Series or LS-Series) | |
| Transparent Data Encryption should be enabled on all Azure SQL DBs | |
| Azure Monitor for VMs should be enabled on all Production VMs and any agents automatically installed | |
| Azure Backup should be enabled on all Production VMs | |
| No Public IP addresses are allowed except for NVAs/Firewalls/VPNs/ER/Virtual WAN, Connectivity and Sandbox | |


[1]: https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Regulatory%20Compliance/ISO27001_2013_audit.json
