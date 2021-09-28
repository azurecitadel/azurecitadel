---
title: "On Prem VMs"
description: "You will need some on prem servers to onboard and connect to Azure as part of the pilot. Create then on the platform of your choice, or spin them up in Azure using our Terraform repo."
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-hack-manual
series:
 - arc-servers-hack
weight: 110
---

## Introduction

Your Azure Arc pilot requires a small number of Windows and linux servers. These will be your on prem machines. In later labs you will be onboarding these VMs as Azure Arc-enabled VMs.

As per the pre-reqs, the hack scenario assumes a pilot of:

* 3 x Windows Server 2019 VMs
* 3 x Ubuntu 18.04 VMs

**Either create your VMs outside of Azure (preferred), or using the provided Terraform repo.**

## Non-Azure

If you have access to another platform, e.g.:

* VMware vSphere
* Hyper-V
* GCP
* AWS

then feel free to create your VMs there. This will be a more realistic pilot.

Note that there is an [operating systems supported list](https://docs.microsoft.com/azure/azure-arc/servers/agent-overview#prerequisites) for Azure Arc.

The VMs will need outgoing internet access.

## Terraform repo

If you cannot create VMs outside of Azure then you'll create some onboardable VMs using a Terraform repo. The repo will create servers with no Azure Agent and firewall rules blocking the IMDS endpoint.

* Use the <https://github.com/terraform-azurerm-examples/arc-onprem-servers> repo's README file
  * You will need an [SSH key](https://docs.microsoft.com/azure/virtual-machines/linux/mac-create-ssh-keys) for it to work
  * Do not set the azcmagent or arc variables!
* Create the "on prem" virtual machines ready for the manual onboarding tasks
  * Review the content of the onprem_servers resource group in the Azure Portal.

This is not a Terraform training session so the readme file is intended to be usable by Terraform novices.

⚠️ **_Do not interact directly with the Azure resources in the onprem\_servers resource group!_**

  **These VMs represent VMs that exist outside of Azure, so think of them as on prem servers, e.g. VMs running in an ESXi cluster in a datacentre.**

  **You shouldn't configure anything in the portal or CLI that _directly_ accesses the VMs in the onprem_servers resource group az Azure resources, e.g. resetting passwords, installing extensions or applying policies.**

  **The only thing you should do with these servers is log into them using the Bastion service.**

Hint: You can also shut down these VMs in the portal when they are not needed so that they are deallocated and do not incur compute costs.

## Success criteria

Show the proctor

1. your on prem pilot servers

## Resources

* <https://github.com/terraform-azurerm-examples/arc-onprem-servers>

## Next up

You now have on prem servers. Next you will prepare a resource group to onboard them into.
