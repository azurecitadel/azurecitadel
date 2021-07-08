---
title: "Useful Links"
description: "Set of useful links for Enterprise Scale"
layout: single
draft: false
weight: 9
menu:
  side:
    parent: es
    identifier: es-links
series:
 - es
---

## Enterprise Scale Docs

| Link | Description |
|---|---|
| <https://aka.ms/enterprisescale/overview> | Enterprise Scale Docs |
| <https://aka.ms/enterprisescale/networking> | Networking section
| [Canary testing](https://docs.microsoft.com/azure/cloud-adoption-framework/ready/enterprise-scale/testing-approach) | Guidance for testing ES updates  | [Private Link and DNS](https://docs.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/private-link-and-dns-integration-at-scale) | Private Link and DNS at scale via Policy |
| [Connectivity to other cloud providers](https://docs.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/connectivity-to-other-cloud-providers) | Linking ES environments to other clouds  |

## Staying up to date

| Link | Description |
|---|---|
| <https://aka.ms/es/whatsnew> | Updates to the Enterprise Scale docs |
| [IT Ops Talk](https://www.youtube.com/channel/UCvyPX_vz17uFdtG3NyoV-UA) | YouTube channel to include Enterprise Scale content |
| <https://aka.ms/ESLZInTheCommunity> | Enterprise Scale Community Call |

## ARM Deployment

This is the ARM Enterprise Scale repo with direct links to the reference architectures.

| Link | Description |
|---|---|
| <https://aka.ms/enterprisescale> | Enterprise Scale repo|
| - [Wingtip](https://github.com/Azure/Enterprise-Scale/blob/main/docs/reference/wingtip/README.md) | Core management groups and platform |
| - [Contoso](https://github.com/Azure/Enterprise-Scale/blob/main/docs/reference/contoso/Readme.md) | Core plus Azure vWAN |
| - [Adventureworks](https://github.com/Azure/Enterprise-Scale/blob/main/docs/reference/adventureworks/README.md) | Core plus hub & spoke |
| - [Trey Research](https://github.com/Azure/Enterprise-Scale/blob/main/docs/reference/treyresearch/README.md) | Designed for smaller enterprises |

## AzOps

AzOps provides CI/CD pipeline to generate a repo of a configuration. Committed changes to the repo will then push creates, updates and deletes back into Azure.

* [AzOps Wiki](https://github.com/azure/azops/wiki/introduction)
* [AzOps Accelerator template](https://github.com/azure/azops-accelerator)

## Enterprise-scale Terraform module

This is the official module which is the one we recommend using. Make sure you understand how the archetypes work, as they can be very flexible.

* [Enterprise-scale Terraform module - Wiki](https://github.com/Azure/terraform-azurerm-caf-enterprise-scale/wiki)
* [Enterprise-scale Terraform module - Terraform Registry](https://registry.terraform.io/modules/Azure/caf-enterprise-scale/azurerm/latest)

## Additional Terraform resources

There are other Terraform modules and resources available if you wish to make use of these instead.

| Link | Notes |
|---|---|
| [Management Groups module](https://github.com/terraform-azurerm-modules/terraform-azurerm-management-groups) | Community module |
| [Policy Definitions module](https://github.com/terraform-azurerm-modules/terraform-azurerm-azopsreference) | Community module |
| [Subscription vending machine](https://github.com/terraform-azurerm-examples/terraform-enterprisescale-starter) | Example community templates and CI/CD pipeline |
| [CAF aztfmod repo](https://github.com/Azure/caf-terraform-landingzones) | Complete, opinionated, not 100% ES aligned |

## Azure Policy

The main repo, including built-ins, samples, community contributions and the Azure Policy definition and structure page.

| Link | Description |
|---|---|
| [github.com/Azure/azure-policy](https://github.com/Azure/azure-policy) | Azure Policy repo |
| - [built-in-policies](https://github.com/Azure/azure-policy/tree/master/built-in-policies) | - built-in Azure Policies |
| - [samples](https://github.com/Azure/azure-policy/tree/master/samples) | - Azure Policy samples |
| [github.com/Azure/Community-Policy](https://github.com/Azure/Community-Policy) | Community Policy repo |
| <https://aka.ms/policydef> | Azure Policy definition structure |
| <https:/azurecitadel.com/policy> | Our labs for creating custom policies and initiatives |

## Azure RBAC Roles

Sometimes you will need to create custom RBAC roles to meet customer requirements.

* <https://docs.microsoft.com/azure/role-based-access-control/custom-roles>
