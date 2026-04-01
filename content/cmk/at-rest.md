---
title: "Encrypting data at rest with CMK"
description: "Customer-Managed Keys can be used to protect data at rest across a wide range of Azure services. Here we cover five common services, the CMK integration pattern for each, and differences between Azure Key Vault Premium and Azure Key Vault Managed HSM."
date: 2026-03-06
author: [ "Richard Cheney" ]
draft: false
weight: 20
menu:
  side:
    parent: cmk
    identifier: cmk-at-rest
aliases:
  - /cmk/services
series:
  - cmk
---

## Introduction

This page covers **encryption at rest** — protecting stored data so that it cannot be read without access to your key. Each Azure service that supports customer-managed keys wraps its own internal data encryption keys using your CMK in Key Vault. If your key is unavailable, the service cannot decrypt the data.

Encryption in use — protecting data while it is being processed, using Azure Confidential Compute — is a separate topic covered later in this series.

{{< flash >}}
The pattern is the same across services:

1. Create a key in Azure Key Vault Premium.
1. Enable a managed identity on the Azure resource.
1. Grant that identity access to **Get**, **Wrap Key**, and **Unwrap Key** on the key.
1. Point the resource's encryption settings at the key URI.
{{< /flash >}}

The main difference when using Managed HSM is in step 3. Key Vault uses standard Azure RBAC with built-in roles assigned on the vault scope. Managed HSM uses its own **local RBAC** model with HSM-specific roles (such as `Managed HSM Crypto Service Encryption User`) assigned on the HSM or individual key scope, using `az keyvault role assignment create --hsm-name` rather than `az role assignment create`. Everything else — the key URI format aside — is the same.

## Azure Storage

Azure Storage uses your CMK to protect the storage account's internal data encryption keys. All blobs, files, queues and tables in the account are encrypted at rest.

You can configure the CMK at account creation or apply it to an existing account. The storage account needs a system-assigned or user-assigned managed identity, which is then given the **Key Vault Crypto Service Encryption User** RBAC role (or equivalent access policy permissions) on the vault.

Managed HSM is supported. The role to assign is **Managed HSM Crypto Service Encryption User**, and it is assigned on the HSM or key scope using the HSM local RBAC model.

#### References

- [Customer-managed keys for Azure Storage encryption](https://learn.microsoft.com/azure/storage/common/customer-managed-keys-overview)
- [Customer-managed keys using Azure Key Vault Managed HSM](https://learn.microsoft.com/azure/storage/common/customer-managed-keys-configure-key-vault-hsm)

## Managed Disks and Disk Encryption Sets

For Azure managed disks, CMK encryption is configured through **Disk Encryption Sets** (DES). A DES is a dedicated Azure resource that wraps the relationship between your key and the managed disks that use it.

The DES has its own managed identity, which needs permission to use the key:

- **Key Vault Premium:** assign **Key Vault Crypto Service Encryption User**.
- **Managed HSM:** assign **Managed HSM Crypto Service Encryption User** using local RBAC on the HSM or key scope.

This model applies to both **Virtual Machines** and **AKS node OS disks**.

## Virtual Machines and Managed Disks

VM managed disks (OS and data) use the DES model described above. You can attach a DES when creating a VM or update disk encryption settings on existing managed disks to use that DES.

#### References

- [Server-side encryption of Azure Disk Storage](https://learn.microsoft.com/azure/virtual-machines/disk-encryption)
- [Use the Azure portal to enable server-side encryption with customer-managed keys for managed disks](https://learn.microsoft.com/azure/virtual-machines/disks-enable-customer-managed-keys-portal)

## Azure Kubernetes Service

AKS node OS disk encryption also uses the DES model described above. Create the DES separately, then reference it when creating or updating a node pool.

Host-based encryption extends this further — encrypting the temp disk and OS cache of the node VM itself, not just the managed disks.

AKS inherits Managed HSM support through the same DES configuration.

#### References

- [Bring your own keys for AKS node OS disk encryption](https://learn.microsoft.com/azure/aks/azure-disk-customer-managed-keys)
- [Host-based encryption on AKS nodes](https://learn.microsoft.com/azure/aks/enable-host-encryption)

## Azure Container Instances

ACI supports CMK encryption for the container group's OS disk, but the key must come from a standard Key Vault — Managed HSM is not yet supported for ACI.

The configuration is done at deployment time by specifying the key URI and a user-assigned managed identity in the container group resource definition. This is the one service in our scope where Managed HSM is not yet an option.

#### References

- [Encrypt deployment data with a customer-managed key](https://learn.microsoft.com/azure/container-instances/container-instances-encrypt-data)

## Azure SQL Managed Instance

SQL MI uses Transparent Data Encryption (TDE) with a CMK to protect database files and backups at rest. The CMK acts as the TDE protector: SQL MI wraps its database encryption keys using your key in Key Vault.

SQL MI needs a user-assigned managed identity with **Key Vault Crypto Service Encryption User** access on the key. You can set the TDE protector at instance creation or update it later.

Managed HSM is supported. The managed identity requires the **Managed HSM Crypto Service Encryption User** role on the HSM, assigned via the HSM local RBAC model. Note that SQL MI requires a **user-assigned** managed identity (not system-assigned) for both Key Vault and Managed HSM CMK configurations.

#### References

- [TDE with customer-managed keys at the instance level](https://learn.microsoft.com/azure/azure-sql/managed-instance/transparent-data-encryption-byok-best-practices)
- [Azure SQL Managed Instance transparent data encryption with customer-managed key](https://learn.microsoft.com/azure/azure-sql/managed-instance/transparent-data-encryption-byok-configure)

## When to create more than one Disk Encryption Set

{{< flash "tip" >}}
Use more than one DES when you need clear separation of keys, ownership, or lifecycle.

- **Data classification boundaries** - Isolate sensitive workloads (for example regulated or PII data) from general workloads.
- **Environment isolation** - Keep development, test, and production on separate keys and DES resources.
- **Separate key vaults or HSMs** - Use distinct DES resources when workloads point to different vault or HSM sources.
- **Access control separation** - Split DES resources so each managed identity only has the minimum required key scope.
- **Different rotation policies** - Run independent key rotation cadence for workloads with different change-control requirements.
- **Blast radius reduction** - Limit operational impact if one key, role assignment, or DES configuration has an issue.
{{< /flash >}}

## Broader support

Well over 100 Azure services now support CMK integration with Azure Key Vault, and most of them also support Managed HSM.

 For a comprehensive list, see [Services that support customer-managed keys in Azure Key Vault and Azure Managed HSM](https://learn.microsoft.com/azure/security/fundamentals/encryption-customer-managed-keys-support).

If you are assessing a service against a digital sovereignty audit checklist, that list is your first reference.

## Notable exceptions

Some Azure services include elements of persistent storage but are not represented in the core list above because they use a different storage ownership or encryption model.

- **Azure Container Apps** - Supports mounting Azure Files and storing container images and logs through dependent platform services, but it does not expose a single service-level CMK setting equivalent to DES.
- **Azure App Service** - Persists application content and diagnostics through platform-managed storage layers; CMK posture depends on the underlying integrated services rather than a unified app-level BYOK switch.
- **Azure Functions (Consumption/Premium)** - Can persist state, logs, and artifacts through Storage and Application Insights, so CMK decisions are typically applied on those backing services.
