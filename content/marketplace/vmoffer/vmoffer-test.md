---
title: "Test VM Image"
author: [ "Mike Ormond" ]
description: "Test the VM image before publishing."
date: 2021-01-06
weight: 30
menu:
  side:
    parent: 'Publish a VM Offer'
series:
 - 'vm-offer'
---

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