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
- Deployed a small test network
- Deployed a VM with its OS disk encrypted via the DES.
- Created an AKS cluster with node OS disk encryption using the same DES.

We will reuse the Azure Key Vault Premium created in the first lab.

Note that in a real world scenario you would probably use different keys for the virtual machines and the AKS nodes as per the guidance on the [Encrypting data at rest with CMK](/cmk/at-rest/#when-to-create-more-than-one-disk-encryption-set) page. You would therefore need more than one Disk Encryption Set as they are linked to the keys.

This lab keeps it simple by reusing the same key and DES, but feel free to create multiples of each if you wish.

## Set up variables

1. Set default variables.

    ```bash
    export AZURE_DEFAULTS_LOCATION="italynorth"
    export AZURE_DEFAULTS_GROUP="cmk"
    ```

1. Define the key vault name and the key name for disk encryption

    This command assumes that you only have one active key vault in the resource group.

    ```bash
    key_vault_name=$(az keyvault list --query "[0].name" -otsv)
    key_name="cmk-disk-key"
    ```

## Create the HSM key

1. Create the key

    ```bash
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

    ```bash
    key_uri=$(az keyvault key show --name $key_name --vault-name $key_vault_name --query key.kid -otsv)
    ```

## Create the Disk Encryption Set

A Disk Encryption Set (DES) is a standalone Azure resource that holds the reference to your key and has its own managed identity.

1. Set the Disk Encryption Set name

    ```bash
    des_name="cmk-lab-des"
    ```

1. Create the Disk Encryption Set

    ```bash
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

    ```bash
    des_id=$(az disk-encryption-set show --name $des_name --query id -otsv)
    ```

## Create the RBAC role assignment

1. Get the object ID

    Grab the object ID of the Disk Encryption Set's managed identity.

    ```bash
    des_object_id=$(az disk-encryption-set show --name $des_name --query "identity.principalId" -o tsv)
    ```

1. Construct the resource ID for the key

    ```bash
    key_vault_id=$(az keyvault show --name $key_vault_name --query id -otsv)
    key_id="${key_vault_id}/keys/${key_name}"
    ```

1. Grant the Disk Encryption Set access to the individual key

    ```bash
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

    ```bash
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

## Create an AKS cluster with CMK node disk encryption

In this step you will create a standard AKS cluster and set the node OS disk encryption to use your Disk Encryption Set. This is not AKS Automatic, as we are explicitly configuring node-level disk settings.

Because the cluster will use the existing `aks-subnet`, the `aks-nsg` attached to that subnet will apply automatically to the AKS nodes. There is no separate NSG switch on `az aks create`.

For the AKS equivalent of the VM's Trusted Launch settings, we will also enable Secure Boot and vTPM on the node pool.

1. Define the cluster name

    ```bash
    aks_name="cmk-aks"
    ```

1. Get the AKS subnet resource ID

    ```bash
    aks_subnet_id=$(az network vnet subnet show --vnet-name cmk-vnet --name aks-subnet --query id -o tsv)
    ```

1. Define a non-overlapping service CIDR

    The AKS service CIDR is an internal cluster network range. It must not overlap with the VNet or any of its subnets.

    ```bash
    service_cidr="10.240.0.0/24"
    dns_service_ip="10.240.0.10"
    ```

1. Create the cluster

    ```bash
    az aks create --name $aks_name \
      --vnet-subnet-id $aks_subnet_id \
      --service-cidr $service_cidr --dns-service-ip $dns_service_ip \
      --node-count 1 --node-vm-size Standard_B2s \
      --node-osdisk-diskencryptionset-id $des_id \
      --enable-secure-boot --enable-vtpm \
      --generate-ssh-keys
    ```

    {{< flash "tip" >}}
Feel free to change the size and number of nodes for a more useful and representative cluster.

This command will take a few minutes so a good time to grab a drink...
{{< /flash>}}

    {{< output "Click here for example command output" "Example output" >}}

```json
{
  "aadProfile": null,
  "addonProfiles": null,
  "agentPoolProfiles": [
    {
      "availabilityZones": null,
      "capacityReservationGroupId": null,
      "count": 1,
      "creationData": null,
      "currentOrchestratorVersion": "1.33.7",
      "eTag": "8555b32b-f02d-4f82-b3f5-2a6ab9482a98",
      "enableAutoScaling": false,
      "enableEncryptionAtHost": false,
      "enableFips": false,
      "enableNodePublicIp": false,
      "enableUltraSsd": false,
      "gatewayProfile": null,
      "gpuInstanceProfile": null,
      "gpuProfile": null,
      "hostGroupId": null,
      "kubeletConfig": null,
      "kubeletDiskType": "OS",
      "linuxOsConfig": null,
      "localDnsProfile": null,
      "maxCount": null,
      "maxPods": 250,
      "messageOfTheDay": null,
      "minCount": null,
      "mode": "System",
      "name": "nodepool1",
      "networkProfile": null,
      "nodeImageVersion": "AKSUbuntu-2204gen2TLcontainerd-202603.12.1",
      "nodeLabels": null,
      "nodePublicIpPrefixId": null,
      "nodeTaints": null,
      "orchestratorVersion": "1.33",
      "osDiskSizeGb": 128,
      "osDiskType": "Managed",
      "osSku": "Ubuntu",
      "osType": "Linux",
      "podIpAllocationMode": null,
      "podSubnetId": null,
      "powerState": {
        "code": "Running"
      },
      "provisioningState": "Succeeded",
      "proximityPlacementGroupId": null,
      "scaleDownMode": "Delete",
      "scaleSetEvictionPolicy": null,
      "scaleSetPriority": null,
      "securityProfile": {
        "enableSecureBoot": true,
        "enableVtpm": true,
        "sshAccess": null
      },
      "spotMaxPrice": null,
      "status": null,
      "tags": null,
      "type": "VirtualMachineScaleSets",
      "upgradeSettings": {
        "drainTimeoutInMinutes": null,
        "maxSurge": "10%",
        "maxUnavailable": "0",
        "nodeSoakDurationInMinutes": null,
        "undrainableNodeBehavior": null
      },
      "virtualMachineNodesStatus": null,
      "virtualMachinesProfile": null,
      "vmSize": "Standard_B2s",
      "vnetSubnetId": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.Network/virtualNetworks/cmk-vnet/subnets/aks-subnet",
      "windowsProfile": null,
      "workloadRuntime": null
    }
  ],
  "aiToolchainOperatorProfile": null,
  "apiServerAccessProfile": null,
  "autoScalerProfile": null,
  "autoUpgradeProfile": {
    "nodeOsUpgradeChannel": "NodeImage",
    "upgradeChannel": null
  },
  "azureMonitorProfile": null,
  "azurePortalFqdn": "cmk-aks-cmk-735681-zp29csvd.portal.hcp.italynorth.azmk8s.io",
  "bootstrapProfile": {
    "artifactSource": "Direct",
    "containerRegistryId": null
  },
  "currentKubernetesVersion": "1.33.7",
  "disableLocalAccounts": false,
  "diskEncryptionSetId": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.Compute/diskEncryptionSets/cmk-lab-des",
  "dnsPrefix": "cmk-aks-cmk-735681",
  "eTag": "34efa9d0-abb5-436e-a36d-0a7ade78df18",
  "enableRbac": true,
  "extendedLocation": null,
  "fqdn": "cmk-aks-cmk-735681-zp29csvd.hcp.italynorth.azmk8s.io",
  "fqdnSubdomain": null,
  "httpProxyConfig": null,
  "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourcegroups/cmk/providers/Microsoft.ContainerService/managedClusters/cmk-aks",
  "identity": {
    "delegatedResources": null,
    "principalId": "6c00577f-0609-425c-80ca-ed0ad674dc1e",
    "tenantId": "ac40fc60-2717-4051-a567-c0cd948f0ac9",
    "type": "SystemAssigned",
    "userAssignedIdentities": null
  },
  "identityProfile": {
    "kubeletidentity": {
      "clientId": "d6da5e8b-20b4-4115-8cbb-8f200cfe0afd",
      "objectId": "537008b0-968d-4f35-8854-7c099cf9cc46",
      "resourceId": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourcegroups/MC_cmk_cmk-aks_italynorth/providers/Microsoft.ManagedIdentity/userAssignedIdentities/cmk-aks-agentpool"
    }
  },
  "ingressProfile": null,
  "kind": "Base",
  "kubernetesVersion": "1.33",
  "linuxProfile": {
    "adminUsername": "azureuser",
    "ssh": {
      "publicKeys": [
        {
          "keyData": "ssh-rsa ..."
        }
      ]
    }
  },
  "location": "italynorth",
  "maxAgentPools": 100,
  "metricsProfile": {
    "costAnalysis": {
      "enabled": false
    }
  },
  "name": "cmk-aks",
  "networkProfile": {
    "advancedNetworking": null,
    "dnsServiceIp": "10.240.0.10",
    "ipFamilies": [
      "IPv4"
    ],
    "loadBalancerProfile": {
      "allocatedOutboundPorts": null,
      "backendPoolType": "nodeIPConfiguration",
      "effectiveOutboundIPs": [
        {
          "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/MC_cmk_cmk-aks_italynorth/providers/Microsoft.Network/publicIPAddresses/dea2bf89-f791-45e6-aef5-b043d18168d3",
          "resourceGroup": "MC_cmk_cmk-aks_italynorth"
        }
      ],
      "enableMultipleStandardLoadBalancers": null,
      "idleTimeoutInMinutes": null,
      "managedOutboundIPs": {
        "count": 1,
        "countIpv6": null
      },
      "outboundIPs": null,
      "outboundIpPrefixes": null
    },
    "loadBalancerSku": "standard",
    "natGatewayProfile": null,
    "networkDataplane": "azure",
    "networkMode": null,
    "networkPlugin": "azure",
    "networkPluginMode": "overlay",
    "networkPolicy": "none",
    "outboundType": "loadBalancer",
    "podCidr": "10.244.0.0/16",
    "podCidrs": [
      "10.244.0.0/16"
    ],
    "serviceCidr": "10.240.0.0/24",
    "serviceCidrs": [
      "10.240.0.0/24"
    ],
    "staticEgressGatewayProfile": null
  },
  "nodeProvisioningProfile": {
    "defaultNodePools": "Auto",
    "mode": "Manual"
  },
  "nodeResourceGroup": "MC_cmk_cmk-aks_italynorth",
  "nodeResourceGroupProfile": null,
  "oidcIssuerProfile": {
    "enabled": false,
    "issuerUrl": null
  },
  "podIdentityProfile": null,
  "powerState": {
    "code": "Running"
  },
  "privateFqdn": null,
  "privateLinkResources": null,
  "provisioningState": "Succeeded",
  "publicNetworkAccess": null,
  "resourceGroup": "cmk",
  "resourceUid": "69cce1e6415b1200015bad0b",
  "securityProfile": {
    "azureKeyVaultKms": null,
    "customCaTrustCertificates": null,
    "defender": null,
    "imageCleaner": null,
    "workloadIdentity": null
  },
  "serviceMeshProfile": null,
  "servicePrincipalProfile": {
    "clientId": "msi",
    "secret": null
  },
  "sku": {
    "name": "Base",
    "tier": "Free"
  },
  "status": null,
  "storageProfile": {
    "blobCsiDriver": null,
    "diskCsiDriver": {
      "enabled": true
    },
    "fileCsiDriver": {
      "enabled": true
    },
    "snapshotController": {
      "enabled": true
    }
  },
  "supportPlan": "KubernetesOfficial",
  "systemData": null,
  "tags": null,
  "type": "Microsoft.ContainerService/ManagedClusters",
  "upgradeSettings": null,
  "windowsProfile": null,
  "workloadAutoScalerProfile": {
    "keda": null,
    "verticalPodAutoscaler": null
  }
```

{{< /output >}}

1. Verify encryption is applied to the node pools.

    ```bash
    az aks show --name $aks_name --query "diskEncryptionSetId" -o tsv
    ```

    {{< output >}}
{{< raw >}}
<pre>
/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/cmk/providers/Microsoft.Compute/diskEncryptionSets/cmk-lab-des
</pre>
{{< /raw >}}
{{< /output>}}

    {{< flash "tip" >}}
For **host-based encryption** (which also encrypts the temp disk and OS disk cache), add `--enable-encryption-at-host` to the `az aks create` command. It requires the `EncryptionAtHost` feature to be registered on your subscription.
{{< /flash >}}

## Rotate the key

Key rotation illustrates the power of the DES indirection layer — you rotate the key in Key Vault and then update the DES to point at the new version.

1. Create a new key version.

    ```bash
    az keyvault key create --vault-name $key_vault_name --name $key_name --kty RSA-HSM --size 4096
    ```

1. Get the new key URI

    ```bash
    new_key_uri=$(az keyvault key show --vault-name $key_vault_name --name $key_name --query "key.kid" -o tsv)
    ```

1. Update the DES

    ```bash
    az disk-encryption-set update --name $des_name \
      --key-url $new_key_uri --source-vault $key_vault_name
    ```

    {{< output >}}

```json
{
  "activeKey": {
    "keyUrl": "https://cmk-lab-bd36f48c.vault.azure.net/keys/cmk-disk-key/c8d4eff54744469982921172609f941b",
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
  "lastKeyRotationTimestamp": "2026-04-01T09:55:24.4834558+00:00",
  "location": "italynorth",
  "name": "cmk-lab-des",
  "provisioningState": "Succeeded",
  "resourceGroup": "cmk",
  "type": "Microsoft.Compute/diskEncryptionSets"
}
```

{{< /output >}}

Existing managed disks linked to the disk encryption set are automatically re-encrypted in the background.

## Summary

As a reminder, in this lab you

- Created a Disk Encryption Set (DES) tied to an HSM-backed key in Azure Key Vault Premium.
- Deployed a small test network
- Deployed a VM with its OS disk encrypted via the DES.
- Created an AKS cluster with node OS disk encryption using the same DES.

OK, this lab is now complete! You can move to the next page or read on for more info.

## SSE, DES, Encryption at Host, and ADE

Server-side encryption (SSE) encrypts all storage services provided by the Microsoft.Storage namespace. SSE uses Microsoft (or platform) managed keys by default. (PMK) Here we have reconfigured the SSE with customer managed keys (CMK) for a few select Azure services.

For Managed Disks this is done via Disk Encryption Sets (DES). Virtual machines use Managed Disks for the OS disks and any data disks. Managed Disks are another provider in the wider Microsoft.Storage namespace and those disks are then associated to the virtual machines (Microsoft.Compute).

You can additionally use Encryption at Host to ensure that the hypervisor hosts encrypts the other disks and storage functions that are local to the host, such as cache and temp. This improves the security stance but note that Encryption at Host uses the Microsoft-managed keys and there is no option today to encrypt those volumes using customer managed keys.

Azure Disk Encryption (ADE) then adds the option to encrypt the disks from the guest OS perspective. For Windows Server this uses BitLocker and for Linux it is DM-Crypt. ADE is not covered in these labs, but it can be used with a customer managed key. Read around the subject as there are some downsides. ADE cannot be used with some other services and it places a burden on the guest VMs CPU.

## Losing access

Existing disks will become inaccessible if the key is deleted or the Disk Encryption Set / Azure service loses access. It will come back to life if access is restored. New disks cannot be created within that DES.

## Managed HSM differences

The DES creation and role assignment steps are the same in structure, but the role is assigned on the Managed HSM scope using `az keyvault role assignment create --hsm-name` rather than a standard role assignment on the vault itself.

The path for the key's URI is different:

| Type        | Key URI                                                                 |
|-------------|-------------------------------------------------------------------------|
| Vault       |`https://<key_vault_name.vault.azure.net/keys/<key_name>/<version>`      |
| Managed HSM |`https://<key_vault_name.managedhsm.azure.net/keys/<key_name>/<version>` |

#### Reference

- [Overview of managed disk encryption options](https://learn.microsoft.com/azure/virtual-machines/disk-encryption-overview)
- [Server-side encryption of Azure Disk Storage](https://learn.microsoft.com/azure/virtual-machines/disk-encryption)
- [AKS CMK node disk encryption](https://learn.microsoft.com/azure/aks/azure-disk-customer-managed-keys)
