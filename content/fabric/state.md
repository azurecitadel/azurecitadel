---
title: "Remote State"
description: "Configure a storage account for use as a remote state in Terraform."
layout: single
draft: false
menu:
  side:
    parent: fabric
    identifier: fabric-state
series:
 - fabric_terraform_administrator
weight: 15
---

## Introduction

When you run terraform in a pipeline then you will need to configure a backend for the remote state.

In this lab you'll create a storage account with suitable settings, and then give yourself access to write blobs to it.

You will configure the storage account in either

- your single subscription (suitable for testing)
- a separate subscription (e.g. a Management subscription in a platform landing zone) (see [aka.ms/alz](https://aka.ms/alz))

Configuration will include

- enforced role based access control (RBAC) as per the [security recommendations](https://learn.microsoft.com/azure/storage/blobs/security-recommendations)
- versioning
- soft delete

## Create the storage account

1. Define the variable

    - Default the location and resource group names

        ```shell
        rg=terraform
        loc=uksouth
        ```

        Feel free to set these to your own preferred values.

    - Set to the current subscription in scope (single subscription)

        ```shell
        subscriptionId=$(az account show --query id -otsv)
        ```

       or an alternate subscription as per the recommendations

        ```shell
        subscriptionId<managementSubscriptionId>
        ```

1. Create the resource group

    ```shell
    az group create --name $rg --location $loc
    ```

1. Define the storage account name

    The name needs to be globally unique, therefore the command generated a predictable string from a hash of the resource group ID.

    ```shell
    storage_account_name="terraformfabric$(az group show --name $rg --query id -otsv | sha1sum | cut -c1-8)"
    ```

1. Create the storage account

    ```shell
    storage_account_id=$(az storage account create --name $storage_account_name --resource-group $rg --location $loc \
      --min-tls-version TLS1_2 --sku Standard_LRS --https-only true --default-action "Allow" --public-network-access "Enabled"  \
      --allow-shared-key-access false --allow-blob-public-access false --query id -otsv)
    ```

1. Enable versioning and soft delete

    ```shell
    az storage account blob-service-properties update --account-name $storage_account_name --enable-versioning --enable-delete-retention --delete-retention-days 7
    ```

1. Create the tfstate container

    ```shell
    az storage container create --name tfstate --account-name $storage_account_name --auth-mode login
    ```

1. Add Storage Blob Data Contributor role assignment

    ```shell
    az role assignment create --assignee $(az ad signed-in-user show --query id -otsv) --scope "$storage_account_id" --role "Storage Blob Data Contributor"
    ```

## Next

The storage account is ready for use as a remote state backend. Let's set up Terraform in the user context and build out a config before automating more fully with a service principal and GitHub Actions workflow.
