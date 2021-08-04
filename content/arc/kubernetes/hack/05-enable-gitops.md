---
title: "Enable GitOps"
description: "An operating model for building cloud native applications."
slug: "enable-gitops"
menu:
  side:
    parent: arc-k8s
    identifier: arc-k8s-enable-gitops
series:
 - arc-k8s-hack
weight: 16
---

## Background

*Persona: Cluster Admin - Cluster Repository*

*Persona: Developer - Development Repository*

GitOps works by using Git as a single source of truth for declarative infrastructure and applications.

Your cluster monitors and automatically updates itself to reconcile differences between current and desired state.

With Git at the center of your delivery pipelines, developers use familiar tools to make pull requests to accelerate and simplify both application deployments and operations tasks to Kubernetes.

This allows you to write once and deploy many times to identical clusters.

## Challenge 3

### Cluster Administrator

Create repositories for the cluster administrator and application developers.

You will have to set up [namespaces and RBAC](https://docs.microsoft.com/azure/azure-arc/kubernetes/tutorial-use-gitops-connected-cluster#create-a-configuration) before deploying the application. This should be done as the cluster administrator.

You should create a namespace called `podinfo-app` that podinfo can be deployed into but without running `kubectl`.

You can look at the [sample cluster config](https://github.com/jasoncabot-ms/arc-for-kubernetes/tree/main/cluster-config) as a baseline for cluster-wide components that are likely to be required for later challenges.

### Developer

Deploy an application to your cluster(s) without running `kubectl`

A [sample application - podinfo](/arc/kubernetes/hack/assets/podinfo.yaml) manifest has been provided that will show information and allow you to access certain functions. This manifest shouldn't require any changes before being deployed.

### Together

**Discussion Point 1** Discuss the advantage and disadvantages of using a GitOps approach, you may want to touch on delivering updates, managing multiple clusters, secrets management, security and access management and the benefits of having multiple source code repositories.

**Discussion Point 2** Discuss in your team other good practices you can use on the cluster administrator repository

**Stretch** Can you make connections to a private GitHub repositories?

> Hint: Ensure you use SSH auth with a GitOps URL in the format `git@github.com:<org>/<repo>.git` and you can view error logs using `kubectl logs -n <namespace> <pod>`

## Success Criteria

* You have a repository owned and used for:
  * Cluster Administrators
  * Application Developers (either 1 repository per resource group or 1 folder per resource group)
* Cluster-wide services are controlled by a GitHub repository (you could be running cert-manager, aad-pod-identity from the sample - or simply creating a namespace)
* The sample application is running on your cluster and is publicly accessible
* Discussion of using a GitOps approach and practices around repository management

## References

* [What is GitOps - WeaveWorks?](https://www.weave.works/technologies/gitops/)
* [podinfo](https://github.com/stefanprodan/podinfo)
* [Enable GitOps](https://docs.microsoft.com/azure/azure-arc/kubernetes/tutorial-use-gitops-connected-cluster)
* [namespaces and RBAC](https://docs.microsoft.com/azure/azure-arc/kubernetes/tutorial-use-gitops-connected-cluster#create-a-configuration)
* [GitOps Operator Parameters](https://docs.microsoft.com/azure/azure-arc/kubernetes/tutorial-use-gitops-connected-cluster#options-supported-in----operator-params)
* [Sample Cluster Config](https://github.com/jasoncabot-ms/arc-for-kubernetes/tree/main/cluster-config)
* [AAD Pod Identity](https://azure.github.io/aad-pod-identity/docs/getting-started/installation/#quick-install)
* [Cert Manager](https://cert-manager.io/docs/installation/#default-static-install)