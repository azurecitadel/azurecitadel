---
title: "Quick reference page"
date: 2026-09-14
author: [ "Richard Cheney" ]
description: "Once you have authenticated then how do you create a Partner Admin Link? This quick reference page includes a selection of methods and their CLI equivalents. The following pages after this one then run through a few scenarios."
draft: false
weight: 15
menu:
  side:
    parent: pal
    identifier: pal-reference
series:
  - pal
---

## Introduction

{{< flash >}}

Process:

1. Authenticate as a user, guest, service principal or managed identity in the customer's tenant.
1. Link your security principal to the Partner ID using the REST API, CLI, or PowerShell cmdlet.

Reminders:

- Each security principal can only be connected to one Partner ID in each tenant.
- You cannot create a PAL for another security principal.
- Authenticate as that security principal, check the context and create the PAL.
- ACR telemetry attribution for that security principal is based on its RBAC role assignments.

{{< /flash >}}

Security principal is the collective name for users, guests, service principals and managed identities on the Entra ID platform.

The partner ID used throughout these examples will be 314159. This is not a valid Partner ID and will error. Use your own [Partner ID](/pal/theory/#what-is-the-partner-id).

Note that the [Microsoft.ManagementPartner REST API](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/managementpartner/resource-manager/Microsoft.ManagementPartner/ManagementPartner) does not have the first-class REST documentation found for most Azure resource provider.

The API has separate Create and Update methods. There is no combined and idempotent Create or Update method as we commonly see for more recent REST APIs. Therefore the safest method in automation is to get and then create or update as applicable.

## REST API Operations

### Create

#### REST API

Create a Partner Admin Link.

```http
PUT https://management.azure.com/providers/Microsoft.ManagementPartner/partners/{partnerId}?api-version=2018-02-01
```

{{< output "Example with body" >}}

```json
PUT https://management.azure.com/providers/Microsoft.ManagementPartner/partners/314159?api-version=2018-02-01

{
  "partnerId": "314159"
}
```

{{< /output >}}

#### CLI commands

{{< modes >}}
{{< mode title="Azure CLI - az rest" >}}

```bash
az rest --method put \
  --url "https://management.azure.com/providers/microsoft.managementpartner/partners/${partnerId}?api-version=2018-02-01" \
  --body "{\"partnerId\": \"${partnerId}\"}"
```

{{< output >}}

```json
{
  "etag": 1,
  "id": "/providers/microsoft.managementpartner/partners/314159",
  "name": "314159",
  "properties": {
    "createdTime": "2026-09-15T14:25:52.6156742Z",
    "objectId": "142d2492-a132-4acb-a9bd-78b709298fd2",
    "partnerId": "314159",
    "partnerName": "Azure Citadel",
    "state": "Active",
    "tenantId": "05a64f04-2b2a-4d47-9b12-9b448065bb06",
    "updatedTime": "2026-09-15T14:25:52.6156742Z",
    "version": 1
  },
  "type": "Microsoft.ManagementPartner/partners"
}
```

{{< /output >}}

{{< /mode >}}
{{< mode title="Azure CLI - az managementpartner" >}}

```bash
az managementpartner create --partner-id "${partnerId}"
```

{{< output >}}

```json
{
  "createdTime": "2026-09-15T14:25:52.6156742Z",
  "etag": 1,
  "id": "/providers/microsoft.managementpartner/partners/314159",
  "name": "314159",
  "objectId": "142d2492-a132-4acb-a9bd-78b709298fd2",
  "partnerId": "314159",
  "partnerName": "Azure Citadel",
  "state": "Active",
  "tenantId": "05a64f04-2b2a-4d47-9b12-9b448065bb06",
  "type": "Microsoft.ManagementPartner/partners",
  "updatedTime": "2026-09-15T14:58:32.7777762Z",
  "version": 1
}
```

{{< /output >}}

{{< /mode >}}
{{< mode title="PowerShell cmdlet" >}}

```powershell
New-AzManagementPartner -PartnerId $partnerId
```

{{< output >}}

```yaml

PartnerId   : 314159
PartnerName : Azure Citadel
TenantId    : 05a64f04-2b2a-4d47-9b12-9b448065bb06
ObjectId    : 142d2492-a132-4acb-a9bd-78b709298fd2
State       : Active

```

{{< /output >}}

{{< /mode >}}
{{< /modes >}}

{{< flash >}}
Create will fail if the user or service principal is already linked.
{{< /flash >}}

### Get

#### REST API

Get with no Partner ID specified.

```http
GET https://management.azure.com/providers/Microsoft.ManagementPartner/partners?api-version=2018-02-01
```

{{< flash >}}
Returns the same JSON object as PUT if set. Errors if there is no Partner Admin Link.
{{< /flash >}}

Get for a specific partner ID.

```http
GET https://management.azure.com/providers/Microsoft.ManagementPartner/partners/{partnerId}?api-version=2018-02-01
```

{{< flash >}}
Returns the JSON object if PAL exists and is set to the partner ID. Errors if a) there is no Partner Admin Link or b) a PAL exists but is set to another partner's Partner ID.
{{< /flash >}}

