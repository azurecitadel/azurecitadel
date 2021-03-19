---
title: "Scale Onboarding"
description: "Onboarding multiple Linux and WIndows servers with a service principal, then automate conneting with the azcmagent."
layout: single
draft: false
menu:
  side:
    parent: arc-servers-hack
    identifier: arc-servers-hack-scale
series:
 - arc-servers-hack
weight: 4
aliases:
 - /arc/server-hack/scale/proctor
---

## Introduction

It is good to get grounded in how to onboard individual servers ad hoc, but for most organisations you will want to be able to onboard VMs at scale.

The portal can generate scripts to onboard multiple VMs using service principals. You can then upload the generated scripts to the target machines and execute them with elevated privileges. That is the aim of this challenge.

## Terraform and Ansible

> **"Why are we having to learn Terraform and Ansible?"** 😡

OK, yes, there is a little more Terraform in this lab - to spin up more "on prem" VMs for you to onboard.

And we will be using Ansible as the mechanism to automate the copy and script execution.

But don't get hung up on the choice of tooling. The key thing to remember is that for you to experience onboarding at scale we obviously need _something_ for you to onboard. If you had VMs on a test ESXi cluster somewhere then you could have used those instead. And you need _something_ to enable you to copy those scripts and execute them. Ansible is just a means to an end in this challenge, but you could just as easily be using something else such as VMware PowerCLI.

> The [Azure Arc jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_servers/scaled_deployment/) site has information on a few alternative scale onboarding scenarios such as VMware ESXi hosted VMs or VMs in other clouds.

So in summary we will:

* prepare
  * use Terraform to provision additional VMs
  * check Ansible is working OK
* scale onboarding challenge
  * create a service principal
  * create a role assignment
  * generate the scale onboarding scripts
  * copy the scripts to the VMs
  * execute the scripts on the VMs
  * remediate any non-compliant resources

Again, this isn't a test of your Terraform and Ansible skills so we'll just give you those commands.

Let's start!

## Create more VMs with Terraform

Go back to the root module of your cloned Terraform repo.

* Edit the terraform.tfvars to create more VMs

  ```yaml
  resource_group_name = "arc-hack"

  linux_count  = 5
  linux_prefix = "ubuntu"

  windows_count  = 5
  windows_prefix = "win"

  create_ansible_hosts = true
  ```

The last variable will generate an Ansible compliant hosts file.

Apply the new config.

> _Hint_: If the apply fails then rerun `terraform apply` and Terraform should retry creating the failed resources.

If you `cat hosts` then you should see a file similar to the one below.

{{< details "Example ~/arc-onprem-servers/hosts file" >}}

```ini
[arc_hack_linux_vms]
arc-9262c33c-ubuntu-01.uksouth.cloudapp.azure.com
arc-9262c33c-ubuntu-02.uksouth.cloudapp.azure.com
arc-9262c33c-ubuntu-03.uksouth.cloudapp.azure.com
arc-9262c33c-ubuntu-04.uksouth.cloudapp.azure.com
arc-9262c33c-ubuntu-05.uksouth.cloudapp.azure.com

[arc_hack_linux_vms:vars]
ansible_user=arcadmin

[arc_hack_windows_vms]
arc-9262c33c-win-01.uksouth.cloudapp.azure.com
arc-9262c33c-win-02.uksouth.cloudapp.azure.com
arc-9262c33c-win-03.uksouth.cloudapp.azure.com
arc-9262c33c-win-04.uksouth.cloudapp.azure.com
arc-9262c33c-win-05.uksouth.cloudapp.azure.com

[arc_hack_windows_vms:vars]
ansible_user=arcadmin
ansible_password="Amazing-Puma!"
ansible_connection=winrm
ansible_winrm_transport=basic
ansible_port=5985
ansible_winrm_server_cert_validation=ignore
```

{{< /details  >}}

## Test Ansible

Why are we using Ansible? As per the introduction, it is simply to have a method to automate the upload and execution of scripts on multiple servers. It is quick and easy to use on Azure. This challenge is not a test of your Ansible skills so if you get stuck then reach out to your proctor.

