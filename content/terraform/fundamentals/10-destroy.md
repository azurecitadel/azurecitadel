---
title: "Destroy"
date: 2021-04-06
slug: destroy
draft: false
author: [ "Richard Cheney" ]
description: "Short lab to tear down the environment."
weight: 10
menu:
  side:
    parent: 'terraform-basics'
series:
 - terraform-basics
layout: single

---

## Overview

In this lab you will

* selectively destroy a resource with commenting
* destroy the whole environment with `terraform destroy`
* check the state file

## Starting point

Your files should look similar to this:

* provider.tf

    ```go
    terraform {
      required_providers {
        azurerm = {
          source  = "hashicorp/azurerm"
          version = "~>3.1"
        }
      }
    }

    provider "azurerm" {
      features {}

      storage_use_azuread = true
    }
    ```

* variables.tf

    ```go
    variable "resource_group_name" {
      description = "Name for the resource group"
      type        = string
      default     = "terraform-basics"
    }

    variable "location" {
      description = "Azure region"
      type        = string
      default     = "West Europe"
    }

    variable "container_group_name" {
      description = "Name of the container group"
      type        = string
      default     = "terraform-basics"
    }
    ```

* main.tf

    ```go
    locals {
      uniq = substr(sha1(azurerm_resource_group.basics.id), 0, 8)
    }

    resource "azurerm_resource_group" "basics" {
      name     = var.resource_group_name
      location = var.location

      lifecycle {
        ignore_changes = [
          tags,
        ]
      }
    }

    resource "azurerm_container_group" "basics" {
      name                = var.container_group_name
      location            = azurerm_resource_group.basics.location
      resource_group_name = azurerm_resource_group.basics.name
      ip_address_type     = "Public"
      dns_name_label      = "${var.container_group_name}-${local.uniq}"
      os_type             = "Linux"

      container {
        name   = "inspectorgadget"
        image  = "jelledruyts/inspectorgadget:latest"
        cpu    = "0.5"
        memory = "1.0"

        ports {
          port     = 80
          protocol = "TCP"
        }
      }
    }

    resource "azurerm_storage_account" "import_example" {
      name                     = "richeney27182818"
      resource_group_name      = azurerm_resource_group.basics.name
      location                 = azurerm_resource_group.basics.location
      account_tier             = "Standard"
      account_replication_type = "LRS"

      allow_nested_items_to_be_public = false
      is_hns_enabled                  = true
      nfsv3_enabled                   = true
    }
    ```

    > ⚠️ Your storage account name will be different.

* outputs.tf

    ```go
    output "ip_address" {
      value = azurerm_container_group.basics.ip_address
    }

    output "fqdn" {
      value = "http://${azurerm_container_group.basics.fqdn}"
    }
    ```

* terraform.tfvars

    ```go
    location = "UK South"
    ```

    > You may have set a different value for *location*.

## Commenting and renaming

Before we clean up the environment, take a look at how commenting blocks and renaming files can change the behaviour of the CLI commands.

1. Comment out the container instance

    You can comment individual lines by prepending with either `#` or `//`.

    You can comment multiple lines by surrounding the block with `/*` and `*/`, as shown below.

    ```text
    /*
    resource "azurerm_container_group" "basics" {
      name                = var.container_group_name
      location            = azurerm_resource_group.basics.location
      resource_group_name = azurerm_resource_group.basics.name
      ip_address_type     = "public"
      dns_name_label      = "${var.container_group_name}-${local.uniq}"
      os_type             = "Linux"

      container {
        name   = "inspectorgadget"
        image  = "jelledruyts/inspectorgadget:latest"
        cpu    = "0.5"
        memory = "1.0"

        ports {
          port     = 80
          protocol = "TCP"
        }
      }
    }
    */
    ```

    > Users of vscode can also highlight multiple lines and use the `CTRL`+`K`,`CTRL`+`C` chord to comment, and `CTRL`+`K`,`CTRL`+`U` to uncomment.

1. terraform plan

    ```bash
    terraform plan
    ```

    You should see errors based on the outputs.

1. Rename the outputs.tf file

   When Terraform runs its commands it is looking at all files in the current directory that match `*.tf`. You can rename file suffixes and it will ignore those files.

   Rename the outputs files so that it is completely ignored in the diff.

   ```bash
   mv outputs.tf outputs.tf.ignore
   ```

1. terraform plan

    ```bash
    terraform plan
    ```

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">azurerm_resource_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_container_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.ContainerInstance/containerGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_storage_account.import_example: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.Storage/storageAccounts/richeney27182818]</span>

