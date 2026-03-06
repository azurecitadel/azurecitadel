---
title: "Prerequisites"
description: "Check what you need before working through the CMK labs."
date: 2026-03-06
author: [ "Richard Cheney" ]
draft: false
weight: 38
menu:
  side:
    parent: cmk
    identifier: cmk-prereqs
series:
  - cmk
---

## Access

The labs assume you are either **Owner** or have **Contributor** plus **Role Based Access Control Administrator** on an Azure subscription.

You will need to create role assignments on Key Vault and on the individual Azure resources, so the RBAC Administrator role (or Owner) is required.

## Tooling

The labs are written for the Azure CLI. Ensure you have a recent version installed and that you are authenticated:

1. Log in and set your subscription.

    ```shell
    az login
    az account show
    az account set --subscription "<subscriptionNameOrId>"
    ```

    If you prefer the Portal or Bicep, the Microsoft Learn references linked in each lab will cover those routes.

## Why we use Key Vault Premium for these labs

{{% shared-content "cmk/skucost" %}}

## Resource Group

Set your default region and create a resource group for the labs. The `AZURE_DEFAULTS_LOCATION` and `AZURE_DEFAULTS_GROUP` environment variables are recognised by the Azure CLI and remove the need to pass `--location` and `--resource-group` on every command.

1. Set the default region. `swedencentral` has Confidential VM support — substitute your preferred region if needed.

    ```shell
    export AZURE_DEFAULTS_LOCATION=swedencentral
    ```

1. Create the resource group and set it as the default.

    ```shell
    export AZURE_DEFAULTS_GROUP=cmk
    az group create --name $AZURE_DEFAULTS_GROUP
    ```

## Creating an Azure Key Vault Premium

Standard tier does not support HSM-backed keys or Secure Key Release, so Premium is required. Key Vault names must be globally unique.

1. Set a name and create the vault.

    ```shell
    export KV_NAME=cmk-${RANDOM}

    az keyvault create \
      --name $KV_NAME \
      --sku premium \
      --enable-rbac-authorization true
    ```

    {{< flash "tip" >}}
`--enable-rbac-authorization true` switches the vault to RBAC mode. The labs use role assignments rather than access policies, which aligns with how CMK works across Azure services.
{{< /flash >}}

If you already have an existing Key Vault at Standard tier, create a new one at Premium — you cannot change the SKU on an existing vault.

## Suggested region

The labs use `swedencentral` as the default. If you prefer a different region, ensure it supports Confidential VMs — `eastus2` is an alternative. Update the `AZURE_DEFAULTS_LOCATION` export in the Resource Group section above.

The SKR lab uses a VM from the [DCasv5 or ECasv5 series](https://learn.microsoft.com/azure/virtual-machines/dcasv5-dcadsv5-series) (AMD SEV-SNP). Check your subscription quota for these sizes in `swedencentral` before starting.
