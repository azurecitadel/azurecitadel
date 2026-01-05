---
headless: true
title: "Azure Landing Zones Library Overview - Body"
description: "A brief overview of the Azure Landing Zones Library system architecture, components, and design principles."
---

## File and directory naming

The filename convention for each file type is very specific. The directory structure is not strictly forced, but is highly recommended as a standard. The link on the folder names in the tables below take you to the official documentation page for each asset type.

| Folder | Naming | YAML |
| --- | --- | :-: |
| [archetype_definitions](https://azure.github.io/Azure-Landing-Zones-Library/assets/archetypes/) | `<name>.alz_archetype_definition.json` | ✅ |
| [archetype_overrides](https://azure.github.io/Azure-Landing-Zones-Library/assets/archetype-overrides/) | `<name>.alz_archetype_override.json` | ✅ |
| [architecture_definitions](https://azure.github.io/Azure-Landing-Zones-Library/assets/architectures/) | `<name>.alz_architecture_definition.json` | ✅ |
| [policy_assignments](https://azure.github.io/Azure-Landing-Zones-Library/assets/policy-assignments/) | `<name>.alz_policy_assignment.json` | |
| [policy_definitions](https://azure.github.io/Azure-Landing-Zones-Library/assets/policy-definitions/) | `<name>.alz_policy_definition.json` | |
| [policy_set_definitions](https://azure.github.io/Azure-Landing-Zones-Library/assets/policy-set-definitions/) | `<name>.alz_policy_set_definition.json` | |
| [role_definitions](https://azure.github.io/Azure-Landing-Zones-Library/assets/role-definitions/) | `<name>.alz_role_definition.json` | ✅ |
| [default_policy_values](https://azure.github.io/Azure-Landing-Zones-Library/assets/policy-default-values)* | `alz_policy_default_values.json` | ✅ |
| [library_metadata](https://azure.github.io/Azure-Landing-Zones-Library/assets/metadata)* | `alz_library_metadata.json` | |

The last two rows have an asterisk as they are usually located in the root of the library. JSON is supported for all assets. Certain file types also support YAML with either .yaml or .tml extensions.

The contents of the files are based on the public Azure schema definitions for the policy and role files, plus the schemas in the schemas folder for the main [Azure Landing ZOne library](https://aka.ms/alz/library).

## Modularity and extensibility

The system supports multiple library sources and dependency chains, enabling organizations to build upon Microsoft baselines while adding custom requirements.

All library components follow semantic versioning principles, ensuring predictable updates and backward compatibility.

### Azure Landing Zone Library

These are your platform libraries. All are found in the platform folder of [Azure/Azure-Landing-Zones-Library](https://aka.ms/alz/library) and are maintained by Microsoft with semantic versioning for the [releases](https://github.com/Azure/Azure-Landing-Zones-Library/releases).

- **Microsoft ALZ Library**: Core Azure Landing Zone definitions

    Example release: [platform/alz/2025.09.3](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/alz/2025.09.3/platform/alz)

    ```ruby
    provider "alz" {
      library_references = [
        {
          path = "platform/alz"
          ref  = "2025.09.3"
        }
      ]
    }

    No dependencies.

- **Microsoft SLZ Library**: Sovereign Landing Zone extensions

    This is stacked on top of Azure Landing Zone with additional management groups and archetypes for sovereignty scenarios.

    Example release: [platform/slz/2025.10.1](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/slz/2025.10.1/platform/slz)

    ```ruby
    provider "alz" {
      library_references = [
        {
          path = "platform/slz"
          ref  = "2025.10.1"
        }
      ]
    }
    ```

    The [metadata file](https://github.com/Azure/Azure-Landing-Zones-Library/blob/platform/slz/2025.10.1/platform/slz/alz_library_metadata.json) has a dependency on ALZ.

- **Microsoft AMBA Library**: Azure Monitoring Baseline Alerts

    Additional platform library with policies relating to [Azure Monitoring Baseline Alerts](https://aka.ms/amba). Can be used standalone or in addition to ALZ/SLZ.

    Example release: [platform/amba/2025.11.0](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/amba/2025.11.0/platform/amba)

    ```ruby
    provider "alz" {
      library_references = [
        {
          path = "platform/amba"
          ref  = "2025.11.0"
        }
      ]
    }
    ```

    No dependencies.

### Local libraries

Local libraries are commonly used, enabling archetype_overrides so that customers can define deltas from the default baselines in the main libraries.

{{< flash >}}
This is the recommended approach even if you are not overriding anything on day one. You can extend with side loaded custom libraries using the alz provider block array, and stack on top of the alz and slz platform using the local library's metadata dependencies.
{{< /flash >}}

- **./lib**: Local override library

    Example [override library for ALZ](https://github.com/Azure/alz-terraform-accelerator/tree/refs/heads/main/templates/platform_landing_zone/lib).

    ```ruby
    provider "alz" {
      library_references = [
        {
          custom_url = "${path.root}/lib"
        }
      ]
    }
    ```

    Customer specific assets can also be included if they need bespoke policies or role definitions.

    Example **lib/alz_library_metadata.json** in a local library, stacked on top the Azure Landing Zone library.

    ```json
    {
      "$schema": "https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/main/schemas/library_metadata.json",
      "name": "local",
      "display_name": "ALZ Accelerator - Azure Verified Modules for SLZ Platform Landing Zone",
      "description": "This library allows overriding policies, archetypes, and management group architecture in the ALZ Accelerator.",
      "dependencies": [
        {
          "path": "platform/alz",
          "ref": "2025.09.3"
        }
      ]
    }
    ```

### Centralised Custom Libraries

There is no restriction on how custom libraries are used, but here are a few examples for reuse.

- **Partner Libraries**: Libraries of partner IP fo accelerating customer governance
- **Country Packs**: Sovereign requirements for specific regions

    [nl/bio/2026.01.0](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/tree/2026.01.0/country/nl/bio): My example country pack for The Netherlands' BIO compliancy.

    In this example the local metadata file is using both the slz and bio libraries.

    ```json
    {
      "$schema": "https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/main/schemas/library_metadata.json",
      "name": "local",
      "display_name": "ALZ Accelerator - Azure Verified Modules for SLZ Platform Landing Zone",
      "description": "This library allows overriding policies, archetypes, and management group architecture in the ALZ Accelerator.",
      "dependencies": [
        {
          "path": "platform/slz",
          "ref": "2025.10.1"
        },
        {
          "custom_url": "github.com/richeney-org/Sovereign-Landing-Zone-Packs//country/nl/bio?ref=2026.01.0"
        }
      ]
    }
    ```

- **Industry Packs**: Industry-specific governance patterns

## References

- <https://aka.ms/alz/library>
- <https://aka.ms/alz/library/site>
