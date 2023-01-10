---
title: Azure Monitoring Agent
description: "Summary of the switch from legacy agents (MMA, Dependency) to the Azure Monitor Agent. Enable VM Insights with the AMA."
slug: ama
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-ama
series:
 - arc-servers
weight: 130
---

## Introduction

The [Azure Monitor Agent](https://learn.microsoft.com/azure/azure-monitor/agents/agents-overview) (AMA) is replacing the legacy monitoring agents.

Historically the agent based collection has been done using the Log Analytics Agent (also known as the Microsoft Monitoring Agent (MMA) agent or OMS agent), as well as the secondary Telegraf agent used for Linux metrics. It also changes how the Dependency agent is configured for Service Map information.

The older agent will be [retired](https://learn.microsoft.com/azure/azure-monitor/agents/azure-monitor-agent-migration) on August 31, 2024.

Wide World Importers have decided to exclusively use the newer AMA agent in the POC.

As a starting point, they would like to have VM Insights configured for the hybrid servers. There is a level of confusion whilst some of the documentation pages and policy definitions continue to refer to the legacy agents. However, enabling [VM Insights using the Azure Monitor Agent](https://learn.microsoft.com/azure/azure-monitor/vm/vminsights-enable-overview#agents) is in preview and that is what will be configured in the POC.

## Delete policy assignments

OK, first things first. We will delete a couple of the legacy policy assignments created by Azure Landing Zones.

The default policy assignments continue to deploy the legacy agents whilst some of the Azure Monitor Agent policies remain in preview. Unassign them.

* Navigate to the **Policy | Assignments** blade
* Search on Enable Azure Monitor
* Select one of the assignments
* Click on *View definition*

    {{< img light="/arc/servers/images/legacy-light.png" dark="/arc/servers/images/legacy-dark.png" alt="Legacy policy initiatives" >}}

    The name and description are now prefixed with "Legacy".

* Click on the red cross at the top right twice to return back to the filtered list
* Delete both assignments

    {{< img light="/arc/servers/images/delete-legacy-light.png" dark="/arc/servers/images/delete-legacy-dark.png" alt="Delete assignments of legacy policy initiatives" >}}

## VM Insights policy initiative

1. View the *Enable Azure Monitor for Hybrid VMs with AMA* policy initiative definition

    {{< img light="/arc/servers/images/vminsights-light.png" dark="/arc/servers/images/vminsights-dark.png" alt="Enable Azure Monitor for Hybrid VMs with AMA" >}}

    > If you dive into the Dependency agent policies then you'll notice that the extension deployment has a setting, `"enableAMA": "true"`, to configure it for the AMA rather than MMA.

1. Check the parameters

    The only required parameter value is *logAnalyticsWorkspace*.

    The *dataCollectionRuleName* parameter value will default to `ama-vmi-default`.

    The definition will prefix the *dataCollectionRuleName* with `MSVMI-` and suffix it with `-dcr`, so the default DCR name will be `MSVMI-ama-vmi-default-dcr`.

    The *enableProcessesAndDependencies* boolean defaults to *false*.

{{< flash >}}
⚠️ Don't deploy the policy initiative via the portal even though that would be quicker.

We want to know how to automate this so will step through the process as an example.
{{< /flash >}}

## Log Analytics workspace

When you looked at the policy initiative, the only required parameter values was a workspace ID.

Create a workspace in the arc_pilot resource group.

Name it *MSVMI-ama-vmi-default-workspace* to be consistent with the default DCR naming.

1. Create a Log Analytics workspace for VM Insights

    ```bash
    az monitor log-analytics workspace create --name MSVMI-ama-vmi-default-workspace \
      --resource-group arc_pilot --location westeurope
    ```

## Required roles

The policies in the initiative use Deploy If Not Exists to provision the DCR, the AMA and Dependency extensions, and the DCR VM association.

You need to determine the required permissions for the managed identity if you are going to automate the deployment.

Return to the policy definition view and we'll do a **partial** deployment to view the roles.

1. Click on **Assign**
1. *Basics* tab: Select the Landing Zones (alz-landingzones) management group
1. *Parameters* tab: Use the ellipsis (*...*) to select the subscription and workspace
1. *Remediation* tab: Check the permissions for the RBAC roles

    {{< img light="/arc/servers/images/permissions-light.png" dark="/arc/servers/images/permissions-dark.png" alt="Managed identity permissions" >}}

    The required roles are:

    * **Azure Connected Machine Resource Administrator**
    * **Log Analytics Contributor**
    * **Monitoring Contributor**

1. Click on *Cancel*

    {{< flash >}}
⚠️ Do not click on Create! You'll assign the policy via the CLI.
{{< /flash >}}

## Assign the policy

1. Get to the workspace ID

    ```bash
    workspace_id=$(az monitor log-analytics workspace show --name MSVMI-ama-vmi-default-workspace \
      --resource-group arc_pilot --query id --output tsv)
    ```

1. Set scope to the *Landing Zones* management group

    ```bash
    scope=/providers/Microsoft.Management/managementGroups/alz-landingzones
    ```

1. Assign the policy initiative

    ```bash
    az policy assignment create --name AMAhybrid \
      --display-name "Enable Azure Monitor for Hybrid VMs with AMA" \
      --description "Enable Azure Monitor for Hybrid VMs with Azure Monitor Agent (VM Insights)" \
      --policy-set-definition 59e9c3eb-d8df-473b-8059-23fd38ddd0f0 \
      --scope $scope \
      --mi-system-assigned --location westeurope \
      --identity-scope $scope \
      --role "Azure Connected Machine Resource Administrator" \
      --params "{\"logAnalyticsWorkspace\": {\"value\":\"$workspace_id\"}, \"enableProcessesAndDependencies\": {\"value\": true}}"
    ```

    {{< flash >}}
Setting the *enableProcessesAndDependencies* boolean to *true* installs the Dependency agent.

The policies automatically set the agent's *enableAMA* property to *true*.
{{< /flash >}}

    You can only assign a single role when creating policy assignments via the Azure CLI.

1. Assign additional roles to the managed identity

    ```bash
    az policy assignment identity assign --name AMAhybrid \
      --scope $scope \
      --system-assigned --identity-scope $scope \
      --role "Log Analytics Contributor"
    ```

    ```bash
    az policy assignment identity assign --name AMAhybrid \
      --scope $scope \
      --system-assigned --identity-scope $scope \
      --role "Monitoring Contributor"
    ```

## Check the roles

* Portal:

    Filter on "Monitor" in [Policy | Assignments](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyMenuBlade/~/Assignments), select *Enable Azure Monitor for Hybrid VMs with AMA* and select the *Managed Identity* tab.

    {{< img light="/arc/servers/images/assignment-permissions-light.png" dark="/arc/servers/images/assignment-permissions-dark.png" alt="Managed identity permissions" >}}

* CLI:

    ```bash
    identity_id=$(az policy assignment identity show --name AMAhybrid --scope $scope --query principalId --output tsv)
    az role assignment list --scope $scope --assignee $identity_id --query "[].roleDefinitionName"
    ```

    Expected output:

    ```json
    [
      "Azure Connected Machine Resource Administrator",
      "Log Analytics Contributor",
      "Monitoring Contributor"
    ]
    ```

## Success criteria

Show the proctor:

1. the resource group name, location, tags and resources
1. the RBAC assignment for *Azure Arc Admins*
1. your tag inheritance policy assignments
1. your VM Insights initiative assignment
1. that the initial Enable Azure Monitor assignments have been deleted

## Resources

* <https://learn.microsoft.com/azure/azure-monitor/agents/agents-overview>
* <https://learn.microsoft.com/azure/azure-monitor/agents/azure-monitor-agent-migration>
* <https://learn.microsoft.com/azure/azure-monitor/vm/vminsights-overview>
* <https://learn.microsoft.com/azure/azure-monitor/vm/vminsights-enable-overview#agents>


## Next

The policy initiative is a great way to deploy the new Azure Monitoring Agent at scale, and you can also

In the next lab you will assign more policy initiatives for deploying additional extensions to hybrid machines.
