---
title: "🧪 Secure Key Release"
description: "Configure an exportable HSM key with an SKR release policy and retrieve it from inside an Azure Confidential VM. The third and most advanced of the challenge-style labs."
date: 2026-03-06
author: [ "Richard Cheney" ]
draft: true
weight: 35
menu:
  side:
    parent: cmk
    identifier: cmk-lab-skr
series:
  - cmk
---

## Objectives

By the end of this lab you will have:

- Created an exportable RSA-HSM key with a Secure Key Release policy.
- Deployed an AMD SEV-SNP Confidential VM with a managed identity.
- Performed a key release from inside the Confidential VM and inspected the Key Vault audit log to confirm the attested release.

{{< flash >}}
This is the most complex lab in the series. If you prefer to follow along rather than run every step yourself, the SKR flow is the same in either case — focus on understanding the pattern.
{{< /flash >}}

## Prerequisites

Check that your subscription has quota for the Confidential VM SKU in your chosen region. The `DCasv5` and `ECasv5` series (AMD SEV-SNP) are required.

```shell
az vm list-skus \
  --location $LOCATION \
  --size DCas \
  --output table
```

You also need diagnostic settings on your Key Vault to capture audit logs. If not already enabled:

```shell
WORKSPACE_ID=$(az monitor log-analytics workspace create \
  --name law-cmk-labs \
  --resource-group $RG \
  --location $LOCATION \
  --query id -o tsv)

KV_ID=$(az keyvault show --name $KV_NAME --resource-group $RG --query id -o tsv)

az monitor diagnostic-settings create \
  --resource $KV_ID \
  --name kv-diagnostics \
  --logs '[{"category":"AuditEvent","enabled":true}]' \
  --workspace $WORKSPACE_ID
```

## Step 1: Create an Azure Attestation provider

You need an attestation provider to validate the Confidential VM's hardware report.

```shell
ATTEST_NAME=attest-cmk-$(cat /dev/urandom | tr -dc 'a-z0-9' | head -c6)

az attestation create \
  --name $ATTEST_NAME \
  --resource-group $RG \
  --location $LOCATION

ATTEST_URI=$(az attestation show \
  --name $ATTEST_NAME \
  --resource-group $RG \
  --query "attestUri" -o tsv)

echo $ATTEST_URI
```

## Step 2: Create the exportable SKR key

Save the release policy as a local JSON file, then create the key.

```shell
cat > skr-policy.json <<EOF
{
  "version": "1.0.0",
  "anyOf": [
    {
      "authority": "${ATTEST_URI}",
      "allOf": [
        {
          "claim": "x-ms-compliance-status",
          "equals": "azure-compliant-cvm"
        }
      ]
    }
  ]
}
EOF
```

```shell
SKR_KEY_NAME=cmk-skr-key

az keyvault key create \
  --vault-name $KV_NAME \
  --name $SKR_KEY_NAME \
  --kty RSA-HSM \
  --size 2048 \
  --exportable true \
  --policy @skr-policy.json
```

Confirm the key has a release policy attached.

```shell
az keyvault key show \
  --vault-name $KV_NAME \
  --name $SKR_KEY_NAME \
  --query "attributes.exportable"
```

## Step 3: Deploy the Confidential VM

```shell
CVM_NAME=cvm-skr-demo

az vm create \
  --name $CVM_NAME \
  --resource-group $RG \
  --location $LOCATION \
  --image "Canonical:0001-com-ubuntu-confidential-vm-jammy:22_04-lts-cvm:latest" \
  --size Standard_DC2as_v5 \
  --security-type ConfidentialVM \
  --os-disk-security-encryption-type VMGuestStateOnly \
  --assign-identity \
  --enable-vtpm true \
  --enable-secure-boot true \
  --generate-ssh-keys
```

Capture the VM's managed identity principal ID.

```shell
CVM_PRINCIPAL_ID=$(az vm show \
  --name $CVM_NAME \
  --resource-group $RG \
  --query "identity.principalId" -o tsv)
```

## Step 4: Grant the VM identity release access

The VM identity needs the **Key Vault Crypto User** role, which includes the `release` permission.

```shell
az role assignment create \
  --role "Key Vault Crypto User" \
  --assignee-object-id $CVM_PRINCIPAL_ID \
  --assignee-principal-type ServicePrincipal \
  --scope $KV_ID
```

## Step 5: Perform the key release from inside the VM

SSH into the Confidential VM and run the key release. Azure provides a sample helper script for this.

```shell
CVM_IP=$(az vm show \
  --name $CVM_NAME \
  --resource-group $RG \
  -d --query publicIps -o tsv)

ssh azureuser@$CVM_IP
```

Inside the VM, install the Azure CLI and the `az confcom` extension, then request the key release.

```shell
# Inside the CVM
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
az extension add --name confcom

az login --identity

az keyvault key release \
  --vault-name <KV_NAME> \
  --name cmk-skr-key \
  --target $(<attestation_token_file>)
```

{{< flash "tip" >}}
The full attestation token flow is covered in [Secure Key Release with a Confidential VM (SEV-SNP)](https://learn.microsoft.com/azure/confidential-computing/skr-flow-confidential-vm-sev-snp). For ACI container scenarios, the [confidential sidecar](https://github.com/Azure/confidential-sidecars) handles the attestation and key release for you — your main container just calls a local REST endpoint.
{{< /flash >}}

## Step 6: Inspect the audit log

Back on your workstation, query the Key Vault audit log to confirm the SKR operation was recorded.

```shell
az monitor log-analytics query \
  --workspace $WORKSPACE_ID \
  --analytics-query "AzureDiagnostics | where ResourceType == 'VAULTS' | where OperationName == 'SecureKeyRelease' | project TimeGenerated, identity_claim_appid_g, identity_claim_oid_g, resultDescription | order by TimeGenerated desc" \
  --timespan P1H
```

The entry will show the timestamp, the requesting identity, and the result — your evidence that the key was only released after successful attestation.

## What to discuss

- What makes this different from standard CMK? The key material was released to the VM itself — the encryption or decryption happened inside the TEE rather than being delegated to Azure.
- What prevents a key from being released to a compromised host? The SEV-SNP hardware encrypts the VM's memory and provides the attestation report. The host OS cannot forge that report.
- **Managed HSM difference:** Use `az keyvault key release --hsm-name` instead, and assign the `Managed HSM Crypto User` role using `az keyvault role assignment create --hsm-name`. The release policy and attestation flow are identical.

References:
- [Secure Key Release concept](https://learn.microsoft.com/azure/confidential-computing/concept-skr-attestation)
- [SKR flow: Confidential VM (SEV-SNP)](https://learn.microsoft.com/azure/confidential-computing/skr-flow-confidential-vm-sev-snp)
- [SKR flow: Confidential containers in ACI](https://learn.microsoft.com/azure/confidential-computing/skr-flow-confidential-containers-azure-container-instance)
