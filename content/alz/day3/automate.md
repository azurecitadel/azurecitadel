---
title: "Day 3 Challenge"
description: "Automate the Azure Barista's Azure Landing Zones deployment with either Bicep or Terraform."
layout: single
draft: false
weight: 2
series:
 - alz-hack-day3
menu:
  side:
    parent: alz-hack-day3
---

## Introduction

Today's hacking is about getting hands on with some of the automation artifacts provided to help you deploy Azure Landing Zones quickly and consistently.

It does not matter which tooling is used to implement Azure Landing Zone. It is far more important that the end result matches the architecture, adheres to the five principles and covers the eight critical design areas than how you get there, and most organisations will already have their own preferred automation tools.

## Choice

Today hacking give you the choice of paths to explore:

1. Official Bicep modules
1. Official Terraform module

## Day 3 Challenge

The primary objective is to build out the architecture using the Infrastructure as Code (IaC) and (optionally) CI/CD tool of your choice.

> Use a different management group tree for this exercise (use a different top level name, e.g AZBIaC)

1. Implement the reference Azure Landing Zones architecture using the IaC tool of your choice
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

### Official ARM resources

* [ARM repo](https://aka.ms/alz/repo)
* [ARM templates](https://aka.ms/alz/arm)
* [Adding CI/CD](https://github.com/Azure/Enterprise-Scale/wiki/Deploying-Enterprise-Scale)

### Official Bicep resources

* [Bicep modules](https://aka.ms/alz/bicep)
* [Bicep modules wiki](https://aka.ms/alz/bicep/wiki)

> ⚠️ The Bicep resources are currently in preview.

### Official Terraform module

* [Official module](https://aka.ms/alz/tf)
* [Official module's wiki](https://aka.ms/alz/tf/wiki)

### Additional Terraform resources

* [Subscription vending machine](https://github.com/terraform-azurerm-examples/terraform-enterprisescale-starter) - community CI/CD pipeline
* [aztfmod](https://github.com/Azure/caf-terraform-landingzones) - complete and opinionated CAF solution, not 100% aligned to Azure Landing Zones
