---
headless: true
title: "Azure Landing Zones Library - Metadata"
description: "Documentation for the metadata and default policy values files."
---

## Overview

The previous pages covered the core Azure assets in the library, and the various contructs - archetypes, overrides and architectures - that are used to collate those and use against a management group structure designed for governance.

This page will cover the remaining files in the library which are located in the root of the library structure:

- **alz_library_metadata.json**: Metadata for library management - name, description, path and any dependencies on other libraries.
- **alz_policy_defaults_values.json**: Enables a map of values to be defined and used across multiple policy assignments.

## Metadata

There needs to be a single metadata file per library.

| | |
| --- | --- |
| Folder | |
| Filename | **alz_library_metadata.json** |
| Formats | JSON only |
| Examples | [Azure Landing Zone library](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/alz) |
| | [Sovereign Landing Zone library](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/slz) |
| | [Example Sovereign Landing Zone country pack](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/tree/main/country/nl/bio) |
| Documentation | [Metadata](https://azure.github.io/Azure-Landing-Zones-Library/assets/metadata) |

{{< details "Metadata schema" >}}
[Azure/Azure-Landing-Zones-Library/blob/main/schemas/library_metadata.json](https://github.com/Azure/Azure-Landing-Zones-Library/blob/main/schemas/library_metadata.json)
{{< code lang="json" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/heads/main/schemas/library_metadata.json>" >}}
{{< /details  >}}

### Metadata example #1: [alz](https://github.com/Azure/Azure-Landing-Zones-Library/blob/main/platform/alz/alz_library_metadata.json)

This is the default metadata file for Azure Landing Zone.

{{< code lang="yaml" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/heads/main/platform/alz/alz_library_metadata.json>" >}}

{{< flash >}}

- The path in the repo is `platform/alz`
- There are no dependencies.
{{< /flash >}}

### Metadata example #2: [alz_custom](https://github.com/Azure/alz-terraform-accelerator/blob/main/templates/platform_landing_zone/lib/alz_library_metadata.json)

This is the default metadata file for a local library in `./lib` when stacked on top of the main Azure Landing Zone library.

{{< code lang="yaml" url="<https://raw.githubusercontent.com/Azure/alz-terraform-accelerator/refs/heads/main/templates/platform_landing_zone/lib/alz_library_metadata.json>" >}}

{{< flash >}}

- There is a dependency on the `platform/alz/2025.09.3` release.
{{< /flash >}}

### Metadata example #3: [slz](https://github.com/Azure/Azure-Landing-Zones-Library/blob/main/platform/slz/alz_library_metadata.json)

This is the default metadata file for Sovereign Landing Zone. This library is essentially a custom platform library stacked on top of the main Azure Landing Zone Library.

{{< code lang="yaml" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/heads/main/platform/slz/alz_library_metadata.json>" >}}

{{< flash >}}

- The path in the repo is `platform/slz`
- The Sovereign Landing Zone library is dependent on the `platform/alz/2025.09.3` release.
{{< /flash >}}

### Metadata example #4: [slz_custom](https://raw.githubusercontent.com/Azure/alz-terraform-accelerator/refs/heads/main/templates/platform_landing_zone/examples/slz/lib/alz_library_metadata.json)

This is the default metadata file for the local library in `./lib` when stacked on top of the Sovereign Landing Zone library.

{{< code lang="yaml" url="<https://raw.githubusercontent.com/Azure/alz-terraform-accelerator/refs/heads/main/templates/platform_landing_zone/examples/slz/lib/alz_library_metadata.json>" >}}

{{< flash >}}

- There is a dependency on the `platform/slz/2025.10.1` Sovereign Landing Zone library release.
- Remember that this is the one above, and therefore the dependency is recursively chained.
- The full dependency chain is therefore `./lib` > `platform/slz/2025.10.1` > `platform/alz/2025.09.3`.
{{< /flash >}}

## Policy Default Values

There can be an optional Policy Default Values file per library.

| | |
| --- | --- |
| Folder | |
| Filename | **alz_policy_default_values.json** |
| Formats | JSON or YAML |
| Examples | [Azure Landing Zone library](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/alz) |
| | [Sovereign Landing Zone library](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/slz) |
| | [Example Sovereign Landing Zone country pack](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/tree/main/country/nl/bio) |
| Documentation | [Policy Assignment Default Values](https://azure.github.io/Azure-Landing-Zones-Library/assets/policy-default-values) |

{{< details "Default Policy Values schema" >}}
[Azure/Azure-Landing-Zones-Library/blob/main/schemas/default_policy_values.json](https://github.com/Azure/Azure-Landing-Zones-Library/blob/main/schemas/default_policy_values.json)
{{< code lang="json" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/heads/main/schemas/default_policy_values.json>" >}}
{{< /details  >}}

### Metadata example #1: [slz](https://github.com/Azure/Azure-Landing-Zones-Library/blob/main/platform/slz/alz_policy_default_values.json)

This is the default_policy_values file for the Sovereign Landing Zone.

{{< code lang="yaml" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/heads/main/platform/slz/alz_policy_default_values.json>" >}}

{{< flash >}}

- The allowed_locations can be defined in the module's [policy_default_values](https://github.com/richeney-org/alz-mgmt/blob/398445a0688218096cf80c3a134493749d0b9af0/main.tf#L123) map
- It will be be consistently applied to multiple policy assignments.
- Additional policy_default_values are pulled through from the dependencies, i.e. [alz's alz_policy_default_values.json](https://github.com/Azure/Azure-Landing-Zones-Library/blob/main/platform/alz/alz_policy_default_values.json).
{{< /flash >}}

### Metadata example #2: [nl_slz](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/blob/main/country/nl/bio/alz_policy_default_values.json)

This is the default metadata file for the Sovereign Landing Zone.

{{< code lang="yaml" url="<https://raw.githubusercontent.com/richeney-org/Sovereign-Landing-Zone-Packs/refs/heads/main/country/nl/bio/alz_policy_default_values.json>" >}}

{{< flash >}}

- The alz provider defines the defaults using the default_name as the key for a map.
- If a duplicate is found then the last occurrence wins.
- Here the local library's [metadata](https://github.com/richeney-org/alz-mgmt/blob/main/lib/alz_library_metadata.json) has dependencies on both the slz and the example nl_bio country pack.
- The nl_bio definition is the last occurrence as it is later in the array.
- The same applies to library definitions overwriting those in the dependent arrays.
{{< /flash >}}
