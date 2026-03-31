---
title: "Key Management Options"
description: "Azure Key Vault Standard, Azure Key Vault Premium, and Azure Key Vault Managed HSM each offer a different balance of security, sovereignty, and cost. Here is how to choose."
date: 2026-03-06
author: [ "Richard Cheney" ]
draft: false
weight: 10
menu:
  side:
    parent: cmk
    identifier: cmk-keyvaults
aliases:
  - /cmk/theory
series:
  - cmk
---

## Introduction

Azure gives you many key management options. Here we will cover three of them: Azure Key Vault Standard and Premium, plus Azure Ket Vault Managed HSM. They share a common API surface but differ significantly in how keys are protected and who ultimately controls them. Choosing the right one has direct implications for your compliance and sovereignty posture.

{{< flash >}}
**Quick guidance**

- **Azure Key Vault Standard** — good for dev/test and low-sensitivity workloads: secrets, certs, software-protected keys.
- **Azure Key Vault Premium** — production workloads needing HSM-backed keys; the right default for most CMK scenarios.
- **Azure Key Vault Managed HSM** — top-tier compliance requirements (PCI DSS, sovereignty mandates) where single-tenant, customer-controlled key infrastructure is non-negotiable.
{{< /flash >}}

## Azure Key Vault Standard

Standard tier vaults store keys using software-backed encryption (FIPS 140-2 Level 1). They support RSA and EC keys alongside secrets and certificates. Keys are logically isolated per vault but the underlying infrastructure is shared and ultimately controlled by Microsoft.

Standard is a good fit for development, test, and non-critical production use cases where HSM assurance is not a requirement.

#### References

- [Azure Key Vault overview](https://learn.microsoft.com/azure/key-vault/general/overview)
- [About keys, secrets, and certificates](https://learn.microsoft.com/azure/key-vault/general/about-keys-secrets-certificates)
- [Create and import keys in Key Vault (CLI)](https://learn.microsoft.com/azure/key-vault/keys/quick-create-cli)

## Azure Key Vault Premium

Premium adds hardware-backed key storage. Keys are generated and protected inside Marvell LiquidSecurity HSMs that are now FIPS 140-3 Level 3 validated. The underlying HSMs are partitioned per customer but are still shared infrastructure — Microsoft holds the root of trust.

What you gain over Standard:

- **HSM-backed keys** (RSA-HSM and EC-HSM) that never leave the HSM boundary.
- **Secure Key Release (SKR)** support for Azure Confidential Computing scenarios.
- **Bring Your Own Key (BYOK)** — import keys generated on-premises via a secure HSM transfer.

The API is identical to Standard. Upgrading from Standard to Premium requires no code changes.

#### References

- [Create HSM-protected keys in Key Vault Premium](https://learn.microsoft.com/azure/key-vault/keys/hsm-protected-keys)
- [Import HSM-protected keys to Key Vault (BYOK)](https://learn.microsoft.com/azure/key-vault/keys/hsm-protected-keys-byok)
- [Generate and transfer HSM-protected keys for Azure Key Vault](https://learn.microsoft.com/azure/key-vault/keys/hsm-protected-keys-ndes)

## Azure Key Vault Managed HSM

Managed HSM provides a dedicated HSM cluster per customer — FIPS 140-3 Level 3, single-tenant, and cryptographically isolated from other tenants. It is also PCI DSS and PCI 3DS compliant.

The key sovereignty story is materially different here:

- **The root of trust belongs to you.** When you initialise a Managed HSM, you generate a security domain — a set of cryptographic materials that Microsoft never holds. You need it to recover or restore the HSM.
- **Even subscription Owners cannot access key material** without being assigned an HSM role on the HSM itself. This is enforced by a dual-layer access control model.
- **Keys stay in the deployment region.** There is no automatic geo-replication — you are responsible for cross-region backup and recovery.

Managed HSM supports keys only (no secrets or certificates) but adds symmetric AES keys that are not available in Key Vault.

{{< flash "tip" >}}
Managed HSM uses a different endpoint (`*.managedhsm.azure.net`) and a local RBAC model (HSM roles like `Managed HSM Crypto User`) rather than Key Vault access policies. Applications written against AKV Premium can be re-pointed to a Managed HSM endpoint with minimal changes.
{{< /flash >}}

#### References

- [Azure Key Vault Managed HSM overview](https://learn.microsoft.com/azure/key-vault/managed-hsm/overview)
- [Create keys in a Managed HSM (CLI quickstart)](https://learn.microsoft.com/azure/key-vault/managed-hsm/quick-create-cli)
- [Import HSM-protected keys to Managed HSM (BYOK)](https://learn.microsoft.com/azure/key-vault/managed-hsm/hsm-protected-keys-byok)
- [Key management controls — Microsoft Sovereign Cloud](https://learn.microsoft.com/industry/sovereign-cloud/concepts/key-controls)

## Comparison

| Aspect | Standard | Premium | Managed HSM |
|---|---|---|---|
| Tenancy | Multi-tenant | Multi-tenant (HSM partitioned) | Single-tenant, dedicated cluster |
| Key protection | Software (FIPS 140-2 L1) | HSM (FIPS 140-3 L3) | HSM (FIPS 140-3 L3) |
| PCI DSS | No | No | Yes |
| Key types | RSA, EC, secrets, certs | RSA-HSM, EC-HSM, secrets, certs | RSA, EC, AES (keys only) |
| Secure Key Release | No | Yes | Yes |
| Root of trust | Microsoft | Microsoft | Customer |
| Geo-redundancy | Automatic | Automatic | Customer-managed |
| Cost | Low (per-operation) | Moderate | High (per-hour cluster) |

#### References

- [How to choose the right Azure key management solution](https://learn.microsoft.com/azure/security/fundamentals/key-management-choose)

## Soft delete and purge protection

Losing access to keys through administrative error or due to malicious intent by bad actors can have catastrophic impact. This is particularly important where those keys are used to encrypt Azure services via Customer Managed Key.

Data encrypted with customer managed keys will become permanently unrecoverable if the key is permanently deleted and therefore Azure enforces recoverability.

- Soft delete is universally enabled across all Azure Key Vault SKUs.
- The default (and maximum) retention period is 90 days. (The minimum is 7 days.)
- The retention period is an immutable property and cannot be changed set.
- Deleted key vaults without purge protection can be purged.
- However, purge protection is **mandatory** for all Azure services using customer managed keys.

Example command to enable customer managed key on a storage account:

```shell
az storage account update --name "<myStorageAccount>" --encryption-key-source Microsoft.Keyvault --encryption-key-vault "https://mykeyvault.vault.azure.net" --encryption-key-name "mykey"
```

{{< output >}}

Example command to enable customer managed key on a storage account:

```shell
az storage account update --name "<myStorageAccount>" --encryption-key-source Microsoft.Keyvault --encryption-key-vault "https://mykeyvault.vault.azure.net" --encryption-key-name "mykey"
```

Error message if you do not have purge protection enabled on the key vault:

{{< raw >}}
<pre style="color:lightcoral">
(KeyVaultPolicyError) Keyvault policy recoverable is not set
Code: KeyVaultPolicyError
Message: Keyvault policy recoverable is not set
</pre>
{{< /raw >}}
{{< /output >}}

{{< flash "warning" >}}
Soft enable and purge protection are mandatory for customer managed keys. A deleted key vault will continue to be charged to your Azure bill until the retention period has elapsed and the key vault is permanently deleted.
{{< /flash>}}

## Why we use Key Vault Premium for these labs

{{% shared-content "cmk/skucost" %}}
