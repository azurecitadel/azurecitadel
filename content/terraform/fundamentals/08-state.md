---
title: "Managing state"
date: 2021-04-06
slug: state
draft: false
author: [ "Richard Cheney" ]
description: "Common lifecycle management areas that deal with state with refresh, ignore, move and taint."
weight: 8
menu:
  side:
    parent: 'terraform-basics'
series:
 - terraform-basics
layout: single

---

## Overview

One of Terraform's strengths is lifecycle management. Knowing how to work with the Terraform state is important.

In this lab you will

* refresh the local state file
* learn how to tolerate certain changes using lifecycle ignore
* fix Terraform identification issues with move
* taint a single resource to force a recreation

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
    }

    resource "azurerm_container_group" "example" {
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

    ```bash
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

    ```bash
    terraform state show azurerm_resource_group.basics
    ```

    Unsurprisingly, the output is unchanged. It is only a JSON text file.

1. Refresh the state file

    ```bash
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

    ```bash
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

    The state file is now up to date. It can be beneficial for state to be kept current, particularly if you are using read only remote states or extracting values via scripting.

    > You may find that running a `terraform plan` soon after a `terraform apply` shows some additional detail that is not in state such as the formation of empty arrays and lists etc. The plan will alert you to this and prompts you to run `terraform apply --refresh-only` to fully sync up.

## Handling changes

Ideally, the resource groups managed by Terraform will not be subject to manual changes. However, in the real world this is a common occurrence and you may need to update the config to handle it.

Let's use a common example, to see the impact when someone adds a new tag.

1. Run a plan

    ```bash
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

    If you were to run `terraform apply` now, then Terraform would remove the *source* tag and make sure the environment matches the definition in the config files.

    ℹ️ **This is declarative infrastructure as code, so reverting "drift" to match the files is expected behaviour.**

    You have three options

    1. **Revert**: Run `terraform apply` and revert the manual change
    1. **Update**: Add the **source** tag and value into the config
    1. **Ignore**: Update the config to ignore certain changes, i.e. tag updates

### Update

The second approach is to update the files to match the reality. The aim is to update the config to the point where a `terraform plan` shows that there are no changes to be made.

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

    ```bash
    terraform plan
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">azurerm_resource_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_container_group.example: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.ContainerInstance/containerGroups/terraform-basics]</span>

<span style="font-weight:bold;"></span><span style="font-weight:bold;color:lime;">No changes.</span><span style="font-weight:bold;"> Your infrastructure matches the configuration.</span>

Terraform has compared your real infrastructure against your configuration
and found no differences, so no changes are needed.
</pre>
{{< /raw >}}

### Ignore

The other approach is to force Terraform to ignore certain resource attributes using [lifecycle](https://www.terraform.io/language/meta-arguments/lifecycle) blocks.S

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

1. Confirm that no changes will be made

    ```bash
    terraform plan
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">azurerm_resource_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_container_group.example: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.ContainerInstance/containerGroups/terraform-basics]</span>

<span style="font-weight:bold;"></span><span style="font-weight:bold;color:lime;">No changes.</span><span style="font-weight:bold;"> Your infrastructure matches the configuration.</span>

Terraform has compared your real infrastructure against your configuration
and found no differences, so no changes are needed.
</pre>
{{< /raw >}}

    > The process where the plan creates an in-memory state from the provider calls and then compares against the config files is called a *diff*. The ignore statements specifies any attributes to be excluded from the diff.

## Renaming

Sometimes you need to tweak the Terraform identifiers. It may be a straight rename, a shift from a single resource to using *count* or *for_each* or moving something to and from a module. This section will go through a simple example.

1. Check for a clean plan

    ```bash
    terraform plan
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">azurerm_resource_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_container_group.example: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.ContainerInstance/containerGroups/terraform-basics]</span>

<span style="font-weight:bold;"></span><span style="font-weight:bold;color:lime;">No changes.</span><span style="font-weight:bold;"> Your infrastructure matches the configuration.</span>

Terraform has compared your real infrastructure against your configuration
and found no differences, so no changes are needed.
</pre>
{{< /raw >}}

1. List out the identifiers in state

    ```bash
    terraform state list
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
azurerm_container_group.example
azurerm_resource_group.basics
</pre>
{{< /raw >}}

    We will change the *azurerm_container_group.example* to *azurerm_container_group.basics*.

1. Update main.tf

    Change the label for the azurerm_container_group identifier from **"example"** to **"basics"**.

1. Rerun plan

   ```bash
   terraform plan
   ```

   You should see validation errors. Refactor the two outputs.

1. Rerun plan

   ```bash
   terraform plan
   ```

   You should see the container group will be deleted and recreated.

   ⚠️ ***Do not run*** `terraform apply`***!!***

1. Rename the identifier in state

    The move command is `terraform state mv <source> <dest>`.

    ```bash
    terraform state mv azurerm_container_group.example azurerm_container_group.basics
    ```

    {{< raw >}}
<pre style="color:white; background-color:black">
Move &quot;azurerm_container_group.example&quot; to &quot;azurerm_container_group.basics&quot;
Successfully moved 1 object(s).
</pre>
{{< /raw >}}

    > Hint: If you are specifying a for_each identifier, then escape the quotes, e.g. `azurerm_resource_name.example[\"name\"]`.

1. Check for a clean plan

    ```bash
    terraform plan
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">azurerm_resource_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_container_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.ContainerInstance/containerGroups/terraform-basics]</span>

<span style="font-weight:bold;"></span><span style="font-weight:bold;color:lime;">No changes.</span><span style="font-weight:bold;"> Your infrastructure matches the configuration.</span>

Terraform has compared your real infrastructure against your configuration
and found no differences, so no changes are needed.
</pre>
{{< /raw >}}

## Tainting

You may find a situation when one of your resources has failed. Or you may wish for it to be recreated, but Terraform sees no need to do so based on the config files. (For example if you have changed the contents of a script uri.)

If so, then use `terraform taint` to force the resource to be recreated.

1. Check for a clean plan

    ```bash
    terraform plan
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">azurerm_resource_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_container_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.ContainerInstance/containerGroups/terraform-basics]</span>

<span style="font-weight:bold;"></span><span style="font-weight:bold;color:lime;">No changes.</span><span style="font-weight:bold;"> Your infrastructure matches the configuration.</span>

Terraform has compared your real infrastructure against your configuration
and found no differences, so no changes are needed.
</pre>
{{< /raw >}}

1. List out the identifiers

    ```bash
    terraform state list
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
azurerm_container_group.basics
azurerm_resource_group.basics
</pre>
{{< /raw >}}

1. Taint the container group

    Force the container group to be recreated as an example.

    ```bash
    terraform taint azurerm_container_group.basics
    ```

    {{< raw >}}
<pre style="color:white; background-color:black">
Resource instance azurerm_container_group.basics has been marked as tainted.
</pre>
{{< /raw >}}

1. Plan

    ```bash
    terraform plan
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">azurerm_resource_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics]</span>
<span style="font-weight:bold;">azurerm_container_group.basics: Refreshing state... [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.ContainerInstance/containerGroups/terraform-basics]</span>

Terraform used the selected providers to generate the following execution
plan. Resource actions are indicated with the following symbols:
<span style="color:red;">-</span>/<span style="color:lime;">+</span> destroy and then create replacement

Terraform will perform the following actions:

<span style="font-weight:bold;">  # azurerm_container_group.basics</span> is tainted, so must be <span style="font-weight:bold;"></span><span style="font-weight:bold;color:red;">replaced</span>
<span style="color:red;">-</span>/<span style="color:lime;">+</span> resource &quot;azurerm_container_group&quot; &quot;basics&quot; {
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>exposed_port        = [
          <span style="color:red;">-</span> {
              <span style="color:red;">-</span> port     = 80
              <span style="color:red;">-</span> protocol = &quot;TCP&quot;
            },
        ] <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>fqdn                = &quot;terraform-basics-c3818179.uksouth.azurecontainer.io&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>id                  = &quot;/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics/providers/Microsoft.ContainerInstance/containerGroups/terraform-basics&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>ip_address          = &quot;20.108.130.109&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
      <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>ip_address_type     = &quot;Public&quot; <span style="color:yellow;">-&gt;</span> &quot;public&quot;
        <span style="font-weight:bold;"></span>name                = &quot;terraform-basics&quot;
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>tags                = {} <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
        <span style="filter: contrast(70%) brightness(190%);color:dimgray;"># (5 unchanged attributes hidden)</span>

      <span style="color:yellow;">~</span> container {
          <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>commands                     = [] <span style="color:yellow;">-&gt;</span> (known after apply)
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>environment_variables        = {} <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
            <span style="font-weight:bold;"></span>name                         = &quot;inspectorgadget&quot;
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>secure_environment_variables = (sensitive value)
            <span style="filter: contrast(70%) brightness(190%);color:dimgray;"># (3 unchanged attributes hidden)</span>

            <span style="filter: contrast(70%) brightness(190%);color:dimgray;"># (1 unchanged block hidden)</span>
        }
    }

<span style="font-weight:bold;">Plan:</span> 1 to add, 0 to change, 1 to destroy.

<span style="font-weight:bold;">Changes to Outputs:</span>
  <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>fqdn       = &quot;http://terraform-basics-c3818179.uksouth.azurecontainer.io&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
  <span style="color:yellow;">~</span> <span style="font-weight:bold;"></span>ip_address = &quot;20.108.130.109&quot; <span style="color:yellow;">-&gt;</span> (known after apply)
<span style="filter: contrast(70%) brightness(190%);color:dimgray;">
─────────────────────────────────────────────────────────────────────────────</span>

Note: You didn't use the -out option to save this plan, so Terraform can't
guarantee to take exactly these actions if you run &quot;terraform apply&quot; now.
</pre>
{{< /raw >}}

1. Apply

    ```bash
    terraform apply --auto-approve
    ```

    The Azure Container Instance will be recreated.

## Summary

Terraform can make life simpler in terms of lifecycle management and seeing the planned impact of configuration changes, but it is useful to know how to use the tools to manage these scenarios.

In the next lab we will handle the import of a resource that has been created outside of Terraform and bring it into state safely.
