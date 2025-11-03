---
headless: true
title: "Azure Landing Zones - Bootstrap Process"
---


## Learning Path Context

In the learning path, we'll walk through each step in detail and explain the architecture decisions behind the accelerator configuration. This provides a deeper understanding of the Azure Landing Zones framework.## Overview



After completing the bootstrap, you can continue with:<COPILOT>

- [Initial Configuration](../initial/) - Setting up your first landing zone

- [Demote](../demote/) - Removing elevated permissionsNeed an overview of the accelerator. Talk about the fact it is not mandatory. And we are using an empty config so that we can build it up.

Personas:

* Global Admin in Entra
* GitHub Admin
* Bootstrapper
* Platform Landing Zone Team

Mention that the privileged RBAC role is needed only for the duration of the bootstrap. This is one persona. The persona running the bootstrap may be the same ID or someone else. Then the RBAC role assignment may be deleted and the Global Admin elevation removed.

All access after that will be based on GitHub repo permissions and the RBAC permissions for the managed identities used as federated workload identities bu the GitHub Actions CI/CD pipelines.

Another persona for those with access to write to branches of the repo. Suggested minimum of two.

Reminder of the prereqs

## Create the accelerator area

1. Create the directory structure

    ```powershell
    New-Item -ItemType "file" "~/accelerator/config/inputs.yaml" -Force
    New-Item -ItemType "directory" "~/accelerator/output"
    Set-Location "~/accelerator"
    ```

1. Open Visual Studio Code

    ```powershell
    code .
    ```

1. Edit the inputs.yaml file

    Add the following code block.

    ```yaml
    ---
    # For detailed instructions on using this file, visit:
    # https://aka.ms/alz/accelerator/docs

    # Basic Inputs
    iac_type: "terraform"
    bootstrap_module_name: "alz_github"
    starter_module_name: "empty"

    # Shared Interface Inputs
    bootstrap_location: "changeMe"
    root_parent_management_group_id: ""
    subscription_ids:
      management: "changeMe"
      identity: "changeMeOrDeleteMe"
      connectivity: "changeMeOrDeleteMe"
      security: "changeMeOrDeleteMe"

    # Bootstrap Inputs
    github_personal_access_token: "changeMe"
    github_runners_personal_access_token: "changeMe"
    github_organization_name: "changeMe"
    use_separate_repository_for_templates: true
    bootstrap_subscription_id: "changeMe"
    service_name: "alz"
    environment_name: "mgmt"
    postfix_number: 1
    use_self_hosted_runners: true
    use_private_networking: true
    allow_storage_access_from_my_ip: false
    apply_approvers: ["changeMe"]
    create_branch_policies: true

    # Advanced Inputs
    bootstrap_module_version: "latest"
    output_folder_path: "~/accelerator/output"
    ```

    Modify the values for

    * the bootstrap_location uses a region shortcode, e.g. `"uksouth"`
    * the subscription GUIDs for your platform subscriptions
    * the personal access tokens you generated for both the accelerator and the private runners
    * the GitHub organization name, i.e. your equivalent of `"richeney-org"`
    * the list of GitHub user IDs that you want to add to apply_approvers, i.e. your equivalent of `["richeney"]`

    Save the file.

## Run the bootstrap

1. Move to the output folder and run the accelerato

    ```powershell
    Set-Location "~/accelerator/output"
    Deploy-Accelerator -inputs "~/accelerator/config/inputs.yaml"
    ```

    The accelerator check that the prereqs have been met, downloads the required modules, and then generates a config based in the inputs.yaml.

    Once complete it then runs a standard Terraform workflow to initialize and run a plan against the generated config.

    {{< details "Example output" >}}

