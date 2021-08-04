Remove podinfo

> `kubectl delete all --all -n podinfo-app`

See the sample manifests for how to deploy without using `kubectl apply`

# Deploy App Dev Infrastructure as Cluster Admin

Just run through the steps listed here:

https://github.com/jasoncabot-ms/arc-for-kubernetes/tree/main/01-app-setup

# Set up App Dev repo

Create a new (private?) repository on GitHub

```bash
LOCATION=westeurope
RESOURCE_GROUP=arc4k8s-$LOCATION
DEVELOPER_REPO=jasoncabot-ms/arc-for-k8s-app
az k8s-configuration create \
    -n arc-for-k8s-app \
    -c Arc-K3s-Demo \
    -g $RESOURCE_GROUP \
    --operator-namespace app-dev-arc \
    --operator-params='--git-readonly --sync-garbage-collection --git-branch=main' \
    --repository-url git@github.com:$DEVELOPER_REPO.git \
    --scope namespace \
    --cluster-type connectedClusters
```

You can view logs of the flux operator by running

```bash
LOCATION=westeurope
RESOURCE_GROUP=arc4k8s-$LOCATION
kubectl --kubeconfig ~/.kube/$RESOURCE_GROUP.config logs -n app-dev-arc -linstanceName=arc-for-k8s-app
```

You can get the SSH public key from the cluster and add it to GitHub repository as a deploy key to fix `git repo not ready: git clone --mirror: fatal: Could not read from remote repository`

It doesn't matter what you call the Deploy Key in GitHub, the only thing that matters is the content of it

```bash
az k8s-configuration show \
  -g $RESOURCE_GROUP \
  -n arc-for-k8s-app \
  -c Arc-K3s-Demo \
  --cluster-type connectedClusters \
  --query 'repositoryPublicKey' \
  -o tsv
```

# Get Application Logs

Reviewer API

```bash
kubectl --kubeconfig ~/.kube/$RESOURCE_GROUP.config logs -n app-dev-arc -lapp=reviewer-api --tail=-1
```

Reviewer UI

```bash
kubectl --kubeconfig ~/.kube/$RESOURCE_GROUP.config logs -n app-dev-arc -lapp=reviewer-ui --tail=-1
```

Ensure that you updated the host name in `ingress.yaml` and `deployment.yaml`

Access a running instance of the API

```bash
kubectl --kubeconfig ~/.kube/$RESOURCE_GROUP.config exec -it -n app-dev-arc reviewer-api-XXXXXXXX-YYYYY -- /bin/bash
```

# Lets Encrypt

It takes a while for new certificates to be deployed so you may enoucnter errors that look like `Your connection isn't private` when visiting `x.y.cloudapp.azure.com`

1. Ensure you have replaced the email address in your cluster issuer deployment

```bash
# Failed to register ACME account: 400 urn:ietf:params:acme:error:invalidEmail: Error creating new account :: "replace_with_your_email_address" is not a valid e-mail address#

kubectl --kubeconfig ~/.kube/$RESOURCE_GROUP.config describe clusterissuer
```

# Managed Identity

If pod identity is failing to start, you can view the logs of the `mic` controller. It may say something like `/etc/kubernetes/azure.json` is a directory and not a file

```bash
# View logs for mic
kubectl --kubeconfig ~/.kube/$RESOURCE_GROUP.config logs -n aad-pod-identity -lapp=mic
```

```json
{
  "cloud": "AzurePublicCloud",
  "tenantId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "subscriptionId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "resourceGroup": "",
  "useManagedIdentityExtension": true
}
```

E0729 "The client 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'with object id 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' does not have authorization to perform action 'Microsoft.Compute/virtualMachines/read' over scope '/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/RESOURCE_GROUP/providers/Microsoft.Compute/virtualMachines/VM' or the scope is invalid. If access was recently granted, please refresh your credentials."

Solution you need to grant the following roles to the identity. This should have been done as part of the setup process but is worth checking.

```bash
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
RESOURCE_GROUP=rg-arc4k8s-westeurope
PRINCIPAL_ID=$(az vm list -g $RESOURCE_GROUP --query '[].identity.principalId' -o tsv)

az role assignment create --role "Managed Identity Operator" --assignee-object-id $PRINCIPAL_ID --scope /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP

az role assignment create --role "Virtual Machine Contributor" --assignee-object-id $PRINCIPAL_ID --scope /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP

```

You can check managed identity by logging into a UI pod and retrieving an access token that can be checked at https://jwt.ms

```bash
kubectl --kubeconfig ~/.kube/$RESOURCE_GROUP.config exec -it -n app-dev-arc reviewer-ui-XXXXXXXX-YYYYY -- /bin/bash

curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com%2F' -H Metadata:true -s
```

Another way this might fail is if the VMs system assigned managed identity doesn't have permissions to read the managed identity. This may occur if you didn't 