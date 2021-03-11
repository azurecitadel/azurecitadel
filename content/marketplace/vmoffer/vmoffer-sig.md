---
title: "VM Offer with SIG"
author: [ "Mike Ormond" ]
description: "Use Shared Image Gallery to Publish"
date: 2021-01-06
weight: 40
nonav: true
menu:
  side:
    parent: 'amp-vm-offer'
series:
 - 'amp-vm-offer'
---

## Introduction

If using the Shared Image Gallery approach, you will have created a managed VM Image of your generalised VM. In order to make this available to Partner Center as part of the publishing process, it needs to be published to a Shared Image Gallery.

## Create a Shared Image Gallery

1. Create a Shared Image Gallery using the Azure CLI

   ```bash
   az sig create \
     --resource-group 'marketplace-vm-offer' \
     --gallery-name 'marketplace_sig'
   ```

   Example output

   ```json
      {
        "description": null,
        "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/marketplace-vm-offer/providers/Microsoft.Compute/galleries/marketplace_sig",
        "identifier": {
          "uniqueName": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-MARKETPLACE_SIG"
          },
        "location": "westeurope",
        "name": "marketplace_sig",
        "provisioningState": "Succeeded",
        "resourceGroup": "marketplace-vm-offer",
        "tags": {},
        "type": "Microsoft.Compute/galleries"
      }
   ```

1. Next we need to create an "image definition" in the gallery as a container for our image

    ```bash
    az sig image-definition create \
      --resource-group 'marketplace-vm-offer' \
      --gallery-name 'marketplace_sig' \
      --gallery-image-definition 'marketplace-definition' \
      --publisher 'contoso' \
      --offer 'offer1' \
      --sku 'standard' \
      --os-type Linux \
      --os-state generalized
    ```

1. Then we need an image version in the gallery to fully describe our image

    For this you will need the resource ID of the managed image

    ```bash
    az image list --query "[].[name, id]" -o tsv
    ```

    Substitute the resource ID for the ```--managed-image``` parameter

    ```bash
    az sig image-version create \
      --resource-group 'marketplace-vm-offer' \
      --gallery-name 'marketplace_sig' \
      --gallery-image-definition 'marketplace-definition' \
      --gallery-image-version '1.0.0' \
      --target-regions 'westeurope' \
      --managed-image '/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MARKETPLACE-VM-OFFER/providers/Microsoft.Compute/images/marketplacevm-image'
    ```

   Example output

   ```json
      {
        "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/marketplace-vm-offer/providers/Microsoft.Compute/galleries/marketplace_sig/images/marketplace-definition/versions/1.0.0",
        "location": "westeurope",
        "name": "1.0.0",
        "provisioningState": "Succeeded",
        "publishingProfile": {
          "endOfLifeDate": null,
          "excludeFromLatest": false,
          "publishedDate": "2021-03-11T16:34:24.259473+00:00",
          "replicaCount": 1,
          "storageAccountType": "Standard_LRS",
          "targetRegions": [
            {
              "encryption": null,
              "name": "West Europe",
              "regionalReplicaCount": 1,
              "storageAccountType": "Standard_LRS"
            }
          ]
        },
        "replicationStatus": null,
        ...
        ...
        ...
      }
   ```

1. Now the imaged is available in a Shared Image Gallery we can reference it in our offer plan in Partner Center when we publish.

## Resources

* [Shared Image Galleries overview](https://docs.microsoft.com/azure/virtual-machines/shared-image-galleries)

## Next

[Publish offer in Partner Center](../vmpublish)
