---
title: "Migrating from PMK to CMK"
description: "When existing Azure services need to move from Platform Managed Keys to Customer Managed Keys. Which services support in-place migration and which require recreation."
date: 2026-06-03
author: [ "Richard Cheney" ]
draft: false
weight: 26
menu:
  side:
    parent: cmk
    identifier: cmk-pmk-to-cmk
series:
  - cmk
---

## Introduction

The labs in this series create new resources with CMK from the start. In practice, many customers already have services running with Platform Managed Keys (the default server-side encryption) and later need to switch to Customer Managed Keys.

Common triggers include:

- A **security audit** identifies encryption key control as a gap.
- A new **regulatory or sovereignty requirement** mandates customer-held keys.
- An organisation adopts a **cloud security posture** that standardises CMK across all data services.
- A workload moves from a development environment into **production** where stricter controls apply.

The good news is that several Azure services support **in-place migration** — you update the encryption settings on the existing resource without recreating it or migrating data.

## Service support summary

| Service | In-place migration? | Method |
|---------|:-------------------:|--------|
| Azure Storage | ✅ | Update the storage account encryption settings |
| Managed Disks (VMs) | ✅ | Assign the disk to a Disk Encryption Set |
| Azure SQL Managed Instance | ✅ | Change the TDE protector |
| AKS node pools | ❌ | Create new node pool, migrate workloads, delete old |
| Azure Container Instances | ❌ | Delete and recreate the container group |

The sections below cover the approach for each service.

## Azure Storage

Storage accounts can be updated from PMK to CMK at any time. The operation is seamless — no downtime and no data migration.

The [CMK for Storage lab](../lab-storage) in this series already demonstrates this pattern. The lab creates a storage account with PMK (the default `Microsoft.Storage` key source) and then runs:

```bash
az storage account update --name "$storage_account_name" \
  --encryption-key-source Microsoft.Keyvault \
  --encryption-key-vault "https://${key_vault_name}.vault.azure.net" \
  --encryption-key-name "$key_name"
```

The prerequisites are the same whether the account is new or existing:

1. The storage account needs a managed identity.
1. That identity needs the **Key Vault Crypto Service Encryption User** role on the vault (or equivalent Managed HSM role).
1. The key must exist in the vault before running the update.

#### References

- [Customer-managed keys for Azure Storage encryption](https://learn.microsoft.com/azure/storage/common/customer-managed-keys-overview)
- [Configure customer-managed keys for an existing storage account](https://learn.microsoft.com/azure/storage/common/customer-managed-keys-configure-existing-account)

## Managed Disks

Existing managed disks can be switched from PMK to CMK by assigning them to a Disk Encryption Set. The VM must be **deallocated** first.

```bash
az vm deallocate --name "$vm_name" --resource-group "$resource_group"
```

Then update the disk:

```bash
az disk update --name "$disk_name" \
  --resource-group "$resource_group" \
  --encryption-type EncryptionAtRestWithCustomerKey \
  --disk-encryption-set "$des_id"
```

Start the VM again:

```bash
az vm start --name "$vm_name" --resource-group "$resource_group"
```

{{< flash >}}
**Restriction:** Managed disks that are currently or were previously encrypted using Azure Disk Encryption (ADE — the guest-OS BitLocker/dm-crypt method) cannot be switched to CMK server-side encryption. These are different encryption layers.
{{< /flash >}}

If you have multiple disks (OS + data) on a VM, repeat the `az disk update` for each disk while the VM is deallocated.

#### References

- [Server-side encryption of Azure Disk Storage](https://learn.microsoft.com/azure/virtual-machines/disk-encryption)
- [Enable customer-managed keys with SSE — managed disks (portal)](https://learn.microsoft.com/azure/virtual-machines/disks-enable-customer-managed-keys-portal)
- [az disk update CLI reference](https://learn.microsoft.com/cli/azure/disk#az-disk-update)

## Azure SQL Managed Instance

SQL MI uses Transparent Data Encryption (TDE). By default the TDE protector is service-managed. You can change it to a customer-managed key at any time without data migration.

1. Ensure the instance has a **user-assigned managed identity** with Key Vault access:

    ```bash
    az sql mi update --name "$mi_name" \
      --resource-group "$resource_group" \
      --assign-identity
    ```

1. Grant the identity the **Key Vault Crypto Service Encryption User** role on the vault (or use access policies with get, wrapKey, unwrapKey).

1. Set the TDE protector to the CMK:

    ```bash
    az sql mi tde-key set --name "$mi_name" \
      --resource-group "$resource_group" \
      --kid "$key_uri" \
      --server-key-type AzureKeyVault
    ```

1. Verify the change:

    ```bash
    az sql mi tde-key show --name "$mi_name" \
      --resource-group "$resource_group" \
      --query "serverKeyType"
    ```

    The output should be `"AzureKeyVault"`.

#### References

- [TDE with customer-managed keys — Azure SQL Managed Instance](https://learn.microsoft.com/azure/azure-sql/managed-instance/transparent-data-encryption-byok-configure)

## AKS node pools

AKS does **not** support changing the Disk Encryption Set on an existing node pool. The encryption setting is immutable after node pool creation.

To migrate an existing AKS cluster to CMK:

1. Create the Disk Encryption Set and key (as per the [CMK for VM Disks and AKS lab](../lab-disks)).
1. Add a **new node pool** with the DES:

    ```bash
    az aks nodepool add --cluster-name "$aks_name" \
      --resource-group "$resource_group" \
      --name cmkpool \
      --node-osdisk-diskencryptionset-id "$des_id"
    ```

1. Cordon and drain the old node pool to migrate workloads.
1. Delete the old node pool.

This means planning a maintenance window and validating that workloads reschedule correctly.

#### References

- [Bring your own keys for AKS node OS disk encryption](https://learn.microsoft.com/azure/aks/azure-disk-customer-managed-keys)

## Azure Container Instances

ACI encryption configuration is **immutable** after the container group is created. You cannot change the key or switch from PMK to CMK on an existing container group.

To migrate: delete and recreate the container group with the CMK settings in the deployment definition.

Since ACI container groups are typically stateless (persistent data lives in mounted volumes or external stores), recreation is usually straightforward from an infrastructure-as-code perspective.

#### References

- [Encrypt deployment data with a customer-managed key](https://learn.microsoft.com/azure/container-instances/container-instances-encrypt-data)

## Summary

For most core data services — storage accounts, managed disks, and SQL MI — you can migrate from PMK to CMK in place without recreating resources or moving data. The key prerequisites are always the same: a key in your vault, a managed identity on the resource, and the correct RBAC role assignment.

For AKS and ACI, plan for resource recreation as part of the migration. In both cases, infrastructure-as-code templates make the process repeatable.
