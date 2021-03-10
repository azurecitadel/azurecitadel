---
title: "Azure Policy"
description: "Use Azure Policy to automate agent deployments and tagging for your Azure Arc Virtual Machines."
layout: single
draft: false
series:
 - arc-servers-hack-proctor
weight: 3
---

## Log Analytics Workspace

Hints:

* Check the links
* Follow the <https://docs.microsoft.com/azure/azure-monitor/vm/quick-collect-azurevm>
* Skip the Enable the Log Analytics
* The screens have been updated since the guide

Steps:

* Create a workspace
* Skip the Enable the Log Analytics VM Extension
* Configure Collect event and performance data - Agents configuration
  * Windows Event Logs
    * Add
    * Filter to System, deselect Information and Apply
  * Windows performance counters
    * Add recommended counters and Apply
  * Syslog
    * Add facility, select syslog from drop down
    * Deselect Notice, Info, Debug
    * Apply
  * Linux performance counters
    * Add recommended counters and Apply
* Deploy the Log Analytics agents in the Extensions part of the [Servers - Azure Arc](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.HybridCompute%2Fmachines) blade

### Proctor notes

* Create a workspace

In the portal, navigate to or search for **Log Analytics workspaces** and **Create**.

* Resource group: `arc-hack`
* Name: `arc-hack-workspace-team1` *(Note: must be globally unique)*
* Region: `UK South`
* Pricing tier: `Pay-as-you-go (Per GB 2018)`

Alternatively, using Azure CLI:

```bash
az monitor log-analytics workspace create --resource-group arc-hack --workspace-name arc-hack-workspace-team1

# Note: workspace-name must be globally unique
``` 

* Collect event and performance data from virtual machines connected to the Log Analytics workspace

Open the blade of the Log Analytics workspace, in Settings select **Agents configuration**.

From the Windows event logs tab, **Add Windows event log** and add `Application` and `System` logs. Select Error and Warning level.

From the Windows performance counters tab, **Add recommended counters**.

From the Linux performance counters tab, **Add recommended counters**.

Click **Apply** to save the configuration.

## Policy

Hints:

* Check the links
* Filter the definitions and the to see what is available
* Check both policies and initiatives
* Mention the [samples](https://github.com/Azure/azure-policy/tree/master/samples) and [community](https://github.com/Azure/Community-Policy/) areas - not required for this challenge but good to share

Tasks:

* Go to [Policy Definitions](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions)
* Searching on "Azure Arc" should show the six preview policies
* Clear the search and filter on type = initiative and category = monitoring
* Check the Enable Azure Monitor for VMs
  * includes both Azure VMs and Azure Arc VMs
* Assign to the arc-hack resource group
  * select the workspace
  * create a remediation task for the Dependency agent for one OS type
* Manually add another remediation task for the other OS type
* Assign the Inherit a tag from the resource group if missing
  * Rename and specify Owner
  * Add remediation tasks
  * Duplicate for Platform

Discussion point - custom initiative for auditing missing tags, creating default tags, inheriting tags. Mention policy labs. (Rich needs to add custom initiative - work in progress.)

### Proctor notes

* Deploy the Log Analytics agent to the Azure Arc virtual machines
* Deploy the Dependency agent to the Azure Arc virtual machines

The built-in Policy Initiative **Enable Azure Monitor for VMs** includes Policy Definitions to deploy the Log Analytics agents and Dependency agents for Windows and Linux Azure Arc machines.

In the portal, browse to the **Policy** blade and **Definitions**. Search for `monitor`, select the built-in Policy Initiative named `Enable Azure Monitor for VMs`.

**Assign** the initiative, choosing your subscription as the **Scope** (Note: policy can also apply to Management Group or Resource Group scope).

From the Parameters tab, select the `arc-hack-workspace-team1` Log Analytics workspace created above.

From the Remediation tab, choose **UK South** as the Managed identity location.

Click **Review + create** to create the Policy Assignment.

Alternatively, using Azure CLI:

```bash
az policy assignment create --policy-set-definition "55f3eceb-5573-4f18-9695-226972c6d74a" \
     --params "{ \"logAnalytics_1\": { \"value\": \
    \"/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourcegroups/arc-hack/providers/microsoft.operationalinsights/workspaces/arc-hack-workspace-team1\" \
    } }" \
    --display-name "Arc Hack - Enable Azure Monitor for VMs" \
    --assign-identity --location uksouth

# Note: Replace with your subscription ID
```

## Success criteria

* Check the Agents configuration for the workspace - all but IIS Logs should be configured as above
* Check the tags on the rg
* Check the policy assignments on the rg
  * VM agent initiative
  * The two tag inheritance policies
  * Remediation tasks - should be four; two for the tags and two for the dependency agents
