---
headless: true
title: "Azure landing zone - Adding an override file"
---

## Creating a local override library

Local libraries are commonly used, enabling archetype_overrides so that customers can define deltas from the default baselines in the main libraries. By convention these local library are stored in the **./lib** folder, and contain only archetype override and architecture files. However you could also add customer specific assets if they require bespoke policies or role definitions.

{{< flash "tip" >}}
This is the recommended approach even if you are not overriding anything on day one.

Adding in a local override library after you have deployed Azure landing zone or Sovereign landing zone has a greater impact based on resource names in the Terraform state file.

This way you can easily choose to override the archetypes later. Or you have the option to add in a hosted custom library by either

- side loading a hosted custom library by extending the array in the alz provider block
- inserting a new dependency in the local library's metadata dependencies

and then updating the architecture definition.
{{< /flash >}}

{{< modes >}}
{{< mode title="Azure landing zone" >}}

### Creating an ALZ local override library

{{% shared-content "alz/local_library" %}}

{{< /mode >}}
{{< mode title="Sovereign landing zone" >}}

{{< flash >}}
The process for Sovereign landing zone is two-step and follows the official Microsoft documentation:

1. Create a standard local override library using exactly the same process as you would for the Azure landing zone platform library
1. Then update with additional files (and overwrites) specific to the Sovereign landing zone's additional management groups and archetypes

The update step below warns which files will be overwritten by step two.
{{< /flash >}}

### First create a standard local override library

{{% shared-content "alz/local_library" %}}

### Then extend for the Sovereign landing zone

{{% shared-content "alz/local_library/add_slz" %}}

{{< flash >}}
Note that the alz_architecture_definition.yaml architecture file's architecture name (and file prefix) is unchanged and uses **alz_custom** rather than **slz_custom**.

The reason for this approach is that the Sovereign landing zone scenario is designed to gracefully handle brownfield scenarios, uplifting existing Azure landing zone deployments to include the additional Sovereignty Landing Zone assets.
{{< /flash >}}
{{< /mode >}}
{{< /modes >}}

### Metadata dependencies

The dependencies in the local library's metadata file are now an additional control point for you.

{{< modes >}}
{{< mode title="Azure landing zone" >}}

Note that the local metadata library is stacked on top the Azure landing zone library, and specifies the release version.

{{< code lang="json" url="<https://github.com/Azure/alz-terraform-accelerator/raw/refs/heads/main/templates/platform_landing_zone/lib/alz_library_metadata.json>" >}}

{{< /mode >}}
{{< mode title="Sovereign landing zone" >}}

Note that it is stacked on top the Sovereign landing zone library, and specifies the release version.

{{< code lang="json" url="<https://raw.githubusercontent.com/Azure/alz-terraform-accelerator/refs/heads/main/templates/platform_landing_zone/examples/slz/lib/alz_library_metadata.json>" >}}

The Sovereign landing zone platform library is itself stacked on top of the Azure landing zone.

{{< /mode >}}
{{< /modes >}}

### Overrides

Check the custom library section for an overview of the library format and standard files including the archetype override files and architecture files found in your local override library.

## Update your Terraform config

You now need to make a few changes to repoint your Terraform config to use the local override library.

### Configure the alz provider block

Update the library reference in the provider block to use a custom_url to the local `./lib` folder.

```ruby
provider "alz" {
  library_references = [
    {
      custom_url = "${path.root}/lib"
    }
  ]
}
```

### Module block

View the management groups module in main.tf.

This is the module with `source  = "Azure/avm-ptn-alz/azurerm"`.

1. Update the architecture name

    Update to `architecture_name = "alz_custom" to match the name in your local override libraries

    ```ruby
    module "management_groups" {
      source  = "Azure/avm-ptn-alz/azurerm"
      version = "0.20.2"

      architecture_name  = "alz_custom"
    ```

    The rest of the block is killed here to keep it short.

1. Check the remaining arguments and values

    For example, `policy_default_values` and `policy_assignments_to_modify` objects.

## Next

OK, the local override library is in place. Note that the ALZ Accelerator will automate much of this process, although the Sovereign landing zone update to the local library is still a manual step. The local override library is very useful and flexible.

In addition to the standard archetype overrides, it also allows a local space to create

- custom policy and policy set definitions
- custom role definitions
- custom assignments
- new archetypes
- updated architectures to include the new archetypes
- new default values

See the [Custom Library](/slz/libraries/) series for creating and testing assets in custom libraries.

An override library is not necessarily designed for these, but there is technically nothing stopping for using it that way. Or you could have a second local library and include that as a second library in the alz provider library_reference array if you wanted to keep the archetype overrides separate from your custom definitions.

This would be a valid approach for a single repo and its landing zone deployment, but look at hosted custom libraries if reuse is important.

In the next page you will locally test the repo to give yourself the best chance of passing the CI workflow.
