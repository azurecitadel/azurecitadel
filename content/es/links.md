---
title: "Useful Links"
description: "Set of useful links for Enterprise Scale"
layout: single
draft: false
weight: 9
menu:
  side:
    parent: es
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
| [...../docs/reference/wingtip](<https://github.com/Azure/Enterprise-Scale/blob/main/docs/reference/wingtip/README.md>) | Wingtip - core management groups and platform |
| [...../docs/reference/contoso](<https://github.com/Azure/Enterprise-Scale/blob/main/docs/reference/contoso/Readme.md>) | Contoso - core plus Azure vWAN |
| [...../docs/reference/adventureworks](<https://github.com/Azure/Enterprise-Scale/blob/main/docs/reference/adventureworks/README.md>) | AdventureWorks - core plus hub & spoke |

## Terraform

There are a number of choices with Terraform, with the official module, community modules and the aztfmod solution.

| Link | Notes |
|---|---|
| [Enterprise Scale Terraform module](https://registry.terraform.io/modules/Azure/caf-enterprise-scale/azurerm/latest) | Recommended, official, extensible archetypes |
| [Management Groups module](https://github.com/terraform-azurerm-modules/terraform-azurerm-management-groups) | Community module |
| [Policy Definitions module](https://github.com/terraform-azurerm-modules/terraform-azurerm-azopsreference) | Community module |
| [CI/CD pipeline](https://github.com/terraform-azurerm-examples/terraform-enterprisescale-starter) | Example community pipeline |
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

## AzOps

AzOps provides CI/CD pipeline to generate a repo of a configuration. Committed changes to the repo will then push creates, updates and deletes back into Azure.

* [Getting started with AzOps](https://github.com/Azure/Enterprise-Scale/blob/main/docs/Deploy/getting-started.md)
* [Set up AzOps CI/CD](https://github.com/Azure/Enterprise-Scale/blob/main/docs/enterprise-scale-iab/setup-git-cicd.md)
