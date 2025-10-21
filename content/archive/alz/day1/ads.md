---
title: "Day 1 Challenge"
description: "Architectural Design Session for Azure Baristas."
layout: single
draft: false
weight: 5
series:
 - alz-hack-day1
menu:
  side:
    parent: alz-hack-day1
---

## Introduction

Day one is about working through the Azure Baristas scenario and their particular requirements to produce a custom architecture for their Azure Landing Zone deployment.

## Rename subscriptions

Before starting, it is recommended to rename your three empty subscriptions as:

* Connectivity
* Management
* Identity

This will make it easier to assign the correct one in the wizard.

> If you don't have three dedicated for this then you can reuse the management subscription for identity.

## Deploy to Azure

Deploy the default Azure Landing Zones implementation:

1. Make sure that you have completed all of the [prereqs](/alz/prereqs/) before starting
    * The prereqs include the [tenant level RBAC permissions](https://github.com/Azure/Enterprise-Scale/blob/main/docs/EnterpriseScale-Setup-azure.md)
1. Go into the main [Azure Landing Zone](https://aka.ms/alz/repo) repo
1. Read through until you get to [Deploying Enterprise-Scale Architecture in your own environment](https://github.com/Azure/Enterprise-Scale/#deploying-enterprise-scale-architecture-in-your-own-environment)
1. Click on the Contoso **Deploy to Azure** button
1. Follow the wizard in the portal, deselecting vWAN

> Note that we won't actually be deploying the vWAN, but it give you an opportunity to browse the options before toggling the vWAN radio button to off.

 You can also look at the [Contoso Reference - Scope and Design](https://github.com/Azure/Enterprise-Scale/blob/main/docs/reference/contoso/Readme.md) documentation whilst it is running through.

One complete you can browse the management groups and see where your subscriptions now sit. Also check out the custom policies that have been defined at the top management group scope, immediately below Tenant Root Group.

> If there are any errors in deployment then try resubmitting.

## Architectural Design Session

Run through an architectural design session for the Azure Baristas scenario.

You should stay aligned to the design principles, and run through the critical design areas. Use the documentation within the links to expand on this morning's presentation.

Create PowerPoint presentation of proposed ES architecture, to include:

* Enterprise Agreement (EA) architecture
* Management group & subscription organisation design
* Required Azure Policy - inbuilt (and custom) policies or initiatives
* Assignments & scope
* Networking architecture
* RBAC assignments

Your proctor can't help you design the solution but can direct you to the right resources if you are blocked.

## Presentation

You will present back within your team to the proctor at 15:00 so that you can discuss the design and the key decisions.
