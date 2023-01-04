---
title: "Create onboarding scripts"
description: "Create the Bash and PowerShell scripts for onboarding using the service principal."
slug: create_scripts
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-create_scripts
series:
 - arc-servers
weight: 210
---

## Introduction

There are a number of ways to onboard VMs at scale. Some are detailed in the [Azure docs for Arc](https://aka.ms/AzureArcDocs) and there are more still in the [Azure Arc Jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_servers/).

The most basic way is to [use the portal](https://docs.microsoft.com/en-gb/azure/azure-arc/servers/onboard-service-principal#generate-the-installation-script-from-the-azure-portal) to generate scripts which **can then be used on multiple servers**.

This is a good fit with customers who prefer to retain their own admin access to the on prem servers and have their own preferred tooling for remote execution of scripts on multiple hosts. It could be simple scripted WinRM and ssh commands, or something more industrial such as System Center, Ansible, Chef, Puppet, Salt etc.

{{< flash >}}
A good opportunity for someone different to take control.

The scripts may commonly be created by a consultant from the partner and then given to the on prem admin team to execute.
{{< /flash >}}

Providing the generated script and service principal credentials to others for execution is not considered a security issue. The very limited RBAC role given to the service principal is only capable of onboarding VMs and nothing more.

The end point of this lab will emulate that script handover as it is closer to the workflow you would see in a professional services engagement.

## Service principal

1. Grab the resource id for the arc_pilot resource group

    ```bash
    rgId=$(az group show --name arc_pilot --query id --output tsv)
    ```

1. Create a service principal with the *Azure Connected Machine Onboarding* role

    ```bash
    az ad sp create-for-rbac --name arc_pilot --role "Azure Connected Machine Onboarding" --scopes $rgId
    ```

    ⚠️ Make sure that you take a copy of the JSON output as it includes the clientId/appId and the clientSecret/password.

    > The portal will look for service principals with the *Azure Connected Machine Onboarding* role when generating scripts.

## Script generation

⚠️ Challenge: Create PowerShell and Bash onboarding scripts.

* Provide a generated script that can be executed on *multiple servers*
* Onboard into the *arc_pilot* resource group and the *West Europe* region
* Include the following tags:

    | Tag | Value |
    |---|---|
    | platform | VMware vSphere |
    | cluster | POC |

    > If you are using a non-Azure platform for your on prem VMs then feel free to change the tag values.

* Ensure the script uses the service principal that you've just created

   💡 Hint 1: Add a shebang as the first line in the generated Bash script, e.g.:

    ```text
    #!/usr/bin/env bash
    ```

   💡 Hint 2: Lost the service principal secret already? Rerun the [`az ad sp create-for-rbac`](../arc_pilot#service-principal) command.

## Success criteria

Screen share with your proctor to show your

1. PowerShell script
1. Bash script

## Resources

* <https://docs.microsoft.com/azure/azure-arc/servers/onboard-service-principal>


## Next

In the next lab you will onboard a few of the VMs.
