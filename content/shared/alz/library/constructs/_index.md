---
headless: true
title: "Azure Landing Zones Library - Constructs"
description: "There are three library constructs - archetypes, archetype overrides and infrastructure. See how they relate to each other."
---

## Overview

The assets on the previous page - policy definitions, policy set definitions, role definitions, and policy assignments - will all be familiar to those working with governance on Azure and use the standard definition and assignment schemas for those resources.

The three constructs covered on this page are specific to the Azure Landing Zone library format, and control how those assets are used by the alz provider and by clients such as the Bicep and Terraform modules for management groups.

Those three constructs are:

- **Archetypes**: Foundational building blocks that group together related policy and policy set definitions, policy assignments, and role definitions.
- **Archetype overrides**: These define new archetypes as a delta from a base archetype definition.
- **Architecture**: Define a management group hierarchy and the array of archetypes

## Archetypes

The assets in a library don't do anything unless they are grouped into archetypes and used within an architecture definition.

| | |
| --- | --- |
| Folder | **archetype_definitions** |
| Filename | **\<name>.alz_archetype_definition.json** |
| Formats | JSON or YAML |
| Examples | [Azure Landing Zone archetypes](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/alz/archetype_definitions) |
| | [Sovereign Landing Zone archetypes](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/slz/archetype_definitions) |
| | [Example Sovereign Landing Zone country pack](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/tree/main/country/nl/bio/archetype_definitions) |
| Documentation | [Archetype Definitions](https://azure.github.io/Azure-Landing-Zones-Library/assets/archetypes) |

{{< details "Archetype Definition schema" >}}
[Azure/Azure-Landing-Zones-Library/schemas/archetype_definition.json](https://github.com/Azure/Azure-Landing-Zones-Library/blob/main/schemas/archetype_definition.json)
{{< code lang="json" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/heads/main/schemas/archetype_definition.json>" >}}
{{< /details  >}}

### Archetype example: [nl_root](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/blob/2026.01.0/country/nl/bio/archetype_definitions/nl_root.alz_archetype_definition.json)

{{< code lang="json" url="<https://raw.githubusercontent.com/richeney-org/Sovereign-Landing-Zone-Packs/refs/tags/2026.01.0/country/nl/bio/archetype_definitions/nl_root.alz_archetype_definition.json>" >}}

{{< flash >}}

- The archetype name in the file - **nl_root** - may be used in an architecture definition.
- As with all entities in a library, the name must be unique.
- The archetype name usually indicates the intended management group, but this is merely convention.
- Definitions - for policy, policy sets and roles - are commonly defined at the root so that they can be used throughout the management group hierarchy.
- Each array uses the names for the assets as described on the previous page.
{{< /flash >}}

## Archetype Overrides

Archetype overrides define a delta against a base archetype, which add significant flexibility. Overrides are not intended for use in centralised libraries - they are more commonly used in local libraries so that end customers can add or remove from archetypes.

| | |
| --- | --- |
| Folder | **archetype_definitions** |
| Filename | **\<name>.alz_archetype_override.json** |
| Formats | JSON or YAML |
| Examples | [Azure Landing Zone Accelerator's local lib template](https://github.com/Azure/alz-terraform-accelerator/tree/main/templates/platform_landing_zone/lib/archetype_definitions) |
| | [Sovereign Landing Zone Accelerator's local lib template delta](https://github.com/Azure/alz-terraform-accelerator/tree/main/templates/platform_landing_zone/examples/slz/lib/archetype_definitions) |
| Documentation | [Archetype Overrides](https://azure.github.io/Azure-Landing-Zones-Library/assets/archetype-overrides/) |

{{< details "Archetype Override schema" >}}
[Azure/Azure-Landing-Zones-Library/schemas/archetype_override.json](https://github.com/Azure/Azure-Landing-Zones-Library/blob/main/schemas/archetype_override.json)
{{< code lang="json" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/heads/main/schemas/archetype_override.json>" >}}
{{< /details  >}}

### Override example: [corp_custom](https://github.com/Azure/alz-terraform-accelerator/blob/main/templates/platform_landing_zone/lib/archetype_definitions/corp_custom.alz_archetype_override.yaml)

This is the default override file created by the accelerator in the local library for the corp archetype.

{{< code lang="yaml" url="<https://raw.githubusercontent.com/Azure/alz-terraform-accelerator/refs/heads/main/templates/platform_landing_zone/lib/archetype_definitions/corp_custom.alz_archetype_override.yaml>" >}}

{{< flash >}}

- The base_archetype here is **corp** and the name is **corp_custom**.
- Remember, all names in a library must be unique per type.
- You would use the **corp_custom** name in the architecture definition.
- You can add or remove assets from the baseline.
- The  example would remove **Deploy-Private-DNS-Zones** from the [corp archetype](https://github.com/Azure/Azure-Landing-Zones-Library/blob/main/platform/alz/archetype_definitions/corp.alz_archetype_definition.json).
{{< /flash >}}

## Architecture Definitions

The architecture definitions finally bring everything together, defining the management group hierarchy, the IDs and displayNames, and the array of archetypes to be used at each scope point.

| | |
| --- | --- |
| Folder | **architecture_definitions** |
| Filename | **\<name>.alz_architecture_definition.json** |
| Formats | JSON or YAML |
| Examples | [Azure Landing Zone architecture](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/alz/architecture_definitions) |
| | [Sovereign Landing Zone architecture](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/slz/architecture_definitions) |
| | [Example Sovereign Landing Zone country pack](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/tree/main/country/nl/bio/architecture_definitions) |
| Documentation | [Architectures](https://azure.github.io/Azure-Landing-Zones-Library/assets/architectures/) |

{{< details "Architecture Definition schema" >}}
[Azure/Azure-Landing-Zones-Library/schemas/architecture_definition.json](https://github.com/Azure/Azure-Landing-Zones-Library/blob/main/schemas/architecture_definition.json)
{{< code lang="json" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/heads/main/schemas/architecture_definition.json>" >}}
{{< /details  >}}

### Architecture example #1: [alz](https://github.com/Azure/Azure-Landing-Zones-Library/blob/main/platform/alz/architecture_definitions/alz.alz_architecture_definition.json)

This is the default architecture file used in the main Azure Landing Zone platform library.

{{< code lang="yaml" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/heads/main/platform/alz/architecture_definitions/alz.alz_architecture_definition.json>" >}}

{{< flash >}}

- The architecture name here is **alz**, must be unique, and is used as the value of the architecture_name in the [avm-ptn-alz Terraform module](https://registry.terraform.io/modules/Azure/avm-ptn-alz/azurerm/latest/examples/default).
- There is usually a maximum of one architecture file in a library.
- The **exists** boolean is used to determine whether the management group needs to be created, or if it should already exist and therefore the creation steps should be skipped.
{{< /flash >}}

### Architecture example #2: [alz_custom](https://github.com/Azure/alz-terraform-accelerator/blob/main/templates/platform_landing_zone/lib/architecture_definitions/alz_custom.alz_architecture_definition.yaml)

This is the architecture file used in the local library.

{{< details "alz_custom" >}}
{{< code lang="yaml" url="<https://raw.githubusercontent.com/Azure/alz-terraform-accelerator/refs/heads/main/templates/platform_landing_zone/lib/architecture_definitions/alz_custom.alz_architecture_definition.yaml>" >}}
{{< /details >}}

{{< flash >}}

- The architecture name here is **alz_custom**, so the value of the architecture_name in the [avm-ptn-alz Terraform module](https://registry.terraform.io/modules/Azure/avm-ptn-alz/azurerm/latest/examples/default) call would need to be updated.
- The management group hierarchy itself is unchanged.
- The only difference is the archetype names which reflect the override archetype names, e.g. **corp_custom** rather than **corp**.
{{< /flash >}}

### Architecture example #3: [alz_custom + slz](https://github.com/Azure/alz-terraform-accelerator/blob/main/templates/platform_landing_zone/examples/slz/lib/architecture_definitions/alz_custom.alz_architecture_definition.yaml)

This is the same architecture file in the local library after it has been updated with the additional Sovereign Landing Zone archetypes and management groups.

{{< details "alz_custom with slz" >}}
{{< code lang="yaml" url="<https://raw.githubusercontent.com/Azure/alz-terraform-accelerator/refs/heads/main/templates/platform_landing_zone/examples/slz/lib/architecture_definitions/alz_custom.alz_architecture_definition.yaml>" >}}
{{< /details >}}

{{< flash >}}

- Note that the update steps do not change the file name or architecture name.
- The value of the architecture_name in the [avm-ptn-alz Terraform module](https://registry.terraform.io/modules/Azure/avm-ptn-alz/azurerm/latest/examples/default) stays as **alz_custom** to limit the `terraform plan` diff.
- The management group hierarchy is extended with Public, Confidential Corp, and Confidential Online.
- The new archetypes are associated to those new management group scopes.
- The root (`alz`) management group includes both the **root_custom** and **sovereign_root_custom** archetypes.
{{< /flash >}}

### Architecture example #4: [nl_slz_custom](https://github.com/Azure/alz-terraform-accelerator/blob/main/templates/platform_landing_zone/examples/slz/lib/architecture_definitions/alz_custom.alz_architecture_definition.yaml)

This final version includes the is the same architecture file in the local library after it has been updated with the additional Sovereign Landing Zone archetypes and management groups.

{{< details "alz_custom with slz" >}}
{{< code lang="yaml" url="<https://raw.githubusercontent.com/Azure/alz-terraform-accelerator/refs/heads/main/templates/platform_landing_zone/examples/slz/lib/architecture_definitions/alz_custom.alz_architecture_definition.yaml>" >}}
{{< /details >}}

{{< flash >}}

- Note that the update steps do not change the file name or architecture name.
- The value of the architecture_name in the [avm-ptn-alz Terraform module](https://registry.terraform.io/modules/Azure/avm-ptn-alz/azurerm/latest/examples/default) stays as **alz_custom** to limit the `terraform plan` diff.
- The management group hierarchy is extended with Public, Confidential Corp, and Confidential Online.
- The new archetypes are associated to those new management group scopes.
- The root (`alz`) management group includes both the **root_custom** and **sovereign_root_custom** archetypes.
{{< /flash >}}
