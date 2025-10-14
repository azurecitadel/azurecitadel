---
title: "Creating a Service Principal for PAL"
date: 2025-10-10
author: [ "Richard Cheney" ]
description: "In the final service principal scenario, we'll look at creating a service principal purely for recognition purposes."
draft: true
weight: 60
menu:
  side:
    parent: pal
    identifier: pal-dedicated
series:
  - pal
---

## Introduction

This scenario is for when you no longer have the secret or cert for a service principal, but you do have permission to create or modify pipelines or workflows in your CI/CD platform. These commonly use service principals when interacting with Azure environments. Historically they would have the client secret stored as a pipeline secret whereas it is now increasingly common to leverage OpenID Connect (OIDC) using a federated workload credential.

\<TODO> - CHECK BEFORE CREATING

## Next

Next up we will look at how Partner Admin Link works in Azure Lighthouse scenarios.
