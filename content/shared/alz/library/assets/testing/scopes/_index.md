---
headless: true
title: "Azure landing zone Library - Scopes"
description: "Setting scopes at management group or subscription level."
---

When working with custom policies and role definitions, you have to create those at a scope point. Most of the definitions are created at a high scope point such as Sovereign landing zone (`alz`) so that they can be used throughout the environment. For testing, I often use the current subscription scope as it is simple to clean it up afterwards. Both options are shown.

#### Management Group Scope

Here the scope is being set to the `alz` management group.

{{< modes >}}
{{< mode title="Bash" >}}

1. List the management groups

    ```bash
    az account management-group list --query "[].{DisplayName:displayName, Name:name}" --output table
    ```

    Example output.

    ```text
    DisplayName             Name
    ----------------------  ------------------------------------
    Tenant Root Group       <tenantId>
    Sovereign landing zone  alz
    Confidential Corp       confidential-corp
    Confidential Online     confidential-online
    Connectivity            connectivity
    Corp                    corp
    Decommissioned          decommissioned
    Identity                identity
    Landing Zones           landingzones
    Management              management
    Online                  online
    Platform                platform
    Public                  public
    Sandbox                 sandbox
    Security                security
    ```

1. Set the scope variable to a management group scope

    ```shell
    scope="/providers/Microsoft.Management/managementGroups/alz"
    ```

{{< /mode >}}
{{< /modes >}}

#### Subscription Scope

Here the scope if being set to the current subscription.

1. Set the scope variable to a subscription scope

    {{< tabs >}}
{{< tab title="Bash" >}}

```bash
scope="/subscriptions/$(az account show --query id -otsv)"
```

{{< /tab >}}
{{< /tabs >}}
