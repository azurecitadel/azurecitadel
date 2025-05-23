---
title: "Managed Identity"
description: "Configure a managed identity for use with the Fabric provider."
layout: single
draft: false
menu:
  side:
    parent: fabric
    identifier: fabric-mi
series:
 - fabric_terraform_administrator
weight: 35
---

## Introduction

On this page we will create a managed identity that can be used by CI/CD pipelines and configuring the Fabric tenant settings to permit its use. You will also add some additional permissions, at the very least the Storage Blob Data Contributor role for the storage account.

Note that this will won't touch any CI/CD platform specifics until the following GitHub page. This will be a cleaner break point for those of you who want to look at Azure DevOps or GitLab as alternatives to using GitHub as we will follow a similar process.

The process follows the [Creating an App Registration for the Service Principal context (SPN)](https://registry.terraform.io/providers/microsoft/fabric/latest/docs/guides/auth_app_reg_spn) page but in a managed identity context.

## Service Principal / Managed Identity overview

{{< flash >}}
**_Is the service principal / managed identity configuration non-standard for Fabric?_**

A little, yes. It is defined by the Fabric REST API authentication that propagates through the Go SDK for Fabric.

There is a tenant setting in the Fabric admin pages, "Service principals can use Fabric APIs", and this can be configured either

- for all service principals, or
- to a specific Entra security group

**_So no role API permissions?_**

No. Usually when looking at app registrations and API permissions you have either

- Delegated API permissions for delegated access or user impersonation, which is access on behalf of a user. Also known as scoped permissions.
- Role API permissions for apps that require standalone authentication and authorisation.

With the Fabric model it allows either service principals or managed identities, but it does not make use of app roles and therefore is no granularity to control _which_ REST API calls are permitted. The only real control point is the tenant setting.

**_Could I use a managed identity?_**

Yes, and we are here. We will define a managed identity and use it for fabric terraform provider. You can also create add Azure RBAC role assignments for the azurerm and azapi providers. We'll add one for writing remote state as a blob to the storage account. We'll also show how to add app roles for the Microsoft Graph for the azuread provider.

Managed identities are a good security recommendation when combined with OpenId Connect as there is no risk of secret leakage or burden of secret rotation.
{{< /flash >}}

## Creating a managed identity

We will create the user assigned managed identity in the same resource group as the storage account you made earlier.

1. **Define variables**

    Set the resource group name and region

    ```shell
    rg=terraform
    loc=uksouth
    ```

1. **Switch subscriptions** (optional)

    If you created the terraform resource group in another subscription then switch to it now. For example:

    ```shell
    az account set --subscription <management subscription>
    ```

1. **Create the user assigned managed identity**

    ```shell
    az identity create --name fabric_terraform_provider --resource-group $rg --location $loc
    ```

## Add to an Entra ID security group (optional)

This step is recommended but you will need the appropriate permissions to create groups within Entra ID.

1. **Create the group**

    ```shell
    az ad group create --display-name "Microsoft Fabric Workload Identities" --description "Service Principals and Managed Identities used for Fabric automation." --mail-nickname FabricWorkloadIdentities
    ```

1. **Add the managed identity**

    ```shell
    objectId=$(az identity show --name fabric_terraform_provider --resource-group $rg --query principalId -otsv)
    az ad group member add --group "Microsoft Fabric Workload Identities" --member-id $objectId
    ```

## Enable use within Fabric

### Configure Developer settings in Tenant settings

- Open [Fabric Portal](https://app.powerbi.com?experience=fabric-developer)
  - click on the bottom left to toggle between Power BI and Fabric experiences
- click on the Settings cog at the top right
- Admin Portal
- Tenant settings
  - filter on "_principal_"
  - the Developer Settings sections should come immediately into view
- Toggle to Enabled
- Set apply to either
  - the entire organisation
  - a specific security group (preferred)

  ![Screenshot of the Fabric Admin Portal showing the new security group in the developer settings](/fabric/images/adminPortal_developer_settings.png)

### Add access to the capacity (F-SKU only)

You can either add it as an Administrator to the F-SKU or a Contributor.

#### Administrator

1. Variables

    ```shell
    identity_name="fabric_terraform_provider"
    identity_resource_group="terraform"
    capacity_name="example"
    capacity_resource_group="fabric"
    ```

1. Work out the extended administrators property

    ```shell
    identityObjectId=$(az identity show --name fabric_terraform_provider --resource-group terraform --query principalId -otsv)
    current=$(az fabric capacity show --name example --resource-group fabric --query administration.members -ojson)
    updated=$(jq -c --arg oid "$identityObjectId" '. + [$oid]|{members: .}' <<< $current)
    ```

    Note that in the administrators array you must specify the

    - user principal name (UPN) for users
    - object ID for workload identities (service principals and managed identities)

1. Update the Fabric SKU

    ```shell
    az fabric capacity update --name example --resource-group fabric --administration $updated
    ```

    Example output:

    ```json
    {
      "administration": {
        "members": [
          "admin@MngEnvMCAP520989.onmicrosoft.com",
          "806dac5a-24b9-49ae-8e2b-4b777e8eaaf8"
        ]
      },
      "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourceGroups/fabric/providers/Microsoft.Fabric/capacities/example",
      "location": "UK South",
      "name": "example",
      "provisioningState": "Succeeded",
      "resourceGroup": "fabric",
      "sku": {
        "name": "F2",
        "tier": "Fabric"
      },
      "state": "Active",
      "tags": {},
      "type": "Microsoft.Fabric/capacities"
    }
    ```

## Azure RBAC role assignments

The identity needs to be able to write to the storage account's prod container for the Terraform state file.

1. **Assign Storage Blob Data Contributor to the prod container**

    ```shell
    objectId=$(az identity show --name fabric_terraform_provider --resource-group $rg --query principalId -otsv)
    storageAccountId=$(az storage account list --resource-group terraform --query "[?starts_with(name, 'terraformfabric')]|[0].id" -otsv)
    az role assignment create --assignee-object-id $objectId --assignee-principal-type ServicePrincipal --scope "$storageAccountId/blobServices/default/containers/prod" --role "Storage Blob Data Contributor"
    ```

1. **Assign additional roles as required** (optional)

    For example:

    ```shell
    scope="/subscriptions/$(az account show --name "<fabric subscription>" --query id -otsv)
    az role assignment create --assignee-object-id $objectId --assignee-principal-type ServicePrincipal --scope "$scope" --role "Contributor"
    ```

## Entra ID app roles (optional)

You can also add app roles to the managed identity for use with Microsoft Graph and other APIs. As an example, here are the steps to add _User.ReadBasic.All_ and _Group.Read.All_ if you want to use the data sources in the azuread provider.

⚠️ This section is entirely optional and a little lengthy, so feel free to skip to [Next](#next).


This configuration is not as common for managed identities as it is for service principals. It requires a few REST API calls if you're not using PowerShell. This section makes use of jq.

1. **Get the objectId for the Graph App ID**

    The Graph App ID is a well known value and is consistent across all tenants, but the REST API calls need the objectId and this is unique within each tenant.

    ```shell
    graphAppId="00000003-0000-0000-c000-000000000000"
    graphObjectId=$(az ad sp show --id $graphAppId --query id -otsv)
    ```

1. **Query the service principal for Microsoft Graph to find the appRoleIds**

    ```shell
    appRoleIds=$(az ad sp show --id 00000003-0000-0000-c000-000000000000 --query "appRoles[?contains(\`['User.ReadBasic.All','Group.Read.All']\`, value)].id" -otsv)
    ```

    This sets appRoleIds to

    ```text
    5b567255-7703-4780-807c-7be8301ae99b
    97235f07-e226-4f63-ace3-39588e11d3a1
    ```

    > To display all possible appRoleIds, use `az ad sp show --id 00000003-0000-0000-c000-000000000000 --query "appRoles[].{id:id, value:value}" -oyamlc`

1. **Set the main part of the URI**

    ```shell
    uri="https://graph.microsoft.com/v1.0/servicePrincipals/${principalId}"
    ```

1. **Create the app roles**

    Loop through the appRoleIs, generating the JSON body and calling the API**

    ```shell
    for appRoleId in appRoleIds
    do
      body=$(jq -nc --arg principalId "$principalId" --arg resourceId "$graphObjectId" --arg appRoleId "$appRoleId" \
        '{principalId: $principalId, resourceId: $resourceId, appRoleId: $appRoleId}')
      az rest --method post --uri "$uri/appRoleAssignments" --body "$body"
    done
    ```

    An example JSON body for User.ReadBasic.All would be:

    ```json
    {
      "principalId": "<objectId for the managed identity>",
      "resourceId":"<objectId for the Microsoft Graph in my tenant>",
      "appRoleId":"5b567255-7703-4780-807c-7be8301ae99b"
    }
    ```

1. Viewing resulting app roles

    Again the Azure CLI doesn't yet support viewing app roles with either `az identity` or `az ad sp`, so this is another REST API call.

    ```shell
    az rest --method get --uri "$uri$?\$expand=appRoleAssignments" --query appRoleAssignments --output jsonc
    ```

    Or go into the Entra admin portal

    - switch the type to _Managed identities_
    - filter Enterprise applications to "_fabric_"

    ![Screenshot of the Enterprise Applications page in Entra admin portal, filtered to show managed identities related to 'fabric'](/fabric/images/enterpriseApplication.png)

    Click on Permissions.

    ![Screenshot of the Permissions tab for a managed identity, showing assigned app roles in the Entra admin portal](/fabric/images/enterpriseApplicationAppRoles.png)

## Next

The managed identity is ready for use for the fabric terraform provider. Time to work with GitHub.
