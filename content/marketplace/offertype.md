---
title: "Offer Type"
author: [ "Mike Ormond" ]
description: "Determining your Offer Type"
date: 2021-01-06
weight: 30
menu:
  side:
    parent: 'marketplace'
    identifier: 'marketplace-offer'
---

Now we are familiar with some of the key terminology and characteristics of the different offer types, it's time to decide which offer type is best suited for your solution.

## Introduction

The previous sections will have given you a feel for the characteristics of the different offer types

In these labs we are focussing on the main offer types that have provisioning and transact capability; *VM offer*, *Azure App offer* and *SaaS App offer*.

Your first decision point will likely be how the solution is deployed.

* If it's a SaaS application that runs in the publisher's Azure subscription
  * This will be a *SaaS App offer*.
* If the solution gets deployed into the customer subscription then it will be either a *VM offer* or an *Azure App offer*
  * If it's a single virtual machine it will be a *VM offer*.
* If it's more than a single virtual machine then it comes down to who will manage the solution.
  * If the customer will be responsible the best match is an *Azure App offer - Solution Template*.
  * If the customer wants it to be managed on their behalf it will be an *Azure App offer - Managed Application*.

Note the limitations in the [Introduction](../introduction/offertypes) with respect to *Azure App offers*:

* Solution templates are not directly transactable but can be made so by referencing *VM offers*
* Managed applications grant the customer limited access and require the solution to be managed on their behalf.

## Resources

* [Publishing guide by offer type](https://docs.microsoft.com/azure/marketplace/publisher-guide-by-offer-type)
* [Introduction to listing options](https://docs.microsoft.com/azure/marketplace/determine-your-listing-type)

## Publish by offer type

You have the option to choose the  appropriate offer type

* [Publishing a VM Offer](../vmoffer/)
* [Publishing an Azure Application Solution Template Offer](../azureappst/)
* [Publishing an Azure Application - Managed Application Offer](../azureappma/)
* [Publishing a SaaS Application Offer](../saasapp/)