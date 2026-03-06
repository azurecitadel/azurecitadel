---
title: "Secure Key Release"
description: "SKR release policies control exactly which trusted execution environment can receive a key. Here is how to configure them for Confidential VMs, confidential ACI containers, and Intel SGX enclaves."
date: 2026-03-06
author: [ "Richard Cheney" ]
draft: false
weight: 30
menu:
  side:
    parent: cmk
    identifier: cmk-skr
series:
  - cmk
---

## Introduction

The [previous page](../in-use) introduced Azure Confidential Computing and the three TEE types. This page covers the specific Secure Key Release configuration for each — in particular, the **release policy** JSON that you attach to an exportable HSM-backed key to control which environment can receive it.

SKR is supported in **Key Vault Premium** and **Managed HSM** only.

{{< flash >}}
Two conditions must both be satisfied before Key Vault will release a key:

1. The caller presents a valid attestation token from a trusted authority that satisfies all claims in the release policy.
1. The caller's identity has the `release` permission on the key (Key Vault Crypto User role, or the equivalent Managed HSM role).

A valid attestation is not enough without an authorised identity, and vice versa.
{{< /flash >}}

## Creating an exportable key

The `--exportable` flag and `--policy` file are required when creating the key. You cannot add an SKR policy to an existing non-exportable key.

```shell
az keyvault key create \
  --vault-name <vault-name> \
  --name <key-name> \
  --kty RSA-HSM \
  --size 2048 \
  --exportable true \
  --policy skr-policy.json
```

For Managed HSM, replace `--vault-name` with `--hsm-name`.

## Release policies by TEE type

The release policy is a JSON document that specifies:

- **`authority`** — the Azure Attestation provider URI whose tokens are trusted.
- **`allOf`** — a list of claim conditions that must all be satisfied.

The claims differ by TEE type. The examples below use shared regional MAA endpoints — replace with your own Azure Attestation provider URI for production.

## Confidential VMs

### AMD SEV-SNP

The key claim is `x-ms-compliance-status`, which the MAA token sets to `azure-compliant-cvm` for a VM that has passed Azure's confidential VM compliance checks (secure boot enabled, vTPM present, no debug mode).

{{< output "" "Release policy — Confidential VM (AMD SEV-SNP):" >}}
```json
{
  "version": "1.0.0",
  "anyOf": [
    {
      "authority": "https://sharedeus2.eus2.attest.azure.net",
      "allOf": [
        {
          "claim": "x-ms-compliance-status",
          "equals": "azure-compliant-cvm"
        }
      ]
    }
  ]
}
```
{{< /output >}}

To require a specific VM image measurement (a stronger binding, tying the key to an exact OS image), add an additional claim for `x-ms-sevsnpvm-launchmeasurement`.

#### References

