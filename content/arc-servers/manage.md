---
title: "Challenge: Management baseline"
description: "Use Log Analytics and Azure Automation to enable update management and collect inventory."
layout: single
draft: false
weight: 4
series:
 - arc-servers
menu:
  side:
    parent: arc-servers
---

## Introduction

Azure Automation delivers a cloud-based automation and configuration service that supports consistent management across your Azure and non-Azure environments. It comprises process automation, configuration management, update management, shared capabilities, and heterogeneous features.

In the previous challenge, you onboarded Azure Arc virtual machines to Log Analytics. Azure Arc virtual machines can be managed using cloud based tooling such as Azure Automation and Azure Monitor, which will make use of the Log Analytics connected agents.

In this challenge you will implement a update management strategy and report inventory data.

## Update Management

* Create an Automation account
* Enable Update Management for the Azure Arc virtual machines
* Schedule an update deployment for a weekly security update and full update monthly
* Report update compliance
* Trigger an update deployment and measure its success

## Inventory

* Enable Inventory for the Azure Arc virtual machines
* Review the software and services inventory
* (optional) Install additional software to an Azure Arc virtual machine, view the software in the Inventory

## Log Analytics 

* (optional) Write a Log Analytics query to report the installed Windows Updates and the needed Windows Updates on Azure Arc connected Windows virtual machines
* (optional) Write a Log Analytics query to report the Python version on Azure Arc connected Linux virtual machines

## Success criteria

Screen share with your proctor to show that you achieved:

1. Update Management solution is enabled
1. Deployment schedules are in place for both security and full updates
1. Report on the current update compliance state for all Azure Arc virtual machines
1. Show the update history
1. Inventory solution is enabled
1. Software, Windows Services and Linux Daemons display in the inventory

## Resources

* [Operational compliance in Azure](https://docs.microsoft.com/en-gb/azure/cloud-adoption-framework/manage/azure-management-guide/operational-compliance?tabs=UpdateManagement%2CAzurePolicy%2CAzureBlueprints)
* [An introduction to Azure Automation](https://docs.microsoft.com/en-us/azure/automation/automation-intro)
* [Update Management overview](https://docs.microsoft.com/en-us/azure/automation/update-management/overview)
* [How to deploy updates and review results](https://docs.microsoft.com/en-us/azure/automation/update-management/deploy-updates)
* [Query Update Management logs](https://docs.microsoft.com/en-us/azure/automation/update-management/query-logs)
* [Manage inventory collection from VMs](https://docs.microsoft.com/en-us/azure/automation/change-tracking/manage-inventory-vms)
* [Discover what software is installed on your VMs](https://docs.microsoft.com/en-us/azure/automation/automation-tutorial-installed-software)
