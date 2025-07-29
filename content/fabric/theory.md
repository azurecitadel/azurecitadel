---
title: "Theory"
description: "Should you automate everything in Microsoft Fabric using Terraform? Probably not..."
layout: single
draft: false
menu:
  side:
    parent: fabric
    identifier: fabric-theory
series:
 - fabric_terraform_administrator
weight: 2
---

## Introduction

Note that I don't think that Terraform is necessarily the best way to completely define all aspects of a Fabric environment. There is a natural split between the declarative automation that I would use for the more static admin tasks for Fabric that require a higher level of privilege - those covered in the [Microsoft Fabric documentation for admins](https://learn.microsoft.com/fabric/admin/) - and the wider set of resources that make up the elements within a Fabric workspace for the other roles and the tailored experiences for other personas such as Data Engineer, Data Scientist, and Business Analyst. These are covered in the fuller set of [Microsoft Fabric documentation](https://learn.microsoft.com/fabric).

I would therefore advocate a hybrid configuration, using the Terraform provider for Microsoft Fabric to manage platform-level resources and administrative configurations, and the Git integration for the workspace-scoped resources.

Note that both are in their early stages at the time of writing. Not all resources are supported, or are supported in preview.

## Fabric Administration

Terraform is an ideal approach for Fabric Admins who need **repeatable, scalable, and policy-compliant** deployments with automated and declarative configuration via workload identities. Includes:

- **Capacities**: Provisioning and configuring Fabric capacities.
- **Workspaces**: Creating and managing workspaces, including metadata and access controls.
- **RBAC Assignments**: Managing role-based access control at the workspace or capacity level.
- **Lakehouses and Shortcuts**: Defining and deploying foundational data structures.
- **Network Integrations**: Setting up secure access and connectivity.
- **Automation**: Using GitHub Actions or Azure DevOps pipelines to automate deployments and enforce consistency across environments

This approach allows admins to enforce governance and consistency using Terraform, which may already be in use for other cloud platforms as it has wide provider support. As an example, the reference repo shows a combination of azuread, azurerm and fabric providers. Other common providers are those for azapi, aws and gcp, plus the various general providers such as random.

## Workspace-Level Git Integration

This approach allows Data Engineers and Analysts to work fluidly and independently. The Git integration in Fabric is **workspace-scoped** and supports a wide range of items, including:

- **Data Engineering**: Notebooks, Lakehouses, Spark Job Definitions.
- **Data Factory**: Pipelines, Dataflows, Copy Jobs.
- **Real-Time Intelligence**: Eventstreams, KQL databases, Dashboards.
- **Power BI**: Reports, Semantic Models, Paginated Reports.
- **Data Warehouse**: Warehouses and mirrored catalogs

This model allows engineers and analysts to:

- **Version control their work** directly from the Fabric UI.
- **Branch and merge** using GitHub or Azure DevOps.
- **Collaborate** without stepping on each other’s changes.
- **Sync changes** between Git and Fabric workspaces.

However, Git integration does not currently support all Fabric items, and **configuration drift** is possible if not managed carefully.

## Natural Division

The table below shows an example split of resources

| Responsibility Area              | Terraform (Admin)                          | Git Integration (Engineer/Analyst)         |
|----------------------------------|--------------------------------------------|--------------------------------------------|
| Workspace creation & config      | ✅ Yes                                      | ❌ No                                       |
| Capacity management              | ✅ Yes                                      | ❌ No                                       |
| RBAC and security                | ✅ Yes                                      | ❌ No                                       |
| Pipelines, Notebooks, Reports    | ❌ No (not granular)                        | ✅ Yes (workspace-level)                    |
| Version control & collaboration  | ⚠️ Limited (via IaC repo)                   | ✅ Full Git support                         |
| Deployment automation            | ✅ Yes (CI/CD with IaC)                     | ✅ Yes (via Git commits & PRs)              |
| State management                 | ✅ Declarative state                        | ⚠️ Partial (sync only supported items)      |

## Next

OK, hopefully that make sense in setting the context for what we will be automating.

These labs will guide you through setting up the prerequisites, such as ensuring you have a Fabric license and capacity, installing the Fabric extension for Azure CLI, and configuring a storage account for Terraform state with enforced RBAC. You'll also learn how to configure an app registration for user context, test Terraform configurations locally in a test workspace, and push your configurations into a GitHub repository. Additionally, we'll cover creating an OpenID Connect managed identity for the Fabric provider and understanding the GitHub workflow for deploying your infrastructure as code. By the end of these labs, you'll have a solid foundation for managing Microsoft Fabric platform resources using Terraform and the Fabric CLI.

Next up we'll check you have a few pre-requisites in place and then we can get cracking.
