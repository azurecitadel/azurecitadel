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

It is assumed that you will be proficient with creating custom policies, assignments and role definitions, and comfortable with git and GitHub. Therefore this page will be reference level to give a few key pointers that you may find useful.

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

These are the example commands that I use to check that my JSON files are syntactically sound and create the Azure resources correctly.

{{< flash "warning" >}}
Whether your policy and role definitions actually achieve the intended functionality is outside the scope of these pages, and you naturally use these commands at your own risk.
{{< /flash >}}

1. Define the scope

    The example is for a management group called "_test_". Change if required.

    ```bash
    scope="/providers/Microsoft.Management/managementGroups/test"
    ```

1. Set the file variable

    It is assumed that you have already ensured that the name value within the file matches the prefix for the filename.

    {{< modes >}}
{{< mode title="Policy Definition" >}}
Example policy definition filename. Change as required.

```bash
file="policy_definitions/Enforce-KV-Premium.alz_policy_definition.json"
```

{{< /mode >}}
{{< mode title="Policy Set Definition" >}}
Example policy set definition filename. Change as required.

```bash
file="policy_set_definitions/Deny-NL-Global.alz_policy_set_definition.json"
```

{{< /mode >}}
{{< mode title="Policy Assignment" >}}
Example policy assignment filename. Change as required.

```bash
file="policy_assignments/Deny-NL-Global.alz_policy_assignment.json"
```

{{< /mode >}}
{{< mode title="RBAC Role Definition" >}}
Example role definition filename. Change as required.

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

1. Delete

    Assuming that the definitions were successfully created, you may want to tidy up and remove them. Here are the commands to match the example names. Update as required.

    {{< modes >}}
{{< mode title="Policy Definition" >}}

```bash
az policy definition delete --management-group test --name "Enforce-KV-Premium"
```

{{< /mode >}}
{{< mode title="Policy Set Definition" >}}

```bash
az policy set-definition delete --management-group test --name  "Deny-NL-Global"
```

{{< /mode >}}
{{< mode title="Policy Assignment" >}}

```bash
az policy assignment delete --scope /providers/Microsoft.Management/managementGroups/test --name "Deny-NL-Global"
```

{{< /mode >}}
{{< mode title="RBAC Role Definition" >}}

```bash
az role definition delete --scope /providers/Microsoft.Management/managementGroups/test --name  "fabric_reader"
```

{{< /mode >}}
{{< /modes >}}

## Using the alzlibtool

The alzlibtool is a standalone CLI tool that is part of the [github.com/Azure/alzlib](https://github.com/Azure/alzlib) source repo. The tool has many uses, but I primarily use it to

- check and validate a custom library
- generate the documentation in the style seen for the platform libraries' README.md files

You will need to have [Go](https://go.dev/doc/install) installed.

### Install

```bash
go install github.com/Azure/alzlib@latest
```

By default this will install azlibtool into your $HOME/go/bin directory.

### Testing libraries

The alzlibtool can validate your custom library structure and content to ensure it conforms to the expected format.

```bash
alzlibtool check library .
```

This assumes you are running in the root of your library.

### Creating documentation

The alzlibtool can automatically generate comprehensive documentation for your custom library in markdown format, including the mermaid diagrams for the architecture hierarchy if it contains a hierarchy file. The command only works if your library can pass the check.

{{< flash "warning" >}}
Note that this will command will overwrite the current directories README.md file if it exists. You may want to remove the redirection, or pick another filename.
{{< /flash >}}

Generate documentation and output to README.md.

```bash
alzlibtool document library . > README.md
```

This creates markdown files documenting all archetypes, policies, assignments and other library components. You can then customise.

Note that the provide block generated for the Usage section is in the format for a platform library, with path and ref arguments. Update to your custom_url format, e.g.:

```ruby
provider "alz" {
  library_references = [
    {
      custom_url = "github.com/richeney-org/Sovereign-Landing-Zone-Packs//country/nl/bio?ref=2026.01.0"
    }
  ]
}
```

## Semantic versioning, tags and releases

Follow the formatting of the platform libraries by adding your own tags and releases.

{{< modes >}}
{{< mode title="GitHub CLI" >}}

This GitHub CLI command to create releases is great. Once you have committed and pushed your repo, you can use this to interactively and it will configure a tag on the local and origin, and it will create a release in GitHub.

```bash
gh release create 2026.01.0
```

Modify the semantic version to match the right yyyy.mm.v for your release. This will also be interactively suggested for the Title, so hit enter to accept.

If you select **Write using generated notes as template** then it will generate default release notes based on your commits and their descriptions and open in your default editor. Save.

You can then publish, save as draft or cancel.

{{< /modes >}}
{{< /mode >}}

{{< flash >}}
Note that it is the tag which is specified in your ref value, not the GitHub releases per se. However, the standard for these libraries is to ensure that the same value is used for both to avoid unnecessary confusion.

{{< /flash >}}
