---
headless: true
title: "Partner Admin Link - Attestation"
---

I have created a Bash script, [pal_attestation.sh](https://gist.github.com/richeney/60f487bf788cfd52c89cfd7800d5adef), that you are free to use if it helps you to display information about Partner Admin Link. This is useful if you need to copy and paste the output to prove that a link is in place for that customer context. You can copy and paste the output, pipe it through to jq, or redirect to a file.

A few example usages are shown below for displaying

1. the core info (for the tenant, the security principal, and the Partner Admin Link)
1. the core info, plus direct RBAC role assignments (note the caveats)
1. the core info for another objectId and its RBAC role assignments

You first need to authenticate and ensure that you are in the correct customer context.

{{< flash "warning" >}}
You use this script then it is at your own risk. Having said that it is mostly harmless as it is just getting info from Azure, including the resource graph, and displying it. If you have very minimal access, e.g. you cannot read Microsoft.Authorization at the right scopes, then the main risk is that it may not return the full information.
{{< /flash >}}

This Bash command will work in the Cloud Shell, even in the PowerShell experience.

### Core info

```bash
curl -sSL https://aka.ms/pal/attestation | bash
```

{{< tabs >}}
{{< tab title="User" >}}
{{< output >}}

```json
{
  "tenantId": "ac40fc60-2717-4051-a567-c0cd948f0ac9",
  "tenantDisplayName": "Contoso",
  "tenantDefaultDomain": "contoso.com",
  "type": "user",
  "displayName": "Richard Cheney",
  "userPrincipalName": "richard.cheney@azurecitadel.com",
  "appId": null,
  "objectId": "74afa9e2-d243-414b-bab2-db8dd242827f",
  "partnerAdminLink": "/providers/microsoft.managementpartner/partners/314159",
  "partnerName": "Azure Citadel",
  "partnerId": "314159"
}
```

{{< /output >}}
{{< /tab >}}
{{< tab title="Service Principal" >}}
{{< output >}}

```json
{
  "tenantId": "ac40fc60-2717-4051-a567-c0cd948f0ac9",
  "tenantDisplayName": null,
  "tenantDefaultDomain": null,
  "type": "servicePrincipal",
  "displayName": "PAL (Partner Admin Link) for Azure Citadel",
  "userPrincipalName": null,
  "appId": "7b7fe81e-da85-4271-a065-b0a00634ae75",
  "objectId": "a52475b0-d310-41ac-a4b1-d1e3161e0127",
  "partnerAdminLink": "/providers/microsoft.managementpartner/partners/314159",
  "partnerName": "Azure Citadel",
  "partnerId": "314159"
}
```

{{< /output >}}
{{< /tab >}}
{{< /tabs >}}


### Extended info with assignments

{{< flash "warning" >}}
Note that this uses the resource graph to additionall get the direct RBAC role assignments.

It will not return secondary RBAC role assignments, e.g. via a security group's role assignment. You will also not see any temporary assignments (e.g. via Privileged Identity Management or the Access Packages in Microsoft Entra ID Governance's Entitlement Management) unless they are currently active.
{{< /flash >}}

```bash
curl -sSL https://aka.ms/pal/attestation | bash -s -- --assignments
```

{{< tabs >}}
{{< tab title="User" >}}
{{< output >}}

```json
{
  "tenantId": "ac40fc60-2717-4051-a567-c0cd948f0ac9",
  "tenantDisplayName": "Contoso",
  "tenantDefaultDomain": "contoso.com",
  "type": "user",
  "displayName": "Richard Cheney",
  "userPrincipalName": "richard.cheney@azurecitadel.com",
  "appId": null,
  "objectId": "74afa9e2-d243-414b-bab2-db8dd242827f",
  "partnerAdminLink": "/providers/microsoft.managementpartner/partners/314159",
  "partnerName": "Azure Citadel",
  "partnerId": "314159",
  "assignments": [
    {
      "scope": "/providers/Microsoft.Management/managementGroups/alz",
      "id": "b25e4a12-2d7d-19b0-3de0-0f12895873ed",
      "roleName": "Azure Landing Zones Management Group Reader (alz-mgmt)",
      "roleType": "Custom"
    },
    {
      "scope": "/subscriptions/a7484f13-d60f-4e5a-a530-fdaade38716a",
      "id": "8e3af657-a8ff-443c-a75c-2fe8c4bcb635",
      "roleName": "Owner",
      "roleType": "BuiltIn"
    },
    {
      "scope": "/subscriptions/a7484f13-d60f-4e5a-a530-fdaade38716a/resourceGroups/terraform/providers/Microsoft.Storage/storageAccounts/terraformfabric562b54eb",
      "id": "ba92f5b4-2d11-453d-a403-e96b0029c9fe",
      "roleName": "Storage Blob Data Contributor",
      "roleType": "BuiltIn"
    }
  ]
}
```

{{< /output >}}
{{< /tab >}}
{{< tab title="Service Principal" >}}
{{< output >}}