Terraform used the selected providers to generate the following execution
plan. Resource actions are indicated with the following symbols:
  <span style="color:red;">-</span> destroy

Terraform will perform the following actions:

<span style="font-weight:bold;">  # azurerm_container_group.basics</span> will be <span style="font-weight:bold;"></span><span style="font-weight:bold;color:red;">destroyed</span>
  # (because azurerm_container_group.basics is not in configuration)
  <span style="color:red;">-</span> resource &quot;azurerm_container_group&quot; &quot;basics&quot; {
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>dns_name_label      = &quot;terraform-basics-c3818179&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>exposed_port        = [
          <span style="color:red;">-</span> {
              <span style="color:red;">-</span> port     = 80
              <span style="color:red;">-</span> protocol = &quot;TCP&quot;
            },
        ] <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>fqdn                = &quot;terraform-basics-c3818179.uksouth.azurecontainer.io&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>id                  = &quot;/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.ContainerInstance/containerGroups/terraform-basics&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>ip_address          = &quot;20.108.193.216&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>ip_address_type     = &quot;Public&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>location            = &quot;uksouth&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>name                = &quot;terraform-basics&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>os_type             = &quot;Linux&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>resource_group_name = &quot;terraform-basics&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>restart_policy      = &quot;Always&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>tags                = {} <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>

      <span style="color:red;">-</span> container {
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>commands                     = [] <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>cpu                          = 0.5 <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>environment_variables        = {} <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>image                        = &quot;jelledruyts/inspectorgadget:latest&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>memory                       = 1 <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>name                         = &quot;inspectorgadget&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>secure_environment_variables = (sensitive value)

          <span style="color:red;">-</span> ports {
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>port     = 80 <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>protocol = &quot;TCP&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
            }
        }
    }

<span style="font-weight:bold;">Plan:</span> 0 to add, 0 to change, 1 to destroy.

<span style="font-weight:bold;">Changes to Outputs:</span>
  <span style="color:red;">-</span> <span style="font-weight:bold;"></span>fqdn       = &quot;http://terraform-basics-c3818179.uksouth.azurecontainer.io&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
  <span style="color:red;">-</span> <span style="font-weight:bold;"></span>ip_address = &quot;20.108.193.216&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
<span style="filter: contrast(70%) brightness(190%);color:dimgray;">
─────────────────────────────────────────────────────────────────────────────</span>

Note: You didn't use the -out option to save this plan, so Terraform can't
guarantee to take exactly these actions if you run &quot;terraform apply&quot; now.
</pre>
{{< /raw >}}

    The resource is no longer in the config and so Terraform plans to remove it.

    > Some of you will be familiar with ARM templates or Bicep and the standard *incremental* mode, which only ever **contributes** resources idempotently. If you were to remove resources from the resources array in an ARM template then those resources would remain in the resource group and would have to be manually deleted.
    >
    > The Terraform behaviour here is closer to the less commonly used *complete* mode in ARM / Bicep.

1. Apply the change

    ```bash
    terraform apply
    ```

    Approve the change. The container group will be deleted.

## terraform destroy

We'll finish with a command that you will use rarely in production. The `terraform destroy` command will update state, show the current resources and remove any defined in your files.

