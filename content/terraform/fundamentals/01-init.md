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
    parent: terraform-basics
series:
 - terraform-basics
---

## Overview

In this short lab you will

* create a provider.tf in Cloud Shell
* use the `terraform init` command to download the azurerm provider locally

## Create a provider.tf

1. Open the [Cloud Shell](https://shell.azure.com)

    Authenticate and check you are in the right subscription.

1. Create a directory

    ```bash
    mkdir terraform-basics
    ```

    > Use `CTRL`+`SHIFT`+`V` to paste as plain text  into the Cloud Shell's terminal.

1. Change to the directory

    ```bash
    cd terraform-basics
    ```

1. Open the Monaco editor

    The Azure Cloud Shell includes the integrated open source [Monaco editor](https://docs.microsoft.com/azure/cloud-shell/using-cloud-shell-editor).

    ```bash
    code provider.tf
    ```

1. Copy the example provider.tf

    Click on the copy icon that appears when you hover over the example code block below.

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

    Terraform can use providers for multiple clouds and other technologies. This example provider.tf has [provider requirements](https://www.terraform.io/language/providers/requirements) so that we are assured a minimum version of the azurerm provider, and also specifies a couple of [azurerm provider features](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs#features).

1. Paste into the editor window

    Click on the main editor pain and paste using `CTRL`+`V`.

    The circle next to the file name indicates that the file has unsaved changes.

1. Save the file

    Click on the ellipsis (*...*) and select Save, or use `CTRL`+`S`.

    ![provider.tf](/terraform/fundamentals/images/provider.tf.png)

1. Close the editor

    Select Close Editor from the ellipsis, or use `CTRL`+`Q`.

## Initialise terraform

1. Run `terraform version`

    ```bash
    terraform version
    ```

    You may ignore any message saying that your Terraform version is out of date.

    The cloud shell [container image](https://docs.microsoft.com/azure/cloud-shell/features) includes the terraform binary and you cannot update it.

    In later labs you will see how to install the terraform binary for other scenarios where you do have full control over the versions.

1. Run `terraform init`

    This is the first of the key commands in the Terraform workflow.

    ```bash
    terraform init
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">Initializing the backend...</span>

<span style="font-weight:bold;">Initializing provider plugins...</span>
- Finding hashicorp/azurerm versions matching &quot;~&gt; 3.1&quot;...
- Installing hashicorp/azurerm v3.1.0...
- Installed hashicorp/azurerm v3.1.0 (signed by HashiCorp)

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

    ```bash
    find .terraform* -type f
    ```

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
.terraform/providers/registry.terraform.io/hashicorp/azurerm/3.1.0/linux_amd64/terraform-provider-azurerm_v3.1.0_x5
.terraform.lock.hcl
</pre>
{{< /raw >}}

    The azure provider has been downloaded and a [dependency lock file](https://www.terraform.io/language/files/dependency-lock) has been created.

1. Run `terraform providers`

    ```bash
    terraform providers
    ```

    The `terraform providers` command shows the required providers, their sources and the version constraints. This command becomes more useful when we start to make use of modules.

    Example output:

    {{< raw >}}
<pre style="color:white; background-color:black">
Providers required by configuration:
.
└── provider[registry.terraform.io/hashicorp/azurerm] ~> 3.1
</pre>
{{< /raw >}}

1. Run `terraform version` again

    ```bash
    terraform version
    ```

    Confirms the version of the terraform binary and the providers.

## Summary

We have reached the end of the lab. You have initialised the azurerm provider.

Move onto the next lab and we'll create a couple of Terraform files.
