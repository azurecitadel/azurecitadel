---
title: "Scale Onboarding"
description: "Onboarding multiple Linux and WIndows servers with a service principal, then automate conneting with the azcmagent."
layout: single
draft: false
series:
 - arc-servers-hack-proctor
weight: 4
---

Most of the script generation etc is now laid out to follow in the lab. Very little challenge left.

Generate the scripts from the _Servers - Azure Arc_ screen.

## Policy

Hints:

* Push to the links
* Policy initiative name
* If stuck direct to the page
* If really stuck then link to the section

| Task | Page | Section |
|---|---|---|
| Evaluation trigger | [Link](https://docs.microsoft.com/azure/governance/policy/how-to/get-compliance-data) | [Link](https://docs.microsoft.com/azure/governance/policy/how-to/get-compliance-data#on-demand-evaluation-scan---azure-cli) |
| Non-compliancy report | [Link]() | [Link]() |
| Initiate remediation | [Link]() | [Link]() |

## Success criteria

* Scripts have been generated and include password and tags

* Policy remediation

    Might not be needed.

    ```bash
    policyName=$(az policy assignment list --resource-group arc-hack --query "[?displayName == 'Enable Azure Monitor for VMs'].name" --output tsv)
    az policy remediation create --name loglin --policy-assignment $policyName --definition-reference-id LogAnalyticsExtension_Linux_HybridVM_Deploy --resource-group arc-hack --resource-type Microsoft.HybridCompute/machines
    az policy remediation create --name logwin --policy-assignment $policyName --definition-reference-id LogAnalyticsExtension_Windows_HybridVM_Deploy --resource-group arc-hack --resource-type Microsoft.HybridCompute/machines
    az policy remediation create --name deplin --policy-assignment $policyName --definition-reference-id DependencyAgentExtension_Linux_HybridVM_Deploy --resource-group arc-hack --resource-type Microsoft.HybridCompute/machines
    az policy remediation create --name depwin --policy-assignment $policyName --definition-reference-id DependencyAgentExtension_Windows_HybridVM_Deploy --resource-group arc-hack --resource-type Microsoft.HybridCompute/machines
    ```

* Resource Graph query

    ```text
    resources
    | where type == "microsoft.hybridcompute/machines"
    | project name,resourceGroup,tags.platform,tags.datacentre,tags.application,properties.osName,id
    | project-rename Platform=tags_Platform, Datacentre=tags_Datacentre, Application=tags_Application, OS=properties_osName
    ```

## Stretch commands

* list the policy assignments at a scope

    ```bash
    az policy assignment list --resource-group arc-hack --query "[].{name:name, desc:displayName, policyDefinition:policyDefinitionId}" --output table
    ```

* list the policy definition reference IDs in an initiative

    ```bash
    az policy set-definition show --name 55f3eceb-5573-4f18-9695-226972c6d74a --query policyDefinitions[] --output yamlc
    ```

* show only the policy definition IDs and policy definition reference IDs

    ```bash
    az policy set-definition show --name 55f3eceb-5573-4f18-9695-226972c6d74a --query "policyDefinitions[].{id:policyDefinitionId, referenceID:policyDefinitionReferenceId}"
    ```

* list the policies that have non-compliant resources

    Tough one.

    ```bash
    az policy state list --resource-group arc-hack --filter "resourceType eq 'Microsoft.HybridCompute/machines' and complianceState eq 'NonCompliant' and policySetDefinitionName eq '55f3eceb-5573-4f18-9695-226972c6d74a'" --query "[].[policyAssignmentName, policyDefinitionReferenceId]" --output tsv | sort -u
    ```
