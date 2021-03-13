---
title: "Test VM Image"
author: [ "Mike Ormond" ]
description: "Test the VM image before publishing."
date: 2021-01-06
weight: 30
nonav: true
menu:
  side:
    parent: marketplace-vm-offer
    identifier: marketplace-vm-offer-test
---

## Introduction

It is important that we test the image we've created before publishing. Otherwise the image may fail certification checks or simply not function as desired.

## Test we can create a VM from the virtual machine image

The first and simplest test is to confirm that we can create a new VM instance based on the work we did in the last lab.

{{< details "Use Shared Image Gallery approach" >}}

1. Make sure the VM is deallocated

   ```bash
   az vm deallocate \
      --resource-group 'marketplace-vm-offer' \
      --name 'marketplacevm'
   ```

1. Set the status of the VM to "Generalized"

   ```bash
   az vm generalize \
      --resource-group 'marketplace-vm-offer' \
      --name 'marketplacevm'
   ```

1. Create an image of the VM

   ```bash
   az image create \
      --resource-group 'marketplace-vm-offer' \
      --source 'marketplacevm' \
      --name 'marketplacevm-image'
   ```

   Example output

   ```json
      {
         "extendedLocation": null,
         "hyperVGeneration": "V1",
         "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/marketplace-vm-offer/providers/Microsoft.Compute/images/marketplacevm-image",
         "location": "westeurope",
         "name": "marketplacevm-image1",
         "provisioningState": "Succeeded",
         "resourceGroup": "marketplace-vm-offer",
         "sourceVirtualMachine": {
            "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/marketplace-vm-offer/providers/Microsoft.Compute/virtualMachines/marketplacevm",
            "resourceGroup": "marketplace-vm-offer"
         },
         "storageProfile": {
            "dataDisks": [],
            "osDisk": {
               ...
               ...
               ...
         }
   ```

1. Take a note of the "id" from the output. You will use it in the next step.

1. Now create a new resource group and create a new VM from the image we just created

   ```bash
   az group create --name 'marketplace-vm-offer-test' --location 'westeurope'
   ```

   Use the "id" as the ```--image``` parameter

   ```bash
   az vm create \
      --resource-group 'marketplace-vm-offer-test' \
      --name 'marketplacevm-test-vm' \
      --image '/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/marketplace-vm-offer/providers/Microsoft.Compute/images/marketplacevm-image' \
      --admin-username azureuser \
      --ssh-key-value ~/.ssh/id_rsa.pub

   ```

{{< /details >}}

{{< details "Use SAS URI approach" >}}

The following is based on the instructions [Test a virtual machine image](https://docs.microsoft.com/en-us/azure/marketplace/azure-vm-image-test) but with some modifications as I have found the provided script not to work for Linux images.

1. Sign in to the Azure portal.
1. On the home page, select Create a resource, search for “Template Deployment”, and select Create.
1. Choose "Build your own template in the editor".

   ![Create VM from ARM Template](/marketplace/images/create-from-template.png)

1. Replace the contents of the editor with the JSON from [this file](scripts/deploy-user-provided-image.json) and hit **Save**
1. You will need to provide parameter values for the following

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
   * use the storage account that was created in the previous steps of the lab (resulting in the new VM and its VHD being in different resource groups) or
   * create a resource group and storage account and copy the VHD image to the new storage account before creating the VM in the same resource group

   The first approach is simpler and adequate for the purposes of a test. Once finished testing you can delete the resource group and the new (specialised) VHD from the original storage account. Be careful not to delete the generalised VHD image.

{{< /details >}}

To finalise the test:

 1. Confirm that browsing to the IP address of the new VM displays the NGINX welcome page - NOTE you *may* need to add a rule on the NSG to allow incoming traffic on Port 80.
 2. SSH into the new VM and confirm the presence of a `/tmp/users.txt` file with a creation time matching the last reboot

## Run validations on the virtual machine

1. Prior to submitting a VM Offer for certification (publishing), you should run a set of validation tests against a specialised VM created from the generalised VM image. This can identity early issues that would otherwise result in a certification failure.

   We can use the VM we created in the previous step.

1. There are two ways to do this:
   1. Use the *Certification Test Tool for Azure Certified*

      This is a Windows application that walks through the process of connecting to the VM, running a series of tests and producing a report. You can create a small Windows VM in Azure and install it on that to test. We will use this approach for the lab.
   2. Use the *Self-Test API*

      This is an API hosted in Azure. You send a POST request to the API with details of the machine to test and it returns a test report. You need to create an AAD app registration to authenticate with the API. You can [find more details here](https://docs.microsoft.com/azure/marketplace/azure-vm-image-test#how-to-use-powershell-to-consume-the-self-test-api). There is an excellent [walkthrough video here](https://arsenvlad.medium.com/using-self-test-api-to-validate-vm-images-for-publishing-in-azure-marketplace-e7ac2e0b4d6e) which also bridges some of the gaps in the documentation.

1. Install the Certification Test Tool for Azure Certified on a Windows Machine. [Download Link](https://www.microsoft.com/download/details.aspx?id=44299)
1. Run the Certification Test Tool and enter the required information (test name, platform, auth type, DNS name for the VM to be tested etc)
1. On completion you will be presented with a set of test results. Review the results and ensure you take any necessary action before submitting a final image for certification.

   ![The VM test tool results](/marketplace/images/vm-test-tool.png)

1. In these labs we will be submitting a VM offer to the marketplace but only to the preview stage for testing purposes. We will not submit for final certification.

   While attention should be paid to the results of the report, it is not necessarily required to fix every issue for the purposes of completing the lab.

## Resources

* [Test a virtual machine image](https://docs.microsoft.com/azure/marketplace/azure-vm-image-test)
* [Create a managed image of a generalized VM in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/capture-image-resource)
* [Create an image from a VM](https://docs.microsoft.com/azure/virtual-machines/image-version-vm-powershell)

---

{{< raw >}}
  <nav class="paginate-container" aria-label="Pagination">
    <div class="pagination">
      <a class="previous_page" rel="next" href="../vmoffer-vm" aria-label="Previous Page">Create VM Image</a>
      <!-- <span class="previous_page" aria-disabled="true">Previous</span> -->
      <a class="text-gray-light" href="." aria-label="Top">Test VM Image</a>
      <a class="next_page" rel="next" href="../vmoffer-sig" aria-label="Next Page">VM Offer with SIG</a>
      <a class="next_page" rel="next" href="../vmoffer-sas" aria-label="Next Page">VM Offer with SAS</a>
      <!-- <span class="next_page" aria-disabled="true">Next</span> -->
    </div>
  </nav>
{{< /raw >}}
