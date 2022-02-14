---
title: "Master Cheat Sheet"
layout: single
draft: false
series:
 - arc-kubernetes-proctor
url: /arc/kubernetes/cheat-sheet/proctor
weight: 1
---

## Cheat Sheet

The steps to complete the Azure Arc for Kubernetes challenge

More details in each sub-section. This is designed to be run in one session from start to finish, if it's not then **some steps may not work** due to expecting environment variables that were set previously.

This all takes place using Azure Cloud Shell with Bash and will run two unmanaged clusters in uksouth and westeurope

## Pre-reqs

Virtual Machines should be &lt; 6

```bash
# Query quota
az vm list-usage --location "UK South" -o table
az vm list-usage --location "West Europe" -o table

# Register Providers
az provider register --namespace Microsoft.Web
az provider register --namespace Microsoft.Kubernetes
az provider register --namespace Microsoft.KubernetesConfiguration
az provider register --namespace Microsoft.ExtendedLocation
```

## Challenge 0

Create a new GitHub Organisation manually

<https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/creating-a-new-organization-from-scratch>

Ensure you clone the newly created repository as that allows setting secrets

```bash
gh auth login
GITHUB_ORG=<set name of the organisation you created above>
gh repo create $GITHUB_ORG/arc-for-kubernetes \
    --description "Organisation for the Azure Arc for Kubernetes Hack" \
    -y \
    --public \
    --template jasoncabot-ms/arc-for-kubernetes
cd arc-for-kubernetes

```

## Challenge 1

Ignore warnings for existing application instances, role assignments, credential outputs and name property being deprecated. It should still just work.

```bash
MAIL=$(az ad signed-in-user show --query 'mail' -o tsv)
KEY_PATH=$HOME/.ssh/id_arc-for-kubernetes
ssh-keygen -t rsa -b 4096 -C "${MAIL}" -f $KEY_PATH
PUBLIC_KEY=$(cat $KEY_PATH.pub)
chmod 400 $KEY_PATH*

# Setup in Region

LOCATION=uksouth
RG_ID=$(az group create -n "arc4k8s-${LOCATION}" -l "${LOCATION}" -o tsv --query 'id')
AZURE_CREDENTIALS=$(az ad sp create-for-rbac --sdk-auth --role Owner --name http://arc4k8s-ghaction-$LOCATION --scopes $RG_ID)
gh secret set AZURE_CREDENTIALS_${LOCATION^^} -b"${AZURE_CREDENTIALS}"

# Deploy Cluster

gh workflow run 00-k3s-cluster.yml -f credentials=AZURE_CREDENTIALS_${LOCATION^^} -f adminPasswordOrKey="${PUBLIC_KEY}"

# Setup in Region

LOCATION=westeurope
RG_ID=$(az group create -n "arc4k8s-${LOCATION}" -l "${LOCATION}" -o tsv --query 'id')
AZURE_CREDENTIALS=$(az ad sp create-for-rbac --sdk-auth --role Owner --name http://arc4k8s-ghaction-$LOCATION --scopes $RG_ID)
gh secret set AZURE_CREDENTIALS_${LOCATION^^} -b"${AZURE_CREDENTIALS}"

# Deploy Cluster

gh workflow run 00-k3s-cluster.yml -f credentials=AZURE_CREDENTIALS_${LOCATION^^} -f adminPasswordOrKey="${PUBLIC_KEY}"

# Pull out all kubernetes contexts
FQDN=$(az network public-ip list -g arc4k8s-uksouth --query '[].dnsSettings.fqdn' -o tsv)
scp -i $KEY_PATH arcdemo@$FQDN:~/.kube/config ~/.kube/arc4k8s-uksouth.config
kubectl --kubeconfig ~/.kube/arc4k8s-uksouth.config get node
FQDN=$(az network public-ip list -g arc4k8s-westeurope --query '[].dnsSettings.fqdn' -o tsv)
scp -i $KEY_PATH arcdemo@$FQDN:~/.kube/config ~/.kube/arc4k8s-westeurope.config
kubectl --kubeconfig ~/.kube/arc4k8s-westeurope.config get node


```

