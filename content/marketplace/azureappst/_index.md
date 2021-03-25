---
title: "Publish a Solution Template"
author: [ "Mike Ormond" ]
description: "Azure Apps Offer"
date: 2021-03-25
weight: 50
style: list
menu:
  side:
    parent: marketplace
    identifier: marketplace-aast-offer
---

## Introduction

The *Azure Apps offer* is used to deploy and transact a more complex solution than a single VM. *Azure Apps offers* can only be listed in *Azure Marketplace*, not *AppSource*.

The *Azure Apps offer* has two distinct flavours; *solution template* and *managed application*.

* The *solution template* offer is a collection of Azure resources described by an [Azure Resource Manager (ARM) template](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview) which will be deployed into the customer subscription. It is not directly transact-capable but it can deploy *VM offers* which are transactable.

   For further information, see [Publishing an Azure Application Solution Template Offer](../azureappst/)

* The *[managed app](https://docs.microsoft.com/azure/azure-resource-manager/managed-applications/overview)* offer is a collection of Azure resources described by an [ARM template](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview) deployed into the customer subscription to be operated as a managed service.

   For further information, see [Publishing an Azure Application - Managed Application Offer](../azureappma/)

## Content
