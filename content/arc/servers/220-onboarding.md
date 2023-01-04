---
title: "Onboarding using scripts"
description: "Create the Bash and PowerShell scripts for onboarding using the service principal."
slug: onboarding
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-onboarding
series:
 - arc-servers
weight: 220
---

## Introduction

{{< flash >}}
Back to the "on prem admins", i.e. whoever tested access to the on prem VMs.

Ask for the scripts created in the last lab, and onboard the first few Windows and Linux server.
{{< /flash >}}

## Onboard the linux VMs

On each of the on prem Linux VMs:

* Create a local script on each server called OnboardingScript.sh
* Run the OnboardingScript.sh script as root, e.g. `sudo ./OnboardingScript.sh` (or `sudo bash OnboardingScript.sh`)

## Onboard one of the Windows VMs

On each of the on prem Windows VMs

* Open PowerShell ISE as an Administrator
* Create OnboardingScript.ps1
* Run to onboard

## Stretch targets

* Rerun the script on one of the servers. Is it successful?
* Log on as the service principal. What can you see?

## Alternatives for onboarding

It isn't usual to log onto each machine individually when onboarding at scale. Most admins will have their preferred method of running a script on multiple servers.

Using scripts is only one way to onboard servers to Azure Arc. The list of alternatives to script onboarding is growing, and currently includes

* Azure Migrate appliance for VMware vSphere
* Windows Admin Center
* PowerShell
* PowerShell DSC
* Configuration Manager
* Group Policy
* Ansible playbook

## Success criteria

Show your proctor:

* the onboarded Azure Arc-enabled Servers in the portal

Answer the following questions:

* Are there any proxy limitations with the vSphere appliance?
* Does Windows Admin Center gateway use a standard service principal for onboarding?
* What is the name of the AWS EC2 plugin that enables a dynamic tag based Ansible inventory?
* Your customer is very security conscious and concerned about traffic going publicly. They also use firewalls between their own environments and for egress traffic. Name two areas that you should discuss with them.

## Resources

* <https://learn.microsoft.com/azure/azure-arc/servers/onboard-service-principal>
* <https://learn.microsoft.com/azure/migrate/onboard-to-azure-arc-with-azure-migrate>
* <https://learn.microsoft.com/azure/azure-arc/servers/deployment-options>
* <https://learn.microsoft.com/azure/azure-arc/servers/network-requirements>
* <https://learn.microsoft.com/azure/azure-arc/servers/private-link-security>
* <https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_servers/scaled_deployment>

## Next

In the next lab you will explore onboarding via appliances.
