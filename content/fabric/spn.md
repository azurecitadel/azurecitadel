---
title: "Service Principal"
description: "Configure a service principal for use with the fabric provider."
layout: single
draft: true
menu:
  side:
    parent: fabric
    identifier: fabric-spn
series:
 - fabric_terraform_administrator
weight: 35
---

## Introduction

On this page we will create a service principal that can be used by CI/CD pipelines and configuring the Fabric tenant settings to permit its use.

This will be a short one as we won't touch any CI/CD platform specifics until the following page. (E.g., configuring the OpenID Connect credentials, pushing our Terraform config up into the GitHub repo, configuring pipeline variables, and running the pipeline itself.) This will be a cleaner break point for those of you who want to look at Azure DevOps or GitLab as alternatives to using GitHub as we will follow a similar process.

## Service Principal overview

{{< flash >}}
**_Is the service principal configuration non-standard?_**

Again, much like the user context, yes. This is a reflection on Microsoft Fabric as a SaaS offering and the Fabric REST API authentication that propagates through the Go SDK for Fabric.

There is a tenant setting in the Fabric admin pages, "Service principals can use Fabric APIs", and this can be configured either

- for all service principals, or
- to a specific Entra security group

**_So no role API permissions?_**

No. Usually when looking at app registrations and API permissions you have either

- Delegated access or user impersonation, which is access on behalf of a user as we configured on the user  page. It is based on delegated API permissions, also known as scoped permissions. And if you remember we exposed an API, preauthorised a few clients (such as the Azure CLI) and authenticated to it.
- app-only access with standalone security principals used for automation, backup, daemon service scenarios  etc. The use app roles instead of delegated scopes, and permissions via admin consent. This allows explicit granular control over that app's authorisations.

With the Fabric model it allows either service principals or managed identities, but it does not make use of app roles and therefore is no granularity to control _which_ REST API calls are permitted.

The only real control point is the tenant setting.

**_Could I use a managed identity?_**

Yes, and that is one benefit of not having to use role API permissions. You could define a managed identoty and use it for fabric terraform provider, and you could also add Azure RBAC role assignments for standard azurerm and azapi resources. Managed identities are a good security recommendation.

**_Why are you using a service principal then?_**

One reason is that in my fuller example I also assign role API permissions to the Microsoft Graph
{{< /flash >}}

## Creating the service principal

Based on <https://registry.terraform.io/providers/microsoft/fabric/latest/docs/guides/auth_app_reg_spn>. These commands

- create an app reg
- create an associated service principal
- takes ownership of both

```shell
az ad app create --display-name fabric_terraform_provider_service_principal --required-resource-accesses @manifest.role.json --identifier-uris api://terraform_fabric_administrator --query id -otsv)
appObjId=$(az ad app create --display-name terraform_fabric_administrator --required-resource-accesses @manifest.role.json --identifier-uris api://terraform_fabric_administrator --query id -otsv)
appId=$(az ad app show --id $appObjId --query appId -otsv)
spObjId=$(az ad sp create --id $appObjId --query id -otsv)
myObjId=$(az ad signed-in-user show --query id -otsv)
az ad app owner add --id $appObjId --owner-object-id $myObjId
az rest --method POST --url "https://graph.microsoft.com/v1.0/servicePrincipals/${spObjId}/owners/\$ref" --body "{\"@odata.id\": \"https://graph.microsoft.com/v1.0/users/${myObjId}\"}"
az ad app permission admin-consent --id $appId
```
