---
title: "Azure landing zone"
description: "Microsoft regularly updates Azure landing zone and its governance guardrails, so it makes sense to use that. But how do you customise it, extend it, and merge it with your own IP? These labs are aimed at partners but anyone who wants to go deeper with ALZ will get something from these labs."
draft: false
menu:
  side:
    identifier: alz
layout: list
---

## Introduction

Azure landing zone (ALZ) has evolved significantly. Microsoft maintains the open source repositories including governance guardrails and best practices. There is enormous value in leveraging that IP and knowing that you are building your platform landing zone based on Microsoft's recommended configuration and that it will be updated to keep pace with the velocity of innovation in public cloud.

The introduction of the Azure landing zone Accelerator means you can quickly establish a solid CI/CD configuration, and these labs will walk through an example process. It is not mandatory to use the ALZ Accelerator if you are experienced in setting up CI/CD pipelines for Terraform deployments, but it is highly recommended to secure powerful workload identities in line with recommended standards.

The move to Azure Verified Modules (AVM) for modular and structured infrastructure deployment has been a game changer, especially when combined with the flexibility of the _alz_ Terraform provider.

## Content

<!-- SERIES_PAGES -->

## Combining it with your own IP

Historically you could have accused Azure landing zone of being monolithic, forcing you to choose between adopting and falling in line with the Microsoft approach, or forging your own path and developing your own platform landing zone infrastructure as code standards including policy.

Now the combination of Azure Verified Modules and the Azure landing zone library approach allows you to build on the Microsoft managed IP, giving you the ability to extend, augmenting and override that baseline with your own IP and definitions for a true level of flexibility.

These labs are designed for partners who need to deeply understand how ALZ works — particularly those with existing landing zone IP or custom Azure Policy guardrails. You'll learn how to integrate your assets alongside the Microsoft-maintained baseline and get the best of both worlds.

## Expected Knowledge

Before diving in, you should be familiar with:

{{< flash "note" >}}
**Foundation Knowledge Required**
{{< /flash >}}

- **Cloud Adoption Framework (CAF)** and Platform Landing Zones (PLZ) concepts
- **Application Landing Zones** and Well-Architected Framework (WAF) principles
- **Azure Policy** and governance fundamentals
- **Terraform** infrastructure as code
- **GitHub** workflows and CI/CD pipelines

Understanding the Azure landing zone approach provides a solid foundation that will help with:

- Standard platform landing zone deployments (ALZ / PLZ)
- Deploying Sovereign landing zone (SLZ)
- Azure Monitoring Baseline Alerts (AMBA)
- AI Landing Zones (AI LZ) and other application landing zone accelerators
