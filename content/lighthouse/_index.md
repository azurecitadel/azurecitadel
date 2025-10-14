---
title: "Azure Lighthouse"
description: "Azure Lighthouse can be very useful, but also comes with some limitations that you should be aware of. Here are some useful"
draft: false
menu:
  side:
    identifier: lighthouse
aliases:
  - /partner/lighthouse
  - /partners/lighthouse
---

## Introduction

This some example Azure Lighthouse templates that you can use as a reference point for your own configuration. The examples all use the Support Request Contributor role which is eligible for partner earned credit and therefore for PAL recognition. See the Azure Lighthouse & Partner Admin Link section for more info.

## What is Azure Lighthouse?

[Azure Lighthouse](https://learn.microsoft.com/azure/lighthouse/) enables service providers and enterprises to manage resources across multiple tenants securely and at scale, using delegated resource management.

## Benefits

- Centralised management across multiple customers or tenants without context switching
- Support Privileged Identity Management for least privilege access
- Managed service provider side Azure Policy can be used across multiple customer tenants via management groups
- Very useful in certain scenarios e.g. centralised Security Operations Centres (SOCs)
- Cleanly separate from normal Identity & Access Management
- The customer can alway view the authorisations, the activity logs, and revoke and delegations or services

## Limitations

- Only supports standard Azure resources, i.e. those within the subscription hierarchy
- Restricted Azure Policy compliancy reporting
  - only shows customer side policies assigned at subscription scope
  - any policies assigned at management group level on the customer tenant are not visible via Azure Lighthouse
- No support for RBAC role definitions with dataActions
- Limited support (by design) for highly privileged role (i.e. no Owner, limited User Access Administrator)

## Recommendations

- Use Privileged Identity Management

    Include an [Azure built-in role that is eligible for partner earned credit](https://learn.microsoft.com/partner-center/azure-roles-perms-pec) as one of the permanent roles, e.g. Support Request Contributor

- Use Entra security groups and service principals in the authorisations

    Avoid using individual user principals in the service offer's authorisations.

    Updating a local security group for joiners and leavers is far easier than updating the service provider offer definition and version and then asking the customer to accept the change.

- Create [Partner Admin Links](/pal) for all of the user and service principals in the home tenant.

    Perform this as a one off task and then all security principals will automatically recognise the partner's influence in the customer accounts using those Azure Lighthouse service provider offers.

## Resources

- [Azure Lighthouse documentation](https://learn.microsoft.com/azure/lighthouse/)
- [Azure Lighthouse best practice for roles](https://docs.microsoft.com/azure/lighthouse/concepts/tenants-users-roles#best-practices-for-defining-users-and-roles)
- [Azure Lighthouse role support and limitations](https://docs.microsoft.com/azure/lighthouse/concepts/tenants-users-roles#role-support-for-azure-lighthouse)
- [Azure Lighthouse limitations for the cross tenant management experience](https://learn.microsoft.com/azure/lighthouse/concepts/cross-tenant-management-experience#current-limitations)

## Templates

Below are a set of template that will help you to get started with Azure Lighthouse.
