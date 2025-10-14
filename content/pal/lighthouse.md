---
title: "Azure Lighthouse & PAL"
date: 2025-10-10
author: [ "Richard Cheney" ]
description: "Combining Partner Admin Link with Azure Lighthouse reduces some of the administrative overhead. How does it differ compared to more traditional PAL configurations?"
draft: false
weight: 80
menu:
  side:
    parent: pal
    identifier: pal-lighthouse
series:
 - pal
---

## In brief

There are two main options for customers to allows partners access to provide managed services on their Azure resources.

1. Creating traditional RBAC role assignments in the customer tenant

    Historically, managed service providers have accessed customer environments one at a time, using identities that resides in the customer tenant. The managed service consultants need to switch to each customer directory in turn and create the Partner Admin Link whilst in that customer context.

1. Delegating access with an Azure Lighthouse service provider offer

    Azure Lighthouse is a service designed to provide a true multi-tenant management experience. Azure Lighthouse projects customer resources into the managed service provider's tenancy when the customer creates a delegation based on an Azure Lighthouse service provider offer. The delegations are made against the subscription and resource group scopes only.

    The permissions granted are defined in the Azure Lighthouse service provider offer's list of authorisations, which specifies the security principals (including groups) and RBAC [roles](https://docs.microsoft.com/azure/lighthouse/concepts/tenants-users-roles#role-support-for-azure-lighthouse). Privileged Identity Management is supported (and recommended) so that the standaing access is least privilege and approval processes can be followed when elevating to roles with greater access.

    In effect the direction of travel is changed with Azure Lighthouse. Instead of MSP operator going to the customer's tenant and accessing their resources, the customer has allowed the services to come to the MSP operator. When a managed service operator uses the Azure Portal with Azure Lighthouse then they log into their home tenant and then have a multi-tenanted view of all of the delegated resources. The subscription filter in the portal's settings allows the operator to filter on both tenant and subscription.

    From a customer perspective they have full visibility on the service provider offers, the associated permissions specified in the authorisations, and the scope points which have been delegated. Their Identity and Access Management (Azure IAM) no longer includes a high number of security principals from partners, complicating RBAC administration and access reviews. Any control plane access beyond read is logged in the Activity Log, as are PIM elevations. The customer always has the ability to revoke access, removing individual delegations or deleting whole service provider offers.

    There are also a number of limitations with Azure Lighthouse. See the Azure Lighthouse section on this site for more information and example service provider offer templates.

## Partner Admin Link with Azure Lighthouse

The objectIds in the authorisation's list belong to the provider's tenancy, so PAL linking is done in the home tenant rather than in a customer tenant. As a result the Partner Admin Link only needs to be done once for each security principal. Any new customers using the same service provider offer would be linked automatically.

{{< flash >}}
Recommendations:

- The authorisations in the service provider offer templates should ideally use only objectIds for Entra security groups and service principals.
- Create Partner Admin Links for all of the user principals that belong to the security groups included in the authorisations
- Create Partner Admin Links for any service principals used in the authorisations
- Create the Partner Admin Links in the service provider's home tenant, not in the customer tenants
{{< /flash >}}

## Managed Service offers published to the Marketplace

{{< flash >}}
If the Managed Service offers are published into the Azure Marketplace then the customer influence is recognised via the Marketplace mechanism rather than using Partner Admin Link.

See the dedicated [Azure Lighthouse](/lighthouse) area for more information.
{{< /flash >}}

## References

- [Azure Lighthouse best practice](https://docs.microsoft.com/azure/lighthouse/concepts/tenants-users-roles#best-practices-for-defining-users-and-roles)
- [Azure Lighthouse role limitations](https://docs.microsoft.com/azure/lighthouse/concepts/tenants-users-roles#role-support-for-azure-lighthouse)
- [Roles eligible for partner earned credit](https://docs.microsoft.com/partner-center/azure-roles-perms-pec) (PEC)
- [Linking service principals for PEC](https://docs.microsoft.com/azure/lighthouse/how-to/partner-earned-credit)
- [Partner Admin Link FAQ](https://docs.microsoft.com/azure/cost-management-billing/manage/link-partner-id#frequently-asked-questions)

## Next

In the next section we will look at a minimal Lighthouse definition, walk through the creation of the definition and assignment resources via the portal, and then how to PAL link the security principals.
