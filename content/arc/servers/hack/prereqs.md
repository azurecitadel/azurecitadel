---
title: "Prereqs"
description: "Attending an Azure Arc for Servers hack? If so then complete these first. And please - do so before the start of the hack!"
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-prereqs
series:
 - arc-servers-hack
aliases:
 - /arc/prereqs
 - /arc/servers/prereqs
weight: 105
---

## Requirements

### Azure subscription

Each hack **team** will need an Azure subscription with sufficient credits. Note the additional requirements further down for both Azure RBAC roles and recommended Azure AD roles.

Ensure the following providers are registered.

* Microsoft.HybridCompute
* Microsoft.GuestConfiguration

```bash
az provider register --namespace 'Microsoft.HybridCompute'
az provider register --namespace 'Microsoft.GuestConfiguration'
```

### On Prem VMs

You will be creating your on prem VMs in the first challenge.

You have a choice:

1. Create your own test VMs for the hack on a non-Azure platform (preferred)
2. Use our Terraform repo to quickly spin up some "on prem" VMs to onboard

#### Non-Azure

Ideally you will have an on prem platform that you can use to create a few VMs. You will then onboard them during the hack as you work through the scenario's pilot.

For example, if you have acccss to a Hyper-V or VMware vSphere dev cluster, or an account on GCP or AWS, then you may create VMs there to onboard. This will be closer to a real world Azure Arc scenario.

The hack scenario assumes a pilot of:

* 3 x Windows Server 2019 VMs (win-01, win-02, win-03)
* 3 x Ubuntu 18.04 VMs (ubuntu-01, ubuntu-02, ubuntu-03)

You may use any number of Windows and Linux VMs operating systems as long as they are on the [supported list](https://docs.microsoft.com/azure/azure-arc/servers/agent-overview#prerequisites) for Azure Arc.

Note that your VMs will require outgoing internet access.

**Feel free to create these in advance.** (The )

#### Terraformed Repo

If you don't have access to another platform to create VMs then we have you covered. We have created a [Terraform repo](https://github.com/terraform-azurerm-examples/arc-onprem-servers) to create custom VMs in Azure that may then be onboarded to Azure Arc. (This is officially an unsupported scenario but works fine for training and demo purposes.)

**You will deploy these "on prem" VMs in the first challenge, but you should check your CPU usage first to make sure you have sufficient quota available.**

By default the repo will create:

* 3 x Standard_D2s_v3 VMs for Windows Server 2019 (6 Standard DSv3 Family vCPUs)
* 3 x Standard_A1_v2 VMs for Ubuntu 18.04 (3 Standard Av2 Family vCPUs)

```bash
az vm list-usage --location uksouth --output table
```

> The repo does allow you to change the VM SKUs and number of VMs.

Note that the VMs don't have to be deployed in the same subscription (or indeed tenant) as your main team subscription. In fact it may be preferable to have them in a separate subscription just to reduce any confusion.

### Owner role

We will be deploying Azure services, creating role assignments, assigning policies and policy initiatives.

**You should have Owner access on your subscription.** (Or an equivalent combination of roles such as Contributor plus User Access Administrator.)

### Service principals

**You will need to be able to create service principals.**

The scale onboarding scripts use a service principal. Standard AAD members have the ability to create service principals by default.

If you are a guest user in the tenancy then the Application Administrator role will allow service principal creation.

You can confirm your access by completing the [checks](#checks) section below.

### Global Admin (optional)

**Ideally you will also be Global Admin.**

If you are working in a tenant where your [AAD Role](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RolesAndAdministrators) is Global Administrator or Privileged Role Administrator - or you can speak to someone who is - then great.

One of the labs uses Windows Admin Center to connect to Azure, and this registers an application with additional AAD access that requires admin consent.

If that is not possible then you will just skip the Windows Admin Center section of the hack challenge and will onboard the Windows VMs using PowerShell scripts instead.

## Checks

**Complete these checks before the hack.**

You will need the Azure CLI for these checks. Log in and check you are in the correct subscription context.

1. Create a service principal with the Azure Connected Machine Onboarding Role at the subscription scope:

    ```bash
    az ad sp create-for-rbac --name http://archack-deleteme --role "Azure Connected Machine Onboarding"
    ```

1. Check Azure RBAC role

    Check the role assignments for the user via the portal:

    * [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade)
    * **Access control (IAM)**
    * **View my access**

    You should have Owner access, or Contributor plus User Access Administrator, which is fundamentally the same.

1. Grab the service principal's appId

    ```bash
    appId=$(az ad sp list --filter "displayname eq 'http://archack-deleteme'" --query "[0].appId" --output tsv)
    ```

1. Remove the service principal

    ```bash
    az ad sp delete --id $appId
    ```

## Setup

### Minimal

The tooling required for this partner hack is lightweight. It is possible to complete the whole hack using the portal and Cloud Shell.

Bash is the recommended Cloud Shell experience, and includes git, terraform and jq as well as the ability to upload files.

Windows Terminal is recommended for most CLI work as it includes a Cloud Shell profile. Having said that, the file upload / download and Monaco editor are only found in the browser.

If using a minimal setup then open the [Cloud Shell](https://shell.azure.com/bash) and extend the Azure CLI with `az extension add --name connectedmachine`.

### Recommended (optional)

Whilst is it possible to complete the hack with the portal and Cloud Shell, we always recommend that you set up your laptop with the right tooling so that you are ready to hit the ground running. The config below will get you ready for this hack and also much of the other content on the Azure Citadel site.

For Windows 10 users who are comfortable in Bash, then the combination of Windows Terminal, Windows Subsystem for Linux and Visual Studio Code (with remote extensions) is perfect.

**Open the [recommended setup](/setup) page in a new tab.**

* Windows Terminal (or iTerm2 for MacOS, Hyper etc. for Linux)
* Linux environment, e.g. Windows Subsystem for Linux
  * Azure CLI, extended with `az extension add --name connectedmachine`
  * jq
  * git
  * Terraform
* Visual Studio Code
* PowerShell, plus the Az module

## Reading

Explore the [Azure Arc product page](https://azure.microsoft.com/services/azure-arc/#product-overview).

Read the [Azure Arc-enabled servers overview](https://docs.microsoft.com/azure/azure-arc/servers/overview) and watch the video.

## References

* <https://azure.microsoft.com/services/azure-arc/#product-overview>
* <https://docs.microsoft.com/azure/azure-arc/servers/>
* <https://docs.microsoft.com/azure/azure-arc/servers/agent-overview#prerequisites>
* <https://docs.microsoft.com/azure/virtual-machines/linux/quotas>
* <https://docs.microsoft.com/azure/active-directory/manage-apps/grant-admin-consent>

## Next

OK, you should be good to go! See you at the hack!
