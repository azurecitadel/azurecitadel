---
title: "Partner Admin Link"
description: "Microsoft-managed partners can configure Partner Admin Link for recognition of their influence in customer accounts."
author: [ "Richard Cheney" ]
github: [ "richeney" ]
draft: false
menu:
  side:
    identifier: pal
aliases:
  - /partner
  - /partner/pal
  - /partneradminlink
  - /partners
  - /partners/pal
series:
  - pal
layout: series
---

## Overview

Partner Admin Link is an important mechanism for Microsoft to recognise the influence and impact that partners to bring to their customers on Azure.

At a surface level it is a simple mechanism. If you have a) have access to a customer environment, b) create a Partner Admin Link for your identity, and c) that identity has eligible RBAC role assignments, then the usage telemetry - which is always being collected for billing purposes - is also associated to your Partner ID. Here we cover the theory in more detail, and cover multiple scenarios that I have seen in my time working with - and for - Azure partners.

<!-- SERIES_PAGES -->

The pages above give you advice on multiple scenarios for how partners are given access to customer environments and how you can configure Partner Admin Link to get the right recognition.

- Need to quickly see how to configure Partner Admin Link as a user with PowerShell commands? Jump to the [user](/pal/users) page and select the PowerShell tab.
- Need to do the same for a service principal? There is a [service principal](/pal/sp) page for that too.
- What if it is a service principal with no client secret, used in a pipeline? We have example GitHub workflows for that on the [CI/CD](/pal/cicd) page, and plan to extend that for Azure DevOps and GitLab.
- Need to understand how to approach it if you are using [Azure Lighthouse](/pal/lighthouse)? That is here too, plus we have a separate area dedicated to covering [example service offer definitions](/lighthouse) that will help you configure Partner Admin Link at scale.

You may also have questions on how it works as a mechanism. The [Understanding PAL](/pal/theory) page should give you that grounding on how it all hangs together, and we will treat the [Frequently Asked Questions](/pal/faq) as a live document based on any questions we get asked and that you post on our [discussions](https://github.com/azurecitadel/azurecitadel/discussions/132) page.
