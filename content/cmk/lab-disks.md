---
title: "🧪 CMK for VM Disks and AKS"
description: "Use a Disk Encryption Set and an HSM-backed CMK to encrypt VM managed disks and AKS node OS disks. The second of three challenge-style labs."
date: 2026-03-06
author: [ "Richard Cheney" ]
draft: false
weight: 24
menu:
  side:
    parent: cmk
    identifier: cmk-lab-disks
series:
  - cmk
---

## Objectives

By the end of this lab you will have:

- Created a Disk Encryption Set (DES) tied to an HSM-backed key in Azure Key Vault Premium.
- Deployed a VM with its OS disk encrypted via the DES.
- Created an AKS cluster with node OS disk encryption using the same DES.

We will reuse the Azure Key Vault Premium created in the first lab.

## Set up variables

1. Set default variables.

    ```shell
    export AZURE_DEFAULTS_LOCATION="italynorth"
    export AZURE_DEFAULTS_GROUP="cmk"
    ```

1. Define the key vault name and the key name for disk encryption

    This command assumes that you only have one active key vault in the resource group.

    ```shell
    key_vault_name=$(az keyvault list --query "[0].name" -otsv)
    key_name="cmk-disk-key"
    ```

## Create the HSM key

1. Create the key

    ```shell
    az keyvault key create --vault-name $key_vault_name --name $key_name --kty RSA-HSM --size 4096
    ```

    {{< output >}}

