---
title: "Deploy Cluster"
description: "Create unmanaged Kubernetes clusters ready for onboarding with Azure Arc."
slug: deploy-cluster
menu:
  side:
    parent: arc-kubernetes
    identifier: arc-kubernetes-deploy-cluster
series:
 - arc-kubernetes
weight: 14
---

## Background

*Persona: Cluster Administrator*

In order to realise the benefits of Azure Arc we must be managing multiple clusters at scale.

In our scenario we are running a global platform with clusters deployed in separate regions. Each must be deployed, updated and managed independently.

This is causing pain for platform, development and operations teams to support the application because of complexity of rolling out updates and ensuring a consistent, secure baseline.

## Challenge 1

The purpose of this challenge is to ensure you are comfortable running actions and creating secrets within GitHub and managing resources using the Azure CLI or Portal.

By the end of the challenge you will have access three **unmanaged** Kubernetes clusters.

> Note that we are intentionally not using the first party Azure Kubernetes Service (AKS) as we are emulating unmanaged Kubernetes clusters running outside of Azure.

### Cluster Locations

The application needs to be deployed to clusters in London, Dublin and Amsterdam.

Create an on-premises Kubernetes cluster in each of the following cities:

| **City** | **Region code** |
|---|---|
| London | uksouth |
| Dublin | northeurope |
| Amsterdam | westeurope |

There is no technical reason why these have to be in separate regions except the current scripts use region as a naming convention so will break if you deploy more than one in each region!

### Deployment

The **team repository** that you created (from the template) has a [GitHub action](https://devblogs.microsoft.com/premier-developer/github-actions-overview/) already set up for [deploying an unmanaged k3s cluster](https://github.com/jasoncabot-ms/arc-for-kubernetes/tree/main/00-setup) by Rancher to Azure.

* Deploy a cluster to each of the three locations

    > Hint #1: Read the README.md!
    > Hint#2: You may need to login again within the CLoud Shell using `az login` to create the service principal.

### Cluster Access

In order to be able to run `kubectl get node` you will need access to a [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) for each cluster.

* Create kubeconfig files for each location

    > Hint #2: The workflow has a step named *Show SSH connection*. Default password for the VMs is `archack123!!`.

    Note that the NSG deployed by the workflow only permits SSH access from the AzureCloud service tag. Cloud Shell will work but you will timeout from other locations.

## Hardcore Mode

*This is very much optional and depends on how comfortable you are with Kubernetes.*

You are free to use any other [validated distribution](https://docs.microsoft.com/azure/azure-arc/kubernetes/validation-program#validated-distributions) on any other deployment host if you are curious. You can do this in addition to the clusters we're deploying using the templated repo, or instead of them.

This will be more real world accurate but may make later challenges slightly more challenging due to the design of the hack.

If you want to give yourself a fuller challenge then go for it!

## Success Criteria

* Three unmanaged Kubernetes clusters are running
* You can get a list of nodes in **Ready** status by using `kubectl get node` for each cluster
* You can navigate to the FQDN for each cluster and view a 404 page from the Traefik Ingress Controller (since no apps are deployed)

## References

* [Accessing a Kubernetes cluster](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable)
* [Using GitHub Actions to deploy Infrastructure](https://docs.microsoft.com/azure/azure-resource-manager/templates/deploy-github-actions)
* [Team repository README](https://github.com/jasoncabot-ms/arc-for-kubernetes)
* [Traefik Ingress Controller](https://doc.traefik.io/traefik/providers/kubernetes-ingress)
