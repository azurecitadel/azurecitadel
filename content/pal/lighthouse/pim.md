---
title: "Privileged Identity Management"
date: 2025-10-10
author: [ "Richard Cheney" ]
description: "An example Lighthouse definition with a mix of permanent and PIM eligible roles. Maintain ACR recognition whilst meeting least privilege requirements. Enable just in time access to elevated permissions with approvals."
draft: false
weight: 5
menu:
  side:
    parent: pal-lighthouse
    identifier: pal-lighthouse-pim
series:
 - pal-lighthouse
---

## Introduction

The final page in this series covers Privileged Identity Management (PIM), which allows the managed service to follow least privilege principles and only elevate the access to pre-agreed levels upon request for just in time (JIT) access.

Here is the example PIM definition in the portal:

{{< img light="/pal/lighthouse/images/pim_roles_light.png" dark="/pal/lighthouse/images/pim_roles_dark.png" alt="Privileged Identity Management roles" >}}

The permanent roles are the same set as the minimal example.

In addition there are a number of eligible roles. Hovering over the information symbol shows how long they can be elevated for.

* Two of the roles - VM Contributor and Backup Contributor - do not require approval for elevation.
* The more powerful Contributor role does need approval, from anyone in the Managed Services Management group.

    {{< img light="/pal/lighthouse/images/pim_approval_light.png" dark="/pal/lighthouse/images/pim_approval_dark.png" alt="Privileged Identity Management approval" >}}

The example also has permanent roles for two different service principals, but they're not the focus of this page.

## Lighthouse definition

