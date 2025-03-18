---
title: "Using service principals and remote state"
date: 2024-04-01
draft: true
author: [ "Richard Cheney" ]
description: "Production configurations use either a service principal or managed identity, and persist a remote state. Supports working in teams."
weight: 40
menu:
  side:
    parent: 'terraform-envs'
series:
 - terraform-envs
layout: single
---

## Overview

Now that you have better tooling on your machine, you can develop and test far easier at a personal level. But you may well be deploying with your own Azure user ID, your state file is probably sitting on a single SSD that could fail at any time. And only you have access to the Terraform config files and the state so it doesn't work from a team perspective.

So, what if you need to work in a team? And what else do you need to deploy to production?

Deployments into production environments usually use

* a git repo
* a service principal (or managed identity) with appropriate permissions
* remote state
  * stored on a highly available storage platform
  * with leasing to handle rw in multi user environments
* deployment pipelines (optional)

This page will cover using GitHub for your repo, creating a service principal, and Azure blob for your remote state.

We'll cover pipelines in the next few labs, and explore using user- and system-assigned managed identies instead of service principals. But for the moment lets get the basics done.

<<<YOU ARE HERE>>>

## Service Principal

Service principals are identities that can be used to authenticate and authorize applications or scripts to access Azure resources. Service principals are recommended for running Terraform on Azure in a non-interactive way, such as in a CI/CD pipeline or a scheduled task. Service principals can be assigned specific roles and permissions to limit the scope of access and reduce the risk of accidental or malicious changes.

It is possible to create a service principal and role assignment in one command, but we'll do it step by step for clarity.

1. Open the Ubuntu profile in Terminal
1. Log in to Azure

    ```bash
    az login
    az account show --output jsonc
    ```

    Check you're in the right subscription.

1. Create a service principal

    ```bash

    ```

## Remote State

Remote state is a feature that allows you to store the state of your Terraform configuration in a remote location, such as an Azure storage account. Remote state enables collaboration among team members by ensuring that everyone is working with the same version of the state. Remote state also provides security and durability by encrypting and backing up the state data.

## Links

* [Install Windows Subsystem for Linux](https://learn.microsoft.com/windows/wsl/install)
