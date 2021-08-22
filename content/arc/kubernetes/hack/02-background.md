---
title: "Background"
description: "Azure Arc for Kubernetes hack scenario."
slug: background
menu:
  side:
    parent: arc-k8s
    identifier: arc-background
series:
 - arc-k8s-hack
weight: 13
---

## Background

You work for a small retail business with an in store rating system.

Customers can leave a star rating and comment on particular items.

You host this rating system on-premise in self-managed Kubernetes clusters at each location. The application needs to initally run in London, Dublin and Amsterdam.

You are looking to reduce the operational overhead of managing multiple clusters at scale, improving consistency of deployments and ensuring regulatory compliance.

You have heard that Azure Arc can help you so **let's go and deploy some clusters!** ... but first you will need to get your team familiar using GitHub to manage your applications and infrastructure.

## Challenge Zero

1. [Create an organisation](https://github.com/account/organizations/new?coupon=&plan=team_free) in GitHub for your team
1. Add all of the team members' GitHub IDs to the team
1. Generate a **team repository** (called `arc-for-kubernetes`) in your new GitHub organisation
    1. Generate it from the _Use this template_ button in the [hack template project](https://github.com/jasoncabot-ms/arc-for-kubernetes)
1. Ensure everyone can collaborate on the arc-for-kubernetes repo

## Success Criteria

The purpose of this challenge is to get your team set up and ready to work together, collaborating on GitHub and Azure.

1. Your team is set up and ready to work together
1. You have a team repository on GitHub
1. Everyone is comfortable collaborating on GitHub and the Azure Portal

## References

* [GitHub](https://github.com)
* [Azure Arc for Kubernetes Hack Template](https://github.com/jasoncabot-ms/arc-for-kubernetes)
* [What is Azure Arc](https://azure.microsoft.com/services/azure-arc/#product-overview)
* [What is Azure Arc for Kubernetes?](https://docs.microsoft.com/azure/azure-arc/kubernetes/overview)
