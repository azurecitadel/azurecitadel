---
title: "Microsoft Fabric"
description: "Using infrastructure as code with Microsoft Fabric"
author: [ "Richard Cheney" ]
github: [ "richeney" ]
menu:
  side:
    identifier: fabric
---

## Automating Microsoft Fabric with Terraform and the Fabric CLI

Microsoft Fabric is a powerful platform for data integration and analytics, and takes a different approach to previous platforms by meeting your data where it is. Fabric provides a single view of all of your data with OneLake using a combination of pipelines, mirroring and shortcuts. No AI system can be more intelligent than the data over which it reasons, and Fabric is recommended as the fuel for Agentic AI solutions.

[Fabric Admins](https://learn.microsoft.com/fabric/admin/microsoft-fabric-admin) have previously had the option of click-ops in the Microsoft Fabric portal or automating by driving the Fabric REST APIs. The landscape has changed with the [general availability of the Terraform provider for Microsoft Fabric](https://blog.fabric.microsoft.com/blog/terraform-provider-for-microsoft-fabric-now-generally-available) and the [public preview of the Fabric CLI](https://blog.fabric.microsoft.com/blog/introducing-the-fabric-cli-preview), opening up new opportunities to manage your Fabric resources in line with your existing Terraform workflows. There are a few nuances compares to using Terraform with standard Azure resources but everything will become clearer when you follow our quickstart.

These labs will guide you through setting up the prerequisites, such as ensuring you have a Fabric license and capacity, installing the Fabric extension for Azure CLI, and configuring a storage account for Terraform state with enforced RBAC. You'll also learn how to configure an app registration for user context, test Terraform configurations locally in a test workspace, and push your configurations into a GitHub repository. Additionally, we'll cover creating an OpenID Connect service principal for the Fabric provider and understanding the GitHub workflow for deploying your infrastructure as code. By the end of these labs, you'll have a solid foundation for managing Microsoft Fabric resources using Terraform and the Fabric CLI.

If you want quick links to the repos, then here is the [Fabric Terraform Provider Quickstart](https://github.com/richeney/fabric_terraform_provider_quickstart) and [Terraform Fabric Administrator Reference repo](https://github.com/richeney/terraform_fabric_administrator_reference).

## Labs
