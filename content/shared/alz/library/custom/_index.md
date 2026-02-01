---
headless: true
title: "Azure Landing Zones Library - Creating and using hosted custom libraries"
description: "Where to host, how to secure."
---

## Overview

The focus of the deploy lab series for both Azure Landing Zone and Sovereign Landing Zone was the platform libraries themselves, and the local override library that you then added to your repo before testing and deploying via the CI/CD pipelines.

For most customers this will be all they ever need.

The platform libraries will be updated over time, and you have control on how and when you update to a more recent version using the semantic versioning specified in the ref argument for either the alz provider block's library_references array or in the local override metadata' dependencies array.

The local override library can be use to add or remove whole definitions or assignments, and the module block can be used to modify those assignments. The local library could also be used to host custom definitions and assignments and extend at that level.

Environment variable are already embedded into the GitHub config that the ALZ Accelerator created, and it wouldn't take too much to extend that with a more complex pipeline structure for a [canary approach](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/design-area/multi-tenant/canary).

So, what is the point of a custom library hosted in GitHub?

{{< flash >}}
There are a main reasons, and I'll give a single word for each: **reuse** and **security**.

The main reason is reuse and it particularly valid for the work I do with Microsoft partners. Here they can pull together their own custom definitions into a custom repo and reuse for multiple Azure Landing Zone customers, including support for multiple archetypes and architectures for common patterns, avoiding local overriding by default.

The value is even greater in sovereignty scenarios, where the baseline Sovereign Landing Zone library can be extended and customised with packs specific to requirement for specific regions, countries, and industry compliancy demands.

A benefit is that the custom libraries support semantic versioning, which allows release control at a customer level.

Finally, there is the question of security which is enhanced by keeping the configs cleanly outside of the main customer repo. This allows for a more flexible security model where the right group has access to make feature branch changes to the customer repo, whilst the separate repos for custom library user and for CI/CD workflows remain outside and can have separate RBAC permissions.
{{< /flash >}}