## Challenge 2

Connect to Arc

```bash
LOCATION=uksouth
RESOURCE_GROUP=arc4k8s-$LOCATION
az connectedk8s connect -n Arc-K3s-Demo -g $RESOURCE_GROUP --kube-config ~/.kube/$RESOURCE_GROUP.config

LOCATION=westeurope
RESOURCE_GROUP=arc4k8s-$LOCATION
az connectedk8s connect -n Arc-K3s-Demo -g $RESOURCE_GROUP --kube-config ~/.kube/$RESOURCE_GROUP.config

```

## Challenge 3

Repository setup

```bash
cd .. # If you're in arc-for-kubernetes if you've been following along

gh repo create $GITHUB_ORG/arc-for-kubernetes-cluster-admin \
    --description "Cluster Administrator Repository for managing cluster-wide infrastructure" \
    --public \
    -y
cd arc-for-kubernetes-cluster-admin
cp ../arc-for-kubernetes/cluster-config/* . # copy manifests
sed -i "s/REPLACE_WITH_YOUR_EMAIL_ADDRESS/${MAIL}/" cluster-issuer.yaml

git config --global user.email "${MAIL}"
git config --global user.name "$(az ad signed-in-user show --query 'displayName' -o tsv)"
git add .
git commit -m "first commit from cluster administrator"
git branch -M main
git push -u origin main

cd ..

LOCATION=uksouth
RESOURCE_GROUP=arc4k8s-$LOCATION
gh repo create $GITHUB_ORG/apps-$RESOURCE_GROUP \
    --description "App developer repository for $RESOURCE_GROUP" \
    --public \
    -y
cd apps-$RESOURCE_GROUP
curl -o podinfo.yaml https://gist.githubusercontent.com/bricef/b7a3285007874b4cb9fa59c2a59b8674/raw/a0cd969ca2120264dc707f83c147ce6f3bc88434/podinfo.yaml
sed -i "s/namespace: dev/namespace: app-dev-arc/" podinfo.yaml
git add .
git commit -m "Added podinfo"
git branch -M main
git push -u origin main
cd ..

LOCATION=westeurope
RESOURCE_GROUP=arc4k8s-$LOCATION
gh repo create $GITHUB_ORG/apps-$RESOURCE_GROUP \
    --description "App developer repository for $RESOURCE_GROUP" \
    --public \
    -y
cd apps-$RESOURCE_GROUP
curl -o podinfo.yaml https://gist.githubusercontent.com/bricef/b7a3285007874b4cb9fa59c2a59b8674/raw/a0cd969ca2120264dc707f83c147ce6f3bc88434/podinfo.yaml
sed -i "s/namespace: dev/namespace: app-dev-arc/" podinfo.yaml
git add .
git commit -m "Added podinfo"
git branch -M main
git push -u origin main
cd ..


# Connect it all to Arc
LOCATION=uksouth
RESOURCE_GROUP=arc4k8s-$LOCATION
az k8s-configuration create \
    --name cluster-config \
    --cluster-name Arc-K3s-Demo \
    --resource-group $RESOURCE_GROUP \
    --operator-instance-name cluster-config \
    --operator-namespace cluster-config \
    --operator-params='--git-readonly --sync-garbage-collection --git-branch=main' \
    --repository-url https://github.com/$GITHUB_ORG/arc-for-kubernetes-cluster-admin \
    --scope cluster \
    --cluster-type connectedClusters

az k8s-configuration create \
    -n arc-for-k8s-app \
    -c Arc-K3s-Demo \
    -g $RESOURCE_GROUP \
    --operator-namespace app-dev-arc \
    --operator-params='--git-readonly --sync-garbage-collection --git-branch=main' \
    --repository-url https://github.com/$GITHUB_ORG/apps-$RESOURCE_GROUP \
    --scope namespace \
    --cluster-type connectedClusters


LOCATION=westeurope
RESOURCE_GROUP=arc4k8s-$LOCATION
az k8s-configuration create \
    --name cluster-config \
    --cluster-name Arc-K3s-Demo \
    --resource-group $RESOURCE_GROUP \
    --operator-instance-name cluster-config \
    --operator-namespace cluster-config \
    --operator-params='--git-readonly --sync-garbage-collection --git-branch=main' \
    --repository-url https://github.com/$GITHUB_ORG/arc-for-kubernetes-cluster-admin \
    --scope cluster \
    --cluster-type connectedClusters

az k8s-configuration create \
    -n arc-for-k8s-app \
    -c Arc-K3s-Demo \
    -g $RESOURCE_GROUP \
    --operator-namespace app-dev-arc \
    --operator-params='--git-readonly --sync-garbage-collection --git-branch=main' \
    --repository-url https://github.com/$GITHUB_ORG/apps-$RESOURCE_GROUP \
    --scope namespace \
    --cluster-type connectedClusters


```

