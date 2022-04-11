---
title: "Initialise"
date: 2021-02-16
slug: init
draft: false
author: [ "Richard Cheney" ]
description: "Use `terraform init` to initialise a terraform environment, downloading providers and modules."
weight: 1
menu:
  side:
    parent: 'terraform-basics'
series:
 - terraform-basics
layout: single
---

## Overview

In this short lab you will

* create a provider.tf in Cloud Shell
* use the `terraform init` command to download the azurerm provider locally

## Create a provider.tf

1. Open the [Cloud Shell](https://shell.azure.com)

    Authenticate and check you are in the right subscription.

1. Create a directory

    ```shell
    mkdir terraform-basics
    ```

    > Use `CTRL`+`SHIFT`+`V` to paste as plain text  into the Cloud Shell's terminal.

1. Change to the directory

    ```shell
    cd terraform-basics
    ```

1. Open the Monaco editor

    The Azure Cloud Shell includes the integrated open source [Monaco editor](https://docs.microsoft.com/azure/cloud-shell/using-cloud-shell-editor).

    ```shell
    code provider.tf
    ```

1. Copy the example provider.tf

    Click on the copy icon that appears when you hover over the example code block below.

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

    Terraform can use providers for multiple clouds and other technologies. This example provider.tf has [provider requirements](https://www.terraform.io/language/providers/requirements) so that we are assured a minimum version of the azurerm provider, and also specifies a couple of [azurerm provider features](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs#features).

1. Paste into the editor window

    Click on the main editor pain and paste using `CTRL`+`V`.

    ![provider.tf](/terraform/fundamentals/images/provider.tf.png)

    The circle next to the file name indicates that the file has unsaved changes.

1. Save the file

    Click on the ellipsis (*...*) and select Save, or use `CTRL`+`S`.

1. Close the editor

    Select Close Editor from the ellipsis, or use `CTRL`+`Q`.

## Initialise terraform

1. Run `terraform version`

    ```shell
    terraform version
    ```

    The cloud shell [container image](https://docs.microsoft.com/azure/cloud-shell/features) includes the terraform binary. In later labs you will see how to install the terraform binary for other scenarios.

1. Run `terraform init`

    This is the first of the key commands in the Terraform workflow.

    ```shell
    terraform init
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">Initializing the backend...</span>

<span style="font-weight:bold;">Initializing provider plugins...</span>
- Finding hashicorp/azurerm versions matching &quot;~&gt; 2.96&quot;...
- Installing hashicorp/azurerm v2.96.0...
- Installed hashicorp/azurerm v2.96.0 (signed by HashiCorp)

Terraform has created a lock file <span style="font-weight:bold;">.terraform.lock.hcl</span> to record the provider
selections it made above. Include this file in your version control repository
so that Terraform can guarantee to make the same selections by default when
you run &quot;terraform init&quot; in the future.

<span style="font-weight:bold;"></span><span style="font-weight:bold;color:lime;">Terraform has been successfully initialized!</span><span style="color:lime;"></span>
<span style="color:lime;">
You may now begin working with Terraform. Try running &quot;terraform plan&quot; to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.</span>
</pre>
{{< /raw >}}

1. List the new files

    ```shell
    find .terraform* -type f
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
.terraform/providers/registry.terraform.io/hashicorp/azurerm/2.96.0/linux_amd64/terraform-provider-azurerm_v2.96.0_x5
.terraform.lock.hcl
</pre>
{{< /raw >}}

    The azure provider has been downloaded and a [dependency lock file](https://www.terraform.io/language/files/dependency-lock) has been created.

1. Run `terraform providers`

    ```shell
    terraform providers
    ```

    The `terraform providers` command shows the required providers, their sources and the version constraints. This command becomes more useful when we start to make use of modules.

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
Providers required by configuration:
.
└── provider[registry.terraform.io/hashicorp/azurerm] ~> 2.96
</pre>
{{< /raw >}}

1. Run `terraform version` again

    ```shell
    terraform version
    ```

    Confirms the version of the terraform binary and the providers.

## Summary

We have reached the end of the lab. You have initialised the azurerm provider.

Move onto the next lab and we'll create a couple of Terraform files.
