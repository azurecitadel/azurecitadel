---
title: "Pilot VMs"
description: "Create some on prem VMs."
layout: single
draft: true
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-hack-manual
series:
 - arc-servers-hack
weight: 110
---

## Introduction

Your Azure Arc pilot requires a small number of Windows and Linux servers. These will be your on prem machines. In later labs you will be onboarding these VMs as Azure Arc-enabled VMs.

As per the pre-reqs, the hack scenario assumes a pilot of:

* 3 x Windows Server 2019 VMs
* 3 x Ubuntu 18.04 VMs

**Either create your VMs outside of Azure (preferred), or using the Terraform repo.**

## Non-Azure

If you have access then create the VMs on another platform, e.g.:

* VMware vSphere
* Hyper-V
* GCP
* AWS

Note that there is an [operating systems supported list](https://docs.microsoft.com/azure/azure-arc/servers/agent-overview#prerequisites) for Azure Arc.

The VMs will need outgoing internet access.

## Terraform repo

Use the <https://github.com/azurecitadel/arc_onprem_servers> repo to create two "on prem" virtual machines ready for the manual onboarding tasks. The repo has a README.md file.

Note that you will need an SSH key for it to work: <https://docs.microsoft.com/azure/virtual-machines/linux/mac-create-ssh-keys>

Review the content of the onprem_servers resource group in the Azure Portal. And then ignore this resource group from now on!

**IMPORTANT!**: You should not do anything after this point directly with the onprem\_servers resource group. These VMs represent VMs that exist outside of Azure, so think of them as on prem servers, e.g. VMs running in an ESXi cluster in a datacentre. As you work through you will access them via RDP or SSH and work at the OS level but you shouldn't configure anything in the portal or CLI that _directly_ accesses the VMs in the resource group az Azure resources.

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
