---
title: "Understanding PAL"
date: 2025-10-10
author: [ "Richard Cheney" ]
description: "Learn about Partner Admin Link, why it's important, how it works, and your options."
draft: false
weight: 10
menu:
  side:
    parent: pal
    identifier: pal-theory
series:
  - pal
---

## Introduction

The key recommendations are in the blue boxes on this theory page, plus additional information if you need more explanation. After this page you will find common ways to configure PAL - for users, for service principals, and via Azure Lighthouse - and finally an FAQ.

## In brief

{{< flash >}}
Partner Admin Link (PAL) is a mechanism used by Microsoft to recognise a partner's influence in customer's Azure subscriptions. For the recognition to work you need access to those customer subscriptions, and you need to configure PAL:

1. one or more eligible security principals in the customer tenant
1. that are linked to your Partner ID
1. and have one or more eligible RBAC role assignments

If these are all in place then your organisation will be recognised for influence on the resources under those role assignment scopes.
{{< /flash >}}

There is one variant on the above criteria for partners using Azure Lighthouse which we'll cover separately.

## What is Partner Admin Link?

Partner Admin Link (PAL) is one of the mechanisms used by Microsoft to recognise a service partner's influence in customer's Azure subscriptions. The other main mechanism is Cloud Solution Provider (CSP). Both are used by partners in the Microsoft AI Cloud Partner Program (MAICPP), which is the current name for what used to be the Microsoft Partner Network.

In this context, influence is based on the idea that if you are providing a managed service then you will have ongoing access to the customer subscriptions with a minimum level of access. Use PAL to link to your partner organisation - which doesn't require anything additional from the customer - and your company will receive the recognition based on the ongoing telemetry against the resources under the RBAC role assignment scopes.

The process is sometimes called PAL tagging.

## What do you mean by eligible security principal?

Security principal is an Entra ID term. Here are the types that you can use.

- **Directory accounts**: User IDs that the customer creates for you in their own directory. Usually called users or members.
- **Guest users**: The customer invites your ID to their directory. Usually called guests or invited users.
- **Service principals**: Service principals are system accounts. They are often referred to as app registrations (as they're closely related), or enterprise apps (as that is where you'll find them in Entra's admin portal.).
- **Managed identities**: These are the exception as they are out of scope for PAL. They are a special type of service principal created as an Azure resource and linked to services (user assigned managed identities), or directly associated with the lifecycle of an Azure resource, e.g. the system assigned managed identity for, say, a virtual machine.

{{< flash >}}
If you have a team of people providing a managed service into the customer account then it is recommended to get each and every one to link the user or guest IDs in the customer context, i.e. when they have switched to the customer's directory. Make it part of your standard processes when each person works on a new customer for the first time. Maximising coverage helps avoid sudden losses of PAL recognition through employee attrition.

Using service principals is highly recommended as they do not leave organisations.
{{< /flash >}}

The Azure documentation states that you cannot use Partner Admin Link on managed identities. So an eligible security principal in the PAL context is any user, guest, or service principal in the customer's tenant that you can authenticate as, and then link.

## What is the Partner ID?

Speak to the Account Admin for Partner Center to find your Partner ID. There are two types of identifier in Partner Center. They were historically called MPNIDs (when MCAIPP was the Microsoft Partner Network) so you may still see that in some documentation.

- Partner Global Account (PGA)

    There is a single ID for each partner found in Settings > Account Settings > Identifiers. This was historically known as the v-org MPNID. These IDs cannot be used with PAL.

- Partner Location Accounts (PLAs)

    Location-level accounts under the PGA, formerly known as Location IDs. Large organisations may have created multiple PLAs to reflect their various different regions, countries, subsidiaries, or offices. Found in Settings > Account Settings > Organization profile > Legal info > Partner > Business locations.

{{< flash >}}
The first Partner Location Account ID is created automatically when creating the Partner Global Account. The number for this first Partner Location Account will always be exactly one higher than the number for the Partner Global Account.

This is the default PartnerID recommendation for PAL.
{{< /flash >}}

## How do you actually create a Partner Admin Link?

### Users and Guests

For users and guest IDs, the employee can authenticate in the customer's context and then configure the link using either the Azure Portal, Azure CLI, or PowerShell.

{{< flash >}}
Linking should be done in every customer context. At a technical level the link connects the Entra security principal's objectId (which belongs to the customer's tenantId) with the PartnerID.

For example, if a user's ID (i.e. _first.last@partnername.com_) has ben invited as a guest into 30 different customers then they should switch to each of those 30 directories in turn and create the Partner Admin Link for the objectId in that tenant.
{{< /flash >}}

