---
title: "Useful Links"
description: "Set of useful links for Azure Landing Zones"
layout: single
draft: false
weight: 9
menu:
  side:
    parent: alz
    identifier: alz-links
series:
 - alz
---

## Main Azure Landing Zones Links

These are the main links to remember!

| Link | Description |
|---|---|
| <https://aka.ms/adopt> | Cloud Adoption Framework |
| <https://aka.ms/alz> | What is an Azure landing zone? |
| <https://aka.ms/alz/isv> | ISV considerations for Azure Landing Zones  |
| <https://aka.ms/alz/learn> | Microsoft Learn learning path |
| <https://aka.ms/alz/repo> | The main Azure Landing Zones repo on GitHub |
| <https://aka.ms/alz/bicep> | Bicep modules |
| <https://aka.ms/alz/bicep/wiki> | Bicep module wiki |
| <https://aka.ms/alz/tf> | Terraform module  |
| <https://aka.ms/alz/tf/wiki> | Terraform module wiki |
| <http://aka.ms/waf> | Well Architected Framework |

## Additional info

| Link | Description |
|---|---|
| [Canary testing](https://docs.microsoft.com/azure/cloud-adoption-framework/ready/enterprise-scale/testing-approach) | Guidance for testing ES updates |
| [Private Link and DNS](https://docs.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/private-link-and-dns-integration-at-scale) | Private Link and DNS at scale via Policy |
| [Connectivity to other cloud providers](https://docs.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/connectivity-to-other-cloud-providers) | Linking ES environments to other clouds |
| <https://aka.ms/alz/whatsnew> | Updates to the Azure Landing Zones docs |
| [IT Ops Talk](https://www.youtube.com/channel/UCvyPX_vz17uFdtG3NyoV-UA) | YouTube channel to include Azure Landing Zones content |

## Azure Policy

The main repo, including built-ins, samples, community contributions and the Azure Policy definition and structure page.

| Link | Description |
|---|---|
| [github.com/Azure/azure-policy](https://github.com/Azure/azure-policy) | Azure Policy repo |
| - [built-in-policies](https://github.com/Azure/azure-policy/tree/master/built-in-policies) | - built-in Azure Policies |
| - [samples](https://github.com/Azure/azure-policy/tree/master/samples) | - Azure Policy samples |
| [github.com/Azure/Community-Policy](https://github.com/Azure/Community-Policy) | Community Policy repo |
| [AzPolicyAdvertizer](https://www.azadvertizer.net/azpolicyadvertizer_all.html) | Useful unofficial tool to search on available policies |
| [Azure Policy definition structure](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure) | Reference documentation for the Azure Policy JSON definitions |
| <https:/azurecitadel.com/policy> | Lab showcasing the authoring of a custom policies from scratch |

## Azure RBAC Roles

Sometimes you will need to create custom RBAC roles to meet customer requirements.

* <https://docs.microsoft.com/azure/role-based-access-control/custom-roles>

## Additional Infrastructure as Code links

* [How does ALZ-Bicep Implement Azure Policies?](https://github.com/Azure/ALZ-Bicep/wiki/PolicyDeepDive)
* [Deploy Azure landing zones by using Terraform](https://docs.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/deploy-landing-zones-with-terraform)
* YouTube video discussing Bicep deployments for Azure Landing Zones

    {{< youtube id="GkImpboYwBE" >}}