```text
Checking the software requirements for the Accelerator...

Check Result Check Details
------------ -------------
Success      PowerShell version 7.5.0 is supported.
Success      Git is installed.
Success      Azure CLI is installed.
Success      Azure CLI is logged in. Tenant ID: ac40fc60-2717-4051-a567-c0cd948f0ac9, Subscription: Platform - Management (a7484f13
             -d60f-4e5a-a530-fdaade38716a)
Success      ALZ module is the latest version (4.3.4).


Getting ready to deploy the accelerator with you...

Checking you have the latest version of Terraform installed...

Checking and Downloading the bootstrap module...
The directory for ~/accelerator/output/bootstrap/v5.2.0 has been created and populated.

Checking and downloading the starter module...
The directory for ~/accelerator/output/starter/v11.0.0 has been created and populated.

Thank you for providing those inputs, we are now initializing and applying Terraform to bootstrap your environment...

Once the plan is complete you will be prompted to confirm the apply.
Initializing the backend...
Initializing modules...
- architecture_definition in ../../modules/template_architecture_definition
- azure in ../../modules/azure
Downloading registry.terraform.io/Azure/avm-utl-regions/azurerm 0.5.2 for azure.regions...
- azure.regions in .terraform/modules/azure.regions
- azure.regions.cached_data in .terraform/modules/azure.regions/modules/cached-data
- files in ../../modules/files
- github in ../../modules/github
- resource_names in ../../modules/resource_names
Initializing provider plugins...
- Finding azure/azapi versions matching "~> 2.0, ~> 2.2"...
- Finding integrations/github versions matching "~> 6.5"...
- Finding hashicorp/random versions matching "~> 3.5, ~> 3.6"...
- Finding hashicorp/http versions matching "~> 3.4"...
- Finding hashicorp/local versions matching "~> 2.4"...
- Finding azure/modtm versions matching "~> 0.3"...
- Finding hashicorp/azurerm versions matching "~> 4.20"...
- Installing azure/azapi v2.7.0...
- Installed azure/azapi v2.7.0 (signed by a HashiCorp partner, key ID 6F0B91BDE98478CF)
- Installing integrations/github v6.7.0...
- Installed integrations/github v6.7.0 (signed by a HashiCorp partner, key ID 38027F80D7FD5FB2)
- Installing hashicorp/random v3.7.2...
- Installed hashicorp/random v3.7.2 (signed by HashiCorp)
- Installing hashicorp/http v3.5.0...
- Installed hashicorp/http v3.5.0 (signed by HashiCorp)
- Installing hashicorp/local v2.5.3...
- Installed hashicorp/local v2.5.3 (signed by HashiCorp)
- Installing azure/modtm v0.3.5...
- Installed azure/modtm v0.3.5 (signed by a HashiCorp partner, key ID 6F0B91BDE98478CF)
- Installing hashicorp/azurerm v4.49.0...
- Installed hashicorp/azurerm v4.49.0 (signed by HashiCorp)
Partner and community providers are signed by their developers.
If you'd like to know more about provider signing, you can read about it here:
https://developer.hashicorp.com/terraform/cli/plugins/signing
Terraform has created a lock file .terraform.lock.hcl to record the provider
selections it made above. Include this file in your version control repository
so that Terraform can guarantee to make the same selections by default when
you run "terraform init" in the future.

Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.

Terraform init has completed, now running the apply...

Running Plan Command for apply : terraform -chdir=/home/richeney/accelerator/output/bootstrap/v5.2.0/alz/github plan -out=tfplan -input=false

<snipped terraform plan output>

Plan: 153 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  + details = {
      + iac_type            = "terraform"
      + starter_module_name = "empty"
    }

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

Saved the plan to: tfplan

To perform exactly these actions, run the following command to apply:
    terraform apply "tfplan"

Time taken to complete Terraform plan:

Days Hours Minutes Seconds Milliseconds
---- ----- ------- ------- ------------
0    0     0       10      463


Terraform plan has completed, please review the plan and confirm you wish to continue.

Confirm Terraform plan
Please confirm you wish to apply the plan.
[Y] Yes  [N] No  [?] Help (default is "Y"):

```

{{< /details >}}

    The config generation process takes less than a minute. For into, the accelerator runs the terraform plan and apply in the `output/bootstrap/<version>/alz/github` folder.

1. Check the bootstrap plan
1. Approve with `Y` to continue

    The bootstrap will create the Azure and GitHub resources. The process should complete in under 15 minutes.

    {{< flash >}}
Note that the generated config for the bootstrap itself is considered ephemeral. It is purely used to bootstrap the environment and is then discarded, rather than being maintained for full lifecycle management.

However, you may wish to preserve the accelerator folder, including the inputs.yaml in the config folder plus the tools, bootstrap and starter configs downloaded and generated in the output folder.
{{< /flash >}}

## Azure

<TODO VIDEO>

## GitHub

<TODO VIDEO>

Include the branch security

## References

* <https://aka.ms/alz>
* <https://aka.ms/alz/accelerator/docs>
* <https://github.com/Azure/alz-terraform-accelerator>
