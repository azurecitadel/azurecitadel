---
title: "User context"
description: "Configure the user context and test locally in a workspace."
layout: single
draft: false
menu:
  side:
    parent: fabric
    identifier: fabric-user
series:
 - fabric_terraform_administrator
weight: 25
---

## Introduction

You have the access, the tooling, and a Fabric capacity to use.

Now it is time to configure an app registration in the user context and build out an initial Terraform configuration.

## The fabric Terraform provider

Documentation for the fabric Terraform provider: <https://registry.terraform.io/providers/microsoft/fabric/latest/docs>.

Note that each of the resources and data sources has a note box that denotes whether it is in preview, and whether is supports a service principal.

![A screenshot showing the Fabric Terraform provider documentation with notes about preview features and service principal support.](/fabric/images/fabricProvider_notes.png)

This quickstart will avoid preview resources and those that do not support service principals.
