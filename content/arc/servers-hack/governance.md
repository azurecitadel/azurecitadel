---
title: "Governance"
description: "Use Azure Policy and the Guest Configuration policy definitions to govern your resources and prove compliance."
layout: single
draft: false
menu:
  side:
    parent: arc-servers-hack
    identifier: arc-servers-hack-governance
series:
 - arc-servers-hack
weight: 7
aliases:
 - /arc/server-hack/governance/proctor
---

## Introduction

Azure Policy can audit settings inside a machine, both for machines running in Azure and Arc Connected Machines. The validation is performed by the Guest Configuration extension and client. The extension, through the client, validates settings such as:

* The configuration of the operating system
* Application configuration or presence
* Environment settings

At this time, most Azure Policy Guest Configuration policy definitions only audit settings inside the machine. They don't apply configurations.

In this challenge you are tasked with measuring the compliance state within the Azure Arc virtual machine operating system.

## Guest Configuration

The following requirements have been provided for regularly compliance. Assign Policy to measure the guest configuration compliance of the Azure Arc virtual machines:

* ISO 27001:2013
* UK OFFICIAL and UK NHS

The security team is concerned about the configuration of on-premises VMs and would like to measure their configuration against the Azure Security Benchmark:

* Windows machines should meet requirements for the Azure security baseline
* Linux machines should meet requirements for the Azure security baseline

## Inventory

Your applications team has requested a report of the servers without `git` installed

* (optional) Provide a view of all Linux servers without `git` installed

## Success criteria

Screen share with your proctor to show that you achieved:

1. Show the current Arc virtual machine compliance against ISO 27001:2013 and UK OFFICIAL/UK NHS
1. Show the current Arc virtual machine compliance against Azure security baseline

## Resources

* [Understand Azure Policy's Guest Configuration](https://docs.microsoft.com/en-us/azure/governance/policy/concepts/guest-configuration)
* [Overview of the Azure Security Benchmark](https://docs.microsoft.com/en-us/azure/security/benchmarks/overview)
* [Azure security baseline for Windows Virtual Machines](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/security-baseline)