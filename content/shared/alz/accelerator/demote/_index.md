---
headless: true
title: "Azure Landing Zones - Bootstrap Demotion"
---

## Overview

The highly privilege role was only required for the bootstrap phase. If the bootstrap has run

## Remove the privileged RBAC role assignment

1. Variables

    ```bash
    tenant_id=$(az account show --query tenantId -otsv)
    assignee_object_id="$(az ad signed-in-user show --query id -otsv)"
    ```

    ℹ️ Assumes that the Global Admin will also run the bootstrap. If not, add in the correct object ID.

1. Create the temporary RBAC role assignment

   ```bash
   az role assignment delete --assignee $assignee_object_id --role "Owner" --scope "/providers/Microsoft.Management/managementGroups/$tenant_id"
   ```

## Remove the elevation

1. Log in to the [Azure Portal](https://portal.azure.com)
1. Open [Microsoft Entra ID](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview)
1. Navigate to Manage > [Properties](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Properties)

    ![Elevating Global Administrator for RBAC role assignments](/shared/alz/accelerator/demote/demote.png)

1. Toggle **Access management for Azure resources** to No
1. Click on **Save**

## References

* <https://aka.ms/alz>
* <https://aka.ms/alz/accelerator/docs>
* <https://github.com/Azure/alz-terraform-accelerator>
