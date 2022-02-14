---
title: "Connect to Arc"
layout: single
draft: false
series:
 - arc-kubernetes-proctor
url: /arc/kubernetes/connect-to-arc/proctor
weight: 15
---

```bash
LOCATION=uksouth
RESOURCE_GROUP=arc4k8s-$LOCATION
az connectedk8s connect -n Arc-K3s-Demo -g $RESOURCE_GROUP --kube-config ~/.kube/$RESOURCE_GROUP.config

LOCATION=westeurope
RESOURCE_GROUP=arc4k8s-$LOCATION
az connectedk8s connect -n Arc-K3s-Demo -g $RESOURCE_GROUP --kube-config ~/.kube/$RESOURCE_GROUP.config
```

KQL and Resource Graph

```kql
resources
| where type == 'microsoft.kubernetes/connectedclusters'
| project name, distribution=properties.distribution, version=properties.kubernetesVersion
```
