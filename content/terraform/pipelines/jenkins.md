---
title: "Managed Identity with Jenkins"
date: 2024-04-01
draft: true
author: [ "Richard Cheney" ]
description: "Deploy Jenkins to an Azure Virtual Machine and deploy using the VM's system assigned managed identity."
weight: 70
menu:
  side:
    parent: terraform-pipelines
series:
 - terraform-pipelines
---

## Overview

***THIS NEEDS TO BE REVIEWED AND MADE CONSISTENT WITH THE OTHER SECTIONS***

(Copied in from the day zero work in progress.)

## Introduction

Jenkins is a popular CI/CD tool. This example shows the creation of a Jenkins server with a managed identity and both Azure CLI and Terraform installed. Some basic plug in and credentials configuration and then provisioning pulling secrets from an Azure Key Vault and pushing Terraform based on a repo.

## Deploy a Jenkins server

1. Create cloud-init-jenkins.txt

    ```yaml
    #cloud-config
    package_upgrade: true
    runcmd:
      - sudo apt install openjdk-11-jre -y
      - wget -qO - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
      - sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
      - sudo apt-get update && sudo apt-get install jenkins -y
      - sudo service jenkins restart
    ```

1. Set region

    ```bash
    region=westeurope
    ```

1. Create resource group

    ```bash
    az group create --name jenkins --location $region
    ```

1. Create the VM

    ```bash
    az vm create --name jenkins \
    --resource-group jenkins --location $region \
    --image UbuntuLTS \
    --admin-username "azureuser" \
    --generate-ssh-keys \
    --public-ip-sku Standard \
    --custom-data cloud-init-jenkins.txt \
    --assign-identity [system]
    ```

1. Create a storage account and container for the Terraform remote state

    ```bash
    sa=terraform$(az group show --name jenkins --query id --output tsv | md5sum | cut -c1-12)
    az storage account create --name $sa --sku Standard_LRS \
      --resource-group jenkins --location $region \
      --allow-blob-public-access false
    az storage container create --name "tfstate" --account-name $sa --auth-mode login
    saId=$(az storage account show --name $sa --resource-group jenkins --query id --output tsv)
    ```

1. Find the objectId for the managed identity

    ```bash
    managed_identity=$(az vm show --resource-group jenkins --name jenkins --query identity.principalId --output tsv)
    ```

1. Assign RBAC roles for the managed identity

    ```bash
    subscriptionId=/subscriptions/$(az account show --query id --output tsv)
    az role assignment create --assignee $managed_identity --role "Contributor" --scope $subscriptionId
    az role assignment create --assignee $managed_identity --role "Storage Blob Data Contributor" --scope $saId
    ```

1. Open ports 443 and 8080 on the NSG

    ```bash
    az vm open-port --port 443,8080 --priority 1010 --resource-group jenkins --name jenkins
    ```

## SSH to your Jenkins server

1. Grab the public IP address

    ```bash
    publicIp=$(az vm show --resource-group jenkins --name jenkins  --show-details --query publicIps --output tsv)
    echo $publicIp
    ```

1. SSH onto the Jenkins server

    ```bash
    ssh azureuser@$publicIp
    ```

## Initial server config

1. Install the Azure CLI and Terraform

    ```bash
    sudo apt-get update && sudo apt-get install ca-certificates curl apt-transport-https lsb-release gnupg gpg wget -y
    wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null
    wget -O- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor | sudo tee /usr/share/keyrings/microsoft.gpg > /dev/null
    sudo chmod go+r /usr/share/keyrings/hashicorp-archive-keyring.gpg /usr/share/keyrings/microsoft.gpg
    arch=$(dpkg --print-architecture)
    release=$(lsb_release -cs)
    echo "deb [arch=$arch signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $release main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
    echo "deb [arch=$arch signed-by=/usr/share/keyrings/microsoft.gpg] https://packages.microsoft.com/repos/azure-cli/ $release main" | sudo tee /etc/apt/sources.list.d/azure-cli.list
    sudo apt-get update && sudo apt-get install azure-cli terraform jq -y
    ```

    You should be able to login with the identity using `az login --identity`.

