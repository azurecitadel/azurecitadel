---
title: "ARM Templates"
description: "Set of labs for those who want to create their own ARM templates."
menu:
  side:
    identifier: 'ARM Templates'
---

## Introduction

ARM Templates are the native first party tool for infrastructure as code on Azure. They have the fullest and most up to date support, as well as full integration with areas such as the Azure Marketplace, Managed Applications, Azure Blueprints and Service Catalogs.

This group of labs are desugned for you to enable yourself at your own pace. Each of the labs builds on the previous labs.

Each lab will always include links to the JSON templates at the start and end so that you may compare your own files and highlight any differences.

It is up to you how far through the labs you need to go.  The labs go through to a level of detail and complexity and leverage a number of the features within the Azure Resource Manager (ARM) templates that provide the power required for more complicated enterprise Infrastructure as Code deployments.

However the advice would always be to keep it as simple as possible and maximise supportability.  Therefore the recommendation is to stop at the earliest point where you can meet the business requirements.

## Pre-requisites

Set up your machine as per the [automation prereqs](../prereqs) page.

Note that you won't need the Terraform or Packer binaries for these labs.

## Warning

Note that these labs were created in 2018 before a host of new functionality in ARM, notably:

* [What If deployments](https://docs.microsoft.com/azure/azure-resource-manager/templates/template-deploy-what-if)
* [GitHub Actions](https://docs.microsoft.com/azure/azure-resource-manager/templates/deploy-github-actions)
* [Tenant](https://docs.microsoft.com/azure/azure-resource-manager/templates/deploy-to-tenant), [Management Group](https://docs.microsoft.com/azure/azure-resource-manager/templates/deploy-to-management-group) and [Subscription](https://docs.microsoft.com/azure/azure-resource-manager/templates/deploy-to-subscription) scope deployments
* [Functions](https://docs.microsoft.com/azure/azure-resource-manager/templates/template-user-defined-functions)
* [Template Specs](https://docs.microsoft.com/azure/azure-resource-manager/templates/template-user-defined-functions)

Also null parameters, multi-line comments, etc.

## Labs
