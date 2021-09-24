---
title: "7️⃣ Integration"
description: "Each connected machine has an identity. Create a Key Vault and add a secret. Configure the Run the commands to pull the secret from the Key Vault from your on prem VM. "
layout: single
draft: true
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-hack-integrate
series:
 - arc-servers-hack
weight: 170
---

## Introduction

Managed identities are the preferred security principal to use for trusted compute as it provides a sensible start of the trust chain.

Rather than going through an authentication process for their access token, the logon process for a managed identity gets the token from the Instance Metadata Service. There is an internal IMDS endpoint at <https://169.254.169.254> which provides the token. The same service can also be used to query Azure for other information such as resourceID, tenant and subscription IDs, tags, location etc.

Managed identities are used extensively across Azure for virtual machines, containers, and services. They can be system assigned, with the same lifecycle as the compute they are associated with, or user created and assigned.

Most of you will be familiar with managed identities, but if not then check out the [Managed Identities](/vm/identity) lab. The lab also includes using curl to call the REST API which will be useful here too...

The great news is that connected machines also get a managed identity and a Hybrid Instance Metadata Service (HIMDS).

You can integrate your on prem servers with Azure services such as Azure Key Vault, Azure Storage, PaaS database services, etc.

## Divide and conquer

As per the success criteria there are two main areas of this hack:

1. Using the Key Vault virtual machine extension on Azure Arc VMs

    Store certificates in Key Vault and automatically import as host certificates. The extension watches the certificate version in Key Vault and will automatically import newer versions.

1. Scripting on Azure Arc VMs to access Azure resources

    Use the hybrid IMDS to get a token and then use the REST API to run ARM calls and access Azure resources.

If you are working within a team then it is suggested that you split the team into two and pick the area that is most important to you. Share information with your team so that you understand how the other area is achieved.

Neither of the success criteria areas need all of the VMs that we currently have, and both will need a key vault, so let's start there.

## Remove VMs

We don't need all of the servers for the integration challenges so now is a good point to reduce the resources.

The assumption is that you will be using the ubuntu-01 server with common linux tools such as curl and jq. (The links include example commands.)

> If you would prefer to use Windows Server and PowerShell then feel free to do so, but be aware that the proctors have only worked through the linux path.

* Reduce the Azure Arc VMs (optional)

> Retain at least one VM for the integration challenge!

## Key Vault

We need a Key Vault to store a secret and then try to access it from the VM. Key Vault has a choice of permission models - the original access policies plus the newer RBAC roles.

* Create a key vault
  * use the Azure RBAC permission model
  * set soft delete retention to the minimum
  * use the uniq value in the name to ensure the FQDN is unique

You may use the portal, but you get bonus points for style if you create a set of CLI commands.

> Note that we will not be using private endpoints for Key Vault as they are not yet supported with connected machines..

----------

## Key Vault extension for VMs

This is **OPTION ONE**.

* Create a self signed certificate and upload into the key vault
* Install the Key Vault extension to the ubuntu-01 Azure Arc VM
* Install nginx
* Configure the VM to use the certificate held in key vault

----------

## Managed Identity scripting

This is **OPTION TWO** and is the tougher challenge.

### Hybrid Instance Metadata Service

Use the ubuntu-01 managed identity to:

* Show the output JSON from the hybrid instance metadata service
  * Most recent API version is 2020-06-01
  * `jq` has been pre-installed on the ubuntu VMs
* Set variables for the subscriptionId and resourceGroupName from the IMDS output (stretch)

### Make an ARM REST API call

Use the ubuntu-01 managed identity to:

* List all of the resources in the resource group using the managed identity
* Use jq filters to find the name of the key vault in the resource group (stretch)

### PostgreSQL and Key Vault

> _Hint_: This section should be done using your own user principal, not the managed identity.

* Create a dev PostgreSQL database using the `az postgres up` command
  * Set the following switch values:
    * server-name: **postgres-`uniq`**
    * database-name: **arc_hack**
    * admin-user: **arcadmin**
    * admin-password: **`windows_admin_password`**
    * location: **uksouth**
    * (the Terraform outputs should be used for the `inline code` values)
  * Add a psql-cmd secret to the key vault
    * using the value of `connectionStrings.psql_cmd` from the output JSON
    * prepend the secret with `PGPASSWORD=<admin-password> `

Example psql-cmd:

```text
PGPASSWORD=Awesome-Antelope! psql --host=postgres-926f133b.postgres.database.azure.com --port=5432 --username=arcadmin@postgres-926f133b --dbname=arc_hack
```

### Access the PostgreSQL DB

Use the ubuntu-01 managed identity to:

* Read the psql_cmd secret from the key vault

Stretch targets:

* Install psql (postgresql-client)
* Connect to the arc_hack database using psql

> _Hint_: Run the interactive postgresql client using `$psql_cmd`. (Assuming that your secret has been formatted as per the example above and you have it in a variable called $psql_cmd.)

----------

## Success criteria

Screen share with your proctor to show that you achieved:

1. Show the key vault, its access policies and your cert or secret
1. Show any additional role assignments
1. Key Vault Extension
    1. Show the deployed extension and the configuration
    1. Browse to the nginx site over https and show the unsigned cert
1. Managed identity
    1. Display the instance metadata through jq
    1. REST API call to list the resources in the resource group (stretch)
    1. Determine the key vault name using curl (stretchier)
    1. Display the psql_cmd secret value in the key vault
    1. Show psql connecting to the database with psql_cmd pulled from the key vault (stretchiest)

## Resources

* [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/general/)
* Key Vault extension
  * [Azure Arc Jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_servers/)
  * [Key Vault virtual machine extension for Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-linux?tabs=linux)
  * [Key Vault virtual machine extension for Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-windows?tabs=windows)
* Scripting with managed identities
  * [Authenticate against Azure resources with Arc enabled servers](https://docs.microsoft.com/azure/azure-arc/servers/managed-identity-authentication)
  * [Using managed identities on standard Azure VMs](/vm/identity)
  * [Instance Metadata Service - Linux](https://docs.microsoft.com/azure/virtual-machines/linux/instance-metadata-service?tabs=linux)
  * [Instance Metadata Service - Windows](https://docs.microsoft.com/azure/virtual-machines/windows/instance-metadata-service?tabs=windows)
  * [Azure Database for PostgreSQL using az postgres up](https://docs.microsoft.com/azure/postgresql/quickstart-create-server-up-azure-cli)
  * [Connect to PostgreSQL with psql](https://docs.microsoft.com/azure/postgresql/quickstart-create-server-database-portal#connect-to-the-server-with-psql)