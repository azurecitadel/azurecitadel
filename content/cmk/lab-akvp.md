---
title: "🧪 Azure Key Vault Premium"
description: "Lab to create an Azure Key Vault Premium and generate keys for use in the later labs. Also links through to the Bring Your Own Key (BYOK) pages if you wish to import a key rather than generate."
date: 2026-03-06
author: [ "Richard Cheney" ]
draft: false
weight: 12
menu:
  side:
    parent: cmk
    identifier: cmk-lab-akvp
series:
  - cmk
---

## Access

The labs assume you are either **Owner** or have **Contributor** plus **Role Based Access Control Administrator** on an Azure subscription as they create resources and RBAC role assignments.

They are also designed for the Azure CLI in a Bash context.

## Why we use Key Vault Premium for these labs

{{% shared-content "cmk/skucost" %}}

## Select a suitable region

The Secure Key Release (SKR) lab later on requires a Confidential VM from the [DCasv5](https://learn.microsoft.com/azure/virtual-machines/dcasv5-dcadsv5-series) or [DCasv6](https://learn.microsoft.com/azure/virtual-machines/sizes/general-purpose/dcasv6-series) (AMD SEV-SNP), so we will work in a region where they are available.

Not all regions support these sizes — check the [Azure products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=virtual-machines) page to find a region that works for you, and verify your subscription quota before starting.

1. List all regions where DC2as virtual machines are available without any restrictions.

    ```shell
    az vm list-skus --size Standard_DC2as_v --location '' --query "sort_by([?restrictions==\`[]\`],&locations[0])[].{name:name,location:locations[0]}" -o table
    ```

    This command will take a little time to run as it is checking all regions. You can also specify the previous generation

    {{< output >}}

```text
Name               Location
-----------------  -------------
Standard_DC2as_v5  ItalyNorth
Standard_DC2as_v6  ItalyNorth
Standard_DC2as_v6  WestUS3
Standard_DC2as_v6  australiaeast
Standard_DC2as_v5  eastus
Standard_DC2as_v5  northeurope
Standard_DC2as_v5  southeastasia
Standard_DC2as_v6  uksouth
Standard_DC2as_v6  westcentralus
Standard_DC2as_v5  westus
Standard_DC2as_v6  westus
```

{{< /output >}}

1. Check current quota and usage in a specific region (e.g., `italynorth`):

    ```shell
    az vm list-usage --location italynorth --query "[?contains(localName, 'DCas') || contains(localName, 'DCAS')]" -o table
    ```

    {{< output >}}

```text
CurrentValue    Limit    LocalName
--------------  -------  ----------------------------
0               100      Standard DCASv5 Family vCPUs
0               0        Standard DCasv6 Family vCPUs
```

{{< /output >}}

Use these commands to select your region and VM SKU.

In the commands here you will see **Italy North** and **Standard_DC2as_v5**.

## Resource Group

Set your default region and create a resource group for the labs. The `AZURE_DEFAULTS_LOCATION` and `AZURE_DEFAULTS_GROUP` environment variables are recognised by the Azure CLI and remove the need to pass `--location` and `--resource-group` on every command.

1. Login and select your subscription.
1. Set the default region.

    ```shell
    export AZURE_DEFAULTS_LOCATION=italynorth
    ```

1. Create the resource group and set it as the default.

    ```shell
    az group create --name cmk
    export AZURE_DEFAULTS_GROUP=cmk
    ```

    {{< output >}}

```json
{
  "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk",
  "location": "italynorth",
  "managedBy": null,
  "name": "cmk",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": "Microsoft.Resources/resourceGroups"
}
```

{{< /output >}}

## Creating an Azure Key Vault Premium

Standard tier does not support HSM-backed keys or Secure Key Release, so Premium is required. Key Vault names must be globally unique.

1. Create a unique name and create the vault.

    ```shell
    resource_group_id=$(az group show --name $AZURE_DEFAULTS_GROUP --query id -o tsv)
    uniq=$(md5sum <<< $resource_group_id | cut -c1-8)
    key_vault_name=cmk-${uniq}
    echo "$key_vault_name"
    ```

    {{< output >}}

```text
cmk-bd36f48c
```

{{< /output >}}


1. Create the vault.

    ```shell
    az keyvault create --name $key_vault_name \
      --sku premium \
      --enable-rbac-authorization true \
      --retention-days 7
    ```

    {{< output >}}

```json
{
  "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.KeyVault/vaults/cmk-bd36f48c",
  "location": "italynorth",
  "name": "cmk-bd36f48c",
  "properties": {
    "accessPolicies": [],
    "createMode": null,
    "enablePurgeProtection": null,
    "enableRbacAuthorization": true,
    "enableSoftDelete": true,
    "enabledForDeployment": false,
    "enabledForDiskEncryption": false,
    "enabledForTemplateDeployment": false,
    "hsmPoolResourceId": null,
    "networkAcls": null,
    "privateEndpointConnections": null,
    "provisioningState": "Succeeded",
    "publicNetworkAccess": "Enabled",
    "sku": {
      "family": "A",
      "name": "premium"
    },
    "softDeleteRetentionInDays": 7,
    "tenantId": "ac40fc60-2717-4051-a567-c0cd948f0ac9",
    "vaultUri": "https://cmk-bd36f48c.vault.azure.net/"
  },
  "resourceGroup": "cmk",
  "systemData": {
    "createdAt": "2026-03-30T11:23:44.745000+00:00",
    "createdBy": "admin@MngEnvMCAP520989.onmicrosoft.com",
    "createdByType": "User",
    "lastModifiedAt": "2026-03-30T11:23:44.745000+00:00",
    "lastModifiedBy": "admin@MngEnvMCAP520989.onmicrosoft.com",
    "lastModifiedByType": "User"
  },
  "tags": {},
  "type": "Microsoft.KeyVault/vaults"
}
```

{{< /output >}}

    {{< flash >}}
The `--enable-rbac-authorization true` switch sets the vault in RBAC mode. The labs use role assignments (rather than access policies) for the Azure services' managed identities for the customer managed key wrap/unwrap actions.
{{< /flash >}}

## Add an RBAC role assignment

By default you will have no ability to create keys within the key vault. (Note that the access control models for **vaults** is different to **managed HSMs**.)

1. Add **Key Vault Crypto Officer** role assignment

    ```shell
    key_vault_id=$(az keyvault show --name $key_vault_name --query id -otsv)
    object_id="$(az ad signed-in-user show --query id -otsv)"
    az role assignment create --assignee "$object_id" --scope "$key_vault_id" --role "Key Vault Crypto Officer"
    ```

    {{< output >}}

```json
{
  "condition": null,
  "conditionVersion": null,
  "createdBy": null,
  "createdOn": "2026-03-30T15:52:19.492645+00:00",
  "delegatedManagedIdentityResourceId": null,
  "description": null,
  "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.KeyVault/vaults/cmk-bd36f48c/providers/Microsoft.Authorization/roleAssignments/3a027df8-80f0-4d87-b19e-999461e1aa94",
  "name": "3a027df8-80f0-4d87-b19e-999461e1aa94",
  "principalId": "74afa9e2-d243-414b-bab2-db8dd242827f",
  "principalType": "User",
  "resourceGroup": "cmk",
  "roleDefinitionId": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/providers/Microsoft.Authorization/roleDefinitions/14b46e9e-c2b7-41b4-b07b-48a6ebf60603",
  "scope": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.KeyVault/vaults/cmk-bd36f48c",
  "type": "Microsoft.Authorization/roleAssignments",
  "updatedBy": "74afa9e2-d243-414b-bab2-db8dd242827f",
  "updatedOn": "2026-03-30T15:52:20.637681+00:00"
}
```

{{< /output >}}

OK, you're set! You can move onto the next page if you like, or continue reading the useful information below.

#### References

- <https://learn.microsoft.com/azure/key-vault/general/rbac-guide>
- <https://learn.microsoft.com/azure/role-based-access-control/built-in-roles/security#key-vault-crypto-officer>

    {{< output "" "The dataActions for Key Vault Crypto Office:" >}}

```json
"dataActions": [
  "Microsoft.KeyVault/vaults/keys/*",
  "Microsoft.KeyVault/vaults/keyrotationpolicies/*"
]
```

{{< /output >}}

## Info on deleting and purging

The Azure Key Vault Premium you created is purgeable. (This is the current default on Azure Key Vaults.)

**Don't delete the key vault yet** as you will need it for all of the labs in this series that you intend to complete.

Once you are done then you can delete it using the portal or CLI commands. Soft delete is now permanently enforced by Azure and cannot be disabled. The minimum retention period is 7 days, as used here to keep the lab easy to clean up. Deleted vaults are retained for the defined period and whilst in that state they may be recovered.

They may also be purged unless purge protection is in place. Purge protection is recommended as a protection against bad actors should there be a breach in security.

Once the retention period has ended then the key vault will be permanently deleted.

{{< flash "tip" >}}
For production vaults, consider using `--retention-days 90` and `--enable-purge-protection true` for maximum protection.
{{< /flash >}}

## Managed HSM differences

The [Azure Key Vault Managed HSM](https://learn.microsoft.com/azure/key-vault/managed-hsm/) has its own documentation area including a [CLI quickstart](https://learn.microsoft.com/azure/key-vault/managed-hsm/quick-create-cli).

Key differences

- uses `--hsm-name` rather than `--name`
- no need to specify the SKU; this is implicit in the switch above
- mandatory requirement for `--administrators` with your object ID (or indeed a comma delimited list of object IDs)
- the URI changes to `https://<hsm-name>.managedhsm.azure.net`
- no `--enable-rbac-authorization` as local RBAC is used to defined all data plane access

{{< flash "danger" >}}
Avoid `--enable-purge-protection` in lab environments — once enabled it cannot be turned off, and the HSM is billed for the full retention period even if idle. Managed HSM's have a relatively high per hour cost and will charge several thousand dollars over a three month period.
{{< /flash >}}

After provisioning completes, the HSM must be [**activated**](https://learn.microsoft.com/azure/key-vault/managed-hsm/quick-create-cli#activate-your-managed-hsm) by downloading the security domain before it can be used. You specify the RSA public keys (min 3, max 10) for encrypting the security domain and then it downloads. You also specify the minimum number of private keys required to achieve quorum for decryption.

{{< flash "danger" >}}
The Managed HSM is under your control and you have increased responsibilities. It is imperative that you safely store the security domain file and the RSA key pairs.

These are used for diaster recovery, or for creating additional Managed HSM instances in the same security domain if they are sharing keys.
{{< /flash >}}

#### References

- <https://learn.microsoft.com/azure/key-vault/managed-hsm/>
- <https://learn.microsoft.com/azure/key-vault/managed-hsm/quick-create-cli>
- <https://learn.microsoft.com/azure/key-vault/managed-hsm/security-domain>
- <https://learn.microsoft.com/azure/key-vault/managed-hsm/access-control>
