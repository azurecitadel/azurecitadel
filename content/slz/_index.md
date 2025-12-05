---
title: "Sovereign Landing Zones"
description: "Sovereign Landing Zones now uses the same platform as Azure Landing Zones. Use these labs to deploy a set of sovereign guardrails for your Azure environment and learn how to add country or industry packs."
draft: false
menu:
  side:
    identifier: slz
layout: list
---

## Introduction

Sovereign Landing Zones (SLZ) now builds on the same platform as Azure Landing Zones (ALZ). Microsoft has transposed the sovereign guardrails to use ALZ library constructs, ensuring consistency with the core platform while maintaining sovereignty controls.

The underlying ALZ platform leverages Azure Verified Modules (AVM) for infrastructure and the ALZ Terraform provider for policy management. This modular approach means you can layer sovereign requirements alongside the Microsoft-maintained baseline without forking the codebase.

These labs focus on deploying sovereign guardrails and understanding how to extend them with country or industry-specific packs. The [ALZ labs](/alz/) provide deeper context on the platform architecture and customization patterns that are equally relevant when working with SLZ.

## Content

<!-- SERIES_PAGES -->

### Prerequisites

Before starting, you should be familiar with:

- Cloud Adoption Framework (CAF) and Platform Landing Zones (PLZ)
- Azure Policy and governance concepts
- Basic understanding of sovereign cloud requirements

This foundation is essential for implementing and customizing Sovereign Landing Zones effectively.