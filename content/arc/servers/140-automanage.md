---
title: "Azure Automanage"
description: "Use the Azure Automanage service to create a management baseline for the connected machines, enabling update management and inventory. Or use the services individually."
slug: automanage
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-automanage
series:
 - arc-servers
weight: 140
---

## Introduction

The [operational compliance](https://docs.microsoft.com/azure/cloud-adoption-framework/manage/azure-management-guide/operational-compliance) for Azure virtual machines recommends leveraging the services shown below, which historically have all been individually configured.

![Azure Automanage](/arc/servers/images/azureAutomanage.png)

Azure Automanage simplifies management by bringing these various services together under best practice configurations covering both Production and Test/Dev scenarios.

Once your on prem machines are Azure Arc-enabled, you can take advantage of Automanage as you go beyond monitoring, alerting and security. For Azure-Arc VMs it has the benefit of installing the older MMA and Dependency agents. This hack does not use them for logs and metrics (preferring to use the AMA agents), but they are currently used for other functionality such as change and update management.

Please note that this is currently a preview service, and it does not yet cover all of the services in the diagram for Azure Arc VMs, but it is the fastest and simplest way to install the agents and benefit from:

* configuration management
* automation accounts
* update management
* change tracking and inventory

## Pricing

Everything we have done with Azure Arc so far has been free, if you ignore the costs relating to other Azure services such as additional Azure Monitor workspace usage.

Be aware that using Azure Policy guest configuration (including Azure Automation change tracking, inventory, state configuration) has a monthly per server [Azure Arc price](https://azure.microsoft.com/pricing/details/azure-arc/).

## Azure Automanage

Automanage can be enabled through the *Automanage - Azure machine best practices* resource in the Azure Portal. This quick start will create a managed Log Analytics workspace, Automation account and Recovery Services vault for Automanage.

Enable and configure:

* Enable Automanage on the 6 Azure Arc-enabled VMs
* What is the difference between Production and Dev / Test configuration profiles?
* Which services are not yet available for Azure Arc-enabled servers?
* Which services can be customised using a custom profile?

It will take up to 30 minutes for the servers to become configured and the associated services to propgate and send data. Once complete then explore one of the Windows Azure Arc-enabled VMs.

* Which additional Azure Policies have been applied?
* Which additional extensions have been installed?
* Explore the Insights in the Monitoring blade
* Explore the Inventory on the Operations blade

> Note, the Log Analytics Workspace, Automation Account and Recovery Vault can be customized when [creating a custom profile using ARM templates](https://docs.microsoft.com/en-us/azure/automanage/virtual-machines-custom-profile#create-a-custom-profile-using-azure-resource-manager-templates).

## Update Management

Automanage will deploy and Automation Account and connect the Arc-enabled VMs to it.

Use Update Management within the Automation Account created by Automanage to schedule updates for the VMs managed by Automanage.

* Create and schedule update deployments
  * _arc-windows-security-weekly_
  * _arc-windows-full-monthly_
  * _arc-linux-security-weekly_
  * _arc-linux-full-monthly_
* Report update compliance
* Trigger a one time update deployment and measure its success
* Write a Log Analytics query (optional) to report on
  * the installed Windows Updates
  * the required Windows Updates

## Inventory and Change Tracking

The change tracking is more interesting once the servers have been configured for a longer period of time, but we can force a change through

Use Inventory within the Automation Account created by Automanage to report on changes within the VMs managed by Automanage.

* Review the Inventory on a Linux VM
* Install the _tree_ package on one of the Linux VMs
  * For Ubuntu: `sudo apt update && sudo apt install tree`
* Review the change tracking
  * Explore the settings
* Write a Log Analytics query (optional) to report on
  * the Python software versions installed on the Linux Azure Arc-enabled servers

## Azure Monitor Workbooks

Azure Monitor workbooks can provide visual dashboards for many aspects of operational management.

The [Azure Monitor Community repository](https://github.com/microsoft/AzureMonitorCommunity) has many samples to get you started with basic and advanced workbooks.

* Create an update assessment Workbook to visualize update compliance and detail missing updates

## Success criteria

Screen share with your proctor to show that you achieved:

1. Successfully onboarded the Azure Arc VMs with Automanage
1. Deployment schedules are in place for both security and full updates
1. Report on the current update compliance state for all Azure Arc virtual machines
1. Show the inventory and update history
    * software and services on Windows
    * Windows Services and Linux Daemons display in the inventory
    * show a change in installed software
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
* [GitHub - Azure Monitor Community repository (sample Workbooks, Queries and Alerts)](https://github.com/microsoft/AzureMonitorCommunity)
* [Azure Arc pricing](https://azure.microsoft.com/pricing/details/azure-arc/)
