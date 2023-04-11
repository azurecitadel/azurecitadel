---
title: "Cloud Shell"
date: 2023-04-11
draft: false
author: [ "Richard Cheney" ]
description: "Use the Azure Cloud Shell if you are looking for the quickest way to run Terraform on Azure."
weight: 1
menu:
  side:
    parent: 'terraform-envs'
series:
 - terraform-envs
layout: single
---

## Overview

Azure Cloud Shell is a browser-based shell that provides access to various tools and services for managing Azure resources, and includes common binaries including git, az, jq and terraform.

The Cloud Shell is ideal for quick demos, small test and dev projects, or for training groups as the barrier for entry is so low. Many of the labs on this site assume Cloud Shell as it reduces the pre-reqs to almost nothing.

Pros:

- Azure Cloud Shell automatically has the latest version of Terraform installed. You don't have to worry about downloading, installing, or updating Terraform on your local machine.
- Azure Cloud Shell automatically uses information from the current Azure subscription. You don't have to configure or authenticate Terraform to access your Azure resources.
- Azure Cloud Shell saves the Terraform state file in highly available Azure Storage. You don't have to manage or backup the state file locally or on a remote server.
- Azure Cloud Shell features the Monaco editor which includes syntax highlighting for Hashicorp Configuration Language (HCL) format files.

Cons:

- Single user only; not designed for teams.
- No control over Terraform version as the binary is part of the Cloud Shell container image.
- No sudo capability.

These are just some of the advantages of using Azure Cloud Shell for running Terraform. To learn more about how to configure and use Terraform in Azure Cloud Shell, read on.

## Example run through

You can access the Azure Cloud Shell in multiple ways, most commonly via **`>_`** icon at the top of the Azure portal or via <https://shell.azure.com>.

1. Open [Cloud Shell](https://shell.azure.com)

    These labs assume the Bash experience.

    If you are using Cloud Shell for the first time then you will be prompted to create the Azure Storage Account used for persisting the home directory and cloudshell mount.

1. Check your subscription context.

    ```bash
    az account show
    ```

    Check that you are in the right subscription or [switch](https://learn.microsoft.com/cli/azure/manage-azure-subscriptions-azure-cli).

    Note that the command output includes `user.cloudShellID: true`. It is assumed that you have Owner or Contributor on the subscription.

1. Download the example repo

    ```bash
    git clone https://github.com/richeney/terraform-envs
    ```

1. Switch to the Terraform folder

    ```bash
    cd ~/terraform-envs
    ```

1. List out the files

    ```bash
    ls -l
    ```

1. Open the editor

   ```bash
   code .
   ```

1. Click on the provider.tf file

    ![Monaco editor in Azure Cloud Shell](/terraform/environments/images/cloud_shell.png)

    Note the syntax highlighting.

    Common short cuts are `CTRL`+`S` to save and `CTRL`+`Q` to quit.

1. Initialise

    ```bash
    terraform init
    ```

    The azurerm provider will be downloaded locally.

1. Plan

    ```bash
    terraform plan
    ```

    The config plan shows a single resource group in uksouth called _myExampleResourceGroup_.

1. Apply

    ```bash
    terraform apply
    ```

    Respond "yes" when prompted to create the empty resource group. The resource ID will be output.

1. Destroy

        ```bash
    terraform destroy
    ```

    The resource group is removed.

## Summing up

Great for the quick and dirty work, and for use in training. If you are doing a lot of work then you may want a fuller config. In the next environment we'll

- install a set of tools
- deploy using a service principal
- store the state file in Azure

## Links

- [Azure Cloud Shell overview](https://docs.microsoft.com/azure/cloud-shell/overview)
- [Azure Cloud Shell quickstart](https://docs.microsoft.com/azure/cloud-shell/quickstart)
- [Azure Cloud Shell image repo](https://github.com/Azure/CloudShell)
- [Azure Cloud Shell release notes](https://docs.microsoft.com/azure/cloud-shell/release-notes)
- [Windows Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701)
- [Manage subscriptions](https://learn.microsoft.com/cli/azure/manage-azure-subscriptions-azure-cli)