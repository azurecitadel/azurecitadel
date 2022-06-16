---
title: "Governance"
description: "Use Azure Policy and the Guest Configuration policy definitions to govern your on prem resources and prove compliance."
slug: governance
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-governance
series:
 - arc-servers
weight: 160
---

## Introduction

Azure Policy can audit settings inside a machine, both for machines running in Azure and Arc Connected Machines. The validation is performed by the Guest Configuration extension and client. The extension, through the client, validates settings such as:

* The configuration of the operating system
* Application configuration or presence
* Environment settings

At this time, most Azure Policy Guest Configuration policy definitions only audit settings inside the machine. They don't apply configurations. Note again that using Guest Configuration policies will trigger the per server per month Azure Arc pricing.

In this challenge you are tasked with measuring the compliance state within the Azure Arc virtual machine operating system.

## Compliancy

The following requirements have been provided for regularly compliance. Assign Policy to measure the guest configuration compliance of the Azure Arc virtual machines:

* ISO 27001:2013
* UK OFFICIAL and UK NHS

The security team is concerned about the configuration of on-premises VMs and would like to measure their configuration against the Azure Security Benchmark:

* Windows machines should meet requirements for the Azure security baseline
* Linux machines should meet requirements for the Azure security baseline

## Inventory

The governance team has determined that servers should have specific software installed. As a starting point they have decided to audit all linux servers to see whether they have the _tree_ package installed on Linux.

* assign a policy to audit Linux servers without _tree_ installed
* Provide a report of all Linux servers without _tree_ installed (optional)

## Operational

The Windows sys admins are pleased with the automated patching regime but they are considering switching the automatic reboot off. They have asked if it is possible to audit which servers would need a reboot to complete installations.

* audit Azure Arc-enabled Windows servers that should be rebooted

## Security

The security team are concerned about the increased risk of VM compromise if Linux passwd file permissions are writable by a group-owner. The require permissions set to 0644 for the passwd file and want to audit this.

* audit Azure Arc-enabled Linux servers that do not have passwd file permissions set to 0644

## Success criteria

Screen share with your proctor:

1. Show the current Arc virtual machine compliance against ISO 27001:2013
1. Show the current Arc virtual machine compliance against UK OFFICIAL/UK NHS
1. Show the current Arc virtual machine compliance against Azure security baseline
1. Show the policy assignment auditing whether _tree_ is installed on Linux
1. Show the policy assignment auditing whether Windows servers need rebooting
1. Show the policy assignment auditing passwd file permissions for Linux servers

## Resources

* [Understand Azure Policy's Guest Configuration](https://docs.microsoft.com/azure/governance/policy/concepts/guest-configuration)
* [Overview of the Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
* [Azure security baseline for Windows Virtual Machines](https://docs.microsoft.com/azure/virtual-machines/windows/security-baseline)