```json
{
  "tenantId": "ac40fc60-2717-4051-a567-c0cd948f0ac9",
  "tenantDisplayName": null,
  "tenantDefaultDomain": null,
  "type": "servicePrincipal",
  "displayName": "PAL (Partner Admin Link) for Azure Citadel",
  "userPrincipalName": null,
  "appId": "7b7fe81e-da85-4271-a065-b0a00634ae75",
  "objectId": "a52475b0-d310-41ac-a4b1-d1e3161e0127",
  "partnerAdminLink": "/providers/microsoft.managementpartner/partners/314159",
  "partnerName": "Azure Citadel",
  "partnerId": "314159",
  "assignments": [
    {
      "scope": "/providers/Microsoft.Management/managementGroups/platform",
      "id": "cfd33db0-3dd1-45e3-aa9d-cdbdf3b6f24e",
      "roleName": "Support Request Contributor",
      "roleType": "BuiltIn"
    },
    {
      "scope": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15",
      "id": "cfd33db0-3dd1-45e3-aa9d-cdbdf3b6f24e",
      "roleName": "Support Request Contributor",
      "roleType": "BuiltIn"
    },
    {
      "scope": "/subscriptions/a7484f13-d60f-4e5a-a530-fdaade38716a",
      "id": "b24988ac-6180-42a0-ab88-20f7382dd24c",
      "roleName": "Contributor",
      "roleType": "BuiltIn"
    }
  ]
}
```

{{< /output >}}
{{< /tab >}}
{{< /tabs >}}

### Assignment info for another object id

{{< flash >}}
This is useful to display assignments for another user or service principal.

Note that this will not return the Partner Admin Link information, as you must authenticate for the PAL REST API call to work.
{{< /flash >}}

```bash
curl -sSL https://aka.ms/pal/attestation | bash -s -- --assignments --object-id <object-id>
```

The script will handle being passed the app ID, or the object ID for the app reg, and will automatically determine the object ID for the service principal. If you do not want to see the stderr warning messages then add `2>/dev/null` to the command.

{{< tabs >}}
{{< tab title="User" >}}
{{< output >}}

```json
{
  "tenantId": "ac40fc60-2717-4051-a567-c0cd948f0ac9",
  "tenantDisplayName": "Contoso",
  "tenantDefaultDomain": "contoso.com",
  "type": "user",
  "displayName": "Richard Cheney",
  "userPrincipalName": "richard.cheney@azurecitadel.com",
  "appId": null,
  "objectId": "74afa9e2-d243-414b-bab2-db8dd242827f",
  "partnerAdminLink": "Unavailable",
  "partnerName": "Unavailable",
  "partnerId": "Unavailable",
  "assignments": [
    {
      "scope": "/providers/Microsoft.Management/managementGroups/alz",
      "id": "b25e4a12-2d7d-19b0-3de0-0f12895873ed",
      "roleName": "Azure Landing Zones Management Group Reader (alz-mgmt)",
      "roleType": "Custom"
    },
    {
      "scope": "/subscriptions/a7484f13-d60f-4e5a-a530-fdaade38716a",
      "id": "8e3af657-a8ff-443c-a75c-2fe8c4bcb635",
      "roleName": "Owner",
      "roleType": "BuiltIn"
    },
    {
      "scope": "/subscriptions/a7484f13-d60f-4e5a-a530-fdaade38716a/resourceGroups/terraform/providers/Microsoft.Storage/storageAccounts/terraformfabric562b54eb",
      "id": "ba92f5b4-2d11-453d-a403-e96b0029c9fe",
      "roleName": "Storage Blob Data Contributor",
      "roleType": "BuiltIn"
    }
  ]
}
```

{{< /output >}}
{{< /tab >}}
{{< tab title="Service Principal" >}}
{{< output >}}

```json
{
  "tenantId": "ac40fc60-2717-4051-a567-c0cd948f0ac9",
  "tenantDisplayName": null,
  "tenantDefaultDomain": null,
  "type": "servicePrincipal",
  "displayName": "PAL (Partner Admin Link) for Azure Citadel",
  "userPrincipalName": null,
  "appId": "7b7fe81e-da85-4271-a065-b0a00634ae75",
  "objectId": "a52475b0-d310-41ac-a4b1-d1e3161e0127",
  "partnerAdminLink": "Unavailable",
  "partnerName": "Unavailable",
  "partnerId": "Unavailable",
  "assignments": [
    {
      "scope": "/providers/Microsoft.Management/managementGroups/platform",
      "id": "cfd33db0-3dd1-45e3-aa9d-cdbdf3b6f24e",
      "roleName": "Support Request Contributor",
      "roleType": "BuiltIn"
    },
    {
      "scope": "/subscriptions/73568139-5c52-4066-a406-3e8533bb0f15",
      "id": "cfd33db0-3dd1-45e3-aa9d-cdbdf3b6f24e",
      "roleName": "Support Request Contributor",
      "roleType": "BuiltIn"
    },
    {
      "scope": "/subscriptions/a7484f13-d60f-4e5a-a530-fdaade38716a",
      "id": "b24988ac-6180-42a0-ab88-20f7382dd24c",
      "roleName": "Contributor",
      "roleType": "BuiltIn"
    }
  ]
}
```

{{< /output >}}
{{< /tab >}}
{{< /tabs >}}
