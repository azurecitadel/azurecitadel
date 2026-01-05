---
headless: true
title: "Azure Landing Zones Library Overview - Intro"
description: "A brief overview of the Azure Landing Zones Library system architecture, components, and design principles."
---

## What is in a library?

The Azure Landing Zones **library** format is a prescribed structure containing JSON and YAML files to provide assets and controls for use by the Terraform alz provider.

The sole purpose it to define the management group structure used to govern environments and associated assets. This is known as the architecture.

The **architecture** describes the management group names and display names, plus the list of archetypes that are used at that management group scope.

The **archetypes** are collections of assets that are used at that scope point. Multiple archetypes can be used at any management group. You can also define **archetype overrides** that define a delta from the base archetype.

The **assets** are comprised of

- **policy definitions**
- **policy set definitions** (also known as policy initiatives)
- **policy assignments**
- RBAC **role definitions**

The policy assignments can assign any combination of built-in and custom policy and policy initiatives.

The **metadata** JSON file defined the library's name, display name, description, and any dependencies it has on other libraries.

Finally, the optional **policy default values** file allows the definition of policy assignment values that can be used consistently across multiple policy assignments in the library.
