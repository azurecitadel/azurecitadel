---
title: "Pipelines"
description: "Adding greater security to pipelines deploying Terraform to Azure"
date: 2024-02-19
draft: true
weight: 20
menu:
  side:
    identifier: 'terraform-pipelines'
    parent: 'terraform'
---

## Introduction

There are a number of existing blog pages and guides for plumbing in pipelines deploying Terraform infrastructure as code from repos to Azure. This is an area I have done much work with customers to help secure their pipelines so I wanted to share some of the standards I like to use to create an improved baseline.

These pages will focus on Azure DevOps pipelines and GitHub Actions, but the principles can be transposed to other CI/CD platforms. It will focus on sysops in terms of deploying infrastructure as code, rather than securing pipelines for application build and deploy.

The pages will cover a couple of sensible levels. Here are some of the key features that I will be introducing, and the architectural reasons why.

TODO: Add in a short video and deck?

## Default

As a standard, there are a few tenets that I employ as standard, even for dev/test environments.

- Remote State

  The Terraform state will be stored in Azure Storage Accounts, providing remote state and locking via blob leases. The Terraform state needs to be protected and may contain secrets in plain text. The storage account configuration here will have a few key features:

  - Use RBAC model for blob access

    Storage accounts have a few methods for [authorising access to blob storage](https://learn.microsoft.com/en-us/azure/storage/common/authorize-data-access?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json&tabs=blobs). One is using storage account Shared Keys, another is based on generating SAS tokens (account, service, or user delegation), but the recommended approach is based on Azure RBAC role assignments of role definitions such as Storage Blob Data Contributor.

    Only a select number of privileged roles such as Owner, User Access Administrator, or RBAC Administrator can authorise RBAC access. It is recommended to use Privileged Identity Management for these roles to enhance security in line with least privilege and just in time access.

    It is also possible to add conditions to these roles to limit the permitted security principals and/or role definitions.

    Note that the scope for RBAC role assignments may be as granular as individual containers within an account. They may also include conditions via ABAC. However these pages will keep it simple and work purely as the storage account level as that is the simplest to manage from an operational point of view.

  - Disable Shared Key Access

    As anyone with Contributor level access can access Shared Keys then it is a recommendation to disable Shared Key access. Note that Shared Key Access is the default access method used by Terraform for Azure backends including read only state, and therefore security is improved by removing it.

    Disabling shared key access also disables the account and service level SAS tokens.

    The only remaining access mechanisms are Azure RBAC, plus user delegation SAS which also required Entra ID authentication.

  - Secure network protocols

    Enforce HTTPS and TLS 1.2.

    Note that the public PaaS endpoint is used in this version. See the enhanced version for more stringent network controls.

  - Versioning and Soft Delete

    Soft delete provides additional protection for blobs, and works well with versioning. The side benefit of versioning is that it can permit a view of historical changes and the ability to run a diff against versions to see what changed.

    Storage account also support immutability options.

- User Assigned Managed Identities

    Many of the guides for pipelines will use service principals. These are fine to use if managed correctly, but for Azure deployments the recommendation is to use User Assigned Managed Identities as they are more secure and easier to manage.

    For instance, you can quickly view a User AssignedManaged Identity

- OpenID Connect and federated workload credentials

    Most CI/CD platforms support OpenID Connect as a standard to create a granular trust relationship between two identity providers, such as GitHub and Entra ID. The audience and subject in the claim is used to define where it can be called from, and can be linked to a service connection in Azure DevOps, or a specific repo, branch, environment, or workflow in GitHub Actions.

    This approach is far more robust than using secrets as they can be a liability if leaked, or if a GitHub secret is used by another workflow. It is possible to authenticate as a service principal using the secret as a password and gain the full set of RBAC privileges given to that security principal. Also, there is the overhead of cycling secrets as they have an expiry date.

    Note that the Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials/write action is currently not as privileged as an RBAC role assignment, and can be used by Contributor and Managed Identity Contributor role assignments. Hopefully this will be excluded in a notAction in the future and reserved for a privileged role.

## Pages
