---
title: "Introduction"
author: [ "Mike Ormond" ]
description: "Labs to help ISVs to publish their solutions in the Commercial Marketplace"
date: 2021-01-06
weight: 1
menu:
  side:
    parent: 'marketplace'
---

Microsoft's commercial marketplace is a catalog of solutions and services from our partner network. Microsoft partners can use Partner Center to create, publish and manage their solutions and services offerings in the commercial marketplace. Solutions are listed in Microsoft's online stores, alongside Microsoft's own solutions, connecting you with businesses, organizations, and government agencies around the world.

This lab will introduce you to some of the essential concepts and terminology of the commercial marketplace with a particular focus on ISVs (Independent Software Vendors) building solutions on Azure. We will focus on cloud solutions rather than services; in other words, how the commercial marketplace caters for cloud solutions built on Microsoft Azure and how to go about publishing them.

## Background Information

* [The Commercial Marketplace documentation](https://docs.microsoft.com/azure/marketplace/overview)
* [What is Partner Center](https://support.microsoft.com/help/4499930/partner-center-overview)
* [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/)
* [AppSource](https://appsource.microsoft.com/)

## Structure

This lab introduces some fundamental concepts and how to choose the best offer type to match a particular solution. The accompanying labs will take you through the steps to create and publish an offer on the commercial marketplace.

* [Introduction to the Commercial Marketplace](../introduction/)
* [Enroll in Partner Center to Publish Offers](../partnercenter/)
* [Selecting your Offer Type](../offertype/)
* [Publishing a VM Offer](../vmoffer/)
* [Publishing an Azure Application Solution Template Offer](../solutiontemplate/)
* [Publishing an Azure Application - Managed Application Offer](../managedapp/)
* [Publishing a SaaS Application Offer](../saasapp/)

## Terminology

As you might expect, the commercial marketplace has its own vocabulary to describe specific concepts. It's important to understand the specific meanings and how these concepts relate to one another to fully understand commercial marketplace publishing.

* **Publisher** - the owner of the solution IP who wants to make it available on the commercial marketplace.
* **Customer** - the target audience for the solution who will acquire it via the commercial marketplace.
* **Storefront** - the *commercial marketplace* has a single backend with [multiple storefronts](https://docs.microsoft.com/azure/marketplace/overview#commercial-marketplace-online-stores). Published solutions will be listed in one or more *storefronts*.
* **Azure Marketplace** - a *storefront* for solutions aimed at IT professionals.
* **AppSource** - a *storefront* for solutions aimed at business decision makers.
* **Offer** - an *offer* is the vehicle for listing on the *commercial marketplace*. It is a container for all aspects relating to the listing. The listing will appear in one of the *storefronts*.
* **Plan** - *Offers* contain plans which describe the scope (eg in which markets is it available, is it available to everyone or specific customers) and pricing (when applicable).
* **Listing Options**
  * **Transact** - an offer which is transacted through Microsoft's commerce capabilities and thus delivers an end-to-end experience from discovery to purchase to delivery. Microsoft facilitates the exchange of money for a software licence on behalf of the publisher.
  * **List** - simple listing of your solution that enables a customer to express interest via *Lead management*.
  * **Trial** - allow customers to trial your solution for a limited period at no cost before they purchase.
  * **BYOL** - BYOL (Bring Your Own Licence) listings enhance the discoverability and automate the provisioning of your solution in a customer subscription. The financial transaction and licence compliance is the publisher responsibility.
  * **Free** - essentially a provisioning-only offer with no billing.
* **Test drive** - a *test drive* is a pre-canned environment that is hosted in the publisher's Azure subscription and allows potential customers to evaluate the solution before purchase.
* **Preview audience** - during the publishing process, an *offer* can be shared with a *preview audience* before it is finally published. Useful for testing purposes.
* **Private offers** - a *private offer* is a plan that is made available to a designated set of customers. This allows for scenarios such as negotiated pricing, private terms & conditions and specialised configurations.
* **Hidden offers** - designed only to be consumed by other *offers*, they are hidden in the commercial marketplace so as not to be discoverable. Think of them as building blocks.
* **Lead management** - *Offers* need to be connected to a lead management system so publishers can be notified about customers interested in deploying their *offers*. This is typically a CRM system but can be a simple Azure table or webhook.
* **Categories** - each *offer* is listed in a [category or categories](https://docs.microsoft.com/en-gb/azure/marketplace/gtm-offer-listing-best-practices#categories) to aid discoverability. Categories are specific to Azure Marketplace and AppSource.
* **Metered Billing** - a billing mechanism that uses signals from the solution to advance custom meters. Used to create more sophisticated billing models.

## Offer Types

The following offer types are available through Partner Center for ISV solutions.

* [Virtual Machine offer](https://docs.microsoft.com/azure/marketplace/marketplace-virtual-machines)
* [Azure Apps offer - Solution Template](https://docs.microsoft.com/azure/marketplace/marketplace-solution-templates)
* [Azure Apps offer - Managed Application](https://docs.microsoft.com/azure/marketplace/marketplace-managed-apps)
* [Container image offer](https://docs.microsoft.com/azure/marketplace/marketplace-containers)
* [IoT Edge module offer](https://docs.microsoft.com/azure/marketplace/iot-edge-module)
* [SaaS app offer](https://docs.microsoft.com/azure/marketplace/plan-saas-offer)

In these labs we will focus on three main offer types; **Virtual Machine**, **Azure Apps** and **SaaS app** offers.

## Virtual Machine Offer

The *Virtual Machine offer* (or *VM offer*) is used to deploy and transact a virtual machine (VM) instance through Marketplace. The solution must consist of a single VM. Anything more complex requires an *Azure Apps offer*. *Virtual Machine offers* can only be listed in *Azure Marketplace*, not *AppSource*.

For further information, see [Publishing a VM Offer](../vmoffer/)

## Azure Apps Offer

The *Azure Apps offer* is used to deploy and transact a more complex solution than a single VM. *Azure Apps offers* can only be listed in *Azure Marketplace*, not *AppSource*.

The *Azure Apps offer* has two distinct flavours; *solution template* and *managed application*.

* The *solution template* offer is a collection of Azure resources described by an [Azure Resource Manager (ARM) template](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview) which will be deployed into the customer subscription. It is not directly transact-capable but it can deploy *VM offers* which are transactable.

   For further information, see [Publishing an Azure Application Solution Template Offer](../solutiontemplate/)

* The *[managed app](https://docs.microsoft.com/azure/azure-resource-manager/managed-applications/overview)* offer is a collection of Azure resources described by an [ARM template](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview) deployed into the customer subscription to be operated as a managed service.

   For further information, see [Publishing an Azure Application - Managed Application Offer](../managedapp/)

## SaaS App Offer

The *SaaS App offer* differs from the *Virtual Machine offer* and *Azure App offer* as no resources are deployed in the customer subscription. As such, the publisher must charge both for the software licence and the underlying Azure resource costs used to deliver the solution. *SaaS App offers* can be listed in both the *Azure Marketplace* and *AppSource*.

For further information, see [Publishing a SaaS Application Offer](../saasapp/)
