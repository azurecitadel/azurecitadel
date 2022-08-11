---
title: "Lighthouse and PAL"
date: 2022-08-11
author: [ "Richard Cheney" ]
description: "DESCRIPTION REQUIRED"
draft: true
weight: 1
menu:
  side:
    parent: partner
---

## Introduction

Help to maximise your partner attached ACR for the partner score. Use Azure Lighthouse for your multi-tenanted managed service delivery and combine with Partner Admin Link.

This lab will talk through the background so you have a high level understanding of the

* Solutions partner program
* Azure designations
* categories for the partner score
* partner attach mechanisms feeding into *Performance* and *Customer success*
* why combining Azure Lighthouse and Partner Admin Link
* an example of how to create an Azure Lighthouse definition, delegate the resources and link the security principals
* a more advanced example following least privilege with minimal permanent roles plus roles eligible for elevation using Privileged Identity Management

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

## Linking IDs



## References

* <https://github.com>