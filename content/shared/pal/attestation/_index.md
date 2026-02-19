---
headless: true
title: "Partner Admin Link - Attestation"
---

This command can be used to display information about the tenant, the security principal, and the Partner Admin Link. You first need to authenticate and ensure that you are in the correct customer context. This Bash command will work in the Cloud Shell, even in the PowerShell experience.

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

{{< flash "tip" >}}
This is useful if you need to copy and paste the output to prove that a link is in place for that customer context.
{{< /flash >}}
