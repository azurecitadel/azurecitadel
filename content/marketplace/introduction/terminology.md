---
title: "Terminology"
author: [ "Mike Ormond" ]
description: "A glossary of key terms used in the commercial marketplace"
date: 2021-01-06
weight: 10
menu:
  side:
    parent: marketplace-introduction
    identifier: marketplace-introduction-terminology
series:
 - marketplace-introduction
---

## Introduction

As you might expect, the commercial marketplace has its own vocabulary to describe specific concepts. It's important to understand the specific meanings and how these concepts relate to one another to fully understand commercial marketplace publishing.

## Definitions

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
* **Categories** - each *offer* is listed in a [category or categories](https://docs.microsoft.com/azure/marketplace/gtm-offer-listing-best-practices#categories) to aid discoverability. Categories are specific to Azure Marketplace and AppSource.
* **Metered Billing** - a billing mechanism that uses signals from the solution to advance custom meters. Used to create more sophisticated billing models.
