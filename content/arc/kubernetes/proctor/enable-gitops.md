---
title: "Enable GitOps"
layout: single
draft: false
series:
 - arc-kubernetes-proctor
url: /arc/kubernetes/enable-gitops/proctor
weight: 16
---

Ensure that you repository is public
Ensure that you're doing over HTTPS

```bash
LOCATION=westeurope
CLUSTER_REPO=azurecitadel/arc-for-kubernetes
az k8s-configuration create \
    --name cluster-config \
    --cluster-name Arc-K3s-Demo \
    --resource-group arc4k8s-$LOCATION \
    --operator-instance-name cluster-config \
    --operator-namespace cluster-config \
    --operator-params='--git-readonly --sync-garbage-collection --git-branch=main --git-path=cluster-config' \
    --repository-url https://github.com/$CLUSTER_REPO \
    --scope cluster \
    --cluster-type connectedClusters
```

If you are attempting to do it for a private repository, you need to generate / allow flux to generate a private / public key pair, then add that into GitHub as a [Deploy Key](https://docs.github.com/en/developers/overview/managing-deploy-keys#setup-2)

Once deployed, ensure that you aren't getting errors such as `git repo not ready: configured branch 'master' does not exist`

You can update the branch name (or other parameters) by re-running with different `--operator-params`

You can use the `git-path` variable to use a single repository with different teams owning different folders
