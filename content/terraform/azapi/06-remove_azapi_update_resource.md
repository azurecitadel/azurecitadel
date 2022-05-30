---
title: "Removing azapi_update_resource"
date: 2021-05-30
slug: remove_azapi_update_resource
draft: false
author: [ "Richard Cheney" ]
description: "Safely remove an azapi_update_resource block once the property is supported in the azurerm provider."
weight: 6
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

Good news!

The [azurerm_web_pubsub](https://registry.terraform.io/providers/hashicorp/azurerm/2.97.0/docs/resources/web_pubsub) resource now supports an identity block.

Time to safely remove the final trace of azapi from the config and go fully native with the azurerm provider.

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

  response_export_values = [
    "identity.principalId",
    "identity.tenantId"
  ]
}

output "webpubsub_identity" {
  value = {
    tenant_id = jsondecode(azapi_update_resource.webpubsub_identity.output).identity.tenantId
    object_id = jsondecode(azapi_update_resource.webpubsub_identity.output).identity.principalId
  }
}
```

> ⚠️ You should have a different value for your azurerm_web_pubsub.webpubsub.name.

## Update the native resources

1. Update the required provider version to 2.97

    ```json
    terraform {
      required_providers {
        azurerm = {
          source  = "hashicorp/azurerm"
          version = "=2.97"
        }

        azapi = {
          source  = "azure/azapi"
          version = "=0.3.0"
        }
      }
    }
    ```

1. Add identity.type = "SystemAssigned" to the azurerm_web_pubsub block

    ```json
    resource "azurerm_web_pubsub" "webpubsub" {
      name                = "azapi-labs-richeney"
      resource_group_name = azurerm_resource_group.azapi_labs.name
      location            = azurerm_resource_group.azapi_labs.location
      sku                 = "Free_F1"
      capacity            = 1

      identity {
        type = "SystemAssigned"
      }
    }
    ```

1. Upgrade the provider

    ```bash
    terraform init --upgrade
    ```

    Terraform will install version 2.97.

1. Refresh

    If you run `terraform state show azurerm_web_pubsub.webpubsub` then there will be no identity block as it is still as per v2.94. Refresh the state.

    ```bash
    terraform refresh
    ```

1. View the resource

    ```bash
    terraform state show azurerm_web_pubsub.webpubsub
    ```

    The state file now includes the identity block. Example output:

    ```text
    # azurerm_web_pubsub.webpubsub:
    resource "azurerm_web_pubsub" "webpubsub" {
        aad_auth_enabled              = true
        capacity                      = 1
        external_ip                   = "20.61.103.185"
        hostname                      = "azapi-labs-richeney.webpubsub.azure.com"
        id                            = "/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/azapi_labs/providers/Microsoft.SignalRService/WebPubSub/azapi-labs-richeney"
        local_auth_enabled            = true
        location                      = "westeurope"
        name                          = "azapi-labs-richeney"
        primary_access_key            = (sensitive value)
        primary_connection_string     = (sensitive value)
        public_network_access_enabled = true
        public_port                   = 443
        resource_group_name           = "azapi_labs"
        secondary_access_key          = (sensitive value)
        secondary_connection_string   = (sensitive value)
        server_port                   = 443
        sku                           = "Free_F1"
        tags                          = {}
        tls_client_cert_enabled       = false
        version                       = "1.0"

        identity {
            identity_ids = []
            principal_id = "280ea032-f2cd-46cc-b66c-2234d089a88b"
            tenant_id    = "72f988bf-86f1-41af-91ab-2d7cd011db47"
            type         = "SystemAssigned"
        }

        timeouts {}
    }
    ```

1. Update the output

    Update the existing output to reference the azurerm_web_pubsub.webpubsub values.

    ```json
    output "webpubsub_identity" {
      value = {
        tenant_id = azurerm_web_pubsub.webpubsub.identity[0].tenant_id
        object_id = azurerm_web_pubsub.webpubsub.identity[0].principal_id
      }
    }
    ```

    If you were to run `terraform plan` then it will show that no changes are needed.

## Clean up the azapi resources

1. View the state identifiers

    ```bash
    terraform state list
    ```

    Expected output:

    ```text
    azapi_update_resource.webpubsub_identity
    azurerm_resource_group.azapi_labs
    azurerm_web_pubsub.webpubsub
    ```

1. Remove azapi_update_resource from state

    ```bash
    terraform state rm azapi_update_resource.webpubsub_identity
    ```

    Expected output:

    ```text
    Removed azapi_update_resource.webpubsub_identity
    Successfully removed 1 resource instance(s).
    ```

1. Remove the azapi_update_resource block from main.tf

    Either delete the block, or surround it with a multiline comment.

    > `/*` and `*/` are start and end delimiters for a comment that might span over multiple lines.

1. Run `terraform plan`

    No changes should be required.

## Summary

No need to import this time as the resource was already there and just needed a gentle refresh to pull in the info into the right object in state.

The output needed to be updated to remove remaining references to the azapi_update_resource and then we could
clean up the state.

Note that it safe to remove `provider "azapi" {}` and the azapi entry from the terraform block's required_provider object. All of the provider will still remain in your .terraform directory:

{{< raw >}}
<pre style="color:white; background-color:#22272e">
<span style="font-weight:bold;color:#4478b8;">.terraform/providers</span>
└── <span style="font-weight:bold;color:#4478b8;">registry.terraform.io</span>
    ├── <span style="font-weight:bold;color:#4478b8;">azure</span>
    │   └── <span style="font-weight:bold;color:#4478b8;">azapi</span>
    │       └── <span style="font-weight:bold;color:#4478b8;">0.3.0</span>
    │           └── <span style="font-weight:bold;color:#4478b8;">linux_amd64</span>
    │               └── <span style="font-weight:bold;color:#9a9e64;">terraform-provider-azapi_v0.3.0</span>
    └── <span style="font-weight:bold;color:#4478b8;">hashicorp</span>
        └── <span style="font-weight:bold;color:#4478b8;">azurerm</span>
            ├── <span style="font-weight:bold;color:#4478b8;">2.93.0</span>
            │   └── <span style="font-weight:bold;color:#4478b8;">linux_amd64</span>
            │       └── <span style="font-weight:bold;color:#9a9e64;">terraform-provider-azurerm_v2.93.0_x5</span>
            ├── <span style="font-weight:bold;color:#4478b8;">2.94.0</span>
            │   └── <span style="font-weight:bold;color:#4478b8;">linux_amd64</span>
            │       └── <span style="font-weight:bold;color:#9a9e64;">terraform-provider-azurerm_v2.94.0_x5</span>
            └── <span style="font-weight:bold;color:#4478b8;">2.97.0</span>
                └── <span style="font-weight:bold;color:#4478b8;">linux_amd64</span>
                    └── <span style="font-weight:bold;color:#9a9e64;">terraform-provider-azurerm_v2.97.0_x5</span>

15 directories, 5 files
</pre>
{{< /raw >}}

Run `terraform destroy` if you wish to clean up your lab resources.

You have worked through all of the labs successfully and emulated a scenario where you bridged gaps in the azurerm functionality with the azapi resources and data sources.
