---
title: "Integration"
description: "Each connected machine has an identity. Run a script on prem that uses Azure Key Vault, Azure Storage and PostgreSQL."
layout: single
draft: false
series:
 - arc-servers-hack-proctor
weight: 8
---

## Setting up the Key Vault

Hint:

By default they won't have access to write secrets, keys, certs.

* Do you know what we mean when we talk about management plane v data plane? Actions v dataActions?
* The need to assign an RBAC role is implicit. By default they won't have access.

If they script it out then here are some example commands that include example secret access:

  ```bash
  uniq=$(cd ~/arc-onprem-servers; terraform output --raw uniq)
  vault=keyvault-$uniq
  az keyvault create --name $vault --resource-group arc-hack --location=uksouth --enable-rbac-authorization --retention-days 7
  keyvaultId=$(az keyvault show --name $vault --resource-group arc-hack --query id --output tsv)
  objectId=$(az ad signed-in-user show --query objectId --output tsv)
  az role assignment create --assignee $objectId --resource-group arc-hack --role "Key Vault Secrets Officer"
  az keyvault secret set --vault-name $vault --name example-secret --value "NinaIsTheMole"
  secretId=$(az keyvault secret show --vault-name $vault --name example-secret --query id --output tsv)
  ```

  Key Vault Administrator is also a valid role at this point. It has more access as it covers certs and keys as well as secrets. They'll be creating certs later so perhaps more sensible!

Read the secret:

  ```bash
  az keyvault secret show --vault-name $vault --name example-secret --query value --output tsv
  ```

or

  ```bash
  az keyvault secret show --id $secretId --query value --output tsv
  ```

## Key Vault extension

The links are everything. Push them towards those.

This is the easier of the two challenges as they can just find and follow the guide in the jumpstart site: <https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_servers/day2/arc_keyvault/>.

If they want to do it on Windows then the flow is the same - substitute IIS for nginx - and use this page: <https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-windows?tabs=windows>.

I have not tested this personally, but it is nice functionality.

## Managed Identity

### PostgreSQL

Hints:

* Spinning up the SQL is pretty simple
* Follow the two pages in the links
* They don't need to automate all of the steps.

Steps:

1. Database creation:

    ```bash
    admin_password=$(cd ~/arc-onprem-servers; terraform output --raw windows_admin_password)
    uniq=$(cd ~/arc-onprem-servers; terraform output --raw uniq)
    az extension add --name db-up
    az postgres up --server-name postgres-$uniq --database-name arc_hack --admin-user arcadmin --admin-password $admin_password --location uksouth
    ```

1. Secret

    Manually copying the psql_cmd and adding the secret is perfectly fine. For reference, this is how I'd automate it:

    ```bash
    psql_cmd=$(az postgres show-connection-string --server-name postgres-$uniq --database-name arc_hack --admin-user arcadmin --admin-password $admin_password --query connectionStrings.psql_cmd --output tsv)
    az keyvault secret set --vault-name $vault --name psql-cmd --value "$psql_cmd"
    ```

### Hybrid Instance Metadata Service

OK, this one is a little more hardcore. It is definitely a tough one if they haven't done much with REST APIs or managed identity or jq.

Hints:

* The HIMDS endpoint IP address is not the same as the standard IMDS endpoint on Azure VM.
* The URI paths and API versions are the same though.
* The Azure CLI will not work. `az login --identity` has not been updated to use the HIMDS IP address.
* Key links are
  * [Authenticate against Azure resources with Arc enabled servers](https://docs.microsoft.com/azure/azure-arc/servers/managed-identity-authentication)
    * Give the IMDS endpoint
    * Also shows how to get the challenge token and then the token for the management.azure.com resource
    * The challenge token is only valid for a single use, so token challenge path, token challenge and resource token should be consecutive commands
  * [Using managed identities on standard Azure VMs](/vm/identity)
    * Shows how to use tokens in REST API calls
    * Also shows that you need RBAC role assignments - i.e. you need Reader on the resource group for the managed identity
    * Discuss public endpoints therefore need internet access or Microsoft peering - future functionality will add private endpoints
  * [Instance Metadata Service - Linux](https://docs.microsoft.com/azure/virtual-machines/linux/instance-metadata-service?tabs=linux)
    * Note that HIMDS is a subset of the info in IMDS
  * The az command is extensible.... see `az extension --help` or type `az connectedmachine`

Steps:

* SSH to ubuntu-01
* The IMDS_ENDPOINT is `http://localhost:40342` is what you curl to get the IMDS info, but you need the path. The pathing is from the

    ```bash
    curl -sSL -H Metadata:true http://localhost:40342/metadata/instance?api-version=2020-06-01 | jq .
    ```

* Set the subscriptionId and resourceGroupName variables (stretch)

    ```bash
    imds=$(curl -sSL -H Metadata:true http://localhost:40342/metadata/instance?api-version=2020-06-01)
    subscriptionId=$(jq -r .compute.subscriptionId <<< $imds)
    resourceGroupName=$(jq -r .compute.resourceGroupName <<< $imds)
    ```

* Get the challenge token (stretch)

    Note that the user won't be able to see the challengeTokenPath. You need sudo to list or cat the files. The challenge token can be used once and then it is deleted from the directory.

    ```bash
    challengeTokenPath=$(curl -s -D - -H Metadata:true "http://127.0.0.1:40342/metadata/identity/oauth2/token?api-version=2019-11-01&resource=https%3A%2F%2Fmanagement.azure.com" | grep Www-Authenticate | cut -d "=" -f 2 | tr -d "[:cntrl:]")
    challengeToken=$(sudo cat $challengeTokenPath)
    token=$(curl -s -H Metadata:true -H "Authorization: Basic $challengeToken" "http://127.0.0.1:40342/metadata/identity/oauth2/token?api-version=2019-11-01&resource=https%3A%2F%2Fmanagement.azure.com" | jq -r .access_token)
    ```

    The token should be good for 24 hours.

    * Assign the role

        Do this outside of the VM's SSH session. It is best to start up a separate terminal session in Windows Terminal.

        ```bash
        objectId=$(az connectedmachine show --name ubuntu-01 --resource-group arc-hack --query identity.principalId --output tsv)
        scope=$(az group show --name arc-hack --query id --output tsv)
        az role assignment create --assignee $objectId --role Reader --scope $scope
        ```

    * List the resources

        Back in the VM's SSH session.

        ```bash
        curl -sSL -X GET -H "Authorization: Bearer $token" -H "Content-Type: application/json" https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/resources?api-version=2020-06-01 | jq .
        ```

        There we go - an on prem VM successfully accessing the ARM layer!

    * Get the key vault's name.

        The /vm/identity page adds in a tag to the VM and then picks that up with IMDS. That is a valid approach. Here are a couple of REST API approaches:

        1. Resource list, filtered in jq

          ```bash
          curl -sSL -X GET -H "Authorization: Bearer $token" -H "Content-Type: application/json" https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/resources?api-version=2020-06-01 | jq -r '.value[]|select(.type == "Microsoft.KeyVault/vaults").name'
          ```

        1. Vaults - List by Resource Group

          ```bash
          curl -sSL -X GET -H "Authorization: Bearer $token" -H "Content-Type: application/json" https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.KeyVault/vaults?api-version=2019-09-01 | jq
          ```

**TO BE COMPLETED** - AAD outage halts play

## Success criteria

* Text
