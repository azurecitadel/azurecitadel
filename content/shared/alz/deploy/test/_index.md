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

{{< flash >}}
Using a local backend is the easiest approach for basic testing of a config. On the positive side it will check to ensure that a plan can be created - and nothing more. That is sufficient to be able to commit and publish a branch assuming the fmt and validate checks have also been met.

On the negative side you do not get a true idea what the proposed changes will be as you are not using the same state file as the CI/CD workflows. For that you need the remote backend.
{{< /flash >}}

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
{{% mode title="Remote backend" %}}

{{< flash >}}
Using the same remote backend as the CI/CD pipelines is a fantastic way to make changes to a config locally and then view the diff plan created by terraform.

Setting this up takes a little more work and access but it is worth the effort.
{{< /flash >}}
{{< flash "warn" >}}
⚠️ Note that this option requires a privileged role. The RBAC role assignment and storage account networking changes weaken security. Check the warnings against those steps.
{{< /flash >}}

1. Set the variables using the GitHub Actions variables

    You will need to be authenticated in the GitHub CLI (`gh auth status`) and you must also have jq installed.

    ```shell
    vars=$(gh variable list --json name,value | jq 'map({(.name): .value}) | add')
    sub="$(jq -r .AZURE_SUBSCRIPTION_ID <<< $vars)"
    rg="$(jq -r .BACKEND_AZURE_RESOURCE_GROUP_NAME <<< $vars)"
    sa="$(jq -r .BACKEND_AZURE_STORAGE_ACCOUNT_NAME <<< $vars)"
    container="$(jq -r .BACKEND_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME <<< $vars)"
    ```

1. Create the override file

    ```shell
    cat > terraform_override.tf << EOF
    # Overrides to enable local terraform plan

    terraform {
      backend "azurerm" {
        use_azuread_auth     = true
        subscription_id      = "$sub"
        resource_group_name  = "$rg"
        storage_account_name = "$sa"
        container_name       = "$container"
        key                  = "terraform.tfstate"
      }
    }

    provider "azurerm" {
      subscription_id = "$(jq -r .AZURE_SUBSCRIPTION_ID <<< $vars)"
    }
    EOF
    echo "Created terraform_override.tf using the GitHub Actions variables"
    ```

1. Assign the Storage Blob Data Reader role

    ⚠️ This role will give access to view any sensitive values stored in the state file.

    ```shell
    id="/subscriptions/$sub/resourceGroups/$rg/providers/Microsoft.Storage/storageAccounts/$sa"
    scope="$id/blobServices/default/containers/$container"
    az role assignment create --role "Storage Blob Data Reader" --scope $scope --assignee $(az ad signed-in-user show --query id -otsv)
    ```

1. Allow my public IP access to the storage account

    ⚠️ This increases the attack surface of the storage account by making it vulnerable to potential IP address spoofing attacks.

    ```shell
    address=$(curl -s ipinfo.io/ip) # address=$(curl -s ipinfo.io/ip | cut -d. -f1-2).0.0/16
    az storage account update --ids "$id" --public-network-access Enabled --default-action Deny
    az storage account network-rule add --subscription "$sub" --resource-group "$rg" --account-name  "$id" --ip-address "$address"
    ```

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

{{< flash >}}
Note that running `terraform plan` locally just checks the code and is not using the remote state in the storage account as we overrode the backend to use a local backend instead..

The terraform plan outputs in the CI/CD pipelines will provide the accurate and definitive diff and should always be properly reviewed.
{{< /flash >}}
{{% /mode %}}
{{% mode title="Remote backend" %}}
Run a plan using the remote state file.

```shell
terraform plan -lock=false
```

Note that the Storage Blob Data Reader role cannot create leases on the blobs which is the mechanism used for state locking.

{{% /mode %}}
{{% /modes %}}
