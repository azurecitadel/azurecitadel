---
title: "Microsoft Cloud Partner Program"
date: 2022-08-11
author: [ "Richard Cheney" ]
description: "A quick overview of the key updates to the partner program for FY23 and the ACR based criteria within the partner score."
draft: false
weight: 1
menu:
  side:
    parent: pal-lighthouse
    identifier: pal-lighthouse-mcpp
series:
 - pal-lighthouse
aliases:
    - /mcpp
    - /partner/mcpp
    - /partner/lighthouse/background
---

## In brief

Combining the use of Azure Lighthouse and Partner Admin Link (PAL) is a great way for partners to demonstrate the positive impact their managed services have in customer accounts.

Why is that important?

There is a new Microsoft Cloud Partner Program (MCPP) for FY23, with new Solutions Partner designations. Partners aiming to gain the new Solutions Partner designations will need to score in all categories for that designation, and the sum of those scores must reach a minimum of 70.

The Azure designations include one or two categories related to certificates, which will be ignored in these pages. The remaining categories are ACR based and therefore more relevant to PAL and Lighthouse. The criteria in those categories demonstrate a partner's ability to:

1. add new customers
1. increase customer ACR beyond assumed natural growth levels
1. deploy workloads other than IaaS VMs

Microsoft uses a number of partner attach mechanisms to identify and recognise partners who drive Azure customer success. Microsoft can attribute influence and Azure consumed revenue to  services partners using:

* Cloud Solution Partner (CSP)
* Digital Partner of Record (DPOR)
* Partner Admin Link (PAL)

We will focus on PAL as the recommended way to recognise managed services from partners into Azure subscriptions. PAL can be used across all subscription offer types including Enterprise Agreement and Pay As You Go.

The Azure consumed revenue is associated based on the account's permissions (Azure role) and scope (subscription, resource group, resource). ACR association requires a role that is eligible for partner earned credit, or PEC, and this does not include Reader roles.

{{< flash >}}
**To recap, ACR recognition is important for Microsoft to recognise partners who drive Azure success. PAL is one of the association methods, and needs a PEC eligible role assignment for recognition.**

Move to the [next page](../combining), or read on if you want more detail on the solutions partner program, designations and partner score and partner attach ACR mechanisms. (Plus all of the links.)
{{< /flash >}}

## Microsoft Cloud Partner Program

