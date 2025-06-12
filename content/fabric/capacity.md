---
title: "Fabric Capacity"
description: "You will need a Fabric capacity for this quickstart. List T-, P, and F-SKUs with the Fabric CLI and understand access to F-SKUs."
layout: single
draft: false
menu:
  side:
    parent: fabric
    identifier: fabric-capacity
series:
 - fabric_terraform_administrator
weight: 10
---

## Quick check

1. Check your Fabric CLI authentication status

    ```shell
    fab auth status
    ```

    Not logged in? Log in with `fab auth login`.

1. List the available capacities.

    ```shell
    fab ls -l .capacities
    ```

    Below is example output showing all three SKU types.

    ```text
        name                                                 id                                     sku   region      state
    ---------------------------------------------------------------------------------------------------------------------------
    Premium Per User - Reserved.Capacity                     59d17bf8-cda2-4c43-824a-ec3a8078908d   PP3   West US 3   Active
    Trial-20250314T172025Z-xmVeQXcryUKTbE5vcFY5Dg.Capacity   29dc2bec-dc5e-4c0a-85bc-564d96106653   FT1   West US 3   Active
    example.Capacity                                         3da9391c-0cbb-4005-952a-1007a3021888   F2    UK South    Active
    ```

    **The two key columns for the fabric Terraform provider are the Fabric capacity Name and ID.**

## SKU types

As per the table above, you have three SKU options to create a for Fabric capacity.

1. **Fabric Capacity (F-SKU)**

    Follow the guide to [create a new F-SKU capacity](https://learn.microsoft.com/fabric/admin/capacity-settings?tabs=fabric-capacity#create-a-new-capacity) in Azure. The F-SKUs are recommended for production use, but note that they will incur costs on your Azure subscription as per the [pricing page](https://azure.microsoft.com/pricing/details/microsoft-fabric/).

    Example commands to create an F2 SKU:

    ```bash
    az group create --name "fabric" --location "UK South"
    upn=$(az ad signed-in-user show --query userPrincipalName -otsv)
    az fabric capacity create --capacity-name "example" --resource-group "fabric" --location "UK South" --sku "{name:F2,tier:Fabric}" --administration "{members:[${upn}]}"
    ```

1. **Premium Per User Capacity (P-SKU)**

    Follow the guide to [create a new P-SKU capacity](https://learn.microsoft.com/fabric/admin/capacity-settings?tabs=power-bi-premium#create-a-new-capacity) using your Power BI Premium licences. Note that the P-SKUs are being phased out as [Microsoft simplifies the Microsoft Fabric purchasing options](https://powerbi.microsoft.com/blog/grace-period-for-transitioning-from-power-bi-premium-to-microsoft-fabric/). Also note that Free or Pro licences in Power BI are not sufficient for creating workspaces.

1. **Trial capacity (T-SKU)**

     Follow the guide to [create a 60-day T-SKU trial capacity](https://learn.microsoft.com/fabric/fundamentals/fabric-trial).

## Access to F-SKUs

You will only see an F-SKU Fabric capacity if you are one of the **Capacity Admins**, or if you are assigned as a **Contributor**.

### Capacity Admins

Only one admin may be specified when first creating a Fabric capacity in the portal. You can then go back in and update it with additional users or service principals.

- View the [Fabric capacities](https://portal.azure.com/#browse/Microsoft.Fabric%2Fcapacities)
- Select the correct Fabric capacity
- Settings > Capacity administrators

![Screenshot of the Azure Portal showing the Capacity administrators settings for a selected Fabric capacity. The interface includes options to add or remove administrators and displays the current list of assigned admins.](/fabric/images/azurePortal_capacityAdmins.png)

Note that Terraform also allows us to assign a security group. This is not currently possible via the portal.

You cannot assign a guest user as a Capacity Admin.

### Contributors

You can also view and modify capacities in the Admin Portal if you have the Fabric Administrator role in Entra. This is one of the easiest places to set any Contributors on a Fabric capacity.

- Open [Fabric Portal](https://app.powerbi.com?experience=fabric-developer)
  - click on the bottom left to toggle between Power BI and Fabric experiences
- click on the Settings cog at the top right
- Admin Portal
- Capacity settings

![Screenshot of the Admin Portal showing a list of Fabric capacities. Each capacity is displayed with details such as name, SKU type, region, and state. The side pane includes action options like settings and administrators.](/fabric/images/adminPortal_capacity_list.png)

The above view shows the side pane for the Actions, including the Fabric ID.

Click on a capacity for the full properties.

![Screenshot of the Admin Portal showing the properties of a selected Fabric capacity. The properties include the list of Capacity Admins and the Contributors.](/fabric/images/adminPortal_capacity_properties.png)

⚠️ This screenshot shows a security group called Sales in the Contributors box, but in my experience you have to specify individual users for it to work with the fabric CLI and Terraform provider.

Note that both the Capacity Admins and Contributors are shown here and may be updated.

## Fabric CLI

When automating, one of the easiest ways to list the capacities available to you is by using the [Fabric CLI](./prereqs.md#fabric-cli).

1. Authenticate

    ```shell
    fab auth login
    ```

1. Check authentication status

    ```shell
    fab auth status
    ```

    Example output:

    ```yaml
    ✓ Logged in to app.fabric.microsoft.com
      - Account: richeney@MngEnvMCAP520989.onmicrosoft.com (<object_id>)
      - Tenant ID: <tenant_id>
      - Token (fabric/powerbi): a0f9************************************
      - Token (storage): a0f9************************************
      - Token (azure): a0f9************************************
    ```

1. List the available capacities.

    ```shell
    fab ls -l .capacities
    ```

    Example output showing all three SKU types.

    ```text
        name                                                 id                                     sku   region      state
    ---------------------------------------------------------------------------------------------------------------------------
    Premium Per User - Reserved.Capacity                     59d17bf8-cda2-4c43-824a-ec3a8078908d   PP3   West US 3   Active
    Trial-20250314T172025Z-xmVeQXcryUKTbE5vcFY5Dg.Capacity   29dc2bec-dc5e-4c0a-85bc-564d96106653   FT1   West US 3   Active
    example.Capacity                                         3da9391c-0cbb-4005-952a-1007a3021888   F2    UK South    Active
    ```

    Note that the table shown here has been truncated and the detailed output also shows subscriptionID, resourceGroup, admins and tags.

1. Get full output for an F-SKU (optional)

    If you have an F-SKU then you can get the full JSON output with this command. This command will not work with T-SKUs or P-SKUs.

    ```shell
    fab get .capacities/example.Capacity -q .
    ```

    Example output:

    ```json
    {
      "properties": {
        "provisioningState": "Succeeded",
        "state": "Active",
        "administration": {
          "members": [
            "admin@MngEnvMCAP520989.onmicrosoft.com",
            "richeney@MngEnvMCAP520989.onmicrosoft.com"
          ]
        }
      },
      "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/fabric/providers/Microsoft.Fabric/capacities/example",
      "name": "example",
      "type": "Microsoft.Fabric/capacities",
      "location": "UK South",
      "sku": {
        "name": "F2",
        "tier": "Fabric"
      },
      "tags": {},
      "fabricId": "cbcb85de-8d1c-48f2-bdf8-159559ffff4f"
    }
    ```

    > Pro tip: Pipe the output through to jq on linux to colorize the output or strip off CRLF from end of line when scripting, e.g. `fabricId=$(fab get .capacities/example.Capacity -q . | jq -r .fabricId)`.

## Next

OK, you should have a Fabric capacity to use, and you know the name and the fabricId. Next we'll create a storage account for the remote state backend.
