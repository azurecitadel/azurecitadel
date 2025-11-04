---
title: "Windows with Ubuntu in WSL2"
date: 2024-02-19
draft: false
author: [ "Richard Cheney" ]
description: "The best of both worlds? Integrate Visual Studio Code with terraform etc. installed within Ubuntu"
weight: 40
menu:
  side:
    parent: terraform-setup
series:
 - terraform-setup
---

## Introduction

Ubuntu 20.04 installed in WSL2 on either Windows 10 or Windows 11.

Terraform installed for use in Bash, plus a few other binaries. Uses Windows Terminal.

## Install

1. Windows Terminal

    Newer versions of Windows 11 have Windows Terminal pre-installed and set as the default terminal application.

    If not then install [Windows Terminal](https://aka.ms/terminal). Refer to the [Windows Terminal documentation](https://aka/ms/terminaldocs) if you wish to customise.

1. Install Windows Subsystem for Linux

    Run PowerShell as Administrator.

    ```powershell
    wsl --install
    ```

    The command will configure the subsystem and initialise the default Ubuntu distro. You will be guided to set up a local admin ID and password.

    You may wish to set the default profile in Windows Terminal to Ubuntu.

1. Install binaries

    ```bash
    sudo apt install openjdk-11-jre ca-certificates curl apt-transport-https lsb-release gnupg gpg wget -y
    wget -qO- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null
    wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor | sudo tee /usr/share/keyrings/microsoft.gpg > /dev/null
    sh -c 'echo "deb [arch=`dpkg --print-architecture` signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com `lsb_release -cs` main" | sudo tee /etc/apt/sources.list.d/hashicorp.list'
    sh -c 'echo "deb [arch=`dpkg --print-architecture` signed-by=/usr/share/keyrings/microsoft.gpg] https://packages.microsoft.com/repos/azure-cli/ `lsb_release -cs` main" | sudo tee /etc/apt/sources.list.d/azure-cli.list'
    sudo chmod go+r /usr/share/keyrings/hashicorp-archive-keyring.gpg /usr/share/keyrings/microsoft.gpg
    sudo apt update && sudo apt install git terraform azure-cli jq -y
    ```

    These commands will install the terraform open source binary, the Azure CLI plus jq and git.

    If you want to customise the colours to match the jsonc output of the Azure CLI then add the following line into your ~/.bashrc file:

    ```text
    export JQ_COLORS="1;90:1;34:0;34:1;36:0;33:1;37:1;37"
    ```

1. Visual Studio Code

    Download [Visual Studio Code](https://code.visualstudio.com/download) and install.

    Or install using winget with `winget install vscode`.

1. Install the Remote Development extension pack

    The [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) extension pack allows you to open any folder in a container, on a remote machine, or in the Windows Subsystem for Linux (WSL) and take advantage of VS Code's full feature set.

1. Install the Hashicorp Terraform extension

    The [HashiCorp Terraform](https://marketplace.visualstudio.com/items?itemName=HashiCorp.terraform) extension for Visual Studio Code (VS Code) with the Terraform Language Server adds editing features for Terraform files such as syntax highlighting, IntelliSense, code navigation, code formatting, module explorer, etc.

## Validation

As a test, open up your terminal and check the following commands:

1. Show the Azure CLI version

    ```shell
    az version
    ```

1. Show the Terraform version

    ```shell
    terraform version
    ```

1. Make a directory and move into it

    ```shell
    mkdir test
    cd test
    ```

1. Open vscode from the command line

    ```shell
    code .
    ```

    This should open vscode with the current working directory in the Explorer pane.

    > If you are using Ubuntu on WSL2 then you should see the Remote Development icon in the left hand side of the status bar at the bottom of the screen.

1. Open the integrated terminal

    Click on View > Terminal in the menu, or use the keyboard shortcuts, `Win`+`'`.

    Your selected shell should open up in the integrated terminal pane.
