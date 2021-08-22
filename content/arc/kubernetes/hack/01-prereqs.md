---
title: "Prereqs"
description: "Attending the Azure Arc for Kubernetes hack? Get these completed before it starts."
slug: prereqs
menu:
  side:
    parent: arc-k8s
    identifier: arc-prereqs
series:
 - arc-k8s-hack
weight: 12
---

## Overview

There are multiple ways to complete the challenges laid out on this hack. As such there are many different tools that can be utilized to solve the challenges. However, having access to the core prerequisites outlined below will be sufficient to complete the hack.

Essentially you need an Azure Subscription that allows you to create public-facing virtual machines and service principals with role assignments.

Meet the [core prereqs](#core) and complete the [pre-challenge](#challenge) to achieve the [success criteria](#success-criteria). Don't forget to check the [references](#references) at the bottom of the page.

## Background

You will be working as part of a team, and should complete these prereqs as a team.

For the hack you will be working in a proctored channel, and you will all be working on a single subscription.

The hack is designed so that you will all have an opportunity to share your screen and drive.

The hack is based around three personas:

| **Name** | **Responsibility** |
|---|---|
| Cluster Administrator | Platform level infrastructure and cluster baseline |
| Application Developer | Deploying and running custom applications |
| Operations | Monitoring and ensuring cluster health |

Agree within your team which persona you will adopt. This will make it more natural to take control during different hack challenges and see the hand off points and interaction between roles.

## Core Pre-reqs {#core}

The prerequisites for completing this hack are as follows:

* Each user requires a **GitHub** account
* The team requires a single **Azure Subscription** with:
  * Access to [Cloud Shell](https://shell.azure.com/bash)
  * Sufficient cores available
      * At least **8** Standard DAS v4 Family vCPU cores available in UK South
      * Same for both North Europe and West Europe
      * Note that multiple subscriptions may be used for the deployed clusters and may be in different tenants
  * Owner or Contributor access
  * Ability to create service principals

> [Windows Terminal](https://aka.ms/terminal) is recommended for Cloud Shell access on Windows 10/11.

## Pre-Challenge {#challenge}

1. Query the core quota limit for your current subscription
1. Register the following providers in your Azure Subscription
    * `Microsoft.Web`
    * `Microsoft.Kubernetes`
    * `Microsoft.KubernetesConfiguration`
    * `Microsoft.ExtendedLocation`
1. Add the Azure CLI extensions for this hack
    * `az extension add --name connectedk8s`
    * `az extension add --name k8s-configuration`
    * `az extension add --name k8s-extension`
    * `az extension add --name customlocation`
1. Create a service principal called `http://prereq-test` with Contributor role on the subscription

## Success Criteria

1. Access to [GitHub](https://github.com/login)
1. Access to [Cloud Shell](https://shell.azure.com/bash)
1. Access to the [Azure platform](https://portal.azure.com/) to be able to
    * deploy Azure Arc-enabled Kubernetes resources
    * create service principals

## References

1. [VM Quota Check](https://docs.microsoft.com/azure/virtual-machines/linux/quotas#check-usage)
1. [Register Providers](https://docs.microsoft.com/azure/azure-arc/kubernetes/quickstart-connect-cluster#1-register-providers-for-azure-arc-enabled-kubernetes)
1. [Create service principals](https://docs.microsoft.com/cli/azure/create-an-azure-service-principal-azure-cli)
