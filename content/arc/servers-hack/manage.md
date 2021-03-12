---
title: "Management"
description: "Create a management baseline for the connected machines. Enable update management and inventory."
layout: single
draft: false
menu:
  side:
    parent: arc-servers-hack
series:
 - arc-servers-hack
weight: 6
---

## Introduction

Azure Automation delivers a cloud-based automation and configuration service that supports consistent management across your Azure and non-Azure environments. It comprises process automation, configuration management, update management, shared capabilities, and heterogeneous features.

In the Azure Policy challenge, you onboarded Azure Arc virtual machines to Log Analytics. Azure Arc virtual machines can be managed using cloud based tooling such as Azure Automation and Azure Monitor, which will make use of the Log Analytics connected agents.

In this challenge you will implement a update management strategy and report inventory data.

## Update Management

> Note: Connect the Automation account to the Log Analytics workspace created in the Azure Policy challenge (Log Analytics agent)

* Create an Automation account
* Enable Update Management for the Azure Arc virtual machines
* Schedule an update deployment for a weekly security update and full update monthly
* Report update compliance
* Trigger an update deployment and measure its success

## Inventory

> Note: Connect the Automation account to the Log Analytics workspace created in the Azure Policy challenge (Log Analytics agent)

* Enable Inventory for the Azure Arc virtual machines
* Review the software and services inventory
* (optional) Install additional software to an Azure Arc virtual machine, view the software in the Inventory

## Log Analytics

* (optional) Write a Log Analytics query to report the installed Windows Updates and the needed Windows Updates on Azure Arc connected Windows virtual machines
* (optional) Write a Log Analytics query to report the Python version on Azure Arc connected Linux virtual machines

## Azure Monitor Workbooks

* Create an update assessment Workbook to visualize update compliance and detail missing updates

## Success criteria

Screen share with your proctor to show that you achieved:

1. Update Management solution is enabled
1. Deployment schedules are in place for both security and full updates
1. Report on the current update compliance state for all Azure Arc virtual machines
1. Show the update history
1. Inventory solution is enabled
1. Software, Windows Services and Linux Daemons display in the inventory
1. Show update compliance with an Azure Monitor Workbook

## Resources

* [Operational compliance in Azure](https://docs.microsoft.com/en-gb/azure/cloud-adoption-framework/manage/azure-management-guide/operational-compliance?tabs=UpdateManagement%2CAzurePolicy%2CAzureBlueprints)
* [An introduction to Azure Automation](https://docs.microsoft.com/en-us/azure/automation/automation-intro)
* [Update Management overview](https://docs.microsoft.com/en-us/azure/automation/update-management/overview)
* [How to deploy updates and review results](https://docs.microsoft.com/en-us/azure/automation/update-management/deploy-updates)
* [Query Update Management logs](https://docs.microsoft.com/en-us/azure/automation/update-management/query-logs)
* [Manage inventory collection from VMs](https://docs.microsoft.com/en-us/azure/automation/change-tracking/manage-inventory-vms)
* [Discover what software is installed on your VMs](https://docs.microsoft.com/en-us/azure/automation/automation-tutorial-installed-software)
* [Azure Monitor Workbooks](https://docs.microsoft.com/en-us/azure/azure-monitor/visualize/workbooks-overview)
* [GitHub - Azure Monitor Community repository (Workbook, Queries and Alerts)](https://github.com/microsoft/AzureMonitorCommunity)