```json
{
  "attributes": {
    "created": "2026-03-31T15:41:07+00:00",
    "enabled": true,
    "expires": null,
    "exportable": false,
    "hsmPlatform": "2",
    "notBefore": null,
    "recoverableDays": 7,
    "recoveryLevel": "CustomizedRecoverable",
    "updated": "2026-03-31T15:41:07+00:00"
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
    "kid": "https://cmk-lab-bd36f48c.vault.azure.net/keys/cmk-disk-key/b23aef78bc8b4674b7aae23ac06c614e",
    "kty": "RSA-HSM",
    "n": "vh7bB9Tq3hyNMjfFuVjSDtXmAZcZbGkDzd3CxhYrnfEp7Ko4oc8Pa1r0222fH5//K7UBoFJ8OW2oRCqHGTA/LzpCJhV5GEfnIpsgKG0mxFf6NDl+yI19Xws22MoU7uRQIa/PNzTLJ/Si56sdqzfjt0wVFapyv6z+g7Dx+5SHFZz3tPzHmIMtbr4+O13JjrtTVRKDjsiAK4ZKeRDCUJXalxQHLRJCthrW0ACtZh4hhsInma7hyixGhjWQccMLOSQA9edvbiX4gNWbd5LMPXFKcJYKJH9gKyxUWbZsDJTtYgU9LPNuvFxxlmyodEgWYjn4ahJaSsXYFR9/SITwP/geQT5EE8kv8HNmBkObyq0mtJhRn5pQFtajPsqpOzEaJjZeztOAuVOgNhUbiNqJfs2aV3YwuhI3WiaWzp/8Y0AvXpQ3JaS+ZJ0BYYqKtkY9O8/Cj8O8cFrNdJwu5j4d3MHPJK0L0Nr07OTY00P8zL7a11mbUIdY82VEl5iIfI9a0vlXe+4FApa8fGPaIdOLaHGg1+RKnmB6UBNXXsv/oYTudLJ36E//cQ2FtUUPnqUTMm//r+2xiEu5Pa5vSi2tu72f07vM12kxZPsY/qEt01oWCYh8Amtt8hv/6y0EvOg4v/Nti2qcc2IcLpJGJWQHj6h9jaAVVVij+bce9qHNeIMCfGM=",
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

1. Get the key URI

    ```shell
    key_uri=$(az keyvault key show --name $key_name --vault-name $key_vault_name --query key.kid -otsv)
    ```

## Create the Disk Encryption Set

A Disk Encryption Set (DES) is a standalone Azure resource that holds the reference to your key and has its own managed identity.

1. Set the Disk Encryption Set name

    ```shell
    des_name="cmk-lab-des"
    ```

1. Create the Disk Encryption Set

    ```shell
    az disk-encryption-set create --name $des_name --source-vault $key_vault_name --key-url $key_uri
    ```

    {{< flash >}}
Note that the Desk Encryption Set command requires a versioned key.
{{< /flash >}}

    {{< output >}}

```json
{
  "activeKey": {
    "keyUrl": "https://cmk-lab-bd36f48c.vault.azure.net/keys/cmk-disk-key/0e07043320174cbfb6b5e260077be946",
    "sourceVault": {
      "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.KeyVault/vaults/cmk-lab-bd36f48c"
    }
  },
  "encryptionType": "EncryptionAtRestWithCustomerKey",
  "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.Compute/diskEncryptionSets/cmk-lab-des",
  "identity": {
    "principalId": "95a62b8a-d0e8-4fb8-9984-5c941d2369bf",
    "tenantId": "ac40fc60-2717-4051-a567-c0cd948f0ac9",
    "type": "SystemAssigned"
  },
  "location": "italynorth",
  "name": "cmk-lab-des",
  "provisioningState": "Succeeded",
  "resourceGroup": "cmk",
  "type": "Microsoft.Compute/diskEncryptionSets"
}
```

{{< /output >}}

1. Get the resource ID for the Disk Encryption Set

    ```shell
    des_id=$(az disk-encryption-set show --name $des_name --query id -otsv)
    ```

## Create the RBAC role assignment

1. Get the object ID

    Grab the object ID of the Disk Encryption Set's managed identity.

    ```shell
    des_object_id=$(az disk-encryption-set show --name $des_name --query "identity.principalId" -o tsv)
    ```

1. Construct the resource ID for the key

    ```shell
    key_vault_id=$(az keyvault show --name $key_vault_name --query id -otsv)
    key_id="${key_vault_id}/keys/${key_name}"
    ```

1. Grant the Disk Encryption Set access to the individual key

    ```shell
    az role assignment create \
      --role "Key Vault Crypto Service Encryption User" \
      --assignee-object-id $des_object_id \
      --assignee-principal-type ServicePrincipal \
      --scope "$key_id"
    ```

    {{< flash "tip" >}}
Remember that in the previous lab we created the RBAC role at the key vault scope. Here we are creating it at the individual key scope. You can use either level.

Key vault level is more easily managed and is therefore more common, especially when using Azure Key Vault Standard and Azure Key Vault Premium as there is no additional cost per vault.

Remember that this will be different for Managed HSM. As well as the cost per Managed HSM, you define access using local RBAC and therefore per key local RBAC is more common. We'll emulate that here as best we can.
{{< /flash >}}

    {{< output >}}

```json
{
  "condition": null,
  "conditionVersion": null,
  "createdBy": null,
  "createdOn": "2026-03-31T16:03:56.090860+00:00",
  "delegatedManagedIdentityResourceId": null,
  "description": null,
  "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.KeyVault/vaults/cmk-lab-bd36f48c/keys/cmk-disk-key/providers/Microsoft.Authorization/roleAssignments/dc899464-f83d-45b4-81e0-4d0bd86e2e68",
  "name": "dc899464-f83d-45b4-81e0-4d0bd86e2e68",
  "principalId": "95a62b8a-d0e8-4fb8-9984-5c941d2369bf",
  "principalType": "ServicePrincipal",
  "resourceGroup": "cmk",
  "roleDefinitionId": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/providers/Microsoft.Authorization/roleDefinitions/e147488a-f6f5-4113-8e2d-b22465e65bf6",
  "scope": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.KeyVault/vaults/cmk-lab-bd36f48c/keys/cmk-disk-key",
  "type": "Microsoft.Authorization/roleAssignments",
  "updatedBy": "74afa9e2-d243-414b-bab2-db8dd242827f",
  "updatedOn": "2026-03-31T16:03:56.697860+00:00"
}
```

{{< /output >}}

## Create a test virtual network

1. Create a network security group for the VM subnet

    ```bash
    az network nsg create --name vm-nsg
    az network nsg rule create --nsg-name vm-nsg --name AllowSSH --priority 100 --source-address-prefixes '*' --destination-address-prefixes '*' --access Allow --protocol Tcp --destination-port-ranges 22
    ```

1. Create a network security group for the AKS subnet

    ```bash
    az network nsg create --name aks-nsg
    az network nsg rule create --nsg-name aks-nsg --name AllowKubernetes --priority 100 --source-address-prefixes '*' --destination-address-prefixes '*' --access Allow --protocol Tcp --destination-port-ranges 443 6443
    ```

1. Create a test virtual network

    ```bash
    az network vnet create --name cmk-vnet --address-prefix 10.0.0.0/22
    ```

1. Add a subnet for the VM

    ```bash
    az network vnet subnet create --vnet-name cmk-vnet --name vm-subnet --address-prefix 10.0.0.0/27 --network-security-group vm-nsg
    ```

1. Add another subnet for the AKS cluster

    ```bash
    az network vnet subnet create --vnet-name cmk-vnet --name aks-subnet --address-prefix 10.0.1.0/24 --network-security-group aks-nsg
    ```

## Deploy a VM with CMK disk encryption

{{< modes >}}
{{< mode title="Azure CLI" >}}

1. Set the VM name

    ```bash
    vm_name="cmk-vm"
    ```

1. Create the VM's NIC

    This allows more control over the naming convention.

    ```bash
    az network nic create --name "${vm_name}-nic" --subnet vm-subnet --vnet-name cmk-vnet
    ```

1. Create a virtual machine using the desk encryption set

    ```bash
    az vm create --name $vm_name \
      --size Standard_B2s --image Ubuntu2404 \
      --os-disk-name "${vm_name}-os" --os-disk-encryption-set $des_id \
      --nics "${vm_name}-nic" \
      --security-type TrustedLaunch --enable-secure-boot true --enable-vtpm true \
      --generate-ssh-keys
    ```

    As a bonus, the command also configures [Trusted Launch](https://aka.ms/trustedlaunch) which will soon be default for supported Gen2 images. It isn't required for customer managed key per se, but it is definitely complementary in a sovereign context.

    {{< output >}}

```json
{
  "fqdns": "",
  "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.Compute/virtualMachines/cmk-disk-vm",
  "location": "italynorth",
  "macAddress": "7C-1E-52-0F-A3-92",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "",
  "resourceGroup": "cmk"
}
```

{{< /output >}}

4. Confirm the disk encryption

    Once the VM is created, confirm the OS disk's encryption type.

    ```shell
    az vm show --name $vm_name --query "storageProfile.osDisk.managedDisk.diskEncryptionSet.id" -o tsv
    ```

    The returned ID should match your DES.

    {{< output >}}
{{< raw >}}
<pre>
/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.Compute/diskEncryptionSets/cmk-lab-des
</pre>
{{< /raw >}}
{{< /output >}}

{{< /mode >}}
{{< /modes >}}

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
