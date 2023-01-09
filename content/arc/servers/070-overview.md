---
title: "Hack Overview"
description: "Brief overview of the hack flow"
slug: overview
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-overview
series:
 - arc-servers
weight: 070
---

## Landing Zone preparation

Before onboarding your on prem servers as Az\ure Arc-enabled Servers, prepare your hybrid landing zone.

![Landing Zone preparation](/arc/servers/images/overview_prep.png)

These are follow along labs to ensure that the environments are configured consistently.

* Deploy a standard Azure Landing Zone
* Create the Arc Pilot resource group with tagging policies and RBAC role assignments
* Deploy an initiative to get the Azure Monitoring Agent, Dependency agent and enable VM Insights
* Add additional policies to deploy the Microsoft Defender for Endpoint extension, etc.

## Scale Onboarding

THis is a simple split lab to mirror a common onboarding scenario.

![Scale Onboarding](/arc/servers/images/overview_onboard.png)

* Create a service principal and generate scale onboarding scripts for the admins to use
* As the server admins, run the scripts to complete onboarding

## Management & Governance

This is the core of the hack, with a number of challenge labs to explore.

![Core Management & Governance](/arc/servers/images/overview_core.png)

* Inventory
* Workbooks
* Monitoring with AMA and DCRs
* Security integration
* Use SSH for both Windows and Linux
* Deploy Windows Admin Center in the portal
* Demonstrate guest configuration policies for hybrid machines

{{< flash >}}
This is the point we'd like to see all attendees reach.
{{< /flash >}}

## Stretch labs

Additional set of extension focused labs for those who've moved through the core labs quickly.

![Stretch labs](/arc/servers/images/overview_stretch.png)

* Deploy a script to multiple servers using Custom Script Extension
* Push a CA certificate into Key Vault and configure VMs to watch for cert rotation
* Integrate the azcmagent's managed identity to show how to integrate with ARM, Key Vault and PaaS services

## Next

OK, let's start.

Get hands on and deploy a default Azure Landing Zone using the Bicep repository.
