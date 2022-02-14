---
title: "Managed Identity"
description: "Each connected machine has a system assigned managed identity. This lab will walk through using the REST API calls on your Arc-enabled servers to get challenge tokens, resource tokens and access the ARM and PaaS API endpoints"
layout: single
draft: false
series:
 - arc-servers-hack-proctor
weight: 200
url: /arc/servers/identity/proctor
---

## Proctor notes

This lab is good for demonstrating how Managed Identity can be used for bespoke integration. It also forces them to browse the Azure Arc Jumpstart.

Go to the Managed Identity page on Azure Arc Jumpstart.

Start at <https://aka.ms/azurearcjumpstart> and navigate through

1. Jumpstart Scenarios
1. Azure Arc-enabled servers
1. Unified Operations Use Cases
1. Managed Identity
1. Managed Identity with Ubuntu server

to arrive at the [Using Managed Identity on an Ubuntu Azure Arc-enabled server](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_servers/day2/arc_managed_identity/linux/) page.

Follow the lab.

⚠️ **STOP READING NOW!!**

## History lesson

For posterity, here is the original lab which was slightly different, making use of PostgreSQL.

## Introduction

Managed identities are the preferred security principal to use for trusted compute as it provides a sensible start of the trust chain. Managed identities are used extensively across Azure for virtual machines, containers, and services. They can be system assigned, with the same lifecycle as the compute they are associated with, or user created and assigned.

Trusted compute can access the Instance Metadata Service (IMDS) endpoint for metadata and also to get the access token for the managed identity. The metadata is used to query for other information such as resourceID, tenant and subscription IDs, tags, location etc. The token acquisition is used by different processes such as using `az login --identity` using the CLI on an Azure VM.

The great news is that connected machines also get a managed identity and the azcmagent service also provides a Hybrid Instance Metadata Service (HIMDS). Note that the IMDS and HIMDS endpoints differ:

| Service | IMDS_ENDPOINT | IDENTITY_ENDPOINT |
|---|---|---|
| IMDS | `http://169.254.169.254` | `http://169.254.169.254/metadata/identity/oauth2/token`
| HIMDS | `http://localhost:40342` | `http://localhost:40342/metadata/identity/oauth2/token`

You can give your Azure Arc-enabled server's managed identity RBAC role assignments to your resources, and then use the HIMDS service to acquire the tokens to authenticate to the API endpoints. This allows you to integrate your on prem servers with Azure services such as Azure Key Vault, Azure Storage, PaaS database services, etc.

Note that this is not a challenge hack as the integration is currently limited to REST API calls and they are working on CLI and PowerShell support. It is a straight lab to showcase the functionality and give you example commands to reference.

We will take this in stages:

1. Create a Postgres DB and add the connection string to the key vault
1. Use the hybrid instance metadata service to query the subscription, resource group and tags for the Azure Arc-enabled server resource
1. List the resources in the resource group
1. Grab the Postgres DB connection string from the key vault
1. Connect to the database

> It is assumed that you have an on prem Ubuntu VM called ubuntu-01.

## Azure Key Vault

You should have a key vault from earlier in the hack. If so:

```bash
kv=$(az keyvault list --resource-group arc_pilot --query "[0].name" --output tsv)
uniq=${kv#arc-pilot-}
echo "Key vault is $kv, uniq suffix is $uniq"
```

If you don't have that resource group and key vault then this command block will create them:

```bash
az group create --name arc_pilot --location uksouth
uniq=$(az account show --query id --output tsv | cut -f1 -d-)
kv=arc-pilot-keyvault-$uniq
az keyvault create --name $kv --retention-days 7 --resource-group arc_pilot --location uksouth
```

> The md5sum /dev/random command gives an eight character suffix to help make the FQDN unique.

## Postgres DB

Build the server and database. (Takes a few minutes.) Grab the output JSON.

```bash
az extension add --name db-up
postgresJson=$(az postgres up --server-name postgres-$uniq --database-name arc_pilot --sku-name B_Gen5_1 --generate-password true --resource-group arc_pilot --location uksouth --output json)
```

