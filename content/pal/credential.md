---
title: "Service principals with credentials"
date: 2025-10-10
author: [ "Richard Cheney" ]
description: "Do you need to create a Partner Admin Link for a service principal? And it has eligible RBAC role assignments? Can you authenticate using its secret or certificate? If so, follow this guide."
draft: false
weight: 20
menu:
  side:
    parent: pal
    identifier: pal-sp
series:
  - pal
tabs:
  - azure-cli
aliases:
  - sp
force_tabs: true
---

## Introduction brief

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
