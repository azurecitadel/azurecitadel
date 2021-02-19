---
title: "Access Checks"
description: "Run through these commands to check that you have the right permissions in your tenant to deploy Enterprise Scale onto your multiple subscriptions. "
layout: single
weight: 2
draft: false
series:
 - es-hack
menu:
  side:
    parent: es-hack
---

## Overview

This hack will require someone in the team to have high levels of access as we will be working with security groups, management groups and RBAC and policy assignments. Ideally you will be Global Admin in your Azure AD tenant and Owner of your subscription.

**Please test that you have the correct AAD and subscription permissions in advance of the hack.**

If you get any error messages (e.g. _Insufficient privileges to complete the operation_) then speak to the Global Admin and/or Owner to request that your access permissions are increased.

> Alternatively you may need to create a separate tenant and generate a few [Microsoft IDs](https://signup.live.com/) and [trial subscriptions](https://azure.microsoft.com/free/).

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

The following code block will tidy everything up.

```bash
az group delete --name eshack-deleteme --yes
az policy assignment delete --name eshack-deleteme --scope $mgScope
az policy assignment delete --name eshack-deleteme
az role assignment delete --role Reader --assignee $groupObjectId --scope $mgScope
az role assignment delete --role Reader --assignee $groupObjectId
az ad group delete --group eshack-deleteme
az account management-group delete --name eshack-deleteme
```

## Next steps

OK, if you have reached here with no errors then you should be good to go!
