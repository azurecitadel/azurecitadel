---
title: "Hub & Spoke"
description: "One of the most common topologies in Azure is hub and spoke, originally introduced as Virtual Data Centre or VDC."
date: 2021-02-01
draft: false
menu:
  side:
    identifier: network-vdc
    parent: network
weight: 2
aliases:
    - /infra/vdc/
---

## Introduction

These are some of the oldest networking labs we have on the site, but they have stood the test of time as hub and spoke is still the most popular topology for those moving away from a single vNet. These labs help you understand how vNet peering works, how to control traffic flows using user defined routes to override the routing tables, and a very basic config for a network virtual appliance.

## NVAs or Azure Firewall

The labs use a Cisco network virtual appliance. Feel free to swap it out for your preferred NVA and configure to forward traffic. Or use the Azure Firewall service which is a great solution for selectively forwarding spoke to spoke traffic. (If you would like to see an Azure Firewall lab then add to the [lab suggestion](https://github.com/azurecitadel/azurecitadel/discussions/7).)

## Other topologies

Hub and spoke is only one topology type for your landing zones. Some prefer the flexibility of full or partial meshes. In multi tenanted environments (e.g. ISVs, or central IT business unit in large organisations) then more comples topologies can come into play. Some like one or more separate management vNets with one way peers to select vNets. There is some good info in the network section of the [architecture](https://aka.ms/architecture) docs. For those who don't want the hassle of managing the hub and all of the peering config and UDRs then look at the [vWAN](https://aka.ms/vwan). Finally, for the largest customers then check out the Enterprise Scale landing zone

## Pre-requisites

The workshop requires the following:

* **Azure Subscription**
  * Confirm that the subscription is valid for the workshop by checking the following in the portal:
    * prove the ability to create resources by creating a new resource group
    * check there are no stringent Virtual Machine or CPU quotas in Subscriptions -> Usage + Quotas
    * within Azure Active Directory, create a test user and group
  * Common pitfalls to avoid:
    * Free Trial accounts may have a CPU quota that is insufficient for the lab environment deployment to successfully complete
    * Redeeming an Azure Pass code against an email address previously used for a trial will succeed, but the activation will fail
    * Using a work email may mean that you do not have write access to the company's directory and therefore you cannot create users and groups
* **Cloud Shell**
  * In the Azure [portal](https://portal.azure.com), click on the Cloud Shell icon at the top of the screen (**>_**)
  * Create the storage account for clouddrive and confirm it is working by typing ```az account show```
* **Bash**
  * Windows Subsystem for Linux is recommended for Windows 10 users
  * Linux and MacOS users - use the standard bash terminal
  * Install the Azure CLI

## Labs
