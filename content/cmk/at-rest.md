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

## Virtual Machines and Managed Disks

VM disk encryption with CMK is managed through **Disk Encryption Sets** (DES). A DES is a dedicated Azure resource that wraps the relationship between your key and the managed disks that use it.

Once you have a DES, you can:

- Attach it to a VM at creation time so all managed disks (OS and data) are encrypted with your CMK.
- Change the encryption settings on existing disks.

The DES has its own managed identity which needs **Key Vault Crypto Service Encryption User** access on the key. Azure VMs and AKS both support using keys from either Key Vault or Managed HSM. For Managed HSM, assign the **Managed HSM Crypto Service Encryption User** role on the HSM using the HSM local RBAC model.

#### References

- [Server-side encryption of Azure Disk Storage](https://learn.microsoft.com/azure/virtual-machines/disk-encryption)
- [Use the Azure portal to enable server-side encryption with customer-managed keys for managed disks](https://learn.microsoft.com/azure/virtual-machines/disks-enable-customer-managed-keys-portal)

## Azure Kubernetes Service

AKS uses Disk Encryption Sets to encrypt the OS disks of cluster nodes. You create the DES separately, then reference it when creating or updating the node pool.

Host-based encryption extends this further — encrypting the temp disk and OS cache of the node VM itself, not just the managed disks.

AKS inherits Managed HSM support through the Disk Encryption Set — configure the DES with an mHSM key and AKS uses it transparently. The role grant on the mHSM is the same as for VMs above.

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

## Broader support

Well over 100 Azure services now support CMK integration with Azure Key Vault, and most of them also support Managed HSM. For a comprehensive list, see [Services that support customer-managed keys in Azure Key Vault and Azure Managed HSM](https://learn.microsoft.com/azure/security/fundamentals/encryption-customer-managed-keys-support).

If you are assessing a service against a digital sovereignty audit checklist, that list is your first reference.
