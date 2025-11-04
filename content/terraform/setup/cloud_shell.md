---
title: "Cloud Shell"
date: 2024-02-19
draft: false
author: [ "Richard Cheney" ]
description: "Use the Azure Cloud Shell if you are looking for the quickest way to run Terraform on Azure."
weight: 10
menu:
  side:
    parent: terraform-setup
series:
 - terraform-setup
---

## Overview

Azure Cloud Shell is a browser-based shell that provides access to various tools and services for managing Azure resources, and includes common binaries including git, az, jq and terraform in its container image.

The Cloud Shell is ideal for quick demos, small test and dev projects, or for training groups. Many of the labs on this site assume Cloud Shell as it simplifies the pre-reqs.

Pros:

- Cloud Shell includes a recent version of Terraform
- Cloud Shell will automatically authenticate
- Cloud Shell saves the state file in Azure Storage blob
- Cloud Shell has the Monaco editor, with syntax highlighting for HCL files

Cons:

- Single user only; not designed for teams
- No control over Terraform version
- No sudo
- Unsuited to long sessions due to timeouts

## Accessing Cloud Shell

Access the Azure Cloud Shell via **`>_`** at the top of the Azure portal or via <https://shell.azure.com>.

1. Open [Cloud Shell](https://shell.azure.com)

    These labs assume the Bash experience.

    Upon first use, you'll be prompted to create the Storage Account used to persist the home directory and cloudshell mount.

1. Check your subscription context.

    ```bash
    az account show
    ```

    Check that you are in the right subscription or [switch](https://learn.microsoft.com/cli/azure/manage-azure-subscriptions-azure-cli).

    Note that the command output includes `user.cloudShellID: true`. It is assumed that you have Owner or Contributor on the subscription.

## Create example files

We'll run through a quick example, creating a resource group.

1. Make a working directory

    ```bash
    mkdir terraform-envs
    ```

1. Switch to it

    ```bash
    cd ~/terraform-envs
    ```

1. Create empty files

    ```bash
    touch provider.tf variables.tf main.tf outputs.tf
    ```

1. List the files

    ```bash
    ls -l
    ```

1. Open the editor

   ```bash
   code .
   ```

1. Select the provider.tf file in the file explorer pane

    Note that the filename is now shown above the editing pane.

1. Paste the code below in the editing pane on the right

    **provider.tf**

    ```go
    terraform {
      required_providers {
        azurerm = {
          source  = "hashicorp/azurerm"
          version = ">=3.50.0"
        }
      }
    }

    provider "azurerm" {
      features {}
    }
    ```

    Use `CTRL`+`V` to paste, or `CTRL`+`SHIFT`+`V` to paste as text.

    Note the syntax highlighting.

    ![Monaco editor in Azure Cloud Shell](/terraform/environments/images/cloud_shell.png)

1. Save

    Press `CTRL`+`S` to save.

    Unsaved files have a dot on the filename tab. This will disappear once saved.

1. Repeat for the other files

    **variables.tf**

    ```go
    variable "resource_group_name" {
      description = "Name for the resource group."
      type        = string
      default     = "myExampleResourceGroup"
    }

    variable "location" {
      description = "Azure region."
      type        = string
      default     = "UK South"
    }
    ```

    **main.tf**

    ```go
    resource "azurerm_resource_group" "example" {
      name     = var.resource_group_name
      location = var.location
    }
    ```

    **outputs.tf**

    ```go
    output "id" {
      value = azurerm_resource_group.example.id
    }
    ```

    Don't forget to use `CTRL`+`S`.

## Terraform workflow

Run through the standard Terraform workflow.

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

    Respond "yes" when prompted to create the empty resource group.

1. Destroy

    ```bash
    terraform destroy
    ```

    The resource group is removed.

## Summing up

Cloud Shell is great for the quick and dirty work, and for use in training. It has most of what you need, and is always accessible if you have a network connection.

However, if you are doing a lot of work then you may want a fuller setup directly on your machine. In the next environment we'll

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