---
title: "Deploy Application"
description: "Run an application with Azure resource dependencies."
slug: "deploy-an-application"
menu:
  side:
    parent: arc-kubernetes
    identifier: arc-kubernetes-deploy-app
series:
 - arc-kubernetes
weight: 17
---

## Background

*Persona - Developer*
*Persona - Cluster Administrator*

Your development team want to deploy a new application version into all connected clusters.

This is the flagship review application that currently is running in a number of locations. It requires access to **Azure Storage** and an **Azure SQL Database**.

## Challenge 4

### Cluster Administrator

Set up a platform service to issue certificates for application developers. A good choice would be to set up a cluster wide certificate issuer from Lets Encrypt for free TLS certs. You can use the [reference deployment of a Lets Encrypt Cluster Issuer](https://github.com/azurecitadel/arc-for-kubernetes/blob/main/cluster-config/cluster-issuer.yaml)

Set up a service to assign Azure AD identities to workloads running in the cluster. This can be achieved by deploying [pod identity](https://github.com/Azure/aad-pod-identity) for Kubernetes. There are [two sample manifests](https://github.com/azurecitadel/arc-for-kubernetes/tree/main/cluster-config).

Deploy the required infrastructure (DB, Storage and Application Registration) resources using a [GitHub Action](https://github.com/azurecitadel/arc-for-kubernetes/tree/main/01-app-setup).

**Stretch** Discuss how you could deploy Azure Infrastructure outside of Kubernetes using the same repository and GitOps approach

### Application Developer

Deploy the application using a GitOps approach and configure access to Azure resources using Managed Identities.

After running the GitHub action to deploy the infrastructure you can find your specific application manifest files saved as an artifact of that run.

> Hint: Download the archived file from the run and check it into the correct application developer repository path. You **shouldn't** have to make any changes to the files

**Stretch** Set up a single repository for multiple application development teams working on different applications and discuss the advantage and disadvantages of such an approach

## Success Criteria

* Review application is running on all your clusters
* You can sign in, leave a review and upload an image

## References

* [Use GitOps with Azure Arc for Kubernetes](https://docs.microsoft.com/azure/azure-arc/kubernetes/use-gitops-with-helm#overview-of-using-gitops-and-helm-with-azure-arc-enabled-kubernetes)
* [Managed Identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)

* [Deploy Azure Resources](https://github.com/azurecitadel/arc-for-kubernetes)
