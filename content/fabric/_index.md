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

[Fabric Admins](https://learn.microsoft.com/fabric/admin/microsoft-fabric-admin) have previously had the option of click-ops in the Microsoft Fabric portal or automating by driving the Fabric REST APIs. The landscape has changed with the general availability of both the [Terraform provider for Microsoft Fabric](https://blog.fabric.microsoft.com/blog/terraform-provider-for-microsoft-fabric-now-generally-available) and the [Fabric CLI](https://blog.fabric.microsoft.com/blog/fabric-cli-is-now-generally-available-explore-and-automate-microsoft-fabric-from-your-terminal), opening up new opportunities to manage your Fabric resources in line with your existing Terraform workflows. There are a few nuances compares to using Terraform with standard Azure resources but everything will become clearer when you follow our quickstart.

## Repos

- [Fabric Terraform Provider Quickstart](https://github.com/richeney/fabric_terraform_provider_quickstart)
- [Terraform Fabric Administrator Reference repo](https://github.com/richeney/terraform_fabric_administrator_reference)

## Labs

Use the series of labs below to go steadily through the flow of working solo and developing a config, and then automating with a CI/CD workflow and workload identity. If you then want to shortcut then feel free to use the page I reference for [demos](./demo).
