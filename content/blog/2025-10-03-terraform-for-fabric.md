+++
Title = "Terraform for Fabric"
Description = "New labs for configuring Fabric Administration with the Terraform fabric provider."
Date = 2025-10-03T00:00:00Z
people = ["Richard Cheney"]
tags = ["citadel"]
draft = false
+++

I was fortunate enough to have a series of published on the Microsoft Fabric public blog. It was based on a series of hands on labs and resources that I created on Azure Citadel. Read on for a summary of the lab series!

The Azure Citadel labs for Microsoft Fabric can be found at <https://www.azurecitadel.com/fabric>. They first set you up for solo development of a Terraform config, and later add in a federated workload identity for use in either a GitHub or GitLab workflow. I may add a page for Azure DevOps in the future to round out the set further.

The labs are aimed as those who are familiar with Terraform but have been tasked with automating Fabric Administration as there are definitely some nuances with working with Microsoft Fabric and the fabric provider compared to using the azurerm, azapi, azuread, and msgraph providers.

I hope you find them useful. Also feel free to check out my [Terraform Provider for Microsoft Fabric](https://blog.fabric.microsoft.com/en-us/blog/author/Richard%20Cheney) pages on the Microsoft Fabric Updates Blog.

## Terraform For Fabric lab series

This series contains the following labs:

1. **Theory**

    This is really geared towards Fabric Administration, and this section talks through why this makes sense for many organisations. It also discusses some of the other options for those working as data engineers and analysts. This pulls directly from some of the Microsoft Learn recommendations and also mirrors a conversation I had with one of Microsoft's global service integrators.

1. **Prereqs**

    You will need to have a powerful set of authorisations in both Azure and Entra for the lab content, but you would expect that as a Fabric Administrator. This page will also get you set for success with registered providers and CLI tooling for Azure, GitHub, and Microsoft Fabric as well as Terraform and Visual Studio Code.

1. **Fabric Capacity**

    There are options for your Fabric capacity, and some useful information on authorisation controls for each. This is the first time we see how useful the Fabric CLI can be.

1. **Set up a Remote State**

    We get the backend storage account set up early, ready for use as solo development and later for use by the workflow pipelines. There is some sensible storage account configuration for RBAC access to avoid the use of keys, some secure networking recommendations, as well as additional protection for the state files written to blob. I did stop short of the complexity and cost of hosting runners and enforcing private networking, but it is a good middle ground.

1. **Create a repo from a GitHub template**

    As an accelerator, I have a GitHub template - <https://github.com/richeney/fabric_terraform_provider_quickstart.git> - to get you going with a very simple config.

1. **Configure an app reg for development**

    The fabric provider requires an app reg for user context. There is a [matching page](https://registry.terraform.io/providers/microsoft/fabric/latest/docs/guides/auth_app_reg_user) in the provider to follow, but I have written some CLI commands to configure it safely and in almost no time at all. Again, another time saver.

1. **Initial Terraform workflow**

    A quick blase through running Terraform init, plan, and apply after seeing up a backend block. The lab then hand holds you through a workspace role assignment to prove the Entra authorisation. Once thet plan and apply is complete then we finish testing by destroying the deployment.

1. **Expanding your config**

    OK, so now it is assumed that you are set to expand your config. This lab gives you links to the documentation pages and other resources, but the stars here are the MCP servers for Microsoft Learn and Terraform, and the tips on using the Fabric CLI to work out the arguments for some of the more complex fabric provider resources.

1. **Configure a workload identity**

    The pages on storage account backend, workload identity, GitHub / GitLab are so useful that I plan to pull those out as generic references in the Terraform area. Here we configure a user assigned managed identity with permissions to the storage account, to an Azure subscription, to Entra (using App Roles), and to Microsoft Fabric.

1. **GitHub Actions / GitLab pipeline for Microsoft Fabric**

    Now that you have a managed identity and backend, it is time to plumb into your CI/CD platform of choice. Here we have both GitHub and GitLab - again, based on partner engagements that I've had - and shows you how to configure the federated credential for OpenID Connect, add in the variables, and configure the workflow YAML for a successful CI/CD pipeline run.

## Key Highlights

### Fabric CLI

- Treats Fabric as a filesystem, e.g. listing out `.capacities` for names and IDs
- View the JSON definition for Fabric resources
- Access the Fabric REST API

### Fabric Capacity Authorisation

- **Entra**: Assign the *Fabric Administrator* role
- **Azure**: Add to *Administrators* array on the Fabric Capacity (UPNs or object IDs for workload identities)
- **Fabric**: Assign the *Admin* or *Contributor* Entra RBAC role to the capacity in the Fabric Admin Portal

### Terraform AuthN/AuthZ

- **User level**: Authenticate against the app registration for the Fabric API
- **Workload identities authentication**: Use OpenID Connect and federated credentials
- **Workload identities authorisation**:
  - Use developer settings in Fabric Admin Portal
  - Use an Entra security group for granularity and least privilege in Entra and Azure

### Resources for Building Configs

- <https://aka.ms/terraform/fabric>
- MCP servers for [Microsoft Docs](https://code.visualstudio.com/mcp) and [Terraform](https://developer.hashicorp.com/terraform/docs/tools/mcp-server) *(requires Docker)*
- My [reference repo](https://github.com/richeney/terraform_fabric_administrator_reference)

## Planned updates

I may come back to these if they prove popular. I think it would be useful to have a video at the top of each so that you can watch what each pages achieves. I also think that it would be useful to have a matching config and workflow for Azure DevOps.
