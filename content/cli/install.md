---
title: "Install"
date: 2021-01-04
author: [ "Richard Cheney" ]
description: "Install the Azure CLI"
weight: 1
series:
 - cli
menu:
  side:
    parent: cli
aliases:
    - /prereqs/cli/cli-1-setup/
---

## Cloud Shell

If you don't want to install the CLI then you can still use it via the [Cloud Shell](https://shell.azure.com). You can also click on the **`>_`** icon at the top of the [portal](https://portal.azure.com).

The Azure CLI is one of the many utilities baked into the [Cloud Shell container image](https://github.com/Azure/CloudShell) and is kept up to date by the team managing that image.

## Install the Azure CLI

Installing the Azure CLI is recommended For linux based systems.

For linux users on Windows 10 then the strong recommendation is to [install WSL2](https://docs.microsoft.com/windows/wsl/install-win10) and then install the CLI in your chosen distro rather than installing the .msi.

* [macOS](https://docs.microsoft.com/cli/azure/install-azure-cli-macos)
* [Ubuntu, Debian](https://docs.microsoft.com/cli/azure/install-azure-cli-linux?pivots=apt)
* [RHEL, Fedora, CentOS](https://docs.microsoft.com/cli/azure/install-azure-cli-linux?pivots=yum)
* [openSUSE, SLES](https://docs.microsoft.com/cli/azure/install-azure-cli-linux?pivots=zypper)

The labs on this site assume Ubuntu 20.04 as the installed WSL2 distribution.

> If you  install the Azure CLI using the .msi file at the Windows level then youwill be able do the basics and make use of the JMESPATH queries but you will not be able to follow the Bash scripting section of these labs, or the jq and jp filters. If you are not a fan of linux then you may want to explore the Az PowerShell module instead.

## Updating the Azure CLI

You can use the standard commands to update all packages in Linux (e.g. `sudo apt-get update && sudo apt-get upgrade`), or you can use the new `az upgrade` command that will update the binary to the latest and will also check if any extensions need to be updated.

## Windows Terminal

It is recommended that Windows 10 users install the [Windows Terminal](https://docs.microsoft.com/windows/terminal/get-started).

Windows Terminal will automatically add in profiles for the Cloud Shell and any installed WSL2 distros.

![Windows Terminal](/cli/images/windows_terminal.png)

## Azure CLI 1.0 and 2.0

The current version of the Azure CLI is 2.x. Ignore any reference on the internet to Azure CLI 1.0 or the Azure classic CLI as this is deprecated.
