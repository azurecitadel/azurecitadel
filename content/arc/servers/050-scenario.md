---
title: Scenario
description: "Your customer, Wide World Importers, would like a small proof of concept before moving forward with a larger Azure Arc project. Get the background and their initial requirements."
slug: scenario
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-scenario
series:
 - arc-servers
weight: 050
---

## Introduction

You are working with a company called Wide World Importers. They are already using Azure with their identities synced to Azure AD. They have migrated a number of existing systems and deployed some new cloud native workloads. The cloud team has quickly skilled up on the platform and makes good use of the Azure's management tooling, automation and governance.

The company also has a sizeable on prem estate which is mainly virtual machines plus a few physical x86 servers. They have concerns that they do not know the full inventory of these on prem systems. There is a growing focus on compliancy and governance and there is a business risk in being non-compliant on those legacy servers.

The imperative is to move to a more elegant hybrid management and operations model. The plan is to merge the teams and upskill those who have been working purely with the on prem systems.

You have been tasked to help work with them on a pilot of a few POC Windows and Linux (Ubuntu) servers to evaluate how the hybrid model could work from a deployment, configuration and management perspective, and whether there are opportunities to move away from some of the legacy management tooling. The outcome of the pilot will determine how the teams will initially work and scale from the small number of servers in the pilot to the wider estate.

Wide World Importers wishes to adhere to the Azure landing zone within the Cloud Adoption Framework. Also included in the POC requirement

* use Azure Monitor Agent for logs and metrics
* demonstrate that on prem governance can be enabled

## Foundation

When you are onboarding VMs at scale then it makes sense to prepare the target environment first. As this is a small pilot then everything will be configured on a single resource group.

There is an excellent page and 10 minute video on Azure Docs called [Plan and deploy Azure Arc-enabled servers](https://docs.microsoft.com/azure/azure-arc/servers/plan-at-scale-deployment). Watch the video when you get the opportunity.

Go to [aka.ms/adopt/hybrid](https://aka.ms/adopt/hybrid) for a fuller set of Cloud Adoption Framework documentation for hybrid and multi-cloud.

## Resources

* <https://docs.microsoft.com/azure/azure-arc/servers/plan-at-scale-deployment>
* <https://docs.microsoft.com/azure/governance/policy/assign-policy-portal>
* <https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#tags>
* <https://aka.ms/adopt/hybrid>

## Next up

The next few labs will cover target environment preparation:

1. Default deployment of an Azure Landing Zone
1. Additional policy assignments for Azure Arc-enabled Servers
1. Custom policy creation for additional extension installation
1. Target resource group and service principal for onboarding

Let's start with the default deployment of the Azure landing zone.
