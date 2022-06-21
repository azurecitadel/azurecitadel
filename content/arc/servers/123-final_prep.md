---
title: Final prep
description: "Create a target resource group and a service principal with the \"Azure Connected Machine Onboarding\" role."
slug: final_prep
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

In this final preparation lab you will create the `arc_pilot` resource group, plus a service principal for the onboarding scripts. The service principal must have the *Azure Connected Machine Onboarding* role.

You'll also add some tagging inheritance policies and a couple of (optional) security groups in Azure Active Directory.

## Resource Group

1. Create a resource group called `arc_pilot` for onboarding

    Include tag values for datacentre and city.

    ```bash
    az group create --name arc_pilot --location westeurope --tags datacentre="Azure Citadel" city=Reading
    ```

1. Grab the resource group id

    ```bash
    rgId=$(az group show --name arc_pilot --query id --output tsv)
    ```

## Service Principal

1. Create a service principal with the *Azure Connected Machine Onboarding* role

    ```bash
    az ad sp create-for-rbac --name arc_pilot --role "Azure Connected Machine Onboarding" --scopes $rgId
    ```

    ⚠️ Make sure that you take a copy of the JSON output as it includes the clientId/appId and the clientSecret/password.

    > The portal will look for service principals with the *Azure Connected Machine Onboarding* role when generating scripts.## Policy assignments

The pilot evaluation team have decided to initially use a couple of tags at the resource group level that they want the resources to inherit.

| Tag | Value | Source |
|---|---|---|
| datacentre | Azure Citadel | Inherited from resource group |
| city | Reading | Inherited from resource group |
| platform | | azcmagent |
| cluster | | azcmagent |

The *azcmagent* tags will be configured as the VMs are onboarded in the next lab.

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

## Azure AD Groups

Skip this step if you do not have the appropriate Azure AD role to create AAD security groups.

### Azure Arc Admins

1. Create a security group called *Azure Arc Admins*
1. Add all of the users in your team
1. Assign with a role suitable for administering Azure Arc for Server resources

    > 💡 Azure Arc-enabled Servers are sometimes called Azure Connected Machines...

### Empty groups

1. Create three additional security Groups
    * *Security Operations Center*
    * *Cost Management*
    * *Linux App Dev*

  These may be left empty for the moment.

> You can choose to complete this in the portal. If you have more time then automate.

## Success criteria

Show the proctor:

1. Resource group name, location, tags and resources
1. Policy assignments
1. RBAC assignment for *Azure Arc Admins*

## Resources

* <https://docs.microsoft.com/azure/role-based-access-control/built-in-roles>

## Next up

We have on prem servers and a target environment. Let's onboard the linux VMs.
