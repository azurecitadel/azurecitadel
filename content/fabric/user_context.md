---
title: "Configure an app reg for development"
description: "Configure the the user context so that you can begin using the fabric Terraform provider in a solo context. Configure selected API permissions within user impersonation. and expose the API endpoint."
layout: single
draft: false
menu:
  side:
    parent: fabric
    identifier: fabric-user_context
series:
 - fabric_terraform_administrator
weight: 25
---

## Introduction

At this point you have the access, the tooling, and a Fabric capacity to use. This page will take you through the one off task to get you configured for the user context.

This page follows the flow of the <https://registry.terraform.io/providers/microsoft/fabric/latest/docs/guides/auth_app_reg_user> page, making use of the Azure CLI to speed it up.

At each step we'll also show the resulting change in the portal for transparency on what each command is doing.

## User Context overview

{{< flash >}}
**_Why do we need an app registration when authenticating Terraform with use_cli = true?_**

It is a good question if you are used to using the azurerm, azuread, and azapi providers in Terraform with that default use_cli = true authentication. Those providers use tokens stored in your `~/.azure/msal_token_cache.json` file against the common targets, e.g., for the Azure control plane (management.core.windows.net), for Microsoft Entra (graph.microsoft.com), or PaaS endpoints such as storage.azure.com.

The fabric provider, for user context, uses an app registration with user impersonation, so when you authenticate to the app reg's scope you will be constrained to the API permissions defined for the app reg, assuming that you have RBAC access yourself to perform those actions.

My guess is that this user_context requirement may disappear over time and the fabric provider will just use the user's permissions directly.

And it may already have done so. The v1.1.0 bumps the fabric-go-sdk version to v.0.4.0. This includes the bump to azidentity from 1.9.0 to 1.10.0 and uses more credentials. Pin fabric provider to v1.0.0 to test.
{{< /flash >}}

In this section you will:

1. create an app registration
1. add on delegated API permissions for the Power BI service (which is also used by Fabric) and the Microsoft Graph
1. create an API endpoint
1. authenticate against the API endpoint as a target

At the bottom of the page you will find a summary of the commands for speed.

## Create the app reg

1. Define an identifier URI

    ℹ️ Updated as the URI now needs to comply with <https://aka.ms/identifier-uri-formatting-error>.

    ```shell
    domain=$(az account show --query tenantDefaultDomain -otsv | tr "[[:upper:]]" "[[:lower:]]")
    name=fabric_terraform_provider
    uri="api://$domain/$name"
    ```

