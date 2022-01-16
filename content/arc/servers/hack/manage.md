---
title: "Management"
description: "Use the preview Azure Automanage service to create a management baseline for the connected machines, enabling update management and inventory. Or use the services individually."
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-hack-manage
series:
 - arc-servers-hack
weight: 150
---

## Introduction

The [operational compliance](https://docs.microsoft.com/azure/cloud-adoption-framework/manage/azure-management-guide/operational-compliance) for Azure virtual machines recommends leveraging the services shown below, which historically have all been individually configured.

![Azure Automanage](/arc/servers/images/azureAutomanage.png)

The good news is that Azure Automanage simplifies management by bringing these various services together under best practice configurations covering both Production and Test/Dev scenarios.

Once your on prem machines are Azure Arc-enabled then you can also take advantage of Automanage as you go beyond monitoring, alerting and security. For Azure-Arc VMs it has the benefit of installing the older MMA and Dependency agents. This hack does not use them for logs and metrics (preferring to use the AMA agents), but they are currently used for other functionality such as change and update management.

Please note that this is currently a preview service, and it does not yet cover all of the services in the diagram for Azure Arc VMs, but it is the fastest and simplest way to install the agents and benefit from:

* configuration management
* automation accounts
* update management
* change tracking and inventory

Note that it is possible to configure all of the services individually. See the links in the [Resources](#Resources)section below.

## Pricing

Note that everything we have done with Azure Arc so far has been free, if you ignore the  costs relating to other Azure services such as additional Azure Monitor workspace usage.

Be aware that using Azure Policy guest configuration (including Azure Automation change tracking, inventory, state configuration) has a monthly per server [Azure Arc price](https://azure.microsoft.com/pricing/details/azure-arc/).

## Azure Automanage

Configure:

* Enable Automanage on the 6 Azure Arc-enabled VMs
  * create a new Automation Account called arc-pilot-automanage

* What is the difference between Prod and Test/Dev configurations?
* Which services are not yet available for Azure Arc-enabled servers?
* Which services can be customised?

It will take a little while for the servers to become configured and the associated services to propgate and send data. Once complete then explore one of the Windows Azure Arc-enabled VMs.

* Which additional Azure Policies have been applied?
* Which additional extensions have been installed?
* Explore the Insights in the Monitoring blade
* Explore the Inventory on the Operations blade

## Update Management

* Schedule update deployments
  * _arc-windows-security-weekly_
  * _arc-windows-full-monthly_
  * _arc-linux-security-weekly_
  * _arc-linux-full-monthly_
* Report update compliance
* Trigger an update deployment and measure its success
* Write a Log Analytics query (optional) to report on
  * the installed Windows Updates
  * the required Windows Updates

## Inventory and Change Tracking

The change tracking is more interesting once the servers have been configured for a longer period of time, but we can force a change through

* Review the Inventory on a linux VM
* Install the _tree_ package on one of the linux VMs
  * For Ubuntu: `sudo apt update && sudo apt install tree`
* Review the change tracking
  * Explore the settings
* Write a Log Analytics query (optional) to report on
  * the Python software versions on the linux Azure Arc-enabled servers

## Azure Monitor Workbooks

* Create an update assessment Workbook to visualize update compliance and detail missing updates

## Success criteria

Screen share with your proctor to show that you achieved:

1. Successfully Automanaged Azure Arc VMs
1. Deployment schedules are in place for both security and full updates
1. Report on the current update compliance state for all Azure Arc virtual machines
1. Show the inventory and update history
    * software and services on Windows
    * software and linux daemons , Windows Services and Linux Daemons display in the inventory
    * show the change in installed software
1. Show update compliance with an Azure Monitor Workbook

## Resources

* [Operational compliance in Azure](https://docs.microsoft.com/azure/cloud-adoption-framework/manage/azure-management-guide/operational-compliance)
* [Azure Automanage](https://docs.microsoft.com/azure/automanage/automanage-virtual-machines)
* [Azure Automanage for Arc-enabled servers](https://docs.microsoft.com/azure/automanage/automanage-arc)
* [Configuration management for Azure Arc-enabled servers](https://docs.microsoft.com/azure/architecture/hybrid/azure-arc-hybrid-config)
* [An introduction to Azure Automation](https://docs.microsoft.com/azure/automation/automation-intro)
* [Update Management overview](https://docs.microsoft.com/azure/automation/update-management/overview)
* [Enable Update Management from am Automation Account](https://docs.microsoft.com/azure/automation/update-management/enable-from-automation-account)
* [How to deploy updates and review results](https://docs.microsoft.com/azure/automation/update-management/deploy-updates)
* [Query Update Management logs](https://docs.microsoft.com/azure/automation/update-management/query-logs)
* [Manage inventory collection from VMs](https://docs.microsoft.com/azure/automation/change-tracking/manage-inventory-vms)
* [Discover what software is installed on your VMs](https://docs.microsoft.com/azure/automation/automation-tutorial-installed-software)
* [Azure Monitor Workbooks](https://docs.microsoft.com/azure/azure-monitor/visualize/workbooks-overview)
* [GitHub - Azure Monitor Community repository (Workbook, Queries and Alerts)](https://github.com/microsoft/AzureMonitorCommunity)
* [Azure Arc pricing](https://azure.microsoft.com/pricing/details/azure-arc/)
