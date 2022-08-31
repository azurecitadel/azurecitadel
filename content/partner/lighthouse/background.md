---
title: "Background"
date: 2022-08-11
author: [ "Richard Cheney" ]
description: "A quick overview of the key updates to the partner program for FY23 and ACR based criteria within the partner score."
draft: true
weight: 1
menu:
  side:
    parent: partner-lighthouse
    identifier: partner-lighthouse-background
series:
 - partner-lighthouse
---

## In short

Azure Lighthouse and Partner Admin Link (PAL) can be combined by managed service providers to help maximise their partner attached Azure Consumed Revenue (ACR) numbers.

Why is that important?

There is a new Microsoft solutions partner program for FY23 and those partners aiming to gain the new Azure designations will need to get a minimum of 70 on the relevant partner score. The partner score is comprised of five categories. None of those can be zero even if the total score from the other categories totals 70 or more.

Two categories relate to certs, and three categories are ACR based. The criteria demonstrates a partner's ability to:

1. add new customers
1. increase customer ACR beyond assumed natural growth levels
1. deploy workloads other than IaaS VMs

The partner attach mechanisms for tracking that ACR are

* Cloud Solution Partner (CSP)
* Digital Partner of Record (DPOR)
* Partner Admin Link (PAL)

PAL is the focus of these pages. PAL is the recommended way to recognise managed services from partners into Azure subscriptions, and can be used across all subscription offer types including Enterprise Agreement and Pay As You Go.

**⚠️ There is a change to PAL for this FY as ACR will only be recognised from managed services that include roles that are eligible for partner earned credit.**

This is important for any managed services that only have Reader roles within the list of Permanent authorisations.

{{< flash >}}
Read on for more detail on the solutions partner program, designations and partner score and partner attach ACR mechanisms. Plus all of the links.

Or move straight to the [next page](../combining).
{{< /flash >}}

## Microsoft Solutions Partner program

