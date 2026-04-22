---
headless: true
title: "Azure landing zone - ALZ Accelerator overview"
---

## ALZ Accelerator

The ALZ Accelerator is used by customers, partners, and Microsoft's own Factory to accelerate deployments of Azure landing zones. Use of the ALZ accelerator is not mandatory, but there are two core benefits of using the accelerator:

1. Defines a best practice recommendation for CI/CD of your infrastructure as code configurations, including repo branch protections, approval processes and custom pipeline definitions; use of OpenID Connect and least privilege Managed Identities, and more. Supports configuration of GitHub, Azure DevOps, or local filesystem.
1. A system generated config for either Bicep or Terraform using the Azure Verified Modules. A number of default scenarios are supported via the starter modules. For Terraform this includes single or multi region deployments, hub and spoke or Azure Virtual WAN, and Azure Firewall or NVA, as well as the simple management group only configuration.

The official [ALZ Accelerator](https://aka.ms/alz/accelerator) documentation covers all of the various options and customisation.

{{< flash "tip" >}}

These labs are geared towards partner understanding of the policy and Azure landing zone library elements of the solution, and specific options have been assumed to narrow the focus.

- Terraform is assumed and Bicep is not included
- GitHub is assumed and Azure DevOps is not currently included
- None of the starter module scenarios are selected - instead we are using a custom one called `empty`

{{< /flash >}}

This approach allows us to take advantage of the CI/CD standards and benefits, whilst forcing us to build up a management group and management config manually using the examples in the Terraform module documentation. This is for deeper enablement so that partners are in a better position to support customisation needed for different go to market scenarios and customer requirements.
