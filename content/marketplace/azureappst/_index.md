---
title: "Publish a Solution Template HOL"
author: [ "Mike Ormond" ]
description: "Lab walkthrough of publishing a Solution Template Offer"
date: 2021-06-20
weight: 50
style: list
layout: series
series:
  - marketplace-aast
menu:
  side:
    parent: marketplace
    identifier: marketplace-aast-offer
---

## Introduction

The *Azure Apps offer* is used to deploy and transact a more complex solution than a single VM. *Azure Apps offers* can only be listed in *Azure Marketplace*, not *AppSource*.

The *Azure Apps offer* has two distinct flavours; *solution template* and *managed application*.

* The *solution template* offer is a collection of Azure resources described by an [Azure Resource Manager (ARM) template](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview) which will be deployed into the customer subscription. It is not directly transact-capable but it can deploy *VM offers* which are transactable.

* The *[managed app](https://docs.microsoft.com/azure/azure-resource-manager/managed-applications/overview)* offer is a collection of Azure resources described by an [ARM template](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview) deployed into the customer subscription to be operated as a managed service.

In this lab we will focus on the *Solution Template* flavour of *Azure Application offer*.

When a customer 'purchases' a *Solution Template offer*, resources will be deployed into the customer's Azure subscription. As a consequence, Solution Template offers can only be published in *Azure Marketplace* (not *AppSource*).

*Solution Template offers* do **not** directly support the *Transact* listing type. They represent a deployment mechanism for customers to deploy a solution into their subscription. However, *Solution Template offers* can reference other transactable offers (specifically *VM Offers*). In this way it is possible for a Solution Template offer to be transactable. This must be made clear in the listing.

## Resources

* [Plan an Azure Application offer for the commercial marketplace](https://docs.microsoft.com/azure/marketplace/plan-azure-application-offer)
* [Plan a solution template for an Azure application offer](https://docs.microsoft.com/azure/marketplace/plan-azure-app-solution-template)

## Sections
