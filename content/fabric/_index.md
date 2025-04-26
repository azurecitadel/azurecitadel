---
title: "Microsoft Fabric"
description: "Using infrastructure as code with Microsoft Fabric"
author: [ "Richard Cheney" ]
github: [ "richeney" ]
menu:
  side:
    identifier: fabric
---

## Getting Started with Microsoft Fabric and Terraform

Microsoft Fabric is a powerful platform for data integration and analytics, and with the general availability of the Terraform provider, managing Fabric resources has never been easier, especially when you follow our quickstart.

These labs will guide you through setting up the prerequisites, such as ensuring you have a Fabric license and capacity, installing the Fabric extension for Azure CLI, and configuring a storage account for Terraform state with enforced RBAC.

You'll also learn how to configure an app registration for user context, test Terraform configurations locally in a test workspace, and push your configurations into a GitHub repository.

Additionally, we'll cover creating an OpenID Connect service principal for the Fabric provider and understanding the GitHub workflow for deploying your infrastructure as code.

By the end of these labs, you'll have a solid foundation for managing Microsoft Fabric resources using Terraform and the Fabric CLI. For more details, check out the following references:

- [Terraform Provider for Microsoft Fabric (Generally Available)](https://blog.fabric.microsoft.com/blog/terraform-provider-for-microsoft-fabric-now-generally-available)
- [Introducing the Fabric CLI (Preview)](https://blog.fabric.microsoft.com/blog/introducing-the-fabric-cli-preview)
- [Reference repo](https://github.com/richeney/terraform_fabric_administrator_reference)
- [What is Microsoft Fabric Admin?](https://learn.microsoft.com/fabric/admin/microsoft-fabric-admin)

## Labs