These pages specify GitHub for hosting the custom library, but it could be any valid URL format that [go-getter](https://pkg.go.dev/github.com/hashicorp/go-getter#readme-url-format) can access.

## Reference repos

This series has described the assets and structure of a library, but it is always useful to look at examples as a reference point when creating your own custom libraries.

Platform libraries found in the platform subfolder of <https://aka.ms/alz/library>:

- [platform/alz](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/alz),

    The main Azure Landing Zone repo has a huge selection of assets to use as a reference.

- [platform/slz](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/slz)

    The Sovereign Landing Zone library is a good example of a "stacked" library, extending the dependency (alz) and creating new management groups in the architecture. This is the repo I use most often as a reference when creating custom libraries.

- [platform/amba](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/amba)

    The Azure Monitor Baseline Alerts library is more standalone and assumes that the management group hierarchy is already in place. Note the `"exists": true` against the management groups in the architecture files.

    This library is useful as it serves a slightly different purpose with its Deploy If Not Exists policies when compared to the governance focused alz and slz libraries. The library could also be "sideloaded" as the second library in an array if you wanted both alz/slz and amba deployed together.

Additional example library repos found pinned in my <https://github.com/richeney-org> GitHub organisation:

- [Azure-Citadel-Custom-Library](https://github.com/richeney-org/Azure-Citadel-Custom-Library)

    Example single custom library for Azure Landing Zones' alz provider for partners or organisations that repeatably deploy customised landing zones.

- [Sovereign-Landing-Zone-Packs](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs)

    Example repo capable of hosting multiple libraries to extend a Sovereign Landing Zone to meet country and industry requirements. Each library will be in a subfolder.

Construct your repo to match the format of one of these.

## Checking assets

The library specific constructs - archetypes, overrides, architectures, metadata, policy default values - are all pretty simple, so the key is to check that your assets - policies, policy sets, assignments, and role definitions - are all functioning correctly.

{{< flash "tip" >}}

All of the assets are designed for creation and use at a management group level. You may wish to create one specifically for testing, e.g.:

```bash
az account management-group create --name "test" --display-name "Library test scope"
```

This will allow you to test creation without affecting any subscriptions or their resources.

{{< /flash >}}

These are example commands that I use to check that my JSON files are syntactically sound and create the Azure resources correctly.

{{< flash "warning" >}}
Whether your policy and role definitions actually achieve the intended functionality is outside the scope of these pages, and you naturally use these commands at your own risk.
{{< /flash >}}

The alz provider and All of f testing at management group level then you may wish to create one specifically for testing.

1. Define the scope

    Example for the current subscription.

    ```bash
    scope="subscriptions/$(az account show --query id --output tsv)"
    ```

    Example for a management group called "_test_".

    ```bash
    scope="/providers/Microsoft.Management/managementGroups/test"
    ```

1. Set the file variable

    It is assumed that you have already ensured that the name value within the file matches the prefix for the filename.

    {{< modes >}}
{{< mode title="Policy Definition" >}}
Example policy definition filename.

```bash
file="policy_definitions/Enforce-KV-Premium.alz_policy_definition.json"
```

{{< /mode >}}
{{< mode title="Policy Set Definition" >}}
Example policy definition filename.

```bash
file="policy_set_definitions/Deny-NL-Global.alz_policy_set_definition.json"
```

{{< /mode >}}
{{< mode title="Policy Assignment" >}}
Example policy definition filename.

```bash
file="policy_assignments/Deny-NL-Global.alz_policy_assignment.json"
```

{{< /mode >}}
{{< mode title="RBAC Role Definition" >}}
Example policy definition filename.

```bash
file="role_definitions/fabric_reader.alz_role_definition.json"
```

{{< /mode >}}
{{< /modes >}}

1. Test using the REST API

    The REST API is preferable to the matching CLI and PowerShell cmdlets as they cannot use the full JSON file definitions.

    {{< modes >}}
{{< mode title="Policy Definition" >}}

```bash
name="$(basename $file .alz_policy_definition.json)"
uri="${scope}/providers/Microsoft.Authorization/policyDefinitions/${name}?api-version=2021-06-01"
az rest --method put --url "$uri" --body @"$file"
```

{{< /mode >}}
{{< mode title="Policy Set Definition" >}}

```bash
name="$(basename $file .alz_policy_set_definition.json)"
uri="${scope}/providers/Microsoft.Authorization/policySetDefinitions/${name}?api-version=2021-06-01"
az rest --method put --url "$uri" --body @"$file"
```

{{< /mode >}}
{{< mode title="Policy Assignment" >}}

```bash
name="$(basename $file .alz_policy_assignment.json)"
uri="${scope}/providers/Microsoft.Authorization/policyAssignments/${name}?api-version=2023-04-01"
az rest --method put --url "$uri" --body @"$file"
```

{{< /mode >}}
{{< mode title="RBAC Role Definition" >}}

```bash
name="$(basename $file .alz_role_definitioncopilot.json)"
uri="${scope}/providers/Microsoft.Authorization/roleDefinitions/${name}?api-version=2022-04-01"
az rest --method put --url "$uri" --body @"$file"
```

{{< /mode >}}
{{< /modes >}}


### Policy Definitions

{{% shared-content "alz/library/assets/testing/policy_definitions" %}}

### Policy Set Definitions

{{% shared-content "alz/library/assets/testing/policy_set_definitions" %}}

### Policy Assignments

{{% shared-content "alz/library/assets/testing/policy_assignments" %}}

### Role Definitions

{{% shared-content "alz/library/assets/testing/role_definitions" %}}

## Semantic versioning, tags and releases

By convention the custom libraries should be versioned with releases. This allows you to update libraries in the future with control. The [semantic versioning](https://semver.org/) convention is the standard: `MAJOR.MINOR.PATCH`.

Rerunning existing CI/CD pipelines will not show any changes to be made if the existing alz provider blocks are pinned to a specific version of your library.  then .



The tags are the important part

## Specifying custom libraries with custom_url

TODO
