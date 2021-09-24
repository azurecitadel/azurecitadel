---
title: Foundation
description: "Plan for deployment and prepare the target resource group for your Arc servers."
layout: single
draft: false
series:
 - arc-servers-hack-proctor
weight: 120
url: /arc/servers/hack/foundation/proctor
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
objectId=$(az ad group show --group "Azure Arc Admins" --query objectId --output tsv)
az role assignment create --assignee $objectId --resource-group arc_pilot --role "Azure Connected Machine Resource Administrator"
```

If they cannot create security groups then each person should get assigned. They may choose Contributor instead, but this is also a test of least privilege so the specified role is more apt.

## Key Vault

### Creation and access

Example commands also show the AD group getting and access policy to list and get secrets.

```bash
kv=arc-pilot-richeney
az keyvault create --name $kv --retention-days 7 --resource-group arc_pilot --location uksouth
```

Key vault creator gets an access policy by default. Could also add the AAD group. Not required but a good stretch to ask.

```bash
groupId=$(az ad group show --group "Azure Arc Admins" --query objectId --output tsv)
az keyvault set-policy --name $kv --secret-permissions list get --resource-group arc_pilot --object-id $groupId
```

Could also use RBAC roles rather than access policies. Arguably more secure as the ability to manage role assignments is usually more locked down than contributor access. Use `--enable-rbac-authorization` when creating the key vault, then assign:

```bash
kv=arc-pilot-richeney
az keyvault create --name $kv --retention-days 7 --resource-group arc_pilot --location uksouth
kvId=$(az keyvault show --name $kv --resource-group arc_pilot --query id --output tsv)
objectId=$(az ad signed-in-user show --query objectId --output tsv)
az role assignment create --assignee $objectId --scope $kvId --role "Key Vault Administrator"
```

And the corresponding AAD group.

```bash
groupId=$(az ad group show --group "Azure Arc Admins" --query objectId --output tsv)
az role assignment create --assignee $groupId --scope $kvId --role "Key Vault Secrets User"
```

### Self signed cert

```bash
az keyvault certificate create --name self-signed-cert --vault-name $kv --policy "$(az keyvault certificate get-default-policy)"
```

### Private SSH Key

Only applicable if VMs were created using the Terraform repo.

```bash
az keyvault secret set --name arc-pilot-private-ssh-key --vault-name $kv --file ~/.ssh/id_rsa
```

## Azure Monitor Workspace

```bash
az monitor log-analytics workspace create --resource-group arc_pilot --location uksouth --workspace-name arc-poc-core
az monitor log-analytics workspace create --resource-group arc_pilot --location uksouth --workspace-name arc-poc-soc
az monitor log-analytics workspace create --resource-group arc_pilot --location uksouth --workspace-name arc-poc-linuxapp
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
1. Key Vault secrets
    1. arc-pilot-private-ssh-key
    1. self-signed-cert

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
