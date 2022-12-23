---
title: Arc Pilot resource group
description: "Create a service principal for onboarding, plus a few resources and tag inheritance policies."
slug: arc_pilot
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-arc_pilot
series:
 - arc-servers
weight: 123
---

## Introduction

In this preparation lab you will create the `arc_pilot` resource group, plus a service principal for the onboarding scripts. The service principal must have the *Azure Connected Machine Onboarding* role.

You'll also add some tagging inheritance policies and a couple of (optional) security groups in Azure Active Directory.

> The *Azure Connected Machine Onboarding* role allows *Microsoft.HybridCompute* and *Microsoft.GuestConfiguration* guest actions. See [Azure built-in roles](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#azure-connected-machine-onboarding) for more information.

The last section covers

## Resource group

1. Create a resource group called `arc_pilot` for onboarding

    Include tag values for datacentre and city.

    ```bash
    az group create --name arc_pilot --location westeurope --tags datacentre="Azure Citadel" city=Reading
    ```

1. Grab the resource group id

    ```bash
    rgId=$(az group show --name arc_pilot --query id --output tsv)
    ```


## Service principal

1. Create a service principal with the *Azure Connected Machine Onboarding* role

    ```bash
    az ad sp create-for-rbac --name arc_pilot --role "Azure Connected Machine Onboarding" --scopes $rgId
    ```

    ⚠️ Make sure that you take a copy of the JSON output as it includes the clientId/appId and the clientSecret/password.

    > The portal will look for service principals with the *Azure Connected Machine Onboarding* role when generating scripts.

## Azure Arc Admins

1. Create a security group called *Azure Arc Admins*
1. Add all of the users in your team
1. Assign with a role to the resource group that is suitable for administering Azure Arc-enabled Server resources

    > 💡 Hint: Azure Arc-enabled Servers are sometimes called Azure Connected Machines...

## Tag inheritance

The pilot evaluation team have decided to initially use a couple of tags at the resource group level that they want the resources to inherit.

The tag inheritance policies may be deployed at a higher scope in production, e.g. at the subscription scope for a subscription dedicated for hybrid machines, as one component of a wider tagging strategy.

| Tag | Value | Source |
|---|---|---|
||||
| datacentre | Azure Citadel | Inherited from resource group |
| city | Reading | Inherited from resource group |
| platform | | azcmagent |
| cluster | | azcmagent |
||||

⚠️The values for the platform and cluster tags will be configured when using the azcmagent to onboard the hybrid VMs.

1. Assign the tag inheritance for datacentre

    ```bash
    az policy assignment create --name "inherit_tag_datacentre" \
      --display-name "Inherit datacentre tag from the resource group" \
      --scope $rgId \
      --policy cd3aa116-8754-49c9-a813-ad46512ece54 \
      --mi-system-assigned --location westeurope \
      --params '{"tagName": {"value": "datacentre"}}'
    ```

1. Add a non-compliance message for the datacentre tag policy

    ```bash
    az policy assignment non-compliance-message create \
    --name inherit_tag_datacentre \
    --resource-group arc_pilot \
    --message "Resource has not inherited the datacentre tag"
    ```

1. Assign the tag inheritance for city

    ```bash
    az policy assignment create --name "inherit_tag_city" \
    --display-name "Inherit city tag from the resource group" \
    --scope $rgId \
    --policy cd3aa116-8754-49c9-a813-ad46512ece54 \
    --mi-system-assigned --location westeurope \
    --params '{"tagName": {"value": "city"}}'
    ```

1. Add a non-compliance message for the city tag inheritance policy

    ```bash
    az policy assignment non-compliance-message create \
    --name inherit_tag_city \
    --resource-group arc_pilot \
    --message "Resource has not inherited the city tag"
    ```

## Success criteria

Show the proctor:

1. the resource group name, location, tags and resources
1. the RBAC assignment for *Azure Arc Admins*
1. your tag inheritance policy assignments

## Resources

* <https://learn.microsoft.com/azure/role-based-access-control/built-in-roles>
* <https://learn.microsoft.com/azure/azure-arc/servers/onboard-service-principal>
* <https://learn.microsoft.com/azure/templates/microsoft.authorization/policyassignments?pivots=deployment-language-bicep>
* <https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/management_group_policy_assignment>

## Next

In this lab you assigned a few more resources and policies. A combination of the Azure portal and CLI were used, but you could automate using Bicep or Terraform. Remember that policy initiatives were previously named policy sets.

In the next lab you will look at the Azure Monitor Agent and enable VM Insights via policy.
