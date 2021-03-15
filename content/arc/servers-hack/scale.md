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
---

## Introduction

It is good to get grounded in how to onboard individual servers ad hoc, but for most organisations you will want to onboard VMs at scale.

You can generate scripts to onboard multiple VMs using service principals, upload the generated scripts to the target machines and execute them with elevated privileges.

We will be using Terraform again to spin up more machines and we'll also be using Ansible in this challenge for the script upload and execution. If you are not that familiar with Ansible then don't worry as this is not a challenge around Ansible itself and there will be examples. So Ansible is just a means to end in this challenge.

You could just as easily be using other configuration management software to onboard at scale such as Microsoft Endpoint Configuration Manager, Chef, Puppet, etc.  For example the [Azure Arc jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_servers/scaled_deployment/) site has information on a few scale onboarding scenarios, such as using the VMware PowerCLI for VMware vSphere estates, or Ansible for AWS VMs.

OK, in summary we will:

* use Terraform to provision additional VMs
* have a brief test for Ansible and then give you a little Ansible knowledge
* have a checkpoint to make sure you're at the right point to continue
* move onto the scale onboarding challenge hack proper

Let's start.

## Additional VMs

Go back to the root module of your cloned Terraform repo.

* Increase the number of VMs to five of each OS
* Create an Ansible hosts file

Apply the new config.

> _Hint_: If the apply fails then rerun `terraform apply` and Terraform should retry creating the failed resources.

Check the additional VMs were created and you have a new hosts file similar to the one below.

{{< details "Example ~/arc-onprem-servers/hosts file" >}}
```ini
[linux]
arc-9262c33c-ubuntu-01.uksouth.cloudapp.azure.com
arc-9262c33c-ubuntu-02.uksouth.cloudapp.azure.com
arc-9262c33c-ubuntu-03.uksouth.cloudapp.azure.com
arc-9262c33c-ubuntu-04.uksouth.cloudapp.azure.com
arc-9262c33c-ubuntu-05.uksouth.cloudapp.azure.com

[linux:vars]
ansible_user=arcadmin

[windows]
arc-9262c33c-win-01.uksouth.cloudapp.azure.com
arc-9262c33c-win-02.uksouth.cloudapp.azure.com
arc-9262c33c-win-03.uksouth.cloudapp.azure.com
arc-9262c33c-win-04.uksouth.cloudapp.azure.com
arc-9262c33c-win-05.uksouth.cloudapp.azure.com

[windows:vars]
ansible_user=arcadmin
ansible_password="Amazing-Cricket!"
ansible_connection=winrm
ansible_winrm_transport=basic
ansible_port=5985
ansible_winrm_server_cert_validation=ignore
```
{{< /details  >}}

## Test Ansible

Why are we using Ansible? As per the intoduction, it is simply to have a method to automate the upload and execution of scripts on multiple servers.

> _This challenge is not really a test of your Ansible skills so if you get stuck then reach out to your proctor._

