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

Still, you know how to drive Web PubSub creation using the REST API. Time to create an azapi_resource as a small proof of concept.

## Pre-reqs

1. Azure subscription
1. Microsoft.SignalRService provider is registered
1. Existing resource group

> The examples use "myResourceGroup"

## Initial configuration

These labs will use a single main.tf file throughout so that all of the changes are in one place. A common convention is to have separate files for Terraform, e.g. provider.tf, variables.tf, main.tf, outputs.tf.

1. Create a working directory

   ```bash
   mkdir ~/azapi-labs
   ```

1. Change directory

   ```bash
   cd ~/azapi-labs
   ```

1. Create a main.tf

   Copy in the code block below and save.

    ```json
    terraform {
      required_providers {
        azurerm = {
          source  = "hashicorp/azurerm"
          version = "=2.93"
        }
      }
    }

    provider "azurerm" {
      features {}
    }

    resource "azurerm_resource_group" "azapi_labs" {
      name     = "azapi_labs"
      location = "West Europe"
    }
    ```

    > Note that the azurerm provider is pinned to v2.93.

1. Initialise

    ```bash
    terraform init
    ```

1. Apply

    ```bash
    terraform apply
    ```

## azapi_resource

When creating the azapi_resource, you can either specify the location as an argument or embed it into the JSON.

There are a few options for the JSON body. The recommended approaches are to use either the [`jsonencode()`](https://www.terraform.io/language/functions/jsonencode) function, or the [`file()`](https://www.terraform.io/language/functions/file) or [`templatefile()`](https://www.terraform.io/language/functions/templatefile) functions.

In this lab we will use jsonencode, but for large sections of JSON then using files can make your config more readable. See this [repo](https://github.com/richeney/azapi) for an example using `templatefile()` to create a Data Collection Rule for Azure Monitor.

1. Add azapi to the required providers

    Update the required_providers block in main.tf:

    ```json
    terraform {
      required_providers {
        azurerm = {
          source  = "hashicorp/azurerm"
          version = "=2.93"
        }

        azapi = {
          source  = "azure/azapi"
          version = "=0.1.0"
        }
      }
    }
   ```

1. Add the azapi provider block

    ```json
    provider "azapi" {}
    ```

1. Add the azapi_resource block

    ```json
    resource "azapi_resource" "webpubsub" {
      type      = "Microsoft.SignalRService/WebPubSub@2021-10-01"
      name      = "azapi-labs-richeney"
      parent_id = azurerm_resource_group.azapi_labs.id
      location  = azurerm_resource_group.azapi_labs.location

      body = jsonencode({
        sku = {
          name = "Free_F1"
          capacity = 1
        }
      })
    }
    ```

    ⚠️ **You should select a different and globally unique value for name as it forms part of the FQDN.**

    Note how the URL maps to the arguments. Here is the REST API URI to match the block:

    ```text
    https://management.azure.com/subscriptions/2d31be49-d959-4415-bb65-8aec2c90ba62/resourceGroups/azapi_labs/providers/Microsoft.SignalRService/webPubSub/azapi-labs-richeney?api-version=2021-10-01
    ```

    And here is the original JSON block from the REST API call. Note the change in format to HCL in the resource block above:

    ```json
    {
      "sku": {
        "name": "Free_F1",
        "capacity": 1
      },
      "location": "westeurope"
    }
    ```

    > The benefit of using `jsonencode()` is that Terraform will confirm that the output JSON is syntactically valid.

1. Initialise

    ```bash
    terraform init
    ```

    You need to reinitialise Terraform as you have now included a new provider. The init will download it.

1. Plan

    ```bash
    terraform plan
    ```

1. Apply

    ```bash
    terraform apply
    ```

## Check

Terraform uses the azapi provider to create the Web PubSub resource.

1. Check for the resource in the portal

    ![azapi_resource](/terraform/azapi/images/azapi_resource.png)

1. List the identifiers in state

    ```bash
    terraform state list
    ```

    Example output:

    ```text
    azapi_resource.webpubsub
    azurerm_resource_group.azapi_labs
    ```

1. Display the resource attributes from state

    ```bash
    terraform state show azapi_resource.webpubsub
    ```

    Example output:

    ```text
    # azapi_resource.webpubsub:
    resource "azapi_resource" "webpubsub" {
        body                      = jsonencode(
            {
                sku = {
                    capacity = 1
                    name     = "Free_F1"
                }
            }
        )
        id                        = "/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/azapi_labs/providers/Microsoft.SignalRService/WebPubSub/azapi-labs-richeney"
        ignore_casing             = false
        ignore_missing_property   = false
        location                  = "westeurope"
        name                      = "azapi-labs-richeney"
        output                    = jsonencode({})
        parent_id                 = "/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/azapi_labs"
        schema_validation_enabled = true
        tags                      = {}
        type                      = "Microsoft.SignalRService/WebPubSub@2021-10-01"
    }
    ```

## Summary

You have successfully used the azapi provider to create a resource via the REST API.

Let's go forward in time a couple of months, to the release of v2.94, and see how to switch from azapi to a native resource definition.
