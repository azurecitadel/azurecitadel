---
title: "Sovereign landing zone library with overrides"
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

This configuration stacks a local override library in `./lib` which is stacked on top of the Sovereign landing zone.

From a partner perspective this is great for defining specific archetype overrides for individual customers, and it also allows bespoke assets - e.g. custom policies or RBAC roles - to be added for that customer.

The local library contains a set of uniquely named archetypes (using override files) and a different architecture name (`slz_custom` rather than `slz`). You would specify this architecture name in the module block.

## Local override library

{{< flash >}}
Included if you need to add in a local override library first.

If not then you can skip down to [Architecture and Archetypes](#architecture-and-archetypes), or right down to [Metadata](#metadata) which is the start of the most important section.
{{< /flash >}}

### Create the default local override library

{{% shared-content "alz/local_library" %}}

### Extend the library for Sovereign landing zone

{{% shared-content "alz/local_library/add_slz" %}}

Note that the architecture file is still called alz_custom.alz_architecture_definition.yaml and the architecture name is **alz_custom**. The reason for this is that the Sovereign landing zone scenario is designed to handle brownfield scenarios.

The individual [archetype override](/slz/libraries/constructs/#archetypeoverrides) can be found in `lib/archetype_definitions`.

## Architecture and Archetypes

The architecture name is `slz_custom`, as defined in the local `slz_custom.alz_architecture_definition.yaml` that you'll find in `lib/architecture_definitions`.

{{< mermaid >}}
flowchart TD
  slz["Sovereign landing zone
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

Note the Sovereign landing zone at the top has two archetypes assigned:

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

The dependency is also semantically versioned. The first dependency is [Sovereign landing zone 2025.10.1](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/slz/2026.02.0/platform/slz), which is itself stacked on top of [Azure landing zone  2025.9.3](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/alz/2026.01.1/platform/alz).

If you need to pull in a more recent version of the Sovereign landing zone library then you would update the ref here.

See the previous page for more detail on the architecture, archetypes, and assets for the main Azure landing zone library repo.

## Module block

The architecture name is in `lib/alz_library_metadata.json`. Update the module block to match.

```ruby
module "management_groups" {
  source  = "Azure/avm-ptn-alz/azurerm"
  version = "0.20.2"
  architecture_name  = "alz_custom"
```
