---
title: "Combining Lighthouse and PAL"
date: 2022-08-11
author: [ "Richard Cheney" ]
description: "How combining Partner Admin Link with Azure Lighthouse differs to traditional access."
draft: true
weight: 2
menu:
  side:
    parent: partner-lighthouse
    identifier: partner-lighthouse-combining
series:
 - partner-lighthouse
---

## In short

Historically, managed service providers have accessed individual customer environments individually. This is painful with PAL as admins need to link in each customer context or there is the risk of missing ACR. There is no simple reporting mechanism to know which admins are linked in which customer contexts so it is not easy to manage,

Using Azure Lighthouse is different as delegated resources are projected back to the managed service provider tenant, and the authorisations relate to security principals in the MSP tenant rather than IDs dotted about in multiple customer tenants.

* PAL linking becomes a much quicker process
* It is easier to track who is and isn't linked
* The process is less fallible when employees leave (and join) the partner
* No new PAL linking is required when the same Azure Lighthouse definition is used with a new customer

{{< flash >}}
Read on for more detail on PAL, security principals, resource projection and the nuances of Lighthouse versus traditional access methods.

Or move straight to the [next page](../minimal).
{{< /flash >}}

## Security principals

This page will use security principals as the collective term for IDs in an AAD directory. This includes:

* standard users, also known as members
* guest users invited to a tenant via the AAD B2B mechanism
* service principals

Each of these will have a unique object ID in the AAD directory.

ℹ️ The combination of tenantId and objectId ensures that each security principal in Azure is unique.

Member users are simple, but here are a few technical notes on guests and service principals:

* A guest user generates a new objectId in the directory
  * The same ID and credentials may be used to authenticate to either directory
  * There is a unique security principal in each AAD directory
* A service principal is a system objectID generated for RBAC role assignment use
  * There are two object IDs for a single tenant service principal
  * The app (seen in App Registrations) has one objectId
  * The service principal (seen in Enterprise Applications) has its own objectId
  * The two objectIds are linked by the appId
* A multi-tenanted App Registration will generate service principal objectIds in each tenant
  * The single app will be linked to multiple service principals
  * Each has its own objectId in its relevant tenantId, all linked by the appId

YOU ARE HERE

## Linking IDs with PAL

You can user [Partner Admin Link](https://aka.ms/partneradminlink) to associate the security principals that have access to customer environments to a partner's Microsoft Partner ID (MPNID). From that point onwards the ACR for the customer's Azure resources - those visible to the security principal - is attached to the partner. PAL linking applies to all subscriptions or resource groups within that customer context if the security principal has the RBAC role assignments to manage.

> ⚠️ Historically

The main docs page for partner admin link explains the mechanics of association well and includes an [FAQ](https://docs.microsoft.com/azure/cost-management-billing/manage/link-partner-id#frequently-asked-questions).

> Security principals covers standard users (or members), guest IDs, and service principals. It is the tenant ID and object ID that is linked to a location based MPNID. (Not the v-ord ID.) It is not possible to link security groups.

One major benefit to MSPs with Azure Lighthouse is that there is far less PAL linking required. Let me explain.

If you are using one of the legacy methods to gain access to a customer environment then you should ideally link each security principal in each customer context. This means that each admin should log into each customer directory and then link the ID via the [Microsoft partner network](https://portal.azure.com/#view/Microsoft_Azure_Billing/ManagementPartnerBlade) link at the bottom left of the setting page.

This only need to be done once per ID, but if there are 10 admins and 45 customers then it is 450 associations.



## Publishing to the Marketplace

As a reminder from the previous page, Managed Service offers published into the Azure Marketplace automatically attach ACR recognition for delegated resources via the Marketplace mechanism rather than PAL.

## References

* <https://github.com>
