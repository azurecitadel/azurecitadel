---
title: "Monitoring"
description: "Configure the new Azure Monitor agent and Data Collection Rules. Optionally integrate with Azure Security Center and Azure Sentinel."
slug: monitor
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-monitor
series:
 - arc-servers
weight: 140
---

## Introduction

Azure Monitoring agent (AMA) is the next version of the monitoring agent deployed to guest operating systems and is now generally available.

In time it will replace the older monitoring agents known as the Log Analytics Agent (MMA), Diagnostics and Telegraf agent, but there are currently some gaps so it is common to install multiple agents to achieve the required functionality. The [Azure Monitor agents overview](https://docs.microsoft.com/azure/azure-monitor/agents/agents-overview) details the current situation and is updated regularly as functionality is migrated over.

In this challenge, we will deploy the new agent. After the onboarding process, we will then utilise the new functionality of this agent.

## Azure Monitor Agent (AMA)

* Deploy the Azure Monitoring Agent to our virtual machines via your preferred CLI
* Confirm the virtual machine's AMA agents are communicating to an Azure Monitor workspace

  > Hint: query for the _heartbeat_

Note that you will be using CLI commands to install the agent rather than the portal or by using Azure Policy. There are Azure Policy and Initiative definitions to install the Azure Monitor Agent, but they do not currently cover Azure Arc VMs. Expect that to change soon.

## Data Collection Rules (DCRs)

### DCR Overview

One of the benefits of the AMA agent is the flexibility in data collection rules, which allow you to define which metrics or logs you want to send to which target, and then associate with different groups of servers including hybrid servers. Some of the policy initiatives will assign an identity, install the extension and associate with a DCR.

Here is an overview of the metric and log collection designed for the pilot.

![DCRs](/arc/servers/images/dataCollectionRules.png)

### Security Operations Centers (SOC) team

You are part of the Security Operations Centers (SOC) team. You have access to the _arc-pilot-soc_

* Set up a Data Collection Rule for all your Azure arc virtual machines to send their security logs to
* (Optional) Validate the security logs are visible in the Log Analytics Workspace

    > _Hint_: The linux security logs are:

    ![DCR](/arc/servers/images/linuxDataSource.png)

### Cost Management team

You are part of the Cost Management team and performing an exercise on reducing costs.

* Deploy a Data Collection Rule to collate the RAM usage data and % of free disk space for all VMs
* (Optional) Produce a workbook showing the % utilisation of CPU, RAM and free disk space for all VMs

### Linux Application Team

You are part of a Linux application team.

* (Optional) Deploy a Data Collection Rule to collate any system errors and send to a Log Analytics Workspace
* (Optional) Create an Azure Monitor Alert to notify the application team on an error

## Integrate with Azure Security Center (optional)

* Enable Azure Security Center on your Azure Arc connected machines

## Integrate with Azure Sentinel (optional)

* Enable Azure Sentinel on your Azure Arc connected machines by configuring the Log Analytics agent to forward events to Azure Sentinel such as Common Event Format (CEF) or Syslog

## Success criteria

Screen share with your proctor to show that you achieved:

1. Azure Monitor Agent (AMA) is reporting heartbeat to your Log Analytics workspace
1. Data Collection Rules are defined and associated correctly with the resources
1. Data is being gathered from the Azure Arc-enabled machines

Optional:

1. Open Azure Security Center and view the Secure Score for your Azure arc connected machine
1. From Azure Sentinel, view collected events from your Azure Arc connected machine

## Resources

* [Azure Monitoring Agent](https://docs.microsoft.com/azure/azure-monitor/agents/azure-monitor-agent-overview)
* [Data Collection Rule](https://docs.microsoft.com/azure/azure-monitor/agents/data-collection-rule-overview)
* [Azure Monitor Workbook Visualizations](https://docs.microsoft.com/azure/azure-monitor/visualize/workbooks-chart-visualizations)
* [Create, view, and manage log alerts using Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/alerts/alerts-log)
* [Connect your non-Azure machines to Security Center](https://docs.microsoft.com/azure/security-center/quickstart-onboard-machines)
