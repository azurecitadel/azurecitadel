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

  Each hack attendee will need an Azure subscription with sufficient credits.

  Ensure the following providers are enabled.

  * Microsoft.HybridCompute
  * Microsoft.GuestConfiguration

  You can also use the Bash Cloud Shell:

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

## Recommended setup

We recommend that you set up your laptop with the right tooling so that you are ready to hit the ground running on the hack.

The tooling required for this partner hack is lightweight. Most of the work will be in the portal and using the Azure CLI. There may also be some PowerShell required.

It is possible to complete the whole hack using the portal and Cloud Shell but we always recommend setting up the right tooling on your machine.

**Open the [recommended setup](/setup) page in a new tab.**

* Windows Terminal (or iTerm2 for MacOS, Hyper etc. for Linux)
* Linux environment, e.g. Windows Subsystem for Linux
  * Azure CLI
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
