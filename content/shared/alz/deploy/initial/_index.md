---
headless: true
title: "Azure Landing Zones - Create an initial config"
---

## Clone the repo

1. Variables

    ```bash
    github_org="richeney-org"
    github_repo="alz-mgmt"
    ```

1. Clone the repo

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

## Azure Landing Zone Library

We will be looking at libraries in greater detail in another series, but for the moment here is a brief introduction.

The [Azure Landing Zones Terraform provider](https://registry.terraform.io/providers/Azure/alz/latest/docs) can generate library definitions from different sources. These are then referenced by the [ALZ Terraform module](https://registry.terraform.io/modules/Azure/avm-ptn-alz/azurerm/latest).

The provider can pull from more than one source, and those sources can have dependencies on other libraries, which provides great scope for extensibility and customisation. We will look at this from a Microsoft partner perspective.

The most common library source is the [ALZ Library repo](https://aka.ms/alz/library) which is actively maintained by the Microsoft Customer Architecture and Engineering team (CAE). The repo contains library definitions for Azure Landing Zones, Sovereign Landing Zones, and Azure Monitoring Baseline Alerts. All are semantically versioned and you can view the [releases](https://github.com/Azure/Azure-Landing-Zones-Library/releases).

You can read the documentation for the Azure Landing Zone libraries at <https://azure.github.io/Azure-Landing-Zones-Library>.

{{< modes >}}
{{< mode title="Azure Landing Zone" >}}

{{% shared-content "alz/deploy/initial/alz" %}}

{{< /mode >}}
{{< mode title="Sovereign Landing Zone" >}}

{{% shared-content "alz/deploy/initial/slz" %}}

{{< /mode >}}
{{< /modes >}}

## Override the backend

<TODO> Explain why

Create a terraform_override.tf

```go
terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}
```

Note greyed out.

Also

```shell
export ARM_SUBSCRIPTION_ID="<managementSubscriptionId>"
```

Local init, fmt, validate, plan - should show over 600 resources.

DON'T APPLY!!!! You really shouldn't be able to.
