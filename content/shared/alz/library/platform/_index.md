---
headless: true
title: "Azure landing zone Library - Using platform libraries"
description: "Shortcuts to the main platform content and how to use them."
---

## Overview

Before we move on to shared custom libraries, let's cover the platform libraries. How do you specify them in with the alz provider, how do you add an override library, and how do you override or modify.

{{< flash "tip" >}}
This page will first show how to use the platform libraries directly, but will then quickly switch to inserting a local override library. This is the recommended approach for most customers as it provides more flexibility.
{{< /flash >}}

## Azure landing zone Library's platform libraries

These are your platform libraries. All are found in the platform folder of [Azure/Azure-Landing-Zones-Library](https://aka.ms/alz/library) and are maintained by Microsoft with semantic versioning for the [releases](https://github.com/Azure/Azure-Landing-Zones-Library/releases).

- Azure landing zone (platform/alz)
- Sovereign landing zone (platform/slz)
- Azure Monitor Baseline Alerts (platform/amba)

If you find any issues with the platform libraries then you can use the [issue tracking](https://aka.ms/alz/issues) for known issues or raise a new one.

Each platform area has a README page that includes a mermaid diagram for the architecture and a listing of all of the assets.

### Azure landing zone (alz)

The **Microsoft ALZ Library** has the core Azure landing zone definitions.

Example release: [platform/alz/2026.01.1](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/alz/2026.01.1/platform/alz)

Example alz provider block:

```ruby
provider "alz" {
  library_references = [
    {
      path = "platform/alz"
      ref  = "2026.01.1"
    }
  ]
}
```

The [platform/alz/alz_library_metadata.json](https://github.com/Azure/Azure-Landing-Zones-Library/blob/platform/alz/2026.01.1/platform/alz/alz_library_metadata.json) file has no dependencies.

{{< details "platform/alz/alz_library_metadata.json" >}}
{{< code lang="json" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/tags/platform/alz/2026.01.1/platform/alz/alz_library_metadata.json>" >}}
{{< /details >}}

### Sovereign landing zone (slz)

The **Microsoft SLZ Library** includes Sovereign landing zone extensions. This is stacked on top of Azure landing zone with additional management groups and archetypes for sovereignty scenarios.

Example release: [platform/slz/2026.02.0](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/slz/2026.02.0/platform/slz)

Example alz provider block:

```ruby
provider "alz" {
  library_references = [
    {
      path = "platform/slz"
      ref  = "2026.02.0"
    }
  ]
}
```

The [metadata file](https://github.com/Azure/Azure-Landing-Zones-Library/blob/platform/slz/2026.02.0/platform/slz/alz_library_metadata.json) has a dependency on ALZ.

{{< details "platform/slz/alz_library_metadata.json" >}}
{{< code lang="json" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/tags/platform/slz/2026.02.0/platform/slz/alz_library_metadata.json>" >}}
{{< /details >}}

### Azure Monitor Baseline Alerts (amba)

The **Microsoft AMBA Library** is an additional platform library with policies relating to [Azure Monitoring Baseline Alerts](https://aka.ms/amba). Can be used standalone or in addition to ALZ/SLZ.

Example release: [platform/amba/2026.01.1](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/amba/2026.01.1/platform/amba)

Example alz provider block:

```ruby
provider "alz" {
  library_references = [
    {
      path = "platform/amba"
      ref  = "2026.01.1"
    }
  ]
}
```

The [platform/amba/alz_library_metadata.json](https://github.com/Azure/Azure-Landing-Zones-Library/blob/platform/amba/2026.01.1/platform/amba/alz_library_metadata.json) file has no dependencies.

{{< details "platform/alz/alz_library_metadata.json" >}}
{{< code lang="json" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/tags/platform/amba/2026.01.1/platform/amba/alz_library_metadata.json>" >}}
{{< /details >}}

## Creating a local override library

Local libraries are commonly used, enabling archetype_overrides so that customers can define deltas from the default baselines in the main libraries. By convention these local library are stored in the **./lib** folder, and contain only archetype override and architecture files. However you could also add customer specific assets if they require bespoke policies or role definitions.

{{< flash >}}
This is the recommended approach even if you are not overriding anything on day one. You can extend with side loaded custom libraries using the alz provider block array, and stack on top of the alz and slz platform using the local library's metadata dependencies.
{{< /flash >}}

### Creating an ALZ local override libraries

{{% shared-content "alz/local_library" %}}

### Extend for the Sovereign landing zone

{{< flash >}}
Optional.
{{< /flash >}}

{{% shared-content "alz/local_library/add_slz" %}}

Note that the architecture file is still called **alz_custom.alz_architecture_definition.yaml** (rather than slz_custom.alz_architecture_definition.yaml) and the architecture name is **alz_custom** (rather than slz_custom). The reason for this is that the Sovereign landing zone scenario is designed to gracefully handle brownfield scenarios, uplifting existing Azure landing zone deployments to include the additional Sovereignty Landing Zone assets.

## Using a local override library

### Configure the alz provider block

Update the library references in the provider block to use a custom_url to the local `./lib` folder.

```ruby
provider "alz" {
  library_references = [
    {
      custom_url = "${path.root}/lib"
    }
  ]
}
```

### Configure the metadata dependencies

Update the dependencies in the local library's metadata file to include the required libraries.

Here is an example **lib/alz_library_metadata.json** in a local library, stacked on top the Azure landing zone library.

```json
{
  "$schema": "https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/main/schemas/library_metadata.json",
  "name": "local",
  "display_name": "ALZ Accelerator - Azure Verified Modules for SLZ Platform Landing Zone",
  "description": "This library allows overriding policies, archetypes, and management group architecture in the ALZ Accelerator.",
  "dependencies": [
    {
      "path": "platform/alz",
      "ref": "2026.01.1"
    }
  ]
}
```
