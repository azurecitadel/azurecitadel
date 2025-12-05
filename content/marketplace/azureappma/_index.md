---
title: "Publish a Managed App HOL"
author: [ "Mike Ormond" ]
description: "Lab walkthrough of publishing a Managed Application Offer"
date: 2021-01-06
weight: 60
style: list
layout: series
series:
  - marketplace-aama
menu:
  side:
    parent: marketplace
    identifier: marketplace-aama-offer
---

## Introduction

The *Azure Apps offer* is used to deploy and transact a more complex solution than a single VM. *Azure Apps offers* can only be listed in *Azure Marketplace*, not *AppSource*.

The *Azure Apps offer* has two distinct flavours; *solution template* and *managed application*.

* The *solution template* offer is a collection of Azure resources described by an [Azure Resource Manager (ARM) template](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview) which will be deployed into the customer subscription. It is not directly transact-capable but it can deploy *VM offers* which are transactable.

* The *[managed app](https://docs.microsoft.com/azure/azure-resource-manager/managed-applications/overview)* offer is a collection of Azure resources described by an [ARM template](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview) deployed into the customer subscription to be operated as a managed service.

In this lab we will focus on the *Managed Application* flavour of *Azure Application offer*.

When a customer 'purchases' a *Managed Application offer*, resources will be deployed into the customer's Azure subscription. As a consequence, Managed Application offers can only be published in *Azure Marketplace* (not *AppSource*).

Transact *Managed Application offers* are billed either a flat monthly rate or using [metered billing](https://docs.microsoft.com/azure/marketplace/azure-app-metered-billing) or a combination of the two.

## Resources

* [Plan an Azure Application offer for the commercial marketplace](https://docs.microsoft.com/azure/marketplace/plan-azure-application-offer)
* [Plan an Azure managed application for an Azure application offer](https://docs.microsoft.com/azure/marketplace/plan-azure-app-managed-app)
* [Managed application metered billing](https://docs.microsoft.com/azure/marketplace/azure-app-metered-billing)

## Sections
