---
title: "Private Link"
description: "Use Private Link and private DNS to reduce the attack surface on your PaaS public endpoints. Also touches on Private Link Service and vNet Integration."
date: 2021-04-30
draft: false
menu:
  side:
    identifier: network-privatelink
    parent: network
weight: 3
---

## Introduction

Securing the public endpoints for services such as Azure Storage or PaaS DBs has always been a concern. Many have firewalls built into the individual services alongside the authentication, but there is a move towards private connectivity to improve security further. Service Endpoints were the first iteration but weren't granular enough or enabled routing and ACL controls. Enter Private Link.

## Private Link

The Private Link service introduced the ability to create a Private Endpoint to a specific PaaS resource. The complexity is with custom DNS scenarios so that clients resolve the service endpoint's FQDN to the private IP.

This fantastic 4 hour microhack from our networking Global Black Belts helps you understand the nuances:

* [Azure Private Link DNS Microhack](https://github.com/adstuart/azure-privatelink-dns-microhack)

The microhack illustrates the differences in public access v service endpoints v public endpoints, before diving in a bit deeper with some custom DNS scenarios (both pure Azure and a hybrid scenario). The stretch targets cover Azure Firewall's DNS forwarding capabilities and also a lightweight NGINX DNS proxy.

## vNet Integration and Private Link Service

In our work with service partners and ISVs we encounter some additional scenarios and we have created labs for a couple of these.

> Retain the microhack environment if you are planning to work through the additional scenarios below!
