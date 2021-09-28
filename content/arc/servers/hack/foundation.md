---
title: Foundation
description: "Plan for deployment and prepare the target resource group for your Arc servers."
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-hack-group
series:
 - arc-servers-hack
weight: 120
---

## Introduction

When you are onboarding VMs at scale then it makes sense to prepare the target environment first. As this is a small pilot then everything will be configured on a single resource group.

There is an excellent page and 10 minute video on Azure Docs called [Plan and deploy Azure Arc-enabled servers](https://docs.microsoft.com/azure/azure-arc/servers/plan-at-scale-deployment). Watch the video when you get the opportunity.

We will add a couple of simple tagging policies, and then add in a key vault with a self signed cert and the private SSH key if you created your on prem VMs in Azure. We'll also add in a couple of Azure Monitor workspaces.

You will also create a service principal for the onboarding scripts with the right RBAC role.

Finally you will create new AAD group for the Arc admins, but only if you have access within AAD.

If working in a team then it is recommended to split the tasks between you.

## Requirements

The onboarded VMs will be created in a dedicated resource group called arc_pilot. All Azure resources will be created in UK South.

The pilot evaluation team have decided to initally use a couple of tags at the resource group level that they want the resources to inherit.

| Tag | Value | Source |
|---|---|---|
| datacentre | Azure Citadel | Inherited from resource group |
| city | Reading | Inherited from resource group |
| platform | | azcmagent |
| cluster | | azcmagent |

The azcmagent tags will be configured as the VMs are onboarded in the next lab.

## Resource Group

* Create a resource group called arc_pilot
* Use Azure Policy to ensure all resources in the resource group inherit the specified tags

## Service Principal

* Create a service principal for use in scale onboarding scripts

Make sure that you take a copy of the JSON output as it includes the clientId/appId and the clientSecret/password.

## Azure AD Groups

Skip this step if you do not have the appropriate Azure AD role to create AAD security groups.

* Create a security group called _Azure Arc Admins_
  * Add all of the users in your team
  * Assign with a role for administering Azure Arc for Server resources

* Create three additional security Groups
  * _Security Operations Center_
  * _Cost Management_
  * _Linux App Dev_

  These may be left empty for the moment.

## Azure Monitor Workspaces

* Create Azure Monitor workspaces

  1. arc-pilot-core
  1. arc-pilot-soc
  1. arc-pilot-linuxapp

## Key Vault

This hack is not a test of your Key Vault skills, so please use the command blocks below.

### Get a uniq value

This will help ensure the FQDNs are unique.

```bash
uniq=$(az account show --query id --output tsv | cut -f1 -d-)
```

### Create the key vault

```bash
kv=arc-pilot-$uniq
az keyvault create --name $kv --retention-days 7 --resource-group arc_pilot --location uksouth
```

### Create a self signed certificate

The certificate will be used in the Key Vault Extension lab.

```bash
az keyvault certificate create --name self-signed-cert --vault-name $kv --policy "$(az keyvault certificate get-default-policy)"
```

### Private SSH Key

This will make it simpler to log into the linux VMs using

```bash
az keyvault secret set --name arc-pilot-private-ssh-key --vault-name $kv --file ~/.ssh/id_rsa
```

> If you specified a different SSH key pair when terraforming the environment then specify the correct private key file.

## Storage account

Create a storage account for custom scripts.

```bash
sa=arcpilotsa$uniq
az storage account create --name $sa --sku Standard_LRS --resource-group arc_pilot --location uksouth
```

Add a couple of containers.

```bash
az storage container create --account-name $sa --name powershell --public-access blob
az storage container create --account-name $sa --name bash       --public-access blob
```

## Success criteria

Show the proctor:

1. Resource group name, location, tags and resources
1. Policy assignments
1. RBAC assignments
1. Key Vault secrets

## Discussion points

As a stretch target, see how many roles there are for onboarding Azure Arc resources. Note the provider types that they interact with on the management plane. Some also have data actions.

## Resources

* <https://docs.microsoft.com/azure/azure-arc/servers/plan-at-scale-deployment>
* <https://docs.microsoft.com/governance/policy/assign-policy-portal>
* <https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#tags>
* <https://docs.microsoft.com/azure/role-based-access-control/built-in-roles>
* <https://docs.microsoft.com/azure/key-vault/certificates/quick-create-cli>
* <https://docs.microsoft.com/azure/key-vault/secrets/quick-create-cli>
* <https://docs.microsoft.com/azure/azure-monitor/logs/quick-create-workspace>
* <https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection>

## Next up

We have on prem servers and a target environment. Let's onboard the linux VMs.
