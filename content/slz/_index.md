---
title: "Sovereign landing zone"
description: "Sovereign landing zone now uses the same platform as Azure landing zone. Use these labs to deploy a set of sovereign guardrails for your Azure environment and learn how to add country or industry packs."
draft: false
menu:
  side:
    identifier: slz
layout: list
---

## Introduction

Sovereign landing zone (SLZ) now builds on the same platform as Azure landing zone (ALZ). Microsoft has transposed the sovereign guardrails to use ALZ library constructs, ensuring consistency with the core platform while maintaining sovereignty controls.

The underlying ALZ platform leverages Azure Verified Modules (AVM) for infrastructure and the ALZ Terraform provider for policy management. This modular approach means you can layer sovereign requirements alongside the Microsoft-maintained baseline without forking the codebase.

These labs focus on deploying sovereign guardrails and understanding how to extend them with country or industry-specific packs. The [ALZ labs](/alz/) provide deeper context on the platform architecture and customization patterns that are equally relevant when working with SLZ.

## Content

<!-- SERIES_PAGES -->

## Expected Knowledge

Before diving in to the, you should be familiar with:

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