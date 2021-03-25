---
title: "Getting Started"
author: [ "Mike Ormond" ]
description: "Pre-requisites and overview."
date: 2021-03-25
weight: 10
menu:
  side:
    parent: marketplace-aast-offer
    identifier: marketplace-aast-offer-getting-started
series:
 - marketplace-aast
---

## Prerequisites

* An Azure subscription (required) - see [here for free options](https://azure.microsoft.com/free/)
* [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli) (required) either via [Azure Cloud Shell in the Azure Portal](https://docs.microsoft.com/azure/cloud-shell/quickstart) or [installed locally](https://docs.microsoft.com/cli/azure/install-azure-cli)
* A [Partner Center account](../partnercenter/) with the appropriate permissions (some of the material can be completed without Partner Center access)

## Overview

In this lab we will create the technical assets required to publish an Azure application solution template offer to the commercial marketplace. The high level steps required to do this are as follows:

* Create an ARM template to describe the deployment
* Validate the ARM template against best-practices
* Create and test a UI definition file that describes parameters to be captured from the user
* Package the ARM template, UI definition etc for upload as part of the offer
* Publish the Offer through Partner Center

## Resources

* [Plan a solution template for an Azure application offer](https://docs.microsoft.com/azure/marketplace/plan-azure-app-solution-template)

---
