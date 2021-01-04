---
title: "Terraform Workflow"
date: 2021-01-21
author: [ "Richard Cheney" ]
description: "What is Terraform and what is the basic workflow? Take your first steps using Terraform in the Cloud Shell to deploy a resource group and container."
weight: 1
menu:
  side:
    parent: 'terraform-basics'
---

## Introduction

This is a short and simple lab to introduce you to the Terraform workflow and HCL file format.  Everything will be run within the bash version of the Azure Cloud Shell which already has Terraform installed and maintained for you, so all you need for this lab is an active Azure subscription.

There are three main ways of authenticating the Terraform provider to Azure:

1. Azure CLI
2. Managed System Identity (MSI)
3. Service Principals

This lab will be run within Cloud Shell.  Cloud Shell runs on a small linux container (the image is held on DockerHub) and uses MSI to authenticate.  Essentially the whole container is authenticated using your credentials and Terraform leverages MSI. We will move through the other authentication types during the course of the labs and will discuss the use cases for each.

Once you have started your Cloud Shell session you will be automatically logged in to Azure.  Terraform makes use of that authentication and context, so you will be good to go.

## Getting started

Open up an Azure Cloud Shell.  You can do this from within the portal by clicking on the **`>_`** icon at the top, but for an (almost) full screen Cloud Shell session then open up a new tab and go to <https://shell.azure.com>.

> If it is the first time that you've opened the Cloud Shell then you will be prompted to create a storage account for persisting your home directory. Accept the defaults.

1. Show your current context

    ```shell
    az account show
    ```

    {{< details "Example output" >}}

```json
{
  "environmentName": "AzureCloud",
  "homeTenantId": "f246eeb7-b820-4971-a083-9e100e084ed0",
  "id": "2d31be49-d959-4415-bb65-8aec2c90ba62",
  "isDefault": true,
  "managedByTenants": [],
  "name": "Visual Studio (richeney)",
  "state": "Enabled",
  "tenantId": "f246eeb7-b820-4971-a083-9e100e084ed0",
  "user": {
    "cloudShellID": true,
    "name": "richeney@azurecitadel.com",
    "type": "user"
  }
}
```

    {{< /details >}}

    If you have multiple subscriptions then you can switch using

    * `az account list --output table`
    * `az account set --subscription <subscriptionId>`

    If you are doing that regularly then you may want to add an alias to the bottom of your ~/.bashrc file, e.g. `alias vs='az account set --subscription <subscriptionId>; az account show'`.

1. Show the terraform help

    ```shell
    terraform --help
    ```

    {{< details "Example output" >}}

    ```text
    Usage: terraform [global options] <subcommand> [args]

    The available commands for execution are listed below.
    The primary workflow commands are given first, followed by
    less common or more advanced commands.

    Main commands:
      init          Prepare your working directory for other commands
      validate      Check whether the configuration is valid
      plan          Show changes required by the current configuration
      apply         Create or update infrastructure
      destroy       Destroy previously-created infrastructure

    All other commands:
      console       Try Terraform expressions at an interactive command prompt
      fmt           Reformat your configuration in the standard style
      force-unlock  Release a stuck lock on the current workspace
      get           Install or upgrade remote Terraform modules
      graph         Generate a Graphviz graph of the steps in an operation
      import        Associate existing infrastructure with a Terraform resource
      login         Obtain and save credentials for a remote host
      logout        Remove locally-stored credentials for a remote host
      output        Show output values from your root module
      providers     Show the providers required for this configuration
      refresh       Update the state to match remote systems
      show          Show the current state or a saved plan
      state         Advanced state management
      taint         Mark a resource instance as not fully functional
      untaint       Remove the 'tainted' state from a resource instance
      version       Show the current Terraform version
      workspace     Workspace management

    Global options (use these before the subcommand, if any):
      -chdir=DIR    Switch to a different working directory before executing the
                    given subcommand.
      -help         Show this help output, or the help for a specified subcommand.
      -version      An alias for the "version" subcommand.
    ```

    {{< /details >}}

## Create a simple main.tf file

Terraform uses its own file format, called HCL (Hashicorp Configuration Language).  This is very similar to YAML.  We'll create a main.tf file with a resource group and a container instance.