1. Create the app reg itself.

    ```shell
    az ad app create --display-name $name --identifier-uris $uri
    ```

    [Microsoft Entra admin center](https://entra.microsoft.com/#home) > App registrations > All applications > filter to `fabric_terraform_provider`

    ![Screenshot showing the creation of the app registration in Microsoft Entra admin center.](/fabric/images/user_context_create.png)

1. Add the delegated API permissions

    ```shell
    az ad app update --id $uri --required-resource-accesses @files/manifest.scope.json
    ```

    ![Screenshot showing the addition of delegated API permissions in Microsoft Entra admin center.](/fabric/images/user_context_delegated_api_permissions.png)

    > ⚠️ Note that the GUID used for the id just needs to be unique to your directory. It does not need to be "1ca1271c-e2c0-437c-af9a-3a92e745a24d". The other GUIDs in the JSON files are specific.

1. Expose the API

    Define a scope

    ```shell
    az ad app update --id $uri --set api=@files/api.expose.json
    ```

    Add pre-authorizations for Azure CLI, PowerShell and Power BI

    ```shell
    az ad app update --id $uri --set api=@files/api.preauthorize.json
    ```

    ![Screenshot showing the API exposure settings in Microsoft Entra admin center.](/fabric/images/user_context_expose.png)

1. Add yourself as owner

    ```shell
    az ad app owner add --id $uri --owner-object-id $(az ad signed-in-user show --query id -otsv)
    ```

    The app reg will now show in the default Owned Applications tab.

    ![Screenshot showing the app registration listed under owned applications in Microsoft Entra admin center.](/fabric/images/user_context_owned.png)

## Verify

This section has been included in case you want to do a full comparison of the config, paying close attention to the modified api object and identifierUris and requiredResourceAccess arrays.

1. Show full output for the app reg

    ```shell
    az ad app show --id $uri --output jsonc
    ```

    Example output

    ```json
    {
      "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#applications/$entity",
      "addIns": [],
      "api": {
        "acceptMappedClaims": null,
        "knownClientApplications": [],
        "oauth2PermissionScopes": [
          {
            "adminConsentDescription": "Allows connection to backend services for Microsoft Fabric Terraform Provider",
            "adminConsentDisplayName": "Microsoft Fabric Terraform Provider",
            "id": "1ca1271c-e2c0-437c-af9a-3a92e745a24d",
            "isEnabled": true,
            "type": "User",
            "userConsentDescription": "Allows connection to backend services for Microsoft Fabric Terraform Provider",
            "userConsentDisplayName": "Microsoft Fabric Terraform Provider",
            "value": "access"
          }
        ],
        "preAuthorizedApplications": [
          {
            "appId": "04b07795-8ddb-461a-bbee-02f9e1bf7b46",
            "delegatedPermissionIds": [
              "1ca1271c-e2c0-437c-af9a-3a92e745a24d"
            ]
          },
          {
            "appId": "1950a258-227b-4e31-a9cf-717495945fc2",
            "delegatedPermissionIds": [
              "1ca1271c-e2c0-437c-af9a-3a92e745a24d"
            ]
          },
          {
            "appId": "00000009-0000-0000-c000-000000000000",
            "delegatedPermissionIds": [
              "1ca1271c-e2c0-437c-af9a-3a92e745a24d"
            ]
          },
          {
            "appId": "871c010f-5e61-4fb1-83ac-98610a7e9110",
            "delegatedPermissionIds": [
              "1ca1271c-e2c0-437c-af9a-3a92e745a24d"
            ]
          }
        ],
        "requestedAccessTokenVersion": null
      },
      "appId": "<clientId>",
      "appRoles": [],
      "applicationTemplateId": null,
      "certification": null,
      "createdDateTime": "2025-05-14T14:54:52Z",
      "defaultRedirectUri": null,
      "deletedDateTime": null,
      "description": null,
      "disabledByMicrosoftStatus": null,
      "displayName": "fabric_terraform_provider",
      "groupMembershipClaims": null,
      "id": "<objectId>",
      "identifierUris": [
        "api://contoso.com/fabric_terraform_provider"
      ],
      "info": {
        "logoUrl": null,
        "marketingUrl": null,
        "privacyStatementUrl": null,
        "supportUrl": null,
        "termsOfServiceUrl": null
      },
      "isDeviceOnlyAuthSupported": null,
      "isFallbackPublicClient": null,
      "keyCredentials": [],
      "nativeAuthenticationApisEnabled": null,
      "notes": null,
      "optionalClaims": null,
      "parentalControlSettings": {
        "countriesBlockedForMinors": [],
        "legalAgeGroupRule": "Allow"
      },
      "passwordCredentials": [],
      "publicClient": {
        "redirectUris": []
      },
      "publisherDomain": "<domainSuffix>",
      "requestSignatureVerification": null,
      "requiredResourceAccess": [
        {
          "resourceAccess": [
            {
              "id": "e1fe6dd8-ba31-4d61-89e7-88639da4683d",
              "type": "Scope"
            },
            {
              "id": "b340eb25-3456-403f-be2f-af7a0d370277",
              "type": "Scope"
            }
          ],
          "resourceAppId": "00000003-0000-0000-c000-000000000000"
        },
        {
          "resourceAccess": [
            {
              "id": "4eabc3d1-b762-40ff-9da5-0e18fdf11230",
              "type": "Scope"
            },
            {
              "id": "b2f1b2fa-f35c-407c-979c-a858a808ba85",
              "type": "Scope"
            },
            {
              "id": "445002fb-a6f2-4dc1-a81e-4254a111cd29",
              "type": "Scope"
            },
            {
              "id": "8b01a991-5a5a-47f8-91a2-84d6bfd72c02",
              "type": "Scope"
            }
          ],
          "resourceAppId": "00000009-0000-0000-c000-000000000000"
        }
      ],
      "samlMetadataUrl": null,
      "serviceManagementReference": null,
      "servicePrincipalLockConfiguration": null,
      "signInAudience": "AzureADMyOrg",
      "spa": {
        "redirectUris": []
      },
      "tags": [],
      "tokenEncryptionKeyId": null,
      "uniqueName": null,
      "verifiedPublisher": {
        "addedDateTime": null,
        "displayName": null,
        "verifiedPublisherId": null
      },
      "web": {
        "homePageUrl": null,
        "implicitGrantSettings": {
          "enableAccessTokenIssuance": false,
          "enableIdTokenIssuance": false
        },
        "logoutUrl": null,
        "redirectUriSettings": [],
        "redirectUris": []
      }
    }
    ```

## Full set

Here is the full set of commands using inline JSON, in case you need to run them outside of the context of these labs.

```shell
name=fabric_terraform_provider
uri="api://$(az account show --query tenantId -otsv)/$name"

az ad app create --display-name $name --identifier-uris $uri
az ad app update --id $uri --required-resource-accesses '[{"resourceAppId":"00000003-0000-0000-c000-000000000000","resourceAccess":[{"id":"e1fe6dd8-ba31-4d61-89e7-88639da4683d","type":"Scope"},{"id":"b340eb25-3456-403f-be2f-af7a0d370277","type":"Scope"}]},{"resourceAppId":"00000009-0000-0000-c000-000000000000","resourceAccess":[{"id":"4eabc3d1-b762-40ff-9da5-0e18fdf11230","type":"Scope"},{"id":"b2f1b2fa-f35c-407c-979c-a858a808ba85","type":"Scope"},{"id":"445002fb-a6f2-4dc1-a81e-4254a111cd29","type":"Scope"},{"id":"8b01a991-5a5a-47f8-91a2-84d6bfd72c02","type":"Scope"}]}]'
echo "Added roles"
az ad app update --id $uri --set api='{"acceptMappedClaims":null,"knownClientApplications":[],"oauth2PermissionScopes":[{"adminConsentDescription":"Allows connection to backend services for Microsoft Fabric Terraform Provider","adminConsentDisplayName":"Microsoft Fabric Terraform Provider","id":"1ca1271c-e2c0-437c-af9a-3a92e745a24d","isEnabled":true,"type":"User","userConsentDescription":"Allows connection to backend services for Microsoft Fabric Terraform Provider","userConsentDisplayName":"Microsoft Fabric Terraform Provider","value":"access"}],"preAuthorizedApplications":[],"requestedAccessTokenVersion":null}'
echo "Added endpoint"
az ad app update --id $uri --set api='{"acceptMappedClaims":null,"knownClientApplications":[],"oauth2PermissionScopes":[{"adminConsentDescription":"Allows connection to backend services for Microsoft Fabric Terraform Provider","adminConsentDisplayName":"Microsoft Fabric Terraform Provider","id":"1ca1271c-e2c0-437c-af9a-3a92e745a24d","isEnabled":true,"type":"User","userConsentDescription":"Allows connection to backend services for Microsoft Fabric Terraform Provider","userConsentDisplayName":"Microsoft Fabric Terraform Provider","value":"access"}],"preAuthorizedApplications":[{"appId":"871c010f-5e61-4fb1-83ac-98610a7e9110","delegatedPermissionIds":["1ca1271c-e2c0-437c-af9a-3a92e745a24d"]},{"appId":"00000009-0000-0000-c000-000000000000","delegatedPermissionIds":["1ca1271c-e2c0-437c-af9a-3a92e745a24d"]},{"appId":"1950a258-227b-4e31-a9cf-717495945fc2","delegatedPermissionIds":["1ca1271c-e2c0-437c-af9a-3a92e745a24d"]},{"appId":"04b07795-8ddb-461a-bbee-02f9e1bf7b46","delegatedPermissionIds":["1ca1271c-e2c0-437c-af9a-3a92e745a24d"]}],"requestedAccessTokenVersion":null}'
echo "Authorised Azure CLI, PowerShell and PowerBI"
az ad app owner add --id $uri --owner-object-id $(az ad signed-in-user show --query id -otsv)
echo "Added owner"
az ad app show --id $uri --output jsonc
echo "App Registration created. Authenticate with:"
echo "az login --scope $uri/.default"
```

Slightly longer, but they do exactly the same.

## Authenticate to the scope

1. Authenticate against your exposed API

    ```shell
    az login --scope api://$(az account show --query tenantId -otsv)/fabric_terraform_provider/.default
    ```

    > Note that there may be a slight delay for the previous commands to propagate. If this commands fails then wait 5 seconds and try again.

## Next

You have create your app registration for user impersonation, exposed the API for Azure CLI, PowerShell and Power BI, and authenticated against the scope.

You are ready to use the fabric terraform provider as yourself, which is what we will do in the next page.