1. Check Jenkins is running

    ```bash
    service jenkins status
    ```

1. Display the Jenkins URL and unlock password

    ```bash
    publicIp=$(az vm show --resource-group jenkins --name jenkins  --show-details --query publicIps --output tsv)
    pwdfile=/var/lib/jenkins/secrets/initialAdminPassword
    echo "Open http://${publicIp}:8080"
    [[ -s $pwdfile ]] && echo "and paste in $(sudo cat $pwdfile)"
    ```

## Initial UI connection

1. Connect to the URL

1. Select plugins to install

    * GitHub

1. Create First Admin User

   * username
   * password
   * full name
   * email address

1. Complete the setup

## Configure Jenkins Plugins

1. Manage Jenkins | System Configuration | Manage Plugins

    1. Click on *Available plugins*
    1. Search on the following plug-ins in turn
        * AnsiColor
        * Azure CLI
        * Azure Credentials
        * Terraform
    1. Check and *Install without restart*
    1. Repeat

    There are more [Jenkins Plug-ins for Azure](https://learn.microsoft.com/azure/developer/jenkins/plug-ins-for-azure), but Azure CLI is the only first party plugin. Some of the legacy plugins will be community supported after Feb 2024.

1. Restart Jenkins

    Edit the URL in the browser to `http://<ip_address>:8080/restart` and click *Yes*.

    Or run

    ```bash
    sudo service jenkins restart
    ```

## Azure Credential

On the Jenkins server.

1. Login as the managed identity

    ```bash
    az login --identity
    ```

1. Display the subscription ID, client ID and object ID

    ```bash
    subscriptionId=$(az account show --query id --output tsv)
    objectId=$(az vm show --resource-group jenkins --name jenkins --query identity.principalId --output tsv)
    appId=$(az ad sp show --id $objectId --query appId --output tsv)

    echo "
    Subscription: $subscriptionId
    Client ID: $appId
    ID: $objectId    "
    ```

In the Jenkins UI.

1. Manage Jenkins | Security | Manage Credentials
1. Click on *System*
1. Click on *Global credentials (unrestricted)
1. *+ Add credentials*
1. Select *Kind* =  **Azure Managed Identity**
1. Paste in the subscription ID
1. Paste in the app ID

    ![Adding a managed identity into Jenkins](/partner/day_zero/images/new_credential.png)

    > The app ID is also called the client ID. Not required if there is only one managed identity. (Azure supports any combination of a) system assigned managed identity and b) one or more user assigned managed identities.)
    >
    > Jenkins will generate an ID if left blank. Setting to the object ID is useful as this is the GUID used in RBAC role assignments.

## Jenkins Tools

Jenkins can install tools (binaries, etc) on the fly with automatic installers. We have installed Terraform manually via apt.

1. Manage Jenkins | Global Tool Configuration
1. Scroll down to the Terraform section
1. Add Terraform
1. Uncheck *Install automatically*




## Next

On the next page you will use the Azure CLI and the Cloud Shell to pull down an image into the container registry and you'll also create a virtual network.

## Resources

* <https://learn.microsoft.com/azure/developer/jenkins/configure-on-linux-vm>
* <https://plugins.jenkins.io/azure-cli/>
* <https://plugins.jenkins.io/credentials/>
* <https://plugins.jenkins.io/azure-credentials/>
* <https://learn.microsoft.com/azure/developer/jenkins/deploy-to-azure-spring-apps-using-azure-cli>
* <https://github.com/Azure-Samples/jenkins-terraform-azure-example/blob/main/Create_Jenkins_Job.md>
* <https://github.com/Azure-Samples/azure-voting-app-redis>
* <https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/managed_service_identity>
* <https://www.jenkins.io/doc/book/pipeline/jenkinsfile/>
* <https://www.genja.co.uk/blog/installing-jenkins-and-securing-the-traffic-with-tls-ssl/>
* <https://github.com/smertan/jenkins>
* <https://learn.microsoft.com/en-us/azure/load-balancer/howto-load-balancer-imds?tabs=linux>
* <https://learn.microsoft.com/en-us/azure/virtual-machines/instance-metadata-service?tabs=linux>