Add the connection string and [pgpass](https://www.postgresql.org/docs/9.3/libpq-pgpass.html) format info to secrets in the key vault.

```bash
psql_cmd=$(jq -r .connectionStrings.psql_cmd <<< $postgresJson)
psql_pgpass=$(jq -r '.host + ":*:*:" +.username + ":" + .password' <<< $postgresJson)
az keyvault secret set --vault-name $kv --name psql-cmd --value "$psql_cmd"
az keyvault secret set --vault-name $kv --name psql-pgpass --value "$psql_pgpass"
```

Use this command to display the secret values:

```bash
az keyvault secret show --vault-name $kv --name psql-cmd --query value --output tsv
az keyvault secret show --vault-name $kv --name psql-pgpass --query value --output tsv
```

OK, we now have a Postgres DB and the connection string and password info is secured in a key vault.

## Hybrid IMDS

Use the HIMDS to get some information about our representative resource in Azure.

* ssh to ubuntu-01
  * Username: **onpremadmin**
  * Authentication type: **SSH Private Key from Azure Key Vault**
* install jq and customise the colours

    ```bash
    sudo apt install jq -y
    ```

* curl the IMDS_ENDPOINT

    ```bash
    curl -sSL -H Metadata:true http://localhost:40342/metadata/instance?api-version=2020-06-01 | jq .
    ```

* Set the subscriptionId and resourceGroupName variables

    ```bash
    imds=$(curl -sSL -H Metadata:true http://localhost:40342/metadata/instance?api-version=2020-06-01)
    subscriptionId=$(jq -r .compute.subscriptionId <<< $imds)
    resourceGroupName=$(jq -r .compute.resourceGroupName <<< $imds)
    ```

* Working with tags and jq

    ```bash
    jq .compute.tags <<< $imds
    jq -r '.compute.tagsList' <<< $imds
    jq -r '.compute.tagsList[] | select(.name == "datacentre")' <<< $imds
    datacentre=$(jq -r '.compute.tagsList[] | select(.name == "datacentre") | .value' <<< $imds)
    ```

## Tokens and REST API calls

In this section we will:

1. List all of the resources in the resource group using the managed identity
1. Use jq filters to find the name of the key vault in the resource group

The authentication process on an Arc-enabled server:

1. Call the challenge token API which creates the token in file
1. The API call will always fail, but the headers include the challenge token path
1. read the contents of the challenge token file
1. use the challenge token in header of a standard call to a resource API, e.g. management.azure.com
1. token should be good for 24 hours

SSH to ubuntu-01 and follow the command blocks:

* Create the challenge token

    Note that the onpremadmin user won't be able to see the challengeTokenPath. You need sudo to root in order list or cat the files. The challenge token is created and used once and then it is deleted from the directory.

    ```bash
    challengeTokenPath=$(curl -s -D - -H Metadata:true "http://127.0.0.1:40342/metadata/identity/oauth2/token?api-version=2019-11-01&resource=https%3A%2F%2Fmanagement.azure.com" | grep Www-Authenticate | cut -d "=" -f 2 | tr -d "[:cntrl:]")
    ```

    This REST API call will error, but the Www-Authenticate value in the header contains the location of the challenge token, which is only accessible to the root and himds IDs.

    ```bash
    echo $challengeTokenPath
    sudo ls -l /var/opt/azcmagent/tokens/
    ```

* Read the challenge token

    ```bash
    challengeToken=$(sudo cat $challengeTokenPath)
    ```

* Get the management.azure.com token

    ```bash
    token=$(curl -s -H Metadata:true -H "Authorization: Basic $challengeToken" "http://127.0.0.1:40342/metadata/identity/oauth2/token?api-version=2019-11-01&resource=https%3A%2F%2Fmanagement.azure.com" | jq -r .access_token)
    ```

    The token should be good for 24 hours. You can paste the token into <https://jwt.ms>. Note that times are in [epochs](https://www.epochconverter.com/).

* Assign the role

    Trying to list the resources in the resource group at this point would fail as the managed identity has not been assigned an RBAC role to permit the get action on a resource group.

    Grab the managed identity's AAD objectId and assign the Reader role. Do this outside of the VM's SSH session, e.g. in [Cloud Shell](https://shell.azure.com/bash).

    ```bash
    objectId=$(az connectedmachine show --name ubuntu-01 --resource-group arc_pilot --query identity.principalId --output tsv)
    scope=$(az group show --name arc-hack --query id --output tsv)
    az role assignment create --assignee $objectId --role Reader --scope $scope
    ```

    > See the bottom of the lab for an example showing all managed identities being added to a security group which can then be used for cleaner role assignments.

* List the resources

    Back in the ubuntu-01 VM's SSH session.

    ```bash
    curl -sSL -X GET -H "Authorization: Bearer $token" -H "Content-Type: application/json" https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/resources?api-version=2020-06-01 | jq .
    ```

    The on prem VM is successfully accessing the ARM API!

* Get the vault name

    You could repeat the last call and filter using jq:

    ```bash
    vault=$(curl -sSL -X GET -H "Authorization: Bearer $token" -H "Content-Type: application/json" https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/resources?api-version=2020-06-01 | jq -r '.value[]|select(.type == "Microsoft.KeyVault/vaults").name')
    ```

    Or use a different call, e.g. [Vaults - List By Resource Group](https://docs.microsoft.com/rest/api/keyvault/vaults/listbyresourcegroup):

    ```bash
    vault=$(curl -sSL -X GET -H "Authorization: Bearer $token" -H "Content-Type: application/json" https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.KeyVault/vaults?api-version=2019-09-01 | jq -r .value[0].name)
    ```

    You could make life uch simpler by using a hardcoded name for your vault and moving on to the next section, but it is comforting to know that you could automate something more flexible with a combination of HIMDS metadata and ARM API calls.

## Access key vault and postgres

Use the ubuntu-01 managed identity to:

* Add a access policy to the key vault for the identity to list and read secrets
* Read the psql_cmd secret from the key vault
  * This needs a different token as the resource / audience is `https://vault.azure.net`
* Install psql (postgresql-client)
* Connect to the arc_hack database using psql

* Add a key vault access policy to list and read secrets

    From the [bash](https://shell.azure.com/bash) session.

    ```bash
    objectId=$(az connectedmachine show --name ubuntu-01 --resource-group arc_pilot --query identity.principalId --output tsv)
    az keyvault set-policy --name $kv --object-id $objectId --secret-permissions list get
    ```

* Get a token for the key vault service

    Back on the Arc VM, get a token for the keyvault API.

    ```bash
    challengeTokenPath=$(curl -s -D - -H Metadata:true "http://127.0.0.1:40342/metadata/identity/oauth2/token?api-version=2019-11-01&resource=https%3A%2F%2Fvault.azure.net" | grep Www-Authenticate | cut -d "=" -f 2 | tr -d "[:cntrl:]")
    challengeToken=$(sudo cat $challengeTokenPath)
    vaultToken=$(curl -s -H Metadata:true -H "Authorization: Basic $challengeToken" "http://127.0.0.1:40342/metadata/identity/oauth2/token?api-version=2019-11-01&resource=https%3A%2F%2Fvault.azure.net" | jq -r .access_token)
    ```

    > Note that the resource is set to `https://vault.azure.net` in the query.

* Get the secrets

    Assume that we still have $kv set from the metadata tags or from listing the resource group. Get the secrets using [Get Secret](https://docs.microsoft.com/rest/api/keyvault/getsecret/getsecret).

    ```bash
    curl -sSL -X GET -H "Authorization: Bearer $vaultToken" -H "Content-Type: application/json" https://$kv.vault.azure.net/secrets/psql-pgpass/?api-version=7.1 | jq -r .value > ~/.pgpass
    psql_cmd=$(curl -sSL -X GET -H "Authorization: Bearer $vaultToken" -H "Content-Type: application/json" https://$kv.vault.azure.net/secrets/psql-cmd/?api-version=7.1 | jq -r .value)
    ```

* Install psql

    ```bash
    sudo apt install postgresql-client -y
    ```

* Connect to the database

    ```bash
    $psql_cmd
    ```

    Done! Example output:

    ```sql
    psql (10.18 (Ubuntu 10.18-0ubuntu0.18.04.1), server 10.16)
    SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)
    Type "help" for help.

    arc_pilot=> \q
    ```

## Resources

HIMDS (Azure Arc-enabled VMs)

* [Authenticate against Azure resources with Arc enabled servers](https://docs.microsoft.com/azure/azure-arc/servers/managed-identity-authentication)

IMDS (Azure VMs)

* [Instance Metadata Service - Linux](https://docs.microsoft.com/azure/virtual-machines/linux/instance-metadata-service?tabs=linux)
* [Instance Metadata Service - Windows](https://docs.microsoft.com/azure/virtual-machines/windows/instance-metadata-service?tabs=windows)
* [Using managed identities on standard Azure VMs](/vm/identity)
* [Acquiring access tokens for managed identities on Azure VMs](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/how-to-use-vm-token)

PostgreSQL

* [Azure Database for PostgreSQL using az postgres up](https://docs.microsoft.com/azure/postgresql/quickstart-create-server-up-azure-cli)
* [Connect to PostgreSQL with psql](https://docs.microsoft.com/azure/postgresql/quickstart-create-server-database-portal#connect-to-the-server-with-psql)
