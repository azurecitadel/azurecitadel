---
title: "Destroy"
date: 2021-04-06
slug: destroy
draft: true
author: [ "Richard Cheney" ]
description: "Short lab to tear down the environment."
weight: 9
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

## Commenting

You can comment a single line in a Terraform file using either hash (`#`) or double slash ('//'`).

You can comment a block by surrounding it with `/*` and `*/`.

# **YOU ARE HERE**

Comment out the storage account, `terraform plan`.

## terraform destroy

We'll finish with a command that you will use rarely in production. The `terraform destroy` command will update state, show the current resources and remove any defined in your files.



## Summary

You have started to use the Terraform console, and made use of locals and outputs.

Being able to navigate the documentation is a key skill. You will also find plenty of sample configurations and blog pages for Terraform.

Finally, check the documentation for the [Azure Resource Manager REST APIs](https://docs.microsoft.com/rest/api/resources/) as they can sometimes add insight where the resources closely match the properties in the REST API calls.

In the next lab we will add another provider, use locals and add an output.
