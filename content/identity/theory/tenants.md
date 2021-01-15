---
title: "AAD Tenants and Directories"
date: 2021-01-21
draft: true
author: [ "Richard Cheney" ]
description: "Azure Active Directory, tenants and directories."
weight: 1
menu:
  side:
    parent: 'identity-theory'
---

## Introduction

This page will cover some (but not all) of the core information for AAD tenants and directories, focusing on where it is relevant to Azure's authentication and RBAC model.

There are links in the [References](#references) section if you wish to explore the full Microsoft documentation.

## Whats is Azure Active Directory?

Azure Active Directory is Microsoft's cloud based Identity and Access Management (IAM) platform. It is often shortened to Azure AD or AAD.

AAD is used by both Azure and by Microsoft 365. Azure AD is not part of the Azure platform itself and is considered a separate SaaS service. The REST API for Azure AD is Microsoft Graph, as opposed to the Azure Resource Manager (ARM) REST API.

The functionality in AAD is different to on prem AD DS. For instance there is no Group Policy, no Organizational Units and no Computers. AAD is often connected to an on prem AD DS for identity synchronisation but that is not a requirement and it can be used purely standalone.

AAD can be used as an identity platform for SSO authentication to non-Microsoft applications as it uses modern open standards such as OAuth and OpenID. There are thousands of pre-integrated third party applications available in the App Gallery. There are services and documentation for configuring your own apps.

Identity has taken over from the network boundary as the new security frontier as modern application access is from anywhere and from any client device. Over 99% of the major breaches last year were attributed to compromised user credentials. AAD is very strong on security with a focus on Least Privilege, Zero Trust, Multi Factor Authentication, Conditional Access and intelligent intrusion detection based on deep machine learning models using the trillions of available signals.

The core AAD functionality is free, but some of the advanced functionality, such as Conditional Access and Privileged Identity Management, require additional licences.

## Tenants

Each organisation that uses AAD is a tenant. Each tenant has a unique tenantId GUID.

Each tenancy has a primary domain. You will have an AAD tenant if you have an Azure subscription.

If you create an Azure subscription with an email address such as first.last@mycompany.com then the default primary domain will be mycompany.onmicrosoft.com. If other users with a mycompany.com address use AAD then they will automatically be added as members of the same tenant.

If you use a Microsoft email address such as first.last@outlook.com then the default primary domain will be firstlastoutloo930.onmicrosoft.com, where the 930 is a random 3 digit code to ensure uniqueness. You will automatically be granted the Global Administrator role.

You can also have secondary domains. Adding custom domains requires access to public DNS for that domain, using TXT records to validate ownership. You can then promote any validated custom domain to become the primary.

You can also configure the company branding.

## Directories

Each AAD tenant has a single directory.

The directory is used to store users and groups. Users includes standard members, plus the other types of security principals such as guest users, service principals and managed identities. Groups includes both security groups and Microsoft 365 groups.

As there is a 1:1 relationship of tenant to directory then the terms are often used interchangeably.

## Portal

Log in to the [Azure Portal](https://portal.azure.com/) and type "aad" in the search bar to find Azure Active Directory.

![AAD](/identity/theory/images/aad.png)

Note that the tenantId can be found on this screen. The Custom Domain names are in the blade on the left hand side.

Azure AD admins can also use the <https://aad.portal.azure.com> to get to a more focused portal with the majority of the Azure services removed.

![aad.portal.azure.com](/identity/theory/images/focused.png)

You can always customise your favourites on the left hand side of the portal. Click on All Services and toggle the stars on and off.

![favourites](/identity/theory/images/favourites.png)

The favourites for <https://aad.portal.azure.com> and for <https://portal.azure.com> are preserved separately. Here I have added a few more from the Identity category:

* Administrative Units
* Groups
* App Registrations

These will be useful as you move through the next few pages.

## References

* [Azure AD](https://azure.microsoft.com/services/active-directory/)
* [Azure AD Fundamentals](https://docs.microsoft.com/azure/active-directory/fundamentals/)
* [What is Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis)
* [Compare Azure AD with AD DS](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-compare-azure-ad-to-ad)
