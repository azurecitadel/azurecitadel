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

In this challenge you will explore using Azure Policy to onboard the Azure Arc virtual machines to a Log Analytics workspace and apply Tags to the Azure Arc virtual machines.

## Tagging

* Add the following tags to the `arc-hack` resource group.

    | Tag        | Value             |
    |------------|-------------------|
    | platform   | **private cloud** |
    | datacentre | **citadel**       |

## Azure Policy

* Assign an Azure Policy to inherit the `platform` and `datacentre` tags from the resource group
* Remediate the tagging on the two existing VMs

## Log Analytics

* Create a Log Analytics workspace
* Collect event and performance data from virtual machines connected to the Log Analytics workspace
  * System events from the Windows Event Log and syslog from linux
  * Recommended performance counters
  * Ignore events unless they are warning or higher severity level
* Manually add the Log Analytics agent to the two Azure Arc VMs

## Azure Policy

* Assign policy to:
  * Deploy the Log Analytics agent to the Azure Arc virtual machines
  * Deploy the Dependency agent to the Azure Arc virtual machines
* Use remediation tasks to make the two VMs fully compliant

> Note that there is a [known bug](https://github.com/Azure/azure-policy/issues/733) in the _[Preview] Deploy Dependency agent to Windows Azure Arc machines_ policy definition as the managed identity has insufficient permissions to remediate non-compliance.
>
> The built-in role *Azure Connected Machine Onboarding* has sufficient permission to write to Arc resources.
>
> The following Azure CLI commands will assign sufficient privileges if you have assigned the expected policy initiative.
>
> ```bash
> identity=$(az policy assignment list --resource-group arc-hack --query "[?displayName == 'Enable Azure Monitor for VMs'].identity.principalId" --output tsv)
> az role assignment create --assignee $identity --role "Azure Connected Machine Onboarding" --resource-group arc-hack
> ```

## Success criteria

Screen share with your proctor to show that you achieved:

1. Azure Arc virtual machines are connected to the Log Analytics
1. Performance data (such as disk % free space) can be viewed in Log Analytics
1. Azure Arc virtual machines are automatically tagged with the Resource Group (or Subscription) Tags

## Resources

* [Azure Policy documentation](https://docs.microsoft.com/en-us/azure/governance/policy/)
* [Overview of Log Analytics in Azure Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview)
* [Collect data from an Azure virtual machine with Azure Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/vm/quick-collect-azurevm)
* [Overview of Azure Monitor agents](https://docs.microsoft.com/en-us/azure/azure-monitor/agents/agents-overview)
