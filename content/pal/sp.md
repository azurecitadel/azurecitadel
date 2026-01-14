---
title: "Service principals & PAL"
date: 2025-10-10
author: [ "Richard Cheney" ]
description: "Here is a short guide to creating Partner Admin Links for existing service principals."
draft: false
weight: 50
menu:
  side:
    parent: pal
    identifier: pal-sp
series:
  - pal
tabs:
  - azure-cli
force_tabs: true
---

## Introduction brief

The user of service principals is mentioned in the official documentation, and with respect to Azure Lighthouse - more on that later - it is a recommendation. One benefit of using a service principal is that you don't face unintended issues with losing PAL recognition if users are removed from a customer's tenant. This can occur if an employee leaves the organisation or changes roles.

Take the scenario where a team of people providing the managed service are all  originally set up with Partner Admin Link and they all have equivalent access in the customer's account. As people leave and join the team - and assuming those new joiners don't create PAL links - then the PAL recognition is fine until the very last person from the original cohort leaves and then the recognition falls off a cliff. That does not happen if you also use a service principal.

{{< flash >}}
This page assumes that you are looking at an existing service principal that

- has Azure RBAC role assignments with PEC eligible roles, and
- you are allowed to use its secret or certificate for authentication.

If you have a service principal or managed identity that you are using in a CI/CD pipeline then visit the [CI/CD pipelines & PAL](./cicd.md) page

If you are intending to "PAL tag" with a new and dedicated Partner Admin Link service principal that exists purely for recognition purposes then go to the [PAL tag with a service principal](./dedicated.md)
{{< /flash >}}

Note that you cannot create a Partner Admin Link for a service principal using the Azure Portal.

## Service principal with secret or cert

{{< modes >}}
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

  ### Use the Azure CLI to create the link for a service principal

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
  {{< mode title="REST API" >}}

  ### Use the REST API to create the link for a system assigned managed identity

The example here is for a system assigned managed identity on an Azure RHEL linux virtual machine, where the token is retrieved via the Instance Metadata Service (IMDS).

⚠️ Note that whilst it is possible to call the REST API directly, the only documentation for the API appears in the [azure-rest-api-specs](https://github.com/Azure/azure-rest-api-specs) repo. Also, managed identities are not officially supported.

1. Install jq

    ```bash
    sudo dnf install jq -y
    ```

    ℹ️ You may need to use a different package manager to install jq if on a different linux distribution.

1. Use the Instance Metadata Service to get a token

    ```bash
    token=$(curl -sSL -H "Metadata:true" 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/' | jq -r .access_token)
    ```

1. Define the partnerid

    ```bash
    partnerId="31415927"
    ```

    ⚠️ Set the partnerid variable to your location based Microsoft Partner ID.

1. Create the PAL link

    ```bash
    curl --silent \
      --header "Authorization: Bearer ${token}" \
      --header "Content-Type: application/json" \
      --data '{"partnerId": "'${partnerId}'"}' \
      --request PUT \
      "https://management.azure.com/providers/microsoft.managementpartner/partners/${partnerId}?api-version=2018-02-01"
    ```

    Using the example MPN ID, the JSON payload would be:

    ```json
    {"partnerId": "31415927"}
    ```

    And the uri would be:

    ```text
    "https://management.azure.com/providers/microsoft.managementpartner/partners/31415927?api-version=2018-02-01"
    ```

  {{< /mode >}}
{{< /modes >}}

Partner Admin Link should now associate telemetry for all resources under the service principal's RBAC role assignments, assuming they include a PEC eligible role.

## Next

It is increasingly common in locked down environments to only allow CI/CD pipelines to deploy to production environments, and if the workload identities are configured using OpenID Connect as per security recommendations then what are your options? In the next page we'll look at those CI/CD pipelines and federated credentials with example pipelines to configure the Partner Admin Link.
