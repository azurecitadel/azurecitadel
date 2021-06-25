---
title: "Package Assets"
author: [ "Mike Ormond" ]
description: "Create a deployment package for an Azure Application offer."
date: 2021-06-25
weight: 50
menu:
  side:
    parent: marketplace-aama-offer
    identifier: marketplace-aama-offer-package
series:
 - marketplace-aama    
---

## Introduction

In order to submit your Azure Application to the commercial marketplace, you must create a [deployment package](https://docs.microsoft.com/en-gb/azure/marketplace/plan-azure-app-solution-template#deployment-package) that is uploaded to Partner Center as part of the offer submission.

The deployment package must contain the following two files in the root folder:

* `mainTemplate.json`
* `createUiDefinition.json`

Additional artefacts, eg scripts, can also be included in the deployment package. For more details see [Deployment Artifacts (Nested Templates, Scripts)](https://github.com/Azure/azure-quickstart-templates/blob/master/1-CONTRIBUTION-GUIDE/best-practices.md#deployment-artifacts-nested-templates-scripts)

## Create deployment package

1. Gather both the `mainTemplate.json` and `createUiDefinition.json` files into the same folder
1. Using a suitable zip utility (WinZip, 7-Zip etc), combine both files into a single zip archive

## Resources

* [Deployment package](https://docs.microsoft.com/en-gb/azure/marketplace/plan-azure-app-solution-template#deployment-package)
* [Deployment Artifacts (Nested Templates, Scripts)](https://github.com/Azure/azure-quickstart-templates/blob/master/1-CONTRIBUTION-GUIDE/best-practices.md#deployment-artifacts-nested-templates-scripts)

---
