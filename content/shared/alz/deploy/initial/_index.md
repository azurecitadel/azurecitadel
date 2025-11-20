---
headless: true
title: "Azure Landing Zones - Create an initial config"
---

## Clone the repo

1. Variables

    ```bash
    github_repo="alz-mgmt"
    github_org="richeney-org"
    ```

    ⚠️ Set to the correct values for your repo and org names.

1. Clone the repo

    You may wish to switch to your standard directory for your git repos, if you have one.

    ```bash
    git clone https://github.com/${github_org}/${github_repo}
    ```

1. Change directory

    ```bash
    cd $github_repo
    ```

1. Open Visual Studio Code

    ```bash
    code .
    ```

## What is the ALZ Library repo?

We will be looking at libraries in greater detail in another series, but for the moment here is a brief introduction. You can read the documentation for the Azure Landing Zone libraries at <https://azure.github.io/Azure-Landing-Zones-Library>.

Libraries contain definitions for core compliancy guardrails. They define archetypes, collections of Azure Policy policies, initiatives, and assignments, plus custom role definitions. The archetypes. The architecture definitions then define the set of management groups, including their name, cosmetic display names, and the array of archetypes assigned to them.

The [Azure Landing Zones Terraform provider](https://registry.terraform.io/providers/Azure/alz/latest/docs) can pull library definitions from different sources. These are then referenced by the [ALZ Terraform module](https://registry.terraform.io/modules/Azure/avm-ptn-alz/azurerm/latest) which specifies the architecture_name as well as any additional modifications, default values, etc. The two are closely related and these labs will help you to understand both.

The provider can pull from more than one source, and those sources can have dependencies on other libraries, which provides great scope for extensibility and customisation. We will explore this from a Microsoft partner perspective,  extending the Azure Landing Zone and Sovereign Landing Zone baselines with reusable partner libraries, including country and industry packs for the sovereignty context. In addition, we will explore using archetype overrides to allow individual customers to customise their deployments.

The most common library source is the [ALZ Library repo](https://aka.ms/alz/library) which is actively maintained by the Microsoft Customer Architecture and Engineering team (CAE). The repo contains library definitions for Azure Landing Zones, Sovereign Landing Zones, and Azure Monitoring Baseline Alerts. All are semantically versioned and you can view the [releases](https://github.com/Azure/Azure-Landing-Zones-Library/releases).

{{< modes >}}
{{< mode title="Azure Landing Zone" >}}

{{% shared-content "alz/deploy/initial/alz" %}}

{{< /mode >}}
{{< mode title="Sovereign Landing Zone" >}}

{{% shared-content "alz/deploy/initial/slz" %}}

{{< /mode >}}
{{< /modes >}}

## Test Locally

We'll now run a few tests locally before we commit the changes and create a pull request. We'll override the backend so that we can run terraform commands at the CLI. , and then run a few commands to ensure we'll pass the continuous integration (CI) workflow's inbuilt checks.

### Override the backend

The terraform block in the terraform.tf file includes an empty backend.

```go
  backend "azurerm" {}
```

The workflow's will use the `BACKEND_AZURE_*` environment variables within the terraform init steps so that the managed identities write the remote state file to the correct storage account and container.

Before we progress we want to make sure that your config will pass the CI checks, so we will locally override the backend so that you can run the tests at the CLI.

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
    export ARM_SUBSCRIPTION_ID="{managementSubscriptionId}"
    ```

### Check your config

1. Check the format

    The CI checks will ensure that your committed code aligns with gofmt standards.

    ```shell
    terraform fmt
    ```

    This command will automatically correct issues where possible, listing the files it has modified. If there is no command output then all of the files are already compliant.

1. Initialise

    ```shell
    terraform init
    ```

    Confirm that terraform has been successfully initialized and has downloaded the providers as expected.

1. Validate

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

### Plan (optional)

If your ID has access to view the resources in both Azure and GitHub then you can test to see if the plan will succeed.

If your ID does **not** have that access the the plan should correctly fail. If so then skip this step and move onto the next page. When you commit your changes and create your pull request then the terraform plan will be tested in the CI workflow.

{{< flash >}}
Note that running `terraform plan` locally just checks the code and is not using the remote state in the storage account as we overrode the backend. This may be more noticeable when adding in additional changes in later labs, but the displayed planned changes may be disregarded as it is really just a deeper validation at this stage.

The terraform plan outputs in the CI/CD pipelines will provide the accurate and definitive diff and should always be properly reviewed.
{{< /flash >}}

{{< flash "danger" >}}
⚠️ DO NOT RUN `terraform apply`! You will do this via the CI/CD pipelines on the next page.
{{< /flash >}}

1. Plan

    ```shell
    terraform plan
    ```

    The output will show that terraform plans to create over 600 resources.

## Next

If the tests all look good then your config should pass the CI tests. You're done on this page.

On the next page we will run through the standard branch based workflow to commit your changes into a new branch and submit a pull request to trigger the CI/CD pipelines.
