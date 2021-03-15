---
title: "Monitoring"
description: "Configure the new Azure Monitoring Agent and Data Collection Rules. Optionally integrate with Azure Security Center and Azure Sentinel."
layout: single
draft: false
menu:
  side:
    parent: arc-servers-hack
    identifier: arc-servers-hack-monitor
series:
 - arc-servers-hack
weight: 5
---

## Introduction

Azure Monitoring Agent (AMA) is the next version of the monitoring agent deployed to guest operting systems. It will replace the current monitoring agent known as the Log Analytics Agent.

During the onboarding of this hack, your current environment reports to a central Log Analytics workspace that is used by the agents deployed to your virtual machines. The new agent is currently in preview and does not have feature parity with the pre-existing agent.

In this challenge, we will deploy the new agent alongisde the current Log Analytics Agent that will report to a new Log Analytics Workspace. After the onboarding process, we will then utilise the new functionality of this agent.


## Azure Monitoring Agent (AMA)

* Create a new Log Analytics Workspace
* Deploy the new Azure Monitoring Agent to our virtual machines
* Confirm the virtual machines are communicating to the Log Analytics Workspace
* Ensure that the Log Analytics Workspace is set up so that users only have access to the logs of resources they have acces to

## Data Collection Rules (DCRs)

### Security Operations Centers (SOC) team

You are part of the Security Operations Centers (SOC) team.

* Set up a Data Collection Rule for all your Azure arc virtual machines to send their authentication logs to
* (Optional) Validate the authentication logs are visible in the Log Analytics Workspace

### Cost Management team

You are part of the Cost Management team and performing an exercise on reducing costs.

* Deploy a Data Collection Rule to collate the RAM usage data and % of free disk space for all VMs
* (Optional) Produce a workbook showing the % utilisation of CPU, RAM and free disk space for all VMs

### Linux Application Team

You are part of a Linux application team.

* (Optional) Deploy a Data Collection Rule to collate any system errors and send to a Log Analytics Workspace
* (Optional) Create an Azure Monitor Alert to notify the application team on an error

## Integrate with Azure Security Center

* Enable Azure Security Center on your Azure Arc connected machines

## Integrate with Azure Sentinel

* Enable Azure Sentinel on your Azure Arc connected machines by configuring the Log Analytics agent to forward events to Azure Sentinel such as Common Event Format (CEF) or Syslog

## Success criteria

Screen share with your proctor to show that you achieved:

1. Azure Monitoring Agent (AMA) is reporting to your new Log Analytics Workspace
1. Data Collection Rules are applied and data is being gathered from the Azure arc connected machines
1. Open Azure Security Center and view the Secure Score for your Azure arc connected machine
1. From Azure Sentinel, view collected events from your Azure Arc connected machine

## Resources

* [Azure Monitoring Agent](https://docs.microsoft.com/en-us/azure/azure-monitor/agents/azure-monitor-agent-overview)
* [Data Collection Rule](https://docs.microsoft.com/en-us/azure/azure-monitor/agents/data-collection-rule-overview)
* [Azure Monitor Workbook Visualizations](https://docs.microsoft.com/en-us/azure/azure-monitor/visualize/workbooks-chart-visualizations)
* [Create, view, and manage log alerts using Azure Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-log)
* [Connect your non-Azure machines to Security Center](https://docs.microsoft.com/en-us/azure/security-center/quickstart-onboard-machines)
* [Azure Monitor Community GitHub](https://github.com/microsoft/AzureMonitorCommunity)
