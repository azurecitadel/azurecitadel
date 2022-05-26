---
title: "Removing azapi_update_resource"
date: 2021-02-16
slug: remove_azapi_update_resource
draft: false
author: [ "Richard Cheney" ]
description: "Coming soon. Safely remove an azapi_update_resource block once the property is supported in the azurerm provider."
weight: 5
menu:
  side:
    parent: 'terraform-azapi'
series:
 - terraform-azapi
layout: single
draft: false
---

## Introduction

| **Date** | **Description** |
|---|---|
| 2021-04-29 | [Azure Web PubSub in Public Preview](https://azure.microsoft.com/blog/easily-build-realtime-apps-with-websockets-and-azure-web-pubsub-now-in-preview/)
| 2021-08-02 | Developers start testing the preview functionality |
| 2021-11-16 | [Azure Web PubSub goes GA](https://azure.microsoft.com/blog/build-realtime-web-apps-with-azure-web-pubsub-now-generally-available/) |
| 2021-12-06 | Developers ask to include Web PubSub in the Terraform config |
| 2022-01-28 | [azurerm v2.94: new resource `azurerm_web_pubsub`](https://github.com/hashicorp/terraform-provider-azurerm/blob/ef11feb07db2b5fa96d79384cbcdc4e6309922fb/CHANGELOG.md) |
| 2022-02-07 | Switch to native support for the resource |
| 2022-02-14 | Asked to add system assigned managed identity |
| 2022-02-18 | [azurerm v2.97: `azurerm_web_pubsub` enhancement to support `identity` block](https://github.com/hashicorp/terraform-provider-azurerm/blob/735b6c3139b19f0d5e575531e0be2ad2b2d10181/CHANGELOG.md)
| 2022-02-21 | Switch to native support for the managed identity |

Good news. The [azurerm_web_pubsub](https://registry.terraform.io/providers/hashicorp/azurerm/2.97.0/docs/resources/web_pubsub) resource now supports an identity block.

Time to safely remove the final trace of azapi from the config and go fully native with the azurerm provider.

## Pre-reqs

1. Azure subscription
1. Microsoft.SignalRService provider is registered
1. Existing resource group

> The examples use "myResourceGroup"

## Summary

Text.
