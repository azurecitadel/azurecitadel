---
title: "Day 3 Challenge"
description: "Automate the Azure Barista's Enterprise Scale deployment with either Terraform or AzOps."
layout: single
draft: false
weight: 2
series:
 - es-hack-day3
menu:
  side:
    parent: es-hack-day3
---

## Introduction

Today's hacking is about getting hands on with some of the automation artifacts provided to help you deploy Enterprise Scale quickly and consistently.

It does not matter which tooling is used to implement Enterprise Scale. It is far more important that the end result matches the architecture, adheres to the five principles and covers the eight critical design areas than how you get there, and most organisations will already have their own preferred automation tools.

## Choice

Today hacking give you the choice of paths to explore:

1. Official Terraform module
1. AzOps ARM CI/CD tooling

## Day 3 Challenge

The primary objective is to build out the architecture using the Infrastructure as Code (IaC) and (optionally) CI/CD tool of your choice.

> Use a different management group tree for this exercise (use a different top level name, e.g AZBIaC)

1. Implement the reference Enterprise Scale architecture using the IaC tool of your choice
1. Customise the existing management groups to meet the Azure Baristas requirements
1. Add additional management groups and policy assignments (custom landing zones) to meet the Azure Baristas requirements

## Stretch goals

> You do not have to do these challenges in order, pick whichever ones are most appealing!

1. Implement a canary management group branch
    * You can combine this with the primary objective if you want to retain the manually deployed system for comparison
1. Implement a branch protection strategy to control changes to production
1. Implement a subscription vending machine
    * You can mock up the subscription creation rather than using the real APIs

## Links

### Bootstrapping CI/CD

Follow the instructions to add CI/CD bootstrapping for you Deploy to Azure environments.

* [CI/CD for ARM Enterprise Scale](https://github.com/Azure/Enterprise-Scale/wiki/Deploying-Enterprise-Scale)

### AzOps Wiki

* [Introduction](https://github.com/azure/azops/wiki/introduction)
* [Pre-reqs](https://github.com/azure/azops/wiki/prerequisites)
* [GitHub Actions](https://github.com/azure/azops/wiki/github-actions)
* [Azure DevOps Pipelines](https://github.com/azure/azops/wiki/azure-pipelines)

### Official Terraform module

The official module is more recent and is now our recommended approach for Terraform devotees.

* [Official module](https://registry.terraform.io/modules/Azure/caf-enterprise-scale/azurerm/latest)
* [Official module's wiki](https://github.com/Azure/terraform-azurerm-caf-enterprise-scale/wiki)

### Additional Terraform resources

* [Community module - management groups](https://github.com/terraform-azurerm-modules/terraform-azurerm-management-groups)
* [Community module - policy definitions](https://github.com/terraform-azurerm-modules/terraform-azurerm-azopsreference)
* [Subscription vending machine](https://github.com/terraform-azurerm-examples/terraform-enterprisescale-starter) - community CI/CD pipeline
* [aztfmod](https://github.com/Azure/caf-terraform-landingzones) - complete and opinionated CAF solution, not 100% ES aligned
