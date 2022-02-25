---
title: "Pod Identity and Key Vault Secrets"
author: [ "Richard Cheney" ]
description: "Use a managed identity to access a storage account. Store secrets in an Azure Key Vault and surface them as a secret store in the pod."
draft: true
weight: 1
menu:
  side:
    parent: aks
---

## Introduction

We will create a storage account with a blob (using RBAC for auth) and a Key Vault with a secret (using an access policy for auth). We will create a user assigned managed identity and then use that identity within a pod to access both resources.

We'll be creating a namespace, alpha, to use with our identity. We'll also make the storage account and key vault accessible using a private link and close off public access at the end.

## Setup

Pod Identity is a preview feature.

1. Enable the feature and extend the CLI

   ```bash
   az feature register --name EnablePodIdentityPreview --namespace Microsoft.ContainerService
   az extension add --name aks-preview
   ```

1. Check the feature is registered

    The feature registration will take some time and you need it to be registered before you create the AKS cluster. Check with:

    ```bash
    az feature show --name EnablePodIdentityPreview --namespace Microsoft.ContainerService
    ```

1. Create resource group and defaults

    We'll also create a resource group to work in and set some temporary defaults for the session.

    ```bash
    export AZURE_DEFAULTS_GROUP=podidentity
    export AZURE_DEFAULTS_LOCATION=uksouth

    az group create --name podidentity
    ```

    > Setting the defaults allows us to keep the commands shorter and avoid constantly specify the `--location` abd `--resource-group` switches.

## Identity and resources

We'll create the vnet, identity, key vault and storage account.

1. Create the alpha identity

    ```bash
    az identity create --name alpha
    identityId=$(az identity show --name alpha --query id -otsv)
    identityClientId=$(az identity show --name alpha --query clientId -otsv)
    identityPrincipalId=$(az identity show --name alpha --query principalId -otsv)
    uniq=alpha$(head -c1000 < /dev/urandom | tr -dc "[:lower:][:digit:]" | head -c 8)
    ```

1. Create a virtual network

    ```bash
    az network vnet create --name podIdentityVnet --address-prefixes 10.76.0.0/22
    vnetId=$(az network vnet show --name podIdentityVnet --query id -otsv)
    az network vnet subnet create --name aks --address-prefixes 10.76.1.0/24 --vnet-name podIdentityVnet
    subnetId=$(az network vnet subnet show --name aks --vnet-name podIdentityVnet --query id -otsv)
    az network vnet subnet update --disable-private-endpoint-network-policies true --name aks --vnet-name podIdentityVnet
    ```

    > The last command is only required whilst there is a [limitation](https://docs.microsoft.com/azure/private-link/private-endpoint-overview#limitations) on NSGs and UDRs not applying to provate endpoints.

1. Set up the DNS basics

    ```bash
    az network private-dns zone create --name "privatelink.blob.core.windows.net"
    az network private-dns link vnet create --name storageLink --zone-name "privatelink.blob.core.windows.net" --registration-enabled false --virtual-network podIdentityVnet

    az network private-dns zone create --name "privatelink.vault.azure.net"
    az network private-dns link vnet create --name keyvaultLink --zone-name "privatelink.vault.azure.net" --registration-enabled false --virtual-network podIdentityVnet
    ```

1. Create the storage account

    Create the storage account with a private endpoint and matching DNS record. Allow the identity to read and write blobs and then set the storage env var.

    ```bash
    az storage account create --name $uniq --sku Standard_LRS
    storageId=$(az storage account show --name $uniq --query id -otsv)
    az network private-endpoint create --name alphaStorageEndpoint --vnet-name podIdentityVnet --subnet aks --private-connection-resource-id $storageId --group-id blob --connection-name alphaStorageConnection
    az network private-endpoint dns-zone-group create --endpoint-name alphaStorageEndpoint --name alphaStorage --private-dns-zone "privatelink.blob.core.windows.net" --zone-name blob
    az role assignment create --scope $storageId --assignee-object-id $identityPrincipalId --role "Storage Blob Data Contributor"
    export AZURE_STORAGE_ACCOUNT=$uniq
    ```

    The list of possible group-ids is found using `az network private-link-resource list --id <resourceId>`.

1. Create the test blob

    ```bash
    cat > testblob <<EOF
    This is a test file.
    Only pods in the alpha namespace bound to the alpha identity should be able to access this file.
    EOF

    az storage container create --name test --public-access off

1. Create the key vault

    ```bash
    az keyvault create --name $uniq --enable-rbac-authorization
    keyvaultId=$(az keyvault show --name $uniq --query id -otsv)
    az network private-endpoint create --name alphaKeyVaultEndpoint --vnet-name podIdentityVnet --subnet aks --private-connection-resource-id $keyvaultId --group-id vault --connection-name alphaKeyvaultConnection
    az network private-endpoint dns-zone-group create --endpoint-name alphaKeyvaultEndpoint --name alphaKeyvault --private-dns-zone "privatelink.vault.azure.net" --zone-name vault
    az role assignment create --scope $keyvaultId --assignee-object-id $identityPrincipalId --role "Key Vault Secrets User"
    ```


Testing of a change after migration