The [Microsoft Cloud Partner Program](https://partner.microsoft.com) (MCPP) replaces the Cloud Platform competency program. MCPP includes new [Solutions Partner designations](https://learn.microsoft.com/partner-center/introduction-to-pcs). As an Azure partner you will be working towards one (or more) of the Azure designations:

* [Solutions Partner for Infrastructure](https://partner.microsoft.com/training/assets/collection/solutions-partner-for-infrastructure-azure#/)
* [Solutions Partner for Security](https://partner.microsoft.com/training/assets/collection/solutions-partner-for-security#/)
* [Solutions Partner for Digital and App Innovation](https://partner.microsoft.com/training/assets/collection/solutions-partner-for-digital-and-app-innovation-azure#/)
* [Solutions Partner for Data and AI](https://partner.microsoft.com/training/assets/collection/solutions-partner-for-data-and-ai-azure#/)

> There are additional designations for the other Microsoft Cloud workloads:
>
> * Solutions Partner for Business Applications
> * Solutions Partner for Modern Work

Partners working towards the new Solutions Partner designations will need to get a minimum of 70 points for their [partner capability score](https://learn.microsoft.com/partner-center/partner-capability-score), with points coming from *all* categories for that designation. (The number of categories varies by designation, as does the criteria.)

For example, here is the set of categories for Solutions Partner for Infrastructure:

1. **Performance**
1. **Skilling** – Intermediate certifications
1. **Skilling** – Advanced certifications
1. **Customer success** – Usage growth
1. **Customer success** – Deployments

The details are on the [Solutions Partner for Data & AI, Infrastructure, and Digital App & Innovation](https://learn.microsoft.com/partner-center/solutions-partner-azure) and [Solutions Partner for Security](https://learn.microsoft.com/partner-center/solutions-partner-security) pages, but at a high level:

* The **Skilling** category is based on certifications, and require specific [intermediate](https://learn.microsoft.com/partner-center/solutions-partner-azure#intermediate-certifications) and [advanced](https://learn.microsoft.com/partner-center/solutions-partner-azure#advanced-certifications) depending on the designation

* The **Performance** and **Customer success** categories will look for [net customer adds](https://learn.microsoft.com/partner-center/solutions-partner-azure#net-customer-adds), [usage growth](https://learn.microsoft.com/partner-center/solutions-partner-azure#usage-growth) and [deployments](https://learn.microsoft.com/partner-center/solutions-partner-azure#deployments) of Azure services more advanced than a VM

> The Solutions Partner for Security designation includes additional metrics covering eligible Microsoft 365 workloads.

Your current partner score can be found in Partner Center. Navigate to the [solutions partner page](https://partner.microsoft.com/dashboard/insights/mpninsights/solutionspartner?source=docs) in the Insights workspace.

> Note that Partner Insights reporting avoids double counting. For instance, telemetry associated with both CSP and PAL will only show as CSP.

## Partner attached ACR

Azure Consumed Revenue (ACR) is the primary metric used on Azure. Telemetry is automatically collected from all customer accounts for billing and usage reporting.

The ACR can be associated with a partner via a number of mechanisms. For Azure managed service providers, the three mechanisms are CSP, DPOR and PAL.

### Cloud Solution Provider

ACR from [Cloud Solution Provider](https://learn.microsoft.com/partner-center/csp-overview) (CSP) subscriptions is automaticall recognised for all partners involved in the transaction path.

Applies to both direct and indirect (provider/reseller) CSP models.

### Digital Partner of Record

Customers may use [Digital Partner of Record](https://learn.microsoft.com/partner-center/link-partner-id-for-azure-performance-pal-dpor#link-to-a-partner-id-with-dpor) (DPOR) to associate a services partner to an Enterprise Agreement (EA) subscription.

The intent is to recognise the partner whose professional services have had the most impact on the Azure services and associated customer outcomes. DPOR is configured by the customer. Only one partner can have DPOR on a subscription.

### Partner Admin Link

Partner Admin Link (PAL) recognises the impact of managed services into customer subscriptions.

The customer first allows the partner access to manage their resources via either

* traditional RBAC role assignments created for security principals (users, invited guests or service principals) used by the partner, or
* by delegating subscription(s) or resource group(s) with a partner's Azure Lighthouse service provider offer

The security principals with access may then be linked using Partner Admin Link (PAL) to the partner's Microsoft Partner Network ID (MPN ID). The partner is then associated with the telemetry for the Azure resources that those security principals can see.

The PAL process itself does not involve the customer. Permission is implicit in the RBAC assignments or Lighthouse delegations. PAL may be used with all subscription offer types (e.g. EA, CSP, PAYG) and is a more flexible and granular system that supports more complex multiple partner scenarios.

## Partner Earned Credit

[Partner Earned Credit](https://learn.microsoft.com/partner-center/partner-earned-credit) (PEC) is part of the new commerce experience for CSP and helps with simplification and transparency.

There is a list of [roles and permissions required to receive partner earned credit](https://learn.microsoft.com/partner-center/azure-roles-perms-pec).

The same set of roles - PEC eligible roles - are used for ACR association in PAL. Roles that onlty have read actions are not PEC eligible.

## Publishing to the Marketplace

One other area that is worthy of mention is the Azure Marketplace.

Any Lighthouse definitions that are [published as Managed Service offers to the Azure Marketplace](https://learn.microsoft.com/azure/lighthouse/how-to/publish-managed-services-offers) may then be deployed by customers. Delegated resources are then associated via the Marketplace attach type.

There is no need to use Partner Admin Link to associate security principals in Managed Service delegations.

## Links

* [Welcome to the Microsoft Cloud Partner Program](https://partner.microsoft.com/)
* [Solutions Partner designations](https://learn.microsoft.com/partner-center/introduction-to-pcs)
  * [Solutions Partner for Infrastructure](https://partner.microsoft.com/training/assets/collection/solutions-partner-for-infrastructure-azure#/)
  * [Solutions Partner for Digital and App Innovation](https://partner.microsoft.com/training/assets/collection/solutions-partner-for-digital-and-app-innovation-azure#/)
  * [Solutions Partner for Data and AI](https://partner.microsoft.com/training/assets/collection/solutions-partner-for-data-and-ai-azure#/)
  * [Solutions Partner for Security](https://partner.microsoft.com/training/assets/collection/solutions-partner-for-security#/)
* [Partner capability score](https://learn.microsoft.com/partner-center/partner-capability-score)
  * [Solutions Partner for Data & AI, Infrastructure, and Digital App & Innovation](https://learn.microsoft.com/partner-center/solutions-partner-azure)
    * [intermediate certs](https://learn.microsoft.com/partner-center/solutions-partner-azure#intermediate-certifications)
    * [advanced certs](https://learn.microsoft.com/partner-center/solutions-partner-azure#advanced-certifications)
    * [net customer adds](https://learn.microsoft.com/partner-center/solutions-partner-azure#net-customer-adds)
    * [usage growth](https://learn.microsoft.com/partner-center/solutions-partner-azure#usage-growth)
    * [deployments](https://learn.microsoft.com/partner-center/solutions-partner-azure#deployments)
  * [Solutions Partner for Security](https://learn.microsoft.com/partner-center/solutions-partner-security)
* [Solutions Partner Insights](https://partner.microsoft.com/dashboard/insights/mpninsights/solutionspartner?source=docs) (Partner Insights)
* Partner Attached ACR
  * [Cloud Solution Provider](https://learn.microsoft.com/partner-center/csp-overview)
  * [Digital Partner of Record](https://learn.microsoft.com/partner-center/link-partner-id-for-azure-performance-pal-dpor#link-to-a-partner-id-with-dpor)
  * [Partner Admin Link](https://aka.ms/partneradminlink)
* [Partner Earned Credit](https://learn.microsoft.com/partner-center/partner-earned-credit)
  * [Roles and permissions required to receive partner earned credit](https://learn.microsoft.com/partner-center/azure-roles-perms-pec)
* [Publish a Managed Service offer to Azure Marketplace](https://learn.microsoft.com/azure/lighthouse/how-to/publish-managed-services-offers)

## Next

In the next section we will go a little deeper on Partner Admin Link, on resource projection and security principals in an Azure Lighthouse context, and which roles are eligible for partner earned credit and therefore ACR recognition via PAL.
