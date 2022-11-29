---
title: "Using service principals"
date: 2022-08-11
author: [ "Richard Cheney" ]
description: "Add a service principal to the authorizations. Learn how to configure Partner Admin Link for service principals."
draft: false
weight: 4
menu:
  side:
    parent: partner-lighthouse
    identifier: partner-lighthouse-sp
series:
 - partner-lighthouse
---

## Introduction

{{< flash >}}
One of the recommendations in the official [FAQ](https://learn.microsoft.com/azure/cost-management-billing/manage/link-partner-id#frequently-asked-questions) for Partner Admin Link is to use a service principal from the managed service provider tenant in your Azure Lighthouse definitions.
{{< /flash >}}

On this page:

1. Create a service principal
1. Use it in an Azure Lighthouse definition
1. Link the service principal to your MPN ID with the Azure CLI

## Create a service principal

1. Create the service principal

    In this example I will create a service principal for Terraform deployments.

    ```bash
    az ad sp create-for-rbac --name "http://terraform"
    ```

    > The cosmetic name is optional but recommended.

    Example output:

    ```json
    {
      "appId": "59611dd1-bfff-4fe0-b806-113262f43a3f",
      "displayName": "http://terraform",
      "password": "<redacted>",
      "tenant": "3c584bbd-915f-4c70-9f2e-7217983f22f6"
    }
    ```

   > ⚠️ Store the output JSON as you'll need the password later.

1. Display the object ID

    You will reference the object id - not the app id - of the service principal in Azure Lighthouse definitions.

    ```bash
    az ad sp show --id <appId> --query id --output tsv
    ```

    You can also use the OData filters if you only have the display name, e.g.

    ```bash
    az ad sp list --filter "displayname eq 'http://terraform'" --query [0].id --output tsv
    ```

    > The service principal's object id is `e11d5c66-9c16-488a-afce-fd4da574296d` in the example below.

## Lighthouse definition

Example [service principal lighthouse definition](https://github.com/richeney/lighthouse/blob/main/service_principal.json):

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "variables": {
        "name": "Basic Support Service + Terraform",
        "roleDefinitionId": {
            "Contributor": "b24988ac-6180-42a0-ab88-20f7382dd24c",
            "ManagedServicesRegistrationAssignmentDeleteRole": "91c1777a-f3dc-4fae-b103-61d183457e46",
            "Reader": "acdd72a7-3385-48ef-bd42-f606fba81ae7",
            "SupportRequestContributor": "cfd33db0-3dd1-45e3-aa9d-cdbdf3b6f24e"
        },
        "management": {
            "objectId": "9d2b2ec1-a465-431f-91d3-546f97b8fb26",
            "name": "Managed Service Management"
        },
        "consultants": {
            "objectId": "30f86a83-b2a9-477a-90d6-23e51042839a",
            "name": "Managed Service Consultants"
        },
        "terraform": {
            "objectId": "e11d5c66-9c16-488a-afce-fd4da574296d",
            "name": "Service principal - http://terraform"
        }
    },
    "resources": [
        {
            "type": "Microsoft.ManagedServices/registrationDefinitions",
            "apiVersion": "2019-06-01",
            "name": "[guid(concat('Azure Citadel - ', variables('name')))]",
            "properties": {
                "registrationDefinitionName": "[variables('name')]",
                "description": "Azure support services for call logging and call management (L0/L1). Terraform for CI/CD pipelines.",
                "managedByTenantId": "3c584bbd-915f-4c70-9f2e-7217983f22f6",
                "authorizations": [
                    {
                        "principalIdDisplayName": "[variables('management').name]",
                        "principalId": "[variables('management').objectId]",
                        "roleDefinitionId": "[variables('roleDefinitionId').ManagedServicesRegistrationAssignmentDeleteRole]"
                    },
                    {
                        "principalIdDisplayName": "[variables('consultants').name]",
                        "principalId": "[variables('consultants').objectId]",
                        "roleDefinitionId": "[variables('roleDefinitionId').Reader]"
                    },
                    {
                        "principalIdDisplayName": "[variables('consultants').name]",
                        "principalId": "[variables('consultants').objectId]",
                        "roleDefinitionId": "[variables('roleDefinitionId').SupportRequestContributor]"
                    },
                    {
                        "principalIdDisplayName": "[variables('terraform').name]",
                        "principalId": "[variables('terraform').objectId]",
                        "roleDefinitionId": "[variables('roleDefinitionId').Contributor]"
                    }
                ]
            }
        }
    ]
}
```

Note that this example makes greater use of variable objects. It is entirely up to you whether you follow the same approach or just hard code values in the resource section.

Using variable like this does make the authorization section easier to understand and ensures that the cosmetic strings will be consistent.

{{< flash >}}
⚠️ Remember to use the file as a template, and to customise your own tenant ID, service principal object ID, security group object IDs and cosmetic descriptions.
{{< /flash >}}

Here is how the role would look in the portal:

{{< img light="/partner/images/service_principal_role_light.png" dark="/partner/images/service_principal_role_dark.png" alt="Service principal role" >}}

## Linking service principals

Creating a PAL link for service principals make a lot of sense as they do not hand in their notice!

1. Retrieve the appId and tenantId

    ```bash
    az ad sp show --id <objectId> --query "{appId:appId, tenantId:appOwnerOrganizationId}" --output yamlc
    ```

    Example output:

    ```yaml
    appId: 59611dd1-bfff-4fe0-b806-113262f43a3f
    tenantId: 3c584bbd-915f-4c70-9f2e-7217983f22f6
    ```

1. Authenticate as the service principal

    The format of the `az login` command for service principals using a password (or client secret) is:

    ```bash
    az login --service-principal --user <appId> --password <password> --tenant <tenantId>
    ```

    > You will need the service principal's password from earlier.
    >
    > You can reset service principal credentials with `az ad sp credential reset`.

    Example output:

    ```json
    [
      {
        "cloudName": "AzureCloud",
        "homeTenantId": "3c584bbd-915f-4c70-9f2e-7217983f22f6",
        "id": "9b7a166a-267f-45a5-b480-7a04cfc1edf6",
        "isDefault": true,
        "managedByTenants": [],
        "name": "Azure Citadel (Internal)",
        "state": "Enabled",
        "tenantId": "3c584bbd-915f-4c70-9f2e-7217983f22f6",
        "user": {
          "name": "59611dd1-bfff-4fe0-b806-113262f43a3f",
          "type": "servicePrincipal"
        }
      }
    ]


1. Create the partner admin link

    You will need your location based MPN ID.

    ```bash
    az managementpartner create --partner-id <mpnId>
    ```

    Example output:

    ```json
    {
      "objectId": "e11d5c66-9c16-488a-afce-fd4da574296d",
      "partnerId": "31415927",
      "partnerName": "Azure Citadel Ltd",
      "state": "Active",
      "tenantId": "3c584bbd-915f-4c70-9f2e-7217983f22f6"
    }
    ```

    Note that PAL links the service principal (tenantId/objectId) to the partnerId.

The partner will then be recognised for the ACR if the service principal has a PEC eligible role in the authorizations.

## Next

On the next page we will look at an example with Privileged Identity Management