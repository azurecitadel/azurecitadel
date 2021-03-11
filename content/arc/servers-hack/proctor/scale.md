---
title: "Scale Onboarding"
description: "Onboarding multiple Linux and WIndows servers with a service principal, then automate conneting with the azcmagent."
layout: single
draft: false
series:
 - arc-servers-hack-proctor
weight: 4
---

## VMs and Ansible Tests

The challenge is detailed in this area.

## Service Principal

They will need the password or secret for the next step. If they have lost it then rerunning the `az ad sp create-for-rbac` command will regenerate the password.

The role assignment should be Azure Connected Machine Onboarding and it should be assigned at the resource group scope. Let them off if it is at the subscription level but discuss it.

If you were to script it then it would look something like this:

```bash
role="Azure Connected Machine Onboarding"
scope=$(az group show --name arc-hack --query id --output tsv)
uniq=$(terraform output --raw uniq)
name="http://arc-$uniq"
az ad sp create-for-rbac --name $name --role "$role" --scope $scope
```

If you were grabbing the password into a variable then I would use:

```bash
password=$(az ad sp create-for-rbac --name $name --role "$role" --scope $scope --query password --output tsv)
```

## Add multiple servers

Generate the two scripts - one for windows and onw for linux - using the assigned service principal. If they used the wrong role (e.g. Contributor at subscription scope) then the service principal will not show. The scripts should include the tags.

Hints:

* WSL hint: you can easily copy downloaded files to your home directory from the /mnt/c area
  * Even easier if you have a symbolic link set up e.g.

    ```bash
    ln -s /mnt/c/Users/richeney/Downloads downloads
    cp downloads/OnboardingScript.sh .
    cp downloads/OnboardingScript.ps1 .
    ```

* Modify the files to include the service principal password. Then the scripts are fully reusable.
* The copy and win_copy modules can upload files
* Look at the directory example given
* If a module is not specified then Ansible defaults to command

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
* Show the Ansible commands. Examples:
  * linux

    ```bash
    ansible linux -m copy -a 'src=OnboardingScript.sh dest=/tmp/arc-hack/ owner=root mode=0755' --become
    ansible linux -a '/bin/bash /tmp/arc-hack/OnboardingScript.sh' --become
    ```

  * windows

    ```bash
    ansible windows -m win_copy -a 'src=OnboardingScript.ps1 dest=C:\\arc-hack\\'
    ansible windows -m win_shell -a 'C:\\arc-hack\\OnboardingScript.ps1' --become --become-method runas --become-user System
    ```

  We didn't specify the target script directory so be flexible.

* Policy remediation

    ```bash
    az policy remediation create --name loglin --resource-group arc-hack --resource-type Microsoft.HybridCompute/machines --policy-assignment f5542fa9dd304b23b1b0823a --definition-reference-id LogAnalyticsExtension_Linux_HybridVM_Deploy
    az policy remediation create --name logwin --resource-group arc-hack --resource-type Microsoft.HybridCompute/machines --policy-assignment f5542fa9dd304b23b1b0823a --definition-reference-id LogAnalyticsExtension_Windows_HybridVM_Deploy
    az policy remediation create --name deplin --resource-group arc-hack --resource-type Microsoft.HybridCompute/machines --policy-assignment f5542fa9dd304b23b1b0823a --definition-reference-id DependencyAgentExtension_Linux_HybridVM_Deploy
    az policy remediation create --name depwin --resource-group arc-hack --resource-type Microsoft.HybridCompute/machines --policy-assignment f5542fa9dd304b23b1b0823a --definition-reference-id DependencyAgentExtension_Windows_HybridVM_Deploy
    ```

* Resource Graph query

    ```text
    resources
    | where type == "microsoft.hybridcompute/machines"
    | project name,resourceGroup,tags.platform,tags.datacentre,tags.application,properties.osName,id
    | project-rename Platform=tags_Platform, Datacentre=tags_Datacentre, Application=tags_Application, OS=properties_osName
    ```

## Stretch commands

* trigger a policy evaluation

    ```bash
    az policy state trigger-scan --resource-group arc-hack
    ```

    From <https://docs.microsoft.com/azure/governance/policy/how-to/determine-non-compliance>

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
