---
title: "Windows with PowerShell"
date: 2024-02-19
draft: false
author: [ "Richard Cheney" ]
description: "Choose this if you are a Windows user who's not comfortable with linux commands."
weight: 30
menu:
  side:
    parent: terraform-setup
series:
 - terraform-setup
---

## Introduction

This will install Terraform at the Windows 10 or Windows 11 OS level. Uses Windows Terminal, and winget for installs. WSL2 is not required, nor is jq as PowerShell has full object handling.

Note that you may need to translate any example Bash commands found in this site's labs to their PowerShell equivalents.

## Install

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