Example [privileged identity management lighthouse definition](https://github.com/richeney/lighthouse/blob/main/privileged_identity_management.json):

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "variables": {
        "publisher": "Azure Citadel",
        "name": "Standard Managed Service with PIM",
        "guid": "[guid(concat(variables('publisher'), variables('name')))]",
        "roleDefinitionId": {
            "Contributor": "b24988ac-6180-42a0-ab88-20f7382dd24c",
            "BackupContributor": "5e467623-bb1f-42f4-a55d-6e525e11384b",
            "VirtualMachineContributor": "9980e02c-c2be-4d73-94e8-173b1dc7cf3c",
            "BillingReader": "fa23ad8b-c56e-40d8-ac0c-ce449e1d2c64",
            "Reader": "acdd72a7-3385-48ef-bd42-f606fba81ae7",
            "ManagedServicesRegistrationAssignmentDeleteRole": "91c1777a-f3dc-4fae-b103-61d183457e46",
            "SupportRequestContributor": "cfd33db0-3dd1-45e3-aa9d-cdbdf3b6f24e"
        },
        "securityGroup": {
            "consultants": {
                "objectId": "30f86a83-b2a9-477a-90d6-23e51042839a",
                "name": "Managed Service Consultants"
            },
            "management": {
                "objectId": "9d2b2ec1-a465-431f-91d3-546f97b8fb26",
                "name": "Managed Service Management"
            }
        },
        "serviceprincipal": {
            "billingReader": {
                "objectId": "770040c1-ddc2-40bd-bfc9-af70f5cc9ab1",
                "name": "Service principal - http://billingreader"
            },
            "terraform": {
                "objectId": "e11d5c66-9c16-488a-afce-fd4da574296d",
                "name": "Service principal - http://terraform"
            }
        }
    },
    "resources": [
        {
            "type": "Microsoft.ManagedServices/registrationDefinitions",
            "apiVersion": "2022-01-01-preview",
            "name": "[variables('guid')]",
            "properties": {
                "registrationDefinitionName": "[variables('name')]",
                "description": "Virtual Machine protection and patching plus custom Azure billing service.",
                "managedByTenantId": "3c584bbd-915f-4c70-9f2e-7217983f22f6",
                "authorizations": [
                    {
                        "principalIdDisplayName": "[variables('securityGroup').management.name]",
                        "principalId": "[variables('securityGroup').management.objectId]",
                        "roleDefinitionId": "[variables('roleDefinitionId').ManagedServicesRegistrationAssignmentDeleteRole]"
                    },
                    {
                        "principalIdDisplayName": "[variables('securityGroup').consultants.name]",
                        "principalId": "[variables('securityGroup').consultants.objectId]",
                        "roleDefinitionId": "[variables('roleDefinitionId').Reader]"
                    },
                    {
                        "principalIdDisplayName": "[variables('securityGroup').consultants.name]",
                        "principalId": "[variables('securityGroup').consultants.objectId]",
                        "roleDefinitionId": "[variables('roleDefinitionId').SupportRequestContributor]"
                    },
                    {
                        "principalIdDisplayName": "[variables('serviceprincipal').billingReader.name]",
                        "principalId": "[variables('serviceprincipal').billingReader.objectId]",
                        "roleDefinitionId": "[variables('roleDefinitionId').BillingReader]"
                    },
                    {
                        "principalIdDisplayName": "[variables('serviceprincipal').terraform.name]",
                        "principalId": "[variables('serviceprincipal').terraform.objectId]",
                        "roleDefinitionId": "[variables('roleDefinitionId').Contributor]"
                    }
                ],
                "eligibleAuthorizations": [
                    {
                        "justInTimeAccessPolicy": {
                            "multiFactorAuthProvider": "Azure",
                            "maximumActivationDuration": "PT4H",
                            "managedByTenantApprovers": []
                        },
                        "principalIdDisplayName": "[variables('securityGroup').consultants.name]",
                        "principalId": "[variables('securityGroup').consultants.objectId]",
                        "roleDefinitionId": "[variables('roleDefinitionId').BackupContributor]"
                    },
                    {
                        "justInTimeAccessPolicy": {
                            "multiFactorAuthProvider": "Azure",
                            "maximumActivationDuration": "PT4H",
                            "managedByTenantApprovers": []
                        },
                        "principalIdDisplayName": "[variables('securityGroup').consultants.name]",
                        "principalId": "[variables('securityGroup').consultants.objectId]",
                        "roleDefinitionId": "[variables('roleDefinitionId').VirtualMachineContributor]"
                    },
                    {
                        "justInTimeAccessPolicy": {
                            "multiFactorAuthProvider": "Azure",
                            "maximumActivationDuration": "PT8H",
                            "managedByTenantApprovers": [
                                {
                                    "principalId": "[variables('securityGroup').management.objectId]",
                                    "principalIdDisplayName": "[variables('securityGroup').management.name]"
                                }
                            ]
                        },
                        "principalIdDisplayName": "[variables('securityGroup').consultants.name]",
                        "principalId": "[variables('securityGroup').consultants.objectId]",
                        "roleDefinitionId": "[variables('roleDefinitionId').Contributor]"
                    }
                ]
            }
        }
    ]
}
```

There are two new areas of note in this template.

The first is that a more recent version [API version](https://learn.microsoft.com/azure/templates/microsoft.managedservices/2022-01-01-preview/registrationdefinitions?pivots=deployment-language-arm-template) is required:

```json
    "resources": [
        {
            "type": "Microsoft.ManagedServices/registrationDefinitions",
            "apiVersion": "2022-01-01-preview"
        }
    ]
```

Secondly, the newer apiVersion enables the eligibleAuthorizations array for PIM.

Let's look at the last two elements in the array:

```json
    "eligibleAuthorizations": [
        {
            "justInTimeAccessPolicy": {
                "multiFactorAuthProvider": "Azure",
                "maximumActivationDuration": "PT4H",
                "managedByTenantApprovers": []
            },
            "principalIdDisplayName": "[variables('securityGroup').consultants.name]",
            "principalId": "[variables('securityGroup').consultants.objectId]",
            "roleDefinitionId": "[variables('roleDefinitionId').VirtualMachineContributor]"
        },
        {
            "justInTimeAccessPolicy": {
                "multiFactorAuthProvider": "Azure",
                "maximumActivationDuration": "PT8H",
                "managedByTenantApprovers": [
                    {
                        "principalId": "[variables('securityGroup').management.objectId]",
                        "principalIdDisplayName": "[variables('securityGroup').management.name]"
                    }
                ]
            },
            "principalIdDisplayName": "[variables('securityGroup').consultants.name]",
            "principalId": "[variables('securityGroup').consultants.objectId]",
            "roleDefinitionId": "[variables('roleDefinitionId').Contributor]"
        }
    ]
