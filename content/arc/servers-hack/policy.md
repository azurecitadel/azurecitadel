---
title: "Azure Policy"
description: "Use Azure Policy to automate agent deployments and tagging for your Azure Arc Virtual Machines."
layout: single
draft: false
menu:
  side:
    parent: arc-servers-hack
    identifier: arc-servers-hack-policy
series:
 - arc-servers-hack
weight: 3
---

## Introduction

Azure Policy helps to enforce organizational standards and to assess compliance at-scale. Through its compliance dashboard, it provides an aggregated view to evaluate the overall state of the environment, with the ability to drill down to the per-resource, per-policy granularity.

In the previous challenges, you connected resources to Azure using Azure Arc. Azure Arc virtual machines can be governed by Azure Policy to gain insight into the current compliance state of resources as well as to perform tasks at scale, such as onboarding the virtual machines into Azure Monitor or triggering your own custom scripts using extensions.

In this challenge you will explore using Azure Policy to set up your resource group ready for the next challenge where we'll onboard multiple on prem servers.

## Tagging

* Add the following tags to the `arc-hack` resource group.

    | Tag        | Value             |
    |------------|-------------------|
    | platform   | **private cloud** |
    | datacentre | **citadel**       |

> Don't apply any policies for the `arc-hack-resources` resource group. In fact, try to pretent it doesn't exist!

## Policy - Tags

Tagging on resources is useful for filtering resources, and that is even more important when working at scale.

Let's use tagging policies to auto-tag the Azure Arc VMs as we onboard multiple VMs in the next challenge.

* Assign an Azure Policy to inherit the `platform` and `datacentre` tags from the resource group

> No need to remediate the tagging on the existing resources. We'll remediate in the next challenge.

## Log Analytics

We'll set up a workspace for Azure Policy to use and configure it to be ready for the scale onboarding.

* Create a Log Analytics workspace in the arc-hack resource group
* Configure to collect event and performance data from virtual machines
  * You can configure before you've connected VMs
  * System events from the Windows Event Log and syslog from linux
  * Recommended performance counters
  * Ignore events unless they are warning or higher severity level

## Policy - Monitor Extensions

Azure Policy is very useful for automatically deploying agents and extensions using the Deploy If Not Exists effect. Well configure an assignment, linked to the workspace you've just created, so that newly created Azure Arc VMs will get their Log Analytics and Dependency agents automatically installed.

### Policy Initiative

Assign policy at the arc-hack resource group scope to:

* Deploy the Log Analytics agent to the Azure Arc virtual machines
* Deploy the Dependency agent to the Azure Arc virtual machines
* Using the Log Analytics workspace you've just created
* In the remediation tab, specify the region for the identity to be UK South

> Hint_: Check the initiatives in the Monitor category.

Assigning a Deploy If Not Exists policy creates an identity for the deployment. Check the policy assignment and you'll see the managed identity tab and the identity's role assignments.

### Bug fix

There is a [known bug](https://github.com/Azure/azure-policy/issues/733) in the _[Preview] Deploy Dependency agent to Windows Azure Arc machines_ policy definition as the managed identity has insufficient permissions to remediate non-compliance. We'll add on the *Azure Connected Machine Onboarding* so that it will remediate successfully.

The following Azure CLI commands will create the additional roles assignment if you have assigned the expected policy initiative at the ar-hack resource group level.

* Add Azure Connected Machine Onboarding to the policy's identity

  ```bash
  identity=$(az policy assignment list --resource-group arc-hack --query "[?displayName == 'Enable Azure Monitor for VMs'].identity.principalId" --output tsv)
  az role assignment create --assignee $identity --role "Azure Connected Machine Onboarding" --resource-group arc-hack
  ```

### Policy evaluation

Policy evaluations are usually triggered within 30 minutes of policy assignment. There are other triggers for an evaluation, as per the links at the bottom of the page. You can also trigger one manually. We'll do that now so that your Azure Arc VMs, the ones you manually onboarded, are evaluated against your new policies.

* Trigger a policy evaluation manually

  ```bash
  az policy state trigger-scan --resource-group arc-hack
  ```

It can take a while for the VMs to show as non-compliant so feel free to move to the success criteria and onto the next challenge. (We'll remediate in the next challenge.)

## Success criteria

Screen share with your proctor to show that you achieved:

1. The Log Analytic workspace exists and is configured
1. The workspace is automatically tagged with the resource group's tags
1. The Monitor for VMs policy initiative is assigned and linked to the workspace
1. The additional RBAC assignment is in place for the policy's identity

## Resources

* [Azure Policy documentation](https://docs.microsoft.com/azure/governance/policy/)
* [Get compliance data of Azure resources](https://docs.microsoft.com/azure/governance/policy/how-to/get-compliance-data)
* [Overview of Log Analytics in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/logs/log-analytics-overview)
* [Overview of Azure Monitor agents](https://docs.microsoft.com/azure/azure-monitor/agents/agents-overview)
