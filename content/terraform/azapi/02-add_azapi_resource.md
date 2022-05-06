---
title: "Using azapi_resource"
date: 2021-02-16
slug: add_azapi_resource
draft: false
author: [ "Richard Cheney" ]
description: "Add an azapi_resource block into your Terraform config to create the Web PubSub resource."
weight: 2
menu:
  side:
    parent: 'terraform-azapi'
series:
 - terraform-azapi
layout: single
---

## Introduction

| **Date** | **Description** |
|---|---|
| 2021-04-29 | [Azure Web PubSub in Public Preview](https://azure.microsoft.com/blog/easily-build-realtime-apps-with-websockets-and-azure-web-pubsub-now-in-preview/)
| 2021-08-02 | Developers start testing the preview functionality |
| 2021-11-16 | [Azure Web PubSub goes GA](https://azure.microsoft.com/blog/build-realtime-web-apps-with-azure-web-pubsub-now-generally-available/) |
| 2021-12-06 | Developers ask to include Web PubSub in the Terraform config |

The developers would like to have the Web PubSub resource created by Terraform. Unfortunately it is not yet showing as a resource type in the docs for [azurerm v2.93](https://registry.terraform.io/providers/hashicorp/azurerm/2.93.0/docs).

Still, you know how to drive Web PubSub creation using the REST API. Time to create an azapi_resource.

## Pre-reqs

1. Azure subscription
1. Microsoft.SignalRService provider is registered
1. Existing resource group

> The examples use "myResourceGroup"

## Summary

Text.
