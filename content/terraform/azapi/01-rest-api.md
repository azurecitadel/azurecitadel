---
title: "Using the REST API"
date: 2021-05-30
slug: rest-api
draft: false
author: [ "Richard Cheney" ]
description: "Work out how to create a Web PubSub resource with the REST API before trying to use the Terraform AzAPI provider."
weight: 1
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

You decide to understand how to drive the deployment of Web PubSub using the REST API.

## Pre-reqs

1. Azure subscription
1. Microsoft.SignalRService provider is registered
1. Existing resource group

> The examples use "myResourceGroup"

## Documentation

The [Azure Web PubSub](https://docs.microsoft.com/azure/azure-web-pubsub/) documentation includes quickstarts for both the [portal](https://docs.microsoft.com/azure/azure-web-pubsub/howto-develop-create-instance) and the [Azure CLI](https://docs.microsoft.com/azure/azure-web-pubsub/quickstart-cli-create) for deploying an instance.

> The examples in `az webpubsub create --help` confirm that the key switches are `--location`, `--sku` (Free_F1 or Standard_S1) and `--unit-count` (defaults to 1). But there are other command subcategories such as `az webpubsub service`, `connection`, etc. to add additional configuration.

There is also a link in the Reference section to the [REST API](https://docs.microsoft.com/rest/api/webpubsub/).

Check through the documentation, the URI definition, the parameters and the examples to understand how the API call needs to be made. It will help to refer back to the documentation as you use the code blocks below.

## Construct the URI

Use the `az rest` command to automatically handle access tokens.

1. Navigate to the [Web PubSub - Create or Update](https://docs.microsoft.com/rest/api/webpubsub/controlplane/web-pub-sub/create-or-update) page.

    Method is `PUT`.

    URI resource path:

    ```http
    https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.SignalRService/webPubSub/{resourceName}?api-version=2021-10-01
    ```

1. Define the `$uri` variable

    Customise the URI, setting:

    * subscriptionId
    * resourceGroupName
    * resourceName

    > Note that resourceName forms part of the FQDN and must be globally unique.

    For example:

    ```http
    uri="https://management.azure.com/subscriptions/2d31be49-d959-4415-bb65-8aec2c90ba62/resourceGroups/myResourceGroup/providers/Microsoft.SignalRService/webPubSub/AzureCitadel?api-version=2021-10-01"
    ```

## Create the request body

1. View the request body in the [Examples](https://docs.microsoft.com/rest/api/webpubsub/controlplane/web-pub-sub/create-or-update#examples)

    ```json
    {
      "sku": {
        "name": "Standard_S1",
        "tier": "Standard",
        "capacity": 1
      },
      "properties": {
        "tls": {
          "clientCertEnabled": false
        },
        "liveTraceConfiguration": {
          "enabled": "false",
          "categories": [
            {
              "name": "ConnectivityLogs",
              "enabled": "true"
            }
          ]
        },
        "networkACLs": {
          "defaultAction": "Deny",
          "publicNetwork": {
            "allow": [
              "ClientConnection"
            ]
          },
          "privateEndpoints": [
            {
              "name": "mywebpubsubservice.1fa229cd-bf3f-47f0-8c49-afb36723997e",
              "allow": [
                "ServerConnection"
              ],
              "deny": [
                "ServerConnection",
                "RESTAPI",
                "Trace"
              ]
            }
          ]
        },
        "publicNetworkAccess": "Enabled",
        "disableLocalAuth": false,
        "disableAadAuth": false
      },
      "identity": {
        "type": "SystemAssigned"
      },
      "location": "eastus",
      "tags": {
        "key1": "value1"
      }
    }
    ```

1. Create a `body.json` file

    Create a file called body.json. Customise the JSON. Remove unneeded and defaulted sections.

    For example:

    ```json
    {
      "sku": {
        "name": "Free_F1",
        "capacity": 1
      },
      "location": "westeurope"
    }
    ```

1. Create the resource

    ```bash
    az rest --method put --uri $uri --body "@body.json"
    ```

    Example output:

    ```json
    {
      "id": "/subscriptions/2d31be49-d959-4415-bb65-8aec2c90ba62/resourceGroups/myResourceGroup/providers/Microsoft.SignalRService/WebPubSub/AzureCitadel",
      "location": "westeurope",
      "name": "AzureCitadel",
      "properties": {
        "disableAadAuth": false,
        "disableLocalAuth": false,
        "externalIP": null,
        "hostName": "azurecitadel.webpubsub.azure.com",
        "hostNamePrefix": "azurecitadel",
        "liveTraceConfiguration": null,
        "networkACLs": {
          "defaultAction": "Deny",
          "privateEndpoints": [],
          "publicNetwork": {
            "allow": [
              "ServerConnection",
              "ClientConnection",
              "RESTAPI",
              "Trace"
            ],
            "deny": null
          }
        },
        "privateEndpointConnections": [],
        "provisioningState": "Creating",
        "publicNetworkAccess": "Enabled",
        "publicPort": 443,
        "resourceLogConfiguration": null,
        "serverPort": 443,
        "sharedPrivateLinkResources": [],
        "tls": {
          "clientCertEnabled": false
        },
        "version": "1.0-preview"
      },
      "sku": {
        "capacity": 1,
        "name": "Free_F1",
        "size": "F1",
        "tier": "Free"
      },
      "systemData": {
        "createdAt": "2022-05-06T16:13:54.3871439Z",
        "createdBy": "richeney@azurecitadel.com",
        "createdByType": "User",
        "lastModifiedAt": "2022-05-06T16:13:54.3871439Z",
        "lastModifiedBy": "richeney@azurecitadel.com",
        "lastModifiedByType": "User"
      },
      "tags": null,
      "type": "Microsoft.SignalRService/WebPubSub"
    }
    ```

    ⚠️ *What changes have been made from the example?*

1. Check the resource

    Check the output JSON to make sure that it has been created correctly. Review the resource in the portal.

    Modify and retest as necessary.

## Delete the resource

1. Remove the resource

    Remove the resource in the portal, or use the CLI, e.g.:

    ```bash
    az webpubsub delete --name AzureCitadel --resource-group myResourceGroup
    ```

## Summary

You have worked through a simple example of how to find the REST API documentation and form the URI and request body for a resource create or update.

You are ready to use AzAPI.
