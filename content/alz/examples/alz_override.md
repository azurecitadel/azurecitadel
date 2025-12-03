---
title: "Azure Landing Zone library with overrides"
date: 2025-12-03
author: [ "Richard Cheney" ]
description: "This is the default created by the accelerator. Uses the core ALZ library as above, but adds a local library to allow overrides on those core archetypes as well as a space to create additional assets."
draft: false
weight: 20
menu:
  side:
    parent: alz-examples
series:
 - alz-examples
---


## Azure Landing Zone with an override library

This configuration stacks a local library on top of the Azure Landing Zone. From a partner perspective this is great for defining specific archetype overrides for individual customers, and it also allows bespoke assets - e.g. custom policies or RBAC roles - to be added for that customer.

{{< flash "tip" >}}
Not sure where to start with Azure Landing Zones? This is a recommended starting point as you can extend further from here.
{{< /flash >}}

### Provider block

The provider block here refers to the override library, in the local `lib` folder.

```ruby
provider "alz" {
  library_overwrite_enabled = true
  library_references = [
    {
      custom_url = "${path.root}/lib"
    }
  ]
}
```

{{< details "Remind me how to create a local library..." >}}
{{% shared-content "alz/local_library" %}}
{{< /details >}}

### Metadata

{{< flash >}}
The local library is "stacked" on top of the core Azure Landing Zone library. It contains a set of uniquely named archetypes (using override files) and a different architecture name (`alz_custom` rather than `alz`). You would specify this architecture name in the module block.
{{< /flash >}}


The local metadata filename is `lib/alz_library_metadata.json`.

{{< code lang="json" url="<https://github.com/Azure/alz-terraform-accelerator/raw/refs/heads/main/templates/platform_landing_zone/lib/alz_library_metadata.json>" >}}

The dependency is also semantically versioned. In this case it is again dependant on <https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/alz/2025.09.3/platform/alz>.

### Architecture and Archetypes

The local architecture file is `lib/architecture_definitions/alz_custom.alz_architecture_definition.yaml`. The architecture name is `alz_custom`and refers to the uniquely name custom override archetypes.

{{< mermaid >}}
flowchart TD
  alz["Azure Landing Zones
(root)"]
  alz --> decommissioned
  decommissioned["Decommissioned
(decommissioned_custom)"]
  alz --> landingzones
  landingzones["Landing zones
(landing_zones_custom)"]
  landingzones --> corp
  corp["Corp
(corp_custom)"]
  landingzones --> online
  online["Online
(online_custom)"]
  alz --> platform
  platform["Platform
(platform_custom)"]
  platform --> connectivity
  connectivity["Connectivity
(connectivity_custom)"]
  platform --> identity
  identity["Identity
(identity_custom)"]
  platform --> management
  management["Management
(management_custom)"]
  platform --> security
  security["Security
(security_custom)"]
  alz --> sandbox
  sandbox["Sandbox
(sandbox_custom)"]

{{< /mermaid >}}

Note that each archetype shortcode is now, for example, **corp_custom** rather than **corp**. This relates to the corresponding files in the `lib/archetype_definitions` folder, e.g. `corp_custom.alz_archetype_override.yaml`.

{{< details "Azure Landing Zones architecture" >}}

{{< code lang="json" url="<https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2025.09.3/platform/alz/architecture_definitions/alz.alz_architecture_definition.json>" >}}

{{< /details >}}

{{< details "Policy Default Values" >}}

Default policy values are used consistently across multiple policy and policy initiatives in the archetypes.

{{< code lang="json" url="<https://github.com/Azure/Azure-Landing-Zones-Library/raw/refs/tags/platform/alz/2025.09.3/platform/alz/alz_policy_default_values.json>" >}}
{{< /details >}}
