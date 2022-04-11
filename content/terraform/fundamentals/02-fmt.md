---
title: "Format"
date: 2021-02-16
slug: fmt
draft: false
author: [ "Richard Cheney" ]
description: "Create a variables.tf and main.tf. Use `terraform fmt` to automatically format the files."
weight: 2
menu:
  side:
    parent: 'terraform-basics'
series:
 - terraform-basics
layout: single

---

## Overview

In this lab you will

* create a variables.tf and a main.tf
* use `terraform fmt` to tidy them up

## Open the editor

1. Open the [Cloud Shell](https://shell.azure.com)

    Authenticate and check you are in the right subscription.

1. Change to your working directory

    ```shell
    cd ~/terraform-basics
    ```

1. Create empty variables.tf and main.tf files

    ```shell
    touch variables.tf main.tf
    ```

    The touch command updates the modified timestamp on linux files. If the file does not exists then it also creates files.

1. Open the Monaco editor

    ```shell
    code .
    ```

    Using `code .` opens the current working directory.

## main.tf

Create the initial main.tf.

1. Copy the code block

    ```go
    resource azurerm_resource_group basics {
    name = var.name
    location="West Europe"
    }
    ```

1. Select the main.tf file in the editor's file browser
1. Paste
1. Save the file

## terraform fmt

The format used within Terraform files is called HashiCorp Configuration Language or HCL for short. The formatting of these files is very standardised and  has been hardcoded into the terraform binary itself. (It is based on the principles of gofmt, which is not that surprising as terraform is written in Go.)

1. Run `terraform fmt`

    ```shell
    terraform fmt
    ```

    The command will find all valid *.tf files in the current working directory and will format them correctly.

    The command outputs the filenames of any modified files.

1. Reselect the main.tf

    Click on the main.tf filename in the editor's file browser.

    The file should now have indentation, alignment and the resource type and name are now quoted correctly.

    Example:

    ```go
    resource "azurerm_resource_group" "basics" {
      name     = "terraform-basics"
      location = "West Europe"
    }
    ```

## Create a variables.tf

1. Copy and paste into variables.tf

    ```go
    variable "resource_group_name" {
      description = "Name for the resource group"
      type        = "string"
      default     = "terraform-basics"
    }
    ```

1. Save the file

1. Rerun `terraform fmt` and reselect the file in the editor.

    ```shell
    terraform fmt
    ```

    > The up cursor key recalls previous commands.

    You'll see the value for the type argument, `string` does not need quotes.

    Variables can be strings, booleans, numbers or more complex types. We'll cover [variables](https://www.terraform.io/language/values/variables) in more depth later.

## Summary

We have reached the end of the lab. You have created a couple of files and used terraform fmt to fix common formatting issues.

Move onto the next lab and we'll customise and validate the files.
