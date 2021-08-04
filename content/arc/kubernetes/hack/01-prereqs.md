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

The prerequisites for completing this hack are as follows:

* A **GitHub** account
* An **Azure Subscription** with:
  * Access to [Cloud Shell](https://shell.azure.com)
  * Permissions to create Public IP Addresses
  * At least **6** cores available

## Overview

There are multiple ways to complete the challenges laid out on this hack. As such there are many different tools that can be utilized to solve the challenges. However, having access to the prerequisites outlined above at the minimum will be sufficient to complete the hack.

Essentially you need an Azure Subscription that allows you to create public-facing virtual machines.

## Pre-Challenge

1. Query the core quota limit for your current subscription
1. Register the following providers in your Azure Subscription
    * `Microsoft.Web`
    * `Microsoft.Kubernetes`
    * `Microsoft.KubernetesConfiguration`
    * `Microsoft.ExtendedLocation`

## Success Criteria

1. Access to [GitHub](https://github.com/login)
1. Access to [Cloud Shell](https://shell.azure.com)
1. Access to the [Azure platform](https://portal.azure.com/) to be able to deploy Azure Arc enabled Kubernetes resources

## References 

1. [VM Quota Check](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/quotas#check-usage)
1. [Register Providers](https://docs.microsoft.com/en-us/azure/azure-arc/kubernetes/quickstart-connect-cluster#1-register-providers-for-azure-arc-enabled-kubernetes)