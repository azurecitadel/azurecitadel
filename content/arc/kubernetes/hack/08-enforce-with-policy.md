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

The UI pod does not require any access to Azure resources. It's good practice to ensure that traffic is restricted for this application

## Challenge

Apply a network policy to restrict traffic to and from the UI pod. It should not be able to communicate with the API pods.

* Network Policy - restricting pod to pod communications
* Enforce tagging of assets
* **TODO** Is there a way to give a report on it?


## Success Criteria

From the UI pod `curl reviewer-api.prod.svc.cluster.local` should error

**TODO** Is there a difference between AKS and Azure Arc for Kubernetes? ( Deploy - Configure diagnostic settings for Azure Kubernetes Service to Log Analytics workspace ) - or - (Volumes should be encrypted at rest) **hint** some of these you won't be able to do :D

## References

* [Azure Policy for Kubernetes](https://docs.microsoft.com/azure/azure-arc/kubernetes/policy-reference)
* [Azure Policy for Azure Arc enabled Kubernetes](https://docs.microsoft.com/azure/azure-arc/kubernetes/policy-reference)