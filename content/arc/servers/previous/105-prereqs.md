---
title: "Prereqs"
description: "Attending an Azure Arc for Servers hack? If so then complete these first. And please - do so before the start of the hack!"
slug: prereqs
layout: single
draft: true
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-prereqs
series:
 - arc-servers
aliases:
 - /arc/prereqs
weight: 110
---

## Required reading

1. [Azure Arc product page](https://azure.microsoft.com/services/azure-arc/#product-overview)
1. [Azure Arc-enabled servers overview](https://docs.microsoft.com/azure/azure-arc/servers/overview) (including the video)
1. Explore the [hybrid and multicloud scenario](https://aka.ms/adopt/hybrid) for the Cloud Adoption Framework

## Azure subscription

> ⚠️ **Note that teams attending a UK [Azure Arc for Servers partner hack](https://aka.ms/AzureArcforServersPartnerHack) will be provided with subscriptions.** You will be invited as Guest Users to a new tenant and will be assigned as Global Admins and Owners.

1. Azure subscription

    Minimum one per **team**. Owner RBAC role assignment on the subscription is required as you will be creating resources and assigning RBAC roles and policies.

1. Required providers

    ```bash
    az provider register --namespace 'Microsoft.HybridCompute'
    az provider register --namespace 'Microsoft.GuestConfiguration'
    ```

## Azure Active Directory

**Global Administrator AAD role is recommended.**

One of the labs uses Windows Admin Center to connect to Azure, and this registers an application with additional AAD access. This process requires Graph API admin consent and therefore Global Administrator.

> If that is not possible then you will just skip the Windows Admin Center section of the hack challenge and will onboard the Windows VMs using PowerShell scripts instead.

## Setup

The tooling required for this partner hack is lightweight. It is possible to complete the whole hack using the **portal and Cloud Shell**. Bash is the recommended Cloud Shell experience. The Cloud Shell includes git, terraform and jq as well as the ability to upload files.

> *Recommended* Our preference is to use Windows Terminal, Windows Subsystem for Linux and Visual Studio Code (with remote extensions). This has more functionality and proves more stable for longer sessions. Check out the relevant [setup](/setup) sections.

1. Extend the Azure CLI

    ```bash
    az extension add --name connectedmachine
    ```

## References

* <https://azure.microsoft.com/services/azure-arc/#product-overview>
* <https://aka.ms/adopt/hybrid>
* <https://docs.microsoft.com/azure/azure-arc/servers/>
* <https://docs.microsoft.com/azure/azure-arc/servers/agent-overview#prerequisites>
* <https://docs.microsoft.com/azure/virtual-machines/linux/quotas>
* <https://docs.microsoft.com/azure/active-directory/manage-apps/grant-admin-consent>

## Next

* Azure Arc for Servers partner hack

    ⚠️ For those of you attending an Azure Arc for Servers partner hack then you should now be good to go. We have pre-configured everything else for you so that you can make the best use of your time.

    We'll see you when the hack starts. The kick off meeting will be in the General channel within the dedicated *Azure Arc for Servers partner hack* team.

* Others

    For those of you making use of the content here - welcome! - then you will need your own ["on prem" VMs](../onprem-vms) to onboard.
