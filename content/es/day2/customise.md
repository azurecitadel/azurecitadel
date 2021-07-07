---
title: "Day 2 Challenge"
description: "Manually customise the default deployment to match your design."
layout: single
draft: false
weight: 4
series:
 - es-hack-day2
menu:
  side:
    parent: es-hack-day2
---

## Introduction

Day two is about customising that default Enterprise Scale deployment that you created using the Deploy to Azure button on day one. Yous should know have a working design to meet the Azure Baristas requirements.

Your task for today's hacking is to manually customise the deployment, so think of it as a proof of concept area to demonstrate the bespoke deployment for the Azure Baristas customer.

Refer back to the [customer requirements](/es/day1/baristas). They wouldn't be the first customers to have a few late additions for you to include into the design!

## Management Groups

* **Customise the management group structure**

    Manually change the management group structure to match your design.

## Security Group and RBAC assignments

* Landing Zone Contributor

  Create a custom role called Landing Zone Contributor based on the built-in Contributor role.

  The role should not have the permissions to create, update or delete UDRs and NSGs as these will be managed centrally.

  Define the role so that it can be assigned at any of the Landing Zones management groups or subscriptions.

* Payment Service Devs

  Create a security group called Payment Service Devs.

  This group should be assigned the Landing Zone Contributor role for all subscriptions used for the planned payment service. The group will be used by developers whilst creating the internal pilot.

  The plan is that once CI/CD pipelines have been developed - using service principals - then the assignment will be removed.

## Policy guidance

The remainder of this page is for Az\ure Policy, which is the largest area for customisation as it is extensively used in Enterprise Scale. The next section has a list of Azure Policy requirements pulled from the scenario for ease of reference.

1. Note that some of the requirements may be met by the default set of policies defined as part of the Enterprise Scale deployment.
1. Some of the policies - or ones that are close to the requirement - can be found in the list of in-built policies, in the samples, or in the community repo.
1. If you can't find an exact match then as part of the day 2 customisation you will need to create custom policies that are tweaked variant of policies that are close.

It is common to define custom policies at a high point in the management group structure and then assign - with the correct parameters and a suitable name - at the appropriate scope point.

## Core policy requirements

* Require built-in platform regulatory compliance security checks and reporting for all production environments
  * ISO27001 & CIS for all environments except Sandbox subscriptions
  * PCI-DSS for the payment system
* Need to be able to report costs for each continent & country easily
* All subnets must be protected by NSGs
* All resources and resource groups must be tagged with the following Tags (at a minimum):
  * Cost-Centre
  * Environment
  * IT-Owner-Contact
  * Service-Application
* Activity Logs for all subscriptions and diagnostics settings for all resources must be sent to Log Analytics workspace
* No M-Series or LS-Series VMs can be deployed
  * Except for the SAP environments
* Transparent Data Encryption should be enabled on all Azure SQL DBs
* Azure Monitor for VMs should be enabled on all Production VMs and any agents automatically installed
* No Public IP Addresses are allowed in the environment except for Core networking, Sandboxes & Online applications.

## Stretch policy goals

In the stretch goals you will find policy requirements that are a little more involved.

* Azure Hybrid Use Benefit must be enabled on Production only VMs
* All production VMs must be backed up, however selected VMs in dev/test environments may need backing up also
* Unrestricted area for developers not allowed any connectivity into corporate networks
* Cost-Centre tag should only accept values starting with “AZBACC-”
* How can we block Azure Sentinel from being deployed but not stopping Log Analytics Workspaces from being deployed?

## Lightning talk

The deep dive lightning talk session on creating policies is recommended. The session matches the [custom policy](/policy/custom) labs which is the basis for the last requirement.

* Just in time access should not accept * as a source address

## Success criteria

Screen share with your proctor to show that you achieved:

* Management Group customisation
* Custom RBAC role definition
* Security group RBAC assignment
* Custom policy definition and assignments

Use the following matrix format:

| Requirement | Definition | Scope |
|---|---|---|
| **Core Policy Requirements** |||
| ISO27001 |||
| CIS |||
| PCI-DSS |||
| Subnets must have NSGs |||
| Tag: Cost-Centre |||
| Tag: Environment |||
| Tag: IT-Owner-Contact |||
| Tag: Service-Application |||
| Activity Logs |||
| Diagnostic settings |||
| No large VMs |||
| TDE on SQL |||
| Azure Monitor on VMs |||
| No Public IPs |||
| **Stretch Targets** |||
| AHUB |||
| Backup |||
| No Sandbox peering |||
| Tag: AZBACC- format on Cost-Centre |||
| Block Azure Sentinel |||

You will find the empty matrix in the presentation deck in the team's General | Files area.

> For the definition, add a hyperlink to the definition JSON

You don't need to create all of the custom Azure Policies to succeed - just demonstrate sufficient progress and capability.
