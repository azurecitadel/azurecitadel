---
title: "Managed Apps with AKS HOL"
author: [ "Mike Ormond" ]
description: "Lab walkthrough of creating and publishing an AKS Managed Application Offer"
date: 2022-04-05
weight: 62
menu:
  side:
    parent: marketplace
    identifier: ma-aks
---

## Introduction

AKS and container offers can (at the time of writing - March 2022) be published as managed application offers in the commercial marketplace. There are some caveats. For more information see [Usage of Azure Kubernetes Service (AKS) and containers in managed application
](https://docs.microsoft.com/en-us/azure/marketplace/plan-azure-app-managed-app#usage-of-azure-kubernetes-service-aks-and-containers-in-managed-application)

In this HOL, we will deploy a managed application based on AKS that pulls container images from a private registry in the publisher tenant. We will also see how to manage publisher secrets by pulling from a key vault in the publisher tenant to a key vault in the managed app and mounting as K8S secrets.

The lab has instructions for deploying via ARM templates, as a service catalog managed application and as a marketplace application. 

The lab also introduces notifications and automating the deployment of the K8S application using a DevOps CD pipeline.

## Resources

* [Managed Application - Azure Kubernetes Service (AKS) and Key Vault](https://github.com/mormond/aks-managed-app-testing)
* [Marketplace Notifications Webhook](https://github.com/mormond/marketplace-notifications-webhook)
