---
title: "azapi_update_resource"
date: 2021-05-30
slug: azapi_update_resource
draft: false
author: [ "Richard Cheney" ]
description: "Add an azapi_update_resource block into your Terraform config to configure properties that are not yet supported in the azurerm provider."
weight: 4
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

The developers have come back to you as they need to make use of managed identity for their application. They want a system assigned managed identity and they will need to know both the tenant id and the object id.

The only problem is that it is not yet supported in the the [azurerm_web_pubsub](https://registry.terraform.io/providers/hashicorp/azurerm/2.94.0/docs/resources/web_pubsub) resource type.

Not a problem. You can use the azapi provider's azapi_update_resource in the meantime.

Let's see how the azapi_update_resource is used.

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
```

> ⚠️ You should have a different value for your azurerm_web_pubsub.webpubsub.name.

## Sample REST API update

Go back to the [Web Pub Sub REST API](https://docs.microsoft.com/rest/api/webpubsub/controlplane/web-pub-sub) reference documentation.

There are two ways of updating a Web Pub Sub resource via the REST API. You can use either

1. [Create or Update](https://docs.microsoft.com/rest/api/webpubsub/controlplane/web-pub-sub/create-or-update)with PUT method, or
1. [Update](https://docs.microsoft.com/rest/api/webpubsub/controlplane/web-pub-sub/update), with PATCH method

[Update](https://docs.microsoft.com/rest/api/webpubsub/controlplane/web-pub-sub/update) aligns with azapi_update_resource. Check out the [reference specification](https://docs.microsoft.com/en-gb/rest/api/webpubsub/controlplane/web-pub-sub/update#managedidentity) and [examples](https://docs.microsoft.com/rest/api/webpubsub/controlplane/web-pub-sub/update#examples).

Here is an example REST API request and body to add a system assigned managed identity to the Web Pub Sub service:

### Request

```http
PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azapi_labs/providers/Microsoft.SignalRService/webPubSub/azapi-labs-richeney?api-version=2021-10-01
```

### Body

```json
{
  "identity": {
    "type": "SystemAssigned"
  },
  "location": "westeurope"
}
```

### az rest

Here is the matching Azure CLI command.

```bash
az rest --method patch \
  --uri "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azapi_labs/providers/Microsoft.SignalRService/webPubSub/azapi-labs-richeney?api-version=2021-10-01" \
  --body '{"identity":{"type":"SystemAssigned"}}'
```

> ⚠️ Strictly speaking the issues on the azapi repo suggest that PATCH is not supported as a method, but it appears to merge the body JSON with the existing config so you can use a partial JSON that would not be supported by a PUT method.

## azapi_update_resource

Let's see how that example REST API patch transfers to an azapi_update_resource.

1. Open the azapi_update_resource documentation

    Open the [azapi_update_resource](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/azapi_update_resource) page.

    Pay attention to the note, which is copied out below:

    > This resource is used to add or modify properties on an existing resource. When delete azapi_update_resource, no operation will be performed, and these properties will stay unchanged. If you want to restore the modified properties to some values, you must apply the restored properties before deleting.

1. Add the azapi_update_resource block to the main.tf

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
    }
    ```

    > ⚠️ Remember that your azapi_update_resource.webpubsub_identity.name should match the resource name for your Web Pub Sub resource. Don't use `azapi-labs-richeney`.

    Setting the name to the exported name of the main resource will automatically set up an implicit dependency between azapi_update_resource.webpubsub_identity and azurerm_web_pubsub.webpubsub.

    You may also add an explicit dependency into the block if desired, e.g.:

    ```json
      depends_on = [
        azurerm_web_pubsub.webpubsub
      ]
    ```

1. Save main.tf

1. Plan

    ```bash
    terraform plan
    ```

    {{< raw >}}
    <pre style="color:white; background-color:black">
    <span style="font-weight:bold;">azurerm_resource_group.azapi_labs: Refreshing state... [id=/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azapi_labs]</span>
    <span style="font-weight:bold;">azurerm_web_pubsub.webpubsub: Refreshing state... [id=/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azapi_labs/providers/Microsoft.SignalRService/WebPubSub/azapi-labs-richeney]</span>

    Terraform used the selected providers to generate the following execution
    plan. Resource actions are indicated with the following symbols:
      <span style="color:lime;">+</span> create

    Terraform will perform the following actions:

    <span style="font-weight:bold;">  # azapi_update_resource.webpubsub_identity</span> will be created
      <span style="color:lime;">+</span> resource &quot;azapi_update_resource&quot; &quot;webpubsub_identity&quot; {
          <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>body                    = jsonencode(
                {
                  <span style="color:lime;">+</span> identity = {
                      <span style="color:lime;">+</span> type = &quot;SystemAssigned&quot;
                    }
                }
            )
          <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>id                      = (known after apply)
          <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>ignore_casing           = false
          <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>ignore_missing_property = false
          <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>name                    = &quot;azapi-labs-richeney&quot;
          <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>output                  = (known after apply)
          <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>parent_id               = &quot;/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azapi_labs&quot;
          <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>resource_id             = (known after apply)
          <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>type                    = &quot;Microsoft.SignalRService/WebPubSub@2021-10-01&quot;
        }

    <span style="font-weight:bold;">Plan:</span> 1 to add, 0 to change, 0 to destroy.
    <span style="filter: contrast(70%) brightness(190%);color:dimgray;">
    ─────────────────────────────────────────────────────────────────────────────</span>

    Note: You didn't use the -out option to save this plan, so Terraform can't
    guarantee to take exactly these actions if you run &quot;terraform apply&quot; now.
    </pre>
    {{< /raw >}}

1. Apply

    ```bash
    terraform apply --auto-approve
    ```

    Terraform uses the azapi provider to update the Web PubSub resource.

## Check

1. Check the identity blade for the Web Pub Sub resource

    ![azapi_update_resource](/terraform/azapi/images/azapi_update_resource.png)

    The system assigned identity has been successfully enabled.

1. List the identifiers in state

    ```bash
    terraform state list
    ```

    Example output:

    ```text
    azapi_update_resource.webpubsub_identity
    azurerm_resource_group.azapi_labs
    azurerm_web_pubsub.webpubsub
    ```

1. Display the resource attributes from state

    ```bash
    terraform state show azapi_update_resource.webpubsub_identity
    ```

    Example output:

    ```text
    # azapi_update_resource.webpubsub_identity:
    resource "azapi_update_resource" "webpubsub_identity" {
        body                    = jsonencode(
            {
                identity = {
                    type = "SystemAssigned"
                }
            }
        )
        id                      = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azapi_labs/providers/Microsoft.SignalRService/WebPubSub/azapi-labs-richeney"
        ignore_casing           = false
        ignore_missing_property = false
        name                    = "azapi-labs-richeney"
        output                  = jsonencode({})
        parent_id               = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azapi_labs"
        resource_id             = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/azapi_labs/providers/Microsoft.SignalRService/WebPubSub/azapi-labs-richeney"
        type                    = "Microsoft.SignalRService/WebPubSub@2021-10-01"
    }
    ```

## Summary

You have successfully used the azapi provider to update a resource via the REST API.

The only issue is that the azapi_update_resource does not export all of the attributes, including the object id for the system assigned managed identity.

That would be useful if the config needs to create an [azurerm_role_assignment](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment), or at least output the object ID.

Move on to the next lab and we'll use the azapi's data source.
