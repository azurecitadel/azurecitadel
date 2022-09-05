---
title: "Example minimal configuration"
date: 2022-08-11
author: [ "Richard Cheney" ]
description: "An example Lighthouse definition with a minimal set of managed service roles that are also valid for ACR recognition via PAL."
draft: true
weight: 3
menu:
  side:
    parent: partner-lighthouse
    identifier: partner-lighthouse-minimal
series:
 - partner-lighthouse
---

## Introduction

OK, enough talk. Let's quickly recap what we're trying to do by combining Azure Lighthouse and Partner Admin Link.

* Maintain a minimal managed service definition
* Ensure it includes a permanent PEC eligible role
* Use Azure Lighthouse to project the resources back to our home tenant
* Make sure that the security principals are linked
* Receive the ACR recognition for the positive impact of the service in customer subscriptions

## Content

In this lab you will

1. Azure Lighthouse definitions
    1. review an example minimal definition
    1. customise your own definition
1. As the customer
    1. create the managed service offer from the template
    1. delegate a subscription
1. As the managed service provider
    1. see the multi-tenanted experience
    1. check that PAL is linked

## Minimal managed service

In this section we'll take a look at an example Azure Lighthouse definition for a minimal managed service and how it looks in the portal.

### Example ARM template

The [minimal definition](https://github.com/richeney/lighthouse/blob/main/minimal.json) below can be found in my [lighthouse repo](https://github.com/richeney/lighthouse).

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "variables": {
        "ManagedServicesRegistrationAssignmentDeleteRole": "91c1777a-f3dc-4fae-b103-61d183457e46",
        "Reader": "acdd72a7-3385-48ef-bd42-f606fba81ae7",
        "SupportRequestContributor": "cfd33db0-3dd1-45e3-aa9d-cdbdf3b6f24e"
    },
    "resources": [
        {
            "type": "Microsoft.ManagedServices/registrationDefinitions",
            "apiVersion": "2019-06-01",
            "name": "[guid('Azure Citadel - Basic Support Service')]",
            "properties": {
                "registrationDefinitionName": "Basic Support Service",
                "description": "Azure support services for call logging and call management (L0/L1).",
                "managedByTenantId": "655f0684-29ae-466e-8324-2ab22497254f",
                "authorizations": [
                    {
                        "principalIdDisplayName": "Azure Lighthouse Admins",
                        "principalId": "b3333b16-f8de-4624-ad57-52b494d82fc4",
                        "roleDefinitionId": "[variables('ManagedServicesRegistrationAssignmentDeleteRole')]"
                    },
                    {
                        "principalIdDisplayName": "Managed Service Consultants",
                        "principalId": "11a297dd-edbf-49b6-a935-968f147415e1",
                        "roleDefinitionId": "[variables('Reader')]"
                    },
                    {
                        "principalIdDisplayName": "Managed Service Consultants",
                        "principalId": "11a297dd-edbf-49b6-a935-968f147415e1",
                        "roleDefinitionId": "[variables('SupportRequestContributor')]"
                    }
                ]
            }
        }
    ]
}
```

### Service provider offer

Here is the Details tab for same example as viewed in the portal.

{{< img light="/partner/images/minimal_managed_service_offer_light.png" dark="/partner/images/minimal_managed_service_offer_dark.png" alt="Minimal managed service offer" >}}

The details match the properties in the `Microsoft.ManagedServices/registrationDefinitions` resource:

```json
"resources": [
    {
        "type": "Microsoft.ManagedServices/registrationDefinitions",
        "apiVersion": "2019-06-01",
        "name": "[guid('Azure Citadel - Basic Support Service')]",
        "properties": {
            "registrationDefinitionName": "Basic Support Service",
            "description": "Azure support services for call logging and call management (L0/L1).",
            "managedByTenantId": "655f0684-29ae-466e-8324-2ab22497254f"
        }
    }
]
```

The **registrationDefinitionName** and **description** are cosmetic. The delegated resources will be projected to this the service provider's **managedByTenantId**.

> Note that the actual resource name is a GUID. Here we generate a predictable GUID using the function based on a seed string.

### Role assignments

Here is the matching Role Assignments tab:

{{< img light="/partner/images/minimal_role_assignments_light.png" dark="/partner/images/minimal_role_assignments_dark.png" alt="Minimal role assignments" >}}

As defined by the following authorizations array:

```json
"authorizations": [
    {
        "principalIdDisplayName": "Azure Lighthouse Admins",
        "principalId": "b3333b16-f8de-4624-ad57-52b494d82fc4",
        "roleDefinitionId": "[variables('ManagedServicesRegistrationAssignmentDeleteRole')]"
    },
    {
        "principalIdDisplayName": "Managed Service Consultants",
        "principalId": "11a297dd-edbf-49b6-a935-968f147415e1",
        "roleDefinitionId": "[variables('Reader')]"
    },
    {
        "principalIdDisplayName": "Managed Service Consultants",
        "principalId": "11a297dd-edbf-49b6-a935-968f147415e1",
        "roleDefinitionId": "[variables('SupportRequestContributor')]"
    }
]
```

The **principalId** is the objectId for the user, service principal or security group. The **principalDisplayName** is cosmetic.

The **roleDefinitionId** is the GUIDs for the [Azure RBAC built-in roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles). Here they are pulled from the variables section for readability.

```json
"variables": {
    "ManagedServicesRegistrationAssignmentDeleteRole": "91c1777a-f3dc-4fae-b103-61d183457e46",
    "Reader": "acdd72a7-3385-48ef-bd42-f606fba81ae7",
    "SupportRequestContributor": "cfd33db0-3dd1-45e3-aa9d-cdbdf3b6f24e"
}
```

The [Support Request Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#support-request-contributor) role has an action, `Microsoft.Support/*`, which makes the role [eligible for partner earned credit](https://docs.microsoft.com/s/partner-center/azure-roles-perms-pec) (PEC).

Another important role in the authorizations array is [Managed Services Registration Assignment Delete Role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#managed-services-registration-assignment-delete-role). This allows the managed services provider to [delete assignments](https://docs.microsoft.com/azure/lighthouse/how-to/remove-delegation#service-providers) assigned to their tenant. Without that role you would be forced to ask the customer to delete the assignment.

> Note that there are limitations in the [role support for Azure Lighthouse](https://docs.microsoft.com/azure/lighthouse/concepts/tenants-users-roles#role-support-for-azure-lighthouse). You can only use in-built roles. You cannot use roles with dataActions. Owner cannot be used, and User Access Administrator is limited to assigning a defined set of roles to managed identities.

### Customise your own

Use the example template as your starting point.

> ⚠️ Please do not run the example template without customising it first!

1. Save it locally and edit in your favourite editor.

    > If you haven't got a favourite then we recommend [Visual Studio Code](HTTPS://aka.ms/vscode) with the [Azure Resource Manager (ARM) Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools).

1. Update the `managedByTenantId` to match your [tenantId](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview)
1. Update the cosmetic descriptions
1. Create your own [AAD security groups](https://portal.azure.com/#view/Microsoft_AAD_IAM/GroupsManagementMenuBlade/~/AllGroups) for
    1. Lighthouse Offer Admins, and
    1. Lighthouse Managed Service Consultants

    > You are not limited to these groups or descriptions. They are just used as an example.

1. Update the descriptions and objectIds in your template to match
1. Save your changes to a new filename e.g. myServiceOffer.json

## Customer

The following screens are seen from the perspective of a customer.

{{< flash >}}
⚠️ It is recommended to have your own test customer subscription (in its own tenant) for Azure Lighthouse testing and demos.
{{< /flash >}}

Here I have logged in to my Lighthouse Customer tenant.

### Create a definition

1. Click on [Service provider offers](https://portal.azure.com/#view/Microsoft_Azure_CustomerHub/ServiceProvidersBladeV2/~/providers) in Azure Lighthouse's service providers area
1. Click on **Add offer** and **Add via template**

1. Drag and drop the template.

***YOU ARE HERE***

### Create an assignment

I need some pictures and text.

### Alternatives

I personally recommend the manual portal creation to partners who are onboarding new customers as it is quick and is a good way to demystify the process for customers. It is also reassuring to see the inbuilt roles and

There are other ways to [onboard customers via templates](https://docs.microsoft.com/azure/lighthouse/how-to/onboard-customer) such as PowerShell cmdlets and .

You may also [publish Managed Service offers to the Azure Marketplace](https://docs.microsoft.com/azure/lighthouse/how-to/publish-managed-services-offers).

The definition creation steps can be performed on behalf of the customer by partners in CSP subscriptions through their Admin Of Behalf Of (AOBO) permissions. CSP partners with AOBO can also parameterise a `Microsoft.ManagedServices/registrationAssignments` resource to automate the delegation.