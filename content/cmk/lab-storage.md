---
title: "🧪 CMK for Storage"
description: "Create a key in the Azure Key Vault Premium and then encrypt an Azure Storage account."
date: 2026-03-06
author: [ "Richard Cheney" ]
draft: false
weight: 22
menu:
  side:
    parent: cmk
    identifier: cmk-lab-storage
series:
  - cmk
---

## Objectives

By the end of this lab you will have:

- Created an RSA-HSM key in the Azure Key Vault Premium.
- Created a storage account encrypted with that customer-managed key.
- Verified that the encryption is in place and points at your key.

You will need to have completed the [Azure Key Vault Premium](../lab-akvp) lab.

## Set up variables

If you are continuing straight from the previous lab then you should already have these set. If not, set them to the correct values.

1. Set default variables.

    ```shell
    export AZURE_DEFAULTS_LOCATION="italynorth"
    export AZURE_DEFAULTS_GROUP="cmk"
    ```

1. Get the key vault name and determine the storage account name

    This command assumes that you only have on active key vault in the resource group.

    ```shell
    resource_group_id=$(az group show --name $AZURE_DEFAULTS_GROUP --query id -otsv)
    key_vault_name=$(az keyvault list --query "[0].name" -otsv)
    uniq=$(md5sum <<< $resource_group_id | cut -c1-8)
    storage_account_name=sacmk${uniq}
    key_name="cmk-lab-storage"
    ```

## Generate the key

1. Generate an HSM-backed key

    ```shell
    az keyvault key create --name $key_name \
      --vault-name $key_vault_name \
      --kty RSA-HSM --size 2048
    ```

    {{< output >}}

```json
{
  "attributes": {
    "created": "2026-03-30T15:57:29+00:00",
    "enabled": true,
    "expires": null,
    "exportable": false,
    "hsmPlatform": "2",
    "notBefore": null,
    "recoverableDays": 7,
    "recoveryLevel": "CustomizedRecoverable+Purgeable",
    "updated": "2026-03-30T15:57:29+00:00"
  },
  "key": {
    "crv": null,
    "d": null,
    "dp": null,
    "dq": null,
    "e": "AQAB",
    "k": null,
    "keyOps": [
      "encrypt",
      "decrypt",
      "sign",
      "verify",
      "wrapKey",
      "unwrapKey"
    ],
    "kid": "https://cmk-bd36f48c.vault.azure.net/keys/cmk-lab-storage/bcb5d6274b3f46a3a5f6c25a256789fc",
    "kty": "RSA-HSM",
    "n": "kbDOIxmB1nnCzUSzXxtHpRVw0EPpK4p9ljzYtO1CP6K470gvK0mWahPNL/b/oBeZZC1Y9DMgL5RtM8ucRlTM9rWhDs5LAg9ABX6xhm52qpjuHLM6SGCoCFRYBFzPnkMhoDU+uaX8L3LvXiQZny7/4RB5boqQuL9fuUYPCzYGmVywAEOWHhHOTK1dgeViPeMouD0cBo5UVZ+smNzKvMSqD/h2X1uMEdsmXYtd8MEn0clJkzsSuXPn5yIrLrjnjmYRQiHyTOpHIUXYxtqCL4xhTl1zY9IUSEVmNVtWYy7zTGy0PZFOnBjK00iEy3QD5eIkrkWPBfNGhhCeOchDdsp7+w==",
    "p": null,
    "q": null,
    "qi": null,
    "t": null,
    "x": null,
    "y": null
  },
  "managed": null,
  "releasePolicy": null,
  "tags": null
}
```

{{< /output >}}

    {{< flash >}}
**Managed HSM equivalent:** Use `az keyvault key create --hsm-name <mhsm-name>` instead. The key type is `RSA-HSM` in both cases — the difference is that the key lives in your dedicated HSM cluster.
{{< /flash >}}

1. Check the key type

    Confirm the key is HSM-protected.

    ```shell
    az keyvault key show --vault-name "$key_vault_name" --name "$key_name" --query "key.kty"
    ```

    {{< output "" "Expected output:" >}}

```json
"RSA-HSM"
```

{{< /output >}}

    The `keyType` in the response should be `RSA-HSM` rather than `RSA`.

    {{< flash >}}
Note that the pricing for HSM-protected keys is higher than for software keys - note the per version charging - and those with advanced key types (i.e., RSA 3,072-bit, RSA 4,096-bit, and Elliptic-Curve Cryptography (ECC)) is higher still.
{{< /flash >}}

## Create the storage account

The storage account needs a managed identity so you can grant it access to the key.

1. Create the storage account with a managed identity

    ```shell
    az storage account create --name "$storage_account_name" \
      --sku Standard_LRS --kind StorageV2 \
      --assign-identity --identity-type SystemAssigned
    ```

    {{< output "Click to view output" "Example output:" >}}

