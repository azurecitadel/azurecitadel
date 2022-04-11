---
title: "Importing resources"
date: 2021-04-06
slug: import
draft: false
author: [ "Richard Cheney" ]
description: "Step through an example of importing an existing resource into Terraform."
weight: 9
menu:
  side:
    parent: 'terraform-basics'
series:
 - terraform-basics
layout: single

---

## Overview

Another common scenario is importing resources that have been created manually. This is not a fully automated process so this section will guide you through the basics.

In this lab you will

1. Create a storage account resource
1. Check for a clean `terraform plan`
1. Add a minimal resource block
1. Import the resource
1. Configure until `terraform plan` is clean again
1. Apply the config with the `--refresh-only` switch

## Starting point

Your files should look similar to this:

* provider.tf

    ```go
    terraform {
      required_providers {
        azurerm = {
          source  = "hashicorp/azurerm"
          version = "~>2.96"
        }
      }
    }

    provider "azurerm" {
      features {
        resource_group {
          prevent_deletion_if_contains_resources = true
        }
      }

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
      ip_address_type     = "public"
      dns_name_label      = "${var.prefix}-${var.container_group_name}"
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

    ```

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

## Create the resource

Use the portal to create a storage account in the *terraform-basics* resource group.

1. [Create a storage account in the portal](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM) (open in a new tab)
    * Select the *terraform-basics* resource group
    * Select the same region as the resource group
    * Create a valid and unique storage account name
    * Change redundancy to LRS
    * In the Advanced tab
        * Disable blob public access
        * Default to AAD authentication
        * Enable hierarchical namespace
        * Enable NFS v3
    * In the Networking tab
        * Disable public access and use private access

    > Skip the private endpoint creation for simplicity.

1. Click on *Review and create*

    Check the config matching the requirements and validates.

    ![Storage Account validation](/terraform/fundamentals/images/storage_account_validation.png)

1. Click on *Create*

    Deployment should take a few seconds. Navigate to the resource.

    ![Storage Account overview](/terraform/fundamentals/images/storage_account_overview.png)

1. Note the resource ID in the JSON view

    ![Storage Account JSON view](/terraform/fundamentals/images/storage_account_jsonview.png)

    You will need the resource ID for the import command in the next section.

1. Set a variable for the resource ID

    You can also use CLI commands to set a variable, e.g.

    Bash:

    ```shell
    saId=$(az storage account list --resource-group terraform-basics --query "[0].id" --output tsv)
    ```

    Powershell:

    ```powershell
    $saId = (Get-AzStorageAccount -ResourceGroupName terraform-basics)[0].id
    ```

    This will set the variables to the resource ID of the first storage account found in the resource group.

## Import into state

1. Check *terraform plan* is clean

    ```shell
    terraform plan
    ```

    Expected output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">azurerm_resource_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_container_group.example: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.ContainerInstance/containerGroups/terraform-basics]</span>

<span style="font-weight:bold;"></span><span style="font-weight:bold;color:lime;">No changes.</span><span style="font-weight:bold;"> Your infrastructure matches the configuration.</span>

Terraform has compared your real infrastructure against your configuration
and found no differences, so no changes are needed.
</pre>
{{< /raw >}}

    ⚠️ It is not recommended to import resources unless the Terraform config, state file and Azure reality all match.