1. Destroy the environment

    ```bash
    terraform destroy
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">azurerm_resource_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_storage_account.import_example: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.Storage/storageAccounts/richeney27182818]</span>

Terraform used the selected providers to generate the following execution
plan. Resource actions are indicated with the following symbols:
  <span style="color:red;">-</span> destroy

Terraform will perform the following actions:

<span style="font-weight:bold;">  # azurerm_resource_group.basics</span> will be <span style="font-weight:bold;"></span><span style="font-weight:bold;color:red;">destroyed</span>
  <span style="color:red;">-</span> resource &quot;azurerm_resource_group&quot; &quot;basics&quot; {
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>id       = &quot;/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>location = &quot;uksouth&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>name     = &quot;terraform-basics&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>tags     = {
          <span style="color:red;">-</span> &quot;source&quot; = &quot;terraform&quot;
        } <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
    }

<span style="font-weight:bold;">  # azurerm_storage_account.import_example</span> will be <span style="font-weight:bold;"></span><span style="font-weight:bold;color:red;">destroyed</span>
  <span style="color:red;">-</span> resource &quot;azurerm_storage_account&quot; &quot;import_example&quot; {
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>access_tier                       = &quot;Hot&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>account_kind                      = &quot;StorageV2&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>account_replication_type          = &quot;LRS&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>account_tier                      = &quot;Standard&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>allow_nested_items_to_be_public   = true <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>enable_https_traffic_only         = true <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>id                                = &quot;/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.Storage/storageAccounts/richeney27182818&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>infrastructure_encryption_enabled = false <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>is_hns_enabled                    = true <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>location                          = &quot;uksouth&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>min_tls_version                   = &quot;TLS1_2&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>name                              = &quot;richeney27182818&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>nfsv3_enabled                     = true <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>primary_access_key                = (sensitive value)
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>primary_blob_connection_string    = (sensitive value)
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>primary_blob_endpoint             = &quot;https://richeney27182818.blob.core.windows.net/&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>primary_blob_host                 = &quot;richeney27182818.blob.core.windows.net&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>primary_connection_string         = (sensitive value)
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>primary_dfs_endpoint              = &quot;https://richeney27182818.dfs.core.windows.net/&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>primary_dfs_host                  = &quot;richeney27182818.dfs.core.windows.net&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>primary_file_endpoint             = &quot;https://richeney27182818.file.core.windows.net/&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>primary_file_host                 = &quot;richeney27182818.file.core.windows.net&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>primary_location                  = &quot;uksouth&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>primary_queue_endpoint            = &quot;https://richeney27182818.queue.core.windows.net/&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>primary_queue_host                = &quot;richeney27182818.queue.core.windows.net&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>primary_table_endpoint            = &quot;https://richeney27182818.table.core.windows.net/&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>primary_table_host                = &quot;richeney27182818.table.core.windows.net&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>primary_web_endpoint              = &quot;https://richeney27182818.z33.web.core.windows.net/&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>primary_web_host                  = &quot;richeney27182818.z33.web.core.windows.net&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>queue_encryption_key_type         = &quot;Service&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>resource_group_name               = &quot;terraform-basics&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>secondary_access_key              = (sensitive value)
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>secondary_connection_string       = (sensitive value)
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>shared_access_key_enabled         = true <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>table_encryption_key_type         = &quot;Service&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>tags                              = {} <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>

      <span style="color:red;">-</span> blob_properties {
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>change_feed_enabled      = false <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>last_access_time_enabled = false <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>versioning_enabled       = false <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>

          <span style="color:red;">-</span> delete_retention_policy {
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>days = 7 <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
            }
        }

      <span style="color:red;">-</span> network_rules {
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>bypass                     = [
              <span style="color:red;">-</span> &quot;AzureServices&quot;,
            ] <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>default_action             = &quot;Deny&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>ip_rules                   = [] <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>virtual_network_subnet_ids = [] <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
        }

      <span style="color:red;">-</span> queue_properties {

          <span style="color:red;">-</span> hour_metrics {
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>enabled               = true <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>include_apis          = true <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>retention_policy_days = 7 <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>version               = &quot;1.0&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
            }

          <span style="color:red;">-</span> logging {
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>delete                = false <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>read                  = false <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>retention_policy_days = 0 <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>version               = &quot;1.0&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>write                 = false <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
            }

          <span style="color:red;">-</span> minute_metrics {
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>enabled               = false <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>include_apis          = false <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>retention_policy_days = 0 <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>version               = &quot;1.0&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
            }
        }

      <span style="color:red;">-</span> share_properties {

          <span style="color:red;">-</span> retention_policy {
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>days = 7 <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
            }
        }

      <span style="color:red;">-</span> timeouts {}
    }

<span style="font-weight:bold;">Plan:</span> 0 to add, 0 to change, 2 to destroy.
<span style="font-weight:bold;">
Do you really want to destroy all resources?</span>
  Terraform will destroy all your managed infrastructure, as shown above.
  There is no undo. Only 'yes' will be accepted to confirm.

  <span style="font-weight:bold;">Enter a value:</span> yes

<span style="font-weight:bold;">
azurerm_storage_account.import_example: Destroying... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.Storage/storageAccounts/richeney27182818]
azurerm_storage_account.import_example: Destruction complete after 2s
azurerm_resource_group.basics: Destroying... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics]
azurerm_resource_group.basics: Still destroying... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-...3a68cc/resourceGroups/terraform-basics, 10s elapsed]
azurerm_resource_group.basics: Destruction complete after 15s
</span>

<span style="color:lime;">Destroy complete! Resources: 2 destroyed.</span>
{{< /raw >}}

## Summary

Done! 😊

You have learnt how to initialise Terraform, install providers, format and validate HCL files, how to add resources and plan and apply your configs. You have also worked with simple expressions, locals and outputs, manipulated the state file - including an import - and then managed the destroy phase.
