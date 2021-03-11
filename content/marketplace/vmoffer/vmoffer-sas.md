---
title: "VM Offer with SAS"
author: [ "Mike Ormond" ]
description: "Use Shared Access Signature to Publish"
date: 2021-01-06
weight: 50
nonav: true
menu:
  side:
    parent: 'amp-vm-offer'
series:
 - 'amp-vm-offer'
---

## Introduction

If using the SAS Token approach, you will have created an unmanaged disk in a storage account which can be accessed directly with a SAS URL. The SAS URL comprised a URI to the resource along with a security token (Shared Access Signature) that authorizes access to the resource. It specifies the resource that a client may access, the permissions granted, and the time interval over which the signature is valid.

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

## Resources

* [How to generate a SAS URI for a VM image](https://docs.microsoft.com/azure/marketplace/azure-vm-get-sas-uri)
* [Create a service SAS](https://docs.microsoft.com/rest/api/storageservices/create-service-sas)

## Next

[Publish offer in Partner Center](../vmpublish)
