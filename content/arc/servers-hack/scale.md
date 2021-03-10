---
title: "Scale Onboarding"
description: "Onboarding multiple Linux and WIndows servers with a service principal, then automate conneting with the azcmagent."
layout: single
draft: false
menu:
  side:
    parent: arc-servers-hack
series:
 - arc-servers-hack
weight: 4
---

## Introduction

It is good to get grounded in how to onboard individual servers ad hoc, but for most organisations you will want to onboard VMs at scale.

You can generate scripts to onboard multiple VMs using service principals. You will spin up a few more virtual machines using Terraform. You will then upload the generated scripts to those machines and run them with elevated privileges.

We will be using Ansible in this challenge for the script upload and execution. If you are not that familiar with Ansible then don't worry as this is not a challenge around Ansible itself and there will be examples. You could just as easily be using other configuration management software to onboard at scale such as Microsoft Endpoint Configuration Manager, Chef, Puppet, etc.  For example the [Azure Arc jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_servers/scaled_deployment/) site has information on a few scale onboarding scenarios, such as using the VMware PowerCLI for VMware vSphere estates, or Ansible for AWS VMs.

The policy assignments in the previous challenge should deploy the agents and inherit the tagging for you. It won't be instantaneous, but they should kick in eventually.

## Terraform

Go back to the root module of your cloned Terraform repo.

* Modify the terraform.tfvars file
  * Increase the number of VMs to five of each OS
  * Set the variable to create an Ansible hosts file
* Run `terraform plan` and `terraform apply`
* Check the additional VMs were created
* Check the Ansible ini format ./hosts file was created

## Ansible

Why are we using Ansible? It is simply to have some automation to upload and run scripts on multiple servers. This challenge is not a test of your Ansible skills.

* Install and configure Ansible as per the [prereqs](/setup/#ansible)
* Export environment variables

    ```bash
    export ANSIBLE_HOST_KEY_CHECKING=false
    export ANSIBLE_INVENTORY="~/arc-onprem-servers/hosts"
    ```

    The first will save having to confirm the SSH keys for each of the linux VMs. The second uses the newly created inventory file assuming you cloned the repo into your home directory.

*

## Check ansible


ansible linux -m ping
ansible windows -m win_ping

## Service principal

Least privilege. Which built-in RBAC role? Azure Connected Machine Onboarding. Which scope? RG.

Create service principal called `http://arc-<uniq>-onboarding`.

```bash
role="Azure Connected Machine Onboarding"
scope=$(az group show --name arc-demo --query id --output tsv)
name="http://arc-f7a1d2eb"
az ad sp create-for-rbac --name $name --role "$role" --scope $scope
```

> _Hint_: Note the password.

cp /mnt/c/Users/\<username>/Downloads/OnboardingScript.sh .
ansible linux -m copy -a 'src=OnboardingScript.sh dest=/tmp owner=root mode=0755' --become
ansible linux -a '/tmp/OnboardingScript.sh' --become

ansible windows -m win_copy -a 'src=OnboardingScript.ps1 dest=C:\'
ansible windows -m win_shell -a 'C:\OnboardingScript.ps1' --become --become-method runas --become-user System


## Success criteria

Screen share with your proctor to show that you achieved:

1. Success criterion 1
1. Success criterion 2
1. Success criterion 3

## Resources

* [Description1](https://link)
* [Description2](https://link)
