---
headless: true
title: "Azure landing zone Library Overview - Intro"
description: "A brief overview of the Azure landing zone Library system architecture, components, and design principles."
---

## Introduction

The Azure landing zone **library** format is a prescribed structure containing JSON and YAML files to provide assets and controls for use by the Terraform alz provider. Understanding libraries and how they are used is vital when going beyond the defaults for governed Azure environment and when you are looking to override, modify and extend.

The sole purpose of a library is to help define the management group structure - and the associated policies and roles - used to govern environments assets.

- The **architecture** describes the management group names and display names, plus the list of archetypes that are used at that management group scope.
- **Archetypes** are collections of assets that are used at that scope point. Multiple archetypes can be used at any management group. You can also define **archetype overrides** that define a delta from the base archetype.
- **Assets** are comprised of
  - **policy definitions**
  - **policy set definitions** (also known as policy initiatives)
  - **policy assignments**
  - RBAC **role definitions**

    The policy assignments can assign any combination of built-in and custom policy and policy initiatives.

- The **metadata** JSON file defined the library's name, display name, description, and any dependencies it has on other libraries.

- Finally, the optional **policy default values** file allows the definition of policy assignment values that can be used consistently across multiple policy assignments in the library.
