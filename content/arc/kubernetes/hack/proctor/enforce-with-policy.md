```bash
# Jump into a running UI container and try to access the API directly
export KUBECONFIG=$HOME/.kube/arc4k8s-uksouth.config
UI_POD=$(kubectl get pod -lapp=reviewer-ui -n app-dev-arc -o name | head -n 1)
kubectl exec -it $UI_POD -n app-dev-arc -- /bin/bash
curl -v reviewer-api.app-dev-arc.svc.cluster.local/api/Items
```