1. Create an empty resource block

    Use the [Terraform azurerm docs](https://aka.ms/terraform) for [azurerm_storage_account](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account) to get an example block.

    ```go
    resource "azurerm_storage_account" "import_example" {
      name                     = "storageaccountname"
      resource_group_name      = azurerm_resource_group.basics.name
      location                 = azurerm_resource_group.basics.location
      account_tier             = "Standard"
      account_replication_type = "GRS"

      tags = {
        environment = "staging"
      }
    }
   ```

   * Copy the example into your main.tf
   * Set the name to your storage account's name
   * Set the references to the resource group to *azurerm_resource_group.basics*
   * Set the Terraform identifier to *import_example*

   > You would usually set the identifier to your preferred name. Please keep it as *import_example* for this lab.
   >
   > Don't worry that the other arguments do not match your created resource yet.

1. Import the resource

    ```shell
    terraform import azurerm_storage_account.import_example $saId
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">azurerm_storage_account.import_example: Importing from ID &quot;/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.Storage/storageAccounts/richeney27182818&quot;...</span>
<span style="font-weight:bold;"></span><span style="font-weight:bold;color:lime;">azurerm_storage_account.import_example: Import prepared!</span>
<span style="color:lime;">  Prepared azurerm_storage_account for import</span>
<span style="font-weight:bold;">azurerm_storage_account.import_example: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.Storage/storageAccounts/richeney27182818]</span>
<span style="color:lime;">
Import successful!

The resources that were imported are shown above. These resources are now in
your Terraform state and will henceforth be managed by Terraform.
</span>
{{< /raw >}}

1. List the identifiers

    ```shell
    terraform state show azurerm_storage_account.import_example
    ```

    Expected output:

    {{< raw >}}
<pre style="color:white; background-color:black">
azurerm_container_group.basics
azurerm_resource_group.basics
azurerm_storage_account.import_example
</pre>
{{< /raw >}}

1. Show the imported config

    ```shell
    terraform state show azurerm_storage_account.import_example
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;"># azurerm_storage_account.import_example:
resource &quot;azurerm_storage_account&quot; &quot;import_example&quot; </span> {
    access_tier                       = &quot;Hot&quot;
    account_kind                      = &quot;StorageV2&quot;
    account_replication_type          = &quot;LRS&quot;
    account_tier                      = &quot;Standard&quot;
    allow_blob_public_access          = true
    enable_https_traffic_only         = true
    id                                = &quot;/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.Storage/storageAccounts/richeney27182818&quot;
    infrastructure_encryption_enabled = false
    is_hns_enabled                    = true
    location                          = &quot;uksouth&quot;
    min_tls_version                   = &quot;TLS1_2&quot;
    name                              = &quot;richeney27182818&quot;
    nfsv3_enabled                     = true
    primary_access_key                = (sensitive value)
    primary_blob_connection_string    = (sensitive value)
    primary_blob_endpoint             = &quot;https://richeney27182818.blob.core.windows.net/&quot;
    primary_blob_host                 = &quot;richeney27182818.blob.core.windows.net&quot;
    primary_connection_string         = (sensitive value)
    primary_dfs_endpoint              = &quot;https://richeney27182818.dfs.core.windows.net/&quot;
    primary_dfs_host                  = &quot;richeney27182818.dfs.core.windows.net&quot;
    primary_file_endpoint             = &quot;https://richeney27182818.file.core.windows.net/&quot;
    primary_file_host                 = &quot;richeney27182818.file.core.windows.net&quot;
    primary_location                  = &quot;uksouth&quot;
    primary_queue_endpoint            = &quot;https://richeney27182818.queue.core.windows.net/&quot;
    primary_queue_host                = &quot;richeney27182818.queue.core.windows.net&quot;
    primary_table_endpoint            = &quot;https://richeney27182818.table.core.windows.net/&quot;
    primary_table_host                = &quot;richeney27182818.table.core.windows.net&quot;
    primary_web_endpoint              = &quot;https://richeney27182818.z33.web.core.windows.net/&quot;
    primary_web_host                  = &quot;richeney27182818.z33.web.core.windows.net&quot;
    queue_encryption_key_type         = &quot;Service&quot;
    resource_group_name               = &quot;terraform-basics&quot;
    secondary_access_key              = (sensitive value)
    secondary_connection_string       = (sensitive value)
    shared_access_key_enabled         = true
    table_encryption_key_type         = &quot;Service&quot;
    tags                              = {}

    blob_properties {
        change_feed_enabled      = false
        last_access_time_enabled = false
        versioning_enabled       = false

        delete_retention_policy {
            days = 7
        }
    }

    network_rules {
        bypass                     = [
            &quot;AzureServices&quot;,
        ]
        default_action             = &quot;Deny&quot;
        ip_rules                   = []
        virtual_network_subnet_ids = []
    }

    queue_properties {

        hour_metrics {
            enabled               = true
            include_apis          = true
            retention_policy_days = 7
            version               = &quot;1.0&quot;
        }

        logging {
            delete                = false
            read                  = false
            retention_policy_days = 0
            version               = &quot;1.0&quot;
            write                 = false
        }

        minute_metrics {
            enabled               = false
            include_apis          = false
            retention_policy_days = 0
            version               = &quot;1.0&quot;
        }
    }

    share_properties {

        retention_policy {
            days = 7
        }
    }

    timeouts {}
}
</pre>
{{< /raw >}}

## Update the config files

OK, so the state looks good, but run a `terraform plan` and you'll see we have more to do.

1. Run a plan

    ```shell
    terraform plan
    ```

    You should see extensive output showing what Terraform plans to change. Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">azurerm_resource_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_container_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.ContainerInstance/containerGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_storage_account.import_example: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.Storage/storageAccounts/richeney27182818]</span>

Terraform used the selected providers to generate the following execution
plan. Resource actions are indicated with the following symbols:
<span style="color:red;">-</span>/<span style="color:lime;">+</span> destroy and then create replacement

Terraform will perform the following actions:

<span style="font-weight:bold;">  # azurerm_storage_account.import_example</span> must be <span style="font-weight:bold;"></span><span style="font-weight:bold;color:red;">replaced</span>
<span style="color:red;">-</span>/<span style="color:lime;">+</span> resource &quot;azurerm_storage_account&quot; &quot;import_example&quot; {
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>access_tier                       = &quot;Hot&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>account_replication_type          = &quot;LRS&quot; <span style="color:yellow;">-&gt;</span> &quot;GRS&quot;
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>allow_blob_public_access          = true <span style="color:yellow;">-&gt;</span> false
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>id                                = &quot;/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.Storage/storageAccounts/richeney27182818&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>is_hns_enabled                    = true <span style="color:yellow;">-&gt;</span> false <span style="color:red;"># forces replacement</span>
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>large_file_share_enabled          = (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>min_tls_version                   = &quot;TLS1_2&quot; <span style="color:yellow;">-&gt;</span> &quot;TLS1_0&quot;
        <span style="font-weight:bold;"></span>name                              = &quot;richeney27182818&quot;
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>nfsv3_enabled                     = true <span style="color:yellow;">-&gt;</span> false <span style="color:red;"># forces replacement</span>
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>primary_access_key                = (sensitive value)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>primary_blob_connection_string    = (sensitive value)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>primary_blob_endpoint             = &quot;https://richeney27182818.blob.core.windows.net/&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>primary_blob_host                 = &quot;richeney27182818.blob.core.windows.net&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>primary_connection_string         = (sensitive value)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>primary_dfs_endpoint              = &quot;https://richeney27182818.dfs.core.windows.net/&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>primary_dfs_host                  = &quot;richeney27182818.dfs.core.windows.net&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>primary_file_endpoint             = &quot;https://richeney27182818.file.core.windows.net/&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>primary_file_host                 = &quot;richeney27182818.file.core.windows.net&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>primary_location                  = &quot;uksouth&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>primary_queue_endpoint            = &quot;https://richeney27182818.queue.core.windows.net/&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>primary_queue_host                = &quot;richeney27182818.queue.core.windows.net&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>primary_table_endpoint            = &quot;https://richeney27182818.table.core.windows.net/&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>primary_table_host                = &quot;richeney27182818.table.core.windows.net&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>primary_web_endpoint              = &quot;https://richeney27182818.z33.web.core.windows.net/&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>primary_web_host                  = &quot;richeney27182818.z33.web.core.windows.net&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>secondary_access_key              = (sensitive value)
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>secondary_blob_connection_string  = (sensitive value)
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>secondary_blob_endpoint           = (known after apply)
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>secondary_blob_host               = (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>secondary_connection_string       = (sensitive value)
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>secondary_dfs_endpoint            = (known after apply)
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>secondary_dfs_host                = (known after apply)
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>secondary_file_endpoint           = (known after apply)
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>secondary_file_host               = (known after apply)
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>secondary_location                = (known after apply)
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>secondary_queue_endpoint          = (known after apply)
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>secondary_queue_host              = (known after apply)
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>secondary_table_endpoint          = (known after apply)
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>secondary_table_host              = (known after apply)
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>secondary_web_endpoint            = (known after apply)
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>secondary_web_host                = (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>tags                              = {
          <span style="color:lime;">+</span> &quot;environment&quot; = &quot;staging&quot;
        }
        <span style="filter: contrast(70%) brightness(190%);color:dimgray;"># (9 unchanged attributes hidden)</span>

      <span style="color:yellow;">~</span> blob_properties {
          <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>change_feed_enabled      = false <span style="color:yellow;">-&gt;</span> (known after apply)
          <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>default_service_version  = (known after apply)
          <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>last_access_time_enabled = false <span style="color:yellow;">-&gt;</span> (known after apply)
          <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>versioning_enabled       = false <span style="color:yellow;">-&gt;</span> (known after apply)

          <span style="color:lime;">+</span> container_delete_retention_policy {
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>days = (known after apply)
            }

          <span style="color:lime;">+</span> cors_rule {
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>allowed_headers    = (known after apply)
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>allowed_methods    = (known after apply)
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>allowed_origins    = (known after apply)
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>exposed_headers    = (known after apply)
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>max_age_in_seconds = (known after apply)
            }

          <span style="color:yellow;">~</span> delete_retention_policy {
              <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>days = 7 <span style="color:yellow;">-&gt;</span> (known after apply)
            }
        }

      <span style="color:yellow;">~</span> network_rules {
          <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>bypass                     = [
              <span style="color:red;">-</span> &quot;AzureServices&quot;,
            ] <span style="color:yellow;">-&gt;</span> (known after apply)
          <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>default_action             = &quot;Deny&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
          <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>ip_rules                   = [] <span style="color:yellow;">-&gt;</span> (known after apply)
          <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>virtual_network_subnet_ids = [] <span style="color:yellow;">-&gt;</span> (known after apply)

          <span style="color:lime;">+</span> private_link_access {
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>endpoint_resource_id = (known after apply)
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>endpoint_tenant_id   = (known after apply)
            }
        }

      <span style="color:yellow;">~</span> queue_properties {
          <span style="color:lime;">+</span> cors_rule {
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>allowed_headers    = (known after apply)
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>allowed_methods    = (known after apply)
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>allowed_origins    = (known after apply)
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>exposed_headers    = (known after apply)
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>max_age_in_seconds = (known after apply)
            }

          <span style="color:yellow;">~</span> hour_metrics {
              <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>enabled               = true <span style="color:yellow;">-&gt;</span> (known after apply)
              <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>include_apis          = true <span style="color:yellow;">-&gt;</span> (known after apply)
              <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>retention_policy_days = 7 <span style="color:yellow;">-&gt;</span> (known after apply)
              <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>version               = &quot;1.0&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
            }

          <span style="color:yellow;">~</span> logging {
              <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>delete                = false <span style="color:yellow;">-&gt;</span> (known after apply)
              <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>read                  = false <span style="color:yellow;">-&gt;</span> (known after apply)
              <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>retention_policy_days = 0 <span style="color:yellow;">-&gt;</span> (known after apply)
              <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>version               = &quot;1.0&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
              <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>write                 = false <span style="color:yellow;">-&gt;</span> (known after apply)
            }

          <span style="color:yellow;">~</span> minute_metrics {
              <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>enabled               = false <span style="color:yellow;">-&gt;</span> (known after apply)
              <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>include_apis          = false <span style="color:yellow;">-&gt;</span> (known after apply)
              <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>retention_policy_days = 0 <span style="color:yellow;">-&gt;</span> (known after apply)
              <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>version               = &quot;1.0&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
            }
        }

      <span style="color:lime;">+</span> routing {
          <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>choice                      = (known after apply)
          <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>publish_internet_endpoints  = (known after apply)
          <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>publish_microsoft_endpoints = (known after apply)
        }

      <span style="color:yellow;">~</span> share_properties {
          <span style="color:lime;">+</span> cors_rule {
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>allowed_headers    = (known after apply)
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>allowed_methods    = (known after apply)
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>allowed_origins    = (known after apply)
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>exposed_headers    = (known after apply)
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>max_age_in_seconds = (known after apply)
            }

          <span style="color:yellow;">~</span> retention_policy {
              <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>days = 7 <span style="color:yellow;">-&gt;</span> (known after apply)
            }

          <span style="color:lime;">+</span> smb {
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>authentication_types            = (known after apply)
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>channel_encryption_type         = (known after apply)
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>kerberos_ticket_encryption_type = (known after apply)
              <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>versions                        = (known after apply)
            }
        }

      <span style="color:red;">-</span> timeouts {}
    }

<span style="font-weight:bold;">Plan:</span> 1 to add, 0 to change, 1 to destroy.
<span style="filter: contrast(70%) brightness(190%);color:dimgray;">
─────────────────────────────────────────────────────────────────────────────</span>

Note: You didn't use the -out option to save this plan, so Terraform can't
guarantee to take exactly these actions if you run &quot;terraform apply&quot; now.
</pre>
{{< /raw >}}

    Ouch! OK, let's work through this.

1. Identify the required config updates

    The good news is that it is pretty quick to deconstruct the output and work out what is important, and experience helps.

    First of all, ignore those lines that include `(known after apply)`. The only ones that we need to pay attention to are those which have changes, deletes or adds where the target state is shown as a literal string.

    The output below has been manually truncated to help you to focus on what is important. Add the initial state for these to the config files and you should eventually get to a clean plan.

    {{< raw >}}
<pre style="color:white; background-color:black">
Terraform will perform the following actions:

<span style="font-weight:bold;">  # azurerm_storage_account.import_example</span> must be <span style="font-weight:bold;"></span><span style="font-weight:bold;color:red;">replaced</span>
<span style="color:red;">-</span>/<span style="color:lime;">+</span> resource &quot;azurerm_storage_account&quot; &quot;import_example&quot; {
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>account_replication_type          = &quot;LRS&quot; <span style="color:yellow;">-&gt;</span> &quot;GRS&quot;
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>allow_blob_public_access          = true <span style="color:yellow;">-&gt;</span> false
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>is_hns_enabled                    = true <span style="color:yellow;">-&gt;</span> false <span style="color:red;"># forces replacement</span>
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>min_tls_version                   = &quot;TLS1_2&quot; <span style="color:yellow;">-&gt;</span> &quot;TLS1_0&quot;
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>nfsv3_enabled                     = true <span style="color:yellow;">-&gt;</span> false <span style="color:red;"># forces replacement</span>

      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>tags                              = {
          <span style="color:lime;">+</span> &quot;environment&quot; = &quot;staging&quot;
        }
    }

<span style="font-weight:bold;">Plan:</span> 1 to add, 0 to change, 1 to destroy.
<span style="filter: contrast(70%) brightness(190%);color:dimgray;">
─────────────────────────────────────────────────────────────────────────────</span>

Note: You didn't use the -out option to save this plan, so Terraform can't
guarantee to take exactly these actions if you run &quot;terraform apply&quot; now.
</pre>
{{< /raw >}}

    That is a more manageable set.

1. Update the main.tf to match

    OK, this is a **challenge** section where you will need to update the storage account resource block until you get a clean plan.

    To start you off, the first two changes are:

    1. Update account_replication_type to *LRS*
    1. Set allow_blob_public_access to *true*

    The `terraform state show` output is a great reference, as is the [documentation page](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account).

    Check on your progress by periodically saving the file and rerunning`terraform plan`. (You may notice that `terraform plan` also validates the files first.)

    If you get stuck then a working config is shown at the start of the next lab.

1. Confirm that *terraform plan* is clean

    ```shell
    terraform plan
    ```

    Expected output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">azurerm_resource_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_container_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.ContainerInstance/containerGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_storage_account.import_example: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.Storage/storageAccounts/richeney27182818]</span>

<span style="font-weight:bold;"></span><span style="font-weight:bold;color:lime;">No changes.</span><span style="font-weight:bold;"> Your infrastructure matches the configuration.</span>

Terraform has compared your real infrastructure against your configuration
and found no differences, so no changes are needed.
</pre>
{{< /raw >}}

1. Format the files

    Check that the formatting is as it should be.

    ```shell
    terraform fmt
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
main.tf
</pre>
{{< /raw >}}

## Summary

Importing resources is a little messy, but is a useful skill to have as a Terraform admin.

It can be a useful way to add in the config for complex resources. For example, the documentation for Azure Application Gateway is difficult to decipher given the range of options and possible configuration. You may find it simpler to provision the resource using the portal and then import the config.

In the next lab we will destroy the config and tidy up.
