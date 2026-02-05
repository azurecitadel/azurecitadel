---
headless: true
title: "Azure landing zone Library - Policies and Roles"
description: "Documentation for Azure Policy definitions, initiatives, assignments, and custom role definitions within the Azure landing zone Library."
---

## Introduction

The core assets in a library are the definitions and assignments for Azure Policy, and the custom role definitions for RBAC. These will be grouped together into archetypes on the next page, but let's explore these first.

For each asset type we will describe the recommended folder name, the required naming convention, the supported file formats and link through to the Azure landing zone libraries set of assets as a reference point.

You will also find one or more examples based on a mix of the platform libraries (Azure landing zone, Sovereign landing zone and Azure Monitoring Baseline Alerts) and an example Sovereign landing zone country pack.

Each asset type on this page will also include example Bash and PowerShell commands to individually test the asset.

## Policy Definitions

Each file contains a full definition for a custom policy.

| | |
| --- | --- |
| Folder | **policy_definitions** |
| Filename | **\<name>.alz_policy_definition.json** |
| Formats | JSON only |
| Examples | [Azure landing zone policy definitions](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/alz/policy_definitions) |
| | [Example Sovereign landing zone country pack](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/tree/main/country/nl/bio/policy_definitions) |
| Documentation | [Policy Definitions](https://azure.github.io/Azure-Landing-Zones-Library/assets/policy-definitions) |

### Policy: [Enforce-KV-Premium](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/blob/2026.01.0/country/nl/bio/policy_definitions/Enforce-KV-Premium.alz_policy_definition.json)

{{< code lang="json" url="<https://raw.githubusercontent.com/richeney-org/Sovereign-Landing-Zone-Packs/refs/tags/2026.01.0/country/nl/bio/policy_definitions/Enforce-KV-Premium.alz_policy_definition.json>" >}}

{{< flash >}}

- The name in the file - **Enforce-KV-Premium** - will be used in the archetype definition.
- The metadata is recommended for tracing the source of definitions and for visibility in the portal.
- This custom policy definition is based on one of the [Azure/Community-Policy repo](https://github.com/Azure/Community-Policy)'s Key Vault samples, [enforce-key-vault-premium-sku](https://github.com/Azure/Community-Policy/tree/main/policyDefinitions/Key%20Vault/enforce-key-vault-premium-sku).
{{< /flash >}}

## Policy Set Definitions

Collections of related policy definitions that are grouped together for simplified management and assignment. Also called Policy Initiatives. The policy definitions referenced by the policy set definition may either be built-in definitions or custom.

| | |
| --- | --- |
| Folder | **policy_set_definitions** |
| Filename | **\<name>.alz_policy_set_definition.json** |
| Formats | JSON only |
| Examples | [Azure landing zone policy set definitions](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/alz/policy_set_definitions) |
| | [Example Sovereign landing zone country pack](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/tree/main/country/nl/bio/policy_set_definitions) |
| Documentation | [Policy Set Definitions](https://azure.github.io/Azure-Landing-Zones-Library/assets/policy-set-definitions) |

### Policy Set #1: [Deny-NL-Global](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/blob/2026.01.0/country/nl/bio/policy_set_definitions/Deny-NL-Global.alz_policy_set_definition.json)

{{< code lang="json" url="<https://raw.githubusercontent.com/richeney-org/Sovereign-Landing-Zone-Packs/refs/tags/2026.01.0/country/nl/bio/policy_set_definitions/Deny-NL-Global.alz_policy_set_definition.json>" >}}

{{< flash >}}

- The name in the file - **Deny-NL-Global** - will be used in the archetype definition.
- This is an example of a policy set with only a single built-in policy, AllowedLocations.
- A benefit of assigning policy sets is that they can be easily expanded without creating additional clutter.
- It is common to have restrictive defaults, e.g. the empty list for allowed location.
{{< /flash >}}

### Policy Set #2: [Deny-NL-Confidential](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/blob/2026.01.0/country/nl/bio/policy_set_definitions/Deny-NL-Confidential.alz_policy_set_definition.json)

{{< code lang="json" url="<https://raw.githubusercontent.com/richeney-org/Sovereign-Landing-Zone-Packs/refs/tags/2026.01.0/country/nl/bio/policy_set_definitions/Deny-NL-Confidential.alz_policy_set_definition.json>" >}}

{{< flash >}}

- The name in the file - **Deny-NL-Confidential** - will be used in the archetype definition.
- This file includes built-in and custom so that you can compare the **policyDefinitionId**s.
- The first policy, AllowedVirtualMachineSKUs, is built in.
- The second policy, KeyVaultShouldUsePremiumSKU, is the custom policy above.
- The policyDefinitionId for the custom policy includes "placeholder".
- This will automatically be replaced with the correct management group name by the alz provider.
{{< /flash >}}

## Policy Assignments

Policy Assignments for both policy definitions and policy set definitions. It is more common to assign policy sets as this is a more manageable and scalable approach. The policy and policy set definitions can either be built-in definitions, or the custom definitions shown above.

| | |
| --- | --- |
| Folder | **policy_assignments** |
| Filename | **\<name>.alz_policy_assignment.json** |
| Formats | JSON only |
| Examples | [Azure landing zone policy assignments](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/alz/policy_assignments) |
| | [Sovereign landing zone policy assignments](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/slz/policy_assignments) |
| | [Example Sovereign landing zone country pack](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/tree/main/country/nl/bio/policy_assignments) |
| Documentation | [Policy Assignments](https://azure.github.io/Azure-Landing-Zones-Library/assets/policy-assignments) |

### Assignment #1: [Audit-NL-BIO](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/blob/2026.01.0/country/nl/bio/policy_assignments/Audit-NL-BIO.alz_policy_assignment.json)

{{< code lang="json" url="<https://raw.githubusercontent.com/richeney-org/Sovereign-Landing-Zone-Packs/refs/tags/2026.01.0/country/nl/bio/policy_assignments/Audit-NL-BIO.alz_policy_assignment.json>" >}}

{{< flash >}}

- The name in the file - **Audit-NL-BIO** - will be used in the archetype definition.
- It is common to use the effect as the first part of the naming.
- This assigns a built-in policy initiative. You can browse definitions using the [Azure Portal](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyMenuBlade.MenuView/~/Definitions) or [AzAdvertizer](https://aka.ms/azadvertizer).
{{< /flash >}}

### Assignment #2: [Deny-NL-Global](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/blob/2026.01.0/country/nl/bio/policy_assignments/Deny-NL-Global.alz_policy_assignment.json)

{{< code lang="json" url="<https://raw.githubusercontent.com/richeney-org/Sovereign-Landing-Zone-Packs/refs/tags/2026.01.0/country/nl/bio/policy_assignments/Audit-NL-BIO.alz_policy_assignment.json>" >}}

{{< flash >}}

- The name in the file - **Deny-NL-Global** - will be used in the archetype definition.
- This uses the first custom policy set definition above and illustrates the differences.
- The **policyDefinitionID** and **scope** fields both use "placeholder".
- The placeholder text may be different. You will see examples with "contoso" instead. The alz provider replaces the text based on field position.
- Note the parameter value is set to West Europe and West Europe. This may be overridden as we will see later.
{{< /flash >}}

## Custom Role Definitions

It is also possible to include custom role definitions. Here is one included in the main Azure landing zone Library.

| | |
| --- | --- |
| Folder | **role_definitions** |
| Filename | **\<name>.alz_policy_definition.json** |
| Formats | JSON only |
| Examples | [Azure landing zone policy definitions](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/alz/role_definitions) |
| Documentation | [Role Definitions](https://azure.github.io/Azure-Landing-Zones-Library/assets/role-definitions) |

### Role: [Network-Subnet-Contributor](https://github.com/Azure/Azure-Landing-Zones-Library/blob/main/platform/alz/role_definitions/Network-Subnet-Contributor.alz_role_definition.json)

{{< code lang="json" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/heads/main/platform/alz/role_definitions/Network-Subnet-Contributor.alz_role_definition.json>" >}}

{{< flash >}}

- The roleName in the file - **Network-Subnet-Contributor** - is used in the [root archetype definition](https://github.com/Azure/Azure-Landing-Zones-Library/blob/26d00cddb86f7e9b0e0cba293329dd285eee166a/platform/alz/archetype_definitions/root.alz_archetype_definition.json#L235).
- The name must be a GUID, e.g. from `uuidgen` or `[System.Guid]::NewGuid().ToString()`.
- The assignableScopes should be a single array element, `"${current_scope_resource_id}"`.
{{< /flash >}}
