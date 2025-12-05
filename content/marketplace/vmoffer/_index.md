---
title: "Publish a VM Offer HOL"
author: [ "Mike Ormond" ]
description: "Lab walkthrough of publishing a VM Offer"
date: 2021-01-06
weight: 40
layout: series
series:
  - marketplace-vm-offer
style: list
menu:
  side:
    parent: marketplace
    identifier: marketplace-vm-offer
---

*Virtual Machine offers* are used to deploy and transact a virtual machine (VM) instance through Marketplace. The solution must consist of a single VM. Anything more complex requires an *Azure Apps offer*.

When a customer 'purchases' a *VM offer*, the VM will be deployed into the customer's Azure subscription. As a consequence, VM offers can only be published in *Azure Marketplace* (not *AppSource*).

*VM offers* support the *Transact* listing type. They also support the *BYOL* listing type. A *Test drive* option is also available.

Transact *VM offers* are billed on a usage-based PAYG (Pay As You Go) model. Each plan can be created with a free trial option giving you the option to offer customers a 1 / 3 / 6 month period with no licence fees.

## Resources

* [Plan a virtual machine offer](https://docs.microsoft.com/azure/marketplace/marketplace-virtual-machines)

## Sections
