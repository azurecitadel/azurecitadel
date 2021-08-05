```bash
LOCATION=uksouth
RESOURCE_GROUP=arc4k8s-$LOCATION

az k8s-extension create --name microsoft.azuredefender.kubernetes --cluster-type connectedClusters --cluster-name Arc-K3s-Demo --resource-group $RESOURCE_GROUP --extension-type microsoft.azuredefender.kubernetes

az k8s-extension show --cluster-type connectedClusters --cluster-name Arc-K3s-Demo --resource-group $RESOURCE_GROUP --name microsoft.azuredefender.kubernetes -o table

export KUBECONFIG=$HOME/.kube/$RESOURCE_GROUP.config
kubectl get pod -n azuredefender
```

If there are no pods scheduled