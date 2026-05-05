---
title: "Sovereignty scenarios"
description: "THe use of Customer Managed Keys is tightly aligned to the appropriate level of workload sovereignty. Here we will take a look at the levels used in sovereign frameworks."
date: 2026-03-06
author: [ "Richard Cheney" ]
draft: false
weight: 10
menu:
  side:
    parent: cmk
    identifier: cmk-sovereignty
series:
  - cmk
---

## Applying sovereignty requirements to workloads

Digital Sovereignty considerations are usually split into data sovereignty, operational sovereignty and AI sovereignty.

From an architectural perspective this is largely a workload conversation and reinforces the idea that seeing a customer's estate through an additional sovereignty lens introduces another set of concerns, risks, controls, and compliancy requirements that we need to consider in our decision making and recommendations.

Some requirements will apply to the whole environment, and some will be applicable to specific workloads. In this sense it is another risk management consideration - alongside, performance, scalability, resilience, security, cost and more - and fits into the general approach for the Microsoft Cloud Adoption Framework, Azure landing zones, and Well-Architected Framework.

### Levels

Here is a set of simple levels that you can apply to specific workloads consistent with the [sovereign workload controls](https://learn.microsoft.com/azure/azure-sovereign-clouds/public/questions-sovereign-landing-zone#what-is-the-difference-between-level-1-level-2-and-level-3-sovereign-controls) used in [Sovereign Landing Zones](https://aka.ms/sovereign/slz).

| Level | Description                                                    | Management Group         |
|:-----:|:---------------------------------------------------------------|:-------------------------|
| L1    | **Data residency** to limit regional jurisdictional controls   | Public                   |
| L2    | **Encryption at rest** with customer managed keys (CMK)        | Corp/Online              |
| L3    | **Encryption in use** for confidential compute using CMK       | Confidential Corp/Online |

You will see similar definitions such as the SEAL levels in the EU Sovereignty Framework.

{{< flash >}}
You will sometimes see L2+ or L3+ unofficially used to denote full key ownership via the use of customer managed HSMs for stronger operational sovereignty and to remove any possibility of cloud operator access. Today this is achieved on Azure with either Managed HSM or Cloud HSM, and in the future this will extend to External Key Management scenarios.
{{< /flash >}}

### Sovereign landing zone

The Management Groups in the table above reflect the extended [management group structure and controls](https://learn.microsoft.com/industry/sovereign-cloud/sovereign-public-cloud/sovereign-landing-zone/overview-slz?tabs=mgandcontrols#sovereign-landing-zone-slz-architecture) for Sovereign landing zone.

![Management Group Hierarchy with Controls & Principles](https://learn.microsoft.com/industry/sovereign-cloud/sovereign-public-cloud/media/slz-hierarchy-policy-controls.svg)

You can see that the regional restrictions globally apply to the whole environment. There are additional encryption at rest policies applicable to the Corp and Online management groups when you add Sovereign landing zone to the default Azure landing zone. As a result there is a new Public management group for those low sensitivity workloads that do not require CMK at rest. At the other end of the scale we have the two new management groups for those subscriptions hosting the most sensitive cloud workloads.

Most Confidential Compute is configured at the platform level, but we will touch on a couple of application level Confidential Compute examples. This is a more complex and onerous level, and is therefore less common unless the application sensitivity and sovereignty model requires it.

## A note on Managed HSM

Azure Key Vault Managed HSM gives you the strongest key sovereignty story from the three options covered — a dedicated, single-tenant HSM cluster where only you hold the root of trust. It is also the most expensive option. The labs in this series use **Azure Key Vault Premium** throughout, which is HSM-backed but multi-tenant and far more cost-effective for learning. Where the steps differ for Managed HSM, we call it out clearly — so you can apply the same knowledge in production.
