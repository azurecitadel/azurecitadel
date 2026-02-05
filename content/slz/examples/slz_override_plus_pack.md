---
title: "SLZ extended with a country pack"
date: 2025-12-03
author: [ "Richard Cheney" ]
description: "This is the same as the previous one, but also adds in an example side loaded custom library hosted on GitHub. "
draft: false
weight: 30
menu:
  side:
    parent: slz-examples
series:
 - slz-examples
highlight: false
---

## Description

As per the previous configuration, we have a local override library in `./lib` stacked on top of the Sovereign landing zone. It has all of the override functionality of that example.

In addition there is an example custom library hosted in GitHub. It is loosely associated with the BIO compliancy requirement in the Netherlands, but the example is constructed more to illustrate how to construct custom libraries. However, the process to insert custom libraries (from the Custom Libraries lab series) is summarised here as a useful reference.

## Local override library

{{< flash >}}
Included if you need to add in a local override library first.

If not then you can skip down to [Architecture and Archetypes](#architecture-and-archetypes), or right down to [Provider Block](#provider-block) which is the start of the most important section.
{{< /flash >}}

### Create the default local override library

{{% shared-content "alz/local_library" %}}

### Extend the library for Sovereign landing zone

{{% shared-content "alz/local_library/add_slz" %}}

Note that the architecture file is still called alz_custom.alz_architecture_definition.yaml and the architecture name is **alz_custom**. The reason for this is that the Sovereign landing zone scenario is designed to handle brownfield scenarios.

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

The provider block here is unchanged and refers to the override library in the local `lib` folder.

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

{{< flash >}}
This is where the the custom library in GitHub is side loaded to add in the additional archetypes etc. within that library. Note the two dependencies.
{{< /flash >}}

```json
{
  "$schema": "https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/main/schemas/library_metadata.json",
  "name": "local",
  "display_name": "ALZ Accelerator - Azure Verified Modules for SLZ Platform Landing Zone",
  "description": "This library allows overriding policies, archetypes, and management group architecture in the ALZ Accelerator.",
  "dependencies": [
    {
      "path": "platform/slz",
      "ref": "2026.02.0"
    },
    {
      "custom_url": "github.com/richeney-org/Sovereign-Landing-Zone-Packs//country/nl/bio?ref=2026.01.0"
    }
  ]
}
```

The first dependency is semantically versioned to [Sovereign landing zone 2025.10.1](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/slz/2026.02.0/platform/slz), which is itself stacked on top of [Azure landing zone  2025.9.3](https://github.com/Azure/Azure-Landing-Zones-Library/tree/platform/alz/2026.01.1/platform/alz).

The second dependency is the custom_url to the custom library. The url specifies the GitHub hosted custom repo, subfolder, and ref. More details in the [custom libraries](/slz/libraries/custom/) section including [go-getter url](https://github.com/hashicorp/go-getter?tab=readme-ov-file#url-format) alternatives.

## Module block

Specify the architecture name in `lib/alz_library_metadata.json` as the value to the `architecture_name` module argument.

```ruby
module "management_groups" {
  source  = "Azure/avm-ptn-alz/azurerm"
  version = "0.20.2"
  architecture_name  = "alz_custom"
```
