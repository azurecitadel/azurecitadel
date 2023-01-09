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

## Azure Arc | Servers

After the agent is installed, verify that the servers have successfully connected in the Azure portal in the Azure Arc service, [Servers blade](https://aka.ms/hybridmachineportal).

Edit the view.

1. Edit columns
    1. Remove the default tags
    1. Add the city, datacentre, cluster and platform tags
1. Save the view as "Arc Hack"
1. Set as the default view

    {{< img light="/arc/servers/images/arc_hack_view-light.png" dark="/arc/servers/images/arc_hack_view-dark.png" alt="Arc Hack view" >}}

## Simple Resource Graph query

One of the benefits of onboarding on prem VMs to Azure is the core management plane organisation and reporting. The Kusto queries in Resource Graph Explorer is great for reporting across multiple subscriptions and resource groups.

If you are new to Resource Graph, the [quickstart with Azure Portal](https://docs.microsoft.com/en-us/azure/governance/resource-graph/first-query-portal) is a great place to begin.

* Create and save a simple Resource Graph query that lists the connected machines

    > Hint: Look at the properties blade for an Azure Arc-enabled Server to find the provider type and then search the resources in the Resource Graph Explorer.

## Refined Resource Graph use (optional)

This is a stretch target.

* Customise the previous query to only show the following fields

![Resource Graph](/arc/servers/images/resourceGraph.png)

* Save the query
* Add to a workbook and save to the poc_pilot resource group

    > Hint: Check out the Kusto Query Language's project operator

## Success criteria

Screen share with your proctor to show your

1. Azure Arc-enabled Servers in the Azure Portal with the customised view
1. Resource Graph KQL query and tabular output

## Resources

* <https://aka.ms/hybridmachineportal>
* <https://learn.microsoft.com/azure/governance/resource-graph/first-query-portal>
* <https://learn.microsoft.com/azure/azure-arc/servers/resource-graph-samples>
* <https://learn.microsoft.com/azure/data-explorer/kusto/concepts/>
* <https://learn.microsoft.com/azure/azure-monitor/visualize/workbooks-overview>


## Next

In the next lab you will start looking at monitoring and security.
