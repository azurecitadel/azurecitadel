---
title: "Using az rest"
date: 2021-02-16
slug: cli
draft: false
author: [ "Richard Cheney" ]
description: "How do you call the REST API using the az rest command?"
weight: 2
menu:
  side:
    parent: 'rest-api'
series:
 - rest-api
layout: single
---

## Introduction

The easiest way to test REST API calls is with the Azure CLI's `az rest` command. The command simplifies the access token and also substitutes `{subscriptionId}`.

Here are the steps to read a resource group, delete it, recreate it and then update the tags.

## Pre-reqs

The lab starts with an empty resource group.

1. Log in using `az login`
1. Check context using `az account show`

    > You can switch context using `az account set`.

1. Create a resource group

    ```bash
    az group create --name "myResourceGroup" --location "West Europe"
    ```

    > Use a different resource group name if that already exists in your subscription.

## Token

There is no need to get the token with the `az rest` command.

1. Authenticate with `az login`
1. Check context with `az account show`

> The CLI will cache the token in ~/.azure/msal_token_cache.json.

You can also display the token with `az account get-access-token --query accessToken`.

> The token is a standard JSON web token. Paste the value into <https://jwt.ms> to view the claims.

See `az login --help` for examples if authenticating as a service principal or managed identity.

## Get

Another benefit of the `az rest` command is that `{subscriptionId}` in all of the references will be replace by the value of `az account show --query id`.

1. View the [Resource Groups - Get](https://learn.microsoft.com/rest/api/resources/resource-groups/get) documentation

    See the example:

    ```text
    GET https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}?api-version=2021-04-01
    ```

1. Use `az rest` to get

    Note that if method is not specified then `az rest` defaults to `GET`.

    ```bash
    az rest --uri https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/myResourceGroup?api-version=2021-04-01
    ```

    Example output:

    ```json
    {
      "id": "/subscriptions/2d31be49-d959-4415-bb65-8aec2c90ba62/resourceGroups/myResourceGroup",
      "location": "westeurope",
      "name": "myResourceGroup",
      "properties": {
        "provisioningState": "Succeeded"
      },
      "type": "Microsoft.Resources/resourceGroups"
    }
    ```

    > Note that you can combine with standard --query and --output switches, e.g. `az rest --uri $uri --query id --output tsv`.

## Delete

The delete uses the same uri. You specify the `DELETE` method.

1. View the [Resource Groups - Delete](https://learn.microsoft.com/rest/api/resources/resource-groups/delete) documentation
1. Use `az rest` to delete

    ```bash
    az rest --method delete --uri https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/myResourceGroup?api-version=2021-04-01
    ```

    > Note that the command returns immediately. The `az group delete` command usually waits unless `--no-wait` is specified. You can check status using the get call.

## Create or Update

The create uses `PUT`, and requires a request body.

1. View the [Resource Groups - Create Or Update](https://learn.microsoft.com/rest/api/resources/resource-groups/create-or-update) documentation

    Use the *In this article* link to jump to the [Request Body](https://learn.microsoft.com/rest/api/resources/resource-groups/create-or-update#request-body) and the [Examples](https://learn.microsoft.com/rest/api/resources/resource-groups/create-or-update#request-body)

    The example JSON request body for resource groups is simple:

    ```json
    {
      "location": "westeurope"
    }
    ```

    We will use more complex JSON to assign the new managedBy property using a variable.

1. Set a variable for your objectId

    ```bash
    objectId=$(az ad signed-in-user show --query objectId --output tsv --only-show-errors)
    ```

1. Use `az rest` to create

    ```bash
    az rest --method put --body "{\"location\":\"westeurope\",\"managedBy\":\"$objectId\"}"  --uri https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/myResourceGroup?api-version=2021-04-01
    ```

    Note that the minified JSON for the `--body` switch is a double quoted string. The `$objectId` will be resolved. Using double quotes means that all quotes within the JSON need to be escaped with a backslash.

    If your request body string is literal then you can use single quotes, e.g. `'{"location":"westeurope"}'`.

## Update

The update uses `PATCH` and also requires a JSON request body. We'll use a variable in the JSON and update the tags.

1. View the [Resource Groups - Update](https://learn.microsoft.com/rest/api/resources/resource-groups/update) documentation

    Note the [ResourceGroupPatchable](https://learn.microsoft.com/rest/api/resources/resource-groups/update#resourcegrouppatchable) section. This is a subset of the overall resource group properties.

    For instance, you cannot update the location as that would force a deletion and recreation for the resource group.

1. Create variables

    It is common to use variables for the `--uri` and `--body` switches.

    ```bash
    uri=https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/myResourceGroup?api-version=2021-04-01
    ```

    ```bash
    owner="Your Name"
    ```

    ```bash
    body=$(cat <<EOF
    {
      "tags": {
        "owner": "$owner",
        "site": "Azure Citadel"
      }
    }
    EOF
    )
    ```

    The last command uses a heredoc with a variable. There are other ways of dynamically generating JSON, e.q. `jq`.

1. Use `az rest` to patch

    Update the tags.

    ```bash
    az rest --method patch --body "$body" --uri $uri
    ```

The resource group's tags will be updated.

## Summary

You have used the REST API via the Azure CLI's `az rest` command to show, delete, recreate and update a resource.
