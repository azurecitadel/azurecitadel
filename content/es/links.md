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

## ARM Deployment

This is the main Enterprise Scale repo with direct links to the three reference architectures.

| Link | Description |
|---|---|
| <https://aka.ms/enterprisescale> | Enterprise Scale repo|
| [...../docs/reference/wingtip](https://github.com/Azure/Enterprise-Scale/blob/main/docs/reference/wingtip/README.md) | Wingtip - core management groups and platform |
| [...../docs/reference/contoso](https://github.com/Azure/Enterprise-Scale/blob/main/docs/reference/contoso/Readme.md) | Contoso - core plus Azure vWAN |
| [...../docs/reference/adventureworks](https://github.com/Azure/Enterprise-Scale/blob/main/docs/reference/adventureworks/README.md) | AdventureWorks - core plus hub & spoke |
| [...../docs/reference/treyresearch](https://github.com/Azure/Enterprise-Scale/blob/main/docs/reference/treyresearch/README.md) | Trey Research - for smaller enterprises |

## AzOps

AzOps provides CI/CD pipeline to generate a repo of a configuration. Committed changes to the repo will then push creates, updates and deletes back into Azure.

* [AzOps Wiki](https://github.com/azure/azops/wiki/introduction)
* [AzOps Accelerator template](https://github.com/azure/azops-accelerator)

## Enterprise-scale Terraform module

This is the official module which is the one we recommend using. Make sure you understand how the archetypes work, as they can be very flexible.

| Link | Notes |
|---|---|
| [Enterprise-scale Terraform module - wiki](https://github.com/Azure/terraform-azurerm-caf-enterprise-scale/wiki) | Recommended, official |
| [Enterprise-scale Terraform module - Terraform Registry](https://registry.terraform.io/modules/Azure/caf-enterprise-scale/azurerm/latest) ||

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
| <https://github.com/Azure/azure-policy> | Azure Policy repo |
| [...../tree/master/built-in-policies](https://github.com/Azure/azure-policy/tree/master/built-in-policies) | - built-in Azure Policies |
| [...../tree/master/samples](https://github.com/Azure/azure-policy/tree/master/samples) | - Azure Policy samples |
| <https://github.com/Azure/Community-Policy/> | Community Policy repo |
| <https://aka.ms/policydef> | Azure Policy definition structure |
| <https:/azurecitadel.com/policy> | Our labs for creating custom policies and initiatives |

Azure RBAC Roles

| Link | Description |
|---|---|
| <https://docs.microsoft.com/azure/role-based-access-control/custom-roles> | Create your own custom roles |
