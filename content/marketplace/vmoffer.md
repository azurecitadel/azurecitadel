---
title: "VM Offer"
author: [ "Mike Ormond" ]
description: "Publishing a VM Offer"
date: 2021-01-06
weight: 4
menu:
  side:
    parent: 'marketplace'
---

*Virtual Machine offers* are used to deploy and transact a virtual machine (VM) instance through Marketplace. The solution must consist of a single VM. Anything more complex requires an *Azure Apps offer*.

When a customer 'purchases' a *VM offer*, the VM will be deployed into the customer's Azure subscription. As a consequence, VM offers can only be published in *Azure Marketplace* (not *AppSource*).

*VM offers* support the *Transact* listing type. They also support the *BYOL* listing type. A *Test drive* option is also available.

Transact *VM offers* are billed on a usage-based PAYG (Pay As You Go) model. Each plan can be created with a free trial option giving you the option to offer customers a 1 / 3 / 6 month period with no licence fees.

## Prerequisites <!-- omit in toc -->

* An Azure subscription (required) - see [here for free options](https://azure.microsoft.com/en-us/free/)
* [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli) (required) either via [Azure Cloud Shell in the Azure Portal](https://docs.microsoft.com/en-us/azure/cloud-shell/quickstart) or [installed locally](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
* A [Partner Center account](../partnercenter/) with the appropriate permissions (some of the material can be completed without Partner Center access)

## Overview <!-- omit in toc -->

In this lab we will create the technical assets required to publish a VM offer to the commercial marketplace. The high level steps required to do this are as follows:

* [Create a VM to use as a base](#create-a-vm-to-use-as-a-base)
* [Ensure the VM has latest updates applied](#ensure-the-vm-has-latest-updates-applied)
* [Perform additional security checks](#perform-additional-security-checks)
* [Apply custom configuration and scheduled tasks as required](#apply-custom-configuration-and-scheduled-tasks-as-required)
* [Generalise the image](#generalise-the-image)
* [Test the virtual machine image](#test-the-virtual-machine-image)
* [Run validations on the virtual machine](#run-validations-on-the-virtual-machine)
* [Generate a SAS URL to the VHD Image](#generate-a-sas-url-to-the-vhd-image)

## Create a VM to use as a base

We will create a VM using an approved base image. However it is also possible to [create and deploy your own VM image](https://docs.microsoft.com/en-us/azure/marketplace/azure-vm-create-using-own-image). Starting from an approved base image simplifies the process.

There are numerous way we could create the VHD. In this lab we will use the Azure CLI. [Packer is a useful tool](https://azurecitadel.com/automation/packeransible/lab1/) for helping to automate the process.

### Create a VM using the Azure CLI <!-- omit in toc -->

1. Create a new resource group using the Azure CLI:

   ```bash
   az group create --name 'marketplace-vm-offer' --location 'westeurope'
   ```

   Example output

   ```json
      {
         "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/marketplace-vm-offer",
         "location": "westeurope",
         "managedBy": null,
         "name": "marketplace-vm-offer",
         "properties": {
            "provisioningState": "Succeeded"
         },
         "tags": null,
         "type": "Microsoft.Resources/resourceGroups"
      }
   ```

2. Create the VM

   We will create an Ubuntu VM using a small machine size to minimise costs. It is important to create a VM using unmanaged disks as the base. This gives us direct access to the VHD which we will need to copy at a later stage. Generating ssh keys gives us a simple, secure way to connect to the VM.

   Create a new VM using the Azure CLI:

   ```bash
   az vm create \
      --resource-group 'marketplace-vm-offer' \
      --name 'marketplacevm' \
      --image 'Canonical:UbuntuServer:18.04-LTS:latest' \
      --admin-username 'azureuser' \
      --generate-ssh-keys \
      --size 'Standard_B1s' \
      --use-unmanaged-disk
   ```

   Example output

   ```json
      {
         "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/marketplace-vm-offer/providers/Microsoft.Compute/virtualMachines/marketplacevm",
         "location": "westeurope",
         "macAddress": "00-0D-3A-20-E4-73",
         "powerState": "VM running",
         "privateIpAddress": "10.0.0.4",
         "publicIpAddress": "13.93.33.158",
         "resourceGroup": "marketplace-vm-offer",
         "zones": ""
      }
   ```

## Ensure the VM has latest updates applied

Before publishing  VM offer you must ensure you have updated the OS and all installed services with the latest security and maintenance patches.

1. Firstly we have to connect to the VM using ssh.

   Use the `publicIpAddress` returned in the output above. This will use the private key file id_rsa stored in ~/.ssh to authenticate:

   ```bash
   ssh azureuser@13.93.44.158
   ```

2. Run the following commands on the VM to install the latest updates:

   ```bash
   sudo apt-get update && sudo apt-get upgrade -y
   ```

## Perform additional security checks

When you publish a VM offer to the Azure Marketplace, you are required to maintain a high-level of security. Before publishing an offer you should follow the guidance in [Security Recommendations for Azure Marketplace Images](https://docs.microsoft.com/en-us/azure/security/fundamentals/azure-marketplace-images)

As we are only publishing a test and will not put this "live" into the marketplace we will skip these additional checks for the purposes of this lab.

## Apply custom configuration and scheduled tasks as required

To simulate a real workload, we will add a web server and a startup task to our VM offer.

1. To install the NGINX web server, run the following command in the VM:

   ```bash
   sudo apt-get -y install nginx
   ```

2. We will also add a scheduled job to run whenever the VM reboots. Edit the root crontab file as follows:

   ```bash
   sudo crontab -e
   ```

3. Add the following line at the end of the file:

   ```bash
   @reboot less /etc/passwd > /tmp/users.txt
   ```

4. Save and exit the file.

   This will illustrate the use of a scheduled job by dumping the names of all user accounts to a file in the /tmp directory each time the VM reboots.

   When we test our VM we will be able to confirm the webserver displays a default page and there is a file called users.txt in the /tmp directory containing the names of all users including the admin username we specified on creation.

## Generalise the image

To create a reusable image, the operating system disk must be generalised. For Linux VMs this involves removing the Azure Linux agent and stopping the VM.

1. Remove the Azure Linux agent by entering the following command

   ```bash
   sudo waagent -verbose -deprovision+user
   ```

2. Confirm the removal
3. Exit the SSH session in the VM by typing `exit`
4. Stop and de-allocate the VM. Run the following command.

   ```bash
   az vm deallocate \
      --resource-group 'marketplace-vm-offer' \
      --name 'marketplacevm'
   ```

We now have a generalised OS VHD for our Ubuntu-based VM offer with a web server installed and a scheduled job on reboot. We can use this VHD image to create new (specialised) VMs.

## Test the virtual machine image

The first and simplest test is to confirm that we can create a new VM instance based on the VHD we created above. The following is based on the instructions [Test a virtual machine image](https://docs.microsoft.com/en-us/azure/marketplace/azure-vm-image-test) but with some modifications as I have found the provided script not to work for Linux images.

1. Sign in to the Azure portal.
2. On the home page, select Create a resource, search for “Template Deployment”, and select Create.
3. Choose "Build your own template in the editor".

   ![Create VM from ARM Template](/marketplace/images/create-from-template.png)

4. Copy and paste the JSON from [this file](scripts/deploy-user-provided-image.json) into the editor and hit **Save**
5. You will need to provide parameter values for the following

   Parameter | Comment
   --- | ---
   User Storage Account Name | Name of the storage account where the VHD image is stored
   User Storage Container Name | Most likely the default `vhds`
   Dns Name For Public IP | Provide a DNS name for the public IP; must be lowercase
   Admin User Name | Set a username the administrator account for the new VM
   Admin Password | Set an administrator password for the new VM
   OS Type | Leave as `Linux`
   VM Size | Size of the virtual machine instance (defaults to `Standard_B1s`)
   VM Name | Provide a name for the VM resource
   VHD URL | URL of the VHD Image we created above. This can be found on the blob details page. Navigate to: `storage account -> containers -> vhds -> VHD image blob name`

   It is a good idea to create a new resource group for the test VM. However the deployment will fail if the target storage account for the new VHD is not the same account hosting the source VHD image. Either:
   * use the account that was created in the previous steps of the lab (resulting in the new VM and its VHD being in different resource groups) or
   * create a resource group and storage account and copy the VHD image to the new storage account before creating the VM in the same resource group

   The first approach is simpler and adequate for the purposes of a test. Once finished testing you can delete the resource group and the new (specialised) VHD from the original storage account. Be careful not to delete the generalised VHD image.

6. To finalise the test:
   1. confirm that browsing to the IP address of the new VM displays the NGINX welcome page
   2. ssh into the new VM and confirm the presence of a `/tmp/users.txt` file with a creation time matching the last reboot

## Run validations on the virtual machine

1. Prior to submitting for certification, you should run a set of validation tests against a VM created from the VHD image. We can use the VM we created in the previous step.
2. There are two ways to do this:
   1. Use the *Certification Test Tool for Azure Certified*

      This is a Windows application that walks through the process of connecting to the VM, running a series of tests and producing a report. You can create a small Windows VM in Azure and install it on that to test. We will use this approach for the lab.
   2. Use the *Self-Test API*

      This is an API hosted in Azure. You send a POST request to the API with details of the machine to test and it returns a test report. You need to create an AAD app registration to authenticate with the API. You can [find more details here](https://docs.microsoft.com/en-us/azure/marketplace/azure-vm-image-test#how-to-use-powershell-to-consume-the-self-test-api). There is an excellent [walkthrough video here](https://arsenvlad.medium.com/using-self-test-api-to-validate-vm-images-for-publishing-in-azure-marketplace-e7ac2e0b4d6e) which also bridges some of the gaps in the documentation.

3. Install the Certification Test Tool for Azure Certified on a Windows Machine. [Download Link](https://www.microsoft.com/en-us/download/details.aspx?id=44299)
4. Run the Certification Test Tool and enter the required information (test name, platform, auth type, DNS name for the VM to be tested etc)
5. On completion you will be presented with a set of test results. Review the results and ensure you take any necessary action before submitting a final image for certification.

   ![The VM test tool results](/marketplace/images/vm-test-tool.png)

6. In this lab we will be submitting a VM offer to the marketplace but only to the preview stage for testing purposes. We will not submit for final certification.

   While attention should be paid to the results of the report, it is not necessarily required to fix every issue for the purposes of completing the lab.

## Generate a SAS URL to the VHD Image

The final thing to do is generate a SAS URL pointing to the generalised VHD image. We need to supply this as part of the technical configuration when we create our VM offer.

1. We need to collect two parameters before we can generate the SAS signature. For convenience we'll store them in environment variables.

   Parameter | Comment
      --- | ---
      \<connection-string> | The connection string for the storage account where the VHD generalised image is stored. Navigate to the storage account and select `Access Keys` under `Settings`
      \<vhd-name> | Name of the VHD image itself. Navigate to the storage account then to `Containers` then `vhds` and copy the name of the **generalised VHD blob**

2. Set environment variables using Azure CLI

   Modify the command below by substituting the parameter values you gathered above and submit via the Azure CLI:

   ```bash
   CONNSTR='<connection-string>'
   VHDNAME='<vhd-name>'
   ```

3. Firstly we need the blob endpoint URL:

   ```bash
   BASEURL=$(az storage blob url \
      --container-name 'vhds' \
      --name $VHDNAME \
      --connection-string $CONNSTR \
      --output 'tsv')
   ```

4. Then we need the SAS signature **at the container level**:

   ```bash
   START=$(date --date="yesterday" '+%Y-%m-%dT%H:%MZ')
   EXPIRY=$(date --date="1 month" '+%Y-%m-%dT%H:%MZ')

   SASSIG=$(az storage container generate-sas \
      --connection-string $CONNSTR \
      --name 'vhds' \
      --permissions 'rl' \
      --start $START \
      --expiry $EXPIRY \
      --output 'tsv')
   ```

5. Finally, combine the two results to get the full SAS URL:

   ```bash
   echo ${BASEURL}?${SASSIG}
   ```

   Example output

   ```text
   https://vhdstorage732682030108cd.blob.core.windows.net/vhds/osdisk_7326820301.vhd?st=2020-12-22T15%3A29Z&se=2021-01-23T15%3A29Z&sp=rl&sv=2018-11-09&sr=c&sig=V0OzA60J1JsknDnE7u6XtU0nk/icOV%2BmGqNigFmo9CI%3D
   ```

   Copy the output somewhere safe. You will need the SAS URL to publish the offer.

## Useful Links <!-- omit in toc -->

* [How to create a virtual machine using an approved base](https://docs.microsoft.com/en-us/azure/marketplace/azure-vm-create-using-approved-base)
* [Test a virtual machine image](https://docs.microsoft.com/en-us/azure/marketplace/azure-vm-image-test)
* [How to generate a SAS URI for a VM image](https://docs.microsoft.com/en-us/azure/marketplace/azure-vm-get-sas-uri)

## Next <!-- omit in toc -->

You have the option to choose the  appropriate offer type

* [Publishing an Azure Application Solution Template Offer](../solutiontemplate/)

## Back <!-- omit in toc -->

* [Selecting your Offer Type](../offertype/)