* Install and configure Ansible as per the [prereqs](/setup/#ansible)
* Export environment variables

    ```bash
    export ANSIBLE_HOST_KEY_CHECKING=false
    export ANSIBLE_INVENTORY="~/arc-onprem-servers/hosts"
    ```

    The first will save having to confirm the SSH keys for each of the linux VMs. The second uses the newly created inventory file, so you don't have to use the `-i` switch with ansible all the time.

* Check Ansible can contact the VMs

    ```bash
    ansible linux -m ping
    ansible windows -m win_ping
    ```

    Both commands should show green success output for each VM, and the ping command should return a pong. If so then you're now set for the scale onboarding challenge itself.

## Example Ansible modules

Ansible is really powerful when works best with playbooks and roles, but is also great for ad hoc use. Here is a quick explainer on how to use it in this way.

We'll use the file module to create a directory called /etc/arc-hack on the linux VMs, and see how to convert the YAML examples into ad hoc commands.

* Ansible file module

    Check the [examples](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/file_module.html#examples) in the file module.

* Example YAML

    We won't be using YAML files for Ansible, but all of the examples do.

    Find a directory example. Here's a similar YAML block representing our particular example:

    ```yaml
    - name: Create a directory if it does not exist
      file:
        path: /etc/arc-hack
        state: directory
        mode: '0755'
    ```

    > `ansible.builtin.file` has been reduced to `file` which is also accepted.

* Ad hoc command

    This is how the same thing looks as a single ad hoc command:

    ```bash
    ansible linux --module-name file --args "path=/tmp/arc-hack state=directory mode=0755" --become
    ```

    The `linux` matches the pattern in your hosts inventory.

    You may shorten `--module-name` to `-m` and `--args` to `-a`. The module arguments are a space delimited list of arg=value.

    The `--become` switch runs the command as root. This is not required for creating a directory in /tmp

* Run the command and the yellow output displayed will show that each host has changed
* Run it again and the green output confirms that the host matches the desired state

OK, so that is fine for linux. What about Windows? Ansible usually uses WinRM for Windows Server and there is a set of ansible.windows modules that you can use.

* win_file YAML representation

    ```yaml
    - name: Create directory structure
      ansible.windows.win_file:
        path: C:\Temp\folder\subfolder
        state: directory
    ```

* win_file ad hoc command

    ```bash
    ansible windows -m win_file -a 'path=C:\\arc-hack state=directory' --become --become-method runas --become-user System
    ```

    Note the single quotes and the double backslash. This is due to how linux handles quotes as the same args in double quotes would be `"path=C:\\\\arc-hack state=directory"`.

    The behaviour of `--become` is modified by specifying values for both `--become-method` and `--become-user`.

## Checkpoint

**That was a decent amount of setup and scene setting for this challenge. Let's check in and make sure you're at the right point:**

* you have ten VMs in the arc-hack-resources resource group
* only two have been onboarded so far into the ar-hack resource group
* Ansible is working and can run modules on the VMs
* you have just enough knowledge of ad hoc Ansible commands and modules to be dangerous

> If there are any issues, speak to your proctor.

**If you have ticked all of the boxes then it is time to start on the scale onboarding challenge itself.**

## Service principal

Follow least privilege and create a service principal called `http://arc-<uniq>`, where _\<uniq>_ is the eight character hash used in your FQDNs to make them globally unique.

## Scale Onboarding

Onboard all of the servers using Ansible commands for uploading and executing generated scripts.

Include an additional tag:

| | |
|---|---|
| application | **arc hack** |
| | |

> _Hint_: The linux scripts do not specify the shell. Either:
>
> * add `#!/bin/bash` as the first line in the shell script, or
> * use `/bin/bash /path/to/script.sh` as your command

## Policy

Remediate the non compliant resources in the arc-hack resource group.

* Check
  * the activity log for the recent management plane activity
  * the compliancy status for tha tags and for the extensions
* Use the CLI to trigger remediation tasks

> _Note_: Ignore the untagged VM extensions. These are mistakenly set as indexed and will be corrected.

## Resource Graph query

Upgrade the Resource Graph query:

* include each of the tags as individual fields, with the field descriptions renamed to something shorter
* add a filter to only show the linux servers

Run the resource graph query as a CLI command to generate JSON.

## Stretch Targets

Use the CLI to:

* trigger a policy evaluation
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

* [Ansible Modules](https://docs.ansible.com/ansible/latest/collections/index_module.html)
  * [ansible.builtin](https://docs.ansible.com/ansible/latest/collections/index_module.html#ansible-builtin)
  * [ansible.windows](https://docs.ansible.com/ansible/latest/collections/index_module.html#ansible-windows)
* [ad hoc Ansible use](/packeransible/ansible)
* [Azure Policy](https://docs.microsoft.com/azure/governance/policy/)
* [Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/)
* [Kusto Query Language](https://docs.microsoft.com/azure/data-explorer/kusto/concepts/)
