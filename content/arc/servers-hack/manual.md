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
---

## Introduction

In this first challenge you will manually onboard a few virtual machines, one running Windows Server 2019 and one running Ubuntu 18.04 LTS. You will then manually add a couple of agents.

The aim of the challenge is to ensure that you understand the basics of onboarding and how the azcmagent works on both platforms.

You will need a Bash environment for this, so Windows users should use either Windows Subsystem for Linux or the Cloud Shell. Either way, the Windows Terminal is recommended.

> _Hint:_ Typing `code .` will open the current working directory with vscode (if installed). If you are in the Cloud Shell it will open the Monaco editor.

## On prem VMs

Use the <https://github.com/azurecitadel/arc-onprem-servers> repo to create two "on prem" virtual machines ready for the manual onboarding tasks.

| Operating system | Name |
|---|---|
| Ubuntu 18.04 LTS | **ubuntu-01** |
| Windows Server 2019 | **win-01** |

Review the contents of the two resource groups, arc-hack and arc-hack-resources, in the Azure Portal.

## Onboard

Connect the two VMs to Azure Arc using the _Servers - Azure Arc_ portal screen.

| | |
|---|---|
| resourceGroup | **arc-hack** |
| location | **UK South** |
| | |

Explore the functionality exposed in each VM's portal blade, including the resourceId and the various properties available in JSON view.

> _Hint_: Remove the suggested tags. We will be handling tags via policy.

## Log Analytics agent

Manually deploy the Log Analytics agent to the two VMs.

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
