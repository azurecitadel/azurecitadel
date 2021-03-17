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

### Bug fix

> The bug has now been corrected, but I thought I'd keep the identity command in there for posterity. Vaguely useful, but the policy definitions for dine policies should always list the required roles for the identity.

There is a [known bug](https://github.com/Azure/azure-policy/issues/733) in the _[Preview] Deploy Dependency agent to Windows Azure Arc machines_ policy definition as the managed identity has insufficient permissions to remediate non-compliance. We'll add on the *Azure Connected Machine Onboarding* so that it will remediate successfully.

The following Azure CLI commands will create the additional roles assignment if you have assigned the expected policy initiative at the ar-hack resource group level.

* Add Azure Connected Machine Onboarding to the policy's identity

  ```bash
  identity=$(az policy assignment list --resource-group arc-hack --query "[?displayName == 'Enable Azure Monitor for VMs'].identity.principalId" --output tsv)
  az role assignment create --assignee $identity --role "Azure Connected Machine Onboarding" --resource-group arc-hack
  ```
