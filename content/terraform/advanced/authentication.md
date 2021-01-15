---
title: "Authenticating to Azure"
date: 2021-01-21
draft: true
author: [ "Richard Cheney" ]
description: "What are the possible options for authenticating to Terraform? When do they apply?"
weight: 1
menu:
  side:
    parent: 'terraform-advanced'
---

## Authentication Methods

There are three main ways of authenticating the Terraform provider to Azure:

1. Azure CLI
1. Service Principals
1. Managed Identity

### Azure CLI

This is the default authentication method if you haven't specified alternative credentials in your provider block.

When you authenticate your user principal in

### Service Principals

Text

### Managed Identity

Managed Identity was originally called Managed Service Identity and is still abbreviated to MSI. It is a variant of

### Cloud Shell

One additional variant is Azure's Cloud Shell. This runs in the browser, and the backend is a small linux container (the image is held on DockerHub) and uses a blend of MSI and user RBAC credentials to authenticate. The container is ephemeral, but uses a storage account to persist the user's home directory and to provide an SMB based clouddrive area.

Essentially the whole container is authenticated using your credentials and Terraform leverages MSI. Once you have started your Cloud Shell session you will be automatically logged in to Azure.  Terraform makes use of that authentication and context, so you are good to go.

This is useful for personal development, demos and access to Terraform from anywhere, but it is not recommended for production and/or multi-admin use.

## References

* [Authenticating using the Azure CLI](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/azure_cli)
* [Authenticating using a Service Principal with a Client Secret](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/service_principal_client_secret)
* [Authenticating using a Service Principal with a Client Certificate](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/service_principal_client_certificate)
* [Authenticating using Managed Identities](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/managed_service_identity)
