---
title: "Users"
date: 2021-01-21
draft: true
author: [ "Richard Cheney" ]
description: "Standard user principals that are members of an AAD directory."
weight: 2
menu:
  side:
    parent: 'identity-theory'
---

## Description

There are a number of security principals in AAD

* users
  * members
  * guests
* service principals
* managed identities

This page will cover standard user principals, which are more precisley called Members as they are members of the tenant directory.

The term "Users" in an AAD context includes the Member Users as well as the Guest Users that we'll cover on the next page.

## Portal

Go to the [Users](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/MsGraphUsers) page in the portal.

This will show Member Users and any Guest users if they exist.

In the view below a filter has been added to filter User Type to Member. I have also customised the columns.

![Users](/identity/theory/images/users.png)

## CLI

Here are a few useful CLI commands. For an overview of using the Azure CLI with JMESPATH queries then check the [Azure CLI pages](/cli).

### Signed in user

Show all details for the current signed in user.

```shell
az ad signed-in-user show --output jsonc
```

{{< details "Example output" >}}
```json
{
  "accountEnabled": true,
  "ageGroup": null,
  "assignedLicenses": [],
  "assignedPlans": [],
  "city": null,
  "companyName": null,
  "consentProvidedForMinor": null,
  "country": null,
  "createdDateTime": "2019-09-20T12:33:39Z",
  "creationType": null,
  "deletionTimestamp": null,
  "department": "Azure Citadel",
  "dirSyncEnabled": null,
  "displayName": "Richard Cheney (Citadel)",
  "employeeId": null,
  "facsimileTelephoneNumber": null,
  "givenName": "Richard",
  "immutableId": null,
  "isCompromised": null,
  "jobTitle": "Overlord",
  "lastDirSyncTime": null,
  "legalAgeGroupClassification": null,
  "mail": null,
  "mailNickname": "richeney",
  "mobile": null,
  "objectId": "2a7d8d38-291f-4e6a-88c7-2f8e17c8b5ca",
  "objectType": "User",
  "odata.metadata": "https://graph.windows.net/f246eeb7-b820-4971-a083-9e100e084ed0/$metadata#directoryObjects/@Element",
  "odata.type": "Microsoft.DirectoryServices.User",
  "onPremisesDistinguishedName": null,
  "onPremisesSecurityIdentifier": null,
  "otherMails": [],
  "passwordPolicies": null,
  "passwordProfile": null,
  "physicalDeliveryOfficeName": null,
  "postalCode": null,
  "preferredLanguage": "en-GB",
  "provisionedPlans": [],
  "provisioningErrors": [],
  "proxyAddresses": [],
  "refreshTokensValidFromDateTime": "2020-12-04T17:00:08Z",
  "showInAddressList": null,
  "signInNames": [],
  "sipProxyAddress": null,
  "state": null,
  "streetAddress": null,
  "surname": "Cheney",
  "telephoneNumber": null,
  "thumbnailPhoto@odata.mediaContentType": "image/Png",
  "thumbnailPhoto@odata.mediaEditLink": "directoryObjects/2a7d8d38-291f-4e6a-88c7-2f8e17c8b5ca/Microsoft.DirectoryServices.User/thumbnailPhoto",
  "usageLocation": "GB",
  "userIdentities": [],
  "userPrincipalName": "richeney@azurecitadel.com",
  "userState": null,
  "userStateChangedOn": null,
  "userType": "Member"
}
```
{{< /details >}}

### Get the object ID

```shell
az ad signed-in-user show --output tsv --query objectId
```

Example output:

```text
2a7d8d38-291f-4e6a-88c7-2f8e17c8b5ca
```

### Get the UPN

Get the user principal name

```shell
az ad signed-in-user show --output tsv --query userPrincipalName
```

Example output:

```text
richeney@azurecitadel.com
```

### Get the tenant ID

This method can be more trustworthy than using the `az account show` output. One such circumstance is if Azure Lighthouse is in use.

```shell
az ad signed-in-user show --output tsv --query '"odata.metadata"' | cut -f4 -d/
```

Example output:

```text
f246eeb7-b820-4971-a083-9e100e084ed0
```

### List all members

The JMESPATH query below limits the users to those with userType = "Member" and then is selective on which values to display in the table.

```shell
az ad user list --query "[?userType == 'Member'].{name:displayName, upn:userPrincipalName, objectId:objectId}" --output table
```

Example output:

```text
Name                      Upn                          ObjectId
------------------------  ---------------------------  ------------------------------------
Iko Uwais                 iko@azurecitadel.com         11228b94-ddc0-4ceb-82a0-6e261498de37
Jackie Chan               jackie@azurecitadel.com      a7f477dc-0433-448f-bc47-6f4bbfb5031f
Jet Li                    jet@azurecitadel.com         07be4dd9-8b56-4fd7-887d-421a6a1dd572
Richard Cheney (Citadel)  richeney@azurecitadel.com    2a7d8d38-291f-4e6a-88c7-2f8e17c8b5ca
Tony Jaa                  tony@azurecitadel.com        21a4419d-983b-4d90-96d3-d9c46c0688a1
```

### Get the objectId for a specific user

If you have the UPN:

```shell
az ad user show --id tony@azurecitadel.com --output tsv --query objectId
```

> Note that the `--id` switch can also take the objectId as the value, so the reverse query is simple.

If you have the display name:

```shell
az ad user list --output tsv --query "[?displayName == 'Tony Jaa'].objectId"
```

Example output:

```text
21a4419d-983b-4d90-96d3-d9c46c0688a1
```

## References

* [AAD Fundamentals](https://docs.microsoft.com/azure/active-directory/fundamentals/)
