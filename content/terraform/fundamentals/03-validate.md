---
title: "Validate"
date: 2021-02-16
slug: validate
draft: true
author: [ "Richard Cheney" ]
description: "Use `terraform validate` to confirm that the files are syntactically and logically sound. Add a new variable to variables.tf."
weight: 3
menu:
  side:
    parent: 'terraform-basics'
series:
 - terraform-basics
layout: single

---

## Overview

In this lab you will

* validate the syntax and logical consistency in the files
* add an additional variable

## Starting point

Your files should currently look like this:

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
    ```

* main.tf

    ```hcl
    resource "azurerm_resource_group" "basics" {
      name     = var.name
      location = "West Europe"
    }
    ```

## terraform validate

1. Run `terraform validate`

    The terraform validate command checks for syntax errors or internal logical inconsistencies in the files.

    ```shell
    terraform validate
    ```

    > Note that terraform validate only looks at the content of the files. It does not reach into the providers to check if the arguments and value are valid.

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="color:red;">
╷
│ Error:</span> Reference to undeclared input variable
<span style="color:red;">│</span>
<span style="color:red;">|</span>   on main.tf line 2, in resource "azurerm_resource_group" "basics":
<span style="color:red;">│</span>    2:   name     = var.name
<span style="color:red;">│</span>
<span style="color:red;">│</span> An input variable with the name "name" has not been declared.
<span style="color:red;">│</span> This variable can be declared with a variable "name" {} block.
<span style="color:red;">╵</span>
</pre>
{{< /raw >}}

    The command has correctly confirmed that there is an inconsistency in the variable name.

1. Edit main.tf
1. Correct the variable name to `var.resource_group_name`
1. Revalidate

    ```shell
    terraform validate
    ```

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="color:lime;"></span><span style="font-weight:bold;color:lime;">Success!</span> The configuration is valid.
</pre>
{{< /raw >}}

## Add a variable

Up to this point you could progress by simply copying the code blocks and following the instructions, but now it is time to deal with the first **challenge section**!

Update the configuration to match the requirements below.

* Create a new variable named **location**
* Default the value to **West Europe**
* Add a description for the variable: **Azure region**
* Update the resource group to use the location variable
* Format and validate your files

This challenge is fairly simple, but if you do get stuck then the start of the next lab will show a valid configuration.

## Summary

We have reached the end of the lab. You have added a second variable to the configuration and used the `terraform validate` command to check for validity and consistency.

Move onto the next lab and we'll specify variables and plan the deployment.
