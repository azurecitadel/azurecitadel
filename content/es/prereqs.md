---
title: "Prereqs"
description: "Attending an Enterprise Scale partner hack? Get these done before it starts and then check you have the right access."
layout: single
weight: 1
draft: false
series:
 - es
menu:
  side:
    parent: es
aliases:
    - /es/hack/prereqs/
    - /es/hack/checks/
---


## Subscriptions

_**IMPORTANT**_: **You will need three subscriptions** (absolute minimum of two) **to deploy Enterprise Scale. All subscriptions need to be in the same tenant.**

Minimum RBAC permissions required at root scope (i.e. above Tenant Root Group):

* User Access Administrator
* Contributor

There is a set of [checks](#checks) to ensure that you have required permissions. Complete these before the hack.

## Setup

You will need to have a GitHub ID for the hack, and your laptop should be setup with the right tooling.

**You should complete the [setup](/setup) in advance of the hack.**

> Open up a new tab for the page

Required:

* GitHub ID
* Linux environment
* Binaries (git and jq)
* Azure CLI
* Visual Studio Code
  * Remote Development pack for WSL
  * Additional extensions
* Terraform (optional)

> You can skip the Packer install if you wish.

## Tenant level permissions

This hack will require someone in the team to have high levels of access as we will be working with security groups, management groups and RBAC and policy assignments. You will need someone in you team to have Global Admin in your Azure AD tenant

Follow the instructions to elevate the Global Admin to

1. enable User Access Administrator at the tenant root
1. add Owner role to allow the tenant scope template to work

Instructions:

* [Configure Azure permissions for ARM tenant deployments](https://github.com/Azure/Enterprise-Scale/blob/main/docs/EnterpriseScale-Setup-azure.md)

**Please test that you have the correct AAD and subscription permissions in advance of the hack.**

If you get any error messages (e.g. _Insufficient privileges to complete the operation_) then speak to the Global Admin and/or Owner to request that your access permissions are increased.

> Alternatively you may need to create a separate tenant and generate a few [Microsoft IDs](https://signup.live.com/) and [trial subscriptions](https://azure.microsoft.com/free/).

The root (/) permissions can removed after the initial deployment as long as the security principal has the appropriate management group and subscription level permissions for lifecycle management.

## Checks

Run through the following tests to check your permissions.

1. Login to the right context

    ```bash
    az login
    az account show
    ```

    > Use `az account set --subscription <subscription_id>` if you need to switch.

1. Set default location and grab subscription scope

    ```bash
    export AZURE_DEFAULTS_LOCATION=uksouth
    subscriptionScope=/subscriptions/$(az account show --query id --output tsv)
    ```

    > The location will only be defaulted for the current session. Use `az configure --defaults location=uksouth` to persist the default.

1. Security groups?

    ```bash
    az ad group create --display-name eshack-deleteme --mail-nickname junk
    groupObjectId=$(az ad group show --group eshack-deleteme --query objectId --output tsv)
    ```

    > If you cannot create objects in AAD then it is possible to work around it. Or request others to create AAD objects for you.

1. Management groups?

    ```bash
    az account management-group create --name eshack-deleteme
    mgScope="/providers/Microsoft.Management/managementGroups/eshack-deleteme"
    ```

1. Resources?

    ```bash
    az group create --name eshack-deleteme
    ```

1. Role assignments?

    ```bash
    az role assignment create --role Reader --assignee $groupObjectId --scope $mgScope
    az role assignment create --role Reader --assignee $groupObjectId
    ```

1. Policy assignments?

    ```bash
    az policy assignment create --name eshack-deleteme --policy 0a914e76-4921-4c19-b460-a2d36003525a --scope $mgScope
    az policy assignment create --name eshack-deleteme --policy 0a914e76-4921-4c19-b460-a2d36003525a
    ```

## Cleanup

The following code block will tidy everything up from the checks.

```bash
az group delete --name eshack-deleteme --yes
az policy assignment delete --name eshack-deleteme --scope $mgScope
az policy assignment delete --name eshack-deleteme
az role assignment delete --role Reader --assignee $groupObjectId --scope $mgScope
az role assignment delete --role Reader --assignee $groupObjectId
az ad group delete --group eshack-deleteme
az account management-group delete --name eshack-deleteme
```

## Pre-reading

If you are attending an Enterprise Scale partner hack and need a basic overview of using git, or a grounding in the basic concepts in Enterprise Scale, then use these links:

| **Page** | **Description** |
|---|---|
| [Git 101 Basics](https://www.youtube.com/watch?v=WBg9mlpzEYU) | Grounding on Git with Scott Hanselman |
| [Git Pull Requests Explained](https://www.youtube.com/watch?v=Mfz8NQncwiQ) | Pull requests or PRs in Git |
| [Enterprise Scale Learning Path](https://docs.microsoft.com//learn/paths/enterprise-scale-architecture/) | Microsoft Learn modules for Enterprise Scale |

## Next steps

OK, if you have reached here with no errors then you should be good to go!