```

Three of the keys are the same as those in the standard authorizations array - principalIdDisplayName, principalId and roleDefinitionId - but the [justInTimeAccessPolicy](https://learn.microsoft.com/azure/templates/microsoft.managedservices/2022-01-01-preview/registrationdefinitions?pivots=deployment-language-arm-template#justintimeaccesspolicy-1) object is new.

* The maximumActivationDuration has been set at 4 hours and 8 hours respectively
    * ISO 8601 format
    * 8 hours is the maximum
* The multiFactorAuthProvider has been set to `Azure`, forcing activation to trigger MFA
    * Requires AAD Premium P2 in the MSP's tenant; not required in the customer tenant
    * `None` is also valid
* The managedByTenantApprovers array
    * is empty for Virtual Machine Contributor, i.e. no approval required
    * includes the security group's object ID and cosmetic description as the approver required when activating Contributor

      > ⚠️ Security principal object IDs are from the MSP tenancy, not from the customer's tenant.

The Backup Contributor role is defined in the same way as the Virtual Machine Contributor. The lighthouse repo includes an alternative example that uses [variables for standardised PIM approvals](https://github.com/richeney/lighthouse/blob/main/privileged_identity_management_standardised_approvals.json). (Both templates create the same managed service, but get there slightly differently.)

## Activating roles

Only members of the Managed Service Consultants group will need to request a role activation for this definition.

1. Navigate to **My customers | Delegations**

    {{< img light="/pal/lighthouse/images/customer_delegations_light.png" dark="/pal/lighthouse/images/customer_delegations_dark.png" alt="My Customer | Delegations" >}}

1. Click on the role assignments for the required scope point
1. Click on **Manage eligible roles**

    {{< img light="/pal/lighthouse/images/manage_eligible_roles_light.png" dark="/pal/lighthouse/images/manage_eligible_roles_dark.png" alt="Manage eligible roles" >}}

1. Click on **Activate** for the required role

    {{< img light="/pal/lighthouse/images/activate_eligible_role_light.png" dark="/pal/lighthouse/images/activate_eligible_role_dark.png" alt="Activate eligible role" >}}

1. Verify your credentials with MFA if prompted
1. Submit the request

    {{< img light="/pal/lighthouse/images/submit_activation_request_light.png" dark="/pal/lighthouse/images/submit_activation_request_dark.png" alt="Submit activation request" >}}

    You will get a toast notification that "Your request is pending for approval" or that it has been activated.

1. Managed Services Management members receive an email

    {{< img light="/pal/lighthouse/images/approve_request_email_light.png" dark="/pal/lighthouse/images/approve_request_email_dark.png" alt="Approve request email" >}}

1. Follow the link and **Approve** or **Deny**

    {{< img light="/pal/lighthouse/images/approve_request_light.png" dark="/pal/lighthouse/images/approve_request_dark.png" alt="Approve request " >}}

1. Add justification text and **Confirm**
1. View **Active assignments**

    It may take a few minutes for the approval to propagate.

    {{< img light="/pal/lighthouse/images/active_assignments_light.png" dark="/pal/lighthouse/images/active_assignments_dark.png" alt="Active assignments" >}}

1. You now have the Contributor role on that specific scope until the end time
1. Allow the role activation to timeout, or select **Deactivate** once the required work has been completed

## Summary

This template combines

* PEC eligible roles in the permanent authorizations
* service principals
* security groups
* privileged identity management

The members of the Managed Services Consultants group should be PAL linked to the MPN ID. So should the `https://terraform` service principal.

They are the only security principals to have permanent PEC eligible roles. Linking those object IDs with PAL will trigger the ACR recognition.

You have reached the end of this set of partner specific labs,  combining Azure Lighthouse and PAL for ACR recognition in the new Microsoft Cloud Partner Program.
