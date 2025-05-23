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

* [Join GitHub](https://github.com/join) if you don't have an ID already
* Make sure you have the [GitHub CLI](https://cli.github.com/) installed

Check you can login with `gh auth login` and `gh auth status`.

## MacOS or Linux

If you are working on MacOS or a Linux distro then you can just use Bash in your preferred terminal. Skip the WSL step and install the [binaries](#binaries).

## Windows 10 / 11

We recommend using the **Windows Subsystem for Linux** (WSL) and installing the binaries into linux rather than at the Windows OS level. This page assumes that you will take that route.

> If your personal preference is to work within Windows and to use PowerShell then we understand. You can install both [git](https://gitforwindows.org/) and [az](https://docs.microsoft.com/cli/azure/install-azure-cli-windows?tabs=azure-cli) at the OS level instead and then skip to [vscode](#visual-studio-code). However you should be aware that you won't be able to use some of the examples in the labs as they are based on Ubuntu 22.04 running in WSL and use pipelines in Bash.

* [Install Windows Subsystem for Linux](https://learn.microsoft.com/en-gb/windows/wsl/install)

    Run as Administrator.

    ```powershell
    wsl --install
    ```

    You will be guided to set up a local admin ID and password.

## Binaries

* Install
  * git
  * jq
  * tree
  * stress

  E.g., for Ubuntu/Debian:

  ```bash
  sudo apt update && sudo apt install jq git tree stress
  ```

* Checks

    ```bash
    git
    jq --help
    tree ~
    stress
    ```

    > You may want to add `export JQ_COLORS="1;90:0;35:0;35:0;91:0;33:1;37:1;37"` to your ~/.bashrc file to improve the colours.

## Azure CLI

* [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli-linux?pivots=apt)

* Checks:

    ```bash
    az version
    az login
    az account show --output jsonc
    az account show --output json | jq -r .user.name
    ```

## Windows Terminal

For standard CLI use we favour the Windows Terminal on Windows. It will pick up on all of your WSL distros as well as creating profiles for Command Prompt, PowerShell and Cloud Shell.

* [Install Windows Terminal](https://aka.ms/terminal)

    Refer to the [Windows Terminal documentation] if you wish to customise.

## Visual Studio Code

Visual Studio Code (vscode) is assumed as our default IDE.

* [Install Visual Studio Code](https://code.visualstudio.com/download)
* Install the [Remote Development extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
  * Open extensions (`CTRL`+`SHIFT`+`X`)
  * Search `ms-vscode-remote.vscode-remote-extensionpack`
  * Install
* Checks
  * Open Ubuntu in Windows Terminal
  * Open vscode for the current directory

      ```bash
      code .
      ```

    The vscode engine will be automatically downloaded upon first run, and then Visual Studio Code will open on the desktop.

  * Is "WSL: \<distro>" shown at the bottom left?
  * Open Source Control (`CTRL`+`SHIFT`+`G`)
  * Click on the ellipsis (*...*) on the Source Control sidebar
  * Click on *Show Git Output*
  * Does the top of the output look similar to this?

    ```text
    [info] Log level: Info
    [info] Validating found git in: "git"
    [info] Using git "2.34.1" from "git"
    ```

## Visual Studio Code Extensions

* Install additional extensions

    Use the shortcodes to quickly find the right extension. Some will install into the front end and some directly into WSL.

    | **Extension** | **Shortcode** |
    |---|---|
    | [Azure Account](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) | ms-vscode.azure-account |
    | [Azure Resource Manager tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools) | msazurermtools.azurerm-vscode-tools |
    | [Hashicorp Terraform](https://marketplace.visualstudio.com/items?itemName=hashicorp.terraform) | hashicorp.terraform |
    | [JSON Tools](https://marketplace.visualstudio.com/items?itemName=eriklynd.json-tools) | eriklynd.json-tools |

## Terraform

* Install [Terraform](https://developer.hashicorp.com/terraform/cli/install/apt)
* Check:

    ```bash
    terraform --version
    ```

## Packer

Only required for the virtual machine imaging labs.

* Install [Packer](https://developer.hashicorp.com/packer/downloads)
* Check:

  ```bash
  packer --version
  ```

## Ansible

Ansible is used in a few of the labs. As per the [Ansible docs](https://docs.ansible.com/ansible/latest/scenario_guides/guide_azure.html#microsoft-azure-guide), Ansible on Azure is installed using the Python installer, pip. It is preinstalled in the Cloud Shell's container image.

* Install PIP

    ```bash
    sudo apt update && sudo apt install -y python3-pip
    ```

* Install Ansible

    ```bash
    pip3 install ansible[azure]
    ```

The remaining steps are option if you are familiar with Ansible and wish to configure it yourself. If you would like a default config then feel free to continue.

* Create the ansible config file and directory structure

    ```bash
    umask 022

    cat << ANSIBLE_CFG > ~/.ansible.cfg
    [defaults]
    inventory = ~/ansible/hosts
    roles_path = ~/ansible/roles
    deprecation_warnings=False
    nocows = 1
    ANSIBLE_CFG

    mkdir -pm 755 ~/ansible/roles && cd ~/ansible

    cat << ANSIBLE_HOSTS > ~/ansible/hosts
    [localhost]
    127.0.0.1

    ANSIBLE_HOSTS
    ```

* Install the Ansible collection for Azure

    ```bash
    ansible-galaxy collection install azure.azcollection
    ```

* Install Azure modules

    ```bash
    wget https://raw.githubusercontent.com/ansible-collections/azure/dev/requirements-azure.txt
    sudo pip3 install -r requirements-azure.txt
    ```

## PowerShell

Most of this site has a slight bias towards OSS technologies rather than traditional Windows Server and PowerShell. Most Linux users will prefer to use the Azure CLI. Having said that, it is always useful to have the PowerShell Az module installed as there are some operations that can only be achieved with PowerShell cmdlets. The good news is that PowerShell and the PowerShell Az module are cross platform.

* [Install PowerShell & the Az module](https://docs.microsoft.com/powershell/azure/install-az-ps)
