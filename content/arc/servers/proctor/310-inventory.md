---
title: "Inventory"
description: "Start simple with inventory. Customise the Azure Arc-enabled Servers view and then create a resource graph query that can go across subscriptions."
slug: inventory
layout: single
draft: false
url: /arc/servers/inventory/proctor
series:
 - arc-servers-hack-proctor
weight: 310
---

{{< flash >}}
**TO BE UPDATED**
{{< /flash >}}

## Simple Resource Graph query

Search the Resource Graph Explorer for `Microsoft.HybridCompute/machines` as per the Arc server's properties.

Example query:

```text
resources
| where type == "microsoft.hybridcompute/machines"
```

## Refined Resource Graph query

The project operator allows rename and easy dot notation for JSON drill down.

```text
resources
| where type == "microsoft.hybridcompute/machines"
| project resourceGroup, name, os=properties.osSku, platform=tags.platform, cluster=tags.cluster, appId=identity.principalId, status=properties.status
| sort by name asc
```

Workbooks are created from the blade in Azure Monitor.

## Discussion points

These are covered by the networking radio button when generating the script.

It gives the option to specify a proxy server, or to use a private endpoint (preview) if the on prem environment is connected to Azure using ExpressRoute or a S2S VPN link.

## Success criteria

Screen share with your proctor to show that you achieved:

1. Onboarding all linux servers
1. Basic Resource Graph Explorer report

    ```text
    resources
    | where type == "microsoft.hybridcompute/machines"
    ```

Stretch targets:

1. Customised Resource Graph query

    ```text
    resources
    | where type == "microsoft.hybridcompute/machines"
    | project resourceGroup, name, os=properties.osSku, platform=tags.platform, cluster=tags.cluster, appId=identity.principalId, status=properties.status
    | sort by name asc
    ```
