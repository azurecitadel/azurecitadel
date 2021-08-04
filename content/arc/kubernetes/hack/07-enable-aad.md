---
title: "Enable Azure AD"
description: "Secure all the things."
slug: access-with-azure-ad
menu:
  side:
    parent: arc-k8s
    identifier: arc-k8s-secure-baseline
series:
 - arc-k8s-hack
weight: 18
---

## Background

*Persona: Cluster Admin*

You have managed to build a cluster on your own infrastructure, onboard it to Azure Arc, host a (relatively) real-world application all without sharing any credentials and keeping it as secure as possible.

However there are a few points that could be improved.

### Authorization

Currently anyone with access to the config file has cluster administrator priveleges. You want to ensure that only authorised users may see their own resources according to the [secure baseline](https://docs.microsoft.com/security/benchmark/azure/baselines/aks-security-baseline)

## Challenge 5

Add one of the measures outlined above to conform your cluster to the secure baseline.

This could be by adding Azure AD to control the cluster administrator.

## Success Criteria

* You are prompted to authenticate with Azure AD when accessing the cluster
* You have discussed at least one other aspect of the secure baseline and describe how it would be applied

## References

* [Azure AD](https://github.com/mspnp/aks-secure-baseline/blob/main/03-aad.md)
* [Azure RBAC - Conceptual](https://docs.microsoft.com/azure/azure-arc/kubernetes/conceptual-azure-rbac)
* [Azure RBAC - Step by step](https://docs.microsoft.com/azure/azure-arc/kubernetes/azure-rbac)
* [Secure Baseline](https://docs.microsoft.com/security/benchmark/azure/baselines/aks-security-baseline)
* [Secure Baseline on GitHub](https://github.com/mspnp/aks-secure-baseline/)