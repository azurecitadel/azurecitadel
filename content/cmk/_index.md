---
title: "Customer Managed Keys"
description: "Skill up on using Customer Managed Keys with Azure Key Vault Premium and Managed HSM, and how they combine with encrypted storage in Azure services, plus Azure Confidential Computing and Secure Key Release."
author: [ "Richard Cheney" ]
github: [ "richeney" ]
draft: false
menu:
  side:
    identifier: cmk
layout: series
series:
  - cmk
---

## Overview

Controlling your encryption keys is one of the most tangible ways to demonstrate data sovereignty on Azure. In this series we will be using Customer Managed Keys (CMKs) to protect data at rest and in use across a range of Azure services.

Scroll down for a fuller introduction in a sovereign context

<!-- SERIES_PAGES -->

Note that this series will be released in phases.

## Applying sovereignty requirements to workloads

Digital Sovereignty considerations are usually split into data sovereignty, operational sovereignty and AI sovereignty.

From an architectural perspective this is largely a workload conversation and reinforces the idea that seeing a customer's estate through an additional sovereignty lens introduces another set of concerns, risks, controls, and compliancy requirements that we need to consider in our decision making and recommendations.

Some requirements will apply to the whole environment, and some will be applicable to specific workloads. In this sense it is another risk management consideration - alongside, performance, scalability, resilience, security, cost and more - and fits into the general approach for the Microsoft Cloud Adoption Framework, Azure landing zones, and Well-Architected Framework.

### Levels

Here is a set of simple levels that you can apply to specific workloads.

| Level | Description                                                                         | Management Group         |
|:-----:|:------------------------------------------------------------------------------------|:-------------------------|
| 1     | Regional constraints as per [Sovereign Landing Zones](https://aka.ms/sovereign/slz) | Public                   |
| 2     | Encryption at rest with CMK                                                         | Corp/Online              |
| 3     | Platform level Confidential Compute using CMK                                       | Confidential Corp/Online |
| 4     | Application level Confidential Compute using CMK                                    | Confidential Corp/Online |

This is just one way of doing this, and you will see alternative and fuller definitions such as the SEAL levels in the EU Sovereignty Framework.

### Sovereign landing zone

The Management Groups in the table above reflect the extended [management group structure and controls](https://learn.microsoft.com/industry/sovereign-cloud/sovereign-public-cloud/sovereign-landing-zone/overview-slz?tabs=mgandcontrols#sovereign-landing-zone-slz-architecture) for Sovereign landing zone.

![Management Group Hierarchy with Controls & Principles](https://learn.microsoft.com/industry/sovereign-cloud/sovereign-public-cloud/media/slz-hierarchy-policy-controls.svg)

You can see that the regional restrictions globally apply to the whole environment. There are additional encryption at rest policies applicable to the Corp and Online management groups when you add Sovereign landing zone to the default Azure landing zone. As a result there is a new Public management group for those low sensitivity workloads that do not require CMK at rest. At the other end of the scale we have the two new management groups for those subscriptions hosting the most sensitive cloud workloads.

Most Confidential Compute is configured at the platform level, but we will touch on a couple of application level Confidential Compute examples. This is a more complex and onerous level, and is therefore less common unless the application sensitivity and sovereignty model requires it.

## A note on Managed HSM

Azure Key Vault Managed HSM gives you the strongest key sovereignty story from the three options covered — a dedicated, single-tenant HSM cluster where only you hold the root of trust. It is also the most expensive option. The labs in this series use **Azure Key Vault Premium** throughout, which is HSM-backed but multi-tenant and far more cost-effective for learning. Where the steps differ for Managed HSM, we call it out clearly — so you can apply the same knowledge in production.
