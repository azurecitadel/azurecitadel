---
title: "What is a library?"
date: 2026-01-07
author: [ "Richard Cheney" ]
description: "Overview of the Azure landing zone Library system."
draft: false
weight: 10
menu:
  side:
    parent: slz-library
    identifier: slz-library-overview
series:
 - slz-library
---

{{% shared-content "alz/library/overview/intro" %}}

## Library structure

{{< mermaid >}}
---
title: Azure landing zone structure
---

graph TD
  M([Metadata])
  A([Architecture])
  V([Policy Default Values])

  A --> AT[Archetype]
  A --> AO(Archetype Overrides)
  AO --> AT

  AT --> PA[Policy Assignments]
  AT --> PS[Policy Set Definitions]
  AT --> PD[Policy Definitions]
  AT --> RD[Role Definitions]

{{< /mermaid >}}

Note that there can be multiple of all files. The bottom row are collectively called assets.

{{% shared-content "alz/library/overview/body" %}}

## Next

We'll look at the example BIO custom library for The Netherlands.
