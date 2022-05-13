---
title: "Removing azapi_resource"
date: 2021-02-16
slug: remove_azapi_resource
draft: false
author: [ "Richard Cheney" ]
description: "How do you safely remove an azapi_resource block and switch to a native resource without creating issues with your Terraform state?"
weight: 3
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
| 2022-01-28 | [azurerm v2.94: new resource `azurerm_web_pubsub`](https://github.com/hashicorp/terraform-provider-azurerm/blob/ef11feb07db2b5fa96d79384cbcdc4e6309922fb/CHANGELOG.md) |
| 2022-02-07 | Switch to native support for the resource |

The new azurerm release has support for Web PubSub. Time to switch to the native resource.

## Pre-reqs

1. Azure subscription
1. Microsoft.SignalRService provider is registered
1. Existing resource group

> The examples use "myResourceGroup"

## azurerm_web_pubsub

With v2.94, the azurerm provider has caught up a little and has its first version of the resources and data sources for the Azure Web PubSub Service. <https://registry.terraform.io/providers/hashicorp/azurerm/2.94.0/docs/resources/web_pubsub>

## Update the main.tf

1. Update the required azurerm version

   Update to v2.94:

    ```json
    terraform {
      required_providers {
        azurerm = {
          source  = "hashicorp/azurerm"
          version = "=2.94"
        }

        azapi = {
          source  = "azure/azapi"
          version = "=0.1.0"
        }
      }
    }
    ```

1. Add the azurerm_web_pubsub resource

    Add the block for the native resource.

    ```json
    resource "azurerm_web_pubsub" "webpubsub" {
      name                = "azapi-labs-richeney"
      resource_group_name = azurerm_resource_group.azapi_labs.name
      location            = azurerm_resource_group.azapi_labs.location
      sku                 = "Free_F1"
      capacity            = 1
    }
    ```

    ⚠️ **Remember to change the name to match your existing Azure Web PubSub resource.**

## Upgrade the provider

Terraform does not automatically update versions.

Running `terraform validate` with the current v2.93 provider will display an error message saying that `The provider hashicorp/azurerm does not support resource type "azurerm_web_pubsub".`.

Running `terraform init` with no arguments will display an error including `locked provider registry.terraform.io/hashicorp/azurerm 2.93.0 does not match configured version constraint 2.94.0`.

1. Initialise

    Use the `-upgrade` switch.

    ```bash
    terraform init -upgrade
    ```

    Terraform will install azurerm v2.94.

## Import the resource

Running `terraform plan` will show that it will create the `azurerm_web_pubsub.webpubsub` resource.

Running `terraform apply` will fail as the resource exists.

1. Get the resource ID

    ```bash
    id=$(az webpubsub list --resource-group azapi_labs --query [].id --output tsv)
    ```

1. Import the resource

    ```bash
    terraform import azurerm_web_pubsub.webpubsub $id
    ```

    The resource will be imported into state. Running `terraform plan` at this point will show that Terraform has a clean diff.

1. List the identifiers

    ```bash
    terraform state list
    ```

    Expected output:

    ```text
    azapi_resource.webpubsub
    azurerm_resource_group.azapi_labs
    azurerm_web_pubsub.webpubsub
    ```

## Remove the azapi_resource

1. Remove the azapi_resource block from main.tf
1. Remove from the state file

    ```bash
    terraform state rm azapi_resource.webpubsub
    ```

Running `terraform plan` will confirm that there are no planned changes.

## Summary

You have successfully switched from an azapi_resource:

1. upgraded the provider
1. added the native resource
1. imported the resource into state
1. cleaned up the config
1. removed the azapi_resource from state

In the next lab you will use azapi_update_resource.