```json
{
  "accessTier": "Hot",
  "accountMigrationInProgress": null,
  "allowBlobPublicAccess": false,
  "allowCrossTenantReplication": null,
  "allowSharedKeyAccess": false,
  "allowedCopyScope": null,
  "azureFilesIdentityBasedAuthentication": null,
  "blobRestoreStatus": null,
  "creationTime": "2026-03-30T16:17:21.771869+00:00",
  "customDomain": null,
  "defaultToOAuthAuthentication": null,
  "dnsEndpointType": null,
  "dualStackEndpointPreference": null,
  "enableExtendedGroups": null,
  "enableHttpsTrafficOnly": true,
  "enableNfsV3": null,
  "encryption": {
    "encryptionIdentity": null,
    "keySource": "Microsoft.Storage",
    "keyVaultProperties": null,
    "requireInfrastructureEncryption": null,
    "services": {
      "blob": {
        "enabled": true,
        "keyType": "Account",
        "lastEnabledTime": "2026-03-30T16:17:21.873764+00:00"
      },
      "file": {
        "enabled": true,
        "keyType": "Account",
        "lastEnabledTime": "2026-03-30T16:17:21.873764+00:00"
      },
      "queue": null,
      "table": null
    }
  },
  "extendedLocation": null,
  "failoverInProgress": null,
  "geoPriorityReplicationStatus": null,
  "geoReplicationStats": null,
  "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.Storage/storageAccounts/sacmkbd36f48c",
  "identity": {
    "principalId": "643ab719-8bd2-4e60-86b2-20ecec70c1ce",
    "tenantId": "ac40fc60-2717-4051-a567-c0cd948f0ac9",
    "type": "SystemAssigned",
    "userAssignedIdentities": null
  },
  "immutableStorageWithVersioning": null,
  "isHnsEnabled": null,
  "isLocalUserEnabled": null,
  "isSftpEnabled": null,
  "isSkuConversionBlocked": null,
  "keyCreationTime": {
    "key1": "2026-03-30T16:17:21.862555+00:00",
    "key2": "2026-03-30T16:17:21.862555+00:00"
  },
  "keyPolicy": null,
  "kind": "StorageV2",
  "largeFileSharesState": null,
  "lastGeoFailoverTime": null,
  "location": "italynorth",
  "minimumTlsVersion": "TLS1_0",
  "name": "sacmkbd36f48c",
  "networkRuleSet": {
    "bypass": "AzureServices",
    "defaultAction": "Allow",
    "ipRules": [],
    "ipv6Rules": [],
    "resourceAccessRules": null,
    "virtualNetworkRules": []
  },
  "placement": null,
  "primaryEndpoints": {
    "blob": "https://sacmkbd36f48c.blob.core.windows.net/",
    "dfs": "https://sacmkbd36f48c.dfs.core.windows.net/",
    "file": "https://sacmkbd36f48c.file.core.windows.net/",
    "internetEndpoints": null,
    "ipv6Endpoints": null,
    "microsoftEndpoints": null,
    "queue": "https://sacmkbd36f48c.queue.core.windows.net/",
    "table": "https://sacmkbd36f48c.table.core.windows.net/",
    "web": "https://sacmkbd36f48c.z38.web.core.windows.net/"
  },
  "primaryLocation": "italynorth",
  "privateEndpointConnections": [],
  "provisioningState": "Succeeded",
  "publicNetworkAccess": null,
  "resourceGroup": "cmk",
  "routingPreference": null,
  "sasPolicy": null,
  "secondaryEndpoints": null,
  "secondaryLocation": null,
  "sku": {
    "name": "Standard_LRS",
    "tier": "Standard"
  },
  "statusOfPrimary": "available",
  "statusOfSecondary": null,
  "storageAccountSkuConversionStatus": null,
  "tags": {},
  "type": "Microsoft.Storage/storageAccounts",
  "zones": null
}
```

{{< /output >}}

1. Get the object ID

    Grab the object ID for the storage account's system-assigned managed identity

    ```shell
    sami_object_id=$(az storage account show --name "$storage_account_name" \
      --query "identity.principalId" -o tsv)
    ```

## Create the RBAC role assignment

The storage account needs the **Key Vault Crypto Service Encryption User** role on the vault so it can wrap and unwrap keys.

1. Grab the storage account's resource ID

    ```shell
    key_vault_id=$(az keyvault show --name $key_vault_name --query id -o tsv)
    ```

1. Grant the storage account access to the key

    ```shell
    az role assignment create \
      --role "Key Vault Crypto Service Encryption User" \
      --assignee-object-id "$sami_object_id" \
      --assignee-principal-type ServicePrincipal \
      --scope "$key_vault_id"
    ```

    {{< output >}}

```json
{
  "condition": null,
  "conditionVersion": null,
  "createdBy": null,
  "createdOn": "2026-03-30T16:32:37.445661+00:00",
  "delegatedManagedIdentityResourceId": null,
  "description": null,
  "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.KeyVault/vaults/cmk-bd36f48c/providers/Microsoft.Authorization/roleAssignments/c4b6af3f-50b3-4e61-af93-8b6f5b195c6a",
  "name": "c4b6af3f-50b3-4e61-af93-8b6f5b195c6a",
  "principalId": "643ab719-8bd2-4e60-86b2-20ecec70c1ce",
  "principalType": "ServicePrincipal",
  "resourceGroup": "cmk",
  "roleDefinitionId": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/providers/Microsoft.Authorization/roleDefinitions/e147488a-f6f5-4113-8e2d-b22465e65bf6",
  "scope": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.KeyVault/vaults/cmk-bd36f48c",
  "type": "Microsoft.Authorization/roleAssignments",
  "updatedBy": "74afa9e2-d243-414b-bab2-db8dd242827f",
  "updatedOn": "2026-03-30T16:32:38.655796+00:00"
}
```

{{< /output >}}

## Enable Customer Managed Key encryption

1. Retrieve the key URI

     ```shell
     key_uri=$(az keyvault key show --vault-name "$key_vault_name" \
       --name "$key_name" --query "key.kid" -o tsv)
     ```

1. Attach it to the storage account

    ```shell
    az storage account update --name "$storage_account_name" \
      --encryption-key-source Microsoft.Keyvault \
      --encryption-key-vault "https://${key_vault_name}.vault.azure.net" \
      --encryption-key-name "$key_name"
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
