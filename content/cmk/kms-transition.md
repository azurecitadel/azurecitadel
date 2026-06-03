---
title: "Key Management Transition Scenarios"
description: "Transitioning existing Azure services from Platform Managed Keys to Customer Managed Keys, or from Azure Key Vault Premium to Managed HSM. Which services support in-place transitions and what steps are involved."
date: 2026-06-03
author: [ "Richard Cheney" ]
draft: false
weight: 26
menu:
  side:
    parent: cmk
    identifier: cmk-kms-transition
series:
  - cmk
---

## Introduction

The labs in this series create new resources with CMK from the start. In practice, customers often need to migrate existing services — either from Platform Managed Keys to CMK, or from one key store to another.

This page covers two common migration scenarios:

1. **PMK to CMK** — services currently using the default platform-managed encryption need customer-controlled keys.
1. **Key Vault Premium to Managed HSM** — services already using CMK in Azure Key Vault Premium need to move to the stronger isolation of a dedicated Managed HSM.

Common triggers include:

- A **security audit** identifies encryption key control as a gap.
- A new **regulatory or sovereignty requirement** mandates customer-held keys or dedicated HSM.
- An organisation adopts a **cloud security posture** that standardises CMK or Managed HSM across all data services.
- A workload moves from a development environment into **production** where stricter controls apply.

---

## PMK to CMK

Several Azure services support **in-place migration** from Platform Managed Keys to Customer Managed Keys — you update the encryption settings on the existing resource without recreating it or migrating data.

### Service support summary

| Service | In-place migration? | Method |
|---------|:-------------------:|--------|
| Azure Storage | ✅ | Update the storage account encryption settings |
| Managed Disks (VMs) | ✅ | Assign the disk to a Disk Encryption Set |
| Azure SQL Managed Instance | ✅ | Change the TDE protector |
| AKS node pools | ❌ | Create new node pool, migrate workloads, delete old |
| Azure Container Instances | ❌ | Delete and recreate the container group |

### Azure Storage

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

### Managed Disks

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

### Azure SQL Managed Instance

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

### AKS node pools

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

### Azure Container Instances

ACI encryption configuration is **immutable** after the container group is created. You cannot change the key or switch from PMK to CMK on an existing container group.

To migrate: delete and recreate the container group with the CMK settings in the deployment definition.

Since ACI container groups are typically stateless (persistent data lives in mounted volumes or external stores), recreation is usually straightforward from an infrastructure-as-code perspective.

#### References

- [Encrypt deployment data with a customer-managed key](https://learn.microsoft.com/azure/container-instances/container-instances-encrypt-data)

---

## Key Vault Premium to Managed HSM

Once services are using CMK in Azure Key Vault Premium, a customer may later want to move to **Managed HSM** for stronger key isolation — a single-tenant, FIPS 140-2 Level 3 validated HSM cluster dedicated to their organisation.

This is conceptually similar to key rotation (you point the service at a new key URI), but there are important differences:

- The **key URI domain** changes from `*.vault.azure.net` to `*.managedhsm.azure.net`.
- The **RBAC model** changes from standard Azure RBAC to the Managed HSM **local RBAC** model. You assign roles like `Managed HSM Crypto Service Encryption User` using `az keyvault role assignment create --hsm-name` rather than `az role assignment create`.
- The managed identity needs permissions granted on the **Managed HSM** (the old Key Vault permissions are no longer relevant).

### Service support summary

| Service | In-place? | Notes |
|---------|:---------:|-------|
| Azure Storage | ✅ | Update the key vault URI and key name — same `az storage account update` command |
| Managed Disks (DES) | ❌ | Must create a **new** DES pointing at the Managed HSM key, then reassign disks |
| Azure SQL Managed Instance | ✅ | Change the TDE protector URI to the Managed HSM key |
| AKS node pools | ❌ | Inherits the DES limitation — new DES, new node pool |
| Azure Container Instances | ❌ | Does not support Managed HSM at all |

### Azure Storage

The `az storage account update` command works identically — just change the vault URI to the Managed HSM endpoint:

```bash
az storage account update --name "$storage_account_name" \
  --encryption-key-source Microsoft.Keyvault \
  --encryption-key-vault "https://${mhsm_name}.managedhsm.azure.net" \
  --encryption-key-name "$key_name"
```

Before running this, grant the storage account's managed identity the **Managed HSM Crypto Service Encryption User** role on the HSM:

```bash
az keyvault role assignment create --hsm-name "$mhsm_name" \
  --role "Managed HSM Crypto Service Encryption User" \
  --assignee-object-id "$sa_object_id" \
  --scope /keys
```

No downtime. No data migration.

#### References

- [Customer-managed keys using Azure Key Vault Managed HSM](https://learn.microsoft.com/azure/storage/common/customer-managed-keys-configure-key-vault-hsm)

### Managed Disks

You **cannot** update an existing Disk Encryption Set to point at a different key source. The DES is coupled to its vault/HSM at creation time.

The migration path is:

1. Create a **new key** in Managed HSM.
1. Create a **new DES** pointing at the Managed HSM key.
1. Grant the new DES identity the **Managed HSM Crypto Service Encryption User** role on the HSM.
1. Deallocate the VM.
1. Update each disk to reference the new DES:

    ```bash
    az disk update --name "$disk_name" \
      --resource-group "$resource_group" \
      --disk-encryption-set "$new_des_id"
    ```

1. Start the VM.
1. Delete the old DES when all disks have been migrated.

{{< flash >}}
This is a more involved process than a simple key rotation. Plan a maintenance window and test the migration on non-production disks first.
{{< /flash >}}

### Azure SQL Managed Instance

The TDE protector can be pointed at a Managed HSM key using the same `az sql mi tde-key set` command:

```bash
az sql mi tde-key set --name "$mi_name" \
  --resource-group "$resource_group" \
  --kid "https://${mhsm_name}.managedhsm.azure.net/keys/${key_name}" \
  --server-key-type AzureKeyVault
```

Grant the instance's user-assigned managed identity the **Managed HSM Crypto Service Encryption User** role on the HSM beforehand.

This is operationally identical to a key rotation — the TDE protector simply changes to a different key URI.

### AKS node pools

AKS inherits the Managed Disks limitation. Since the DES must be recreated, you also need a new node pool referencing the new DES. Follow the same cordon-drain-delete pattern described in the PMK to CMK section above.

### Azure Container Instances

ACI does not support Managed HSM at all. This service only supports CMK from standard Key Vault.

---

## Summary

For most core data services — storage accounts, managed disks, and SQL MI — you can migrate from PMK to CMK in place without recreating resources or moving data. The key prerequisites are always the same: a key in your vault or HSM, a managed identity on the resource, and the correct RBAC role assignment.

When moving from Key Vault Premium to Managed HSM, Storage and SQL MI can be updated in place (just a different key URI and RBAC model), but Disk Encryption Sets are coupled to their key source at creation time — requiring a new DES and disk reassignment.

For AKS and ACI, plan for resource recreation in both scenarios. Infrastructure-as-code templates make the process repeatable.

{{< flash >}}
**Key rotation vs migration:** Key rotation changes the key *version* within the same vault or HSM — services using a versionless key URI pick up the new version automatically. Migration changes the key *source* (a different vault, HSM, or key) and requires updating the service configuration. The migrations described on this page are one-off transitions, not recurring operations. Once you are on your target key store with auto-rotation configured, ongoing key management is handled by the vault or HSM's built-in rotation policies.
{{< /flash >}}
