---
title: "Azure Policy"
description: "Use Azure Policy to automate agent deployments and tagging for your Azure Arc Virtual Machines."
layout: single
draft: false
menu:
  side:
    parent: arc-servers-hack
series:
 - arc-servers-hack
weight: 3
---

## Introduction

Azure Policy helps to enforce organizational standards and to assess compliance at-scale. Through its compliance dashboard, it provides an aggregated view to evaluate the overall state of the environment, with the ability to drill down to the per-resource, per-policy granularity.

In the previous challenges, you connected resources to Azure using Azure Arc. Azure Arc virtual machines can be governed by Azure Policy to gain insight into the current compliance state of resources as well as to perform tasks at scale, such as onboarding the virtual machines into Azure Monitor or triggering your own custom scripts using extensions.

In this challenge you will explore using Azure Policy to onboard the Azure Arc virtual machines to a Log Analytics workspace and apply Tags to the Azure Arc virtual machines.

## Log Analytics

* Create a Log Analytics workspace
* Collect event and performance data from virtual machines connected to the Log Analytics workspace
  * System events from the Windows Event Log and syslog from linux
  * Recommended performance counters
  * Ignore events unless they are warning or higher severity level
* Manually add the Log Analytics agent to the two Azure Arc VMs

# Tagging

Add Location and Owner tags to the arc-hack resource group.

## Azure Policy

Assign Policy to:

* Deploy the Log Analytics agent to the Azure Arc virtual machines
* Deploy the Dependency agent to the Azure Arc virtual machines
* Inherit the two tags from the Resource Group to the Azure Arc virtual machines
* Use remediation tasks to make the two VMs fully compliant
* (optional) Deploy a custom script to the Azure Arc virtual machines


## Success criteria

Screen share with your proctor to show that you achieved:

1. Azure Arc virtual machines are connected to the Log Analytics
1. Performance data (such as disk % free space) can be viewed in Log Analytics
1. Azure Arc virtual machines are automatically tagged with the Resource Group (or Subscription) Tags
1. Show a customer script has ran successfully on an Azure Arc virtual machine

## Resources

* [Azure Policy documentation](https://docs.microsoft.com/en-us/azure/governance/policy/)
* [Overview of Log Analytics in Azure Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview)
* [Collect data from an Azure virtual machine with Azure Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/vm/quick-collect-azurevm)
* [Overview of Azure Monitor agents](https://docs.microsoft.com/en-us/azure/azure-monitor/agents/agents-overview)
