---
title: "Managed Identity"
description: "Each connected machine has a system assigned managed identity. This lab will walk through using the REST API calls on your Arc-enabled servers to get challenge tokens, resource tokens and access the ARM and PaaS API endpoints"
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-hack-identity
series:
 - arc-servers-hack
weight: 200
---

## Introduction

Managed identities are the preferred security principal to use for trusted compute as it provides a sensible start of the trust chain. Managed identities are used extensively across Azure for virtual machines, containers, and services. They can be system assigned, with the same lifecycle as the compute they are associated with, or user created and assigned.

Trusted compute can access the Instance Metadata Service (IMDS) endpoint for metadata and also to get the access token for the managed identity. The metadata is used to query for other information such as resourceID, tenant and subscription IDs, tags, location etc. The token acquisition is used by different processes such as using `az login --identity` using the CLI on an Azure VM.

The great news is that connected machines also get a managed identity and the azcmagent service also provides a Hybrid Instance Metadata Service (HIMDS). Note that the IMDS and HIMDS endpoints differ:

| Service | IMDS_ENDPOINT | IDENTITY_ENDPOINT |
|---|---|---|
| IMDS | `http://169.254.169.254` | `http://169.254.169.254/metadata/identity/oauth2/token`
| HIMDS | `http://localhost:40342` | `http://localhost:40342/metadata/identity/oauth2/token`

You can give your Azure Arc-enabled server's managed identity RBAC role assignments to your resources, and then use the HIMDS service to acquire the tokens to authenticate to the API endpoints. This allows you to integrate your on prem servers with Azure services such as Azure Key Vault, Azure Storage, PaaS database services, etc.

## Azure Arc Jumpstart

Using Managed Identity is one of the many scenarios covered by the Azure Arc Jumpstart. If you haven't fully  explored the site then now is a good time to do so.

Find the right scenario to guide you on how to work with the Hybrid Instance Metadata Service on an Azure Arc-enabled server, and authenticate the system assigned Managed Identity against Azure APIs.

Once you have found the correct scenario then follow it to see the Bash commands and REST API calls to:

* Query the Hybrid Instance Metadata Service (HIMDS)
* Get challenge tokens and resource tokens
* Use the main Azure Resource Manager REST API
* Read a secret from an Azure Key Vault
* Upload a blob to an Azure Storage Account

## Resources

* [Azure Arc Jumpstart](https://aka.ms/azurearcjumpstart)

⚠️ Note that the Azure Arc Jumpstart is the only resource that is needed to complete this challenge. The following links are included as reference resources.

HIMDS (Azure Arc-enabled VMs)

* [Authenticate against Azure resources with Arc enabled servers](https://docs.microsoft.com/azure/azure-arc/servers/managed-identity-authentication)

IMDS (Azure VMs)

* [Instance Metadata Service - Linux](https://docs.microsoft.com/azure/virtual-machines/linux/instance-metadata-service?tabs=linux)
* [Instance Metadata Service - Windows](https://docs.microsoft.com/azure/virtual-machines/windows/instance-metadata-service?tabs=windows)
* [Using managed identities on standard Azure VMs](/vm/identity)
* [Acquiring access tokens for managed identities on Azure VMs](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/how-to-use-vm-token)
