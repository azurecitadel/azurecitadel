---
title: "Service Principals & PAL"
date: 2025-10-10
author: [ "Richard Cheney" ]
description: "Using service principals is a good option to avoid recognition issues when users are offboarded from a custom tenant. Here are a few approaches."
draft: false
weight: 50
menu:
  side:
    parent: pal
    identifier: pal-sp
series:
  - pal
---

## In brief

There are a few scenarios for using service principals with Partner Admin Link. This page will cover the following:

1. Adding a Partner Admin Link to an existing service principal (auth via secret or cert)

    Use this when you already have a service principal with eligible RBAC role assignments and you have access to the secret or cert.

1. Adding a Partner Admin Link to a service principal via a CI/CD workflow

    If you have access to CI/CD workflows or pipelines that deploy resources then the service principal can be associated with your Partner ID.

1. Creating a new service principal purely for recognition purposes

    There are scenarios where the partner has had influence in an account but the customer does not want the partner to have long term access. For instance, advisories and short term professional services project engagements. This is a potential approach to associate the telemetry for recognition.

## Service principal with secret or cert

In this scenario it is assumed that there is an existing service principal that has existing Azure RBAC role assignments with PEC eligible roles.

{{< flash >}}
⚠️ Note that you cannot create a Partner Admin Link for a service principal using the Azure Portal.
{{< /flash >}}

