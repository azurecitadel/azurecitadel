---
title: "Prereqs"
description: "Check that you have a few things in place before going through the Microsoft Fabric Administrator quickstart."
layout: single
draft: false
menu:
  side:
    parent: fabric
    identifier: fabric-prereqs
series:
 - fabric_terraform_administrator
weight: 5
---

## Access

These labs assume that you are:

- Owner on an Azure subscription (or Contributor + RBAC Administrator)
- Global Administrator in Entra ID (or Directory Reader + Application Administrator + Fabric Administrator)

## Terraform

It is assumed that you are already familiar with Terraform.

If not then there are plenty of introductions to Terraform on [Microsoft Learn](https://learn.microsoft.com/azure/developer/terraform/overview), [Hashicorp](https://developer.hashicorp.com/terraform/tutorials/azure-get-started), this [Azure Citadel](../terraform/) site, and elsewhere.

## Providers

You only need one subscription for this quickstart but it needs a few providers registered.

1. Log into the right subscription context.

    ```shell
    az login
    az account set --subscription "<subscriptionNameOrId>"
    az account show
    ```

1. Register the providers if they aren't registered already.

    ```shell
    az provider register --namespace Microsoft.Authorization
    az provider register --namespace Microsoft.Fabric
    az provider register --namespace Microsoft.Resources
    az provider register --namespace Microsoft.Storage
    ```

> Note that the example does allow for the storage account (for Terraform remote state) to be placed in a different subscription, e.g. a management subscription in an ALZ platform landing zone.

## Tooling

The labs assume that you already have

- Azure CLI
- GitHub CLI
- Terraform
- Visual Studio Code

If you are missing any of these then the [setup](../setup) page has instructions and links to help you.

The labs have been written from a bash shell perspective (e.g. WSL on Windows, or bash in macOS).

### Azure CLI fabric extension

Add on the fabric extension for the Azure CLI to get the `az fabric capacity` commands.

```shell
az extension add --name microsoft-fabric
```

### Fabric CLI

The Fabric CLI is also used. The install requires python (3.10, 3.11 or 3.12).

- Standard install

    The standard installation is below, but may fail on Ubuntu/Debian.

    ```shell
    pip install ms-fabric-cli
    ```

    > To update the Fabric CLI for a standard install, run `pip upgrade ms-fabric-cli`.

- Virtual environment install (optional)

    ⚠️ Only needed if you get `error: externally-managed-environment` from the standard install.

    ```shell
    sudo apt update && sudo apt install python3.12-venv pipx -y
    pipx install ms-fabric-cli
    pipx ensurepath
    ```

    > To update the Fabric CLI within a virtual environment, run `pipx upgrade ms-fabric-cli`.

- Check the version

    ```shell
    fab --version
    ```

    Example output:

    ```text
    fab version 0.2.0 (2025)
    ```

- Authenticate

    ```shell
    fab auth login
    ```

- Check the authentication

    ```shell
    fab auth status
    ```

    Example output:

    ```text
    ✓ Logged in to app.fabric.microsoft.com
      - Account: richeney@MngEnvMCAP520989.onmicrosoft.com (<objectId>)
      - Tenant ID: <tenantId>
      - Token (fabric/powerbi): eyJ0************************************
      - Token (storage): eyJ0************************************
      - Token (azure): eyJ0************************************
    ```

Feel free to refer to the [blog](https://blog.fabric.microsoft.com/en-gb/blog/introducing-the-fabric-cli-preview), [GitHub Pages](https://aka.ms/fabric-cli) and [docs](https://learn.microsoft.com/rest/api/fabric/articles/fabric-command-line-interface) for more information on the Fabric CLI.

## Next

Right, you should be set up and good to go. Move to the next page to list out your available Fabric capacity.
