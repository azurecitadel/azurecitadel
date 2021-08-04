```bash
RESOURCE_GROUP="rg-arc4k8s-westeurope"
APP_SVC_NAMESPACE="appservice-ns"
EXTENSION_NAME="arc4k8s-westeurope-appsvc"
CLUSTER_NAME="Arc-K3s-Demo"

# Create Log Analytics
WORKSPACE_NAME="ws-${RESOURCE_GROUP}"
az monitor log-analytics workspace create \
    --resource-group $RESOURCE_GROUP \
    --workspace-name $WORKSPACE_NAME

LA_WORKSPACE_ID=$(az monitor log-analytics workspace show \
    --resource-group $RESOURCE_GROUP \
    --workspace-name $WORKSPACE_NAME \
    --query customerId \
    --output tsv)
LA_WORKSPACE_ID_ENC=$(printf %s $LA_WORKSPACE_ID | base64) # Needed for the next step
LA_KEY=$(az monitor log-analytics workspace get-shared-keys \
    --resource-group $RESOURCE_GROUP \
    --workspace-name $WORKSPACE_NAME \
    --query primarySharedKey \
    --output tsv)
LA_KEY_ENC_SPACE=$(printf %s $LA_KEY | base64)
LA_KEY_ENC=$(echo -n "${LA_KEY_ENC_SPACE//[[:space:]]/}") # Needed for the next step

# Create App Service Extension
IP_ADDRESS=$(az network public-ip show -g $RESOURCE_GROUP -n Arc-K3s-Demo-PIP --output tsv --query ipAddress)

az k8s-extension create \
    --resource-group $RESOURCE_GROUP \
    --name $EXTENSION_NAME \
    --cluster-type connectedClusters \
    --cluster-name $CLUSTER_NAME \
    --extension-type 'Microsoft.Web.Appservice' \
    --release-train stable \
    --auto-upgrade-minor-version true \
    --scope cluster \
    --release-namespace $APP_SVC_NAMESPACE \
    --configuration-settings "Microsoft.CustomLocation.ServiceAccount=default" \
    --configuration-settings "appsNamespace=${APP_SVC_NAMESPACE}" \
    --configuration-settings "clusterName=${CLUSTER_NAME}" \
    --configuration-settings "loadBalancerIp=${IP_ADDRESS}" \
    --configuration-settings "keda.enabled=true" \
    --configuration-settings "buildService.storageClassName=local-path" \
    --configuration-settings "buildService.storageAccessMode=ReadWriteOnce" \
    --configuration-settings "customConfigMap=${APP_SVC_NAMESPACE}/kube-environment-config" \
    --configuration-settings "logProcessor.appLogs.destination=log-analytics" \
    --configuration-protected-settings "logProcessor.appLogs.logAnalyticsConfig.customerId=${LA_WORKSPACE_ID_ENC}" \
    --configuration-protected-settings "logProcessor.appLogs.logAnalyticsConfig.sharedKey=${LA_KEY_ENC}"

# Monitor the progress with

watch az k8s-extension show -g $RESOURCE_GROUP -c $CLUSTER_NAME -n $EXTENSION_NAME --cluster-type connectedClusters -o table
```

# Problems

* PVC not found `storageclass.storage.k8s.io "default" not found`

A StorageClass provides a way for administrators to describe the "classes" of storage they offer. Different classes might map to quality-of-service levels, or to backup policies, or to arbitrary policies determined by the cluster administrators. Kubernetes itself is unopinionated about what classes represent.

```bash
kubectl describe pvc arc4k8s-westeurope-appsvc-k8se-build-service -n appservice-ns

  Type     Reason              Age                   From                         Message
  ----     ------              ----                  ----                         -------
  Warning  ProvisioningFailed  XmXs (xX over Xm)  persistentvolume-controller  storageclass.storage.k8s.io "default" not found
```

You are missing a StorageClass called `default` in k3s and you specified this as the default when deploying the extension.

You can either change your extension deployment following:

```bash
-    --configuration-settings "buildService.storageClassName=default" \
+    --configuration-settings "buildService.storageClassName=local-path" \
```

Or you can create a new StorageClass based on the default from k3s

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: default
provisioner: rancher.io/local-path
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
```

You can view logs of the API using `kubectl logs -lapp=reviewer-api -n dev` and UI using `kubectl logs -lapp=reviewer-ui -n dev`

If you find that the app service is stuck pending a LoadBalancer this is because of a port conflict between Traefik and App Service.

```
some-ns    app-region-appsvc-k8se-envoy                    LoadBalancer   10.0.0.0.0    <pending>     80:32194/TCP,443:31968/TCP,8081:30415/TCP   16s
```

You will need to change the port that App Service is listening on

