---
title: "Working with state"
date: 2021-04-06
slug: state
draft: true
author: [ "Richard Cheney" ]
description: "Manipulate state with refresh, import, move and taint."
weight: 8
menu:
  side:
    parent: 'terraform-basics'
series:
 - terraform-basics
layout: single

---

## Overview

In this lab you will

* refresh the local state file
* import a resource that was manually created in the portal
* rename nodes in the state file to avoid unnecessary deletions
* taint a single resource to force a recreation

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
    }

    resource "azurerm_container_group" "example" {
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
      value = azurerm_container_group.example.ip_address
    }

    output "fqdn" {
      value = "http://${azurerm_container_group.example.fqdn}"
    }
    ```

* terraform.tfvars

    ```go
    location = "UK South"

    ```

    > You may have set a different value for *location*.

## Refresh

Running `terraform plan` or `terraform apply` forces the azurerm provider to communicate with Azure to get the current state. This is stored in memory for the comparison ("diff") against the config files and determine what (if anything) needs to be done.

You can always update the local state file (terraform.tfstate) using `terraform refresh`. Let's see it in action.

1. Check the current state for the resource group

    ```shell
    terraform state show azurerm_resource_group.basics
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;"># azurerm_resource_group.basics:
resource &quot;azurerm_resource_group&quot; &quot;basics&quot;</span> {
    id       = &quot;/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics&quot;
    location = &quot;uksouth&quot;
    name     = &quot;terraform-basics&quot;
    tags     = {}
}
</pre>
{{< /raw >}}

1. Add a tag in the portal

    Open the [Azure portal](https://portal.azure.com), find the resource group and add a tag: **source = terraform**

    ![Tagging in the portal](/terraform/fundamentals/images/source_tag.png)

1. Redisplay the state

    ```shell
    terraform state show azurerm_resource_group.basics
    ```

    Unsurprisingly, the output is unchanged. It is only a JSON text file.

1. Refresh the state file

    ```shell
    terraform refresh
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">azurerm_resource_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_container_group.example: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.ContainerInstance/containerGroups/terraform-basics]</span>
<span style="font-weight:bold;"></span><span style="font-weight:bold;color:lime;">
Outputs:

</span>fqdn = &quot;http://terraform-basics-c3818179.uksouth.azurecontainer.io&quot;
ip_address = &quot;20.108.130.109&quot;
</pre>
    {{< /raw >}}

1. Display the updated state

    ```shell
    terraform state show azurerm_resource_group.basics
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;"># azurerm_resource_group.basics:
resource &quot;azurerm_resource_group&quot; &quot;basics&quot;</span> {
    id       = &quot;/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics&quot;
    location = &quot;uksouth&quot;
    name     = &quot;terraform-basics&quot;
    tags     = {
        "source" = "terraform"
    }
}
</pre>
{{< /raw >}}

    The state file is now up to date.

## Handling updates

Ideally, the resource groups managed by Terraform will not be subject to manual changes. However, in the real world this is a common occurrence and you will need to update the config to handle it.

Let's see the impact of the new tag.

1. Run a plan

    ```shell
    terraform plan
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">azurerm_resource_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_container_group.example: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.ContainerInstance/containerGroups/terraform-basics]</span>

Terraform used the selected providers to generate the following execution
plan. Resource actions are indicated with the following symbols:
  <span style="color:yellow;">~</span> update in-place

Terraform will perform the following actions:

<span style="font-weight:bold;">  # azurerm_resource_group.basics</span> will be updated in-place
  <span style="color:yellow;">~</span> resource &quot;azurerm_resource_group&quot; &quot;basics&quot; {
        <span style="font-weight:bold;"></span>id       = &quot;/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics&quot;
        <span style="font-weight:bold;"></span>name     = &quot;terraform-basics&quot;
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>tags     = {
          <span style="color:red;">-</span> &quot;source&quot; = &quot;terraform&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
        }
        <span style="filter: contrast(70%) brightness(190%);color:dimgray;"># (1 unchanged attribute hidden)</span>
    }

<span style="font-weight:bold;">Plan:</span> 0 to add, 1 to change, 0 to destroy.
<span style="filter: contrast(70%) brightness(190%);color:dimgray;">
─────────────────────────────────────────────────────────────────────────────</span>

Note: You didn't use the -out option to save this plan, so Terraform can't
guarantee to take exactly these actions if you run &quot;terraform apply&quot; now.
</pre>
{{< /raw >}}

    If you were to run `terraform apply` now, then Terraform will remove the tag and make sure the environment matches the definition in the config files.

    **This is declarative infrastructure as code, so reverting "drift" to match the files is expected behaviour.**

    You have three options

    1. Run `terraform apply` and revert the manual change
    1. Add the tag definition into the files
    1. Ignore certain changes

### Update the config to match

OK, one approach is to update the files to match the reality. The aim is to get to the point where a `terraform plan` shows that there are no changes to be made.

1. Add the tag

    Update your main.tf and add the tag to the resource group block

    Example updated resource block:

    ```go
    resource "azurerm_resource_group" "basics" {
      name     = var.resource_group_name
      location = var.location

      tags = {
        source = "terraform"
      }
    }
    ```

1. Check for a clean plan

   ```shell
   terraform plan
   ```

   {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">azurerm_resource_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_container_group.example: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.ContainerInstance/containerGroups/terraform-basics]</span>

<span style="font-weight:bold;"></span><span style="font-weight:bold;color:lime;">No changes.</span><span style="font-weight:bold;"> Your infrastructure matches the configuration.</span>

Terraform has compared your real infrastructure against your configuration
and found no differences, so no changes are needed.
</pre>
{{< /raw >}}

### Ignore changes

The other approach is to force Terraform to ignore certain resource attributes using [lifecycle](https://www.terraform.io/language/meta-arguments/lifecycle) blocks.

1. Revert the resource group block

    Remove the tags argument in the resource group block.

    Reverted resource group block:

    ```go
    resource "azurerm_resource_group" "basics" {
      name     = var.resource_group_name
      location = var.location
    }
    ```

    > A `terraform plan` would now display a planned in-place update.

1. Ignore changes to tags

    Add in a lifecycle ignore block to the resource group.

    ```go
    resource "azurerm_resource_group" "basics" {
      name     = var.resource_group_name
      location = var.location

      lifecycle {
        ignore_changes = [
          tags,
        ]
      }
    }
    ```

    > It is very common to see ignore blocks for tags. Tags are commonly updated manually, or via Azure Policies with modify effects.
    >
    > Another example if Azure Application Gateway if being used as an Application Gateway Ingress Controller (AGIC) by AKS. In this configuration the App Gateway is reconfigured dynamically using Kubernetes annotations.

## Import

**YOU ARE HERE**

## Summary

You have started to use the Terraform console, and made use of locals and outputs.

Being able to navigate the documentation is a key skill. You will also find plenty of sample configurations and blog pages for Terraform.

Finally, check the documentation for the [Azure Resource Manager REST APIs](https://docs.microsoft.com/rest/api/resources/) as they can sometimes add insight where the resources closely match the properties in the REST API calls.

In the next lab we will add another provider, use locals and add an output.
