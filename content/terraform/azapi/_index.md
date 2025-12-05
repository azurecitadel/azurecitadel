---
title: "Using AzAPI"
description: "Bridge any gaps in the Terraform AzureRM provider (and the Go SDK for Azure) with the Terraform AzAPI provider."
date: 2021-05-04
draft: false
weight: 50
layout: series
series:
  - terraform-azapi
menu:
  side:
    identifier: 'terraform-azapi'
    parent: 'terraform'
---

## Background

One of the arguments against using Terraform is that it sometimes lags behind ARM templates or Bicep in terms of supporting all Azure resources and being up to date with new and preview functionality.

A look at the changelogs ([3.x](https://github.com/hashicorp/terraform-provider-azurerm/blob/main/CHANGELOG.md), [2.x](https://github.com/hashicorp/terraform-provider-azurerm/blob/main/CHANGELOG-v2.md)) for the azurerm provider repo shows the amount of work that goes in for new resources, enhancements and big fixes. Many of the most used resources are very actively updated to make sure that the gap is negligible. However, a scan of the requested enhancements quickly shows that there may always be some gaps for certain services or features.

## AzAPI

The release of the new [AzAPI provider](https://docs.microsoft.com/azure/developer/terraform/overview-azapi-provider) gives new options to bridge those gaps.

There are two resources:

* azapi_resource
* azapi_update_resource

The resources drive the Azure REST API.

> You should be familiar with the [REST API](/rest-api) before using AzApi.

## Scenario

You will time travel a little in these labs as we move through time to emulate a real world example. You are using Terraform for your infrastructure as code on Azure and have been asked by the developer group whether you can provision the new Azure Web PubSub service.

Here is the timeline for the lab scenario.

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

## Labs
