---
title: Final prep
description: "Create a target resource group and a service principal with the \"Azure Connected Machine Onboarding\" role."
layout: single
draft: false
series:
 - arc-servers-hack-proctor
weight: 123
url: /arc/servers/final_prep/proctor
---

## Resource Group

Many of the steps are easier in the portal for most people, but here are the CLI commands for completeness.

```bash
az group create --name arc_pilot --location uksouth --tags datacentre="Azure Citadel" city=Reading
```

## Policy assignments

Note the optional non-compliance messages. Not required, but a nice touch.

```bash
rgId=$(az group show --name arc_pilot --query id --output tsv)
az policy assignment create --name inherit_tag_city --display-name "Inherit city tag from the resource group" --scope $rgId --policy cd3aa116-8754-49c9-a813-ad46512ece54 --assign-identity --location uksouth --params '{"tagName": {"value": "city"}}'
az policy assignment create --name inherit_tag_datacentre --display-name "Inherit datacentre tag from the resource group" --scope $rgId --policy cd3aa116-8754-49c9-a813-ad46512ece54 --assign-identity --location uksouth --params '{"tagName": {"value": "datacentre"}}'
az policy assignment non-compliance-message create --resource-group arc_pilot --name inherit_tag_city --message "Resource has not inherited the city tag"
az policy assignment non-compliance-message create --resource-group arc_pilot --name inherit_tag_datacentre --message "Resource has not inherited the datacentre tag"
```

Massive bonus points for creating a custom policy initiative as that would be more forward thinking in real life.

## Service Principal

```bash
rgId=$(az group show --name arc_pilot --query id --output tsv)
az ad sp create-for-rbac --name arc_pilot --role "Azure Connected Machine Onboarding" --scopes $rgId
```

It needs to specifically be assigned that role to be picked up in the portal when generating scripts.

## Azure AD Group

```bash
az ad group create --display-name "Azure Arc Admins" --mail-nickname "azurearcadmins"
objectId=$(az ad group show --group "Azure Arc Admins" --query id --output tsv)
az role assignment create --assignee $objectId --resource-group arc_pilot --role "Azure Connected Machine Resource Administrator"
```

If they cannot create security groups then each person should get assigned. They may choose Contributor instead, but this is also a test of least privilege so the specified role is more apt.

## Azure Monitor Workspace

```bash
az monitor log-analytics workspace create --resource-group arc_pilot --location uksouth --workspace-name arc-poc-core
az monitor log-analytics workspace create --resource-group arc_pilot --location uksouth --workspace-name arc-poc-soc
az monitor log-analytics workspace create --resource-group arc_pilot --location uksouth --workspace-name arc-poc-linuxapp
```

## Full set

Concatenated set of commands from above, bar the service principal and Azure AD group creation and assignment commands.

```bash
az group create --name arc_pilot --location uksouth --tags datacentre="Azure Citadel" city=Reading
rgId=$(az group show --name arc_pilot --query id --output tsv)
az policy assignment create --name inherit_tag_city --display-name "Inherit city tag from the resource group" --scope $rgId --policy cd3aa116-8754-49c9-a813-ad46512ece54 --assign-identity --location uksouth --params '{"tagName": {"value": "city"}}'
az policy assignment create --name inherit_tag_datacentre --display-name "Inherit datacentre tag from the resource group" --scope $rgId --policy cd3aa116-8754-49c9-a813-ad46512ece54 --assign-identity --location uksouth --params '{"tagName": {"value": "datacentre"}}'
az policy assignment non-compliance-message create --resource-group arc_pilot --name inherit_tag_city --message "Resource has not inherited the city tag"
az policy assignment non-compliance-message create --resource-group arc_pilot --name inherit_tag_datacentre --message "Resource has not inherited the datacentre tag"
az monitor log-analytics workspace create --resource-group arc_pilot --location uksouth --workspace-name arc-poc-core
az monitor log-analytics workspace create --resource-group arc_pilot --location uksouth --workspace-name arc-poc-soc
az monitor log-analytics workspace create --resource-group arc_pilot --location uksouth --workspace-name arc-poc-linuxapp
```

Service principal

```bash
az ad sp create-for-rbac --name arc_pilot --role "Azure Connected Machine Onboarding" --scopes $rgId
```

Azure AD Group retained separate

```bash
az ad group create --display-name "Azure Arc Admins" --mail-nickname "azurearcadmins"
objectId=$(az ad group show --group "Azure Arc Admins" --query objectId --output tsv)
az role assignment create --assignee $objectId --resource-group arc_pilot --role "Azure Connected Machine Resource Administrator"
```

## Success criteria

1. Resource group
    1. name: arc_pilot
    1. location: uksouth
    1. tags: datacentre="Azure Citadel" city=Reading
    1. resources includes the two workspaces, arc-poc-soc and arc-poc-linuxapp
1. Policy assignments
    1. "Inherit tag from the resource group" for datacentre
    1. "Inherit tag from the resource group" for city
1. RBAC assignments
    1. Service principal with "Azure Connected Machine Onboarding"
    1. Group called "Azure Arc Admins" with "Azure Connected Machine Resource Administrator"

## Stretch discussion

How many Azure Arc built in roles are there for onboarding?

1. Azure Arc Enabled Kubernetes Cluster User Role
1. Azure Arc Kubernetes Admin
1. Azure Arc Kubernetes Cluster Admin
1. Azure Arc Kubernetes Viewer
1. Azure Arc Kubernetes Writer
1. Azure Connected Machine Onboarding
1. Azure Connected Machine Resource Administrator
1. Azure Connected SQL Server Onboarding
1. Kubernetes Cluster - Azure Arc Onboarding
1. Virtual Machine Administrator Login
1. Log Analytics Contributor

Actions

* Microsoft.AzureArcData/sqlServerInstances
* Microsoft.HybridCompute/machines
* Microsoft.HybridCompute/machines/extensions
* Microsoft.HybridCompute/privateLinkScopes
* Microsoft.Kubernetes/connectedClusters

Data Actions

* Microsoft.Kubernetes/connectedClusters/*
* Microsoft.HybridCompute/machines/loginAsAdmin
