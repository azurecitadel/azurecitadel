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

Controlling your encryption keys is one of the most tangible ways to demonstrate data sovereignty on Azure. This series covers how to use Customer-Managed Keys (CMKs) to protect data at rest across a range of Azure services, how to choose the right key management offering for your requirements, and how Secure Key Release ties it all together with Azure Confidential Computing.

The services in scope are Azure Storage, Virtual Machines and Managed Disks, Azure Kubernetes Service, Azure Container Instances, and Azure SQL Managed Instance.

<!-- SERIES_PAGES -->

## A note on Managed HSM

Azure Key Vault Managed HSM gives you the strongest key sovereignty story from the three options covered — a dedicated, single-tenant HSM cluster where only you hold the root of trust. It is also the most expensive option. The labs in this series use **Azure Key Vault Premium** throughout, which is HSM-backed but multi-tenant and far more cost-effective for learning. Where the steps differ for Managed HSM, we call it out clearly — so you can apply the same knowledge in production.
