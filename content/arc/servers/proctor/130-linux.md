---
title: "Scale Onboarding for Linux"
description: "Onboarding multiple Linux and WIndows servers with a service principal, then automate connecting with the azcmagent."
layout: single
draft: false
series:
 - arc-servers-hack-proctor
weight: 130
url: /arc/servers/linux/proctor
---

## Script

Hints:

* Push the team towards the links
* Use the portal to search for Azure Arc servers
* Click on the +
* The service principal will only show if it has the right role and scope
* The script needs to be customised with the service principal's secret (or password)

    > If the team has lost the password then rerun the `az ad sp create-for-rbac` command.

* If the team is not familiar with linux then assist
* If using the default Terraform deployment then click on a server in the onprem_servers resource group
  * Connect with Bastion
  * Username is `onpremadmin` (as per `terraform output`)
  * Select the private key from the key vault
    * This makes it easier for the other team members to connect
  * Share the work if possible
* Use `nano arc.sh` (or `vi` if you prefer)
* Paste the script in using right click on the mouse
* Save using `CTRL`+`o` to write out, hit enter to confirm the filename, then `CTRL`+`x` to exit
* Run using `sudo sh arc.sh`
  * The command saves adding execute permissions to the script
  * Runs as root

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

1. Azure Monitor Workbook with the resulting table
