---
title: "Create UI Definition"
author: [ "Mike Ormond" ]
description: "Create and test a UI definition file."
date: 2021-06-25
weight: 40
menu:
  side:
    parent: marketplace-aama-offer
    identifier: marketplace-aama-offer-ui
series:
 - marketplace-aama    
---

## Introduction

When a user deploys your Azure Application via the portal, they will walk through the creation experience. As part of the process, the user will be asked to provide a number of parameters related to the deployment (eg the target subscription, resource group, location).

It is possible for publishers to modify and extend the core application creation experience through a file called **[createUiDefinition.json](https://docs.microsoft.com/azure/azure-resource-manager/managed-applications/create-uidefinition-overview)**. This file must be included as part of every Azure Application offer. The Azure portal uses it to define the user interface when creating an Azure application.

## Create a createUiDefinition.json file

1. We will create a very simple `createUiDefinition.json` file to demonstrate the principles

1. The basic structure of a `createUiDefinition.json` file is as follows:

  ```json
  {
      "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
      "handler": "Microsoft.Azure.CreateUIDef",
      "version": "0.1.2-preview",
      "parameters": {
          "config": {
              "isWizard": false,
              "basics": {}
          },
          "basics": [],
          "steps": [],
          "outputs": {},
          "resourceTypes": []
      }
  }
  ```

## Add an additional parameter

1. Additional parameters are added to the `basics` element after `config`
1. Add a `websiteName` parameter and some constraints
1. Note the `outputs` property which which is used to map elements from `basics` to the parameters defined in the ARM template
1. In this case we map the `websiteName` field in our UI to a template parameter called `siteName`
1. See modified file below:

  ```json
  {
      "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
      "handler": "Microsoft.Azure.CreateUIDef",
      "version": "0.1.2-preview",
      "parameters": {
          "config": {
              "isWizard": false,
              "basics": {}
          },
          "basics": [
              {
                  "name": "websiteName",
                  "type": "Microsoft.Common.TextBox",
                  "label": "Website Name",
                  "constraints": {
                      "required": true,
                      "validations": [
                          {
                              "regex": "^[a-z0-9A-Z]{5,25}$",
                              "message": "Between 5-25 alphanumeric characters are allowed."
                          }
                      ]
                  },
                  "visible": true
              }
          ],
          "steps": [],
          "outputs": {
              "websiteName": "[basics('siteName')]"
          },
          "resourceTypes": []
      }
  }
  ```

## Override the core application creation experience

1. Overrides are done within the `config` element
1. Add a customised `description`
1. Force the creation of a new `resource group`
1. Change the `location` label (just for kicks) and constrain the allowed values
1. See modified file below:

```json
  {
      "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
      "handler": "Microsoft.Azure.CreateUIDef",
      "version": "0.1.2-preview",
      "parameters": {
          "config": {
              "isWizard": false,
              "basics": {
                  "description": "You can enter a customised description of your solution with **markdown** support.",
                  "resourceGroup": {
                      "allowExisting": false
                  },
                  "location": {
                      "label": "Custom label for location",
                      "allowedValues": [
                          "westeurope",
                          "uksouth"
                      ],
                      "visible": true
                  }
              }
          },
          "basics": [
              {
                  "name": "websiteName",
                  "type": "Microsoft.Common.TextBox",
                  "label": "Website Name",
                  "constraints": {
                      "required": true,
                      "validations": [
                          {
                              "regex": "^[a-z0-9A-Z]{5,25}$",
                              "message": "Between 5-25 alphanumeric characters are allowed."
                          }
                      ]
                  },
                  "visible": true
              }
          ],
          "steps": [],
          "outputs": {
              "siteName": "[basics('websiteName')]"
          },
          "resourceTypes": []
      }
  }
  ```

## Save and test the createUiDefinition.json file in the sandbox

1. Save `createUiDefinition.json` in a suitable location
1. Open the [Create UI Definition Sandbox](https://portal.azure.com/?feature.customPortal=false&#blade/Microsoft_Azure_CreateUIDef/SandboxBlade)
1. Replace the empty definition with the contents of your `createUiDefinition.json` file
1. Select `Preview`
1. The form you created is displayed
1. Step through the user experience and fill in the values
1. Confirm that you can see the custom description, you cannot deploy to an existing resource group etc

## Resources

* [CreateUiDefinition.json for Azure managed application's create experience](https://docs.microsoft.com/azure/azure-resource-manager/managed-applications/create-uidefinition-overview)
* [Test your portal interface for Azure Managed Applications](https://docs.microsoft.com/en-gb/azure/azure-resource-manager/managed-applications/test-createuidefinition)
* [GitHub sample repo containing createUiDefinition.json files](https://github.com/Azure/azure-managedapp-samples/tree/master/Managed%20Application%20Sample%20Packages)

---
