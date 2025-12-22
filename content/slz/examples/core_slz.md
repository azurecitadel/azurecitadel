---
title: "Sovereign Landing Zone"
date: 2025-12-03
author: [ "Richard Cheney" ]
description: "Simple example for deploying the standard Sovereign Landing Zone."
draft: false
weight: 10
menu:
  side:
    parent: slz-examples
series:
 - slz-examples
---

## Description

The Sovereign Landing Zone (SLZ) is stacked on top of the core Azure Landing Zone (ALZ) library, and includes additional management groups and sovereign policy initiatives. Both libraries are maintained and provided by Microsoft.

Note that we recommend the next example which adds a local custom override library.

## Architecture and Archetypes

The architecture name is `slz` - as defined in the [slz.alz_architecture_definition.json](https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/slz/2025.10.1/platform/slz/architecture_definitions/slz.alz_architecture_definition.json) - and has the extended set of architectures needed for Sovereign Landing Zone.

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

## Provider block

As per the Azure Landing Zone example, the path and ref arguments point at a semantic version release of the Microsoft maintained platform/slz library.

```ruby
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

Refer to the main page of [aka.ms/alz/library](https://aka.ms/alz/library) for up to date release version information.

## Metadata

Remember that the Sovereign Landing Zone library is stacked on top of the Azure Landing Zone library.

The [metadata](https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/tags/platform/slz/2025.10.1/platform/slz/alz_library_metadata.json) file for the Sovereign Landing Zone library shows the dependency on the Azure Landing Zone library. The SLZ and ALZ releases are kept (and tested) in lockstep.

{{< code lang="json" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/tags/platform/slz/2025.10.1/platform/slz/alz_library_metadata.json>" >}}

## Library

The path and the ref (semantic version) in the provider block form parts of the url to the specific platform and release for the library. For example:

```text
https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/slz/2025.10.1/platform/slz
```

The [Sovereign Landing Zones library](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/slz/2025.10.1/platform/slz) contains the additional assets. The [README page](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/slz/2025.10.1/platform/slz/README.md) has a list of the archetypes, policy definitions, policy assignments and custom RBAC role definitions. This is useful as a reference for your low level design documentation, or a reference when overriding archetypes. Usefully it is a superset of both the Sovereign Landing Zone and Azure Landing Zone repos.

You can get here more naturally by:

- [aka.ms/alz/library](https://aka.ms/alz/library)
- navigate to `platform/slz`

By default you will see the information for the most recent release. You can also select a specific release:

- click on the main branch drop down
- switch to tags
- select the release

Note the URL in the address bar.

## Architecture file

The [slz.alz_architecture_definition.json](https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/slz/2025.10.1/platform/slz/architecture_definitions/slz.alz_architecture_definition.json) architecture definition mirrors the mermaid diagram above.

{{< details "Sovereign Landing Zones architecture" >}}
{{< code lang="json" url="<https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/slz/2025.10.1/platform/slz/architecture_definitions/slz.alz_architecture_definition.json>" >}}
{{< /details >}}

The architecture files are uniquely identified and standalone. When you specify `slz` as the architecture_name then it matches against [slz.alz_architecture_definition.json](https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/slz/2025.10.1/platform/slz/architecture_definitions/slz.alz_architecture_definition.json). If your module still specified `alz` then it would still match up against the [alz.alz_architecture_definition.json](https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2025.09.3/platform/alz/architecture_definitions/alz.alz_architecture_definition.json) in the underlying Azure Landing Zone library.

## Default policy values

Default policy values are defined in [alz_policy_default_values.json](https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/slz/2025.10.1/platform/slz/alz_policy_default_values.json).

{{< details "SLZ Policy Default Values" >}}
{{< code lang="json" url="<https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/slz/2025.10.1/platform/slz/alz_policy_default_values.json>" >}}
{{< /details >}}

These value are used for consistency across multiple policy and policy initiatives in the archetypes.

Note that you would need to check the same [alz_policy_default_values.json](https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2025.09.3/platform/alz/alz_policy_default_values.json) file for the underlying Azure Landing Zone library.

{{< details "ALZ Policy Default Values" >}}
{{< code lang="json" url="<https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2025.09.3/platform/alz/alz_policy_default_values.json>" >}}
{{< /details >}}
