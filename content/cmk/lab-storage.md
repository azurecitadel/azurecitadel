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

    This command assumes that you only have one active key vault in the resource group.

    ```shell
    resource_group_id=$(az group show --name $AZURE_DEFAULTS_GROUP --query id -otsv)
    key_vault_name=$(az keyvault list --query "[0].name" -otsv)
    uniq=$(md5sum <<< $resource_group_id | cut -c1-8)
    storage_account_name=cmklab${uniq}
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
    "created": "2026-03-31T12:54:56+00:00",
    "enabled": true,
    "expires": null,
    "exportable": false,
    "hsmPlatform": "2",
    "notBefore": null,
    "recoverableDays": 7,
    "recoveryLevel": "CustomizedRecoverable",
    "updated": "2026-03-31T12:54:56+00:00"
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
    "kid": "https://cmk-lab-bd36f48c.vault.azure.net/keys/cmk-lab-storage/dd008bc0a78543ed9238cff4e1372e36",
    "kty": "RSA-HSM",
    "n": "sTvgIN21z8P3efNPdUTLV46FUg/hb5TXOtplI5jK5luDoWGGGeZpr9oOAxxfPfgRceYG3EJdixyX9SwPk6Kbwmqokr4GqiOXtDeNE8u5NGfQNL6zctMpPakDrqcz2Ef2b9SzEgLmSO+wJTf1b6Ea6KCWvesMP4tMtpqpA+FqCsgFx5oxUWfOJadbKFJWbtqRSNjGAphJzMucZqPkxG74JZt9VTK42d/ARDgg8igYGTJG0a9NeU4KfHS/NPwVAjfs0W7U2JpFSmIjioU3YlNfI7Fj9dQJ+YUdITSP9cnF1RlSVse1LSqtet/IkwLA13XyzwA73XS/DKeZgEQijmFWtw==",
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

{{< raw >}}
<pre style="color:goldenrod">
"RSA-HSM"
</pre>
{{< /raw >}}

{{< /output >}}

    The `keyType` in the response should be `RSA-HSM` rather than `RSA`.

1. Display the versionless key URI

     ```shell
     key_uri=$(az keyvault key show --vault-name "$key_vault_name" --name "$key_name" --query "key.kid" -o tsv)
     key_uri=${key_uri%/*}
     echo "$key_uri"
     ```

     {{< output >}}
{{< raw >}}
<pre>
https://cmk-lab-bd36f48c.vault.azure.net/keys/cmk-lab-storage
</pre>
{{< /raw >}}
{{< /output >}}

    Alternatively, you can construct the key URI by concatenation, i.e. `<vault_uri>/keys/<key_name>`.

{{< flash >}}
Note that the pricing for HSM-protected keys is higher than for software keys. Those with advanced key types (i.e., RSA 3,072-bit, RSA 4,096-bit, and Elliptic-Curve Cryptography (ECC)) is higher still. Note that the charge is per version, but do not remove old versions prematurely.
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
  "creationTime": "2026-03-31T13:01:08.165285+00:00",
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
        "lastEnabledTime": "2026-03-31T13:01:08.257662+00:00"
      },
      "file": {
        "enabled": true,
        "keyType": "Account",
        "lastEnabledTime": "2026-03-31T13:01:08.257662+00:00"
      },
      "queue": null,
      "table": null
    }
  },
  "extendedLocation": null,
  "failoverInProgress": null,
  "geoPriorityReplicationStatus": null,
  "geoReplicationStats": null,
  "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.Storage/storageAccounts/cmklabbd36f48c",
  "identity": {
    "principalId": "721eb7fc-4f6d-4818-b2d7-961782e1ad6d",
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
    "key1": "2026-03-31T13:01:08.247430+00:00",
    "key2": "2026-03-31T13:01:08.247430+00:00"
  },
  "keyPolicy": null,
  "kind": "StorageV2",
  "largeFileSharesState": null,
  "lastGeoFailoverTime": null,
  "location": "italynorth",
  "minimumTlsVersion": "TLS1_0",
  "name": "cmklabbd36f48c",
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
    "blob": "https://cmklabbd36f48c.blob.core.windows.net/",
    "dfs": "https://cmklabbd36f48c.dfs.core.windows.net/",
    "file": "https://cmklabbd36f48c.file.core.windows.net/",
    "internetEndpoints": null,
    "ipv6Endpoints": null,
    "microsoftEndpoints": null,
    "queue": "https://cmklabbd36f48c.queue.core.windows.net/",
    "table": "https://cmklabbd36f48c.table.core.windows.net/",
    "web": "https://cmklabbd36f48c.z38.web.core.windows.net/"
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

## Create the RBAC role assignment

The storage account needs the **Key Vault Crypto Service Encryption User** role on the vault so it can wrap and unwrap keys.

1. Get the object ID

    Grab the object ID for the storage account's system-assigned managed identity

    ```shell
    sa_object_id=$(az storage account show --name "$storage_account_name" \
      --query "identity.principalId" -o tsv)
    ```

1. Get the storage account's resource ID

    ```shell
    key_vault_id=$(az keyvault show --name $key_vault_name --query id -o tsv)
    ```

1. Grant the storage account access to the key

    ```shell
    az role assignment create \
      --role "Key Vault Crypto Service Encryption User" \
      --assignee-object-id "$sa_object_id" \
      --assignee-principal-type ServicePrincipal \
      --scope "$key_vault_id"
    ```

    {{< output >}}

```json
{
  "condition": null,
  "conditionVersion": null,
  "createdBy": null,
  "createdOn": "2026-03-31T13:02:59.940613+00:00",
  "delegatedManagedIdentityResourceId": null,
  "description": null,
  "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.KeyVault/vaults/cmk-lab-bd36f48c/providers/Microsoft.Authorization/roleAssignments/e81012ba-bb70-4ea2-8d44-f9cb1b80528a",
  "name": "e81012ba-bb70-4ea2-8d44-f9cb1b80528a",
  "principalId": "721eb7fc-4f6d-4818-b2d7-961782e1ad6d",
  "principalType": "ServicePrincipal",
  "resourceGroup": "cmk",
  "roleDefinitionId": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/providers/Microsoft.Authorization/roleDefinitions/e147488a-f6f5-4113-8e2d-b22465e65bf6",
  "scope": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.KeyVault/vaults/cmk-lab-bd36f48c",
  "type": "Microsoft.Authorization/roleAssignments",
  "updatedBy": "74afa9e2-d243-414b-bab2-db8dd242827f",
  "updatedOn": "2026-03-31T13:03:00.995989+00:00"
}
```

{{< /output >}}

    {{< flash >}}
Note that you can create the RBAC role assignments on the whole key vault (more common) or on individual keys. We'll do the latter in the next lab for comparison.
{{< /flash >}}

## Enable Customer Managed Key encryption

1. Encrypt the storage account using the customer managed key

    ```shell
    az storage account update --name "$storage_account_name" \
      --encryption-key-source Microsoft.Keyvault \
      --encryption-key-vault "https://${key_vault_name}.vault.azure.net" \
      --encryption-key-name "$key_name"
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
  "creationTime": "2026-03-31T13:01:08.165285+00:00",
  "customDomain": null,
  "defaultToOAuthAuthentication": null,
  "dnsEndpointType": null,
  "dualStackEndpointPreference": null,
  "enableExtendedGroups": null,
  "enableHttpsTrafficOnly": true,
  "enableNfsV3": null,
  "encryption": {
    "encryptionIdentity": null,
    "keySource": "Microsoft.Keyvault",
    "keyVaultProperties": {
      "currentVersionedKeyExpirationTimestamp": "1970-01-01T00:00:00+00:00",
      "currentVersionedKeyIdentifier": "https://cmk-lab-bd36f48c.vault.azure.net/keys/cmk-lab-storage/dd008bc0a78543ed9238cff4e1372e36",
      "keyName": "cmk-lab-storage",
      "keyVaultUri": "https://cmk-lab-bd36f48c.vault.azure.net",
      "keyVersion": null,
      "lastKeyRotationTimestamp": "2026-03-31T13:11:52.782584+00:00"
    },
    "requireInfrastructureEncryption": null,
    "services": {
      "blob": {
        "enabled": true,
        "keyType": "Account",
        "lastEnabledTime": "2026-03-31T13:01:08.257662+00:00"
      },
      "file": {
        "enabled": true,
        "keyType": "Account",
        "lastEnabledTime": "2026-03-31T13:01:08.257662+00:00"
      },
      "queue": null,
      "table": null
    }
  },
  "extendedLocation": null,
  "failoverInProgress": null,
  "geoPriorityReplicationStatus": null,
  "geoReplicationStats": null,
  "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.Storage/storageAccounts/cmklabbd36f48c",
  "identity": {
    "principalId": "721eb7fc-4f6d-4818-b2d7-961782e1ad6d",
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
    "key1": "2026-03-31T13:01:08.247430+00:00",
    "key2": "2026-03-31T13:01:08.247430+00:00"
  },
  "keyPolicy": null,
  "kind": "StorageV2",
  "largeFileSharesState": null,
  "lastGeoFailoverTime": null,
  "location": "italynorth",
  "minimumTlsVersion": "TLS1_0",
  "name": "cmklabbd36f48c",
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
    "blob": "https://cmklabbd36f48c.blob.core.windows.net/",
    "dfs": "https://cmklabbd36f48c.dfs.core.windows.net/",
    "file": "https://cmklabbd36f48c.file.core.windows.net/",
    "internetEndpoints": null,
    "ipv6Endpoints": null,
    "microsoftEndpoints": null,
    "queue": "https://cmklabbd36f48c.queue.core.windows.net/",
    "table": "https://cmklabbd36f48c.table.core.windows.net/",
    "web": "https://cmklabbd36f48c.z38.web.core.windows.net/"
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

## Verify

1. Verify that the encryption is using the customer managed key

    ```shell
    az storage account show --name $storage_account_name --query "encryption.{source:keySource, vault:keyVaultProperties.keyVaultUri, key:keyVaultProperties.keyName}"
    ```

    {{< output >}}

```json
{
  "key": "cmk-lab-storage",
  "source": "Microsoft.Keyvault",
  "vault": "https://cmk-lab-bd36f48c.vault.azure.net"
}
```

{{< /output >}}

    You should see `keySource` as `Microsoft.Keyvault` and the vault and key name pointing at your Key Vault.

1. Check in the portal

    View the Encryption blade within the storage account.

    ![Encryption blade showing the storage account configured with a customer-managed key from Key Vault](/cmk/images/cmk-storage.png)

Standard operations such as blob upload are unchanged. The CMK encryption is transparent to the data plane.

## Summary

As a reminder, here are the objectives achieved in this lab.

- Created an RSA-HSM key in the Azure Key Vault Premium.
- Created a storage account encrypted with that customer-managed key.
- Verified that the encryption is in place and points at your key.
