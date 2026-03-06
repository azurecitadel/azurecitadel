---
title: "Lab: CMK for VM Disks and AKS"
description: "Use a Disk Encryption Set and an HSM-backed CMK to encrypt VM managed disks and AKS node OS disks. The second of three challenge-style labs."
date: 2026-03-06
author: [ "Richard Cheney" ]
draft: false
weight: 50
menu:
  side:
    parent: cmk
    identifier: cmk-lab-disks
series:
  - cmk
---

## Objectives

By the end of this lab you will have:

- Created a Disk Encryption Set (DES) tied to an HSM-backed key in Key Vault Premium.
- Deployed a VM with its OS disk encrypted via the DES.
- Created an AKS cluster with node OS disk encryption using the same DES.

## Reuse the Key Vault from lab 1

This lab assumes you have the `RG`, `KV_NAME`, and `LOCATION` variables from the storage lab. Create a second key specifically for disk encryption.

```shell
KEY_DISK_NAME=cmk-disk-key

az keyvault key create \
  --vault-name $KV_NAME \
  --name $KEY_DISK_NAME \
  --kty RSA-HSM \
  --size 4096
```

## Step 1: Create the Disk Encryption Set

A Disk Encryption Set is a standalone Azure resource that holds the reference to your key and has its own managed identity.

```shell
KEY_DISK_URI=$(az keyvault key show \
  --vault-name $KV_NAME \
  --name $KEY_DISK_NAME \
  --query "key.kid" -o tsv)

DES_NAME=des-cmk-labs

az disk-encryption-set create \
  --name $DES_NAME \
  --resource-group $RG \
  --location $LOCATION \
  --source-vault $KV_NAME \
  --key-url $KEY_DISK_URI
```

Capture the DES's principal ID.

```shell
DES_PRINCIPAL_ID=$(az disk-encryption-set show \
  --name $DES_NAME \
  --resource-group $RG \
  --query "identity.principalId" -o tsv)
```

## Step 2: Grant the DES access to the key

```shell
KV_ID=$(az keyvault show --name $KV_NAME --resource-group $RG --query id -o tsv)

az role assignment create \
  --role "Key Vault Crypto Service Encryption User" \
  --assignee-object-id $DES_PRINCIPAL_ID \
  --assignee-principal-type ServicePrincipal \
  --scope $KV_ID
```

## Step 3: Deploy a VM with CMK disk encryption

```shell
DES_ID=$(az disk-encryption-set show \
  --name $DES_NAME \
  --resource-group $RG \
  --query id -o tsv)

az vm create \
  --name vm-cmk-demo \
  --resource-group $RG \
  --location $LOCATION \
  --image Ubuntu2204 \
  --size Standard_D2s_v3 \
  --os-disk-encryption-set $DES_ID \
  --generate-ssh-keys
```

Once the VM is created, confirm the OS disk's encryption type.

```shell
az vm show \
  --name vm-cmk-demo \
  --resource-group $RG \
  --query "storageProfile.osDisk.managedDisk.diskEncryptionSet.id" \
  -o tsv
```

The returned ID should match your DES.

## Step 4: Create an AKS cluster with CMK node disk encryption

```shell
AKS_NAME=aks-cmk-demo

az aks create \
  --name $AKS_NAME \
  --resource-group $RG \
  --location $LOCATION \
  --node-count 1 \
  --node-vm-size Standard_D2s_v3 \
  --node-osdisk-diskencryptionset-id $DES_ID \
  --generate-ssh-keys
```

Verify encryption is applied to the node pools.

```shell
az aks show \
  --name $AKS_NAME \
  --resource-group $RG \
  --query "agentPoolProfiles[].diskEncryptionSetId" \
  -o tsv
```

{{< flash "tip" >}}
For **host-based encryption** (which also encrypts the temp disk and OS disk cache), add `--enable-encryption-at-host` to the `az aks create` command. It requires the `EncryptionAtHost` feature to be registered on your subscription.
{{< /flash >}}

## Step 5: Rotate the key

Key rotation illustrates the power of the DES indirection layer — you rotate the key in Key Vault and then update the DES to point at the new version. Existing disks are re-encrypted in the background.

1. Create a new key version.

    ```shell
    az keyvault key create \
      --vault-name $KV_NAME \
      --name $KEY_DISK_NAME \
      --kty RSA-HSM \
      --size 4096
    ```

1. Get the new key URI.

    ```shell
    NEW_KEY_URI=$(az keyvault key show \
      --vault-name $KV_NAME \
      --name $KEY_DISK_NAME \
      --query "key.kid" -o tsv)
    ```

1. Update the DES.

    ```shell
    az disk-encryption-set update \
      --name $DES_NAME \
      --resource-group $RG \
      --key-url $NEW_KEY_URI \
      --source-vault $KV_NAME
    ```

## What to discuss

- What is the difference between Disk Encryption Set (server-side CMK) and Azure Disk Encryption (ADE, guest OS level)? They are complementary — DES protects at the platform level, ADE adds a second layer within the guest.
- What happens to the VM if the key is deleted or the DES loses access? Existing disks are inaccessible until access is restored. New disks cannot be created with that DES.
- **Managed HSM difference:** The DES creation and role assignment steps are the same in structure, but the role is assigned on the Managed HSM scope using `az keyvault role assignment create --hsm-name` rather than a standard role assignment on the vault itself.

Reference: [Server-side encryption of Azure Disk Storage](https://learn.microsoft.com/azure/virtual-machines/disk-encryption), [AKS CMK node disk encryption](https://learn.microsoft.com/azure/aks/azure-disk-customer-managed-keys)
