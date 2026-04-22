---
headless: true
title: "Azure landing zone - Sovereign landing zone overview"
---

## Sovereign landing zone

So, what about the [Microsoft Sovereign Cloud](https://aka.ms/slz)?

When we make architectural decisions on Azure we already consider areas such as cost, security, identity and access management, performance, resiliency and more. These are then applied to the whole environment, or are part of the tradeoffs we apply to individual workloads when considering the [Well-Architected Framework](https://aka.ms/waf).

Digital sovereignty - addressing requirements around data sovereignty, operational sovereignty and AI sovereignty - introduces a number of new scenarios, considerations, and compliancy requirements that extend the architectural decision points and the continuum of options available across the [Microsoft Sovereign Cloud](https://aka.ms/microsoftsovereigncloud).

Some specific compliancy requirements will push certain customers to specific sovereign clouds. For example, French public sector customers that need to meet SecNumCloud compliancy will consider the National Partner Cloud run by Bleu.

Most Microsoft customers with additional sovereignty requirements will determine their high level sovereign requirements and then determine which workloads require additional configuration to achieve the applicable level of sovereignty. Those workloads are likely to be spread across Sovereign Public Cloud and Sovereign Private Cloud. This applies to more than Azure and Azure Local as Microsoft 365, Power Platform and other Microsoft cloud services come into play, but the focus here will be on the Sovereign landing zone, which extends the Azure landing zone with additional management group and additional policy assignments to provide sovereign guardrails.

The Microsoft documentation for Sovereign landing zone is <https://aka.ms/sovereign/slz>. Here is the diagram showing the [Management Group Hierarchy with Controls & Principles](https://learn.microsoft.com/azure/azure-sovereign-clouds/public/overview-sovereign-landing-zone?tabs=mgandcontrols#sovereign-landing-zone-slz-architecture).

![Sovereign landing zone conceptual architecture's Management Group hierarchy with the associated controls and principles applied.](https://learn.microsoft.com/azure/azure-sovereign-clouds/articles/public/media/sovereign-landing-zone-policy-controls.svg)

You will notice there are additional sovereignty specific policies being defined and assigned (in addition to the comprehensive set of standard ALZ policies). There are also three new management group scopes that are shown in bold.

- **Public**

    New management group scope that is only subject to the additional policies enforcing data residency and therefore limiting jurisdictional exposure. These are assigned at the top ALZ scope, shown as Contoso in this diagram. This management group is not allowed to connect via Virtual Network Peering, keeping it isolated from the corporate network.

- **Corp / Online**

    Existing management groups for enhanced data sovereignty on workloads. There is a stronger set of data-at-rest and data-in-flight encryption requirements in addition to the inherited data residency policies.

- **Confidential Corp / Online**

    Two new management groups for the most sensitive workloads, with the use of Azure Confidential Computing to additionally use encryption of data-in-use. Also adds additional limitations on public IPs.

Note that a set of complementary labs have been created for Customer Managed Key (CMK) sovereignty scenarios to help get up to speed with choosing the right key store, encrypting data at rest, and encrypting data-in-use at both the platform and application level.
