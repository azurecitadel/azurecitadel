---
title: Additional Policies
description: "Explore some of the other built-in and custom policies for Azure Arc-enabled servers. Create a Data Collection Rule via the REST API and then assign additional policies."
slug: policies
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-policies
series:
 - arc-servers
weight: 122
---

## Introduction

Whilst the Azure Landing Zones repo allows customisation in terms of policy assignments etc.,

## Policy Definitions

There are a number of other custom and built-in policies that are applicable to Azure Arc-enabled Servers. (In addition, the Guest Configuration policies can apply to Azure Arc-enabled Servers, as we'll explore in a later lab.)

1. Select the Azure Landing Zones management group
1. Filter Categories to
    * Azure Arc
    * Monitoring
    * Security Center
1. Search on "*Arc*"

    > Note that *arc" will also bring up policies containing search etc.

    {{< img light="/arc/servers/images/arc_policies-light.png" dark="/arc/servers/images/arc_policies-dark.png" alt="Additional policies applicable to Azure Arc-enabled Servers" >}}

Below are some of the policy initiatives and the initiatives within them.

* **Configure Windows machines to run Azure Monitor Agent and associate them to a Data Collection Rule**
  * **Configure Windows virtual machines to run Azure Monitor Agent using system-assigned managed identity**
  * **Configure Windows virtual machine scale sets to run Azure Monitor Agent using system-assigned managed identity**
  * **Configure Windows Arc-enabled machines to run Azure Monitor Agent**
  * **Configure Windows Machines to be associated with a Data Collection Rule**
* **Configure Linux machines to run Azure Monitor Agent and associate them to a Data Collection Rule**
  * **Configure Linux virtual machines to run Azure Monitor Agent with system-assigned managed identity-based authentication**
  * **Configure Linux virtual machine scale sets to run Azure Monitor Agent with system-assigned managed identity-based authentication**
  * **Configure Linux Arc-enabled machines to run Azure Monitor Agent**
  * **Configure Linux Machines to be associated with a Data Collection Rule**
* [Preview]: Deploy Microsoft Defender for Endpoint agent
  * [Preview]: Deploy Microsoft Defender for Endpoint agent on Windows virtual machines
  * [Preview]: Deploy Microsoft Defender for Endpoint agent on Linux virtual machines
  * [Preview]: Deploy Microsoft Defender for Endpoint agent on Windows Azure Arc machines
  * [Preview]: Deploy Microsoft Defender for Endpoint agent on Linux hybrid machines
* [Preview]: Configure virtual and Arc-enabled machines to create the default Microsoft Defender for Cloud pipeline
  * Assign Built-In User-Assigned Managed Identity to Virtual Machines
  * Configure Linux virtual machines to run Azure Monitor Agent with user-assigned managed identity-based authentication
  * Configure Windows virtual machines to run Azure Monitor Agent with user-assigned managed identity-based authentication
  * [Preview]: Configure supported Linux virtual machines to automatically install the Azure Security agent
  * [Preview]: Configure supported Windows machines to automatically install the Azure Security agent
  * [Preview]: Configure machines to automatically create the Azure Security Center pipeline for Azure Monitor Agent
  * [Preview]: Configure Association to link virtual machines to default Azure Security Center Data Collection Rule
  * Configure Linux Arc-enabled machines to run Azure Monitor Agent
  * Configure Windows Arc-enabled machines to run Azure Monitor Agent
  * [Preview]: Configure supported Linux Arc machines to automatically install the Azure Security agent
  * [Preview]: Configure supported Windows Arc machines to automatically install the Azure Security agent
  * [Preview]: Configure Arc machines to automatically create the Security Center pipeline for Azure Monitor Agent
  * [Preview]: Configure Association to link Arc machines to default Azure Security Center Data Collection Rule
* Individual policies for Azure Security agent
  * [Preview]: Configure supported Linux Arc machines to automatically install the Azure Security agent
  * [Preview]: Configure supported Windows Arc machines to automatically install the Azure Security agent
  * [Preview]: Azure Security agent should be installed on your Linux Arc machines
  * [Preview]: Azure Security agent should be installed on your Windows Arc machines
* **Individual policies for Change Tracking extension**
  * [Preview]: **Configure ChangeTracking Extension for Linux Arc machines**
  * [Preview]: **Configure ChangeTracking Extension for Windows Arc machines**
  * [Preview]: **ChangeTracking extension should be installed on your Linux Arc machine**
  * [Preview]: **ChangeTracking extension should be installed on your Windows Arc machine**

In this lab we will be assigning the ones that are in bold.

## Policy Assignments

Policy assignments have a number of components:

* name, display name and description
* id of the policy or policy initiative
* scope
* parameters
* managed identity
  * system or user assigned
  * identity scope and role
  * location

> The managed identities are used by the template deployments in *deploy if not exist* policies.

The Azure documentation has a maintained index of the built-in [policies](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies) and [policy initiatives](https://docs.microsoft.com/azure/governance/policy/samples/built-in-initiatives), which then links to the definitions in the [Azure Policy GitHub repo](https://github.com/Azure/azure-policy). Alternatively, search the Policy definitions in the portal.

For the remainder of the lab you will assign the following three Policy Initiatives at the Landing Zones management group.

1. Configure Linux machines to run Azure Monitor Agent and associate them to a Data Collection Rule

   Requires an existing Data Collection Rule.

2. Configure Windows machines to run Azure Monitor Agent and associate them to a Data Collection Rule

   Requires an existing Data Collection Rule.

3. Configure ChangeTracking extension on Arc machines

   Needs defining as a custom policy initiative.

## Data Collection Rule (DCR)

There are some simple Azure Monitor Agent policies that do nothing more than deploy the AMA extension, but World Wide Importers wish to use the policy initiatives that automatically link to the default alz-logging-workspace.

In this lab you will use the REST API to create the DCR. (You could create the DCR in different ways but the JSON body for the REST API call is relatively simple to understand.

First, create a Data Collection Rule (DCR) based on the default example used in the [create REST API call for data collection rules](https://docs.microsoft.com/en-gb/rest/api/monitor/data-collection-rules/create#create-or-update-data-collection-rule).

1. Create the body

    Create a file called dcr.json and paste in the JSON from the code block below.

    {{< code lang=json file="/content/arc/servers/dcr.json" >}}

    > The data sources are added to the three streams. The streams are then linked to the destination(s) via the data flows.

1. Display the workspace resource id

   ```bash
   az monitor log-analytics workspace show --resource-group alz-logging --workspace-name alz-log-analytics --query id --output tsv
   ```

   Copy the result to the clipboard.

1. Edit the body

    Edit the dcr.json file. Line 86 has a placeholder, `your_default_workspace_resource_id`. Paste the resource ID from the clipboard to replace it.

    For example:

    ```json
        "destinations": {
          "logAnalytics": [
            {
              "workspaceResourceId": "/subscriptions/dc36c76c-b092-4e9b-b194-46805b82b2aa/resourceGroups/alz-logging/providers/Microsoft.OperationalInsights/workspaces/alz-log-analytics",
              "name": "centralWorkspace"
            }
          ]
        },
    ```

1. Set a name for the DCR.

    ```bash
    dcr_name=default_data_collection_rule
    ```

1. Create a resource group

    Also grab the resource ID for the resource group.

    ```bash
    rgId=$(az group create --name azure_monitor_agent --location westeurope --query id --output tsv)
    ```

1. Construct the URI

    As per the [REST API documentation](https://docs.microsoft.com/rest/api/monitor/data-collection-rules/create).

    ```bash
    uri="https://management.azure.com/${rgId}/providers/Microsoft.Insights/dataCollectionRules/${dcr_name}?api-version=2021-04-01"
    ```

1. Call the REST API using the Azure CLI

    ```bash
    az rest --method put --uri $uri --body @dcr.json
    ```

1. Get the resource ID for the DCR

   ```bash
   dcr_id=$(az monitor data-collection rule show --name $dcr_name --resource-group azure_monitor_agent --query id --output tsv)
   ```

## Azure Monitor Agent for Linux

Take the *Configure Linux machines to run Azure Monitor Agent and associate them to a Data Collection Rule* policy initiative as an example.

The simplest way to assign is via the portal, but take the time to work out how to do it via scripting or templates.

You can get most of the info straight from the [JSON policy  definition](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Monitoring/AzureMonitor_LinuxPlatform_EnableDCR.json), but we'll see how to get it from the portal or from CLI commands.

### Scope

1. Set a scope variable

    The assignment scope is the Landing Zones management group.

    ```text
    scope=/providers/Microsoft.Management/managementGroups/alz-landingzones
    ```

### Policy Initiative name

The name (or id) of the initiative is the GUID.

1. Open the portal and go to [Policy definitions](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyMenuBlade/~/Definitions)
1. Filter on
    * Definition type: **Initiative**
    * Search: **Azure Monitor**
1. Click on ***Configure Linux machines to run Azure Monitor Agent and associate them to a Data Collection Rule***

    {{< img light="/arc/servers/images/policy_initiative_definition-light.png" dark="/arc/servers/images/policy_initiative_definition-dark.png" alt="Policy initiative definition" >}}

    The name or ID of the policy initiative is the GUID highlighted in red.

1. Alternatively, use the CLI to find the name

    ```bash
    az policy set-definition list --query "[?contains(displayName, 'Azure Monitor')].{name:name, displayName:displayName}" --output table
    ```

    Example output:

    ```text
    Name                                  DisplayName
    ------------------------------------  -------------------------------------------------------------------------------------------------------------------------
    0d1b56c6-6d1f-4a5d-8695-b15efbea6b49  Deploy Windows Azure Monitor Agent with user-assigned managed identity-based auth and associate with Data Collection Rule
    118f04da-0375-44d1-84e3-0fd9e1849403  Configure Linux machines to run Azure Monitor Agent and associate them to a Data Collection Rule
    55f3eceb-5573-4f18-9695-226972c6d74a  Enable Azure Monitor for VMs
    75714362-cae7-409e-9b99-a8e5075b7fad  Enable Azure Monitor for Virtual Machine Scale Sets
    9575b8b7-78ab-4281-b53b-d3c1ace2260b  Configure Windows machines to run Azure Monitor Agent and associate them to a Data Collection Rule
    a15f3269-2e10-458c-87a4-d5989e678a73  [Preview]: Configure machines to automatically install the Azure Monitor and Azure Security agents on virtual machines
    ```

1. Set the variable

    ```bash
    policy_initiative_name=118f04da-0375-44d1-84e3-0fd9e1849403
    ```

### Parameters

1. Return to the policy initiative definition in the portal
1. Click on *Parameters*

    {{< img light="/arc/servers/images/policy_initiative_definition_parameters-light.png" dark="/arc/servers/images/policy_initiative_definition_parameters-dark.png" alt="Policy initiative definition" >}}

    Frustratingly the portal does not display the actual parameter name for the Data Collection Rule Resource Id.

1. Click on *Duplicate initiative*
1. Click on *Initiative parameters*

    {{< img light="/arc/servers/images/policy_initiative_definition_parameter_names-light.png" dark="/arc/servers/images/policy_initiative_definition_parameter_names-dark.png" alt="Policy initiative parameter names" >}}

    The parameter's name is `dcrResourceId`.

1. Alternatively, use the Azure CLI

    ```bash
    az policy set-definition show --name $policy_initiative_name --query "keys(parameters)" --output yaml
    ```

    Example output:

    ```yaml
    - effect
    - listOfLinuxImageIdToInclude
    - dcrResourceId
    ```

1. Create a params file

    Create a file called params.json and paste in the JSON from the code block below.

    {{< code lang=json file="/content/arc/servers/params.json" >}}

    ⚠️ Update `your_default_workspace_resource_id` with the resource ID of the workspace as before.

### Assign the policy initiative

```bash
az policy assignment create --name azure_monitor_for_linux \
  --display-name "Configure Azure Monitor Agent and DCR for Linux VMs" \
  --description "Configure Azure Monitor Agent on Linux VMs and associate to a Data Collection Rule" \
  --policy-set-definition $policy_initiative_name \
  --scope $scope \
  --mi-system-assigned --location westeurope \
  --identity-scope $scope --role "Log Analytics Contributor"\
  --params params.json
```

The managed identity role can be a custom role, but it is simplest to use [built-in RBAC roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles).

The default is *[Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#contributor)*. For extensions then you can be a little more specific and use use *[Azure Connected Machine Resource Administrator](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#azure-connected-machine-resource-administrator)* but this cannot add extensions to Azure VMs. The recommendation here is to use *[Log Analytics Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#log-analytics-contributor)* which can install both Azure and Azure Arc extensions.

> Note that policy initiatives used to be called policy sets.

### Check the assignment

1. Open the portal, navigate to Policy and view [Assignments](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyMenuBlade/~/Assignments)
1. Click on *Configure Azure Monitor Agent and DCR for Linux VMs*

    Note that the initiative is assigned at the Landing Zones scope.

    {{< img light="/arc/servers/images/policy_assignment_parameter_values-light.png" dark="/arc/servers/images/policy_assignment_parameter_values-dark.png" alt="Policy assignment parameter values" >}}

    The dcrResourceId parameter was successfully set to the workspace ID.

1. Click on Managed Identity

    {{< img light="/arc/servers/images/policy_assignment_managed_identity-light.png" dark="/arc/servers/images/policy_assignment_managed_identity-dark.png" alt="Policy assignment managed identity" >}}

    The managed identity scope and role are correct.

## Azure Monitor Agent for Windows

YOU ARE HERE

## Change Tracking extension

## Next Steps

In the next lab we'll ...
