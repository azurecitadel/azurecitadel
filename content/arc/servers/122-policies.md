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

However, the VM monitoring landscape is moving at the moment and the desire from World Wide Importers is to move towards the newer Azure Monitor Agent (AMA) for collecting metrics and data. The AMA agent does not have full parity with the older agents, but for metrics and data it is more flexible, supporting multiple data collection rules.

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

      > You will assign the second initiative yourself.

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

    You'll also create a couple of others that will be needed in the [Monitoring](./monitoring) lab later.

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

You will use the [REST API](https://docs.microsoft.com/rest/api/monitor/data-collection-rules/create) to create the DCR. You could create the DCR in a number of different ways but the JSON body for the REST API call is self contained and relatively simple to use compared to the multiple CLI commands.

1. Create the JSON body

    Create a file called dcr.json.

    {{< details "How do I create files in Cloud Shell with the Monaco editor?" >}}

1. Edit the file using `code dcr.json`
1. Save the file with `CTRL`+`S`
1. Close the editor with `CTRL`+`Q`
    {{< /details >}}

    Paste in the JSON from the code block below.

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

    We'll start to construct the URI for the [REST API](https://docs.microsoft.com/rest/api/monitor/data-collection-rules/create) call. First define the name of the resource.

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

1. Extend the CLI with monitor-control-service

   ```bash
   az extension add --upgrade --version 0.2.0 --name monitor-control-service
   ```

   > There is currently an issue with version 0.3.0.

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

> Note that you could use a user assigned managed identity, instead of the system assigned managed identity shown here. (One reason to do this is to enable policy assignments by those who only have Contributor access.)

{{< /details >}}

We need argument values for:

* the scope for the policy assignment (and managed identity role assignment)
* the policy initiative name
* the managed identity role(s)
* the required parameter names and values

We'll run through how to get those values from the portal and then use them in the `az policy assignment create` command.

### Scope

Let's start with the `--scope` argument.

The assignment scope is the Landing Zones management group. Copy the ID.

{{< img light="/arc/servers/images/landing_zone_management_group-light.png" dark="/arc/servers/images/landing_zone_management_group-dark.png" alt="Landing zone management group" >}}

The management group resource ID format is `/providers/Microsoft.Management/managementGroups/<id>`.

{{< flash >}}
Azure Landing Zones management group resource ID:

**/providers/Microsoft.Management/managementGroups/alz-landingzones**
{{< /flash >}}

### Policy initiative name

The name (or id) of the initiative is the GUID. How do you find the name of a policy or policy initiative?

1. Open the portal and go to [Policy definitions](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyMenuBlade/~/Definitions)
1. Filter on
    * Definition type: **Initiative**
    * Search: **Azure Monitor**
1. Click on ***Configure Linux machines to run Azure Monitor Agent and associate them to a Data Collection Rule***

    {{< img light="/arc/servers/images/policy_initiative_definition-light.png" dark="/arc/servers/images/policy_initiative_definition-dark.png" alt="Policy initiative definition" >}}

    The name or ID of the policy initiative is the GUID highlighted in red.

1. Copy the definition ID and remove the path

{{< flash >}}
Policy initiative name:

**118f04da-0375-44d1-84e3-0fd9e1849403**
{{< /flash >}}

### Managed identity role(s)

You will need to define the right set of [RBAC roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles) for the managed identity to successfully deploy the template that is embedded in the policy's effect section.

> ⚠️ The simplest way to see required permissions is to start an assignment. You won't complete the assignment; this is purely a method to get the list of RBAC roles needed by the managed identity.

1. Open the portal and navigate to [Policy](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyMenuBlade/~/Overview)
1. Click on *Definitions* and filter *Definition type* to *Initiative*
1. Find the *Configure Linux machines to run Azure Monitor Agent and associate them to a Data Collection Rule* policy initiative
1. Click on *Assign*
1. On the Basic tab, select any scope

    > The portal does not pull out the set of roles until a scope is selected. It doesn't matter which scope is selected as you will be cancelling.

1. Click on *Remediation*
1. Copy the list of permissions

    {{< img light="/arc/servers/images/policy_initiative_role_permissions-light.png" dark="/arc/servers/images/policy_initiative_role_permissions-dark.png" alt="Policy initiative role permissions" >}}

1. Click on *Cancel*

{{< flash >}}
List of role assignments (permissions):

* **Virtual Machine Contributor**
* **Azure Connected Machine Resource Administrator**
* **Monitoring Contributor**
* **Log Analytics Contributor**
{{< /flash >}}

### Parameter name

For the parameters, you will need valid a parameter values JSON. This can be passed in as a string or placed in a file.

You also need to know which parameters need to be specified and what the parameter values should be.  We'll grab the parameter name from the portal.

> ⚠️This time you'll be using the *Duplicate*. Once again, the aim is not to duplicate the assignment -- you;'ll cancel out - but you need the parameter values.

1. Return to the policy initiative definition in the portal
1. Click on *Parameters*

    {{< img light="/arc/servers/images/policy_initiative_definition_parameters-light.png" dark="/arc/servers/images/policy_initiative_definition_parameters-dark.png" alt="Policy initiative definition" >}}

    Frustratingly the portal does not display the actual parameter name for the Data Collection Rule Resource Id.

1. Click on *Duplicate initiative*
1. Click on *Initiative parameters*

    {{< img light="/arc/servers/images/policy_initiative_definition_parameter_names-light.png" dark="/arc/servers/images/policy_initiative_definition_parameter_names-dark.png" alt="Policy initiative parameter names" >}}

    The `dcrResourceId` is the only one we need to specify.

1. Click on *Cancel*

{{< flash >}}
Parameter name:

**dcrResourceId**
{{< /flash >}}

### Parameter value for dcrResourceId

You need the resource ID for the data collection rule you created earlier.

1. Show the resource ID for the DCR

    ```bash
    az monitor data-collection rule show --name default_data_collection_rule --resource-group azure_monitor_agent --query id --output tsv
    ```

1. Copy to the clipboard

#### How do I create a file?

1. Create a params file

    Create a file called params.json and paste in the JSON from the code block below.

    {{< code lang=json file="/content/arc/servers/params.json" >}}

    ⚠️ Update `your_data_collection_rule_resource_id` with the resource ID of the workspace as before.

## Assign the Linux policy initiative

OK,. we have all of the information that we need to create the command.

### Assign

Now that you have all of the constituent argument values, construct the command to assign the policy initiative:

1. Create the assignment

    ```bash
    az policy assignment create --name azure_monitor_for_linux \
      --display-name "Configure Azure Monitor Agent and DCR for Linux VMs" \
      --description "Configure Azure Monitor Agent on Linux VMs and associate to a Data Collection Rule" \
      --policy-set-definition 118f04da-0375-44d1-84e3-0fd9e1849403 \
      --scope /providers/Microsoft.Management/managementGroups/alz-landingzones \
      --mi-system-assigned --location westeurope \
      --identity-scope /providers/Microsoft.Management/managementGroups/alz-landingzones \
      --role "Azure Connected Machine Resource Administrator" \
      --params params.json
    ```

    > Policy initiatives used to be called policy sets. Be warned that the command will not complain if you use the `--role` argument multiple times, but it will only assign the last `--role` specified.

1. Add the *Log Analytics Contributor* role

    ```bash
      az policy assignment identity assign --name azure_monitor_for_linux \
      --scope /providers/Microsoft.Management/managementGroups/alz-landingzones \
      --system-assigned \
      --identity-scope /providers/Microsoft.Management/managementGroups/alz-landingzones \
      --role "Log Analytics Contributor"
    ```

1. Add the *Monitoring Contributor* role

    ```bash
      az policy assignment identity assign --name azure_monitor_for_linux \
      --scope /providers/Microsoft.Management/managementGroups/alz-landingzones \
      --system-assigned \
      --identity-scope /providers/Microsoft.Management/managementGroups/alz-landingzones \
      --role "Monitoring Contributor"
    ```

1. Add the *Virtual Machine Contributor* role

    ```bash
      az policy assignment identity assign --name azure_monitor_for_linux \
      --scope /providers/Microsoft.Management/managementGroups/alz-landingzones \
      --system-assigned \
      --identity-scope /providers/Microsoft.Management/managementGroups/alz-landingzones \
      --role "Virtual Machine Contributor"
    ```

### Check

1. Open the portal, navigate to Policy and view [Assignments](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyMenuBlade/~/Assignments)
1. Click on *Configure Azure Monitor Agent and DCR for Linux VMs*

    Note that the initiative is assigned at the Landing Zones scope.

    {{< img light="/arc/servers/images/policy_assignment_parameter_values-light.png" dark="/arc/servers/images/policy_assignment_parameter_values-dark.png" alt="Policy assignment parameter values" >}}

    The dcrResourceId parameter was successfully set to the workspace ID.

1. Click on Managed Identity

    {{< img light="/arc/servers/images/policy_assignment_managed_identity-light.png" dark="/arc/servers/images/policy_assignment_managed_identity-dark.png" alt="Policy assignment managed identity" >}}

    The managed identity scope and roles are correct.

## Azure Monitor Agent for Windows

⚠️ *Over to you! You've done the policy assignment for the Linux initiative. Repeat for the Windows version.*

> 💡 You'll have to dig out the name of the initiative and check the required permissions are the same.

1. Assign the *Configure Windows machines to run Azure Monitor Agent and associate them to a Data Collection Rule* policy initiative to the Landing Zones scope.

## Using the Azure CLI

> ℹ️ This section is purely for info. Feel free to skip.

If you are doing a number of policy assignments then the Azure CLI can accelerate the process. Let's get the same info using commands.

1. Search the initiatives

    ```bash
    az policy set-definition list --query "[?contains(displayName, 'Azure Monitor Agent')].{name:name, displayName:displayName}" --output table
    ```

    Expected output:

    ```text
    Name                                  DisplayName
    ------------------------------------  -------------------------------------------------------------------------------------------------------------------------
    0d1b56c6-6d1f-4a5d-8695-b15efbea6b49  Deploy Windows Azure Monitor Agent with user-assigned managed identity-based auth and associate with Data Collection Rule
    118f04da-0375-44d1-84e3-0fd9e1849403  Configure Linux machines to run Azure Monitor Agent and associate them to a Data Collection Rule
    9575b8b7-78ab-4281-b53b-d3c1ace2260b  Configure Windows machines to run Azure Monitor Agent and associate them to a Data Collection Rule
    ```

1. Set a variable

    ```bash
    policy_set_name=118f04da-0375-44d1-84e3-0fd9e1849403
    ```

1. Get the parameter names

    ```bash
    az policy set-definition show --name $policy_set_name --query "keys(parameters)"
    ```

    Expected output:

    ```json
    [
      "effect",
      "listOfLinuxImageIdToInclude",
      "dcrResourceId"
    ]
    ```

1. Display the roles

    This one is more complex as it needs to read each of the policies, get the union of the role IDs and their displayNames.

    ```bash
    policy_names=$(az policy set-definition show --name $policy_set_name --query policyDefinitions[].policyDefinitionId --output tsv | sed 's!^.*/!!g')

    role_ids=$(for name in $policy_names
    do az policy definition show --name $name --query policyRule.then.details.roleDefinitionIds --output tsv
    done | sort -u | sed 's!^.*/!!g')

    for role_id in $role_ids
    do az role definition list --name $role_id --query [].roleName --output tsv --only-show-errors
    done | sort
    ```

    Expected output:

    ```text
    Azure Connected Machine Resource Administrator
    Log Analytics Contributor
    Monitoring Contributor
    Virtual Machine Contributor
    ```

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

In the next lab we'll finalise the target environment with a resource group and a service principal for the onboarding scripts.
