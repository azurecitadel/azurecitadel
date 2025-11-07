---
headless: true
title: "Azure Landing Zones - Components"
---

## Overview

The Azure Landing Zone Accelerator deploys a comprehensive set of components to support your landing zone implementation. These components work together to provide a complete DevOps environment for managing your Azure infrastructure.

![Azure Landing Zone Accelerator components overview](https://raw.githubusercontent.com/Azure/Azure-Landing-Zones/main/docs/content/accelerator/img/components.png)

## Identity

The accelerator configures the identity and authentication mechanisms required for secure access to Azure resources. This includes setting up service principals and federated credentials for workload identity federation between GitHub Actions and Azure.

![Identity configuration](placeholder-identity.png)

## State

Terraform state management is configured with a dedicated Azure Storage Account. This provides a secure, centralized location for storing your infrastructure state files, complete with versioning and locking capabilities.

![State management configuration](placeholder-state.png)

## Runners

Self-hosted GitHub runners can be deployed to provide greater control over your CI/CD pipeline execution environment. These runners can be configured to run on Azure infrastructure with specific networking and security requirements.

![Runners configuration](placeholder-runners.png)

## Repo

The GitHub repository is configured with the necessary structure, branches, and protection rules to support the landing zone deployment workflow. This includes setting up the required directory structure for Terraform configurations.

![Repository configuration](placeholder-repo.png)

## Envs

GitHub environments are created to align with your deployment stages, such as development, staging, and production. Each environment can have specific protection rules and secrets scoped to that environment.

![Environments configuration](placeholder-envs.png)

## Approvals

Environment protection rules are configured to require manual approvals before deployments can proceed. This ensures that changes to critical environments go through appropriate review processes.

![Approvals configuration](placeholder-approvals.png)

## GitHub Actions

The accelerator deploys pre-configured GitHub Actions workflows that orchestrate the deployment of your landing zones. These workflows handle Terraform plan and apply operations, with appropriate checks and validations at each stage.

![GitHub Actions workflows](placeholder-actions.png)

## Variables

Both repository-level and environment-specific variables are configured to provide the necessary configuration values for your deployments. These variables control aspects such as Azure regions, naming conventions, and feature flags.

![Variables configuration](placeholder-variables.png)

## Runner Groups

Runner groups allow you to organize your self-hosted runners and control which repositories can use them. This provides fine-grained access control over your deployment infrastructure.

![Runner groups configuration](placeholder-runner-groups.png)
