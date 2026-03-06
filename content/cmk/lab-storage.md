---
title: "Lab: CMK for Storage"
description: "Create an HSM-backed key in Azure Key Vault Premium and use it to encrypt an Azure Storage account. The first of three challenge-style labs."
date: 2026-03-06
author: [ "Richard Cheney" ]
draft: false
weight: 40
menu:
  side:
    parent: cmk
    identifier: cmk-lab-storage
series:
  - cmk
---

## Objectives

By the end of this lab you will have:

- Provisioned a Key Vault Premium vault with an RSA-HSM key.
- Created a storage account encrypted with that customer-managed key.
- Verified that the encryption is in place and points at your key.

## Set up variables

Start by setting some variables you will reuse throughout.

```shell
LOCATION=eastus2
RG=rg-cmk-labs
KV_NAME=kv-cmk-$(cat /dev/urandom | tr -dc 'a-z0-9' | head -c6)
KEY_NAME=cmk-storage-key
SA_NAME=sacmk$(cat /dev/urandom | tr -dc 'a-z0-9' | head -c8)
```

Create the resource group.

```shell
az group create --name $RG --location $LOCATION
```

## Step 1: Create a Key Vault Premium vault

```shell
az keyvault create \
  --name $KV_NAME \
  --resource-group $RG \
  --location $LOCATION \
  --sku Premium \
  --enable-rbac-authorization true
```

{{< flash "tip" >}}
We enable RBAC authorisation on the vault (`--enable-rbac-authorization true`) rather than using the older access policy model. This keeps everything in Azure RBAC and makes auditing straightforward.
{{< /flash >}}

## Step 2: Generate an HSM-backed key

```shell
az keyvault key create \
  --vault-name $KV_NAME \
  --name $KEY_NAME \
  --kty RSA-HSM \
  --size 2048
```

Confirm the key is HSM-protected — the `keyType` in the response should be `RSA-HSM` rather than `RSA`.

```shell
az keyvault key show --vault-name $KV_NAME --name $KEY_NAME --query "key.kty"
```

> **Managed HSM equivalent:** Use `az keyvault key create --hsm-name <mhsm-name>` instead. The key type is `RSA-HSM` in both cases — the difference is that the key lives in your dedicated HSM cluster.

## Step 3: Create the storage account with a managed identity

The storage account needs a managed identity so you can grant it access to the key.

```shell
az storage account create \
  --name $SA_NAME \
  --resource-group $RG \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2 \
  --assign-identity \
  --identity-type SystemAssigned
```

Capture the storage account's principal ID.

```shell
SA_PRINCIPAL_ID=$(az storage account show \
  --name $SA_NAME \
  --resource-group $RG \
  --query "identity.principalId" -o tsv)
```

## Step 4: Grant the storage account access to the key

The storage account needs the **Key Vault Crypto Service Encryption User** role on the vault so it can wrap and unwrap keys.

```shell
KV_ID=$(az keyvault show --name $KV_NAME --resource-group $RG --query id -o tsv)

az role assignment create \
  --role "Key Vault Crypto Service Encryption User" \
  --assignee-object-id $SA_PRINCIPAL_ID \
  --assignee-principal-type ServicePrincipal \
  --scope $KV_ID
```

## Step 5: Enable CMK encryption on the storage account

Retrieve the key URI and attach it to the storage account.

```shell
KEY_URI=$(az keyvault key show \
  --vault-name $KV_NAME \
  --name $KEY_NAME \
  --query "key.kid" -o tsv)

az storage account update \
  --name $SA_NAME \
  --resource-group $RG \
  --encryption-key-source Microsoft.Keyvault \
  --encryption-key-vault "https://${KV_NAME}.vault.azure.net" \
  --encryption-key-name $KEY_NAME
```

## Step 6: Verify

```shell
az storage account show \
  --name $SA_NAME \
  --resource-group $RG \
  --query "encryption.{source:keySource, vault:keyVaultProperties.keyVaultUri, key:keyVaultProperties.keyName}" \
  -o table
```

You should see `keySource` as `Microsoft.Keyvault` and the vault and key name pointing at your Key Vault. Upload a blob and confirm the data is there — the CMK encryption is transparent to the data plane.

## What to discuss

- What happens if you delete or disable the CMK? The storage account becomes inaccessible to all data plane operations until the key is restored.
- How does key rotation work? You can create a new key version and point the storage account at it, or enable auto-rotation on the Key Vault key.
- **Managed HSM difference:** The grant mechanism changes — instead of a vault-scoped role assignment, you would assign the **Managed HSM Crypto Service Encryption User** role on the HSM itself (using `az keyvault role assignment create --hsm-name`).

Reference: [Customer-managed keys for Azure Storage encryption](https://learn.microsoft.com/azure/storage/common/customer-managed-keys-overview)
