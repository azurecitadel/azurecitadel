---
title: "Sovereign Landing Zone"
date: 2025-12-03
author: [ "Richard Cheney" ]
description: "Simple example for deploying the standard Sovereign Landing Zone."
draft: false
weight: 10
menu:
  side:
    parent: alz-examples
series:
 - alz-examples
---


{{< flash >}}
The Sovereign Landing Zone (SLZ) is stacked on top of the core Azure Landing Zone (ALZ) library, and includes additional management groups and sovereign policy initiatives. Both libraries are maintained and provided by Microsoft.

Note that we recommend the next example which adds a local custom override library.
{{< /flash >}}

{{< flash "warning" >}}
Need to check if adding a custom library later breaks everything...
{{< /flash >}}

### Provider block

The path and ref arguments point at a semantic version release of the Microsoft maintained platform/alz library. Refer to the main page of [aka.ms/alz/library](https://aka.ms/alz/library) for up to date release version information.

```terraform
provider "alz" {
  library_overwrite_enabled = true
  library_references = [
    {
      path = "platform/slz"
      ref  = "2025.10.1"
    }
  ]
}
```

{{< flash "tip" >}}
The URL path to that specific release in the library repo is <https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/slz/2025.10.1/platform/slz>.

This page has a mermaid diagram of the management group hierarchy in the architecture file, plus lists of the archetypes, policy definitions, policy assignments and custom RBAC role definitions. Useful as a reference for your low level design documentation, or a reference when overriding archetypes.

Note that the readme contains a superset of both the ALZ and SLZ assets.
{{< /flash  >}}

### Metadata

Note that the [metadata](https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/tags/platform/slz/2025.10.1/platform/slz/alz_library_metadata.json) file for the Sovereign Landing Zone library shows the dependency on the Azure Landing Zone library it has been tested against. The SLZ and ALZ releases are kept in lockstep.

{{< code lang="json" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/tags/platform/slz/2025.10.1/platform/slz/alz_library_metadata.json>" >}}

### Architecture and Archetypes

The [architecture](https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/slz/2025.10.1/platform/slz/architecture_definitions/slz.alz_architecture_definition.json) name is `slz`and has the extended set of [archetypes](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/alz/2025.09.3/platform/slz/archetype_definitions).

{{< mermaid >}}
flowchart TD
  slz["Sovereign Landing Zone
(root, sovereign_root)"]
  slz --> decommissioned
  decommissioned["Decommissioned
(decommissioned)"]
  slz --> landingzones
  landingzones["Landing zones
(landing_zones)"]
  landingzones --> confidential_corp
  confidential_corp["Confidential Corp
(confidential_corp)"]
  landingzones --> confidential_online
  confidential_online["Confidential Online
(confidential_online)"]
  landingzones --> corp
  corp["Corp
(corp)"]
  landingzones --> online
  online["Online
(online)"]
  landingzones --> public
  public["Public
(public)"]
  slz --> platform
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
  slz --> sandbox
  sandbox["Sandbox
(sandbox)"]
{{< /mermaid >}}

Note:

- the additional management groups (and corresponding archetypes) under landing_zones for
  - confidential_corp
  - confidential_online
  - public
- the additional sovereign_root archetype at the top

{{< details "Azure Landing Zones architecture" >}}

From <https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/slz/2025.10.1/platform/slz/architecture_definitions/slz.alz_architecture_definition.json>.

{{< code lang="json" url="<https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/slz/2025.10.1/platform/slz/architecture_definitions/slz.alz_architecture_definition.json>" >}}

{{< /details >}}

{{< details "Policy Default Values" >}}

Default policy values are used consistently across multiple policy and policy initiatives in the archetypes.

From <https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/slz/2025.10.1/platform/slz/alz_policy_default_values.json>.
{{< code lang="json" url="<https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/slz/2025.10.1/platform/slz/alz_policy_default_values.json>" >}}
{{< /details >}}
