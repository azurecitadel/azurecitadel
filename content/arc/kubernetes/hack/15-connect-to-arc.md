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

It is important to consider

* how you want to organise your management groups, subscriptions and resource groups
* which tags (and values) should be in use to help organisation
* appropriate role-based access control (RBAC)

Azure Arc for Kubernetes is based upon the CNCF incubation project Flux (version 1) by Weaveworks.

An agent runs within your cluster and reconciles desired vs actual state.

## Challenge 2

### Requirements

You will need several key components in order to connect your cluster to Azure Arc.

* Access to the Azure CLI
* Access to your Kubernetes cluster(s)
* The correct extensions and providers registered in your Azure subscription

### Connect

Connect Kubernetes clusters to Azure Arc:

* Create a resource group, `arc4k8s` in West Europe
* Add the kubernetes clusters as Azure Arc-enabled Kubernetes clusters, also in West Europe
* Add a city tag for each, e.g. `city=Dublin` for the cluster in northeurope

    Locations:

    | **City** | **Region code** |
    |---|---|
    | London | uksouth |
    | Dublin | northeurope |
    | Amsterdam | westeurope |

    > Hint: Look at the options available on `az connectedk8s` for specifying config and tags.
    > Hint'2: If the pods in the azure-arc namespace have a status of ImagePullBackOff then this is usually down to VM resources. Try restarting the server, or resizing to a D8s v3.

### Reporting

When connected to Arc, what information can you get from the Resource Graph?

> It may take some time for the additional Azure Arc metadata to appear

* Create a Resource Graph query in Azure for your unmanaged cluster estate showing useful information by querying the Resource Graph

    ```kql
    resources
    | where type == 'microsoft.kubernetes/connectedclusters'
    ```

## Discussion Points 💬

How would you automate onboarding of clusters to Arc?

How would that work if there are different groups of people for the Azure admins and the on-prem Kubernetes clusters admins?

What is the required role to onboard an Azure Arc-enabled Kubernetes cluster?

## Stretch Targets

* Add the KQL query to an Azure Workbook
* Automate the onboarding process

## Success Criteria

* Azure Arc-enabled Kubernetes resources exist in Azure Resource Manager
* Cluster metadata appears on the Azure Arc enabled Kubernetes resource as metadata, e.g.
  * Distribution
  * Kubernetes version
  * Total node count
* Modified Resource Graph KQL query to project
  * cluster name
  * distribution type
  * kubernetes version
  * node count
  * the value for the city tag

## References

* [Accessing a Kubernetes cluster](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable)
* [Connect an existing Kubernetes cluster to Azure Arc](https://docs.microsoft.com/azure/azure-arc/kubernetes/quickstart-connect-cluster)
* [Flux concepts](https://fluxcd.io/docs/concepts/)
* [Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/)
* [Resource Graph Queries](https://docs.microsoft.com/azure/azure-arc/kubernetes/resource-graph-samples)
* [Understanding the Azure Resource Graph query language](https://docs.microsoft.com/azure/governance/resource-graph/concepts/query-language)
* [KQL quick reference](https://docs.microsoft.com/azure/data-explorer/kql-quick-reference)
* [Azure Monitor Workbooks](https://docs.microsoft.com/azure/azure-monitor/visualize/workbooks-overview)
