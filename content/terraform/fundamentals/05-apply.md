---
title: "Apply"
date: 2021-04-06
slug: apply
draft: false
author: [ "Richard Cheney" ]
description: "Apply your configuration to create resources and then examine the state file."
weight: 5
menu:
  side:
    parent: 'terraform-basics'
series:
 - terraform-basics
layout: single

---

## Overview

In this lab you will

* apply your configuration
* create the resource group
* view the state file

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

* terraform.tfvars

    ```go
    location = "UK South"

    ```

    > You may have set a different value for *location*.

## terraform apply

1. Apply the configuration

    ```bash
    terraform apply
    ```

    Running `terraform apply` will repeat the output of the `terraform plan` command.

    Type `yes` when prompted for approval.

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

<span style="font-weight:bold;">Do you want to perform these actions?</span>
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  <span style="font-weight:bold;">Enter a value:</span> yes

<span style="font-weight:bold;">azurerm_resource_group.basics: Creating...
azurerm_resource_group.basics: Creation complete after 0s [id=/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics]

<span style="color:lime;">Apply complete! Resources: 1 added, 0 changed, 0 destroyed.</span>
</pre>
{{< /raw >}}

    The resource group has been successfully created.

## State files

Once Terraform has applied changes then it stores the current state as JSON in a file called terraform.tfstate.

1. List the resources in the state file

    ```bash
    terraform state list
    ```

    Expected output:

    {{< raw >}}
<pre style="color:white; background-color:black">
azurerm_resource_group.basics
</pre>
{{< /raw >}}

    Note that the ident used for the Terraform resources is based in the resource type and the chosen name, i.e. `azurerm_resource_group.basics`. This needs to be unique for all resources in the state file.

1. Display the attributes for a resource

    ```bash
    terraform state show azurerm_resource_group.basics
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;"># azurerm_resource_group.basics:
resource &quot;azurerm_resource_group&quot; &quot;basics&quot; </span> {
    id       = &quot;/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics&quot;
    location = &quot;uksouth&quot;
    name     = &quot;terraform-basics&quot;
    tags     = {
        &quot;source&quot; = &quot;terraform&quot;
    }
}
</pre>
{{< /raw >}}

1. View the state file

    ```bash
    jq . < terraform.tfstate
    ```

    Example output:

    ```json
    {
      "version": 4,
      "terraform_version": "1.1.7",
      "serial": 3,
      "lineage": "cc8db995-1d56-819c-9245-347f393a6ee1",
      "outputs": {},
      "resources": [
        {
          "mode": "managed",
          "type": "azurerm_resource_group",
          "name": "basics",
          "provider": "provider[\"registry.terraform.io/hashicorp/azurerm\"]",
          "instances": [
            {
              "schema_version": 0,
              "attributes": {
                "id": "/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/resourceGroups/terraform-basics",
                "location": "uksouth",
                "name": "terraform-basics",
                "tags": null,
                "timeouts": null
              },
              "sensitive_attributes": [],
              "private": "eyJlMmJmYjczMC1lY2FhLTExZTYtOGY4OC0zNDM2M2JjN2M0YzAiOnsiY3JlYXRlIjo1NDAwMDAwMDAwMDAwLCJkZWxldGUiOjU0MDAwMDAwMDAwMDAsInJlYWQiOjMwMDAwMDAwMDAwMCwidXBkYXRlIjo1NDAwMDAwMDAwMDAwfX0="
            }
          ]
        }
      ]
    }
    ```

    The state file is in JSON format and includes more information used by Terraform to version resources and maintain dependencies.

    ⚠️ You should never modify the terraform.tfstate file directly. You can irrevocably corrupt the state file.

## Summary

You applied the config and viewed the resource in the state file.

In later labs you will use remote state to protect the state file and enable locks so that multiple admins can use the remote state safely.

In the next lab you will add a resource to the config using the documentation.
