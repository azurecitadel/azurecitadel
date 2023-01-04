---
title: Additional Policies
description: "Explore some of the other built-in and custom policies for Azure Arc-enabled servers. Create a Data Collection Rule via the REST API and then assign additional policies."
layout: single
draft: true
series:
 - arc-servers-hack-proctor
weight: 122
url: /arc/servers/policies/proctor
---

## Create resource group and workspaces

```bash
az extension add --upgrade --version 0.2.0 --name monitor-control-service --yes
az group create --name azure_monitor_agent --location westeurope
az monitor log-analytics workspace create --workspace-name arc-pilot-core --resource-group azure_monitor_agent --location westeurope
az monitor log-analytics workspace create --workspace-name arc-pilot-soc --resource-group azure_monitor_agent --location westeurope
az monitor log-analytics workspace create --workspace-name arc-pilot-linuxapp --resource-group azure_monitor_agent --location westeurope

```

## Create DCR

Has the body as a JSON string. (You could skip the jq minification and redirect to a file.)

```bash
workspace_id=$(az monitor log-analytics workspace show --workspace-name arc-pilot-core --resource-group azure_monitor_agent --query id --output tsv)
body=$(curl -sSL https://raw.githubusercontent.com/azurecitadel/azurecitadel/main/content/arc/servers/dcr.json | sed -r "s#your_default_workspace_resource_id#$workspace_id#" | jq -Mc)
rg_id=$(az group show --name azure_monitor_agent --query id --output tsv)
uri="https://management.azure.com/${rg_id}/providers/Microsoft.Insights/dataCollectionRules/default_data_collection_rule?api-version=2021-04-01"
az rest --method put --uri $uri --body "$body"

```

## Parameter json

As a string

```bash
dcr_id=$(az monitor data-collection rule show --name default_data_collection_rule --resource-group azure_monitor_agent --query id --output tsv)
params=$(curl -sSL https://raw.githubusercontent.com/azurecitadel/azurecitadel/main/content/arc/servers/params.json | sed -r "s#your_data_collection_rule_resource_id#$dcr_id#" | jq -Mc)

```

## Assign the Linux policy initiative

```bash
scope=/providers/Microsoft.Management/managementGroups/alz-landingzones

az policy assignment create --name azure_monitor_for_linux \
  --display-name "Configure Azure Monitor Agent and DCR for Linux VMs" \
  --description "Configure Azure Monitor Agent on Linux VMs and associate to a Data Collection Rule" \
  --policy-set-definition 118f04da-0375-44d1-84e3-0fd9e1849403 \
  --scope $scope \
  --mi-system-assigned --location westeurope \
  --identity-scope $scope \
  --role "Azure Connected Machine Resource Administrator" \
  --params "$params"

az policy assignment identity assign --name azure_monitor_for_linux \
  --scope $scope --system-assigned --identity-scope $scope --role "Log Analytics Contributor"

az policy assignment identity assign --name azure_monitor_for_linux \
  --scope $scope --system-assigned --identity-scope $scope --role "Monitoring Contributor"

az policy assignment identity assign --name azure_monitor_for_linux \
  --scope $scope --system-assigned --identity-scope $scope --role "Virtual Machine Contributor"
```

## Assign the Windows policy initiative

```bash
scope=/providers/Microsoft.Management/managementGroups/alz-landingzones

az policy assignment create --name azure_monitor_for_win \
  --display-name "Configure Azure Monitor Agent and DCR for Windows VMs" \
  --description "Configure Azure Monitor Agent on Windows VMs and associate to a Data Collection Rule" \
  --policy-set-definition 9575b8b7-78ab-4281-b53b-d3c1ace2260b \
  --scope $scope \
  --mi-system-assigned --location westeurope \
  --identity-scope $scope \
  --role "Azure Connected Machine Resource Administrator" \
  --params "$params"

az policy assignment identity assign --name azure_monitor_for_win \
  --scope $scope --system-assigned --identity-scope $scope --role "Log Analytics Contributor"

az policy assignment identity assign --name azure_monitor_for_win \
  --scope $scope --system-assigned --identity-scope $scope --role "Monitoring Contributor"

az policy assignment identity assign --name azure_monitor_for_win \
  --scope $scope --system-assigned --identity-scope $scope --role "Virtual Machine Contributor"
```
