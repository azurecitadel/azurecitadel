---
title: "Offer Types"
author: [ "Mike Ormond" ]
description: "commercial marketplace offer types for applications"
date: 2021-01-06
weight: 20
menu:
  side:
    parent: marketplace-introduction
    identifier: marketplace-introduction-offertypes
series:
 - marketplace-introduction
---

## Introduction

The following offer types are available through Partner Center for ISV solutions.

* [Virtual Machine offer](https://docs.microsoft.com/azure/marketplace/marketplace-virtual-machines)
* [Azure Apps offer - Solution Template](https://docs.microsoft.com/azure/marketplace/marketplace-solution-templates)
* [Azure Apps offer - Managed Application](https://docs.microsoft.com/azure/marketplace/marketplace-managed-apps)
* [Container image offer](https://docs.microsoft.com/azure/marketplace/marketplace-containers)
* [IoT Edge module offer](https://docs.microsoft.com/azure/marketplace/iot-edge-module)
* [SaaS app offer](https://docs.microsoft.com/azure/marketplace/plan-saas-offer)

In these labs we will focus on three main offer types; **Virtual Machine**, **Azure Apps** and **SaaS app** offers. These offer types are transactable through the commercial marketplace and require deeper integration in order to publish.

## Virtual Machine Offer

The *Virtual Machine offer* (or *VM offer*) is used to deploy and transact a virtual machine (VM) instance through Marketplace. The solution must consist of a single VM. Anything more complex requires an *Azure Apps offer*. *Virtual Machine offers* can only be listed in *Azure Marketplace*, not *AppSource*.

For further information, see [Publishing a VM Offer](../../vmoffer/)

## Azure Apps Offer

The *Azure Apps offer* is used to deploy and transact a more complex solution than a single VM. *Azure Apps offers* can only be listed in *Azure Marketplace*, not *AppSource*.

The *Azure Apps offer* has two distinct flavours; *solution template* and *managed application*.

* The *solution template* offer is a collection of Azure resources described by an [Azure Resource Manager (ARM) template](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview) which will be deployed into the customer subscription. It is not directly transact-capable but it can deploy *VM offers* which are transactable.

   For further information, see [Publishing an Azure Application Solution Template Offer](../../azureappst/)

* The *[managed app](https://docs.microsoft.com/azure/azure-resource-manager/managed-applications/overview)* offer is a collection of Azure resources described by an [ARM template](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview) deployed into the customer subscription to be operated as a managed service.

   For further information, see [Publishing an Azure Application - Managed Application Offer](../../azureappma/)

## SaaS App Offer

The *SaaS App offer* differs from the *Virtual Machine offer* and *Azure App offer* as no resources are deployed in the customer subscription. As such, the publisher must charge both for the software licence and the underlying Azure resource costs used to deliver the solution. *SaaS App offers* can be listed in both the *Azure Marketplace* and *AppSource*.

For further information, see [Publishing a SaaS Application Offer](../../saasapp/videos/)
