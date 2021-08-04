---
title: "Enable Application Delivery"
description: "Run Azure PaaS services on your own compute."
slug: enable-app-service-on-kubernetes
menu:
  side:
    parent: arc-k8s
    identifier: arc-k8s-enable-app-delivery
series:
 - arc-k8s-hack
weight: 24
---

## Background

*Persona: Cluster Admin*

*Persona: Developer*

You can now run App Service on Kubernetes. This includes all the Platform-as-a-service components that you'd expect from using App Service.

If you're interested in deploying Web Apps, Function Apps, Logic Apps or more you can register this extension to run on your own Kubernetes cluster.

```bash
az extension add --upgrade --yes --name connectedk8s
az extension add --upgrade --yes --name k8s-extension
az extension add --upgrade --yes --name customlocation
az extension remove --name appservice-kube
az extension add --yes --source "https://aka.ms/appsvc/appservice_kube-latest-py2.py3-none-any.whl"
```

## Challenge

1. Cluster admin will set up App Service on AKS
  1. Ensure Log Analytics workspace is created
  1. Install App Service on Kubernetes

1. Developer will run their application on App Service
  1. Use the deployed App Service to deploy
    1. Web App
    1. Function App
    1. Logic App

## Success Criteria

## References
