---
title: "Example"
description: "There is no 100% right answer to the scenario, but here is an example solution."
layout: single
draft: false
weight: 1
series:
 - es-hack-day2
menu:
  side:
    parent: es-hack-day2
---

## Introduction

There are a number of requirements in the Azure Barista's scenario that force you to deviate a little from the default management group structure, as defined by Enterprise Scale. You will also need to create some additional custom policies to meet the customer's specific needs. This is a very common thing to do after you have run through a design workshop.

On this page we will run through an example structure and explain the reasons why these decisions have been made.

## EA enrolment and AAD tenants

The EA Structure should look similar to the below:

![Azure Baristas EA Structure](/es/day2/images/az-bar-ea-example.png)

## Identity and access management

- The existing Azure AD Tenant of: ```azurebaristas.onmicrosoft.com``` will be used as:
  - Already synced with the On-Premise Active Directory Domain: ```azbaristas.local``` via Azure AD Connect with Password Hash Sync & SSO configured
  - Used already for Office/Microsoft 365 services across the organisation
- A single Azure AD Tenant is recommended as part of Enterprise Scale & [CAF Security best practices](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/security/security-top-10#9-architecture-standardize-on-a-single-directory-and-identity)
- Relevant RBAC role/custom roles defined and applied as per RBAC requirements on the [Day 2 Challenge Page](../customise/#security-group-and-rbac-assignments) & [Day 1 Azure Baristas Intro](/es/day1/baristas)

## Management Group Structure

The Management Group structure should look similar to the below example:

![Azure Baristas Management Group Structure](/es/day2/images/az-bar-mgmt-grp-example.png)

## Network topology

- Azure Virtual WAN should have been chosen as the networking technology
  - Due to the desire for moving towards SD-WAN
    - Also Citrix skills within the networking team and Citrix being an Azure Virtual WAN partner
- Also due to a lot of branch sites (Coffee Shops) required and the flexibility and speed Azure Virtual WAN will give Azure Baristas
- A Azure Virtual WAN Hub per Azure Region to be deployed in the Connectivity Subscription in a single Resource Group:
  - UK South
  - South East Asia
  - Germany West Central
  - UAE North
  - East US

![Azure Baristas VWAN Diagram](/es/day2/images/az-bar-vwan-example.png)

## Management and monitoring

- A single Log Analytics Workspace deployed in the Management Subscription for all logs across the Azure estate to be sent to

## Business continuity and disaster recovery

- Azure Policies (whether built-in, custom, or imported from Enterprise Scale) in place as per backup requirements listed on the [Day 2 Challenge Page](../customise/#policy-guidance) & [Day 1 Azure Baristas Intro](/es/day1/baristas)

## Security, governance and compliance

- Azure Policies (whether built-in, custom, or imported from Enterprise Scale) in place as per all other requirements listed on the [Day 2 Challenge Page](../customise/#policy-guidance) & [Day 1 Azure Baristas Intro](/es/day1/baristas)

## Platform automation and DevOps

Not currently in scope for the Azure Baristas scenario.
