+++
Title = "Customer Managed Keys for Encryption at Rest"
Date = 2026-05-05T00:00:00Z
people = ["Richard Cheney"]
tags = ["sovereignty", "sovereign", "cmk", "encryption"]
draft = false
+++

A new set of content on Azure Citadel covering Customer Managed Keys (CMK) for encryption at rest — the first phase in a series that will also cover confidential compute.

## Overview

I am pleased to launch the new [Customer Managed Keys](/cmk) area on Azure Citadel.

Controlling your encryption keys is one of the most tangible ways to demonstrate data sovereignty on Azure, and it is a topic that comes up repeatedly with partners working in regulated industries and the public sector.

This first release covers **L2 encryption at rest** — using your own keys in Azure Key Vault to protect stored data across common Azure services. If you are working with customers who have sovereignty requirements beyond simple data residency, this is for you.

## What's included

The content is structured as a series:

- [Sovereignty scenarios](/cmk/sovereignty) - a quick primer on L1/L2/L3 levels and how they map to sovereign landing zone management groups
- [Key management options](/cmk/keyvaults) - choosing between Azure Key Vault Standard, Premium, and Managed HSM
- [L2: Encryption at rest with CMK](/cmk/at-rest) - the integration pattern for Azure Storage, Managed Disks, VMs, and AKS
- Hands-on labs covering [Azure Key Vault Premium](/cmk/lab-akvp), [Storage](/cmk/lab-storage), and [Managed Disks](/cmk/lab-disks)

The common pattern is fairly consistent across most services: create a key, enable a managed identity on the resource, grant wrap/unwrap permissions, and point the resource at the key URI.

Encrypting your Azure Managed Disks is slightly different as you also have the Disk Encryption Sets as an abstraction layer which has operational benefits for use at scale and for key rotation processes.

## Why we use Key Vault Premium for these labs

{{< flash "tip" >}}
We intentionally use Key Vault Premium in these labs. You will see the reason stated a couple of times through the pages, but it is worth adding it in here to help you avoid unwanted cost on your Azure bill.
{{< /flash >}}

{{% shared-content "cmk/skucost" %}}

## What's next

Future phases will extend the CMK series to cover **L3 confidential compute**, i.e., protecting data while it is in use, not just while it is stored. That will cover:

- Azure Confidential Computing with AMD SEV-SNP and Intel SGX
- Secure Key Release (SKR) for bridging CMK and trusted execution environments
- Platform-level and application-level confidential compute scenarios

If you have questions or feedback then raise them in the [GitHub discussions](https://github.com/azurecitadel/azurecitadel/discussions) for the site.
