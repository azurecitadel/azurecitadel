---
title: "Manual Onboarding"
description: "Work through the first challenge, onboarding a pair of \"on prem\" machines into Azure and adding agents."
layout: single
draft: false
menu:
  side:
    parent: arc-servers-hack
    identifier: arc-servers-hack-manual
series:
 - arc-servers-hack
weight: 2
aliases:
 - /arc/server-hack/manual/proctor
---

## Introduction

In this first challenge you will manually onboard a few virtual machines, one running Windows Server 2019 and one running Ubuntu 18.04 LTS. You will then manually add a couple of agents.

The aim of the challenge is to ensure that you understand the basics of onboarding and how the azcmagent works on both platforms.

You will need a Bash environment for this, so Windows users should use either Windows Subsystem for Linux or the Cloud Shell. Either way, the Windows Terminal is recommended.

> _Hint:_ Typing `code .` will open the current working directory with vscode (if installed). If you are in the Cloud Shell it will open the Monaco editor.

## On prem VMs

Use the <https://github.com/azurecitadel/arc-onprem-servers> repo to create two "on prem" virtual machines ready for the manual onboarding tasks.

You will need an SSH key for it to work: <https://docs.microsoft.com/azure/virtual-machines/linux/mac-create-ssh-keys>

| Operating system | Name |
|---|---|
| Ubuntu 18.04 LTS | **ubuntu-01** |
| Windows Server 2019 | **win-01** |

Review the content of the arc-hack-resources in the Azure Portal. And then ignore this resource group from now on!

> **IMPORTANT!**: You should not do anything after this point directly with the arc-hack-resources resource group. The VMs in here are representing VMs that exist outside of Azure, so think of them as on prem servers, e.g. VMs running in an ESXi cluster in a datacentre. As you work through you will access them via RDP or SSH, or using Ansible with SSH or WinRM, but you shouldn't configure anything in the portal or CLI that _directly_ accesses the VMs in the resource group.

## Onboard

Switch to the arc-hack resource group. This resource group is currently empty.

> This will be the resource group that you do all your work in as you move through these challenges.

Connect the two VMs to Azure Arc using the _Servers - Azure Arc_ portal screen.

Make sure you are going into the correct resource group and region:

| | |
|---|---|
| resourceGroup | **arc-hack** |
| location | **UK South** |
| | |

> There is no need to set any tag values. We'll use Azure Policy for the tags in the next challenge.

Once the two VMs have been onboarded as Azure Arc VMs, you can explore the functionality exposed in an Azure Arc VM's portal blade.

Also check the JSON view in the Overview screen. What resource provider type is shown in the resourceId?

## Inventory

Run a basic query in Resource Graph Explorer to list all Azure Arc connected virtual machines

* Name
* Resource Group
* Resource ID

For bonus points

* add an additional field that shows whether the VM is linux or windows
* rename your new field to "os"

## Success criteria

Screen share with your proctor to prove that you've met the success criteria below:

1. Show the connected VMs in the arc-demo resource group
1. Name the resource provider type used for the connected VMs
1. Show the extensions are installed
1. Show your graph query and resulting output in Resource Graph Explorer

## Resources

* [arc-onprem-servers repo](https://github.com/azurecitadel/arc-onprem-servers)
* [Azure Arc docs](https://aka.ms/AzureArcDocs)
* [Azure Resource Graph docs](https://docs.microsoft.com/azure/governance/resource-graph/)
* [Kusto Query Language](https://docs.microsoft.com/azure/data-explorer/kusto/concepts/)

## Next up

Move onto the Azure Policy challenge once your proctor has confirmed that you have met the success criteria above.