1. Create a citadel_terraform_basics directory in your home directory

    ```shell
    mkdir ~/citadel_terraform_basics
    ```

1. Change to the new directory

    ```shell
    cd ~/citadel_terraform_basics
    ```

1. Create an empty main.tf file

    ```shell
    touch main.tf
    ```

1. Copy the text from the codeblock below

    ```hcl
    provider "azurerm" {
        features {}
    }

    resource "azurerm_resource_group" "demo" {
      name     = "azure_container_instance_demo"
      location = "West Europe"
      tags = {
        environment = "training"
      }
    }

    resource "azurerm_container_group" "demo" {
      name                = "demo"
      location            = azurerm_resource_group.demo.location
      resource_group_name = azurerm_resource_group.demo.name
      ip_address_type     = "public"
      os_type             = "Linux"

      container {
        name = "demo"
        image = "bencuk/nodejs-demoapp:latest"
        cpu = "0.5"
        memory = "0.5"

        ports {
          port = 3000
          protocol = "TCP"
          }
      }
    }
    ```

1. Start the Monaco editor in the Cloud Shell

    ```shell
    code .
    ```

1. Click on the main.tf file in the explorer pane
1. Paste in the contents of the clipboard
1. Save the file (`CTRL`+`S`)

    ![Monaco Editor](/terraform/basics/images/monaco.png)

    Let's look more closely at the last resource block, for the **azurerm_container_group**.

    The Terraform top level **keyword** is `resource`. We'll cover the various top level keywords as we go through the labs.

    The next value, `azurerm_container_group`, is the **resource type**.  Resource types are always prefixed with the provider, which is azurerm in this case. You can have multiple resources of the same type in a Terraform configuration, and they can make use of different providers. This resource type is for an [Azure Container Instance](https://azure.microsoft.com/services/container-instances).

    The third value, `demo`, is the **local name** and is combined with the resource type to form the Terraform **identifier**, e.g. `azurerm_container_group.demo`. These are used within Terraform's state file and the graph database of dependencies and must be unique. If we had multiple ACI resources then they would need different local names.  You may reuse the same local names for different resource types, e.g. `azurerm_resource_group.demo` and `azurerm_container_group.demo`, which is useful when they are related. The ids can be comprised of alphanumerics, underscores or dashes.

    The key-value pairs within the curly braces are the arguments. More complex arguments use blocks. The _container_ block is an example, and itself contains a _ports_ block.

    Most of the values are standard strings as denoted by the quotes, except for the container instances resource group name and location.  This is a reference to attributes exported by the `azurerm_resource_group.demo` resource.

    > You will see examples of other Terraform configs that will have equivalent expressions within the older interpolation format. Terraform would scan all strings and interpolate (evaluate) any expressions prefixed by a dollar prefix and surrounded by curly braces, e.g. `"${azurerm_resource_group.demo.name}"`. The newer, cleaner expressions are called [first class expressions](https://www.hashicorp.com/blog/terraform-0-12-preview-first-class-expressions) and this is one of the features introduced by Terraform 0.12.

    Using `azurerm_resource_group.demo.name` will set the value of the resource group name to match the resource group block above, i.e. 'azure_container_instance_demo'.

    Using the reference to the other resource also sets an implicit dependency, so that Terraform understands that the container instance should only be created once the resource group exists.

1. Close the vscode pane (`CTRL`+`Q`)

## Terraform workflow

This is the Terraform workflow.

![Terraform Workflow](/terraform/basics/images/workflow.svg)

| Command | Description | Notes |
| --- | --- |--- |
| terraform fmt | Auto formats .tf files | Shows HCL syntax errors |
| terraform init  | Downloads providers | Creates .terraform.lock.hcl |
| terraform validate | Checks syntax and internal consistency |   |
| terraform plan | Refreshes state and determines actions | Shows provider config errors |
| terraform apply | Applies the planned changes | Shows provider REST API errors  |
| terraform delete | Destroys resources in the state | |

Let's step through the commands one by one with our config.

## Format

The `terraform fmt` command will automatically correct the formatting in your .tf files. The HCL code block had some intentionally bad formatting which the command will fix.

1. Display the main.tf

    ```shell
    cat main.tf
    ```

    Some of the argument values are misaligned and one of the curly braces is not in the right place.

1. Format your HCL files

    ```shell
    terraform fmt
    ```

    The command lists out the files which have been altered.

1. Redisplay the main.tf

    ```shell
    cat main.tf
    ```

    Spot the differences. The changes are purely cosmetic but improve the readability of your files.

## Initialise

The `terraform init` command looks through all of the *.tf files in the current working directory and automatically downloads the providers required for them.

1. Initialise the Terraform config

    ```shell
    terraform init
    ```

    {{< details_raw "Example output" >}}
    <pre>
    <span style="font-weight:bold;">Initializing the backend...</span>

    <span style="font-weight:bold;">Initializing provider plugins...</span>
    - Finding latest version of hashicorp/azurerm...
    - Installing hashicorp/azurerm v2.41.0...
    - Installed hashicorp/azurerm v2.41.0 (signed by HashiCorp)

    Terraform has created a lock file <span style="font-weight:bold;">.terraform.lock.hcl</span> to record the provider
    selections it made above. Include this file in your version control repository
    so that Terraform can guarantee to make the same selections by default when
    you run &quot;terraform init&quot; in the future.

    <span style="font-weight:bold;"></span><span style="font-weight:bold;color:green;">Terraform has been successfully initialized!</span><span style="color:green;"></span>
    <span style="color:green;">
    You may now begin working with Terraform. Try running &quot;terraform plan&quot; to see
    any changes that are required for your infrastructure. All Terraform commands
    should now work.

    If you ever set or change modules or backend configuration for Terraform,
    rerun this command to reinitialize your working directory. If you forget, other
    commands will detect it and remind you to do so if necessary.</span>
    </pre>
    {{< /details_raw >}}

1. List out all of the files in the current directory

    ```shell
    find .
    ```

    Terraform downloaded the azurerm provider into `.terraform` as we have used it in our main.tf file.

## Validate

The validation is optional but recommended.

```shell
terraform validate
```

The validation is always done as part of the terraform plan and apply steps, but it is useful to run it standalone to ensure that newly created HCL is syntactically good.

It is highly recommended in a CI/CD deploy pipeline as it can capture syntax errors in a discrete step.

## Plan

This is a dry run and shows which actions will be made.  This allows manual verification of the changes before running the apply step.

```shell
terraform plan
```

{{< details_raw "Example output" >}}
<pre>
An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  <span style="color:green;">+</span> create

Terraform will perform the following actions:

<span style="font-weight:bold;">  # azurerm_container_group.demo</span> will be created
  <span style="color:green;">+</span> resource &quot;azurerm_container_group&quot; &quot;demo&quot; {
      <span style="color:green;">+</span> <span style="font-weight:bold;"></span>fqdn                = (known after apply)
      <span style="color:green;">+</span> <span style="font-weight:bold;"></span>id                  = (known after apply)
      <span style="color:green;">+</span> <span style="font-weight:bold;"></span>ip_address          = (known after apply)
      <span style="color:green;">+</span> <span style="font-weight:bold;"></span>ip_address_type     = &quot;public&quot;
      <span style="color:green;">+</span> <span style="font-weight:bold;"></span>location            = &quot;westeurope&quot;
      <span style="color:green;">+</span> <span style="font-weight:bold;"></span>name                = &quot;demo&quot;
      <span style="color:green;">+</span> <span style="font-weight:bold;"></span>os_type             = &quot;Linux&quot;
      <span style="color:green;">+</span> <span style="font-weight:bold;"></span>resource_group_name = &quot;azure_container_instance_demo&quot;
      <span style="color:green;">+</span> <span style="font-weight:bold;"></span>restart_policy      = &quot;Always&quot;

      <span style="color:green;">+</span> container {
          <span style="color:green;">+</span> <span style="font-weight:bold;"></span>commands = (known after apply)
          <span style="color:green;">+</span> <span style="font-weight:bold;"></span>cpu      = 0.5
          <span style="color:green;">+</span> <span style="font-weight:bold;"></span>image    = &quot;bencuk/nodejs-demoapp:latest&quot;
          <span style="color:green;">+</span> <span style="font-weight:bold;"></span>memory   = 0.5
          <span style="color:green;">+</span> <span style="font-weight:bold;"></span>name     = &quot;demo&quot;

          <span style="color:green;">+</span> ports {
              <span style="color:green;">+</span> <span style="font-weight:bold;"></span>port     = 3000
              <span style="color:green;">+</span> <span style="font-weight:bold;"></span>protocol = &quot;TCP&quot;
            }
        }

      <span style="color:green;">+</span> identity {
          <span style="color:green;">+</span> <span style="font-weight:bold;"></span>identity_ids = (known after apply)
          <span style="color:green;">+</span> <span style="font-weight:bold;"></span>principal_id = (known after apply)
          <span style="color:green;">+</span> <span style="font-weight:bold;"></span>type         = (known after apply)
        }
    }

<span style="font-weight:bold;">  # azurerm_resource_group.demo</span> will be created
  <span style="color:green;">+</span> resource &quot;azurerm_resource_group&quot; &quot;demo&quot; {
      <span style="color:green;">+</span> <span style="font-weight:bold;"></span>id       = (known after apply)
      <span style="color:green;">+</span> <span style="font-weight:bold;"></span>location = &quot;westeurope&quot;
      <span style="color:green;">+</span> <span style="font-weight:bold;"></span>name     = &quot;azure_container_instance_demo&quot;
      <span style="color:green;">+</span> <span style="font-weight:bold;"></span>tags     = {
          <span style="color:green;">+</span> &quot;environment&quot; = &quot;training&quot;
        }
    }

<span style="font-weight:bold;">Plan:</span> 2 to add, 0 to change, 0 to destroy.

------------------------------------------------------------------------

Note: You didn't specify an &quot;-out&quot; parameter to save this plan, so Terraform
can't guarantee that exactly these actions will be performed if
&quot;terraform apply&quot; is subsequently run.
</pre>
{{< /details_raw >}}

## Apply

Run the apply command to deploy the resources.

You will see the same output as the `terraform plan` command, but will also be prompted for confirmation that you want to apply those changes.  Type `yes`.

```text
:

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
```

The resource group and the container have been successfully deployed.

![Azure Portal](/terraform/basics/images/azure_container_instance_demo.png)

## Terraform State

Now that your config has been deployed, you will have a local Terraform state file. The **terraform.tfstate** file is ASCII and contains a JSON object.

1. Display the Terraform state file

    ```shell
    cat terraform.tfstate
    ```

    Note that it is a mix of Azure and Terraform information, including the dependencies between objects.

1. List the Terraform identifiers

    ```shell
    terraform state list
    ```

    Expected output:

    ```text
    azurerm_container_group.demo
    azurerm_resource_group.demo
    ```

    Remember that these are the Terraform identifiers and have to be unique within this state file.

1. Show the container instance state info

    ```shell
    terraform state show azurerm_container_group.demo
    ```

    {{< details "Example output" >}}

```text
# azurerm_container_group.demo:
resource "azurerm_container_group" "demo" {
    id                  = "/subscriptions/2d31be49-d959-4415-bb65-8aec2c90ba62/resourceGroups/azure_container_instance_demo/providers/Microsoft.ContainerInstance/containerGroups/demo"
    ip_address          = "20.73.212.54"
    ip_address_type     = "Public"
    location            = "westeurope"
    name                = "demo"
    os_type             = "Linux"
    resource_group_name = "azure_container_instance_demo"
    restart_policy      = "Always"
    tags                = {}
    container {
        commands                     = []
        cpu                          = 0.5
        environment_variables        = {}
        image                        = "bencuk/nodejs-demoapp:latest"
        memory                       = 0.5
        name                         = "demo"
        secure_environment_variables = (sensitive value)
        ports {
            port     = 3000
            protocol = "TCP"
        }
    }
}
```

    {{< /details >}}

Note that you can see the value for the container instance's public IP address.

We will spend more time with Terraform's state in a later lab.

## Update

### Modify the main.tf

One of the major benefits of the Terraform approach is lifecycle management. As Terraform has an understanding of the current state, and refreshes this state using REST API calls when you run plan or apply, then it will let you know what will be the impact. Let's do some modest changes to show this in effect.

1. Edit the main.tf

    ```shell
    code .
    ```

1. Shorten the resource group's _environment_ tag to ___env___

    ```hcl
    resource "azurerm_resource_group" "demo" {
      name     = "azure_container_instance_demo"
      location = "West Europe"
      tags = {
        env = "training"
      }
    }
    ```

1. Add an FQDN to the container instance

    At the moment our container instance only has an IP address. Let's give it a fully qualified domain name (FQDN) by adding the dns_name_label argument to the resource. Here is an example.

    **Make sure you change `my-unique-prefix` to a unique value of your own.**

    ```hcl
    resource "azurerm_container_group" "demo" {
      name                = "demo"
      location            = azurerm_resource_group.demo.location
      resource_group_name = azurerm_resource_group.demo.name
      ip_address_type     = "public"
      dns_name_label      = "my-unique-prefix"
      os_type             = "Linux"

      container {
        name   = "demo"
        image  = "bencuk/nodejs-demoapp:latest"
        cpu    = "0.5"
        memory = "0.5"

        ports {
          port     = 3000
          protocol = "TCP"
        }
      }
    }
    ```

    > Note that FQDNs must be globally unique. The dns_name_label value must only contain lowercase letters, numbers and hyphens. The first character muts be a letter, the last must be either a letter or number and the length must be between 5 and 63 chars long.

1. Save the changes

    Use `CTRL`+`S` to save and `CTRL`+`Q` to quit the editor.

### Plan and Apply

1. Run `terraform plan`

    The output will shows you what will change from the current state.

    Resource actions are indicated with the following symbols:

    {{< raw >}}
    <pre>
       <span style="color:green;">+</span>  create
       <span style="color:red;">-</span>  destroy
       <span style="color:olive;">~</span>  update in-place
      <span style="color:red;">-</span>/<span style="color:green;">+</span> destroy and then create replacement
    </pre>
    {{< /raw >}}

    {{< details_raw "Example output" >}}
    <pre>

    <span style="font-weight:bold;">azurerm_resource_group.demo: Refreshing state... [id=/subscriptions/2d31be49-d959-4415-bb65-8aec2c90ba62/resourceGroups/azure_container_instance_demo]</span>
    <span style="font-weight:bold;">azurerm_container_group.demo: Refreshing state... [id=/subscriptions/2d31be49-d959-4415-bb65-8aec2c90ba62/resourceGroups/azure_container_instance_demo/providers/Microsoft.ContainerInstance/containerGroups/demo]</span>

    An execution plan has been generated and is shown below.
    Resource actions are indicated with the following symbols:
      <span style="color:olive;">~</span> update in-place
    <span style="color:red;">-</span>/<span style="color:green;">+</span> destroy and then create replacement

    Terraform will perform the following actions:

    <span style="font-weight:bold;">  # azurerm_container_group.demo</span> must be <span style="font-weight:bold;"></span><span style="font-weight:bold;color:red;">replaced</span>
    <span style="color:red;">-</span>/<span style="color:green;">+</span> resource &quot;azurerm_container_group&quot; &quot;demo&quot; {
          <span style="color:green;">+</span> <span style="font-weight:bold;"></span>dns_name_label      = &quot;my-unique-prefix&quot; <span style="color:red;"># forces replacement</span>
          <span style="color:green;">+</span> <span style="font-weight:bold;"></span>fqdn                = (known after apply)
          <span style="color:olive;">~</span> <span style="font-weight:bold;"></span>id                  = &quot;/subscriptions/2d31be49-d959-4415-bb65-8aec2c90ba62/resourceGroups/azure_container_instance_demo/providers/Microsoft.ContainerInstance/containerGroups/demo&quot; <span style="color:olive;">-&gt;</span> (known after apply)
          <span style="color:olive;">~</span> <span style="font-weight:bold;"></span>ip_address          = &quot;20.73.212.54&quot; <span style="color:olive;">-&gt;</span> (known after apply)
          <span style="color:olive;">~</span> <span style="font-weight:bold;"></span>ip_address_type     = &quot;Public&quot; <span style="color:olive;">-&gt;</span> &quot;public&quot;
            <span style="font-weight:bold;"></span>name                = &quot;demo&quot;
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>tags                = {} <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
            <span style="filter: contrast(70%) brightness(190%);color:dimgray;"># (4 unchanged attributes hidden)</span>

          <span style="color:olive;">~</span> container {
              <span style="color:olive;">~</span> <span style="font-weight:bold;"></span>commands                     = [] <span style="color:olive;">-&gt;</span> (known after apply)
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>environment_variables        = {} <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
                <span style="font-weight:bold;"></span>name                         = &quot;demo&quot;
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>secure_environment_variables = (sensitive value)
                <span style="filter: contrast(70%) brightness(190%);color:dimgray;"># (3 unchanged attributes hidden)</span>

                <span style="filter: contrast(70%) brightness(190%);color:dimgray;"># (1 unchanged block hidden)</span>
            }

          <span style="color:green;">+</span> identity {
              <span style="color:green;">+</span> <span style="font-weight:bold;"></span>identity_ids = (known after apply)
              <span style="color:green;">+</span> <span style="font-weight:bold;"></span>principal_id = (known after apply)
              <span style="color:green;">+</span> <span style="font-weight:bold;"></span>type         = (known after apply)
            }
        }

    <span style="font-weight:bold;">  # azurerm_resource_group.demo</span> will be updated in-place
      <span style="color:olive;">~</span> resource &quot;azurerm_resource_group&quot; &quot;demo&quot; {
            <span style="font-weight:bold;"></span>id       = &quot;/subscriptions/2d31be49-d959-4415-bb65-8aec2c90ba62/resourceGroups/azure_container_instance_demo&quot;
            <span style="font-weight:bold;"></span>name     = &quot;azure_container_instance_demo&quot;
          <span style="color:olive;">~</span> <span style="font-weight:bold;"></span>tags     = {
              <span style="color:green;">+</span> &quot;env&quot;         = &quot;training&quot;
              <span style="color:red;">-</span> &quot;environment&quot; = &quot;training&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
            }
            <span style="filter: contrast(70%) brightness(190%);color:dimgray;"># (1 unchanged attribute hidden)</span>
        }

    <span style="font-weight:bold;">Plan:</span> 1 to add, 1 to change, 1 to destroy.

    ------------------------------------------------------------------------

    Note: You didn't specify an &quot;-out&quot; parameter to save this plan, so Terraform
    can't guarantee that exactly these actions will be performed if
    &quot;terraform apply&quot; is subsequently run.

    </pre>
    {{< /details_raw >}}

1. Run `terraform apply`

   The planned changes are applied.

### Steady state

1. Run `terraform plan`

    {{< raw >}}
    <pre>
    <span style="font-weight:bold;">azurerm_resource_group.demo: Refreshing state... [id=/subscriptions/2d31be49-d959-4415-bb65-8aec2c90ba62/resourceGroups/azure_container_instance_demo]</span>
    <span style="font-weight:bold;">azurerm_container_group.demo: Refreshing state... [id=/subscriptions/2d31be49-d959-4415-bb65-8aec2c90ba62/resourceGroups/azure_container_instance_demo/providers/Microsoft.ContainerInstance/containerGroups/demo]</span>

    <span style="font-weight:bold;"></span><span style="font-weight:bold;color:green;">No changes. Infrastructure is up-to-date.</span><span style="color:green;">

    This means that Terraform did not detect any differences between your
    configuration and real physical resources that exist. As a result, no
    actions need to be performed.</span>
    </pre>
    {{< /raw >}}

    The state matches the config and so there are no changes to apply.

1. Check the demo app

    The FQDN for a container instance is `https://<dns_name_label>.<location>.azurecontainer.io` and the exposed port on the container is 3000.

    The URL for my config is therefore `https://my-unique-prefix.westeurope.azurecontainer.io:3000`.

    ![nodejs-demoapp](/terraform/basics/images/nodejs-demoapp.png)

## Destroy

Clean up the resources by using the `terraform destroy` command.  The command will let you know what you are about to remove and then prompt you for confirmation.

{{< details_raw "Example output" >}}
<pre>

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  <span style="color:red;">-</span> destroy

Terraform will perform the following actions:

<span style="font-weight:bold;">  # azurerm_container_group.demo</span> will be <span style="font-weight:bold;"></span><span style="font-weight:bold;color:red;">destroyed</span>
  <span style="color:red;">-</span> resource &quot;azurerm_container_group&quot; &quot;demo&quot; {
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>dns_name_label      = &quot;my-unique-prefix&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>fqdn                = &quot;my-unique-prefix.westeurope.azurecontainer.io&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>id                  = &quot;/subscriptions/2d31be49-d959-4415-bb65-8aec2c90ba62/resourceGroups/azure_container_instance_demo/providers/Microsoft.ContainerInstance/containerGroups/demo&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>ip_address          = &quot;20.73.223.61&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>ip_address_type     = &quot;Public&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>location            = &quot;westeurope&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>name                = &quot;demo&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>os_type             = &quot;Linux&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>resource_group_name = &quot;azure_container_instance_demo&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>restart_policy      = &quot;Always&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>

      <span style="color:red;">-</span> container {
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>commands = [] <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>cpu      = 0.5 <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>image    = &quot;bencuk/nodejs-demoapp:latest&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>memory   = 0.5 <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
          <span style="color:red;">-</span> <span style="font-weight:bold;"></span>name     = &quot;demo&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>

          <span style="color:red;">-</span> ports {
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>port     = 3000 <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
              <span style="color:red;">-</span> <span style="font-weight:bold;"></span>protocol = &quot;TCP&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
            }
        }
    }

<span style="font-weight:bold;">  # azurerm_resource_group.demo</span> will be <span style="font-weight:bold;"></span><span style="font-weight:bold;color:red;">destroyed</span>
  <span style="color:red;">-</span> resource &quot;azurerm_resource_group&quot; &quot;demo&quot; {
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>id       = &quot;/subscriptions/2d31be49-d959-4415-bb65-8aec2c90ba62/resourceGroups/azure_container_instance_demo&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>location = &quot;westeurope&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>name     = &quot;azure_container_instance_demo&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
      <span style="color:red;">-</span> <span style="font-weight:bold;"></span>tags     = {
          <span style="color:red;">-</span> &quot;env&quot; = &quot;training&quot;
        } <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt;</span> <span style="filter: contrast(70%) brightness(190%);color:dimgray;">null</span>
    }

<span style="font-weight:bold;">Plan:</span> 0 to add, 0 to change, 2 to destroy.

<span style="font-weight:bold;">Do you really want to destroy all resources?</span>
  Terraform will destroy all your managed infrastructure, as shown above.
  There is no undo. Only 'yes' will be accepted to confirm.

<span style="font-weight:bold;">Enter a value: </span> yes

<span style="font-weight:bold;">azurerm_container_group.demo: Destroying... [id=/subscriptions/2d31be49-d959-4415-bb65-8aec2c90ba62/resourceGroups/azure_container_instance_demo/providers/Microsoft.ContainerInstance/containerGroups/demo]</span>
<span style="font-weight:bold;">azurerm_container_group.demo: Destruction complete after 2s</span>
<span style="font-weight:bold;">azurerm_resource_group.demo: Destroying... [id=/subscriptions/2d31be49-d959-4415-bb65-8aec2c90ba62/resourceGroups/azure_container_instance_demo]</span>
<span style="font-weight:bold;">azurerm_resource_group.demo: Still destroying... [id=/subscriptions/2d31be49-d959-4415-bb65-...ceGroups/azure_container_instance_demo, 10s elapsed]</span>
<span style="font-weight:bold;">azurerm_resource_group.demo: Still destroying... [id=/subscriptions/2d31be49-d959-4415-bb65-...ceGroups/azure_container_instance_demo, 20s elapsed]</span>
<span style="font-weight:bold;">azurerm_resource_group.demo: Still destroying... [id=/subscriptions/2d31be49-d959-4415-bb65-...ceGroups/azure_container_instance_demo, 30s elapsed]</span>
<span style="font-weight:bold;">azurerm_resource_group.demo: Still destroying... [id=/subscriptions/2d31be49-d959-4415-bb65-...ceGroups/azure_container_instance_demo, 40s elapsed]</span>
<span style="font-weight:bold;">azurerm_resource_group.demo: Destruction complete after 46s</span>
<span style="font-weight:bold;"></span><span style="font-weight:bold;color:green;">
Destroy complete! Resources: 2 destroyed.</span>
</pre>
{{< /details_raw >}}

Check the portal or type `az group list` and you will see that the resource group has been successfully removed.

## Summary

We have reached the end of the lab and you now have some exposure to the basics of the Terraform workflow and state.

In the next lab we will introduce variables and start to use multiple .tf files.
