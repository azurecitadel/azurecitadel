---
title: "Scale Onboarding for Linux"
description: "Onboarding multiple Linux servers with a service principal, then connecting with the azcmagent."
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-hack-linux
series:
 - arc-servers-hack
weight: 130
---

## Introduction

There are a number of ways to onboard VMs at scale. Some are detailed in the [Azure docs for Arc](https://aka.ms/AzureArcDocs) and there are more still in the [Azure Arc Jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_servers/).

For the linux VMs we will use the portal to generate a script which can then be used on multiple servers.

This is a good fit with linux VMs as the on prem linux admins will usually have their own preferred tooling for remote execution of scripts on multiple hosts. It could be simple scripted sftp and ssh commands, or something more industrial such as Ansible, Chef, Puppet, Salt etc.

## Handover

Providing the generated script and service principal credentials to others for execution is not considered a security issue.

The very limited RBAC role given to the service principal is only capable of onboarding VMs and nothing more.

This lab will emulate that script handover as it is closer to the workflow you would see in a professional services engagement.

If you are working as a team then ensure that the script generation and execution are done by different people.

## Script generation

**Your role is to create a working script for the linux admins to use.**

* Provide a generated script that can be executed on multiple servers
* Ensure the script uses the service principal that was created in the last lab
* Include the following tags:

    | Tag | Value |
    |---|---|
    | platform | VMware vSphere |
    | cluster | POC |

    > If you are using a non-Azure platform for your on prem VMs then feel free to change the tag values.

💡 Hint: the generated script will need a little work. Copy into vscode notepad++ or another editor, make the changes and clean up.

## Onboard the linux VMs

**As a linux admin, you will run the provided script on each of the VMs.**

On each on prem linux server:

* Create a local script on each server called arc.sh
* Run the arc.sh script as root, e.g. `sudo sh arc.sh`

If you have used the default variables with the terraform repo then you will be using the Bastion service to connect:

![Bastion](/arc/servers/images/bastion.png)

## Simple Resource Graph query

One of the benefits of onboarding on prem VMs to Azure is the core management plane organisation and reporting. The Kusto queries in Resource Graph Explorer is great for reporting across multiple subscriptions and resource groups.

* Create and save a simple Resource Graph query that lists the connected machines

    > Hint: Look at the properties blade for an Azure Arc-enabled Server to find the provider type and then search the resources in the Resource Graph Explorer.

## Refined Resource Graph use (optional)

This is a stretch target.

* Customise the previous query to only show the following fields

![Resource Graph](/arc/servers/images/resourceGraph.png)

* Save the query
* Add to a workbook and save to the poc_pilot resource group

    > Hint: Check out the Kusto Query Language's project operator

## Discussion points

How would you deal with an environment that

* Uses a proxy server to access the internet?
* Does not allow any internet connectivity?

## Success criteria

Screen share with your proctor to show that you achieved:

1. Onboarding all linux servers
1. Basic Resource Graph Explorer report

Stretch targets:

1. Customised Resource Graph query
1. Azure Monitor Workbook with the resulting table

## Resources

* <https://docs.microsoft.com/azure/azure-arc/servers/onboard-service-principal>
* <https://docs.microsoft.com/azure/governance/resource-graph/>
* <https://docs.microsoft.com/azure/data-explorer/kusto/concepts/>
* <https://docs.microsoft.com/azure/azure-monitor/visualize/workbooks-overview>

## Next

In the next lab you will onboard the Windows VMs using Windows Admin Center.
