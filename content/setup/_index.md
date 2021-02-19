---
title: "Setup"
description: "Getting an Azure subscription is a good start. Then you can run through this page to set up your laptop ready for many of the labs on the Citadel site."
author: [ "Richard Cheney" ]
layout: single
toc: 3
menu:
  side:
    identifier: setup
aliases:
    - /automation/prereqs/
    - /prereqs/terminal/
    - /prereqs/wsl/
    - /prereqs/vscode/
---

## GitHub

If you do not have a GitHub ID already then sign up.

* [Join GitHub](https://github.com/join)

## MacOS or Linux

If you are working on MacOS or a Linux distro then great. You can just use Bash in your preferred terminal. Skip the WSL step and install the [binaries](#binaries).

## Windows 10

We recommend using the **Windows Subsystem for Linux** (WSL) and installing the binaries into linux rather than at the Windows OS level. This page assumes that you will take that route.

> If your personal preference is to work within Windows and to use PowerShell then we understand. You can install both [git](https://gitforwindows.org/) and [az](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli) at the OS level instead and then skip to [vscode](#visual-studio-code). However you should be aware that you won't be able to use some of the examples in the labs as they are based on Ubuntu 20.04 running in WSL and use pipelines in Bash.

* [Install Windows Subsystem for Linux](https://docs.microsoft.com/windows/wsl/install-win10)

If you have no preference on a distro then we recommend [Ubuntu 20.04](https://www.microsoft.com/p/ubuntu/9nblggh4msv6). Where the prereqs mention installing into Ubuntu then this assumes WSL.

## Binaries

Install

* git
* jq
* tree
* stress

E.g., for Ubuntu/Debian:

```bash
sudo apt update && sudo apt install jq git tree stress
```

> Includes WSL. Use equivalent yum or zypper commands on other distros.

Checks:

```bash
git
jq --help
tree ~
stress
```

> You may want to add `export JQ_COLORS="1;90:0;35:0;35:0;91:0;33:1;37:1;37"` to your ~/.bashrc file to improve the colours.

## Install the Azure CLI

You will need the Azure CLI.

* [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli-linux?pivots=apt)

Checks:

```bash
az version
az login
az account show --output jsonc
az account show --output json | jq -r .user.name
```

## Windows Terminal

For standard CLI use we favour the Windows Terminal on Windows 10. It will pick up on all of your WSL distros as well as creating profiles for Command Prompt, PowerShell and Cloud Shell.

* [Install Windows Terminal](https://docs.microsoft.com/windows/terminal/get-started)

## Visual Studio Code

Visual Studio Code (vscode) is assumed as our default IDE.

* [Install Visual Studio Code](https://code.visualstudio.com/download)

## Remote Development in WSL

For Windows 10 WSL users only. All others can [skip](#visual-studio-code-extensions).

Integrate vscode with WSL so you can use the application as a front end which connects to the vscode engine running. Install the Remote Development for WSL and then open from the subsystem.

* Install the Remote Development extension pack
  * `CTRL`+`SHIFT`+`X` to bring up Extensions
  * Search on `ms-vscode-remote.vscode-remote-extensionpack` and install
* Close vscode

* Open Ubuntu in Windows Terminal
* Type `code .` to open up vscode with the extension, installing the vscode-engine.

Check:

* Is "WSL: \<distro>" shown at the bottom left?
* Open Source Control (`CTRL`+`SHIFT`+`G`)
* Click on the ellipsis (*...*) at the top of the sidebar
* Click on *Show Git Output*
* Does the top of the output look similar to this?

    ```text
    Looking for git in: git
    Using git 2.25.1 from git
    ```

## Visual Studio Code Extensions

* Install additional extensions

    Use the shortcodes to quickly find the right extension. Some will install into the front end and some directly into WSL.

    | **Extension** | **Shortcode** |
    |---|---|
    | Azure Account | ms-vscode.azure-account |
    | Azure Resource Manager tools | msazurermtools.azurerm-vscode-tools |
    | Azure Policy | azurepolicy.azurepolicyextension |
    | Hashicorp Terraform | hashicorp.terraform |
    | JSON Tools | eriklynd.json-tools |
    | Live Share | ms-vsliveshare.vsliveshare |

## Terraform

You can either install it manually or using the provided script.

* Manual
  * [Download Terraform](https://www.terraform.io/downloads.html)
  * Move the binary to a directory
  * Make it executable
  * Ensure the directory is in your path

-- or --

* Scripted

    Use the following command on Ubuntu to install into /usr/local/bin:

    ```bash
    curl -sSL https://aka.ms/hashicorp/install.sh | sudo -E bash -s terraform
    ```

    > The script uses sudo so you will be prompted for your password. (Unless you have set /etc/sudoers for passwordless sudo.)

Check:

```bash
terraform --version
```

## Packer

The install process is the same for Packer as it is for Terraform.

* Manual
  * [Download Packer](https://www.packer.io/downloads)
  * Move the binary to a directory
  * Make it executable
  * Ensure the directory is in your path

-- or --

* Scripted

    Use the following command on Ubuntu to install into /usr/local/bin:

    ```bash
    curl -sSL https://aka.ms/hashicorp/install.sh | sudo -E bash -s packer
    ```

Check:

```bash
packer --version
```
