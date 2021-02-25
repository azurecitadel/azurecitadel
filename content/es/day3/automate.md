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

## Stretch goals

1. Implement a canary management group branch
    * You can combine this with the primary objective if you want to retain the manually deployed system for comparison
1. Implement a branch protection strategy to control changes to production
1.Implement a subscription vending machine
    * You can mock up the subscription creation rather than using the real APIs

## Links

### AzOps

* [Getting started](https://github.com/Azure/Enterprise-Scale/blob/main/docs/Deploy/getting-started.md)
* [Set up Git CI/CD](https://github.com/Azure/Enterprise-Scale/blob/main/docs/enterprise-scale-iab/setup-git-cicd.md)

### Terraform

* [Official module](https://registry.terraform.io/modules/Azure/caf-enterprise-scale/azurerm/latest) - recommended
* [Community module - management groups](https://github.com/terraform-azurerm-modules/terraform-azurerm-management-groups)
* [Community module - policy definitions](https://github.com/terraform-azurerm-modules/terraform-azurerm-azopsreference)
* [Community CI/CD example](https://github.com/terraform-azurerm-examples/terraform-enterprisescale-starter)
* [aztfmod](https://github.com/Azure/caf-terraform-landingzones) - not fully ES aligned
