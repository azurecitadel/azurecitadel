---
title: "Prereqs"
description: "Attending one of our Azure Arc hacks? Get these completed before it starts."
layout: single
draft: false
menu:
  side:
    parent: arc
    identifier: arc-prereqs
aliases:
 - /arc-servers/prereqs/
series:
 - arc
weight: 2
---


## Requirements

* **Azure subscription**

  Each hack attendee will need an Azure subscription with sufficient credits. The hack will create 10 x Standard_D2s_v3 so 20 cores, plus 10 public IP addresses. Check your quotas have enough headroom to provision.

  Ensure the following providers are enabled.

  * Microsoft.HybridCompute
  * Microsoft.GuestConfiguration

  You can use the Bash Cloud Shell to enable:

  ```bash
  az provider register --namespace 'Microsoft.HybridCompute'
  az provider register --namespace 'Microsoft.GuestConfiguration'
  ```

  We will use sensible VM SKUs and shutdown those VMs overnight to minimise the spend.

* **Owner role**

  You will need to have a role assigned on the subscription that allows you to complete the hack activity. We will be deploying services, creating roles and role assignments, and assigning policies and policy initiatives.

  You should have either Owner access, or a combination of roles such as Contributor plus User Access Administrator.

* **Service principals**

  You will need to be able to create and delete service principals.

  Standard member users in AAD have that permission by default.

  If you are a guest user in the tenancy then you will need (at minimum) the Application Administrator role assigned to you.

You can confirm your access by following the [checks](#checks) section below.

## Minimal setup

The tooling required for this partner hack is lightweight.

It is possible to complete the whole hack using the portal and Cloud Shell.

Bash is the recommended Cloud Shell experience, and includes git, terraform, jq and ansible as well as the ability to upload files.

Windows Terminal is recommended for most CLI work as it directly supports the Cloud Shell. (Use the drop down to select Cloud Shell, or set Cloud Shell as your default profile.) Having said that, the file upload / download and Monaco editor (`code .`) are only found in the browser.

If using a minimal setup then open the [Cloud Shell](https://shell.azure.com) and extend the Azure CLI with `az extension add --name connectedmachine`.

## Recommended setup

Whilst is it possible to complete the hack with the portal and Cloud Shell, we strongly recommend that you set up your laptop with the right tooling so that you are ready to hit the ground running on the hack. The config below will get you ready for this hack and also much of the other content on the Azure Citadel site.

For Windows 10 users who are comfortable in Bash, then the combination of Windows Terminal, Windows Subsystem for Linux and Visual Studio Code (with remote extensions) is perfect.

**Open the [recommended setup](/setup) page in a new tab.**

* Windows Terminal (or iTerm2 for MacOS, Hyper etc. for Linux)
* Linux environment, e.g. Windows Subsystem for Linux
  * Azure CLI, extended with `az extension add --name connectedmachine`
  * jq
  * git
  * Terraform
  * Ansible
* Visual Studio Code
* PowerShell, plus the Az module

## Checks

You will need the Azure CLI for these checks. Log in and check you are in the correct subscription context.

1. Create a service principal with the Azure Connected Machine Onboarding Role at the subscription scope:

    ```bash
    az ad sp create-for-rbac --name http://archack-deleteme --role "Azure Connected Machine Onboarding"
    ```

1. Check roles

    Check the role assignments for the user via the portal:

    * [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade)
    * **Access control (IAM)**
    * **View my access**

    You should have Owner access, or Contributor plus User Access Administrator, which is fundamentally the same.

1. Remove the service principal

    ```bash
    az ad sp delete --id http://archack-deleteme
    ```

## Next

OK, you should have everything set up now. See you at the hack!
