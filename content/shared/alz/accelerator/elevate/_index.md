---
headless: true
title: "Azure Landing Zones - Bootstrap Prereqs"
---

## Overview

{{< flash >}}
The bootstrap process is a one-time operation that securely configures your Azure environment with the required workload identities and applies appropriate least privilege RBAC assignments. However, to execute this bootstrap, elevated privileges are temporarily required at the tenant root scope.

This elevation typically involves a Global Administrator either:

- Elevating their own privileges to run the bootstrap process themselves, or
- Temporarily elevating permissions for another user who will execute the bootstrap

These elevated privileges are only needed for the bootstrap operation. Once complete, it's important to remove these temporary permissions. The labs include a [demotion step](../demote) that demonstrates how to safely remove the temporary privileged role assignment after the bootstrap has finished.
{{< /flash >}}

## Elevate the Global Administrator

1. Log in to the [Azure Portal](https://portal.azure.com)
1. Open [Microsoft Entra ID](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview)
1. Navigate to Manage > [Properties](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Properties)

    ![Elevating Global Administrator for RBAC role assignments](/shared/alz/accelerator/elevate/elevate.png)

1. Toggle **Access management for Azure resources** to Yes
1. Click on **Save**

(This effectively gives the Global Administrator User Access Administrator at the root scope, `/`.)

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
