---
title: "Service principals and remote state"
date: 2023-04-11
draft: false
author: [ "Richard Cheney" ]
description: "Develop in teams using Visual Studio Code, Windows Subsystem for Linux, service principals and remote state."
weight: 2
menu:
  side:
    parent: 'terraform-envs'
series:
 - terraform-envs
layout: single
---

## Overview

Terraform is a popular tool for managing infrastructure as code across multiple cloud providers. In this blog post, we will show you how to use

* Install Windows Subsystem for Linux (WSL) plus recommended binaries
* Install Visual Studio Code (vscode) with recommended extensions
* Configure service principals
* Store the Terraform state remotely as a blob in a versioned Azure storage account
* Push your code into a shared GitHub repo

These features will help you to write, test and deploy Terraform configurations in a consistent and secure way, especially if you are working in a team.

## Tooling

### Windows Subsystem for Linux

Using Terraform is more natural in a bash environment.

> ℹ️ If you are on a Mac then macOS uses bash, although you may wish to update to a more recent bash version. Install [terraform](https://developer.hashicorp.com/terraform/downloads?product_intent=terraform) and the [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli-macos), and make sure you also have az, jq, jo and git installed.

For Windows 11 users we highly recommend installing the Windows Subsystem for Linux, which will install Ubuntu onto your machine, and then running terraform within that subsystem. Here are the steps:

1. Install Windows Subsystem for Linux

    Run PowerShell as Administrator.

    ```powershell
    wsl --install
    ```

    The command will configure the subsystem and initialise the default Ubuntu distro. You will be guided to set up a local admin ID and password.

1. Install binaries

    ```bash
    sudo apt install openjdk-11-jre ca-certificates curl apt-transport-https lsb-release gnupg gpg wget -y
    wget -qO- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null
    wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor | sudo tee /usr/share/keyrings/microsoft.gpg > /dev/null
    sh -c 'echo "deb [arch=`dpkg --print-architecture` signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com `lsb_release -cs` main" | sudo tee /etc/apt/sources.list.d/hashicorp.list'
    sh -c 'echo "deb [arch=`dpkg --print-architecture` signed-by=/usr/share/keyrings/microsoft.gpg] https://packages.microsoft.com/repos/azure-cli/ `lsb_release -cs` main" | sudo tee /etc/apt/sources.list.d/azure-cli.list'
    sudo chmod go+r /usr/share/keyrings/hashicorp-archive-keyring.gpg /usr/share/keyrings/microsoft.gpg
    sudo apt update && sudo apt install terraform azure-cli jq jo -y
    ```

    These commands will install the terraform open source binary, the Azure CLI plus jq and jo which are commonly used for querying or generating JSON. Plus a few prereqs.

### Visual Studio Code

Visual Studio Code is a great IDE for working with Terraform configs, and has extensions for linting, syntax highlighting, snippets, plus connecting using remotely through to other environments including the WSL subsystem.

1. Install [Visual Studio Code](https://code.visualstudio.com/download)
1. Install the [Remote Development extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)

    The Remote Development extension pack allows you to open any folder in a container, on a remote machine, or in the Windows Subsystem for Linux (WSL) and take advantage of VS Code's full feature set.

1. Install the [Hashicorp Terraform](https://marketplace.visualstudio.com/items?itemName=HashiCorp.terraform) extension

    The HashiCorp Terraform Extension for Visual Studio Code (VS Code) with the Terraform Language Server adds editing features for Terraform files such as syntax highlighting, IntelliSense, code navigation, code formatting, module explorer, etc.

### Windows Terminal

1. Install [Windows Terminal](https://aka.ms/terminal)

    Refer to the [Windows Terminal documentation](https://aka/ms/terminaldocs) if you wish to customise.

    You may wish to configure settings, e.g. set the default profile to Ubuntu and default terminal application to Windows Terminal.

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
