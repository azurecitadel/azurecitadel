---
title: "Data sources and outputs"
date: 2021-05-30
slug: azapi_outputs
draft: false
author: [ "Richard Cheney" ]
description: "Learn how to use the azapi_resource data source and the response_export_values to access additional information."
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

The developers are happy that you have managed identity working on the Web Pub Sub service, but they still need to systematically learn the tenant id and the object id for the identity.

We will do this in three ways:

1. We'll first look at the azapi_resource data source to see how it is used and to take advantage of its inbuilt support for an **identity block**. Great for this example (and we'll show that in example1), but you may need to access other properties other than identity.
1. So we will then switch to using response_export_values argument in the data source. The response_export_values is used across the azapi resources and data sources. The full JSON export will be collected and then in the example2 output block we will construct the desired object.
1. We'll remove the data source altogether and use response_export_values within the azapi_update_resource instead. In this one we will filter the response_export_values more to get the exact output we want to see for a simpler output block for example3.

> Feel free to skip straight to [example3](#example-3) if this feels like going the long way round!

## Starting configuration

Your main.tf file should be similar to this:

```json
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=2.94"
    }

    azapi = {
      source  = "azure/azapi"
      version = "=0.3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

provider "azapi" {}

resource "azurerm_resource_group" "azapi_labs" {
  name     = "azapi_labs"
  location = "West Europe"
}

resource "azurerm_web_pubsub" "webpubsub" {
  name                = "azapi-labs-richeney"
  resource_group_name = azurerm_resource_group.azapi_labs.name
  location            = azurerm_resource_group.azapi_labs.location
  sku                 = "Free_F1"
  capacity            = 1
}

resource "azapi_update_resource" "webpubsub_identity" {
  type      = "Microsoft.SignalRService/WebPubSub@2021-10-01"
  name      = azurerm_web_pubsub.webpubsub.name
  parent_id = azurerm_resource_group.azapi_labs.id

  body = jsonencode({
    identity = {
      "type" : "SystemAssigned"
    }
  })
}
```

> ⚠️ You should have a different value for your azurerm_web_pubsub.webpubsub.name.

## azapi_resource data source

The [azapi_resource data source](https://registry.terraform.io/providers/Azure/azapi/latest/docs/data-sources/azapi_resource) is useful to get core information about existing resources.

The data source is a match for a straight [Get](https://docs.microsoft.com/en-gb/rest/api/webpubsub/controlplane/web-pub-sub/get) call. As an example Azure CLI `az rest` command where get is the default method:

```bash
az rest --uri "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azapi_labs/providers/Microsoft.SignalRService/webPubSub/azapi-labs-richeney?api-version=2021-10-01"
```

Let's see how that example REST API transfers to an azapi_resource data source.

1. Open the azapi_resource data source documentation

    Open the [azapi_resource data source](https://registry.terraform.io/providers/Azure/azapi/latest/docs/data-sources/azapi_resource) page.

    Note that an identity block is an exported [attribute](https://registry.terraform.io/providers/Azure/azapi/latest/docs/data-sources/azapi_resource#attributes-reference).

## Example 1

1. Add an azapi_resource **data** block to the main.tf

    ```json
    data "azapi_resource" "webpubsub_identity" {
      type      = "Microsoft.SignalRService/WebPubSub@2021-10-01"
      name      = azurerm_web_pubsub.webpubsub.name
      parent_id = azurerm_resource_group.azapi_labs.id

      depends_on = [
        azapi_update_resource.webpubsub_identity
      ]
    }
    ```

    Note that we have an explicit dependency on the azapi_update_resource.

1. Add an output

    ```json
    output "example1" {
      value = data.azapi_resource.webpubsub_identity
    }
    ```

1. Save main.tf

1. Apply

    ```bash
    terraform apply
    ```

1. View the output

    ```bash
    terraform output example1
    ```

    Example output:

    ```json
    {
      "id" = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azapi_labs/providers/Microsoft.SignalRService/WebPubSub/azapi-labs-richeney"
      "identity" = tolist([
        {
          "identity_ids" = tolist([])
          "principal_id" = "280ea032-f2cd-46cc-b66c-2234d079a88b"
          "tenant_id" = "72f988bf-86f1-41af-91ab-2d7cd011eb47"
          "type" = "SystemAssigned"
        },
      ])
      "location" = "westeurope"
      "name" = "azapi-labs-richeney"
      "output" = "{}"
      "parent_id" = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azapi_labs"
      "response_export_values" = tolist(null) /* of string */
      "tags" = tomap({})
      "timeouts" = null /* object */
      "type" = "Microsoft.SignalRService/WebPubSub@2021-10-01"
    }
    ```

    Key points:

    * You could modify the output to get what the dev need, e.g.

        ```json
        output "example1" {
          value = {
            tenant_id = data.azapi_resource.webpubsub_identity.identity[0].tenant_id
            object_id = data.azapi_resource.webpubsub_identity.identity[0].principal_id
          }
        }
        ```

        *Good to know, but from a learning perspective this feels like cheating.*

    * The output attribute is an empty JSON object `{}`
    * The response_export_values argument wants `list(string)`, but is currently set to `null`

1. Delete the output block (`output "example1"`) from main.tf

## Example 2

Let's use response_export_values properly.

1. Add response_export_values to the data source

    Think of response_export_values as a filter selecting the output JSON for that output attribute.

    If you want to see everything that is available then set `response_export_values = ["*"]`.

    Update your data source to match the block below.

    ```json
    data "azapi_resource" "webpubsub_identity" {
      type      = "Microsoft.SignalRService/WebPubSub@2021-10-01"
      name      = azurerm_web_pubsub.webpubsub.name
      parent_id = azurerm_resource_group.azapi_labs.id

      depends_on = [
        azapi_update_resource.webpubsub_identity
      ]

      response_export_values = ["*"]
    }
    ```

1. Add an initial output

    ```json
    output "example2" {
      value = jsondecode(data.azapi_resource.webpubsub_identity.output)
    }
    ```

1. Apply

    ```bash
    terraform apply
    ```

1. View the output

    ```bash
    terraform output example2
    ```

    Example output:

    ```json
    {
      "id" = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azapi_labs/providers/Microsoft.SignalRService/WebPubSub/azapi-labs-richeney"
      "identity" = {
        "principalId" = "280ea032-f2cd-46cc-b66c-2234d079a88b"
        "tenantId" = "72f988bf-86f1-41af-91ab-2d7cd011eb47"
        "type" = "SystemAssigned"
      }
      "location" = "westeurope"
      "name" = "azapi-labs-richeney"
      "properties" = {
        "disableAadAuth" = false
        "disableLocalAuth" = false
        "externalIP" = "20.61.103.175"
        "hostName" = "azapi-labs-richeney.webpubsub.azure.com"
        "hostNamePrefix" = "azapi-labs-richeney"
        "liveTraceConfiguration" = null
        "networkACLs" = {
          "defaultAction" = "Deny"
          "privateEndpoints" = []
          "publicNetwork" = {
            "allow" = [
              "ServerConnection",
              "ClientConnection",
              "RESTAPI",
              "Trace",
            ]
            "deny" = null
          }
        }
        "privateEndpointConnections" = []
        "provisioningState" = "Succeeded"
        "publicNetworkAccess" = "Enabled"
        "publicPort" = 443
        "resourceLogConfiguration" = null
        "serverPort" = 443
        "sharedPrivateLinkResources" = []
        "tls" = {
          "clientCertEnabled" = false
        }
        "version" = "1.0"
      }
      "sku" = {
        "capacity" = 1
        "name" = "Free_F1"
        "size" = "F1"
        "tier" = "Free"
      }
      "systemData" = {
        "createdAt" = "2022-05-13T14:53:39.8175203Z"
        "createdBy" = "richeney@microsoft.com"
        "createdByType" = "User"
        "lastModifiedAt" = "2022-05-30T13:58:25.7383904Z"
        "lastModifiedBy" = "richeney@microsoft.com"
        "lastModifiedByType" = "User"
      }
      "tags" = null
      "type" = "Microsoft.SignalRService/WebPubSub"
    }
    ```

    OK, so we have the full JSON output which is powerful.

    > Note that the output attribute in the data source also includes sections we might now want such as systemData etc.

1. Update the output block

    The example below will construct the object to match the specific requirement.

    ```json
    output "example2" {
      value = {
        tenant_id = jsondecode(data.azapi_resource.webpubsub_identity.output).identity.tenantId
        object_id = jsondecode(data.azapi_resource.webpubsub_identity.output).identity.principalId
      }
    }
    ```

    Example output:

    ```json
    example2 = {
      "object_id" = "280ea032-f2cd-46cc-b66c-2234d079a88b"
      "tenant_id" = "72f988bf-86f1-41af-91ab-2d7cd011eb47"
    }
    ```

1. Delete the data source block (`data "azapi_resource" "webpubsub_identity"`)
1. Delete the output (`output "example2"`)

## Example 3

1. Update the azapi_update_resource block

    Add in a more specific response_export_values filter to match the update.

    ```json
    resource "azapi_update_resource" "webpubsub_identity" {
      type      = "Microsoft.SignalRService/WebPubSub@2021-10-01"
      name      = azurerm_web_pubsub.webpubsub.name
      parent_id = azurerm_resource_group.azapi_labs.id

      body = jsonencode({
        identity = {
          "type" : "SystemAssigned"
        }
      })

      response_export_values = [
        "identity.principalId",
        "identity.tenantId"
      ]
    }
    ```

1. Add in an example3 output

    This is a simple version pulling out the entire identity JSON block, keeping the original keys.

    ```json
    output "example3" {
      value = jsondecode(azapi_update_resource.webpubsub_identity.output).identity
    }
    ```

    Example output:

    ```json
    example3 = {
      "principalId" = "280ea032-f2cd-46cc-b66c-2234d079a88b"
      "tenantId" = "72f988bf-86f1-41af-91ab-2d7cd011eb47"
    }
    ```

1. Update to final output

    Let's be more precise and construct the JSON block to specify keys in line with Terraform standards. We'll rename it at the same time

    ```json
    output "webpubsub_identity" {
      value = {
        tenant_id = jsondecode(azapi_update_resource.webpubsub_identity.output).identity.tenantId
        object_id = jsondecode(azapi_update_resource.webpubsub_identity.output).identity.principalId
      }
    }
    ```

    Example output:

    ```json
    webpubsub_identity = {
      "object_id" = "280ea032-f2cd-46cc-b66c-2234d079a88b"
      "tenant_id" = "72f988bf-86f1-41af-91ab-2d7cd011eb47"
    }
    ```

    Perfect.

## Summary

A few different approaches to the same (or similar) end result, but it allowed us to explore the data source and the response_export_values.

We used it to create Terraform outputs, but it could just as easily have been as an argument value for another resource type, e.g. an [azurerm_role_assignment](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment):

```json
resource "azurerm_role_assignment" "example" {
  scope                = azurerm_resource_group.azapi_labs.id
  role_definition_name = "Reader"
  principal_id         = jsondecode(azapi_update_resource.webpubsub_identity.output).identity.principalId
}
```

Move on to the last lab and we'll cleanly move to a fully native azurerm config.
