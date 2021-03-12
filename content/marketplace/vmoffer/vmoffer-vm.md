---
title: "Create VM Image"
author: [ "Mike Ormond" ]
description: "Create and customise a VM image for publishing to Marketplace."
date: 2021-01-06
weight: 20
menu:
  side:
    parent: 'amp-vm-offer'
---

## Introduction

We will create a VM using an approved base image. However it is also possible to [create and deploy your own VM image](https://docs.microsoft.com/azure/marketplace/azure-vm-create-using-own-image). Starting from an approved base image simplifies the process.

There are numerous way we could create the VHD. In this lab we will use the Azure CLI. [Packer is a useful tool](https://azurecitadel.com/automation/packeransible/lab1/) for helping to automate the process.

## How to make the VM available for upload to Partner Center

Until recently, the only option was to create an unmanaged VHD and generate a SAS token to grant access to the VHD to Partner Center. This SAS token is provided as part of the technical requirements of the offer listing in Partner Center.

The preferred option now is to use a **Shared Image Gallery** to make the VM image available. Again the Image details are entered as part of the technical requirements of the offer listing in Partner Center.

Most of the process for creating the VM is the same - expand the relevant section.

> Note: Unless there is a specific reason to use the SAS Token approach, **the Shared Image Gallery is recommended.**

## Create a VM using the Azure CLI

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

   We will create an Ubuntu VM using a small machine size to minimise costs.  Generating ssh keys gives us a simple, secure way to connect to the VM.

{{< details "Use Shared Image Gallery approach" >}}

   Create a new VM using the Azure CLI:

   ```bash
   az vm create \
      --resource-group 'marketplace-vm-offer' \
      --name 'marketplacevm' \
      --image 'Canonical:UbuntuServer:18.04-LTS:latest' \
      --admin-username 'azureuser' \
      --generate-ssh-keys \
      --size 'Standard_B1s' \
   ```

{{< /details >}}

{{< details "Use SAS Token approach" >}}

   It is important to create a VM using unmanaged disks as the base. This gives us direct access to the VHD which we will need to copy at a later stage.

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

{{< /details >}}

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

When you publish a VM offer to the Azure Marketplace, you are required to maintain a high-level of security. Before publishing an offer you should follow the guidance in [Security Recommendations for Azure Marketplace Images](https://docs.microsoft.com/azure/security/fundamentals/azure-marketplace-images)

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

We now have a generalised OS VHD for our Ubuntu-based VM offer with a web server installed and a scheduled job on reboot. We can use this to create new (specialised) VMs and to submit our VM base to Partner Center as a VM Offer.

## Resources

* [How to create a virtual machine using an approved base](https://docs.microsoft.com/azure/marketplace/azure-vm-create-using-approved-base)

---

{{< raw >}}
  <nav class="paginate-container" aria-label="Pagination">
    <div class="pagination">
      <a class="previous_page" rel="next" href="../overview" aria-label="Previous Page">Getting Started</a>
      <!-- <span class="previous_page" aria-disabled="true">Previous</span> -->
      <a class="text-gray-light" href="." aria-label="Top">Create VM Image</a>
      <a class="next_page" rel="next" href="../vmoffer-test" aria-label="Next Page">Test VM Image</a>
      <!-- <span class="next_page" aria-disabled="true">Next</span> -->
    </div>
  </nav>
{{< /raw >}}
