---
title: "Lighthouse and Partner Admin Link"
description: "If you use Azure Lighthouse for your multi-tenanted managed service delivery then learn how to combine Lighthouse with Partner Admin Link."
draft: false
menu:
  side:
    parent: pal
    identifier: pal-lighthouse
aliases:
  - /partner/lighthouse
  - /partners/lighthouse
  - /partner/pal
  - /partners/pal
weight: 70
---

## Introduction

Combining Azure Lighthouse and Partner Admin Link helps Microsoft to recognise the impact that your managed services have within customer subscriptions.

First we will learn how to combine the two mechanisms, as this is different to the normal PAL configuration.

Secondly we will go through some example Azure Lighthouse templates that you can use as a reference point for your own configuration, including:

* a minimal config
* an expanded version with a service principal for Terraform deployment
* a more complex configuration with additional roles elevated via Privileged Identity Management

The examples use the Support Request Contributor role which is eligible for partner earned credit and therefore for PAL recognition.

## Content
