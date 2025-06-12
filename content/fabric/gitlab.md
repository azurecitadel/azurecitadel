---
title: "GitLab"
description: "See how GitLab differs from GitHub when configuring OpenID Connect and workflows."
layout: single
draft: false
menu:
  side:
    parent: fabric
    identifier: fabric-gitlab
series:
 - fabric_terraform_administrator
weight: 50
---

## Introduction

There are numerous cloud Git platforms that could host your Microsoft Fabric deployment workflows. The two most commonly used on Azure are the first party products, i.e. GitHub Actions and Azure DevOps pipelines, but OpenID Connect is part of the OAuth2.0 open standard and supports a wide range of third party platforms.

In practice most workload identities serve a specific purpose and you will normally see a single federated credential representing a 1:1 relationship between the trusted identity provider (IdP) and the context. However, the platform does support up to ten federated credentials so no problem with adding one.

On this page we will switch the upstream for our Git repo to GitLab. You will see the difference in the federated credential, but in reality the platforms have plenty in common.

I am not a GitLab expert, so please feel free to jump on the source repo for this site and create an enhancement if you see errors, or want to suggest a more common approach for those working with GitLab on a day to day basis.

## Pre-reqs

You will need

- a [GitLab account](https://gitlab.com/users/sign_up)
- the [GitLab Workflows extension in vscode](https://marketplace.visualstudio.com/items?itemName=GitLab.gitlab-workflow)

After you sign up you should have a group and a default project. Feel free to remove the project as we will push our current repo later on this page.

## Add environment variables to GitLab

1. Set the variables

    Set these to your correct values.

    ```shell
    fabric_subscription_id="<subscriptionGuid>"
    backend_subscription_id="<subscriptionGuid>"
    resource_group_name="terraform"
    managed_identity_name="fabric_terraform_provider"
    ```

    ```shell
    fabric_subscription_id="73568139-5c52-4066-a406-3e8533bb0f15"
    backend_subscription_id="73568139-5c52-4066-a406-3e8533bb0f15"
    resource_group_name="terraform"
    managed_identity_name="fabric_terraform_provider"
    ```

    ⚠️ If you have used a single subscription then set both subscription_id variables to the same value.

1. Derive additional values then display the suggested GitLab variable names and values

    ```shell
    tenant_id=$(az account show --name $fabric_subscription_id --query tenantId -otsv)
    client_id=$( az identity show --name fabric_terraform_provider --resource-group $resource_group_name --subscription $backend_subscription_id --query clientId -otsv)
    storage_account_name=$(az storage account list --resource-group $resource_group_name --subscription $backend_subscription_id --query "[?starts_with(name,'terraformfabric')]|[0].name" -otsv)

    echo
    echo "ARM_TENANT_ID                                   $tenant_id"
    echo "ARM_SUBSCRIPTION_ID                             $fabric_subscription_id"
    echo "ARM_CLIENT_ID                                   $client_id"
    echo "BACKEND_AZURE_SUBSCRIPTION_ID                   $backend_subscription_id"
    echo "BACKEND_AZURE_RESOURCE_GROUP_NAME               terraform"
    echo "BACKEND_AZURE_STORAGE_ACCOUNT_NAME              $storage_account_name"
    echo "BACKEND_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME    prod"
    echo "TFVARS_FILE                                     prod.tfvars"
    ```

## Add GitLab variables

1. Open GitLab and navigate into your repo
1. Open Settings > CI/CD in the sidebar
1. Expand the _Variables_ section
1. Add project variables for each of the required variables using the information output to screen above

    ℹ️ For this lab I unchecked _Protect variable_ on each as I was not focusing on GitLab branch protections. Note that you can download and configure the [glab CLI](https://gitlab.com/gitlab-org/cli) with a personal access token if you wish to automate this step as well.

## Federated credential

### Portal

1. Navigate back to your managed identity in the Azure Portal
1. Settings > Federated credentials
1. Add credential

    - federated credential scenario: **Other**
    - issuer URL

        ```text
        https://gitlab.com
        ```

    - subject identifier

        ```text
        project_path:<group>/<project>:ref_type:branch:ref:main
        ```

    - name: unique identifier, e.g. **gitlab-main-branch**

### CLI

1. Variables

    ```shell
    rg="terraform"
    identity="fabric_terraform_provider"
    gitlab_group="richeney-group"
    gitlab_project="fabric_terraform_provider"
    branch="main"
    ```

1. Add the federated credential to your managed identity

    ```shell
    az identity federated-credential create --name gitlab-main-branch \
      --identity-name $identity --resource-group $rg \
      --audiences "api://AzureADTokenExchange" "https://gitlab.com" \
      --issuer "https://gitlab.com" \
      --subject "project_path:$gitlab_group/$gitlab_project:ref_type:branch:ref:$branch"
    ```

    Example output:

    ```json
    {
      "audiences": [
        "api://AzureADTokenExchange"
      ],
      "id": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15/resourcegroups/terraform/providers/Microsoft.ManagedIdentity/userAssignedIdentities/fabric_terraform_provider/federatedIdentityCredentials/gitlab-main-branch",
      "issuer": "https://gitlab.com",
      "name": "gitlab-main-branch",
      "resourceGroup": "terraform",
      "subject": "project_path:richeney-group/fabric_terraform_provider:ref_type:branch:ref:main",
      "systemData": null,
      "type": "Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials"
    }
    ```

## References

- <https://spacelift.io/blog/gitlab-ci-yml>
- <https://docs.gitlab.com/ci/secrets/id_token_authentication/>
- <https://gitlab.com/demos/infrastructure/terraform-multi-env/-/blob/main/helper.yml>
