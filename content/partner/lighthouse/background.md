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

## In brief

Azure Lighthouse and Partner Admin Link (PAL) can be combined by managed service providers to help maximise their partner attached Azure Consumed Revenue (ACR) numbers.

Why is that important?

There is a new Microsoft solutions partner program for FY23. Partners aiming to gain the new Azure designations will need to get a minimum of 70 on the relevant partner score. The partner score is comprised of five categories. None of those can be zero even if the total score from the other categories totals 70 or more.

Two of the categories relate to certs, but the remaining three categories are ACR based and therefore relevant to these pages. The criteria in those categories demonstrate a partner's ability to:

1. add new customers
1. increase customer ACR beyond assumed natural growth levels
1. deploy workloads other than IaaS VMs

The partner attach mechanisms for Azure partners to track customer ACR are

* Cloud Solution Partner (CSP)
* Digital Partner of Record (DPOR)
* Partner Admin Link (PAL)

PAL is the focus of these pages. PAL is the recommended way to recognise managed services from partners into Azure subscriptions, and can be used across all subscription offer types including Enterprise Agreement and Pay As You Go.

**⚠️ There is a change to PAL for this FY as ACR will only be recognised from managed services that include roles that are eligible for partner earned credit.**

This is important for any managed services that only have Reader roles within the list of Permanent authorisations.

{{< flash >}}
**To recap, ACR recognition is more important than ever for partners, and PAL can help. But a Reader role is not enough for recognition. You need to have a role eligible for partner earned credit.**

Move to the [next page](../combining), or read on if you want more detail on the solutions partner program, designations and partner score and partner attach ACR mechanisms. (Plus all of the links.)
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

* The **Skilling** category is based on certifications, and require specific [intermediate](https://docs.microsoft.com/partner-center/solutions-partner-azure#intermediate-certifications) and [advanced](https://docs.microsoft.com/partner-center/solutions-partner-azure#advanced-certifications) depending on the designation

* The **Performance** and **Customer success** categories will look for [net customer adds](https://docs.microsoft.com/partner-center/solutions-partner-azure#net-customer-adds), [usage growth](https://docs.microsoft.com/partner-center/solutions-partner-azure#usage-growth) and [deployments](https://docs.microsoft.com/partner-center/solutions-partner-azure#deployments) of Azure services more advanced than a VM

Your current partner score can be found in Partner Center. Navigate to the [solutions partner page](https://partner.microsoft.com/dashboard/insights/mpninsights/solutionspartner?source=docs) in the Insights workspace.

> Note that Partner Insights reporting avoids double counting. For instance, telemetry associated with both CSP and PAL will only show as CSP.

## Partner attached ACR

Azure Consumed Revenue (ACR) is the primary metric used on Azure. Telemetry is automatically collected from all customer accounts for billing and usage reporting.

The ACR can be attached to a partner via a number of mechanisms. For Azure managed service providers, the three mechanisms are CSP, DPOR and PAL.

### Cloud Solution Provider

ACR from [Cloud Solution Provider](https://docs.microsoft.com/partner-center/csp-overview) (CSP) subscriptions is automaticall recognised for all partners involved in the transaction path.

Applies to both direct and indirect (provider/reseller) CSP models.

### Digital Partner of Record

Customers may use [Digital Partner of Record](https://docs.microsoft.com/partner-center/link-partner-id-for-azure-performance-pal-dpor#link-to-a-partner-id-with-dpor) (DPOR) to associate a services partner to an Enterprise Agreement (EA) subscription.

The intent is to recognise the partner whose professional services have had the most impact on the Azure services and associated customer outcomes.

DPOR is configured by the customer. Only one partner can have DPOR on a subscription.

### Partner Admin Link

Partner Admin Link (PAL) recognises the impact of managed services into customer subscriptions.

The customer first allows the partner access to manage their resources via either

* traditional RBAC role assignments created for security principals (users, invited guests or service principals) used by the partner, or
* by delegating subscription(s) or resource group(s) with a partner's Azure Lighthouse service provider offer

The security principals with access may then be linked using Partner Admin Link (PAL) to the partner's Microsoft Partner Network ID (MPN ID). The partner is then associated with the telemetry for the Azure resources that those security principals can see.

The PAL process itself does not involve the customer. Permission is implicit in the RBAC assignments or Lighthouse delegations. PAL may be used with all subscription offer types (e.g. EA, CSP, PAYG) and is a more flexible and granular system that supports more complex multiple partner scenarios.

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
