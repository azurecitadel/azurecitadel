---
title: "Inventory"
description: "Start simple with inventory. Customise the Azure Arc-enabled Servers view and then create a resource graph query that can go across subscriptions."
slug: inventory
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-inventory
series:
 - arc-servers
weight: 310
---

## Introduction

As well as centralising monitoring and improving security, the most common use case for Azure Arc-enabled Servers is simple asset management.



{{< flash >}}
A good opportunity for someone different to take control.

The scripts may commonly be created by a consultant from the partner and then given to the on prem admin team to execute.
{{< /flash >}}

## Verify the VMs are onboarded

After the agent is installed, verify that the servers have successfully connected in the Azure portal in the Azure Arc service, [Servers blade](https://aka.ms/hybridmachineportal).

Edit the view.

1. Edit columns
    1. Remove the default tags
    1. Add the city, datacentre, cluster and platform tags
1. Save the view as "Arc Hack"
1. Set as the default view

    {{< img light="/arc/servers/images/arc_hack_view-light.png" dark="/arc/servers/images/arc_hack_view-dark.png" alt="Arc Hack view" >}}

## Success criteria

Screen share with your proctor to show your

1. PowerShell script
1. Bash script

## Resources

* <https://docs.microsoft.com/azure/azure-arc/servers/onboard-service-principal>


## Next

In the next lab you will onboard a few of the VMs.
