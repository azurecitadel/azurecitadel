---
headless: true
title: "Azure Landing Zones - Bootstrap Demotion"
---

## Overview

<COPILOT>
<TODO> Switching persona info.

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

\<TODO>

## References

* <https://aka.ms/alz>
* <https://aka.ms/alz/accelerator/docs>
* <https://github.com/Azure/alz-terraform-accelerator>
