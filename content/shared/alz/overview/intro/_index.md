---
headless: true
title: "Azure landing zone - overview intro"
---

## Introduction

There is a lot of content in these labs, and it will make more sense if you know how the moving parts are connected.

This page will help you to understand how Azure Landing Zones (and Sovereign Landing Zones) make use of the library format and the Azure Verified Modules in the Terraform Registry, and how we use the ALZ Accelerator to speed up and standardise the deployment process. This will be a brief introduction to help level set, and you can expect to find a lot of friendly URLs to take you through to the official Microsoft documentation.

In the last section we will then run through the structure of the labs so that you understand the flow.

## Azure landing zone

The Microsoft [Cloud Adoption Framework](https://aka.ms/cloudadoptionframework) gives guidance for partners and customers to adopt Azure, integrate with their existing IT infrastructure and migrate and modernize workloads. The main documentation area is <https://aka.ms/caf> and the overview page is recommended reading.

Diagram showing the phases of the Cloud Adoption Framework:

![Cloud Adoption Framework](https://learn.microsoft.com/azure/cloud-adoption-framework/caf-overview.png)

The third stage of the Cloud Adoption Framework (after Strategy and Plan) is Ready, and this is the focus of these labs. The [Ready](https://aka.ms/caf/ready) stage covers a number of topics, and one of those the guidance for creating a landing zone for Azure workloads to be migrated or deployed to.

Here is a generalised view of a landing zone:

![Generalised landing zone](https://learn.microsoft.com/azure/cloud-adoption-framework/_images/ready/azure-landing-zone-conceptual-diagram.png)

The landing zone is split into a platform landing zone - which covers management group structure and associated governance policy guardrails plus shared services for connectivity, identity, management, and security - and the multiple application landing zones which are deployed under the management group structure - inheriting the policies from the management groups above - and  used for the workload resources themselves.

The guidance here is generalised and many organisations have created their own definitions to meet the guidance, often using infrastructure as code. However, many pushed Microsoft to provide IP to accelerate and standardise a landing zone, and, to cut a long story short, we now have the [Azure landing zone](https://aka.ms/alz) (and the [Sovereign landing zone](https://aka.ms/slz) variant) as opinionated platform landing zones.

Azure Landing Zone reference architecture:

![Azure Landing Zone reference architecture](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/enterprise-scale/media/azure-landing-zone-architecture-diagram-hub-spoke.svg)

Note that this is a full implementation with resource in all of the platform landing zone subscriptions, plus a selection of application landing zone subscriptions, sandbox etc. Note that there is a smaller and more cost conscious SMB variant released.

{{< flash "tip" >}}

Note that these pages focus purely on the **management groups** and the **management** subscription. The resources for the connectivity, identity and security subscriptions are out of scope, as are the application landing zones.

![Azure Landing Zone management groups and subscription organization](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/design-area/media/sub-organization.png)

This focus matches the remit of the labs, which is to help on the organisation and the governance for standard and sovereign scenarios.

Many of the partners that I work with have their own infrastructure as code for the platform landing zone resources and are happy to continue using that. However, keeping up to date with policy governance in the fast changing world of compliance is challenging when you go your own route.

The modularity of the Azure Verifiable Modules approach - more on that later - gives partners the option to switch to the Azure landing zone policy approach and take advantage of the continual work being done by the Microsoft team. They can then choose how to deploy the other resources into the platform subscriptions such as connectivity.

{{< /flash >}}
