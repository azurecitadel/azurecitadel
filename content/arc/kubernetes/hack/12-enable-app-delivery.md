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
weight: 23
---

## Background

*Persona: Cluster Admin*

*Persona: Developer*

You can now run App Service on Kubernetes. This includes all the Platform-as-a-service components that you'd expect from using App Service.

If you're interested in deploying Web Apps, Function Apps, Logic Apps or more you can register this extension to run on your own Kubernetes cluster.

## Challenge 10

You are required to set up an instance of App Service running on your own infrastructure and have your development team deploy applications to it.

### Cluster Administrator

Set up App Service for application delivery on your cluster

1. Ensure Log Analytics workspace is created
1. Install App Service on Kubernetes

### Deploy an application to App Service running on Kubernetes

1. Use the deployed App Service to deploy
    1. Web App
    1. Function App
    1. Logic App

## Success Criteria

* App Service is running on your cluster
* A [sample application](https://github.com/Azure-Samples) has been deployed

## References

* [App Service for Azure Arc enabled Kubenretes](https://docs.microsoft.com/azure/app-service/manage-create-arc-environment)
* [Web App Quickstart](https://docs.microsoft.com/azure/app-service/quickstart-arc)
* [Logic Apps](https://docs.microsoft.com/azure/logic-apps/azure-arc-enabled-logic-apps-create-deploy-workflows#create-and-deploy-logic-apps)
* [Azure Function](https://docs.microsoft.com/azure/azure-functions/create-first-function-arc-cli)
