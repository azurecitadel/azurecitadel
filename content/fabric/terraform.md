---
title: "Terraform"
description: "Run the Terraform workflow in the user context and modify the config with a simple RBAC assignment. "
layout: single
draft: false
menu:
  side:
    parent: fabric
    identifier: fabric-terraform
series:
 - fabric_terraform_administrator
weight: 30
---

## Introduction

You have access, tooling, a Fabric capacity, a repo, and an app reg to use.

Let's run through the Terraform workflow at the CLI to create a workspace and ensure that the authentication is working. Then we'll look at the docs and add a role assignment to the workspace as a gentle first step to automating your Fabric environment.

## Create a backend.tf

We will create a Terraform azurerm backend block so that the state is written to the storage account rather than a local terraform.tfstate file.

1. Create a backend.tf

    This code block will create a [Terraform azurerm backend](https://developer.hashicorp.com/terraform/language/backend/azurerm) block for the test container. (We will override the container value to prod in the CI/CD pipeline later.)

    ```shell
    subscription_id=$(az account show --query id -otsv)
    storage_account_name=$(az storage account list --subscription $subscription_id --resource-group "terraform" --query "[?starts_with(name,'terraformfabric')]|[0].name" -otsv)
    cat - <<BACKEND > backend.tf
    terraform {
      backend "azurerm" {
        subscription_id      = "$subscription_id"
        resource_group_name  = "terraform"
        storage_account_name = "$storage_account_name"
        container_name       = "test"
        key                  = "terraform.tfstate"
        use_azuread_auth     = true
      }
    }
    BACKEND
    ```

    Example backend.tf

    ```ruby
    terraform {
      backend "azurerm" {
        subscription_id      = "<subscription_id>"
        resource_group_name  = "terraform"
        storage_account_name = "<storage_account_name>"
        container_name       = "test"
        key                  = "terraform.tfstate"
        use_azuread_auth     = true
      }
    }
    ```

    > ℹ️ Note that the subscription_id and resource_group_name are not required, but it is useful to include.

## Terraform workflow

You should be in the root of your cloned repo.

1. Initialise

    ```shell
    terraform init
    ```

    Example output:

    {{< raw >}}
<body>
<pre>
<span style="font-weight:bold;">Initializing the backend...</span>
<span style="color:green;">
Successfully configured the backend &quot;azurerm&quot;! Terraform will automatically
use this backend unless the backend configuration changes.</span>
<span style="font-weight:bold;">Initializing provider plugins...</span>
- Reusing previous version of microsoft/fabric from the dependency lock file
- Using previously-installed microsoft/fabric v1.1.0

<span style="font-weight:bold;"></span><span style="font-weight:bold;color:green;">Terraform has been successfully initialized!</span><span style="color:green;"></span>
<span style="color:green;">
You may now begin working with Terraform. Try running &quot;terraform plan&quot; to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.</span>
</pre>
</body>
    {{< /raw >}}

1. Create a variables file

    Terraform has multiple ways of [assigning variable values](https://developer.hashicorp.com/terraform/language/values/variables#assigning-values-to-root-module-variables). The variables.tf has the variable declarations and defaults. The template repo also includes two variable files, test.tfvars and prod.tfvars.

    The test.tfvars includes some example values. The fabric_capacity_name of "Premium Per User - Reserved" is for a P-SKU, so if that is you then feel free to skip this step.

    If not then check the name for your capacity and update the test.tfvars file.

    ```shell
    fab ls -l .capacities
    ```

    Example output.

    ```text
        name                                                 id                                     sku   region      state
    ---------------------------------------------------------------------------------------------------------------------------
    Premium Per User - Reserved.Capacity                     59d17bf8-cda2-4c43-824a-ec3a8078908d   PP3   West US 3   Active
    Trial-20250314T172025Z-xmVeQXcryUKTbE5vcFY5Dg.Capacity   29dc2bec-dc5e-4c0a-85bc-564d96106653   FT1   West US 3   Active
    example.Capacity                                         3da9391c-0cbb-4005-952a-1007a3021888   F2    UK South    Active
    ```

    **Remove the .Capacity suffix.**

    Create a terraform.tfvars file with your capacity name, e.g.:

    ```ruby
    fabric_capacity_name="example"
    fabric_workspace_display_name = "My Example Fabric Workspace"
    fabric_workspace_description  = "This is an example Fabric Workspace created using Terraform."
    ```

1. Plan

    ```shell
    terraform plan -var-file=test.tfvars
    ```

    Example output:

    {{< raw >}}
<body>
<pre>
<span style="font-weight:bold;">data.fabric_capacity.example: Reading...</span>
<span style="font-weight:bold;">data.fabric_capacity.example: Read complete after 7s [id=3da9391c-0cbb-4005-952a-1007a3021888]</span>

Terraform used the selected providers to generate the following execution
plan. Resource actions are indicated with the following symbols:
  <span style="color:green;">+</span> create

Terraform will perform the following actions:

<span style="font-weight:bold;">  # fabric_workspace.example</span> will be created
  <span style="color:green;">+</span> resource &quot;fabric_workspace&quot; &quot;example&quot; {
      <span style="color:green;">+</span> capacity_assignment_progress = (known after apply)
      <span style="color:green;">+</span> capacity_id                  = &quot;3da9391c-0cbb-4005-952a-1007a3021888&quot;
      <span style="color:green;">+</span> capacity_region              = (known after apply)
      <span style="color:green;">+</span> description                  = &quot;This is an example Fabric Workspace created using Terraform.&quot;
      <span style="color:green;">+</span> display_name                 = &quot;My Example Fabric Workspace&quot;
      <span style="color:green;">+</span> id                           = (known after apply)
      <span style="color:green;">+</span> identity                     = {
          <span style="color:green;">+</span> application_id       = (known after apply)
          <span style="color:green;">+</span> service_principal_id = (known after apply)
          <span style="color:green;">+</span> type                 = &quot;SystemAssigned&quot;
        }
      <span style="color:green;">+</span> onelake_endpoints            = (known after apply)
      <span style="color:green;">+</span> type                         = (known after apply)
    }

<span style="font-weight:bold;">Plan:</span> 1 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  <span style="color:green;">+</span> fabric_capacity_id     = &quot;3da9391c-0cbb-4005-952a-1007a3021888&quot;
  <span style="color:green;">+</span> fabric_capacity_region = &quot;UK South&quot;
<span style="filter: contrast(70%) brightness(190%);color:dimgray;">
─────────────────────────────────────────────────────────────────────────────</span>

Note: You didn't use the -out option to save this plan, so Terraform can't
guarantee to take exactly these actions if you run &quot;terraform apply&quot; now.
</pre>
</body>
    {{< /raw >}}

1. Apply

    Assuming you are happy with the output from the plan then apply the config. Confirm the change when asked.

    ```shell
    terraform apply -var-file=test.tfvars
    ```

    Example output below (plan section removed):

    {{< raw >}}
<body>
<pre>
<span style="font-weight:bold;">Do you want to perform these actions?</span>
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

<span style="font-weight:bold;">Enter a value:</span> yes
<span style="font-weight:bold;">fabric_workspace.example: Creating...</span>
<span style="font-weight:bold;">fabric_workspace.example: Still creating... [00m10s elapsed]</span>
<span style="font-weight:bold;">fabric_workspace.example: Creation complete after 15s [id=ab92499e-f69b-44ff-a780-bd6ca8744f86]</span>
<span style="font-weight:bold;"></span><span style="font-weight:bold;color:green;">
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
</span><span style="font-weight:bold;"></span><span style="font-weight:bold;color:green;">
Outputs:

</span>fabric_capacity_id = &quot;3da9391c-0cbb-4005-952a-1007a3021888&quot;
fabric_capacity_region = &quot;UK South&quot;
</pre>
</body>
    {{< /raw >}}

    Check the [Fabric Developer portal](https://app.powerbi.com/groups/me/list?experience=fabric-developer) and you should see the new workspace.

    ![Screenshot of the Fabric Developer portal showing the newly created workspace.](/fabric/images/fabric_workspace.png)

## Fabric provider docs

Documentation for the fabric Terraform provider can be found at <https://aka.ms/terraform/fabric>.

> ℹ️ If the GitPages site is ever unavailable then view the [source repo docs files](https://github.com/microsoft/terraform-provider-fabric/tree/main/docs) directly.

Each of the resources and data sources has a note for preview status and service principal support.

![A screenshot showing the Fabric Terraform provider documentation with notes about preview features and service principal support.](/fabric/images/fabricProvider_notes.png)

This quickstart will avoid preview resources and those that do not support service principals so that you can transition from testing in the user context and then work with a GitHub repo and service principal.

## Role assignment

A little mini challenge for you. Let's add a role assignment.

1. Use the filter to find the [fabric_workspace_role_assignment](https://registry.terraform.io/providers/microsoft/fabric/latest/docs/resources/workspace_role_assignment) resource page
1. Copy the example into your main.tf file
1. Add in another user's objectId, or even better, replace it with a security group objectId
1. Change the workspace_id value to a [reference](https://developer.hashicorp.com/terraform/language/expressions/references#references-to-resource-attributes) to the attribute in the [fabric_workspace](https://registry.terraform.io/providers/microsoft/fabric/latest/docs/resources/workspace) resource
1. Leave Role as Member.

As per the [Microsoft Learn fabric documentation](https://learn.microsoft.com/en-us/fabric/fundamentals/roles-workspaces#-workspace-roles), role can be one of Admin, Member, Contributor, or Viewer.

{{< flash >}}
If you get stuck creating the resource block then scroll to the bottom for an [example config](#example-config).
{{< /flash >}}

## Terraform workflow #2

Check that your files are formatted correctly, are syntactically valid and then plan and apply

1. Validate

    Check the files are

    ```shell
    terraform validate
    ```

1. Format

    Automatically reformat any files that are not gofmt aligned.

    ```shell
    terraform fmt
    ```

1. Plan

    Display the planned change.

    ```shell
    terraform plan -var-file=test.tfvars
    ```

    Example output:

    {{< raw >}}
<pre>
<span style="font-weight:bold;">data.fabric_capacity.example: Reading...</span>
<span style="font-weight:bold;">data.fabric_capacity.example: Read complete after 8s [id=3da9391c-0cbb-4005-952a-1007a3021888]</span>
<span style="font-weight:bold;">fabric_workspace.example: Refreshing state... [id=754577a5-6e9b-414d-8b9a-26b4ec8afa47]</span>

Terraform used the selected providers to generate the following execution
plan. Resource actions are indicated with the following symbols:
  <span style="color:green;">+</span> create

Terraform will perform the following actions:

<span style="font-weight:bold;">  # fabric_workspace_role_assignment.example</span> will be created
  <span style="color:green;">+</span> resource &quot;fabric_workspace_role_assignment&quot; &quot;example&quot; {
      <span style="color:green;">+</span> id           = (known after apply)
      <span style="color:green;">+</span> principal    = {
          <span style="color:green;">+</span> id   = &quot;911aba7f-a5ff-478f-8ca5-a90883646482&quot;
          <span style="color:green;">+</span> type = &quot;Group&quot;
        }
      <span style="color:green;">+</span> role         = &quot;Member&quot;
      <span style="color:green;">+</span> workspace_id = &quot;754577a5-6e9b-414d-8b9a-26b4ec8afa47&quot;
    }

<span style="font-weight:bold;">Plan:</span> 1 to add, 0 to change, 0 to destroy.
<span style="filter: contrast(70%) brightness(190%);color:dimgray;">
─────────────────────────────────────────────────────────────────────────────</span>

Note: You didn't use the -out option to save this plan, so Terraform can't
guarantee to take exactly these actions if you run &quot;terraform apply&quot; now.
</pre>
    {{< /raw >}}

1. Apply

    Apply the change to create the fabric workspace role assignment.

    ```shell
    terraform apply -var-file=test.tfvars
    ```

    Example output:

    {{< raw >}}
<pre>
<span style="font-weight:bold;">Do you want to perform these actions?</span>
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

<span style="font-weight:bold;">Enter a value:</span> yes
<span style="font-weight:bold;">fabric_workspace_role_assignment.example: Creating...</span>
<span style="font-weight:bold;">fabric_workspace_role_assignment.example: Creation complete after 1s [id=911aba7f-a5ff-478f-8ca5-a90883646482]</span>
<span style="font-weight:bold;"></span><span style="font-weight:bold;color:green;">
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
</span><span style="font-weight:bold;"></span><span style="font-weight:bold;color:green;">
Outputs:

</span>fabric_capacity_id = &quot;3da9391c-0cbb-4005-952a-1007a3021888&quot;
fabric_capacity_region = &quot;UK South&quot;
</pre>
     {{< /raw >}}

      Go back to your workspace in the [Fabric Developer portal](https://app.powerbi.com/groups/me/list?experience=fabric-developer) and click on _Manage access_ and you should see the new Member. In the example below it is an Entra security group called Sales.

      ![Screenshot of the Fabric Developer portal showing the new workspace role assignment for an Entra security group named Sales.](/fabric/images/fabric_workspace_role_assignment.png)

## Clean up

OK, the config should have tested fine, and is ready to be committed to the repo, and then we'll get a service principal configured for the fabric provider.

But first, let's clean up the test deployment.

1. Destroy

    ```shell
    terraform destroy -var-file=test.tfvars
    ```

    Example output:

    {{< raw >}}
<pre>
<span style="font-weight:bold;">data.fabric_capacity.example: Reading...</span>
<span style="font-weight:bold;">data.fabric_capacity.example: Read complete after 6s [id=3da9391c-0cbb-4005-952a-1007a3021888]</span>
<span style="font-weight:bold;">fabric_workspace.example: Refreshing state... [id=07fc0d02-3fb1-424a-b3dc-9e55c4075684]</span>
<span style="font-weight:bold;">fabric_workspace_role_assignment.example: Refreshing state... [id=911aba7f-a5ff-478f-8ca5-a90883646482]</span>

Terraform used the selected providers to generate the following execution
plan. Resource actions are indicated with the following symbols:
  <span style="color:red;">-</span> destroy

Terraform will perform the following actions:

<span style="font-weight:bold;">  # fabric_workspace.example</span> will be <span style="font-weight:bold;"></span><span style="font-weight:bold;color:red;">destroyed</span>
  <span style="color:red;">-</span> resource &quot;fabric_workspace&quot; &quot;example&quot; {
      <span style="color:red;">-</span> capacity_assignment_progress = &quot;Completed&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> capacity_id                  = &quot;3da9391c-0cbb-4005-952a-1007a3021888&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> capacity_region              = &quot;UK South&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> description                  = &quot;This is an example Fabric Workspace created using Terraform.&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> display_name                 = &quot;My Example Fabric Workspace&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> id                           = &quot;07fc0d02-3fb1-424a-b3dc-9e55c4075684&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> identity                     = {
          <span style="color:red;">-</span> application_id       = &quot;863d2628-a8b4-40ba-ae86-ff9482ea62a8&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
          <span style="color:red;">-</span> service_principal_id = &quot;983a37e9-c1af-4c07-afc3-c6eb19658bb4&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
          <span style="color:red;">-</span> type                 = &quot;SystemAssigned&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
        } <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> onelake_endpoints            = {
          <span style="color:red;">-</span> blob_endpoint = &quot;https://uksouth-onelake.blob.fabric.microsoft.com&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
          <span style="color:red;">-</span> dfs_endpoint  = &quot;https://uksouth-onelake.dfs.fabric.microsoft.com&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
        } <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> type                         = &quot;Workspace&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
    }

<span style="font-weight:bold;">  # fabric_workspace_role_assignment.example</span> will be <span style="font-weight:bold;"></span><span style="font-weight:bold;color:red;">destroyed</span>
  <span style="color:red;">-</span> resource &quot;fabric_workspace_role_assignment&quot; &quot;example&quot; {
      <span style="color:red;">-</span> id           = &quot;911aba7f-a5ff-478f-8ca5-a90883646482&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> principal    = {
          <span style="color:red;">-</span> id   = &quot;911aba7f-a5ff-478f-8ca5-a90883646482&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
          <span style="color:red;">-</span> type = &quot;Group&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
        } <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> role         = &quot;Member&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> workspace_id = &quot;07fc0d02-3fb1-424a-b3dc-9e55c4075684&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
    }

<span style="font-weight:bold;">Plan:</span> 0 to add, 0 to change, 2 to destroy.

Changes to Outputs:
  <span style="color:red;">-</span> fabric_capacity_id     = &quot;3da9391c-0cbb-4005-952a-1007a3021888&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
  <span style="color:red;">-</span> fabric_capacity_region = &quot;UK South&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
<span style="font-weight:bold;">
Do you really want to destroy all resources?</span>
  Terraform will destroy all your managed infrastructure, as shown above.
  There is no undo. Only 'yes' will be accepted to confirm.

  <span style="font-weight:bold;">Enter a value:</span> yes
<span style="font-weight:bold;">fabric_workspace_role_assignment.example: Destroying... [id=911aba7f-a5ff-478f-8ca5-a90883646482]</span>
<span style="font-weight:bold;">fabric_workspace_role_assignment.example: Destruction complete after 1s</span>
<span style="font-weight:bold;">fabric_workspace.example: Destroying... [id=07fc0d02-3fb1-424a-b3dc-9e55c4075684]</span>
<span style="font-weight:bold;">fabric_workspace.example: Destruction complete after 7s</span>
<span style="font-weight:bold;"></span><span style="font-weight:bold;color:green;">
Destroy complete! Resources: 2 destroyed.
</span></pre>
     {{< /raw >}}

## Example config

As promised, here is an example main.tf file for anyone less familiar with Terraform and struggled with adding the role assignment.

{{< flash >}}
Note that the object_id here is for a security group called Sales in my tenant.

- Change it to the object_id of a user or a group in your tenant
- If you change it to a user then don't forget to change the principal.type value to "User"
  {{< /flash >}}

```ruby
data "fabric_capacity" "example" {
  display_name = var.fabric_capacity_name

  lifecycle {
    postcondition {
      condition     = self.state == "Active"
      error_message = "Fabric Capacity is not in Active state. Please check the Fabric Capacity status."
    }
  }
}

resource "fabric_workspace" "example" {
  display_name = var.fabric_workspace_display_name
  description  = var.fabric_workspace_description

  capacity_id = data.fabric_capacity.example.id

  identity = {
    type = "SystemAssigned"
  }
}

resource "fabric_workspace_role_assignment" "example" {
  workspace_id = fabric_workspace.example.id
  principal = {
    id   = "911aba7f-a5ff-478f-8ca5-a90883646482"
    type = "Group"
  }
  role = "Member"
}
```

## Next

The config is good.

Next we will create a service principal that can be used by the fabric provider.

Then we'll push the change up into the GitHub repo, configure the federated credentials for the service principal, add some GitHub Actions variables, and run the pipeline.
