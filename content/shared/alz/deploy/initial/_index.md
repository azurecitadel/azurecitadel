---
headless: true
title: "Azure landing zone - Create an initial config"
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

We will be looking at libraries in greater detail in another series, but for the moment here is a brief introduction. You can read the documentation for the Azure landing zone libraries at <https://azure.github.io/Azure-Landing-Zones-Library>.

Libraries contain definitions for core compliancy guardrails. They define archetypes, collections of Azure Policy policies, initiatives, and assignments, plus custom role definitions. The archetypes. The architecture definitions then define the set of management groups, including their name, cosmetic display names, and the array of archetypes assigned to them.

The [Azure landing zone Terraform provider](https://registry.terraform.io/providers/Azure/alz/latest/docs) can pull library definitions from different sources. These are then referenced by the [ALZ Terraform module](https://registry.terraform.io/modules/Azure/avm-ptn-alz/azurerm/latest) which specifies the architecture_name as well as any additional modifications, default values, etc. The two are closely related and these labs will help you to understand both.

The provider can pull from more than one source, and those sources can have dependencies on other libraries, which provides great scope for extensibility and customisation. We will explore this from a Microsoft partner perspective,  extending the Azure landing zone and Sovereign landing zone baselines with reusable partner libraries, including country and industry packs for the sovereignty context. In addition, we will explore using archetype overrides to allow individual customers to customise their deployments.

The most common library source is the [ALZ Library repo](https://aka.ms/alz/library) which is actively maintained by the Microsoft Customer Architecture and Engineering team (CAE). The repo contains library definitions for Azure landing zone, Sovereign landing zone, and Azure Monitoring Baseline Alerts. All are semantically versioned and you can view the [releases](https://github.com/Azure/Azure-Landing-Zones-Library/releases).

{{< modes >}}
{{< mode title="Azure landing zone" >}}

{{% shared-content "alz/deploy/initial/alz" %}}

{{< /mode >}}
{{< mode title="Sovereign landing zone" >}}

{{% shared-content "alz/deploy/initial/slz" %}}

{{< /mode >}}
{{< /modes >}}

## Next

The config in your repo will work as it stands with its direct use of the platform library.

Skip the next page and you will get the standard set of definitions and assignments from the standard alz or slz platform library as you test your repo locally and then deploy via the CI/CD pipelines. Absolutely valid, but not recommended. Why not?

The next page will take you through the steps to configure a local override library. Even if you have no need to use an override on day one this approach gives you the flexibility to do so in the future. It also gives you a local metadata file and architecture file and you will see in the examples how you can update these when you add in additional hosted custom libraries without causing massive trauma to your Terraform state file.
