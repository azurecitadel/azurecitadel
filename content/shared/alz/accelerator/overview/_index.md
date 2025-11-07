---
headless: true
title: "Azure Landing Zones - Accelerator Overview"
---


## What is the Azure Landing Zones Accelerator?

The Azure Landing Zones Accelerator generates the infrastructure code, configuration files, and CI/CD pipelines needed to deploy and manage your Azure Landing Zones. This significantly reduces the time and effort required to establish a production-ready Azure environment.

![ALZ Accelerator Logo](https://raw.githubusercontent.com/Azure/Azure-Landing-Zones/main/docs/static/img/alz-accelerator-logo.png)

It supports multiple combinations of version control (Azure DevOps and GitHub), deployment tools (Terraform and Bicep), and can be run locally or in CI/CD pipelines.

The accelerator uses a combination of PowerShell cmdlets and auto-generated Terraform configuration, but whilst it uses Terraform it should be considered a one-off deployment.

The resulting repository hosted in GitHub or Azure DevOps then contains the configuration for deploying an Azure Landing Zones or Sovereign Landing Zones. The CI/CD pipelines, least privilege workload identities, private runners, and remote state are ready for long term and structured lifecycle management of your platform landing zone.

## Process

The diagram below shows the overall process and components. This series will walk you through sections 1 and 2 - prereqs and bootstrap - so that you understand the process and are set for the rest of the labs with an standard config.

![Accelerator Overview](https://raw.githubusercontent.com/Azure/Azure-Landing-Zones/main/docs/content/accelerator/img/alz-terraform-accelerator.png)

You will notice that the accelerator supports GitHub, Azure Devops and local file system, plus starter modules for both Bicep and Terraform. These labs focus solely on **GitHub with Terraform**. Refer to the [official ALZ Accelerator documentation](https://aka.ms/alz/accelerator) for the other options.

## Starter modules

The accelerator can make use of several standard starter modules:

- **basic** - A minimal configuration for small environments
- **standard** - The recommended starting point for most organisations
- **hubnetworking** - Includes hub and spoke networking topology
- **complete** - A comprehensive configuration with all features enabled

However, in these labs we will use the undocumented **empty** template instead. This approach allows us to build up the configuration incrementally, providing a deeper understanding of how the components work together and how they can be customised to meet specific requirements.

It is recommended that once you are familiar with the process that you then read through the remainder of the Azure Landing Zones accelerator documentation to understand the planning process, how to use the input files for the other starter modules, and the other options available to you.
