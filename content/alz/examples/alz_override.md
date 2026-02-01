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
highlight: true
---


## Description

This configuration stacks a local override library in `./lib` which is stacked on top of the Azure Landing Zone.

From a partner perspective this is great for defining specific archetype overrides for individual customers, and it also allows bespoke assets - e.g. custom policies or RBAC roles - to be added for that customer.

The local library contains a set of uniquely named archetypes (using override files) and a different architecture name (`alz_custom` rather than `alz`). You would specify this architecture name in the module block.

## Creating a local library

{{% shared-content "alz/local_library" %}}

## Architecture and Archetypes

The architecture name is `alz_custom`, as defined in the local `alz_custom.alz_architecture_definition.yaml` that you'll find in `lib/architecture_definitions`.

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

Note that the architecture refers to the uniquely named custom override archetypes. Each archetype shortcode is now, for example, **corp_custom** rather than **corp**. This relates to the corresponding files in the `lib/archetype_definitions` folder, e.g. `corp_custom.alz_archetype_override.yaml`.

## Provider block

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

## Metadata

The local metadata filename is `lib/alz_library_metadata.json`.

{{< code lang="json" url="<https://github.com/Azure/alz-terraform-accelerator/raw/refs/heads/main/templates/platform_landing_zone/lib/alz_library_metadata.json>" >}}

The dependency is also semantically versioned. In this case it is again dependant on <https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/alz/2026.01.0/platform/alz>.

If you need to pull in a more recent version of the Azure Landing Zone library then you would update the ref here.

See the previous page for more detail on the architecture, archetypes, and assets for the main Azure Landing Zone library repo.

## Override files

The individual override files are in `lib/archetype_definitions`.  For example, the one for corp is named `corp_custom.alz_archetype_override.yaml`, and is shown below.

{{< code lang="yaml" url="<https://raw.githubusercontent.com/Azure/alz-terraform-accelerator/refs/heads/main/templates/platform_landing_zone/lib/archetype_definitions/corp_custom.alz_archetype_override.yaml>" >}}

These are used to define a custom delta against the base archetype. The most common is to remove unwanted policy assignments, or add one that is not part of the default archetype.

## Removing assignments

Remember that the [Azure Landing Zone library](https://aka.ms/alz/library) details the available archetypes and assets when you go to `platform/alz`, and you can select the tag for specific versions.

The base archetype specified in the example override file is `corp`. You'll find the `corp.alz_archetype_definition.json` file in the `archetype_definitions` folder. Here it is.

{{< code lang="json" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/tags/platform/alz/2026.01.0/platform/alz/archetype_definitions/corp.alz_archetype_definition.json>" >}}

## Adding assignments

Return back to the [platform/alz](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/alz) folder, then you can browse the policy_assignments. The naming convention includes the name before the first full stop or period.

For example, the name for the `Enforce-TLS-SSL-Q225.alz_policy_assignment.json` policy would be `Enforce-TLS-SSL-Q225`. You could add this to the override if you wanted to assign that policy initiative to enforce encryption in flight for a set of services.
