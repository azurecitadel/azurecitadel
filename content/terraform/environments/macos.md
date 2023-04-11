---
title: "macOS"
date: 2024-02-19
draft: false
author: [ "Richard Cheney" ]
description: "Set up your MacBook for using Terraform."
weight: 20
menu:
  side:
    parent: 'terraform-envs'
series:
 - terraform-envs
layout: single
---

## Install

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

    Click on View > Terminal in the menu, or use the keyboard shortcut, `^`+`` ` ``.

    Your selected shell should open up in the integrated terminal pane.