If you are using Cloud Shell then you will already have the ansible binary installed available. If you are using Windows Subsystem for Linux (WSL) or MacOS or linux then you should have installed and configured Ansible as per the [prereqs](/setup/#ansible).

* Export environment variables

    ```bash
    export ANSIBLE_HOST_KEY_CHECKING=false
    export ANSIBLE_INVENTORY="~/arc-onprem-servers/hosts"
    ```

    The first will save having to confirm the SSH keys for each of the linux VMs. The second uses the newly created inventory file, so you don't have to use the `-i` switch with ansible all the time.

* Check Ansible can contact the VMs

    ```bash
    ansible arc_hack_linux_vms -m ping
    ansible arc_hack_windows_vms -m win_ping
    ```

    Both commands should show green success output for each VM, and the ping command should return a pong. If so then you're now set for the scale onboarding challenge itself.

## Checkpoint

**Let's check in and make sure you're at the right point before you continue:**

* you have ten VMs in your arc-hack-resources resource group
* only two have been onboarded into the arc-hack resource group
* Ansible is working and you can run modules on the VMs

**If you have ticked all of the boxes then it is time to start on the scale onboarding challenge itself.**

## Service principal

* Create a service principal

    We'll use the Azure CLI to create one called `http://arc-<uniq>`, where _\<uniq>_ is the eight character hash used in your FQDNs to make them globally unique.

    ```bash
    role="Azure Connected Machine Onboarding"
    scope=$(az group show --name arc-hack --query id --output tsv)
    uniq=$(cd ~/arc-onprem-servers; terraform output --raw uniq)
    name="http://arc-$uniq"
    az ad sp create-for-rbac --name $name --role "$role" --scope $scope
    ```

    The [Azure Connected Machine Onboarding](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#azure-connected-machine-onboarding) role is all you need to onboard VMs to Azure Arc.

* Copy the value of the password field

    You'll need this later when editing the scripts.

## Scale onboarding scripts

* Use the portal to generate scripts to onboard multiple servers

  * For both windows and linux
  * Include an additional tag - **application: arc hack**
  * Select the service principal you've just created

    > Note that the portal only shows service principals with the right role.

* Move the scripts to your bash home directory

  * Cloud Shell: use the upload icon in the browser
  * Windows Subsystem for Linux: copy files from Downloads using

    ```bash
    cp /mnt/c/Users/username/Downloads/filename ~
    ```

    > The tilde (`~`) symbol is expanded to your home directory in Bash.

* Edit the files

    Paste in the service principal's password.

## Copy and execute

Here are the ansible commands to copy and execute the scripts.

* Export environment variables

    You should have these from earlier in this challenge.

    ```bash
    export ANSIBLE_HOST_KEY_CHECKING=false
    export ANSIBLE_INVENTORY="~/arc-onprem-servers/hosts"
    ```

* copy the scripts up to the servers

    ```bash
    ansible arc_hack_linux_vms -m copy -a 'src=OnboardingScript.sh dest=/tmp/ owner=root mode=0755' --become
    ansible arc_hack_windows_vms -m win_copy -a 'src=OnboardingScript.ps1 dest=C:\\'
    ```

    You should see yellow output as Ansible is making a change.

* execute the scripts as an elevated user

    ```bash
    ansible arc_hack_linux_vms -a '/bin/bash /tmp/OnboardingScript.sh' --become
    ansible arc_hack_windows_vms -m win_shell -a 'C:\\OnboardingScript.ps1' --become --become-method runas --become-user System
    ```

    More yellow output, but expect a slight pause in these as they initially download the azcmagent to each VM.

## Policy

Check the activity log for the recent management plane activity. The _Write Azure Arc machines_ entries should show

* the main Azure Arc entry
* a modify for the two tags
* a deployIfNotExists policy action

Check the arc-hack resource group

* modify the columns to include the individual tags
* the compliancy status for the tags and for the extensions

> _Note_: Ignore the untagged VM extensions. These are mistakenly set as indexed and will be corrected.

The new VMs you onboarded at scale should be showing as non-compliant as they have been processed by the policy engine. They won't automatically remediate the extensions, although there are plans for this to be introduced.

## Remediation

In the last challenge you triggered a policy evaluation. An evaluation normally takes around 30 minutes. The existing resources - the first two VMs - that do not have extensions should now show as non-compliant. And now the new ones are also showing as noncompliant for the extension.

For safety, existing non-compliant resources will not be automatically remediated.

You can trigger remediations via the Policy area in the portal, or you can use Azure CLI commands. For example:

```bash
policyAssignmentName=$(az policy assignment list --resource-group arc-hack --query "[?displayName == 'Enable Azure Monitor for VMs'].name" --output tsv)
az policy remediation create --name loglin --policy-assignment $policyAssignmentName --definition-reference-id LogAnalyticsExtension_Linux_HybridVM_Deploy --resource-group arc-hack --resource-type Microsoft.HybridCompute/machines
az policy remediation create --name logwin --policy-assignment $policyAssignmentName --definition-reference-id LogAnalyticsExtension_Windows_HybridVM_Deploy --resource-group arc-hack --resource-type Microsoft.HybridCompute/machines
az policy remediation create --name deplin --policy-assignment $policyAssignmentName --definition-reference-id DependencyAgentExtension_Linux_HybridVM_Deploy --resource-group arc-hack --resource-type Microsoft.HybridCompute/machines
az policy remediation create --name depwin --policy-assignment $policyAssignmentName --definition-reference-id DependencyAgentExtension_Windows_HybridVM_Deploy --resource-group arc-hack --resource-type Microsoft.HybridCompute/machines
```

The default resourceDiscoveryMode for these commands is `ExistingNonCompliant`, but you can also use the `--resource-discovery-mode ReEvaluateCompliance` switch to force a policy evaluation.

## Resource Graph query

Upgrade the Resource Graph query:

* include each of the tags as individual fields, with the field descriptions renamed to something shorter
* add a filter to only show the linux servers

Run the resource graph query as a CLI command to generate JSON.

## Stretch Targets

If you found that too simple then here are some tricker objectives.

Use the CLI to:

* list the policy assignments at a scope
* list the policy definitions in an initiative
  * show only the policy definition IDs and policy definition reference IDs

Tougher one combining filter and query:

* list the policy state for non-compliant resources
  * only for the VM Monitor Agents initiative
  * Azure Arc VMs only
  * output a tsv of the policy definition reference ID and policy assignment name

(This could be used to automate the remediation task deployment.)

## Success criteria

Screen share with your proctor to show that you achieved:

1. Onboarding all servers
1. CLI commands to initiate the remediation tasks
1. Resource Graph Explorer report
1. JSON query output

## Resources

* [Connect hybrid machines to Azure at scale](https://docs.microsoft.com/azure/azure-arc/servers/onboard-service-principal)
* [Azure Policy](https://docs.microsoft.com/azure/governance/policy/)
* [Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/)
* [Kusto Query Language](https://docs.microsoft.com/azure/data-explorer/kusto/concepts/)
