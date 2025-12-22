---
headless: true
title: "Azure Landing Zones - Test a config"
---

## Overview

On this page you will locally test your config will pass the test within the continuous integration (CI) workflow. These test that your config meets minimum standards

- formatting needs to be compliant with the canonical format and style based on gofmt, as tested and corrected by the `terraform fmt` command
- runs the `terraform init` command to confirm that the various providers and modules are coherent, including the semantic version constraints
- passes the `terraform validate` command which ensures that your config is syntactically sound
- successfully runs `terraform plan` to generate a plan

The various providers in your config, such as azurerm and azapi, have additional checks within the resource types, so this will surface any additional issues in the config or current environment.

The plans are usually run by the GitHub Actions workflows and those workflows rely on the GitHub Actions variables to define the subscription ID and backend, i.e. the storage account container and key (blob) file. You'll see how you can override the backend with a terraform_override.tf file to enable local testing without exporting environment variables.

{{< flash "warn" >}}
⚠️ You **must not** attempt to run terraform apply locally. You will use the CI/CD workflow in the next page instead.
{{< /flash >}}

## Override the backend

The terraform block in the terraform.tf file includes an empty backend.

```go
  backend "azurerm" {}
```

The workflow's will use the `BACKEND_AZURE_*` environment variables within the terraform init steps so that the managed identities write the remote state file to the correct storage account and container.

Before we progress we want to make sure that your config will pass the CI checks, so we will locally override the backend so that you can run the tests at the CLI.

{{% modes %}}
{{% mode title="Local backend" %}}

Using a local backend is the easiest approach for basic testing of a config. It will check to ensure that a plan can be created, and nothing more.

This approach does not need any RBAC role assignment or network settings on the storage account to work as you are only creating a local terraform.tfstate file.

1. Create a terraform_override.tf

    ```go
    terraform {
      backend "local" {
        path = "terraform.tfstate"
      }
    }
    ```

    ℹ️ The file should be greyed out in Visual Studio Code's explorer pane as this filename is included in the .gitignore. It will not be included in any git commits.

1. Set the ARM_SUBSCRIPTION_ID env var

    The config is also expecting a subscription ID for the main azurerm provider block. Export the environment variable, setting it to the management subscription GUID.

    ```shell
    export ARM_SUBSCRIPTION_ID="managementSubscriptionId"
    ```

    Alternatively, here is a similar command that exports the subscription ID based on the name for the subscription.

    ```shell
    export ARM_SUBSCRIPTION_ID=$(az account list --query "[?name == 'Management']".id --output tsv)
    ```

    Regardless of which approach you use, make sure that you set the subscription ID or the name of the subscription.



{{% /mode %}}
{{% /modes %}}

## Format

Check the formatting is compliant with the canonical format and style based on gofmt standards.

```shell
terraform fmt
```

This command will automatically correct issues where possible, listing the files it has modified.

There is no command output if all of the .tf files are already compliant.

## Initialise

Initialise Terraform to confirm that the various providers and modules are coherent, including the semantic version constraints.

```shell
terraform init
```

## Validate the files

Confirm that the config is syntactically sound.

```shell
terraform validate
```

Correct any errors until terraform validate succeeds.

{{< raw >}}
<body style="color:white; background-color:black">
<pre>
<span style="color:lime;">Success!</span> The configuration is valid.
</pre>
</body>
{{< /raw >}}

## Plan (optional)

{{< flash "danger" >}}
⚠️ REMEMBER - DO NOT RUN `terraform apply` at the CLI for these labs! The apply will be done via the CI/CD pipelines on the next page.
{{< /flash >}}

Assuming that your ID has access to view the resources in both Azure and GitHub then you can test to see if the plan will succeed.

{{% modes %}}
{{% mode title="Local backend" %}}

Run a plan using the local backend override.

```shell
terraform plan
```

    The output will show that terraform plans to create over 600 resources.

If your ID does **not** have that access the the plan should correctly fail. If so then skip this step and move onto the next page. When you commit your changes and create your pull request then the terraform plan will be tested in the CI workflow.

{{< flash >}}
Note that running `terraform plan` locally just checks the code and is not using the remote state in the storage account as we overrode the backend to use a local backend instead.

The terraform plan outputs in the CI/CD pipelines will provide the accurate and definitive diff and should always be properly reviewed.
{{< /flash >}}
{{% /mode %}}
{{% mode title="Remote backend" %}}
If you have configured read access to the
{{% /mode %}}
{{% /modes %}}
