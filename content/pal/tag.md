---
title: "PAL tagging with a service principal"
date: 2025-10-10
author: [ "Richard Cheney" ]
description: "There are a number of scenarios where you may not have eligible permanent access, and your recognition is being understated. We'll look at creating a new service principal purely for recognition purposes."
draft: false
weight: 60
menu:
  side:
    parent: pal
    identifier: pal-tag
series:
  - pal
aliases:
  - /pal/tagging
  - /pal/dedicated
---

## Introduction

There are certain scenarios where the partner has had influence on a set of resources, say a specific subscription, but the customer does not need the partner to have ongoing access. Example scenarios:

- Consultative engagements (e.g. advisories) where contributor access was never required
- Proof of value pilot deployments which have been subsequently handed over to the customer team
- Highly secured production environments that only permit contributor access for workload identities, i.e. those used in CI/CD deployment pipelines

So, how do you get recognition when you don't have ongoing access from, say, a managed service? Historically these scenarios may have been recognised by a mechanism called Digital Partner of Record but DPOR had its own limitations and has been retired.

On this page we will use a dedicated service principal that purely exists to "PAL tag" specific environments so that the partner receives the correct level of recognition.

The commands below use a Bash environment which includes both the Azure CLI and jq. (The [Cloud Shell](https://shell.azure.com) has both preinstalled.)

{{< flash >}}
The page has two key steps that require certain permissions:

1. **Create a service principal and partner admin link**

    By default, standard users can create service principals. Guest IDs cannot.

    Standard users may not be able to create service principals if the [_Users can register applications_](https://entra.microsoft.com/#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/UserSettings/menuId/) setting has been toggled to no.

    Either way, the Application Administrator or Application Developer roles in Entra allow service principal creation.

2. **Create RBAC role assignments for the service principal**

    A privileged role is required to create RBAC role assignments, e.g.:

    - Owner
    - User Access Administrator
    - Role Based Access Control Administrator

{{< /flash >}}
{{< flash "tip" >}}
The two steps do not have to be run by the same person. If someone else has already created a service principal for PAL tagging then you can skip straight to:

- [viewing the service principal(s)](#viewing-dedicated-pal-service-principals)
- [creating the RBAC role assignments](#create-rbac-role-assignments-for-the-service-principal)
{{< /flash >}}

## Create a service principal and PAL

### Set variables

1. Set a partner name variable.

    The name will be used in the display name for the service principal in case there are multiple partners working in the customer account.

    ```bash
    partnerName="<partnername>"
    ```

1. Set a partner ID variable.

    Remember to use the location-based partner ID.

    ```bash
    partnerId="<partnerId>"
    ```

### Create the service principal

1. Create the service principal

    ```bash
    displayName="PAL (Partner Admin Link) for ${partnerName}"
    json=$(az ad sp create-for-rbac --display-name "$displayName" --output json)
    appId=$(jq -r '.appId' <<< $json)
    secret=$(jq -r '.password' <<< $json)
    tenantId=$(jq -r '.tenant' <<< $json)
    az ad sp show --id $appId --output jsonc
    ```

    {{< output "Click to expand" "Example output from an `az ad sp show` command." >}}

```json
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#servicePrincipals/$entity",
  "accountEnabled": true,
  "addIns": [],
  "alternativeNames": [],
  "appDescription": null,
  "appDisplayName": "PAL (Partner Admin Link) for Azure Citadel",
  "appId": "5d1613d5-3cf5-48c0-a229-d0152ab4b8d0",
  "appOwnerOrganizationId": "ac40fc60-2717-4051-a567-c0cd948f0ac9",
  "appRoleAssignmentRequired": false,
  "appRoles": [],
  "applicationTemplateId": null,
  "createdDateTime": "2026-01-16T11:37:19Z",
  "deletedDateTime": null,
  "description": null,
  "disabledByMicrosoftStatus": null,
  "displayName": "PAL (Partner Admin Link) for Azure Citadel",
  "homepage": null,
  "id": "d358ac16-e877-4080-8b99-a67500701366",
  "info": {
    "logoUrl": null,
    "marketingUrl": null,
    "privacyStatementUrl": null,
    "supportUrl": null,
    "termsOfServiceUrl": null
  },
  "keyCredentials": [],
  "loginUrl": null,
  "logoutUrl": null,
  "notes": null,
  "notificationEmailAddresses": [],
  "oauth2PermissionScopes": [],
  "passwordCredentials": [],
  "preferredSingleSignOnMode": null,
  "preferredTokenSigningKeyThumbprint": null,
  "replyUrls": [],
  "resourceSpecificApplicationPermissions": [],
  "samlSingleSignOnSettings": null,
  "servicePrincipalNames": [
    "0752ad1e-497b-4338-93f1-622265ee96d6"
  ],
  "servicePrincipalType": "Application",
  "signInAudience": "AzureADMyOrg",
  "tags": [],
  "tokenEncryptionKeyId": null,
  "verifiedPublisher": {
    "addedDateTime": null,
    "displayName": null,
    "verifiedPublisherId": null
  }
}
```

{{< /output >}}

    By default, the service principal will have no RBAC role assignments.

1. Add yourself as the owner

    ```bash
    myObjectId=$(az ad signed-in-user show --query id -otsv)
    az ad app owner add --id $appId --owner-object-id $myObjectId
    az ad app owner list --id $appId
    ```

    You can also add owners in the portal.

    {{< output >}}

```json
[
  {
    "@odata.type": "#microsoft.graph.user",
    "businessPhones": [
      "425-555-0100"
    ],
    "displayName": "John Doe",
    "givenName": "John",
    "id": "74afa9e2-d243-414b-bab2-db8dd242827f",
    "jobTitle": null,
    "mail": "john.doe@mydomain.onmicrosoft.com",
    "mobilePhone": "425-555-0101",
    "officeLocation": null,
    "preferredLanguage": "en",
    "surname": "Doe",
    "userPrincipalName": "john.doe@mydomain.onmicrosoft.com"
  }
]
```

{{< /output >}}

### Create the partner admin link

1. Get the token

    ℹ️ This approach uses the REST API to avoid having to switch IDs back and forth with the Azure CLI.

    ```bash
    uri="https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token"
    data="grant_type=client_credentials&client_id=${appId}&client_secret=${secret}&scope=https://management.azure.com/.default"
    token=$(curl --silent --request POST --header "Content-Type: application/x-www-form-urlencoded" --data "$data" "$uri" | jq -r '.access_token')
    [[ -n "$token" ]] && cut -d. -f2 <<< $token | base64 --decode 2>/dev/null | jq '{aud, iss, tid, appid}' || echo "Error getting the token."
    ```

    {{< output >}}

```json
{
  "aud": "https://management.azure.com",
  "iss": "https://sts.windows.net/ac40fc60-2717-4051-a567-c0cd948f0ac9/",
  "tid": "ac40fc60-2717-4051-a567-c0cd948f0ac9",
  "appid": "5d1613d5-3cf5-48c0-a229-d0152ab4b8d0"
}
```

{{< /output >}}

1. Create the Partner Admin Link

    ```bash
    uri="https://management.azure.com/providers/microsoft.managementpartner/partners/${partnerId}?api-version=2018-02-01"
    data='{"partnerId": "'${partnerId}'"}'
    curl --silent --request PUT --header "Authorization: Bearer ${token}" --header "Content-Type: application/json" --data "$data" "$uri" | jq .
    ```

    {{< output >}}

```json
{
  "id": "/providers/microsoft.managementpartner/partners/994867",
  "type": "Microsoft.ManagementPartner/partners",
  "name": "3141593",
  "etag": 1,
  "properties": {
    "partnerId": "3141593",
    "partnerName": "Azure Citadel",
    "tenantId": "ac40fc60-2717-4051-a567-c0cd948f0ac9",
    "objectId": "2ee63cf0-5219-42bd-b42f-a547de2be218",
    "version": 1,
    "updatedTime": "2026-01-16T13:56:59.6112004Z",
    "createdTime": "2026-01-16T13:56:59.6112004Z",
    "state": "Active"
  }
}
```

{{< /output >}}

    {{< details "Additional commands">}}

Show the partner admin link.

```bash
curl --silent --request GET --header "Authorization: Bearer ${token}" --header "Content-Type: application/json" "$uri" | jq .
```

Delete the partner admin link.

```bash
curl --silent --request DELETE --header "Authorization: Bearer ${token}" --header "Content-Type: application/json" "$uri" | jq .
```

{{< /details >}}

### Reduce the attack surface

{{< flash "tip">}}
You may remove the secret once the Partner Admin Link has been successfully created.

Removing the secret addresses potential security concerns and also removes the need to rotate secrets ahead of expiry dates.
{{< /flash >}}

1. Delete the secret

    ```bash
    keyId=$(az ad app credential list --id $appId --query "[?displayName == 'rbac']|[0].keyId" -otsv)
    az ad app credential delete --id $appId --key-id $keyId
    ```

    The command has no output, but you will see that there is no secret in the Azure Portal when viewing.

    Note that you will no longer be able to display the Partner Admin Link as you can no longer authenticate as the service principal.

The service principal is now ready for use. At the moment there will be no recognition associated with it, but in the next step that will changed as RBAC role assignments are created for it.

## Viewing dedicated PAL service principals

I will assume that all of the service principal display names start with "_PAL_ ".

{{< modes >}}
{{< mode title="Portal" >}}

### Viewing app registrations

1. View app registrations in the [Azure Portal](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps) or [Microsoft Entra admin center](https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade/quickStartType~/null/sourceType/Microsoft_AAD_IAM).
1. If you are an owner then the service principals, app reg should show up in Owned Applications.

    ![List of app registrations in Azure Portal showing the Owned applications tab selected, with a PAL service principal named "PAL (Partner Admin Link) for Microsoft" visible in the list](/pal/images/appreg-owned.png)

1. Switch to _All applications_ and filter on "PAL" or "Partner Admin Link".

    This will also list any service principals where you aren't owner.

1. Selected your PAL app registration

    The Overview pane will have a link to its service principal with the _Managed application in local directory_ in the Essentials.

    ![Overview page of an app registration in Azure Portal showing the 'Managed application in local directory' link in the Essentials section that navigates to the corresponding service principal in Enterprise Apps](/pal/images/appreg-linktosp.png)

    The link would take you straight to the service principal in Enterprise Apps, as also shown below. This where you will find the service principal's object ID.

1. View the Certificates and secrets

    Confirm that there are no certs, secrets, or federated credentials.

    ![Azure portal showing the Certificates and secrets page for an app registration with empty sections for Certificates, Client secrets, and Federated credentials, confirming no authentication credentials are configured](/pal/images/paltag-nosecret.png)

### Viewing enterprise apps

1. View enterprise apps in the [Azure Portal](https://portal.azure.com/#view/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/~/AppAppsPreview/menuId~/null) or [Microsoft Entra admin center](https://entra.microsoft.com/#view/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/~/AppAppsPreview).
1. By default it will be filtered to _Application type == **Enterprise Applications**_. Remove this filter.
1. Filter on "PAL" or "Partner Admin Link"

    ![Filtered list of enterprise applications in Azure Portal showing search results for "PAL" with a service principal named "PAL (Partner Admin Link) for Microsoft" displayed in the results](/pal/images/serviceprincipal-filteredlist.png)

1. Select the correct service principal.

    ![Overview page of a service principal in Azure Portal Enterprise Apps showing the Object ID field highlighted with a copy button, allowing users to easily copy the service principal's unique identifier for use in role assignments and other administrative tasks](/pal/images/serviceprincipal-copyobjectid.png)

    You can copy the Object ID straight from this page.

{{< /mode >}}
{{< mode title="Azure CLI" >}}

### List your PAL service principals

1. List the service principals

    ```bash
    az ad sp list --filter "startswith(displayName,'PAL') and servicePrincipalType  eq 'Application'" --query "[].{DisplayName:displayName, AppId:appId, ObjectId:id}" --output table
    ```

    {{< output >}}

```text
DisplayName                                 AppId                                 ObjectId
------------------------------------------  ------------------------------------  ------------------------------------
PAL (Partner Admin Link) for Azure Citadel  a8e4a6e3-220e-4ab8-b705-539d3f08ab0b  00755c50-b896-4f05-a214-c816a22726ed
```

{{< /output >}}

{{< /mode >}}
{{< /modes >}}

## Create RBAC role assignments for the service principal

The recognition in Partner Admin Link is based on the RBAC role assignment scope points, and only applies to role assignments with a [PEC eligible role](https://learn.microsoft.com/partner-center/billing/azure-roles-perms-pec). These examples use Support Request Contributor.

Remember, a privileged role is required to create RBAC role assignments, e.g.:

- Owner
- User Access Administrator
- Role Based Access Control Administrator

{{< flash "danger">}}
Recognition will associate the resource telemetry for all resources below the role assignment scope points.

Only assign roles to scope points that define the set of resources where the partner deserves recognition for their influence.
{{< /flash >}}

Note that the telemetry is always collected for Azure billing purposes. No new telemetry is collected, it is just associated with the partner ID. The association solely indicates the positive influence that the partner has in the customer account. The partner does not have access to the telemetry itself except for a highly aggregated and anonymized number for the customer.

Please reference the official statements from Microsoft in the [Frequently asked questions about a PAL association](https://learn.microsoft.com/partner-center/membership/link-partner-id-for-azure-performance-pal-dpor#frequently-asked-questions-about-a-pal-association) section.

{{< modes >}}
{{< mode title="Portal" >}}
You can create the role assignments in the Azure Portal. Here is one way to do so:

1. Open [Resource Manager](https://portal.azure.com/#view/HubsExtension/ServiceMenuBlade/~/overview/extension/Microsoft_Azure_Resources/menuId/ResourceManager/itemId/managementgroupbrowse)
1. Click on Organization
1. Select [Management Group](https://portal.azure.com/#view/HubsExtension/ServiceMenuBlade/~/managementgroupbrowse/extension/Microsoft_Azure_Resources/menuId/ResourceManager/itemId/managementgroupbrowse) or [Subscriptions](https://portal.azure.com/#view/HubsExtension/ServiceMenuBlade/~/subscriptions/extension/Microsoft_Azure_Resources/menuId/ResourceManager/itemId/managementgroupbrowse).
1. Select your scope point.
1. Click on _Access control (IAM)_ in the blade
1. Click on **+ Add** > **Add role assignment**
1. Select the _Support Request Administrator_ role, and click Next
1. Click on _+ Select members_, search for ***PAL*** and select the service principal
1. Click on **Review + assign** and validate the assignment details
1. Click on **Review + assign** again to create the RBAC role assignment

Repeat the process for other scope points if required.
{{< /modes >}}
{{< mode title="Azure CLI">}}

### Set the object ID

1. Set the object ID.

    The section above shows how to [list the service principals](#viewing-dedicated-pal-service-principals). Copy the object ID from here.

    ```bash
    objectId="<objectId>"
    ```

    Or if you are following straight from the previous commands and the appId variable is still set then you can run this command.

    ```bash
    objectId=$(az ad sp show --id $appId --query id -otsv)
    ```

### Subscription example

1. Create an assignment for the current subscription.

    ```bash
    scope="/subscriptions/$(az account show --query id -otsv)"
    role="Support Request Contributor"
    az role assignment create --role "$role" --scope "$scope" --assignee-object-id "$objectId" --assignee-principal-type "ServicePrincipal"
    ```

    The scope point can be the resourceId for a subscription, resource group or individual resource.

    The scope may also be set to a management group's resourceId, in which case it will include all subscriptions underneath that management group.

### Multiple subscriptions

This example creates the role assignment at all subscriptions within the service principal's tenant based on your access.

1. Create multiple assignments

    ```bash
    objectId=$(az ad sp show --id $appId --query id -otsv)
    role="Support Request Contributor"
    upn=$(az ad signed-in-user show --query userPrincipalName -otsv)

    subscriptionIds=$(az account list --refresh --only-show-errors --query "[?tenantId == '"${tenantId}"' && user.name == '"${upn}"'].id" -otsv)

    for subscriptionId in $subscriptionIds
    do az role assignment create --role "$role" --scope "/subscriptions/${subscriptionId}" --assignee-object-id "$objectId" --assignee-principal-type "ServicePrincipal"
    done
    ```

{{< /mode >}}
{{< /modes >}}

## Listing the scope points

You may wish to view all of the scope points where the ID has an RBAC role assignment. This is not easy within the Azure Portal.

{{< modes >}}
{{< mode title="Azure CLI">}}
You will need the [service principal's objectId](#set-the-object-id) as before.

1. List all RBAC role assignments

    ```bash
    az role assignment list --all --assignee $objectId --query "[].{roleDefinitionName:roleDefinitionName, scope:scope}" --output yamlc
    ```

1. List only the scope points

    ```bash
    az role assignment list --all --assignee $objectId --query "[].scope" --output tsv
    ```

{{< /mode >}}
{{< /modes >}}
