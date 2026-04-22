---
headless: true
title: "Azure landing zone - ALZ Libraries overview"
---

## Libraries

The Azure Landing Zones (ALZ) Library is a repo structure of governance resources defined in JSON (with partial support for YAML) used by Azure landing zones to define the management group structure and the governance defined there. The library format was defined by Microsoft's Customer Architecture and Engineering (CAE) team as a standard.

There are numerous clients that use it, including Bicep and the Azure Portal, but the scope is reduced on these pages to the alz Terraform provider and the AVM modules. More on these soon.

The default repo is <https://aka.ms/alz/library> and this has a link to the core documentation. The library contains three core platform libraries:

- `platform/alz` - Core Azure landing zone
- `platform/slz` - Sovereign landing zone (dependant on platform/alz)
- `platform/amba` - Azure Monitor Baseline Alerts

These are all frequently updated and version numbers are used on each release.

A library may include the following core assets:

- **policy definitions**
- **policy set definitions**
- **policy Assignments**
- **custom RBAC role definitions**

These are then collated as named **archetypes**. The **archetype_overrides** are used to create variants of the core archetypes. The archetypes are then signed to the management group scopes defined in the **architecture**. These also define the management group hierarchy. Optionally there is a **policy default values** file used where the same parameter values can be reused and mapped to the parameter names used in multiple policy assignments. Finally there is a **metadata file** that defines the name and description and any dependencies on other libraries.

Each file in a library is defined by a schema and the alzlib Go module at the heart of all of the clients is specific about the naming convention of the files.
As mentioned, the library supports full customization, allowing you to override archetypes or modify implementations. You can also have multiple library references and dependencies, opening up the ability to have:

- Custom partner libraries
- Country and industry-specific packs to address sovereignty requirements

These labs will help to understand how to use the provided libraries, customise them, or create your own custom libraries.

{{< flash "tip" >}}

Historically you could have accused Azure landing zone of being monolithic, forcing you to choose between fully adopting the solution and falling in line with the Microsoft approach, or forging your own path and developing your own platform landing zone infrastructure as code standards including policy.

Now the combination of Azure Verified Modules and the Azure landing zone library approach allows a new level of choice, customisation, and modularity. You can leverage as much or as little of Microsoft's Azure Landing Zone as you want. And then you can extend, augmenting and override that baseline with your own IP and definitions for a true level of flexibility.

These labs are designed for partners who need to deeply understand how ALZ works — particularly those with existing landing zone IP or custom Azure Policy guardrails. I've come at this from the perspective of partners who already have their own platform landing zone assets but want to take advantage of the policy content in the ALZ library in the knowledge that will be actively updated over time.

For many partners this is the best of both worlds.

{{< /flash >}}