{{< modes default="PowerShell" >}}
  {{< mode title="PowerShell" >}}

  ### Use PowerShell to create the link for a service principal

  1. Install the [Az.ManagementPartner](https://www.powershellgallery.com/packages/Az.ManagementPartner/) PowerShell module.

      ```powershell
      Install-Module -Name Az.ManagementPartner -Repository PSGallery -Force
      ```

  1. Sign in to the customer's tenant as the service principal.

      Using a secret.

      ```powershell
      $clientSecret = ConvertTo-SecureString "<clientSecret>" -AsPlainText -Force
      $credential = New-Object System.Management.Automation.PSCredential("<clientId>", $clientSecret)
      Connect-AzAccount -ServicePrincipal -TenantId <tenantId> -Credential $credential
      ```

      Or using a certificate.

      ```powershell
      Connect-AzAccount -ServicePrincipal -TenantId <tenantId> -CertificateThumbprint <thumbprint> -ApplicationId <clientId>
      ```

  1. Create the Partner Admin Link.

      ```powershell
      New-AzManagementPartner -PartnerId <partnerId>
      ```

  The additional AzManagementPartner cmdlets are the same as for managing links for [users](/pal/users/#creating-the-partner-admin-link).

  {{< /mode >}}
  {{< mode title="Azure CLI" >}}

  ### Use the Azure CLI to create the link

  1. Install the Azure CLI's managementpartner extension.

      ```bash
      az extension add --name "managementpartner"
      ```

  1. Sign in to the customer's tenant as the service principal.

      Using a secret.

      ```bash
      az login --service-principal --user "<clientId>" --password "<clientSecret>" --tenant "<tenantId>"
      ```

      Or using a certificate.

      ```bash
      az login --service-principal --user "<clientId>" --tenant "<tenantId>" --certificate "<pathToCertificate>"
      ```

  1. Create the Partner Admin Link.

      ```bash
      az managementpartner create --partner-id "<partnerId>"
      ```

  The additional Azure CLI commands are the same as for managing links for [users](/pal/users/#creating-the-partner-admin-link).

  {{< /mode >}}
{{< /modes >}}

Partner Admin Link should now associate telemetry for all resources under the service principal's RBAC role assignments, assuming they include a PEC eligible role.

## Service principals used in CI/CD workflows

This scenario is for when you no longer have the secret or cert for a service principal, but you do have permission to create or modify pipelines or workflows in your CI/CD platform. These commonly use service principals when interacting with Azure environments. Historically they would have the client secret stored as a pipeline secret whereas it is now increasingly common to leverage OpenID Connect (OIDC) using a federated workload credential.

This example is based on OpenID Connect.

### Check the subject in the federated credential

With OpenID Connect the service principal uses a federated credential to define the trust relationship to another identity provider and the context in which that is valid. This is far more secure than having a client secret that may be used for manual authentication, exactly as shown in the section above. (Removing the maintenance overhead of rotating secrets is another benefit.)

1. Open the [Entra admin portal](https://entra.microsoft.com/#home)
1. Open Entra ID > [App Registrations](https://entra.microsoft.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade/quickStartType//sourceType/Microsoft_AAD_IAM)
1. Click on **All applications**, filter the app registrations using the displayName or appId / clientId, and select
    ℹ️ If you don't know the appId then you can search the [Enterprise apps](https://entra.microsoft.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade) for the service principal's objectId and retrieve the appId from there.
1. Click on **Certificates and secrets** to view the federated credential's **Subject identifier or claims matching expression**

    {{< modes default="GitHub" >}}
{{< mode title="GitHub" >}}

![App registration's federated credential for a GitHub repo's main branch](/pal/images/appreg-fedcred.png)

The subject identifier for the example is repo:azurecitadel/my-terraform-workload-repo:ref:refs/heads/main, so OpenID Connect will only succeed for workflows run from this repository's main branch. Here are the most common entity types supported for GitHub.

|Entity Type|Example|
|---|---|
|Environment|repo:azurecitadel/my-terraform-workload-repo:environment:prod|
|Branch|repo:azurecitadel/my-terraform-workload-repo:ref:refs/heads/main|
|Pull request|repo:azurecitadel/my-terraform-workload-repo:pull_request|
|Tag|repo:azurecitadel/my-terraform-workload-repo:ref:refs/tags/v1.0|

{{< /mode >}}
{{< /modes >}}

After examining the federated credential, you can determine where the workflow needs to be run from to be successful.

{{< flash >}}
If your service principal is set with a client secret then you can skip the step checking the federated credential. Customise the workflow to match [Azure/login's service principal secret](https://github.com/Azure/login?tab=readme-ov-file#login-with-a-service-principal-secret) guidance.
{{< /flash >}}

### Create and run a workflow

This step assumes you have the permissions to create, commit, and run workflows that meet the subject criteria in the federated credential.

1. Create a new branch, e.g. `pal`
1. Create a new workflow, e.g. `.github/workflows/pal.yml`
1. Add in the example YAML workflow

    {{< modes default="Azure CLI" >}}
{{< mode title="Azure CLI" >}}

```yaml
# Partner Admin Link using the Azure CLI with OpenID Connect

name: Configure PAL using the Azure CLI
on:
  workflow_dispatch:
    inputs:
      action:
        type: choice
        description: 'Action to perform'
        default: 'Create'
        options:
          - Create
          - Delete
        required: true
      partnerId:
        description: 'Partner ID'
        required: true

permissions:
      id-token: write
      contents: read

jobs:
  PAL:
    runs-on: ubuntu-latest
    steps:
    - name: Login to Azure using OIDC
      uses: azure/login@v2
      with:
        tenant-id: ${{ vars.ARM_TENANT_ID }}
        client-id: ${{ vars.ARM_CLIENT_ID }}
        allow-no-subscriptions: true

    - name: ${{ github.event.inputs.action }} the Partner Admin Link
      uses: azure/cli@v2
      with:
        azcliversion: latest
        inlineScript: |
            az extension add --name managementpartner
            az managementpartner ${{ github.event.inputs.action == 'Create' && 'create' || 'delete' }} --partner-id ${{ github.event.inputs.partnerId }} --output jsonc
```

{{< /mode >}}
{{< mode title="PowerShell" >}}

```yaml
# Partner Admin Link using PowerShell with OpenID Connect

name: Configure PAL using PowerShell
on:
  workflow_dispatch:
    inputs:
      action:
        type: choice
        description: 'Action to perform'
        default: 'Create'
        options:
          - Create
          - Delete
        required: true
      partnerId:
        description: 'Partner ID'
        required: true

permissions:
      id-token: write
      contents: read

jobs:
  PAL:
    runs-on: ubuntu-latest
    steps:
    - name: Login to Azure using OIDC
      uses: azure/login@v2
      with:
        tenant-id: ${{ vars.ARM_TENANT_ID }}
        client-id: ${{ vars.ARM_CLIENT_ID }}
        allow-no-subscriptions: true
        enable-AzPSSession: true

    - name: ${{ github.event.inputs.action }} the Partner Admin Link
      uses: azure/powershell@v2
      with:
        azPSVersion: latest
        inlineScript: |
          Install-Module -Name Az.ManagementPartner -Repository PSGallery -Force
          ${{ github.event.inputs.action == 'Create' && 'New-AzManagementPartner' || 'Remove-AzManagementPartner' }} -PartnerId ${{ github.event.inputs.partnerId }}
```

{{< /mode >}}
{{< /modes >}}

    Check your GitHub Actions secrets and variables in your GitHub repo's Settings > Secrets and variables section. The workflows are preconfigured for common Terraform environment variables.

    - Change the prefix from `vars` to `secrets` if they are defined as secrets.
    - Change the names if required, e.g. `AZURE_CLIENT_ID`

    The workflow is set for manual deployment. Feel free to change the [trigger](https://docs.github.com/actions/reference/workflows-and-actions/events-that-trigger-workflows).

1. Commit and push the new branch
1. Create a pull request and merge to the main branch
1. Click on **Actions**
1. Select the **workflow**
1. Click on **Run workflow**

## Creating a new service principal for recognition

\<TODO>

## Next

If there are any additional scenarios with service principals that you would like to see added to this guidance then feel free to use the GitHub icon in the navigation pane and request an enhancement.

Next up we will look at how Partner Admin Link works with Azure Lighthouse.
