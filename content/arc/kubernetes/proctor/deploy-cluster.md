---
title: "Deploy Cluster"
layout: single
draft: false
series:
 - arc-kubernetes-proctor
url: /arc/kubernetes/deploy-cluster/proctor
weight: 14
---

Ensure that you are in a tenant without a policy restricting the creation of a public IP address

Just run through the steps listed here:

<https://github.com/jasoncabot-ms/arc-for-kubernetes/tree/main/00-setup>

Should pretty much just be copy/paste for each location name

Hardest part is to get hold of the context information from the deployed VM
You can SSH in and copy it out or just use SCP to grab it

If someone doesn't have an SSH key you can follow [this guide](https://docs.microsoft.com/azure/virtual-machines/linux/create-ssh-keys-detailed#basic-example)

```bash
LOCATION=uksouth
RESOURCE_GROUP=arc4k8s-$LOCATION
FQDN=$(az network public-ip list -g $RESOURCE_GROUP --query '[].dnsSettings.fqdn' -o tsv)
scp arcdemo@$FQDN:~/.kube/config ~/.kube/$RESOURCE_GROUP.config
kubectl --kubeconfig ~/.kube/$RESOURCE_GROUP.config get node

LOCATION=westeurope
RESOURCE_GROUP=arc4k8s-$LOCATION
FQDN=$(az network public-ip list -g $RESOURCE_GROUP --query '[].dnsSettings.fqdn' -o tsv)
scp arcdemo@$FQDN:~/.kube/config ~/.kube/$RESOURCE_GROUP.config
kubectl --kubeconfig ~/.kube/$RESOURCE_GROUP.config get node
```

Then they need to view the public DNS name and see `404`