## Challenge 4

Deploy app and infra. This reuqires some **Manual Steps** after deploying the infrastructure

```bash
cd ../arc-for-kubernetes

DBA_OBJECT_ID=$(az ad signed-in-user show --query 'objectId' -o tsv)

# Register Application
SUFFIX=$RANDOM
APP=$(az ad app create --display-name="Item Reviewer $SUFFIX" --available-to-other-tenants=true)
APP_ID=$(echo $APP | jq -r .appId)
OBJECT_ID=$(echo $APP | jq -r .objectId)

# Update requestedAccessTokenVersion to v2, add SPA reply urls and set application URI
# you should add on more hosts into the `redirectUris` array that correspond to your hosts
REDIRECT_URIS=$(az network public-ip list --query "[?name=='Arc-K3s-Demo-PIP'].join('', ['https://', dnsSettings.fqdn])" -o json)

az rest \
    --method PATCH \
    --headers "Content-Type=application/json" \
    --uri "https://graph.microsoft.com/v1.0/applications/${OBJECT_ID}" \
    --body "{\"api\":{\"requestedAccessTokenVersion\":2}, \"identifierUris\":[\"api://${APP_ID}\"], \"spa\":{\"redirectUris\":$REDIRECT_URIS}}"

LOCATION=uksouth
gh workflow run 01-app-infra.yml -f credentials=AZURE_CREDENTIALS_${LOCATION^^} -f aad_admin_objectid="${DBA_OBJECT_ID}" -f app_id="${APP_ID}" 


LOCATION=westeurope
gh workflow run 01-app-infra.yml -f credentials=AZURE_CREDENTIALS_${LOCATION^^} -f aad_admin_objectid="${DBA_OBJECT_ID}" -f app_id="${APP_ID}" 

# Fill these in manually
UKSOUTH_RUN_ID=1098617734
WESTEUROPE_RUN_ID=1098632122

gh run download $UKSOUTH_RUN_ID -n "App Manifest Bundle"
mv baked-template*.yaml ../apps-arc4k8s-uksouth/
cd ../apps-arc4k8s-uksouth/
git add .
git commit -m "Added from run $UKSOUTH_RUN_ID"
git branch -M main
git push -u origin main
cd -

gh run download $WESTEUROPE_RUN_ID -n "App Manifest Bundle"
mv baked-template*.yaml ../apps-arc4k8s-westeurope/
cd ../apps-arc4k8s-westeurope/
git add .
git commit -m "Added from run $WESTEUROPE_RUN_ID"
git branch -M main
git push -u origin main


```

Follow the Steps here to allow access to SQL Server and deploy the database schema

* <https://github.com/jasoncabot-ms/arc-for-kubernetes/tree/main/01-app-setup#4-create-sql-schema>

## Challenge 5

Enable Azure AD + Discussion

## Challenge 6

