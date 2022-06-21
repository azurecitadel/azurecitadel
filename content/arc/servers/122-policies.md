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

The Azure Landing Zones creates a useful set of default platform resources, policies and RBAC role assignments. The Azure Monitor for VMs is useful as it applies to both Azure and Azure Arc-enabled Servers and will install the MMA agent and the Dependency agent.

However, the VM monitoring landscape is moving at the moment and the desire is to move towards the Azure Monitor Agent (AMA) for collecting metrics and data. The new agent does not have full parity with the older agents, but for metrics and data it is more flexible, supporting multiple data collection rules.

The *Deploy if Not Exists* policies are useful to help automate configuration of resources, and therefore World Wide Importers would like to use additional policy assignments to automate the installation of the extension.

Before we move through the [Overview](#overview) for this lab, quickly step through background information on the available policy definitions and key elements of policy assignments.

## Policy Definitions

There are a number of other custom and built-in policies that are applicable to Azure Arc-enabled Servers.

1. Select the Azure Landing Zones management group
1. Filter Categories to
    * Azure Arc
    * Monitoring
    * Security Center
1. Search on "*Arc*"

    The screenshot below shows a selection of the Azure Arc related policies and policy initiatives.

    {{< img light="/arc/servers/images/arc_policies-light.png" dark="/arc/servers/images/arc_policies-dark.png" alt="Additional policies applicable to Azure Arc-enabled Servers" >}}

    In addition, the policies in the Guest Configuration category can be used with Azure Arc-enabled Servers as well as Azure servers. You will explore this in the later [Governance](./governance) lab.

    > Note that searching on  *arc" will also bring up policies containing search etc. Ignore these.

    **In this lab we will assign the two policy initiatives for the Azure Monitor Agent.**

## Policy Assignments

Before we move on, let's quickly cover some of the key components involved in Policy assignments:

* assignment info (name, display name, description)
* policy or policy initiative id (or name)
* scope
* parameters
* managed identity (system or user assigned, identity scope, role and location)

    > The managed identity definition is only needed by the template deployments in *deploy if not exist* policies.

The Azure documentation has a maintained index of the built-in [policies](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies) and [policy initiatives](https://docs.microsoft.com/azure/governance/policy/samples/built-in-initiatives), which then links to the definitions in the [Azure Policy GitHub repo](https://github.com/Azure/azure-policy). Alternatively, you can search the Policy definitions using the CLIs or the portal.

## Lab Overview

### Required Policy Initiatives

The pilot requires these two Policy Initiatives to be assigned at the Landing Zones management group.

1. **Configure Linux machines to run Azure Monitor Agent and associate them to a Data Collection Rule**
    * Configure Linux virtual machines to run Azure Monitor Agent using system-assigned managed identity
    * Configure Linux virtual machine scale sets to run Azure Monitor Agent using system-assigned managed identity
    * Configure Linux Arc-enabled machines to run Azure Monitor Agent
    * Configure Linux Machines to be associated with a Data Collection Rule

      > You will be guided in the assignment for this initiative.

1. **Configure Windows machines to run Azure Monitor Agent and associate them to a Data Collection Rule**
    * Configure Windows virtual machines to run Azure Monitor Agent using system-assigned managed identity
    * Configure Windows virtual machine scale sets to run Azure Monitor Agent using system-assigned managed identity
    * Configure Windows Arc-enabled machines to run Azure Monitor Agent
    * Configure Windows Machines to be associated with a Data Collection Rule

      > You will assign the second yourself.

### Required Resources

There are a few additional resources that need to be in place before the policy initiatives can be assigned.

* Resource Group

    The Azure Monitor Agent related resources for the POC will be placed into a single resource group named `azure_monitor_agent`.

* Data Collection Rule

    The Data Collection Rule is the definition that glues agent based data collection with the destinations for metrics and logs. Within a DCR you define which *data sources* will be collected and added to *streams*. The *streams* are then linked to the *destinations* via the *data flows*.

    > The DCRs allow more granularity and flexibility in making sure the right metrics and logs are distributed to the right workspaces. The newer model permits more precision in data retention and RBAC controls. You will be creating additional Data Collection Rules (or DCRs) in the Monitoring lab.

    In this lab you will create a baseline DCR called `default_data_collection_rule` using the default example used in the [create REST API call for data collection rules](https://docs.microsoft.com/en-gb/rest/api/monitor/data-collection-rules/create#create-or-update-data-collection-rule).

* Log Analytics Workspace

    We will create a Log Analytics workspace called arc-pilot-core as the destination for the log streams in the default DCR.

    Also create a couple of others that will be needed in the [Monitoring](./monitoring) lab later.

  * **`arc-pilot-core`**
  * `arc-pilot-soc`
  * `arc-pilot-linuxapp`

## Resource Group

1. Create a resource group

    ```bash
    az group create --name azure_monitor_agent --location westeurope
    ```

## Log Analytic Workspaces

1. Create the `arc-pilot-core` workspace

    ```bash
    az monitor log-analytics workspace create --workspace-name arc-pilot-core --resource-group azure_monitor_agent --location westeurope
    ```

1. Repeat for `arc-pilot-soc`
1. Repeat for `arc-pilot-linuxapp`
1. Get the workspace resource id for *arc-pilot-core*

   ```bash
   workspace_id=$(az monitor log-analytics workspace show --workspace-name arc-pilot-core --resource-group azure_monitor_agent --query id --output tsv)
   ```

## Data Collection Rule (DCR)

You will use the [REST API](https://docs.microsoft.com/rest/api/monitor/data-collection-rules/create) to create the DCR.

You could create the DCR in a number of different ways but the JSON body for the REST API call is self contained and relatively simple to use compared to the multiple CLI commands.

1. Create the body

    Create a file called dcr.json and paste in the JSON from the code block below.

    {{< details "How do I create files in Cloud Shell with the Monaco editor?" >}}

1. Edit the file using `code dcr.json`
1. Save the file with `CTRL`+`S`
1. Close the editor with `CTRL`+`Q`
    {{< /details >}}

    {{< code lang=json file="/content/arc/servers/dcr.json" >}}

1. Display the workspace resource id

    ```bash
    echo $workspace_id
    ```

1. Copy the value to the clipboard
1. Edit the body

    Edit the dcr.json file. Line 86 has a placeholder, `your_default_workspace_resource_id`.

    Paste the resource ID from the clipboard to replace it. For example:

    ```json
        "destinations": {
          "logAnalytics": [
            {
              "workspaceResourceId": "/subscriptions/dc36c76c-b092-4e9b-b194-46805b82b2aa/resourceGroups/azure_monitor_agent/providers/Microsoft.OperationalInsights/workspaces/arc-pilot-core",
              "name": "centralWorkspace"
            }
          ]
        },
    ```

1. Set a name for the DCR.

    We'll start to construct the URI for the REST API call. First define the name of the resource.

    ```bash
    dcr_name=default_data_collection_rule
    ```

1. Grab the resource ID for the resource group

    Second, get the resource ID for the resource group.

    ```bash
    rg_id=$(az group show --name azure_monitor_agent --query id --output tsv)
    ```

1. Construct the URI

    The two variables are then inserted into the URI path.

    ```bash
    uri="https://management.azure.com/${rg_id}/providers/Microsoft.Insights/dataCollectionRules/${dcr_name}?api-version=2021-04-01"
    ```

1. Call the REST API using the Azure CLI

    ```bash
    az rest --method put --uri $uri --body @dcr.json
    ```

1. Extend the CLI with

1. Get the resource ID for the DCR

   ```bash
   dcr_id=$(az monitor data-collection rule show --name $dcr_name --resource-group azure_monitor_agent --query id --output tsv)
   ```

## Constructing policy assignments

The simplest way to assign policies is via the portal, but it is recommended that you take the time to work out how to assign policies via scripting or templates. Here we will do so for the Azure CLI.

The `az policy assignment create` command will create the policy assignment, but we need some additional argument values.

{{< details "More detail..." >}}

The command to assign a deploy if not exists (dine) policy is:

```bash
az policy assignment create --name <assignment_name> \
  --display-name "Display name" \
  --description "Description" \
  --policy-set-definition <policy_initiative_name> \
  --scope <assignment_scope> \
  --mi-system-assigned \
  --location <managed_instance_location> \
  --identity-scope <managed_instance_rbac_role_assignment_scope> \
  --role <managed_instance_rbac_role_assignment_role_definition_name> \
  --params <parameter_value_json_string_or_file>
```

We are missing the following argument values:

* the scope for the policy assignment (and managed identity role assignment)
* the policy initiative name
* the managed identity role
* the required parameter names and values

> Note that you could use a user assigned managed identity, instead of the system assigned managed identity shown here. (One reason to do this is to enable policy assignments by those who only have Contributor access.)

{{< /details >}}

You can get most of the required values straight from the [JSON policy definition](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Monitoring/AzureMonitor_LinuxPlatform_EnableDCR.json), but we'll run through how to get those from the portal or from CLI commands.

We'll set those as variables and use them in the `az policy assignment create` command.

Let's start with `--scope $scope`.

### Scope

#### Management groups

The assignment scope is the Landing Zones management group.

The management group resource ID format is `/providers/Microsoft.Management/managementGroups/<id>`.

#### Set the variable

1. Set the `scope` variable

    ```text
    scope=/providers/Microsoft.Management/managementGroups/alz-landingzones
    ```

### Policy Initiative name

The name (or id) of the initiative is the GUID. How do you find the name of a policy or policy initiative?

#### Finding the name in the portal

1. Open the portal and go to [Policy definitions](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyMenuBlade/~/Definitions)
1. Filter on
    * Definition type: **Initiative**
    * Search: **Azure Monitor**
1. Click on ***Configure Linux machines to run Azure Monitor Agent and associate them to a Data Collection Rule***

    {{< img light="/arc/servers/images/policy_initiative_definition-light.png" dark="/arc/servers/images/policy_initiative_definition-dark.png" alt="Policy initiative definition" >}}

    The name or ID of the policy initiative is the GUID highlighted in red.

#### Finding the name in the portal

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

#### Set the variable

1. Set the `policy_initiative_name` variable

    ```bash
    policy_initiative_name=118f04da-0375-44d1-84e3-0fd9e1849403
    ```

### Managed Identity Role

#### Which role should I use?

Refer to the [built-in RBAC roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles).

The default managed identity role is *[Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#contributor)*.

However, we should aim for least privilege, even for managed identties.

For extensions you can be a little more specific and use either *[Azure Connected Machine Resource Administrator](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#azure-connected-machine-resource-administrator)* (Azure Arc-enabled VMs only) or *[Log Analytics Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#log-analytics-contributor)* (for both Azure and Azure Arc extensions).

The policy initiative contains policies for both types of VMs so use `Log Analytics Contributor`.

{{< details "More detail..." >}}
Here is the role definition showing the wildcard actions for extension on both `Microsoft.Compute/virtualmachines` and `Microsoft.HybridCompute/machines`.

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Log Analytics Contributor can read all monitoring data and edit monitoring settings. Editing monitoring settings includes adding the VM extension to VMs; reading storage account keys to be able to configure collection of logs from Azure Storage; adding solutions; and configuring Azure diagnostics on all Azure resources.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/92aaf0da-9dab-42b6-94a3-d43ce8d16293",
  "name": "92aaf0da-9dab-42b6-94a3-d43ce8d16293",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.ClassicCompute/virtualMachines/extensions/*",
        "Microsoft.ClassicStorage/storageAccounts/listKeys/action",
        "Microsoft.Compute/virtualMachines/extensions/*",
        "Microsoft.HybridCompute/machines/extensions/write",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/diagnosticSettings/*",
        "Microsoft.OperationalInsights/*",
        "Microsoft.OperationsManagement/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/*",
        "Microsoft.Storage/storageAccounts/listKeys/action",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Log Analytics Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

> Note that you can also use custom roles, and you can also select a managed identity assignment scope that is different to the policy assignment scope.

{{< /details >}}

#### Set the variable

1. Set the `role` variable

    ```bash
    role="Log Analytics Contributor"
    ```

### Parameters

#### What do we need to do?

For the parameters, you will need valid parameter values JSON. This can be passed in as a string or placed in a file.

You also need to know which parameters need to be specified and what the parameter values should be.

Let's work through it.

#### What parameter needs to be included?

We'll grab the parameter name from the portal.

1. Return to the policy initiative definition in the portal
1. Click on *Parameters*

    {{< img light="/arc/servers/images/policy_initiative_definition_parameters-light.png" dark="/arc/servers/images/policy_initiative_definition_parameters-dark.png" alt="Policy initiative definition" >}}

    Frustratingly the portal does not display the actual parameter name for the Data Collection Rule Resource Id.

1. Click on *Duplicate initiative*
1. Click on *Initiative parameters*

    {{< img light="/arc/servers/images/policy_initiative_definition_parameter_names-light.png" dark="/arc/servers/images/policy_initiative_definition_parameter_names-dark.png" alt="Policy initiative parameter names" >}}

    The parameter's name is `dcrResourceId`.

#### Can I use the Azure CLI rather than the portal?

1. Show the parameter keys for a policy definition

    Use the keys() function in a JMESPATH query in the Azure CLI to see the parameter name.

    ```bash
    az policy set-definition show --name $policy_initiative_name --query "keys(parameters)" --output yaml
    ```

    Example output:

    ```yaml
    - effect
    - listOfLinuxImageIdToInclude
    - dcrResourceId
    ```

#### What parameter value do I need for _dcrResourceId_?

1. Show the workspace_id

    The parameter value will be the workspace resource ID for `arc-pilot-core`. You captured to a variable earlier in the lab.

    ```bash
    echo $workspace_id
    ```

1. Copy to the clipboard

#### How do I create a file?

1. Create a params file

    Create a file called params.json and paste in the JSON from the code block below.

    {{< code lang=json file="/content/arc/servers/params.json" >}}

    ⚠️ Update `your_default_workspace_resource_id` with the resource ID of the workspace as before.

## Assign the Linux policy initiative

### Assign

Now that you have all of the constituent argument values, construct the command to assign the policy initiative:

```bash
az policy assignment create --name azure_monitor_for_linux \
  --display-name "Configure Azure Monitor Agent and DCR for Linux VMs" \
  --description "Configure Azure Monitor Agent on Linux VMs and associate to a Data Collection Rule" \
  --policy-set-definition $policy_initiative_name \
  --scope $scope \
  --mi-system-assigned --location westeurope \
  --identity-scope $scope --role "$role" \
  --params params.json
```

> Note that policy initiatives used to be called policy sets.

### Check

1. Open the portal, navigate to Policy and view [Assignments](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyMenuBlade/~/Assignments)
1. Click on *Configure Azure Monitor Agent and DCR for Linux VMs*

    Note that the initiative is assigned at the Landing Zones scope.

    {{< img light="/arc/servers/images/policy_assignment_parameter_values-light.png" dark="/arc/servers/images/policy_assignment_parameter_values-dark.png" alt="Policy assignment parameter values" >}}

    The dcrResourceId parameter was successfully set to the workspace ID.

1. Click on Managed Identity

    {{< img light="/arc/servers/images/policy_assignment_managed_identity-light.png" dark="/arc/servers/images/policy_assignment_managed_identity-dark.png" alt="Policy assignment managed identity" >}}

    The managed identity scope and role are correct.

## Azure Monitor Agent for Windows

Over to you!

1. Assign the *Configure Windows machines to run Azure Monitor Agent and associate them to a Data Collection Rule* policy initiative to the Landing Zones scope.

## Success criteria

Show your proctor:

* The azure_monitor_agent resource group and resources
  * arc-pilot-core
  * arc-pilot-linuxapp
  * arc-pilot-soc
  * default_data_collection_rule
* The two policy initiative assignments
  * Parameter values
  * Managed identity configuration

## Next Steps

In the next lab we'll ...