The [Microsoft solutions partner](https://docs.microsoft.com/partner-center/introduction-to-pcs) program has been introduced for FY23, replacing the Cloud Platform competency program. As an Azure partner you will be working towards one (or more) of the three Azure designations:

* [Solutions partner for Infrastructure](https://partner.microsoft.com/training/assets/collection/solutions-partner-for-infrastructure-azure#/)
* [Solutions partner for Digital and App Innovation](https://partner.microsoft.com/training/assets/collection/solutions-partner-for-digital-and-app-innovation-azure#/)
* [Solutions partner for Data and AI](https://partner.microsoft.com/training/assets/collection/solutions-partner-for-data-and-ai-azure#/)

Partners working towards the new partner designations will need to get a minimum of 70 points for their [partner capability score](https://docs.microsoft.com/partner-center/partner-capability-score), with points coming from *all* five categories:

1. **Performance**
1. **Skilling** – Intermediate certifications
1. **Skilling** – Advanced certifications
1. **Customer success** – Usage growth
1. **Customer success** – Deployments

The details are on the [Solutions partner for all Azure areas](https://docs.microsoft.com/partner-center/solutions-partner-azure) page, but at a high level:

* The **Skilling** category is based on certifications, and require specific [intermediate](https://docs.microsoft.com/partner-center/solutions-partner-azure#intermediate-certifications) and [advanced](https://docs.microsoft.com/partner-center/solutions-partner-azure#advanced-certifications) depending on the designation, and we'll ignore these on this page

* The **Performance** and **Customer success** categories will look for [net customer adds](https://docs.microsoft.com/partner-center/solutions-partner-azure#net-customer-adds), [usage growth](https://docs.microsoft.com/partner-center/solutions-partner-azure#usage-growth) and [deployments](https://docs.microsoft.com/partner-center/solutions-partner-azure#deployments) of Azure services more advanced than a VM

Your current partner score can be found in Partner Center. Navigate to the [solutions partner page](https://partner.microsoft.com/dashboard/insights/mpninsights/solutionspartner?source=docs) in the Insights workspace.

## Partner attached ACR

Azure Consumed Revenue (ACR) is the primary metric used on Azure. Telemetry is collected from all customer accounts for billing and usage reporting. The ACR can be attached to a partner via a number of mechanisms. Some are more applicable to other types of partners, e.g. the Marketplace attached ACR for Independent Solution Vendors (ISVs) and will be ignored here.

The partner score uses the following partner attach mechanisms for recognising ACR influence from services partners:

1. Cloud Solution Provider

    All ACR from [Cloud Solution Provider](https://docs.microsoft.com/partner-center/csp-overview) (CSP) subscriptions are recognised for partners involved in the transaction path in both the direct and indirect (provider/reseller) models.

    CSP recognition is automatic.

1. Digital Partner of Record

    A customer may associate one services partner to an Enterprise Agreement (EA) subscription using [Digital Partner of Record](https://docs.microsoft.com/partner-center/link-partner-id-for-azure-performance-pal-dpor#link-to-a-partner-id-with-dpor) (DPOR). This is intended to link the partner whose professional services have had the most impact on the Azure services and associated customer outcomes.

    DPOR recognition is configured by the customer. The customer can also remove a partner, or change the partner. Note that only one partner at a time may be linked.

1. Partner Admin Link

    The security principals (users and service principals) involved in providing a managed service can be linked using Partner Admin Link (PAL). When the security principals are linked with the partners Microsoft Partner Network ID (MPN ID) then the partner is associated to the telemetry for the Azure resources.

    Note that it is the partner (not the customer) that links using PAL. PAL supports all offer types (e.g. EA, CSP, PAYG) and supports more complex scenarios with multiple partners providing managed services in the same subscription. The customer enables access in one of two methods:

    1. partner RBAC assignments

    * creating member users and/or service principals in their AAD directory and providing the credentials
    * inviting guest users from the partner's AAD directory over B2B
    * creating RBAC assignments for any of the the above security principals (including multi-tenanted service principals)

    1. Azure Lighthouse

    * delegating one or more subscriptions and/or resource groups to a partner
    * the definition includes the authorisations, lists of security principals and the roles they will be have

> Note that there is a natural order of precedence in the Partner Insights area where multiple ACR attach mechanisms have been leveraged.
>
> For example, if a customer has a few CSP subscriptions from a partner, plus it is using Azure Lighthouse and PAL for a managed service on those subscriptions and some other EA subscriptions, then both PAL and CSP will be reported.
>
> The CSP number will cover the CSP subscriptions, whilst PAL will only reflect the ACR that may be attached from the non-CSP subscriptions. The approach avoids double counting.

## Linking IDs with PAL

You can user [Partner Admin Link](https://aka.ms/partneradminlink) to associate the security principals that have access to customer environments to a partner's Microsoft Partner ID (MPNID). From that point onwards the ACR for the customer's Azure resources - those visible to the security principal - is attached to the partner.

One major benefit to MSPs with Azure Lighthouse is that there is far less PAL linking required. Traditional methods require linking security principals in each and every customer context, whilst the multi-tenancy and resource projections from Azure Lighthouse require only the security principals in the MSP's tenant to be linked. And once they are linked then subsequent customer adds using the same Lighthouse definition will be automatically associated to the MPN ID.

The next page will go into more depth on this area to help clarify.

## Publishing to the Marketplace

One other area that is worthy of mention is the Azure Marketplace.

Any Lighthouse definitions that are [published as Managed Service offers to the Azure Marketplace](https://docs.microsoft.com/azure/lighthouse/how-to/publish-managed-services-offers) may then be deployed by customers. Delegated resources are then associated via the Marketplace attach type.

There is no need to use Partner Admin Link to associate security principals in Managed Service delegations.

## References

* [Microsoft solutions partner](https://docs.microsoft.com/partner-center/introduction-to-pcs)
  * [Solutions partner for Infrastructure](https://partner.microsoft.com/training/assets/collection/solutions-partner-for-infrastructure-azure#/)
  * [Solutions partner for Digital and App Innovation](https://partner.microsoft.com/training/assets/collection/solutions-partner-for-digital-and-app-innovation-azure#/)
  * [Solutions partner for Data and AI](https://partner.microsoft.com/training/assets/collection/solutions-partner-for-data-and-ai-azure#/)
* [Partner capability score](https://docs.microsoft.com/partner-center/partner-capability-score)
* [Solutions partner for all Azure areas](https://docs.microsoft.com/partner-center/solutions-partner-azure)
  * [intermediate certs](https://docs.microsoft.com/partner-center/solutions-partner-azure#intermediate-certifications)
  * [advanced certs](https://docs.microsoft.com/partner-center/solutions-partner-azure#advanced-certifications)
  * [net customer adds](https://docs.microsoft.com/partner-center/solutions-partner-azure#net-customer-adds)
  * [usage growth](https://docs.microsoft.com/partner-center/solutions-partner-azure#usage-growth)
  * [deployments](https://docs.microsoft.com/partner-center/solutions-partner-azure#deployments)
* [solutions partner page](https://partner.microsoft.com/dashboard/insights/mpninsights/solutionspartner?source=docs) (Partner Insights)
* [Cloud Solution Provider](https://docs.microsoft.com/partner-center/csp-overview)
* [Digital Partner of Record](https://docs.microsoft.com/partner-center/link-partner-id-for-azure-performance-pal-dpor#link-to-a-partner-id-with-dpor)
* [Partner Admin Link](https://aka.ms/partneradminlink)
* [Publish a Managed Service offer to Azure Marketplace](https://docs.microsoft.com/azure/lighthouse/how-to/publish-managed-services-offers)

## Next

In the next section we will go a little deeper on Partner Admin Link, on resource projection and security principals in an Azure Lighthouse context, and which roles are eligible for partner earned credit and therefore ACR recognition via PAL.
