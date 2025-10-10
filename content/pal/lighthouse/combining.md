---
title: "Combining Lighthouse and PAL"
date: 2025-10-10
author: [ "Richard Cheney" ]
description: "How combining Partner Admin Link with Azure Lighthouse differs to traditional access."
draft: false
weight: 2
menu:
  side:
    parent: pal-lighthouse
    identifier: pal-lighthouse-combining
series:
 - pal-lighthouse
---

## In brief

There are two main options for customers to allows partners access to provide managed services on their Azure resources.

1. Creating traditional RBAC role assignments in the customer tenant, or
1. Delegating access with an Azure Lighthouse service provider offer

### Traditional RBAC role assignments

Historically, managed service providers have accessed customer environments one at a time. The identities that resides in the customer tenant. To PAL link, the managed service consultants need to switch to each customer directory in turn and link their IDs whilst in that context.

### Azure Lighthouse

Azure Lighthouse is a more recent service designed to provide a true multi-tenant management experience. The delegations project customer resources into the managed service provider's tenancy. The subscription filter extends so you can filter on tenant in addition to subscription.

The authorisations list the security principals (including groups) and RBAC [roles](https://docs.microsoft.com/azure/lighthouse/concepts/tenants-users-roles#role-support-for-azure-lighthouse). The objectIds belong to the provider's tenancy, so PAL linking is only done once. ACR for new customers (using the same linked objectIds) is automatically recognised.

### Partner Admin Link recommendations

General recommendations for PAL:

* Include [roles eligible for partner earned credit](https://docs.microsoft.com/partner-center/azure-roles-perms-pec) (PEC)
* Link all admins
* [Link service principals](https://docs.microsoft.com/azure/lighthouse/how-to/partner-earned-credit)
* For traditional access, [link in all customer contexts](https://docs.microsoft.com/azure/cost-management-billing/manage/link-partner-id#frequently-asked-questions), even for guest IDs

{{< flash >}}
**To recap, combine PAL with Lighthouse, but make sure there is a PEC eligible role in the list of permanent authorisations.**

Move on to the [next page](../minimal), or read on for more detail on PEC eligible roles, PAL, security principals, resource projection and the nuances of Lighthouse versus traditional access methods.
{{< /flash >}}

## Roles eligible for partner earned credit

There is a list of in-built [RBAC roles eligible for partner earned credit](https://docs.microsoft.com/partner-center/azure-roles-perms-pec).

Effectively, if the role only has read actions then it will not be eligible for PEC. All roles that have write or delete actions should be PEC eligible.

The dataActions in a role definition have no bearing on PEC eligibility.

## Security principals

These pages use security principals as the collective term for IDs in an AAD directory. This includes:

* standard users, also known as members
* guest users invited to a tenant via the AAD B2B mechanism
* service principals

Each of these will have a unique object ID in the AAD directory, and the combination of tenantId and objectId ensures that each security principal in Azure is unique.

### Technical notes

* A guest user generates a new objectId in the directory once the invite is accepted
  * The same ID and credentials may be used to authenticate to either directory
  * There is a unique security principal in each AAD directory
* A service principal is a system objectId generated for RBAC role assignment use
  * There are two object IDs for a standard single tenant service principal
  * The app (seen in App Registrations) has one objectId
  * The service principal (seen in Enterprise Applications) has its own objectId
  * The two objectIds are linked by the appId
* Multi-tenanted App Registrations are rarer
  * There will be one service principal objectId per tenant
  * The single app is linked to the service principals via the appId

Understanding a little about the security principals and how they show up in the directories of either the managed service provider ot the customer is important when looking at PAL linking.

## Linking IDs with PAL

You can user [Partner Admin Link](https://aka.ms/partneradminlink) to associate the security principals that have access to customer environments to a partner's Microsoft Partner ID (MPNID). From that point onwards the ACR for the customer's Azure resources - those visible to the security principal - is attached to the partner.

A few things to remember:

* PAL is based on RBAC role assignments

    The ACR attributable to the managed service is based on the security principals and their RBAC role assignments.

    If the role assignment is for certain resource groups only then the ACR will reflect that. It won't match the total for the subscription scope.

* Link multiple security principals

    Why? For two main reasons, full resource visibility and resilience.

    Firstly, if two security principals have different RBAC role assignment scopes then you may find that one security principal can't see all the resources that the other can, and vice versa. If so then linking both would ensure that the ACR reflects the union of all visible resources.

    Secondly, as you have to link individual security principals rather than security groups, then the natural attrition of staff within companies combined with the lack of reporting on who is linked can lead to a situation where previously recognised ACR is no longer associated. Consistently linking all admins in all customer contexts helps to avoid this scenario.

* Link service principals

    On that note, linking service principals is a great idea. Authenticate into the customer context as the service principal and link to the MPNID. For example, using the CLI:

    ```bash
    az login --service-principal --username <servicePrincipal> --password <secret> --tenant <tenantId>
    az account show
    az managementpartner create --partner-id <MPNID>
    az managementpartner show
    ```

* You only need to link once per customer context, not per subscription

    Once you have switched to the customer tenant and authenticated then can see the resources based on the RBAC role assignments in that context. Make sure the security principal is PAL linked and it applies to all subscriptions or resource groups. There is no need to switch to each subscription and keep relinking.

* Guest IDs need to be linked in each customer context

    As per the technical notes above, a guest ID may use the same email address and authentication to access all of the directories, but don't be mistaken in thinking that once you've linked the ID that it will be linked for all of those customers. You still need to switch to each customer context and link.

    There is an objectId in each tenantId where the security principal has been invited, and it is that tenantId/objectId that is linked to the MPNID by PAL.

The main docs page for partner admin link explains the mechanics of association well and includes an [FAQ](https://docs.microsoft.com/azure/cost-management-billing/manage/link-partner-id#frequently-asked-questions).

> Security principals covers standard users (or members), guest IDs, and service principals. It is the tenant ID and object ID that is linked to a location based MPNID. (Not the v-org ID.) It is not possible to link security groups.

One major benefit to MSPs with Azure Lighthouse is that there is far less PAL linking required. Let me explain.

If you are using one of the traditional methods to gain access to a customer environment then you should ideally link each security principal in each customer context. This means that each admin should log into each customer directory and then link the ID via the [Microsoft partner network](https://portal.azure.com/#view/Microsoft_Azure_Billing/ManagementPartnerBlade) link at the bottom left of the setting page.

This only need to be done once per ID, but if there are 10 admins and 45 customers then it is 450 associations. If you are also using a service principal in each customer then you have another 45 associations to make via PAL.

With Azure Lighthouse your authorisations list would probably include a security group (containing the 10 admins) and a separate authorisation for the service principal. All of the security principals are in your tenant. Link the 10 admins and the service principal to the MPNID and you are done.

> Note that there are some [role limitations](https://docs.microsoft.com/azure/lighthouse/concepts/tenants-users-roles#role-support-for-azure-lighthouse) with Azure Lighthouse.

## Publishing to the Marketplace

As a reminder from the previous page, Managed Service offers published into the Azure Marketplace automatically attach ACR recognition for delegated resources via the Marketplace mechanism rather than PAL.

## References

* [Azure Lighthouse best practice](https://docs.microsoft.com/azure/lighthouse/concepts/tenants-users-roles#best-practices-for-defining-users-and-roles)
* [Azure Lighthouse role limitations](https://docs.microsoft.com/azure/lighthouse/concepts/tenants-users-roles#role-support-for-azure-lighthouse)
* [Roles eligible for partner earned credit](https://docs.microsoft.com/partner-center/azure-roles-perms-pec) (PEC)
* [Linking service principals for PEC](https://docs.microsoft.com/azure/lighthouse/how-to/partner-earned-credit)
* [Partner Admin Link FAQ](https://docs.microsoft.com/azure/cost-management-billing/manage/link-partner-id#frequently-asked-questions)

## Next

In the next section we will look at a minimal Lighthouse definition, walk through the creation of the definition and assignment resources via the portal, and then how to PAL link the security principals.
