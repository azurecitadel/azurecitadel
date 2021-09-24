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

You will be creating your on prem VMs in the first challenge. Choose the right platform for you. This section gives you the heads up and includes a check if you are going to create them in an Azure subscription.

#### Non-Azure

Ideally you will have an on prem platform that you can use to create a few VMs to onboard for the hack scenario's pilot.

For example, if you have acccss to a Hyper-V or VMware vSphere dev cluster, or an account on GCP or AWS, then you may create VMs there to onboard. This will be closer to a real world Azure Arc scenario.

The hack scenario assumes a pilot of:

* 3 x Windows Server 2019 VMs
* 3 x Ubuntu 18.04 VMs

but you may use any number of Windows and Linux VMs operating systems as long as they are on the [supported list](https://docs.microsoft.com/azure/azure-arc/servers/agent-overview#prerequisites) for Azure Arc.

Note that your VMs will require outgoing internet access.

#### Terraformed Azure VMs

Alternatively, we have authored a Terraform repo to create custom VMs in Azure that may then be onboarded to Azure Arc. This is an unsupported scenario but works fine for training and demo purposes.

By default the repo will create:

* 3 x Standard_D2s_v3 VMs for Windows Server 2019 (6 Standard DSv3 Family vCPUs)
* 3 x Standard_A1_v2 VMs for Ubuntu 18.04 (3 Standard Av2 Family vCPUs)

> Terraform variables allow you to change oth the number of VMs and the VM SKUs.

Check your CPU usage:

```bash
az vm list-usage --location uksouth --output table
```

The VMs don't have to be deployed in the same subscription as your main team subscription.

Shut down these VMs in the portal when they are not needed so that they are deallocated and do not incur compute costs.

### Owner role

We will be deploying Azure services, creating role assignments, assigning policies and policy initiatives.

You should have either Owner access, or a combination of roles such as Contributor plus User Access Administrator.

### Service principals

The scale onboarding scripts use a service principal. Standard AAD members have the ability to create service principals by default.

If you are a guest user in the tenancy then the Application Administrator role will allow service principal creation.

You can confirm your access by completing the [checks](#checks) section below.

### Global Admin (optional)

Ideally you will be in a tenant where your [AAD Role](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RolesAndAdministrators) is Global Administrator or Privileged Role Administrator, or you can speak to someone who is. One of the labs uses Windows Admin Center to connect to Azure, and this registers an application with additional AAD access that requires admin consent.

If that is not possible then you skip the Windows Admin Center section of the hack challenge and will onboard the Windows VMs using PowerShell scripts instead.

## Checks

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

1. Remove the service principal

    ```bash
    az ad sp delete --id http://archack-deleteme
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

## References

* <https://docs.microsoft.com/azure/azure-arc/servers/>
* <https://docs.microsoft.com/azure/azure-arc/servers/agent-overview#prerequisites>
* <https://docs.microsoft.com/azure/virtual-machines/linux/quotas>
* <https://docs.microsoft.com/azure/active-directory/manage-apps/grant-admin-consent>

## Next

OK, you should have everything set up now. See you at the hack!
