---
title: "Install Terraform tooling"
date: 2024-02-19
draft: false
author: [ "Richard Cheney" ]
description: "Get the right software installed on your machine to work more effectively with Terraform."
weight: 20
menu:
  side:
    parent: 'terraform-envs'
series:
 - terraform-envs
layout: single
---

## Overview

Cloud Shell is useful for simple tasks, but if you are working with Terraform more frequently then it is recommended to install a set of tools for richer functionality, and to give you greater stability during longer sessions.

In this page you will install:

- Visual Studio Code
  - plus recommended extensions for Terraform
- terminal software
- git
- terraform
- Azure CLI
- jq
- GitHub CLI

> This is not a prescriptive configuration. Experienced users will pick a preferred combination of operating system, IDE, extensions, terminal, etc. This is just a set of useful examples for those who would like a little guidance.

Choose *one* of the following:

1. Windows with Ubuntu

    Ubuntu 20.04 installed in WSL2 on either Windows 10 or Windows 11. Terraform installed for use in Bash, plus a few other binaries. Uses Windows Terminal.

    If this is you then jump to the [Windows with Ubuntu](#windows-with-ubuntu) section.

1. Windows with PowerShell

    Terraform installed at the Windows 10 or Windows 11 OS level. Uses Windows Terminal, and winget for installs. WSL2 is not required, nor is jq as PowerShell has full object handling.

    You may need to translate any example Bash commands found in the labs to their PowerShell equivalents.

    If this is you then jump to the [Windows with PowerShell](#windows-with-powershell) section.

1. macOS

    Install terraform into the default zsh shell on macOS.

    If this is you then jump to the [macOS](#macos) section.

## Windows with Ubuntu

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

1. Go to [next steps](#next-steps)

## Windows with PowerShell

1. Windows Terminal

    Newer versions of Windows 11 have Windows Terminal pre-installed and set as the default terminal application.

    If not then install [Windows Terminal](https://aka.ms/terminal). Refer to the [Windows Terminal documentation](https://aka/ms/terminaldocs) if you wish to customise.

1. Install the terraform binary

    Download either x86 or ARM64 from the [downloads](https://developer.hashicorp.com/terraform/install#Windows) page.

1. Winget

    Newer versions of Windows 11 also have winget by default. It is the Windows Package Manager.

    Open a PowerShell windows using Windows Terminal and type `winget` to check if it is there.

    If Winget is not installed there then install the [App Installer on the Microsoft Store](https://www.microsoft.com/p/app-installer/9nblggh4nns1#activetab=pivot:overviewtab). (There are other [install options](https://learn.microsoft.com/windows/package-manager/winget/) available.)

1. Git

    ```powershell
    winget install --exact --id "Git.Git" --accept-source-agreements --accept-package-agreements --silent
    ```

1. GitHub CLI

    ```powershell
    winget install --exact --id "GitHub.cli" --silent
    ```

1. Terraform

    ```powershell
    winget install --exact --id "Hashicorp.Terraform" --silent
    ```
1. Azure CLI

    ```powershell
    winget install --exact --id "Microsoft.AzureCLI" --silent
    ```

1. Visual Studio Code

    ```powershell
    winget install --exact --id "Visual Studio Code" --source msstore --accept-package-agreements
    ```

1. Install the Hashicorp Terraform extension

    The [HashiCorp Terraform](https://marketplace.visualstudio.com/items?itemName=HashiCorp.terraform) extension for Visual Studio Code (VS Code) with the Terraform Language Server adds editing features for Terraform files such as syntax highlighting, IntelliSense, code navigation, code formatting, module explorer, etc.

1. Go to [next steps](#next-steps)

## macOS

1. Homebrew

    This page uses Homebrew for installs, and chances are you already using it.

    If you do not have it installed already, then follow the instructions on <https://brew.sh>.

1. iTerm2

    You can use the default Terminal app or your preferred terminal emulator.

    We recommend iTerm2. You can download the stable version from the [downloads](https://iterm2.com/downloads.html) page, or you can use Homebrew:

    ```zsh
    brew install --cask iterm2
    ```

    You can customise iTerm2 to your hearts content, but going minimal is definitely recommended as a starting point.

    Appearance > General > Theme: Minimal

1. Git

    ```zsh
    brew install git
    ```

1. GitHub CLI

    ```zsh
    brew install gh
    ```

1. Install the terraform binary

    ```zsh
    brew tap hashicorp/tap
    brew install hashicorp/tap/terraform
    ```

1. Azure CLI

    ```zsh
    brew install azure-cli
    ```

1. Install jq

    ```zsh
    brew install jq
    ```

    If you want to customise the colours to match the jsonc output of the Azure CLI then add the following line into your ~/.zshrc file:

    ```text
    export JQ_COLORS="1;90:1;34:0;34:1;36:0;33:1;37:1;37"
    ```

1. Visual Studio Code

    Install vscode by following the [instructions](https://code.visualstudio.com/docs/setup/mac).

    Ensure you have installed the 'code' command in the PATH.

1. Install the Hashicorp Terraform extension pack

  The [HashiCorp Terraform](https://marketplace.visualstudio.com/items?itemName=HashiCorp.terraform) extension for Visual Studio Code (VS Code) with the Terraform Language Server adds editing features for Terraform files such as syntax highlighting, IntelliSense, code navigation, code formatting, module explorer, etc.

1. Go to [next steps](#next-steps)

## Next steps

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

    Click on View > Terminal in the menu, or use the keyboard shortcuts, which are `Win`+`'` on Windows, and `^`+`` ` `` on macOS.

    Your selected shell should open up in the integrated terminal pane.

This configuration is great if you are working solo. You could recreate the config used in the last lab and deploy if you wish to test. Note that you would have to login using the Azure CLI before running a plan or apply as it will use your Azure CLI token by default.

On the next page you will configure GitHub for use with a terraform config.