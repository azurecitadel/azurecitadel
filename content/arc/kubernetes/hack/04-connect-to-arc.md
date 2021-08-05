---
title: "Connect to Arc"
description: "Connect clusters to Azure Arc."
slug: connect-to-arc
menu:
  side:
    parent: arc-k8s
    identifier: arc-k8s-connect-arc
series:
 - arc-k8s-hack
weight: 15
---

## Background

*Persona: Cluster Administrator*

You want to add Azure Arc to a number of clusters to give a centralised management approach for tagging and deployment of resources.

It is important to consider the structure of subscription/resource groups, how tags are applied and appropriate Role-based access control (RBAC)

Azure Arc for Kubernetes is based upon the CNCF incubation project Flux (version 1) by Weaveworks.

An agent runs within your cluster and reconciles desired vs actual state.

## Challenge 2

Connect Kubernetes clusters to Azure Arc.

You will need several key components in order to connect your cluster to Azure Arc.

* Access to the Azure CLI
* Access to your Kubernetes cluster(s)
* The correct extensions and providers registered in your Azure subscription

> Hint: Look at the options available on `az connectedk8s` for specifying config and tags.

When connected to Arc, what information can you get from the Resource Graph?

Create a dashboard in Azure for your unmanaged cluster estate showing useful information by quering the Resource Graph

```kql
resources
| where type == 'microsoft.kubernetes/connectedclusters'
```

**Discussion Point** How would you automate onboarding of clusters to Arc?
**Stretch** Automate the onboarding process

## Success Criteria

* An Azure Arc enabled Kubernetes resource exists in Azure Resource Manager
* Cluster metadata appears on the Azure Arc enabled Kubernetes resource as metadata
  * Distribution
  * Kubernetes version
* Show some metadata from the Resource Graph
  * Modify the kql query to project the distribution, kubernetes version and tags

## References

* [Accessing a Kubernetes cluster](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable)
* [Resource Graph Queries](https://docs.microsoft.com/azure/azure-arc/kubernetes/resource-graph-samples)
* [Connect an existing Kubernetes cluster to Azure Arc](https://docs.microsoft.com/azure/azure-arc/kubernetes/quickstart-connect-cluster)
* [Flux concepts](https://fluxcd.io/docs/concepts/)