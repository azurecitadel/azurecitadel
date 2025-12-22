---
title: "Sovereign Landing Zone library with overrides"
date: 2025-12-03
author: [ "Richard Cheney" ]
description: "This is the similar to the default created by the accelerator. Uses the maintained SLZ library as above, but adds a local library to allow overrides on the extended set of archetypes as well as a space to create additional assets."
draft: false
weight: 20
menu:
  side:
    parent: slz-examples
series:
 - slz-examples
highlight: true
---

## Description

This configuration stacks a local override library in `./lib` which is stacked on top of the Sovereign Landing Zone.

From a partner perspective this is great for defining specific archetype overrides for individual customers, and it also allows bespoke assets - e.g. custom policies or RBAC roles - to be added for that customer.

The local library contains a set of uniquely named archetypes (using override files) and a different architecture name (`slz_custom` rather than `slz`). You would specify this architecture name in the module block.

## Creating a local library

{{% shared-content "alz/local_library" %}}

## Extend the library for Sovereign Landing Zone

{{% shared-content "alz/local_library/add_slz" %}}

Note that the architecture file is still called alz_custom.alz_architecture_definition.yaml and the architecture name is **alz_custom**. The reason for this is that the Sovereign Landing Zone scenario is designed to handle brownfield scenarios.

## Architecture and Archetypes

The architecture name is `slz_custom`, as defined in the local `slz_custom.alz_architecture_definition.yaml` that you'll find in `lib/architecture_definitions`.

{{< mermaid >}}
flowchart TD
  slz["Sovereign Landing Zone
(root_custom, sovereign_root_custom)"]
  slz --> decommissioned
  decommissioned["Decommissioned
(decommissioned_custom)"]
  slz --> landingzones
  landingzones["Landing zones
(landing_zones_custom)"]
  landingzones --> confidential_corp
  confidential_corp["Confidential Corp
(confidential_corp_custom)"]
  landingzones --> confidential_online
  confidential_online["Confidential Online
(confidential_online_custom)"]
  landingzones --> corp
  corp["Corp
(corp_custom)"]
  landingzones --> online
  online["Online
(online_custom)"]
  landingzones --> public
  public["Public
(public_custom)"]
  slz --> platform
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
  slz --> sandbox
  sandbox["Sandbox
(sandbox_custom)"]
{{< /mermaid >}}

Note the Sovereign Landing Zone at the top has two archetypes assigned:

- root_custom
- sovereign_root_custom

and you will find override files for both in the lib's archetype_definitions folder.

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

{{< code lang="json" url="<https://raw.githubusercontent.com/Azure/alz-terraform-accelerator/refs/heads/main/templates/platform_landing_zone/examples/slz/lib/alz_library_metadata.json>" >}}

The dependency is also semantically versioned. It is dependant on <https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/slz/2025.10.1/platform/slz>, which is itself stacked on top of <https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/alz/2025.9.3/platform/alz>.

If you need to pull in a more recent version of the Sovereign Landing Zone library then you would update the ref here.

See the previous page for more detail on the architecture, archetypes, and assets for the main Azure Landing Zone library repo.

## Override files

The individual override files are in `lib/archetype_definitions`.  For example, the one for confidential_online is named `confidential_online_custom.alz_archetype_override.yaml`, and is shown below.

{{< code lang="yaml" url="<https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/refs/tags/platform/slz/2025.10.1/platform/slz/archetype_definitions/confidential_online.alz_archetype_definition.json>" >}}

These are used to define a custom delta against the base archetype. The most common is to remove unwanted policy assignments, or add one that is not part of the default archetype.

## Removing assignments

Remember that the the available archetypes and assets may now being pulled from three libraries - your custom library in (./lib), the Sovereign Landing Zone library, and the underlying Azure Landing Zones library. You can see the archetype definitions in

- <https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/slz#archetypes>
- <https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/alz#archetypes>

And don't forget to change **main** in the drop down to a specific version if not using the latest.

## Adding assignments

In the previous example we looked at adding an assignment from the main library, which you can still do.

In addition, you now you have the ability to create your own assets in the local library and adding those to existing archetypes, or create new