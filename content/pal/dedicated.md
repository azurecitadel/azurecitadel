---
title: "Creating a dedicated PAL service principal"
date: 2025-10-10
author: [ "Richard Cheney" ]
description: "In the final service principal scenario, we'll look at creating a service principal purely for recognition purposes."
draft: false
weight: 60
menu:
  side:
    parent: pal
    identifier: pal-dedicated
series:
  - pal
---

## Introduction

There are certain scenarios where the partner has had influence on a set of resources, say a specific subscription, but the customer does not need the partner to have ongoing access. Example scenarios:

- Consultative engagements (e.g. advisories) where contributor access was never required
- Proof of value pilot deployments which have been subsequently handed over to the customer team
- Highly secured production environments that only permit contributor access for workload identities, i.e. those used in CI/CD deployment pipelines

Historically these scenarios may have been recognised by a mechanism called Digital Partner of Record but DPOR has been retired.

On this page we will use a dedicated service principal that purely exists to "PAL tag" specific environments so that the partner receives the correct level of recognition.

The commands below use a Bash environment which includes both the Azure CLI and jq. (The [Cloud Shell](https://shell.azure.com) has both preinstalled.) You must also be signed in with an identity **in the the customer's tenant** that can

- create service principals
- can create RBAC role assignments at the required scope points

Note that guest IDs need the Application Administrator Entra role to create service principals.

## Dedicated service principal

1. Variables

    Set the variables with appropriate values.

    ```bash
    partnerName="<Partner Name>"
    partnerId="<partnerId>"
    ```

    Remember to use a location-based partner ID.

1. Create the service principal

    ```bash
    displayName="${partnerName} - Partner Admin Link"
    json=$(az ad sp create-for-rbac --display-name "$displayName" --output json)
    appId=$(jq -r '.appId' <<< $json)
    secret=$(jq -r '.password' <<< $json)
    tenantId=$(jq -r '.tenant' <<< $json)
    ```

    By default, the service principal will have no RBAC role assignments.

1. Add an owner (optional)

    ```bash
    myObjectId=$(az ad signed-in-user show --query id -otsv)
    az ad app owner add --id $appId --owner-object-id $myObjectId
    ```

    You may wish to assign to another owner, e.g. the objectId for the technical customer contact.

1. Create the Partner Admin Link

    ℹ️ This approach uses the REST API to avoid using the Azure CLI to login as the service principal and then again as the initial user ID.

    Get the token.

    ```bash
    uri="https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token"
    data="grant_type=client_credentials&client_id=${appId}&client_secret=${secret}&scope=https://management.azure.com/.default"
    token=$(curl --silent --request POST --header "Content-Type: application/x-www-form-urlencoded" --data "$data" "$uri" | jq -r '.access_token')
    ```

    Create the Partner Admin Link.

    ```bash
    uri="https://management.azure.com/providers/microsoft.managementpartner/partners/${partnerId}?api-version=2018-02-01"
    data='{"partnerId": "'${partnerId}'"}'
    curl --silent --request PUT --header "Authorization: Bearer ${token}" --header "Content-Type: application/json" --data "$data" "$uri" | jq .
    ```

1. Remove the secret (Optional, recommended)

    You may remove the secret once the Partner Admin Link has been successfully created. This removes any security concerns and removes the need to recycle the secret in the future.

    ```bash
    keyId=$(az ad app credential list --id $appId --query "[?displayName == 'rbac']|[0].keyId" -otsv)
    az ad app credential delete --id $appId --key-id $keyId
    ```

1. View the [App registrations](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps).
1. Select the Partner Admin Link app registration in Owned Applications.
1. View the **Certificates and secrets** and confirm that there are no certs, secrets, or federated credentials.

## RBAC role assignments

{{< flash >}}
A privileged role is required to create RBAC role assignments, e.g.:

- Owner
- User Access Administrator
- Role Based Access Control Administrator

The recognition in Partner Admin Link is based on the RBAC role assignment scope points assuming the role assignment has used a PEC eligible role. These examples use Support Request Contributor.

The recognition will be for all resource telemetry underneath the role assignment scope points. Only assign roles to scope points that define the set of resources where the partner deserves recognition for their influence.
{{< /flash >}}

### Subscription example

This example creates an assignment for the current subscription.

```bash
objectId=$(az ad sp show --id $appId --query id -otsv)
role="Support Request Contributor"
scope="/subscriptions/$(az account show --query id -otsv)"
az role assignment create --role "$role" --scope "$scope" --assignee-object-id "$objectId" --assignee-principal-type "ServicePrincipal"
```

The scope point can be the resourceId for a subscription, resource group or individual resource.

The scope may also be set to a management group's resourceId, in which case it will include all subscriptions underneath that management group.

### Multiple subscriptions

This example creates the role assignment at all subscriptions within the service principal's tenant based on your access.

```bash
objectId=$(az ad sp show --id $appId --query id -otsv)
role="Support Request Contributor"
upn=$(az ad signed-in-user show --query userPrincipalName -otsv)

subscriptionIds=$(az account list --refresh --only-show-errors --query "[?tenantId == '"${tenantId}"' && user.name == '"${upn}"'].id" -otsv)

for subscriptionId in $subscriptionIds
do az role assignment create --role "$role" --scope "/subscriptions/${subscriptionId}" --assignee-object-id "$objectId" --assignee-principal-type "ServicePrincipal"
done
```

Alternatively, simply create the assignments in the Azure Portal.
