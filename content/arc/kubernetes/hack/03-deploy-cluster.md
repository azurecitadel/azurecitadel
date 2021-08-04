---
title: "Deploy Cluster"
description: "Create unmanaged Kubernetes clusters ready for onboarding with Azure Arc."
slug: deploy-cluster
menu:
  side:
    parent: arc-k8s
    identifier: arc-k8s-deploy-cluster
series:
 - arc-k8s-hack
weight: 14
---

## Background

*Persona: Cluster Administrator*

In order to realise the benefits of Azure Arc we must be managing multiple clusters at scale.

In our scenario we are running a global platform with clusters deployed in separate regions. Each must be deployed, updated and managed independently.

This is causing pain for platform, development and operations teams to support the application because of complexity of rolling out updates and ensuring a consistent, secure baseline.

## Challenge 1

The purpose of this challenge is to ensure you are comfortable running actions and creating secrets within GitHub and managing resources using the Azure CLI or Portal.

By the end of the challenge you will have access to at least **2 unmanaged** Kubernetes clusters (not Azure Kubnernetes Service).

> Since AKS is a 1st-party Azure solution and natively supports capabilities such as Azure Monitor integration as well as GitOps configurations (currently in preview), we must create unmanaged Kubernetes clusters

### Cluster Creation

Create at least two on-premises Kubernetes clusters in **different** regions, e.g UK South and West Europe that represent on-premise locations

> There is no technical reason why these have to be in separate regions except the current scripts use region as a naming convention so will break if you deploy more than one in each region!

You are welcome to create these external clusters as you want, however the **team repository** that you created a child of has a [GitHub action](https://devblogs.microsoft.com/premier-developer/github-actions-overview/) already set up for [deploying an unmanaged k3s cluster](https://github.com/jasoncabot-ms/arc-for-kubernetes/tree/main/00-setup) by Rancher to Azure.

> Hint: Read the README.md!

You could use any other [validated distribution](https://docs.microsoft.com/azure/azure-arc/kubernetes/validation-program#validated-distributions) on any other deployment host if you're more comfortable but this will make later challenges slightly more challenging

In order to be able to run `kubectl get node` you will need access to a [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) for each cluster 

## Success Criteria

* At least two unmanaged Kubernetes clusters are running
* You can get a list of nodes in **Ready** status by using `kubectl get node` for each cluster
* You can navigate to the FQDN for each cluster and view a 404 page from the Traefik Ingress Controller (since no apps are deployed)

## References

* [Accessing a Kubernetes cluster](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable)
* [Using GitHub Actions to deploy Infrastructure](https://docs.microsoft.com/azure/azure-resource-manager/templates/deploy-github-actions)
* [Team repository README](https://github.com/jasoncabot-ms/arc-for-kubernetes)
* [Traefik Ingress Controller](https://doc.traefik.io/traefik/providers/kubernetes-ingress)
