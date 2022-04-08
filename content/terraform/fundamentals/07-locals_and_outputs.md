---
title: "Locals and outputs"
date: 2021-04-06
slug: locals_and_outputs
draft: true
author: [ "Richard Cheney" ]
description: "Use locals and functions to generate a unique value, and add a couple of outputs."
weight: 7
menu:
  side:
    parent: 'terraform-basics'
series:
 - terraform-basics
layout: single

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

    variable "prefix" {
      description = "Prefix string to ensure FQDNs are globally unique"
      type        = string
      default     = "richeney"
    }

    ```

    > ⚠️ You should have a different default value for *prefix*.

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

* terraform.tfvars

    ```go
    location = "UK South"

    ```

    > You may have set a different value for *location*.

## Using the console

In this section we will remove the var.prefix and instead use a substring of a predictable hash. This will give us sufficient random characters to add to properties such as FQDNs and be confident that they will be globally unique.

We could use one of the other providers in the [Terraform Registry](https://registry.terraform.io/browse/providers) such as [random_id](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/id), but using a predictable hash is closer in behaviour to the commonly used *uniqueString()* function in ARM templates. The resourceId of a resource group is commonly used as a seed.

1. Search on "terraform functions" in your browser

    You should find the [Terraform Built-in Functions](https://www.terraform.io/language/functions) page.

    Feel free to browse the available functions.

1. Select the Hash and Crypto Functions
1. Select the *sha1* function

    The sha1 encryption is not the strongest from a security perspective, but we only need this to provide a hash from the given string.

    The format is `sha1("string")`.

1. List the objects in state

    ```shell
    terraform state list
    ```

    Output:

    ```text
    azurerm_container_group.example
    azurerm_resource_group.basics
    ```

1. Open the Terraform console

    ```shell
    terraform console
    ```

    This is an interactive console which is ideal for testing expressions and interpolation and for interrogating the state.

    > You use `CTRL`+`D` to exit the console.

1. Test the *sha1* function

    ```shell
    sha1("This is a string")
    ```

    Expected hash:

    ```json
    "f72017485fbf6423499baf9b240daa14f5f095a1"
    ```

    If you use the up arrow to recall the command you can see if will always return the same hash.

1. Find the resource ID attribute for the resource group

    Remember when you looked at the documentation page for azurerm_resource_group that id was one of the attributes.

    ```shell
    azurerm_resource_group.basics
    ```

    Example response:

    ```json
    {
      "id" = "/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics"
      "location" = "uksouth"
      "name" = "terraform-basics"
      "tags" = tomap({})
      "timeouts" = null /* object */
    }
    ```

1. Drill down to the id attribute

    ```shell
    azurerm_resource_group.basics.id
    ```

    Example response:

    ```json
    "/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics"
    ```

1. Retest *sha1* with the resourceId

    ```shell
    sha1(azurerm_resource_group.basics.id)
    ```

    Example output:

    ```json
    "c3818179c2946e2352e5210e826239e65f5c3396"
    ```

    That is a little long. Eight characters should be sufficient to make it unique.

1. Find a suitable function

    Search for a Terraform function to take a substring.

    * What is the name of the function?
    * What are the three arguments?

1. Extract the first eight characters from the hash

    Enter the following into the `terraform console`:

    ```shell
    substr(sha1(azurerm_resource_group.basics.id), 0, 8)
    ```

    Example output:

    ```json
    "c3818179"
    ```

    Success!

1. Exit the console

    Use `CTRL`+`d` to leave the console prompt and go back to the shell.

You have used the console for some simple expressions. OK, so `substr(sha1(azurerm_resource_group.basics.id), 0, 8)` is the expression we want to use as a suffix. Let's declare the local.

## Locals

The variables we have been using so far are more accurately called input variables, i.e. `var.<variable_name>`. In terms of ARM or Bicep templates they would be called parameters.

It is common to place more complex expression into locals so that the main resource and data source blocks are more readable.

We'll define a local variable for the unique value, and call it *uniq*. Local variables are defined in a locals block.

1. Add the following block to the top of your main.tf

    ```go
    locals {
      uniq = sha1(azurerm_resource_group.basics.id)
    }
    ```

1. Modify value for dns_name_label

    Update the interpolation expression for dns_name_label in the azurerm_container_group resource:

    ```go
      dns_name_label = "${var.container_group_name}-${local.uniq}"
    ```

    > Note that locals are referenced as `local.<local_name>`.

1. Delete the prefix variable

    This is no longer required.

## Outputs

There are a couple of attributes whose values are unknown until they;ve been created. One is the public IPv4 address, and the other is the fully qualified domain name now that it is suffixed with the *uniq* local variable.

The convention with Terraform is to place all outputs in a file called outputs.tf. The lab will walk you through creating one and then you'll be challenged to do the other.

### ip_address

1. Open the console

    ```shell
    terraform console
    ```

1. Query the Azure Container Instance

    ```shell
    azurerm_container_group.example
    ```

1. Use dot notation to get the public IPv4 address

    ```shell
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

OK, time for another little **challenge** section.

* Add another output, called *fqdn*.
* Set the value to the azurerm_container_group's fqdn attribute, prefixed with `http://`.

## Terraform workflow

1. Run through the terraform workflow

    ```shell
    terraform fmt
    ```

    ```shell
    terraform validate
    ```

    ```shell
    terraform plan
    ```

    ⚠️ Note that the ACI will be deleted and recreated due to the name change.

    ```shell
    terraform apply
    ```

    ℹ️ Note that the two values are now shown as outputs.

## Viewing outputs

* Display all outputs

    ```shell
    terraform output
    ```

* Display a single output

    ```shell
    terraform output fqdn
    ```

* Set a shell variable to an output value

    Bash:

    ```shell
    ip_address=$(terraform output -raw ip_address)
    ```

    Powershell:

    ```powershell
    $ip_address = (terraform output -raw ip_address)
    ```

* Read all objects as JSON / Powershell object

    This is slightly more advanced, but can be useful when dealing with arrays and objects.

    Bash:

    ```bash
    outputs=$(terraform output -json)
    jq -r .ip_address.value <<< $outputs
    ```

    Powershell:

    ```powershell
    $outputs = (terraform output -json | ConvertFrom-Json)
    ($outputs).ip_address.value
    ```

## Summary

You have started to use the Terraform console, and made use of locals and outputs.

In the next section we will manipulate state a little using imports, refresh, renames and taints.
