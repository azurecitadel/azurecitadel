---
title: "Create ARM Template"
author: [ "Mike Ormond" ]
description: "Create an ARM template for publishing to the commercial marketplace."
date: 2021-06-25
weight: 20
menu:
  side:
    parent: marketplace-aama-offer
    identifier: marketplace-aama-offer-create
series:
 - marketplace-aama
---

## Introduction

We will use a simple ARM template to demonstrate the principles. As described in [Azure Apps Offer](/marketplace/introduction/offertypes#azure-apps-offer) a solution template offer is not directly transactable in the commercial marketplace. It can however deploy transactable VM Offer(s). These offers can be hidden such that they can only be deployed by other offers (such as a solution template or managed application).

We will not follow this approach here but the principles are the same. Instead we will deploy a simple Azure function app.

## Review the ARM Template

The template we will deploy can be [found here](/marketplace/scripts/mainTemplate.json). Take some time to familiarise yourself with the template. It will deploy a Linux Azure Function App on the serverless / consumption plan. This requires three services to be deployed:

* a Storage account
* an App Service Plan
* the Function App itself.  

## Test the ARM Template

The first thing we will do is test that the ARM template works and deploys the services we expect. We can do this using the Azure portal or the CLI.

### Test using the Azure portal (Option 1)

1. Sign in to the Azure portal.
1. On the home page, select Create a resource, search for “Template Deployment”, and select Create.
1. Choose "Build your own template in the editor".

   ![Create VM from ARM Template](/marketplace/images/create-from-template.png)

1. Replace the contents of the editor with the JSON from the ARM template file and hit **Save**
1. Select the Subcription and Resource Group as required.
1. All the parameters in the template have default values - we can leave them as is.
1. Agree to the terms and conditions and hit "Purchase".
1. Navigate to the resource group and confirm the services deploy as expected.

### Test using the CLI (Option 2)

1. If you have cloned this repo, navigate to the folder containing the `mainTemplate.json` file. Something like `/azurecitadel/content/marketplace/scripts`.
1. Otherwise, create a file called mainTemplate.json and paste the contents of the [mainTemplate.json file](/marketplace/scripts/mainTemplate.json). Save the file.
1. Create a new resource group using the Azure CLI:

   ```bash
   RG='arm-template-test'
   LOC='westeurope'
   az group create --name "$RG"--location "$LOC"
   ```

   Example output

   ```json
      {
         "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/arm-template-test",
         "location": "westeurope",
         "managedBy": null,
         "name": "arm-template-test",
         "properties": {
            "provisioningState": "Succeeded"
         },
         "tags": null,
         "type": "Microsoft.Resources/resourceGroups"
      }
   ```

1. Deploy the ARM template

   ```bash
   az deployment group create \
      --name "test-deployment" \
      --resource-group "$RG" \
      --template-file "./mainTemplate.json"
   ```

   Example output

   ```json
      {
         "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/arm-template-test/providers/Microsoft.Resources/deployments/test-deployment",
         "location": null,
         "name": "test-deployment",
         "properties": {
            "correlationId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            "debugSetting": null,
            "dependencies": [
               {
               "dependsOn": [
                  {
                     "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/arm-template-test/providers/Microsoft.Web/serverfarms/hpn-arm-template-test",
                     "resourceGroup": "arm-template-test",
                     "resourceName": "hpn-arm-template-test",
                     "resourceType": "Microsoft.Web/serverfarms"
                  },
                  {
         ...
         ...
         ...
      }
   ```

1. Navigate to the resource group in the Azure portal and confirm the services deploy as expected.

## Resources

* [What are ARM Templates?](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview)

---