#### CLI commands

{{< modes >}}
{{< mode title="Azure CLI - az rest" >}}

```bash
az rest --method get \
  --url "https://management.azure.com/providers/microsoft.managementpartner/partners/${partnerId}?api-version=2018-02-01"
```

The `/${partnerId}` section of the URI can be removed for the first variant.

{{< /mode >}}
{{< mode title="Azure CLI - az managementpartner" >}}

```bash
az managementpartner show --partner-id "${partnerId}"
```

Remove the `--partner-id` switch for the first variant.

{{< /mode >}}
{{< mode title="PowerShell cmdlet" >}}

```powershell
Get-AzManagementPartner -PartnerId $partnerId
```

Remove the `--PartnerId` switch for the first variant.

{{< /mode >}}
{{< /modes >}}

### Update

#### REST API

```http
PATCH https://management.azure.com/providers/Microsoft.ManagementPartner/partners/{partnerId}?api-version=2018-02-01
```

{{< output "Example with body" >}}

```json
PATCH https://management.azure.com/providers/Microsoft.ManagementPartner/partners/314159?api-version=2018-02-01

{
  "partnerId": "314159"
}
```

{{< /output >}}

#### CLI commands

{{< modes >}}
{{< mode title="Azure CLI - az rest" >}}

```bash
az rest --method patch \
  --url "https://management.azure.com/providers/microsoft.managementpartner/partners/${partnerId}?api-version=2018-02-01" \
  --body "{\"partnerId\": \"${partnerId}\"}"
```

{{< /mode >}}
{{< mode title="Azure CLI - az managementpartner" >}}

```bash
az managementpartner update --partner-id "${partnerId}"
```

{{< /mode >}}
{{< mode title="PowerShell cmdlet" >}}

```powershell
Update-AzManagementPartner -PartnerId $partnerId
```

{{< /mode >}}
{{< /modes >}}

{{< flash >}}
Update will fail if the user or service principal is not already linked.
{{< /flash >}}

### Delete

#### REST API

```http
DELETE https://management.azure.com/providers/Microsoft.ManagementPartner/partners/{partnerId}?api-version=2018-02-01
```

#### CLI commands

{{< modes >}}
{{< mode title="Azure CLI - az rest" >}}

```bash
az rest --method delete \
  --url "https://management.azure.com/providers/microsoft.managementpartner/partners/${partnerId}?api-version=2018-02-01"
```

{{< /mode >}}
{{< mode title="Azure CLI - az managementpartner" >}}

```bash
az managementpartner delete --partner-id "${partnerId}"
```

{{< /mode >}}
{{< mode title="PowerShell cmdlet" >}}

```powershell
Remove-AzManagementPartner -PartnerId $partnerId
```

{{< /mode >}}
{{< /modes >}}

## Additional install notes

### Azure CLI

The Azure CLI's managementpartner commands require the extension to be installed.

1. Install the Azure CLI's managementpartner extension.

    ```bash
    az extension add --name "managementpartner"
    ```

### PowerShell

Install the [Az.ManagementPartner](https://www.powershellgallery.com/packages/Az.ManagementPartner/) PowerShell module for the cmdlets shown above.

1. Register the default PowerShell repository.

   ```powershell
   Register-PSRepository -Default
   ```

1. Set the PSGallery installation policy to trusted.

   ```powershell
   Set-PSRepository -Name PSGallery -InstallationPolicy Trusted
   ```

1. Install the Az.ManagementPartner module.

   ```powershell
   Install-Module -Name Az.ManagementPartner -Repository PSGallery -Force
   ```

## Next

We'll focus on standard user and guest IDs, including using the Portal once you have logged in as a user and switched to the customer's directory. This is all covered in the next page.

After that we will move through a set of scenarios for service principals and managed identities.
