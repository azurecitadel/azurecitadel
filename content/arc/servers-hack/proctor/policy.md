---
title: "Azure Policy"
description: "Use Azure Policy to automate agent deployments and tagging for your Azure Arc Virtual Machines."
layout: single
draft: false
series:
 - arc-servers-hack-proctor
weight: 3
---

## Policy - Tags

Assign the _Inherit a tag from the resource group if missing_ policy

* Parameter **tagName = datacentre**
* Assignment name: "Inherit datacentre tag from the resource group if missing"

Repeat for _platform_.

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

## Policy - VM Extensions

Hints:

* Check the links
* Filter the definitions and the to see what is available
* Check both policies and initiatives

* Go to [Policy Definitions](https://ms.portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions)
* Searching on "Azure Arc" should show the six preview policies
* Clear the search and filter on type = initiative and category = monitoring
* Check the _Enable Azure Monitor for VMs_
  * includes policies for both Azure VMs and Azure Arc VMs
  * covers both extensions and both OS types

Tasks:

* Assign _Enable Azure Monitor for VMs_ to the arc-hack resource group
  * select the workspace

## Success criteria

* Check the Agents configuration for the workspace - all but IIS Logs should be configured as above
* Check the tags on the rg
* The tags should have been inherited on the workspace
* Check the policy assignments on the rg
  * VM agent initiative
  * The two tag inheritance policies
* Check the role assignments - Azure Connected Machine Onboarding should list the policy identity
