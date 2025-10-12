---
title: "Minimal Lighthouse definition"
date: 2025-10-10
author: [ "Richard Cheney" ]
description: "An example Lighthouse definition with a minimal set of managed service roles that are also valid for ACR recognition via PAL."
draft: false
weight: 3
menu:
  side:
    parent: lighthouse
    identifier: lighthouse-minimal
series:
 - lighthouse
---

## Recap

{{< flash >}}
1. **Include a PEC eligible role** (such as Support Request Contributor) **in your authorizations**
1. **Include the assignment delete role**
1. **Use security groups and service principals in the authorizations**
    * *Avoid specifying individual users as this leads to unneccessary definition updates*
1. **PAL link the individual users and service principals**
{{< /flash >}}

You will then receive the ACR recognition for the positive impact of the service in those customer subscriptions.

> ⚠️ When onboarding new users, simply add them to the security group and create the PAL link. There is no need to update the Azure Lighthouse definition if you are using security groups.

## Lab flow

The example [minimal definition](https://github.com/richeney/lighthouse/blob/main/minimal.json) in the lab has three roles in the permanent authorisations:

* [Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#reader)
* [Support Request Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#support-request-contributor) (PEC eligible)
* [Managed Services Registration Assignment Delete](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#managed-services-registration-assignment-delete-role)

In this lab:

1. Azure Lighthouse definition
    1. review the example minimal definition
    1. customise your own service definition template
1. As the customer
    1. create the managed service offer from the template
    1. delegate a subscription
1. As the managed service provider
    1. see the multi-tenanted experience
    1. check that PAL is linked

## Azure Lighthouse definition

In this section

1. review the example minimal definition
1. customise your own definition

### Example template

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
                "managedByTenantId": "3c584bbd-915f-4c70-9f2e-7217983f22f6",
                "authorizations": [
                    {
                        "principalIdDisplayName": "Managed Service Management",
                        "principalId": "9d2b2ec1-a465-431f-91d3-546f97b8fb26",
                        "roleDefinitionId": "[variables('ManagedServicesRegistrationAssignmentDeleteRole')]"
                    },
                    {
                        "principalIdDisplayName": "Managed Service Consultants",
                        "principalId": "30f86a83-b2a9-477a-90d6-23e51042839a",
                        "roleDefinitionId": "[variables('Reader')]"
                    },
                    {
                        "principalIdDisplayName": "Managed Service Consultants",
                        "principalId": "30f86a83-b2a9-477a-90d6-23e51042839a",
                        "roleDefinitionId": "[variables('SupportRequestContributor')]"
                    }
                ]
            }
        }
    ]
}
```

### Main properties

Here are the main top level properties for the `Microsoft.ManagedServices/registrationDefinitions` resource:

```json
"resources": [
    {
        "type": "Microsoft.ManagedServices/registrationDefinitions",
        "apiVersion": "2019-06-01",
        "name": "[guid('Azure Citadel - Basic Support Service')]",
        "properties": {
            "registrationDefinitionName": "Basic Support Service",
            "description": "Azure support services for call logging and call management (L0/L1).",
            "managedByTenantId": "3c584bbd-915f-4c70-9f2e-7217983f22f6"
        }
    }
]
```

The **registrationDefinitionName** and **description** are cosmetic. The delegated resources will be projected to this the service provider's **managedByTenantId**.

> Note that the actual resource name is a GUID. Here we generate a predictable GUID using a function that takes a seed string.

This is how the Details tab will look in the portal.

{{< img light="/pal/lighthouse/images/minimal_managed_service_offer_light.png" dark="/pal/lighthouse/images/minimal_managed_service_offer_dark.png" alt="Minimal managed service offer" >}}

### Authorizations array

The template has the following authorizations array. The **principalId** is the objectId for the user, service principal or security group. The **principalDisplayName** is cosmetic.

```json
"authorizations": [
    {
        "principalIdDisplayName": "Managed Service Management",
        "principalId": "9d2b2ec1-a465-431f-91d3-546f97b8fb26",
        "roleDefinitionId": "[variables('ManagedServicesRegistrationAssignmentDeleteRole')]"
    },
    {
        "principalIdDisplayName": "Managed Service Consultants",
        "principalId": "30f86a83-b2a9-477a-90d6-23e51042839a",
        "roleDefinitionId": "[variables('Reader')]"
    },
    {
        "principalIdDisplayName": "Managed Service Consultants",
        "principalId": "30f86a83-b2a9-477a-90d6-23e51042839a",
        "roleDefinitionId": "[variables('SupportRequestContributor')]"
    }
]
```

The **roleDefinitionId** is the GUID for the [Azure RBAC built-in roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles). The template uses variables for readability.

```json
"variables": {
    "ManagedServicesRegistrationAssignmentDeleteRole": "91c1777a-f3dc-4fae-b103-61d183457e46",
    "Reader": "acdd72a7-3385-48ef-bd42-f606fba81ae7",
    "SupportRequestContributor": "cfd33db0-3dd1-45e3-aa9d-cdbdf3b6f24e"
}
```

The [Support Request Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#support-request-contributor) role has an action, `Microsoft.Support/*`, which makes the role [eligible for partner earned credit](https://docs.microsoft.com/partner-center/azure-roles-perms-pec) (PEC). All PEC eligible roles include write and/or delete actions. Read actions are insufficient for PEC eligibility.

Another important role in the authorizations array is the [Managed Services Registration Assignment Delete Role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#managed-services-registration-assignment-delete-role). This allows the managed services provider to [delete assignments](https://docs.microsoft.com/azure/lighthouse/how-to/remove-delegation#service-providers) assigned to their tenant. Without that role you would be forced to ask the customer to delete the assignment.

Note that there are limitations in the [role support for Azure Lighthouse](https://docs.microsoft.com/azure/lighthouse/concepts/tenants-users-roles#role-support-for-azure-lighthouse). You can only use in-built roles. You cannot use roles with dataActions. Owner cannot be used, and User Access Administrator is limited to assigning a defined set of roles to managed identities.

This is how the Role Assignments tab would look in the portal:

{{< img light="/pal/lighthouse/images/minimal_role_assignments_light.png" dark="/pal/lighthouse/images/minimal_role_assignments_dark.png" alt="Minimal role assignments" >}}

## Customise your definition

{{< flash >}}
⚠️ Please do not run the example template without customising it first! Use the example template as your starting point.

1. Save it locally and edit in your favourite editor.

    We recommend [Visual Studio Code](HTTPS://aka.ms/vscode) with the [Azure Resource Manager (ARM) Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools).

1. Update the `managedByTenantId` to match your [tenantId](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview)
1. Update the cosmetic descriptions
1. Create your own [AAD security groups](https://portal.azure.com/#view/Microsoft_AAD_IAM/GroupsManagementMenuBlade/~/AllGroups) for
    1. Managed Service Managers
    1. Managed Service Consultants

    You are not limited to these groups or descriptions. They are just used as an example.

1. Update the descriptions and objectIds in your template to match
1. Save your changes to a new filename e.g. myServiceOffer.json
{{< /flash >}}

## Customer

⚠️ It is recommended to have your own test customer subscription (in its own tenant) for Azure Lighthouse testing and demos.

In this section, as the customer, I:

1. create the managed service offer from the template
1. delegate a subscription

### Create a definition

1. Click on [Service provider offers](https://portal.azure.com/#view/Microsoft_Azure_CustomerHub/ServiceProvidersBladeV2/~/providers) in Azure Lighthouse's service providers area
1. Click on **Add offer** and **Add via template**
1. Drag and drop the template, or browse to the file
1. Deploy to create the definition
1. View the offer in the [Service provider offers](https://portal.azure.com/#view/Microsoft_Azure_CustomerHub/ServiceProvidersBladeV2/~/providers) list
1. View the details
1. View the role assignments

### Create an assignment

1. Click on either Delegations in the blade, or on the **`+`** next to an offer
1. Select your subscriptions or resource groups
1. Check the disclaimer box
1. Delegate

### Alternatives

I personally recommend the manual portal creation to partners who are onboarding new customers as it is quick and is a good way to demystify the process for customers. It is also reassuring to see the inbuilt roles and to know that

There are other ways to [onboard customers via templates](https://docs.microsoft.com/azure/lighthouse/how-to/onboard-customer). You may also [publish Managed Service offers to the Azure Marketplace](https://docs.microsoft.com/azure/lighthouse/how-to/publish-managed-services-offers).

The definition creation steps can be performed on behalf of the customer by partners in CSP subscriptions through their Admin Of Behalf Of (AOBO) permissions. CSP partners with AOBO can also parameterise a `Microsoft.ManagedServices/registrationAssignments` resource to automate the delegation.

## Managed services provider

In this section:

1. see the multi-tenanted experience
1. check that IDs are PAL linked

### Multi-tenancy

Wait for delegation to complete. Propogation can take a few minutes and you may need to log out and back in again.

1. Open the portal
1. View [My Customers](https://portal.azure.com/#view/Microsoft_Azure_CustomerHub/MyCustomersBladeV2/~/customers) (Azure Lighthouse > Manage your customers)

    {{< img light="/pal/lighthouse/images/customers_light.png" dark="/pal/lighthouse/images/customers_dark.png" alt="My customers" >}}

3. Check the delegations

    {{< img light="/pal/lighthouse/images/delegations_light.png" dark="/pal/lighthouse/images/delegations_dark.png" alt="Delegations" >}}

4. Click on the directory filter at the top of the portal

    {{< img light="/pal/lighthouse/images/filter_light.png" dark="/pal/lighthouse/images/filter_dark.png" alt="Directory filter" >}}

    Note that the directory filter now include two levels, for directories (tenants) and subscriptions.

    > Explore creating and saving advanced filters.

5. Browse resource groups or a resource type to view cross-tenant

    {{< img light="/pal/lighthouse/images/resource_groups_light.png" dark="/pal/lighthouse/images/resource_groups_dark.png" alt="Multi-tenant Resource Groups" >}}

    > Note that directory or tenant is not yet available as a column. It is recommended to modify the cosmetic subscription names to include a customer identifer.

6. Browse [Virtual machines](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Compute%2FVirtualMachines)

    In the example below you can see the three VMs in my Lighthouse Customer subscription.

    {{< img light="/pal/lighthouse/images/vms_light.png" dark="/pal/lighthouse/images/vms_dark.png" alt="Multi-tenant Virtual machines" >}}

    The authorisations in effect are Reader and Support Contributor. (Attempting to start the VM would correctly fail.)

7. Raising a support ticket

    **Don't create unnecessary support tickets! This screenshot included for completeness.**

    In the screenshot below you can see that the reader and support contributor roles are enabling the creating of support tickets.

    {{< img light="/pal/lighthouse/images/support_light.png" dark="/pal/lighthouse/images/support_dark.png" alt="Multi-tenant support ticket" >}}

Enabling the multi-tenancy with Azure Lighthouse opens up opportunities with the visibility across resources. Improve support in your managed services, report across your customers with Azure Resource Graph queries and automate at scale via scripting and infrastructure as code.

### PAL linking

The Azure Lighthouse definition includes the PEC eligible Support Contributor role, but the customer's ACR won't be attached without PAL linking as the definition was created from a template.

Ideally, each user in the security groups specified in the definition's authorisation should use [Partner Admin Link](https://aka.ms/partneradminlink) to link their ID to the Microsoft Partner Network ID (MPN ID).

1. Click on [Settings](https://portal.azure.com/#settings/directory) in the portal
1. Click on [Microsoft partner network](https://portal.azure.com/#view/Microsoft_Azure_Billing/ManagementPartnerBlade) in the useful links at the bottom left
1. Enter your MPN ID

    {{< img light="/pal/lighthouse/images/pal_light.png" dark="/pal/lighthouse/images/pal_dark.png" alt="Multi-tenant Virtual machines" >}}

    > Note that the MPN ID must be a location based ID, not a v-org ID.

1. Click _Link a partner ID_

Done! It's that easy.

Linking only needs to be done once for each ID. Note that there is no way to report on which users in the MSP tenant have linked their ID.

## References

* [Creating Azure Lighthouse definitions](https://learn.microsoft.com/azure/lighthouse/how-to/onboard-customer)
* [Example minimal definition](https://github.com/richeney/lighthouse/blob/main/minimal.json)
* [Azure RBAC built-in roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles)
    * [Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#reader)
    * [Support Request Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#support-request-contributor)
    * [Managed Services Registration Assignment Delete](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#managed-services-registration-assignment-delete-role)
* [Roles eligible for partner earned credit](https://docs.microsoft.com/partner-center/azure-roles-perms-pec)
* [Partner Admin Link](https://aka.ms/partneradminlink)
* [Publish Managed Service offers to the Azure Marketplace](https://docs.microsoft.com/azure/lighthouse/how-to/publish-managed-services-offers)



## Next

On the next page we'll look at using service principals in Azure Lighthouse definitions, show how to use PowerShell or the Azure CLI to authenticate and PAL link.