- [SKR flow: Confidential VM (SEV-SNP)](https://learn.microsoft.com/azure/confidential-computing/skr-flow-confidential-vm-sev-snp)
- [Confidential VM attestation claims reference](https://learn.microsoft.com/azure/attestation/attestation-token-examples)

### Intel SGX

SGX attestation uses different claims. The critical ones are `x-ms-sgx-mrenclave` (a hash of the enclave code) and `x-ms-sgx-mrsigner` (a hash of the signer's public key). Tying the policy to `mrenclave` binds the key to an exact build of your enclave — even a recompile changes it. Using `mrsigner` is less strict, trusting any enclave signed by the same key.

The example below uses `mrsigner`, which is more practical for iterative development.

{{< output "" "Release policy — Intel SGX (signer-bound):" >}}
```json
{
  "version": "1.0.0",
  "anyOf": [
    {
      "authority": "https://sharedeus2.eus2.attest.azure.net",
      "allOf": [
        {
          "claim": "x-ms-sgx-is-debuggable",
          "equals": "false"
        },
        {
          "claim": "x-ms-sgx-mrsigner",
          "equals": "<your-mrsigner-hash>"
        },
        {
          "claim": "x-ms-sgx-svn",
          "greater-than": "0"
        }
      ]
    }
  ]
}
```
{{< /output >}}

For production, replace `mrsigner` with `mrenclave` to pin the policy to a specific enclave build:

{{< output "" "Release policy — Intel SGX (enclave-bound):" >}}
```json
{
  "version": "1.0.0",
  "anyOf": [
    {
      "authority": "https://sharedeus2.eus2.attest.azure.net",
      "allOf": [
        {
          "claim": "x-ms-sgx-is-debuggable",
          "equals": "false"
        },
        {
          "claim": "x-ms-sgx-mrenclave",
          "equals": "<your-mrenclave-hash>"
        }
      ]
    }
  ]
}
```
{{< /output >}}

#### References

- [SKR with Intel SGX and Key Vault](https://learn.microsoft.com/azure/confidential-computing/skr-flow-intel-sgx)
- [SGX attestation claims in MAA tokens](https://learn.microsoft.com/azure/attestation/attestation-token-examples)
- [Open Enclave SDK — getting MRENCLAVE and MRSIGNER values](https://openenclave.io/sdk/)

## Confidential Containers

### Azure Container Instances (ACI)

For ACI confidential container groups, the attestation token is generated at container group initialisation. The key claim is `x-ms-sevsnpvm-is-debuggable` (must be false) and `ContainerPlat.CodesignData` to anchor the policy to your specific container image digest. A simpler starting policy trusts any non-debuggable ACI confidential container group attested by your provider.

{{< output "" "Release policy — Confidential containers (ACI):" >}}
```json
{
  "version": "1.0.0",
  "anyOf": [
    {
      "authority": "https://sharedeus2.eus2.attest.azure.net",
      "allOf": [
        {
          "claim": "x-ms-compliance-status",
          "equals": "azure-compliant-uvm"
        },
        {
          "claim": "x-ms-sevsnpvm-is-debuggable",
          "equals": "false"
        }
      ]
    }
  ]
}
```
{{< /output >}}

{{< flash "tip" >}}
The [confidential sidecar](https://github.com/Azure/confidential-sidecars) handles attestation and the key release call for you. Your workload container calls a local REST endpoint — no custom attestation code required. The sidecar also validates the container group policy document against the attestation report, which is what populates the `ContainerPlat` claims.
{{< /flash >}}

#### References

- [SKR flow: Confidential containers in ACI](https://learn.microsoft.com/azure/confidential-computing/skr-flow-confidential-containers-azure-container-instance)
- [Confidential sidecars (GitHub)](https://github.com/Azure/confidential-sidecars)

### Azure Kubernetes Service (AKS)

AKS confidential node pools use AMD SEV-SNP via the same [DCasv5 / ECasv5 VM series](https://learn.microsoft.com/azure/virtual-machines/dcasv5-dcadsv5-series). Each node runs in a hardware-isolated TEE and the attestation flow mirrors that of a standalone Confidential VM.

For SKR, the workload pod performs attestation and calls the Key Vault release API using its [workload identity](https://learn.microsoft.com/azure/aks/workload-identity-overview) as the authorised principal. The release policy is the same `azure-compliant-cvm` policy as the AMD SEV-SNP VM example above.

#### References

- [Confidential VMs in AKS node pools](https://learn.microsoft.com/azure/aks/use-cvm)
- [Workload identity with AKS](https://learn.microsoft.com/azure/aks/workload-identity-overview)

### Azure Container Apps (ACA)

Azure Container Apps does not currently support Azure Confidential Computing at the time of writing. SKR is not available for ACA workloads through the standard platform path.

If confidential container support is a hard requirement, Azure Container Instances (confidential SKU) or AKS with confidential node pools are the appropriate alternatives.

## Compliance and auditability

Every SKR operation is recorded in the Key Vault or Managed HSM diagnostic logs with the attestation details and the requesting identity. This creates a tamper-evident audit trail showing that the key was only ever released to a verified, attested environment — useful evidence for sovereignty audits or compliance reviews.

#### References

- [Key Vault logging](https://learn.microsoft.com/azure/key-vault/general/logging)
- [Secure Key Release concept and attestation](https://learn.microsoft.com/azure/confidential-computing/concept-skr-attestation)
