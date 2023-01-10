---
title: Additional policy assignments
description: "Explore some of the other built-in and custom policies for Azure Arc-enabled servers. Assign a few additional policies."
slug: assign
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-assign
series:
 - arc-servers
weight: 135
---

## Introduction

You have already added to the default set of Azure Landing Zone policy assignments with additional policies for tagging and VM Insights.

In this lab you will extend the set of assigned policies with a few more inbuilt and custom policy initiatives designed for hybrid estates. The *Deploy if Not Exists* policies are useful to help automate configuration of resources including the installation of extension on hybrid machines.

Wide World Importers have asked for some additional policy and policy initiatives to be assigned at the Landing Zones management group.

| **Name** | **Category** | **Type** |
|---|---|---|
||||
| The legacy Log Analytics extension should not be installed on Azure Arc enabled Linux servers | Monitoring | Policy |
| The legacy Log Analytics extension should not be installed on Azure Arc enabled Windows servers | Monitoring | Policy |
| \[Preview]: Deploy Microsoft Defender for Endpoint agent | Security Center | Initiative |
||||

The Microsoft Defender for Endpoint (MDE) agent has historically been a standalone agent install and was separately licenced. The direction of travel is towards Azure Arc being used as the framework for agent extensibility and with billing simplified through the Azure's Cost Management and Billing mechanisms.

We will look more closely at Microsoft Defender for Cloud and Microsoft Defender for Endpoint in later labs.

## Challenge

* Assign the two individual policies
* Assign the MDE agent deployment initative
* Use automation to assign - not the portal

It is up to you whether you use the CLI, PowerShell, REST, ARM, Bicep or Terraform. You'll find links to the quickstarts [below](#resources).

## Stretch target

If you have time

* add the two individual policies into a custom policy initative and assign that instead

Policy initiatives are more flexible than multiple individual policies as you can add new policies to them. And they make it easier to report and manage from a compliancy perspective.

> Remember the individual compliancy messages you used on the tagging policies? There is a way of linking individual non-compliancy messages to specific policies within the policy initiative.

## Success criteria

Show your proctor that you have:

* assigned the policies to check that the MMA is *not* installed
* assigned the policy initative to install the MDE

Stretch:

Show how you:

* created and assigned the initiative
* if you were specific with non-compliancy messages, either
    * the CLI command and switch
    * the initiative assignment property

## Resources

* <https://learn.microsoft.com/azure/governance/policy/overview>
* <https://learn.microsoft.com/azure/governance/policy/assign-policy-azurecli>
* <https://learn.microsoft.com/azure/governance/policy/assign-policy-powershell>
* <https://learn.microsoft.com/azure/governance/policy/assign-policy-rest-api>
* <https://learn.microsoft.com/azure/governance/policy/assign-policy-template>
* <https://learn.microsoft.com/azure/governance/policy/assign-policy-bicep?tabs=azure-powershell>
* <https://learn.microsoft.com/azure/governance/policy/assign-policy-terraform>
* <https://learn.microsoft.com/azure/governance/policy/assign-policy-portal>
* <https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/management_group_policy_assignment>
* <https://learn.microsoft.com/azure/defender-for-cloud/integration-defender-for-endpoint>
* <https://learn.microsoft.com/azure/governance/policy/concepts/initiative-definition-structure>
* <https://learn.microsoft.com/azure/governance/policy/concepts/assignment-structure>

## Next Steps

OK, you should now have a target environment with a decent starting set of policies and initatives, Azure AD groups, RBAC role assignments and some default resources.

It is preferable to configure the target environment before onboarding VMs as the policy engine will take care of extension installation and configuration. Remediating non-compliant resources is a slower process.

{{< flash >}}
Key questions:

* what is your preferred automation for deploying Azure Landing Zones for customers migrating to Azure?
* what will you offer as a default suggested target environment for your customer's hybrid and multicloud estates?
* what supporting collateral will hybrid engagements need for
  * go to market
  * customer workshops
  * design documentation
  * internal deployment and management guides?
* how will you iterate on the offer?
{{< /flash >}}

These are (mainly) rhetorical questions.

In the next lab we'll test that you can access your on prem VMs before you start to onboard.
