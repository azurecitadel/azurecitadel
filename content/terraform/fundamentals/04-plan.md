---
title: "Plan"
date: 2021-02-16
slug: plan
draft: false
author: [ "Richard Cheney" ]
description: "Start working with terraform.tfvars to specify your variable values and then use `terraform plan` to display the actions that Terraform will take."
weight: 4
menu:
  side:
    parent: 'terraform-basics'
series:
 - terraform-basics
layout: single

---

## Overview

In this lab you will

* create a terraform.tfvars
* specify the value for location
* display a plan

## Starting point

Your files should currently look like this:

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

    ```

* main.tf

    ```go
    resource "azurerm_resource_group" "basics" {
      name     = var.resource_group_name
      location = var.location
    }
    ```

## terraform.tfvars

The variables.tf file has been used to **declare** the variables, including their type and default values. A more complete configuration may add information such as a description and validation criteria.

When planning a deployment then you usually **specify** the values for those variables using a terraform.tfvars file.

> There are other ways of specifying [variables](https://www.terraform.io/language/values/variables#assigning-values-to-root-module-variables), such as via command line arguments, environment variables and *.auto.tfvars files.

1. Create a terraform.tfvars file

    ```bash
    touch terraform.tfvars
    ```

1. Click on the refresh icon in the editor's file explorer

1. Specify the location

    ⚠️ **Change the value of location to your local region.**

    > If that region is West Europe then specify North Europe.

    In the example below I have used my local region:

    ```bash
    location = "UK South"
    ```

    > Note that the value of the resource_group_name is not specified and will default to `terraform-basics` as per the variables.tf file.

1. Close the editor

## terraform plan

1. Run `terraform plan`

    This is one of the most commonly used terraform commands, and shows which resources will be create, destroyed, modified or recreated.

    ```bash
    terraform plan
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">

Terraform used the selected providers to generate the following execution
plan. Resource actions are indicated with the following symbols:
  <span style="color:lime;">+</span> create

Terraform will perform the following actions:

<span style="font-weight:bold;">  # azurerm_resource_group.basics</span> will be created
  <span style="color:lime;">+</span> resource &quot;azurerm_resource_group&quot; &quot;basics&quot; {
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>id       = (known after apply)
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>location = &quot;uksouth&quot;
      <span style="color:lime;">+</span> <span style="font-weight:bold;"></span>name     = &quot;terraform-basics&quot;
    }

<span style="font-weight:bold;">Plan:</span> 1 to add, 0 to change, 0 to destroy.
<span style="filter: contrast(70%) brightness(190%);color:dimgray;">
─────────────────────────────────────────────────────────────────────────────</span>

Note: You didn't use the -out option to save this plan, so Terraform can't
guarantee to take exactly these actions if you run &quot;terraform apply&quot; now.
</pre>
{{< /raw >}}

    The output shows that the resource group will be created.

## Summary

You have started using the terraform.tfvar and have displayed the output from `terraform plan`.

In the next lab we will finally create something and will then explore the state file.
