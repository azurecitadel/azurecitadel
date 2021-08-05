---
title: "Enforce Policy"
description: "Stop the fun."
slug: enable-azure-policy
menu:
  side:
    parent: arc-k8s
    identifier: arc-k8s-policy
series:
 - arc-k8s-hack
weight: 19
---

## Background

The reviewer application we have deployed consists of two pods running within a virtual network.

* **UI** runs nginx and serves a single page application
* **API** runs a .NET Web Application that talks to Azure SQL and Blob Storage

The architecture is a very standard web application architecture:

**TODO** Insert architecture diagram

The UI pod does not require any access to Azure resources. It's good practice to ensure that traffic is restricted for this application.

## Challenge 6

### Cluster Policy

Configure Kubernetes clusters to take their source of truth from the GitOps configurations directly and enforce this through policy.

Enforce that cluster assets have a mandatory tagging policy to identify their workload and location.

Try adding the following policies to your clusters
* Deploy - Configure diagnostic settings for Azure Kubernetes Service to Log Analytics workspace
* Both operating systems and data disks in Azure Kubernetes Service clusters should be encrypted by customer-managed keys

> *Hint*: You may not be able to complete this last part but it's important to understand why

### Network Policy

Apply a network policy to restrict traffic from the UI pod to the API pod. The only way to communicate to the API pod should be through the Ingress Controller. You can look at the [sample network policy](/arc/kubernetes/hack/assets/network-policy.yaml) for how to implement this.

## Success Criteria

* From the UI pod the following network requests should fail but you should still be able to access the application view the public DNS name
  * `curl microsoft.com`
  * `curl reviewer-api/api/Items`
* Viewing the *Kubernetes - Azure Arc* -> *Policies* blade in the portal shows 100% compliance with additional policies defined
* A report showing non-conforming tagged assets

## References

* [Azure Policy for AKS](https://docs.microsoft.com/azure/aks/policy-reference)
* [Azure Policy for Azure Arc enabled Kubernetes](https://docs.microsoft.com/azure/azure-arc/kubernetes/policy-reference)
* [Kubernetes Network Policy](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
* [Add Azure Policy](https://docs.microsoft.com/azure/azure-arc/kubernetes/use-azure-policy)