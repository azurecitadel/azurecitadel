---
title: "Creating Custom Policies"
description: "Simple modifications to existing Policy samples are relatively simple. But what if you need to do something new? Follow these labs to get a deeper understanding of the policy structure and how to use aliases."
draft: false
weight: 2
menu:
  side:
    identifier: 'policy-custom'
    parent: 'policy'
---

## Introduction

The number of in built policies and initiatives is vast, and keeps on growing. You will find most use case scenarios have been covered as Azure leverages policies to meet compliancy and regulatory requirements.

However, it is still common to come up against requirements from partners and customers that are not catered for. This is where custom policies come in. This lab will run through a real life requirement I had from a partner.

## Pre-reqs

You will need:

* an Azure subscription
* Azure CLI
* jq

This lab uses Visual Studio Code, with the [Azure Policy extension](https://marketplace.visualstudio.com/items?itemName=AzurePolicy.azurepolicyextension) installed. It is recommended to read through the documentation for:

* [Azure Policy definition structure](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure)
* [Azure Policy extension](https://docs.microsoft.com/azure/governance/policy/how-to/extension-for-vscode)

## Labs