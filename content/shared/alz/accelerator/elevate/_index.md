---
headless: true
title: "Azure Landing Zones - Bootstrap Prereqs"
---

## Overview

<COPILOT>

## Elevate

\<TODO>

## Assign the role for the bootstrap

1. Login to Azure

    ```bash
    az login --allow-no-subscriptions --tenant <tenantId>
    ```

    Or use the [Cloud Shell](https://shell.azure.com).

1. Variables

    ```bash
    tenant_id=$(az account show --query tenantId -otsv)
    assignee_object_id="$(az ad signed-in-user show --query id -otsv)"
    ```

    ℹ️ Assumes that the Global Admin will also run the bootstrap. If not, set assignee_object_id to the correct object ID.

1. Create the temporary RBAC role assignment at the tenant root group

   ```bash
   az role assignment create --assignee $assignee_object_id --role "Owner" --scope "/providers/Microsoft.Management/managementGroups/$tenant_id"
   ```