All are covered in the [User IDs & Pal](./users) page as well as the official [Link to a partner ID by using a PAL](https://learn.microsoft.com/partner-center/membership/link-partner-id-for-azure-performance-pal-dpor#link-to-a-partner-id-by-using-a-pal) page.

### Service Principals

For security principals, then it depends. Where the service principal's secret is known - e.g. when you are creating the service principal - then you can authenticate and run the command using the CLI or PowerShell. If it is a service principal authenticating using OpenID Connect then you can add the commands into a workflow that meets the federated workload credential's subject.

Both approaches are covered on the [Service Principals & PAL](./sp) page.

### Via Azure Lighthouse

Azure Lighthouse is slightly different as the managed service delegations project resources from the customer's tenant to the managed service provider (MSP). The authorisations in the service definition define the MSP's access which uses the security principals (users, service principals, and security groups) in the MSP's tenant. Therefore that is where the Partner Admin Link's are defined, applying to any and all Azure Lighthouse delegations where they are included. A benefit of this approach is that link only needs to be created once.

{{< flash >}}
The approaches are not mutually exclusive. It is perfectly fine to use multiple approaches.
{{< /flash >}}

If you are already using Azure Lighthouse with your customers then it is one of the easiest and most effective methods for PAL tagging at scale. See the [Azure Lighthouse & PAL](./pal) for more information.

## Which Azure RBAC roles are eligible?

{{< flash >}}
As per the documentation, use an [Azure built-in role that is eligible for partner earned credit](https://learn.microsoft.com/partner-center/azure-roles-perms-pec) (PEC).
{{< /flash >}}

Based on the list there is no hard rule, but the following statements are generally true:

- reader roles are not PEC eligible
- contributor roles - i.e. those that include write and delete control plane actions - are eligible
- PaaS service roles _may_ be eligible. Check the list. An example anomaly is Cognitive Services User, a role which is ineligible despite including listkeys for the control plane, whilst Azure Service Bus Data Receiver - which only has read actions on the control plane - is eligible.

There appears to be a subjective aspect to these in the list depending if they are based on the provision of a solution rather than use of a service.

## Does Privileged Identity Management have an impact?

Absolutely. One very important nuance to be aware is that the telemetry association is dependant on the role assignments that are active at any point in time.

For example, say there is only one linked user ID with a permanent role of Reader and an eligible role of Contributor. If The Contributor role is activated at the subscription scope for eight hours in a month then the recognised influence would be 8 / 730 hours. (Azure uses 730 hours a month for billing purposes.) If it is only activated for one of many resource groups in the subscription then it will be an even smaller fraction.

{{< flash >}}
It is recommended to include both Reader and Support Request Contributor as the permanent roles for Privileged Identity Management (PIM). Support Request Contributor is PEC eligible and most customers view it as a reasonable role to have permanently active.
{{< /flash >}}

## Does it matter about where and when the RBAC role assignments are created?

Yes. It is a common misconception that any RBAC assignment in a subscription should mean that the whole subscription will be recognised. The recognition works by associating the telemetry which is constantly collected for Azure billing for every second on every resource, and it uses the eligible role assignments to determine the scope of the resource telemetry. This is by design, so that in a multi-partner scenario everyone can be recognised correctly for their influence on the right resources.

Telemetry association is based on the scope point for the assignment.

- If the scope point is the subscription scope then recognition will be for the whole subscription.
- If the scope is a resource group then the recognition will naturally be attached to that subset of resources in the subscription.
- If the scope point is a management group then it will apply to all of the subscriptions that roll up into the management group.
- If users have eligible role assignments on differing scope points then creating Partner Admin Links on each of their IDs will ensure that you gain recognition for the full union of resources under their collective scope points.

Telemetry association starts and stops based on the lifecycle of the role assignment.

- If a role assignment is created part way through a month then you will not see recognition for the whole month.
- When a role assignment is deleted then the related telemetry association stops at that point in time.

## What about Cloud Solutions Provider?

If the partner is in the contractual chain for a Cloud Solutions Provider (CSP) subscription - as a Direct Bill Partner (formerly Direct CSP), Indirect Provider (Distributor), or Indirect Reseller - then that influence will be recognised automatically as CSP. There is usually no benefit to configure PAL in this scenario.

However, if you are providing a service in a CSP subscription which is is with another partner then you may still configure PAL to get recognition for your influence. Likewise, it has been known for customers to migrate from CSP subscriptions to MCA-E subscriptions if they have signed a Microsoft Azure Consumption Commitment (MACC). Setting up PAL would help avoid loss of recognition.

## Next

A reminder of the general recommendations for PAL

- Include [roles eligible for partner earned credit](https://docs.microsoft.com/partner-center/azure-roles-perms-pec) (PEC)
- Link all admins as part of your standard procedures
- [Link service principals](https://docs.microsoft.com/azure/lighthouse/how-to/partner-earned-credit)
- For traditional access, [link in all customer contexts](https://docs.microsoft.com/azure/cost-management-billing/manage/link-partner-id#frequently-asked-questions), even for guest IDs
- For Azure Lighthouse, link in the service provider's home tenant

OK, that is the core of the theory around Partner Admin Link. Hopefully it will have answered most of your questions about how it all hangs together. You will find a link to the official FAQ plus any additional questions that we receive. Next up is how to configure Partner Admin Link for users.
