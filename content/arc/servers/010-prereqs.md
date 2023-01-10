---
title: "Prereqs"
description: "Attending an Azure Arc for Management & Governance hack? If so then complete these first."
slug: prereqs
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-prereqs
series:
 - arc-servers
aliases:
 - /arc/prereqs
weight: 010
---

## Introduction

It is important that you can hit the grounds running when you attend one of the Azure Arc partner hacks.

{{< flash >}}
If you are attending a UK Azure Arc Partner Hack:

* you will be invited into a tenant for the hack
* You will also be Owner on a new Azure Pass subscription
* resources have been pre-configured
* details for connecting to your "on prem" servers will be provided

**What do you need to do?**:

* make sure you have the right tooling
* have done the pre-reading

⚠️ Please complete this page before you attend the hack!
{{< /flash >}}

There will be a brief level set at the start of day one, but there is an assumption that you will have a core understanding of Azure Landing Zones and the Azure Arc hybrid capabilities. See the [Required reading](#required-reading) section for recommended links.

The hack is designed for partners who want to understand how they can standardise their target landing zones for multiple customers with hybrid environments. There is a focus on multi-tenancy, scale and automation and therefore the tooling is important. Whilst we understand that different people have different preferences in tooling, we have made a few assumptions to make effective use of the limited time and that includes the use of bash commands to accelerate deployments.

## Minimal config

It is possible to complete the whole hack using nothing but the **Azure portal** and **Cloud Shell**? Well yes, just about, but that is not our recommendation.

Why not? You will find a few limitations with Cloud Shell as you work through the labs. The Cloud Shell sessions are ephemeral, and are subject to timeouts and disconnections. The public IP address for the containers will change (these need to be added to firewalls for access to VMs and Key Vaults.)

If you are using Cloud Shell then use the Bash experience (rather than PowerShell) for these labs. It is recommended to use a new tab with <https://shell.azure.com>, and make sure you're familiar with the [Monaco editor](https://learn.microsoft.com/azure/cloud-shell/using-cloud-shell-editor).

Therefore we we have a fuller config that we recommend for the hacks. Read on to get set up.

## Recommended config

{{< flash >}}
The **recommended** Windows setup for the hack is

* [GitHub account](https://github.com/join)
* Windows Terminal
* Windows Subsystem for Linux
* Visual Studio Code (with remote extensions)

This has richer functionality, is stable for long sessions and will use your normal outbound public IP address.
{{< /flash >}}

### Installation

* Install [Windows Subsystem for Linux](https://learn.microsoft.com/windows/wsl/install)

    Open PowerShell as Administrator:

    ```powershell
    wsl --install
    ```

* Install [Windows Terminal](https://aka.ms/terminal)

    If you cannot install from the Microsoft Store then follow the [alternative instructions](https://learn.microsoft.com/windows/terminal/install).

* Open the Ubuntu profile in **Windows Terminal**

    You will be prompted to [create a local username and password](https://learn.microsoft.com/windows/wsl/setup/environment#set-up-your-linux-username-and-password) on first use.

* Azure CLI

    [Install the Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli-linux?pivots=apt) within Ubuntu.

    ```bash
    curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
    ```

* Extend the CLI with the connectedmachine sub-commands

    ```bash
    az extension add --name connectedmachine
    ```

* Install binaries

    Again, within Ubuntu.

    ```bash
    sudo apt update && sudo apt install jq git tree stress -y && sudo apt upgrade -y
    ```

* Install [Visual Studio Code](https://aka.ms/vscode) on Windows
* Install the vscode [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) extension pack
* Install the vscode [Remote - Tunnels](https://marketplace.visualstudio.com/items?itemName=ms-vscode.remote-server) extension

### Test the config

* Open **Terminal**
* Open **Settings** from the drop down and select Ubuntu as the default profile and Save

    ![Terminal Settings](/arc/servers/images/terminal_settings.png)

    > Windows Terminal is highly configurable. Feel free to customise using the [docs](https://learn.microsoft.com/windows/terminal/).

* Open **Ubuntu** from the drop down
* Test that you can connect to Azure

    ```bash
    az login
    ```

    The familiar browser authantication workflow should start. (The Azure CLI documentation will also open up.)

* Show your current subscription context

    ```bash
    az account show --output jsonc
    ```

    ![az account show](/arc/servers/images/az_account_show.png)

* Create a working directory for the hack

    ```bash
    mkdir ~/archack
    ```

* Change to the new directory

   ```bash
   cd ~/archack
   ```

   > Note that you can set the starting directory: Settings | Profiles | Ubuntu | Starting directory

* Open vscode

    ```bash
    code .
    ```

    Visual Studio Code will open the current directory.

    ![Visual Studio Code](/arc/servers/images/vscode.png)

    Note the `><WSL: Ubuntu` at the bottom left. Your vscode session is using the Remote Extension.

* Feel free to explore the *Get Started* page if you have not used vscode before.

OK, your system is good to go!

## Required reading

The hack will assume that you have a base understanding of Azure, Azure Arc, the Cloud Adoption Framework and Azure Landing Zones for hybrid and multicloud environments.

1. [Azure Arc product page](https://azure.microsoft.com/services/azure-arc/#product-overview)
1. [Azure Arc-enabled servers overview](https://docs.microsoft.com/azure/azure-arc/servers/overview) (including the video)
1. Explore the [hybrid and multicloud scenario](https://aka.ms/adopt/hybrid) for the Cloud Adoption Framework

## References

* <https://azure.microsoft.com/services/azure-arc/#product-overview>
* <https://aka.ms/adopt/hybrid>
* <https://docs.microsoft.com/azure/azure-arc/servers/>
* <https://docs.microsoft.com/azure/azure-arc/servers/agent-overview#prerequisites>
* <https://docs.microsoft.com/azure/virtual-machines/linux/quotas>
* <https://docs.microsoft.com/azure/active-directory/manage-apps/grant-admin-consent>

## Next

{{< flash >}}
For those of you attending an Azure Arc partner hack then you should now be good to go. We'll see you when the hack starts.

The kick off meeting will be in the General channel within the dedicated *Azure Arc Partner Hack* team.

⚠️ Don't read the next lab page until instructed!
{{< flash >}}
