---
title: "Enable Data Services"
description: "Run your own hybrid database."
slug: enable-data-services
menu:
  side:
    parent: arc-kubernetes
    identifier: arc-kubernetes-data-services
series:
 - arc-kubernetes
weight: 22
---

## Background

*Persona: Cluster Admin*

Deploy Azure Arc-enabled data services

Azure Arc makes it possible to run Azure data services on-premises, at the edge, and in public clouds using Kubernetes and the infrastructure of your choice.

Currently, the following Azure Arc-enabled data services are available:

* SQL Managed Instance
* PostgreSQL Hyperscale (preview)

## Challenge 9

Rather than using the Azure SQL database, deploy your own SQL Managed Instance on your own infrastructure

You will need to update the connection string configuration to be able to connect from the API application

## Success Criteria

* Azure Data-Services are running in all your clusters
* Application is able to connect to them

## References

* [Set up Azure Arc enabled Data Services](https://docs.microsoft.com/azure/azure-arc/data/create-data-controller-direct-cli)
