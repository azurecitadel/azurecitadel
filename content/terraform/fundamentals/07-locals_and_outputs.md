---
title: "Locals and outputs"
date: 2021-04-06
slug: locals_and_outputs
draft: false
author: [ "Richard Cheney" ]
description: "Use locals and functions to generate a unique value, and add a couple of outputs."
weight: 7
menu:
  side:
    parent: terraform-basics
series:
 - terraform-basics
---

## Overview

In this lab you will

* work with `terraform console`
* use a local variable and functions
* add outputs for the FQDN and public IP address

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

    variable "prefix" {
      description = "Prefix string to ensure FQDNs are globally unique"
      type        = string
    }
    ```

* main.tf

    ```go
    resource "azurerm_resource_group" "basics" {
      name     = var.resource_group_name
      location = var.location
    }

    resource "azurerm_container_group" "example" {
      name                = var.container_group_name
      location            = azurerm_resource_group.basics.location
      resource_group_name = azurerm_resource_group.basics.name
      ip_address_type     = "Public"
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

* terraform.tfvars

    ```go
    location = "UK South"
    prefix = "richeney"
    ```

    > ⚠️ You should have specified a different value for *prefix*. You may have used a different value for *location*.

## Functions

In this section we will remove the var.prefix and instead use a substring of a predictable hash. This will give us sufficient random characters to add to properties such as FQDNs and be confident that they will be globally unique.

Using a hash substring is closer in behaviour to the commonly used *uniqueString()* function in ARM templates. The resourceId of a resource group is commonly used as a seed. It contains the subscription ID, so meets the uniqueness requirement, yet will always produce the same result in your config even if you were to destroy the environment and start again, which is a good fit for idempotency.

> If you wanted to have a newly generated random string each time then look at [random_id](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id), which is in the random provider available in the [Terraform Registry](https://registry.terraform.io/browse/providers).

OK, let's work out how to find the right function and

1. Search on "terraform functions" in your browser

    You should find the [Terraform Built-in Functions](https://www.terraform.io/language/functions) page.

    Feel free to browse the available functions.

1. Select the Hash and Crypto Functions
1. Select the *sha1* function

    The sha1 encryption is not the strongest from a security perspective, but we only need this to provide a hash from the given string.

The function call is `sha1("string")`.

## Terraform console

We now know the function and how to call it. Test it out in the Terraform console.

1. List the objects in state

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

    The correct Terraform identifier for the resource group is `azurerm_resource_group.basics`. You will need that later when working out how to get the resource ID for the resource group.

1. Open the Terraform console

    ```bash
    terraform console
    ```

    This is an interactive console which is ideal for testing expressions and interpolation and for interrogating the state.

    > Use `CTRL`+`D` at an empty prompt to exit the console. This is the end of file (EOF) character.

1. Test the *sha1* function

    ```bash
    sha1("This is a string")
    ```

    Expected hash:

    {{< raw >}}
<pre style="color:white; background-color:black">
"f72017485fbf6423499baf9b240daa14f5f095a1"
</pre>
{{< /raw >}}

    If you use the up arrow to recall the command you can see if will always return the same hash.

1. Find the resource ID attribute for the resource group

    Remember when you looked at the documentation page for azurerm_resource_group that id was one of the attributes.

    ```bash
    azurerm_resource_group.basics
    ```

    Example response:

    {{< raw >}}
<pre style="color:white; background-color:black">
{
  "id" = "/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics"
  "location" = "uksouth"
  "name" = "terraform-basics"
  "tags" = tomap({})
  "timeouts" = null /* object */
}
</pre>
{{< /raw >}}

1. Drill down to the id attribute

    ```bash
    azurerm_resource_group.basics.id
    ```

    Example response:

    {{< raw >}}
<pre style="color:white; background-color:black">
"/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics"
</pre>
{{< /raw >}}

    > Your response will contain a different subscription ID.

1. Retest *sha1* with the resourceId

    ```bash
    sha1(azurerm_resource_group.basics.id)
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
"c3818179c2946e2352e5210e826239e65f5c3396"
</pre>
{{< /raw >}}

    That is a little long. Eight characters should be sufficient to make it unique.

    > Your response will be different as your resource group ID contains a different subscription ID.

1. Find a suitable function

    💪 Mini **challenge**!

    Search for a Terraform function to take a substring.

    * What is the name of the function?
    * What are the three arguments?

1. Extract the first eight characters from the hash

    Enter the following into the `terraform console`:

    ```bash
    substr(sha1(azurerm_resource_group.basics.id), 0, 8)
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
"c3818179"
</pre>
{{< /raw >}}

    Your output will be unique to you. It will also be entirely predictable. We have the right expression.

1. Exit the console

    Use `CTRL`+`d` to leave the console prompt and go back to the shell.

The console is great for forming and testing expressions. We have settled on `substr(sha1(azurerm_resource_group.basics.id), 0, 8)` which will be used as a suffix. Let's declare the local.

## Locals

The variables we have been using so far are more accurately called input variables, i.e. `var.<variable_name>`. (Close to the *parameters* in ARM and Bicep templates.)

It is common to place more complex expression into locals so that the main resource and data source blocks are more readable. (Much like the *variables* in ARM and Bicep templates.)

We'll define a local variable for the unique value, and call it *uniq*. Local variables are defined in a locals block.

1. Add the following block to the top of your main.tf

    ```go
    locals {
      uniq = substr(sha1(azurerm_resource_group.basics.id), 0, 8)
    }
    ```

1. Modify value for dns_name_label

    Update the interpolation expression for dns_name_label in the azurerm_container_group resource:

    ```go
      dns_name_label = "${var.container_group_name}-${local.uniq}"
    ```

    > Note that locals are referenced as `local.<local_name>`.

1. Delete the prefix variable

    This is no longer required. Remove it from variables.tf and terraform.tfvars.

## Outputs

There are a couple of attributes whose values are unknown until they;ve been created. One is the public IPv4 address, and the other is the fully qualified domain name now that it is suffixed with the *uniq* local variable.

The convention with Terraform is to place all outputs in a file called outputs.tf. The lab will walk you through creating one and then you'll be challenged to do the other.

### ip_address

1. Open the console

    ```bash
    terraform console
    ```

1. Query the Azure Container Instance

    ```bash
    azurerm_container_group.example
    ```

1. Use dot notation to get the public IPv4 address

    ```bash
    azurerm_container_group.example.ip_address
    ```

    This should return you container instance's current public IP address.

1. Create a file called outputs.tf and add the following block

    ```go
    output "ip_address" {
      value = azurerm_container_group.example.ip_address
    }
    ```

### fqdn

OK, time for another little challenge section.

💪 **Challenge**: Add the *fqdn* output.

* Add another output, called *fqdn*
* Set the value to the azurerm_container_group's fqdn attribute, prefixed with `http://`.

## Terraform workflow

Run through the terraform workflow.

1. Format the files

    ```bash
    terraform fmt
    ```

1. Validate the config

    ```bash
    terraform validate
    ```

1. Check the plan

    ```bash
    terraform plan
    ```

    ⚠️ Note that the ACI will be deleted and recreated due to the name change.

1. Apply the changes

    ```bash
    terraform apply
    ```

    ℹ️ Note that the two values are now shown as outputs.

## Viewing outputs

* Display all outputs

    ```bash
    terraform output
    ```

* Display a single output

    ```bash
    terraform output fqdn
    ```

* Set a shell variable to an output value

    Bash:

    ```bash
    ip_address=$(terraform output -raw ip_address)
    ```

    Powershell:

    ```powershell
    $ip_address = (terraform output -raw ip_address)
    ```

* Read all objects as JSON / Powershell object

    This is slightly more advanced.

    If you are dealing with more complex arrays and objects tjen you can read the whole output into a JSON string in Bash, or an object in PowerShell.

    You can then view the whole object, or drill in using jq and object dot notation respectively.

    Bash:

    ```bash
    outputs=$(terraform output -json)
    jq -Mc . <<< $outputs
    jq . <<< $outputs
    jq -r .ip_address.value <<< $outputs
    ```

    Powershell:

    ```powershell
    $outputs = (terraform output -json | ConvertFrom-Json)
    $outputs
    $outputs | ConvertTo-Json
    ($outputs).ip_address.value
    ```

## Summary

You have started to use the Terraform console, and made use of locals and outputs.

You will use both of these more and more as your Terraform code becomes more ambitious. Locals are important for readability as the expressions become more complex. Outputs are useful at this level, but become far more important when you start creating your own modules.

In the next section we will manipulate state a little using imports, refresh, renames and taints.
