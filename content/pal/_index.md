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
---

## Overview

Partner Admin Link is an important mechanism for Microsoft to recognise the influence and impact that partners to bring to their customers on Azure.

At one level it is fairly simple. If you have access to a customer environment as part of your managed service delivery then creating a Partner Admin Link associates the usage telemetry - which is always being collected for billing purposes - with the Partner ID. It is based on the RBAC role assignments for that access so that the partner gains recognition for the specific resources. Configuration for a user is quick and simple and doesn't require any involvement from the customer.

However, there are several scenarios for how partners access customer environments and this set of guidance aims to help you get to those configurations quickly.

- Need to quickly see how to configure Partner Admin Link as a user with PowerShell commands? Jump to the [user](/pal/users) page and select the PowerShell tab.
- Need to do the same for a service principal? There is a [service principal](/pal/sp) page for that too.
- What if it is a service principal with no client secret, used in a pipeline? We have example GitHub workflows for that on the [CI/CD](/pal/cicd) page, and plan to extend that for Azure DevOps and GitLab.
- Need to understand how to approach it if you are using [Azure Lighthouse](/pal/lighthouse)? That is here too, plus we have a separate area dedicated to covering [example service offer definitions](/lighthouse) that will help you configure Partner Admin Link at scale.

You may also have questions on how it works as a mechanism. The [Understanding PAL](/pal/theory) page should give you that grounding on how it all hangs together, and we will treat the [Frequently Asked Questions](/pal/faq) as a live document based on any questions we get asked and that you post on our [discussions](https://github.com/azurecitadel/azurecitadel/discussions/132) page.
