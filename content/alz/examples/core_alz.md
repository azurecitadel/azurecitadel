---
title: "Azure Landing Zone library"
date: 2025-12-03
author: [ "Richard Cheney" ]
description: "Simple example using solely the core Azure Landing Zone library provided by Microsoft."
draft: false
weight: 10
menu:
  side:
    parent: alz-examples
series:
 - alz-examples
---


{{< flash >}}
This is the simplest configuration. Use the core Azure Landing Zone with no additional custom libraries.

Note that we recommend the next example which adds a local custom override library.
{{< /flash >}}

{{< flash "warning" >}}
Need to check if adding a custom library later breaks everything...
{{< /flash >}}

### Provider block

The path and ref arguments point at a semantic version release of the Microsoft maintained platform/alz library. Refer to the main page of [aka.ms/alz/library](https://aka.ms/alz/library) for up to date release version information.

```json
provider "alz" {
  library_overwrite_enabled = true
  library_references = [
    {
      path = "platform/alz"
      ref  = "2025.09.3"
    }
  ]
}
```

{{< flash "tip" >}}
The URL path to that specific release in the library repo is <https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/alz/2025.09.3/platform/alz>.

This page has a mermaid diagram of the management group hierarchy in the architecture file, plus lists of the archetypes, policy definitions, policy assignments and custom RBAC role definitions. Useful as a reference for your low level design documentation, or a reference when overriding archetypes.
{{< /flash  >}}

### Metadata

Note that the [metadata](https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2025.09.3/platform/alz/alz_library_metadata.json) file for the core Azure Landing Zone library has no dependencies. It is the core and foundational library.

{{< code lang="json" url="<https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2025.09.3/platform/alz/alz_library_metadata.json>" >}}

### Architecture and Archetypes

The [architecture](https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2025.09.3/platform/alz/architecture_definitions/alz.alz_architecture_definition.json) name is `alz`and has the standard set of [archetypes](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/alz/2025.09.3/platform/alz/archetype_definitions).

{{< mermaid >}}
flowchart TD
  alz["Azure Landing Zones
(root)"]
  alz --> decommissioned
  decommissioned["Decommissioned
(decommissioned)"]
  alz --> landingzones
  landingzones["Landing zones
(landing_zones)"]
  landingzones --> corp
  corp["Corp
(corp)"]
  landingzones --> online
  online["Online
(online)"]
  alz --> platform
  platform["Platform
(platform)"]
  platform --> connectivity
  connectivity["Connectivity
(connectivity)"]
  platform --> identity
  identity["Identity
(identity)"]
  platform --> management
  management["Management
(management)"]
  platform --> security
  security["Security
(security)"]
  alz --> sandbox
  sandbox["Sandbox
(sandbox)"]

{{< /mermaid >}}

{{< details "Azure Landing Zones architecture" >}}

{{< code lang="json" url="<https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2025.09.3/platform/alz/architecture_definitions/alz.alz_architecture_definition.json>" >}}

{{< /details >}}

{{< details "Policy Default Values" >}}

Default policy values are used consistently across multiple policy and policy initiatives in the archetypes.

{{< code lang="json" url="<https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2025.09.3/platform/alz/alz_policy_default_values.json>" >}}
{{< /details >}}
