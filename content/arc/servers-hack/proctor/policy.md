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

## Success criteria

* Check the Agents configuration for the workspace - all but IIS Logs should be configured as above
* Check the tags on the rg
* Check the policy assignments on the rg
  * VM agent initiative
  * The two tag inheritance policies
  * Remediation tasks - should be four; two for the tags and two for the dependency agents
