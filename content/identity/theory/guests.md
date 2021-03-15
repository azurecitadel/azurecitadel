---
title: "Guest Accounts"
date: 2021-01-21
draft: true
author: [ "Richard Cheney" ]
description: "Guest Accounts that have been invited from one directory to another using AAD B2B."
weight: 3
menu:
  side:
    parent: 'identity-theory'
---

## Description

Guest Users are added via an invitation process using the AAD B2B (business to business) functionality. The process adds an external user - one that belongs to another tenant - into the directory.

The benefit is that a user only needs to exist in their home tenant directory and can still be granted access to applications, roles and/or resources in another company's tenant. WHen they authenticate then they are using their standard authentication credentials which is far preferable to having a proliferation of multiple identities and separate passwords. By nature that approach leads to the use of weaker and reused passwords, and credentials for external users can often remain longer than needed unless there are active access reviews.

# Azure AD B2C

Note that Azure AD B2C (business to consumer) is another external identity technology that allows customers to use their preferred personal cloud identity (Google, Twitter, Facebook and Microsoft) to access applications. AAD B2C cannot be assigned roles in either Azure AD or Azure so we will ignore those for now.

## Limitations

Note that Members can create service principals by default, but AAD B2B Guests are not permitted to do so unless they are

## References

* [](https://docs.microsoft.com/azure/active-directory/external-identities/b2b-quickstart-add-guest-users-portal)
