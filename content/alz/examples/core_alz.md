---
title: "Azure landing zone library"
date: 2025-12-03
author: [ "Richard Cheney" ]
description: "Simple example using solely the core Azure landing zone library provided by Microsoft."
draft: false
weight: 10
menu:
  side:
    parent: alz-examples
series:
 - alz-examples
---

## Description

This is the simplest configuration. Use the core Azure landing zone with no additional custom libraries.

Note that we recommend the next example which adds a local custom override library.

## Architecture and Archetypes

The architecture name is `alz`, as defined in the [alz.alz_architecture_definition.json](https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2026.01.1/platform/alz/architecture_definitions/alz.alz_architecture_definition.json).

{{< mermaid >}}
flowchart TD
  alz["Azure landing zone
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

This is the standard set of management groups and their associated archetypes.

## Provider block

The path and ref arguments point at a semantic version release of the Microsoft maintained [platform/alz](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/alz/2026.01.1/platform/alz) library.

```ruby
provider "alz" {
  library_overwrite_enabled = true
  library_references = [
    {
      path = "platform/alz"
      ref  = "2026.01.1"
    }
  ]
}
```

Refer to the main page of [aka.ms/alz/library](https://aka.ms/alz/library) for up to date release version information.

## Metadata

Note that the [metadata](https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2026.01.1/platform/alz/alz_library_metadata.json) file for the core Azure landing zone library has no dependencies. It is the core and foundational library.

{{< code lang="json" url="<https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2026.01.1/platform/alz/alz_library_metadata.json>" >}}

## Library

The path and the ref (semantic version) in the provider block form parts of the url to the specific platform and release for the library. For example:

```text
https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/alz/2026.01.1/platform/alz
```

The [Azure landing zone library](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/alz/2026.01.1/platform/alz) contains all of the standard assets. The [README page](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/alz/2026.01.1/platform/alz/README.md) has a list of the archetypes, policy definitions, policy assignments and custom RBAC role definitions. This is useful as a reference for your low level design documentation, or a reference when overriding archetypes.

You can get here more naturally by:

- [aka.ms/alz/library](https://aka.ms/alz/library)
- navigate to `platform/alz`

By default you will see the information for the most recent release. You can also select a specific release:

- click on the main branch drop down
- switch to tags
- select the release

Note the URL in the address bar.

## Architecture file

The [alz.alz_architecture_definition.json](https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2026.01.1/platform/alz/architecture_definitions/alz.alz_architecture_definition.json) architecture definition mirrors the mermaid diagram above.

{{< details "Azure landing zone architecture" >}}
{{< code lang="json" url="<https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2026.01.1/platform/alz/architecture_definitions/alz.alz_architecture_definition.json>" >}}
{{< /details >}}

## Default policy values

Default policy values are defined in [alz_policy_default_values.json](https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2026.01.1/platform/alz/alz_policy_default_values.json).

{{< details "Policy Default Values" >}}
{{< code lang="json" url="<https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2026.01.1/platform/alz/alz_policy_default_values.json>" >}}
{{< /details >}}

These value are used for consistency across multiple policy and policy initiatives in the archetypes.
