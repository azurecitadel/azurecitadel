---
title: "Getting Started"
author: [ "Mike Ormond" ]
description: "Pre-requisites and overview."
date: 2021-01-06
weight: 10
series:
  - marketplace-vm-offer
menu:
  side:
    parent: marketplace-vm-offer
    identifier: marketplace-vm-offer-getting-started
---

## Prerequisites

* An Azure subscription (required) - see [here for free options](https://azure.microsoft.com/free/)
* [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli) (required) either via [Azure Cloud Shell in the Azure Portal](https://docs.microsoft.com/azure/cloud-shell/quickstart) or [installed locally](https://docs.microsoft.com/cli/azure/install-azure-cli)
* A [Partner Center account](../../partnercenter/) with the appropriate permissions (some of the material can be completed without Partner Center access)

## Overview

In this lab we will create the technical assets required to publish a VM offer to the commercial marketplace. The high level steps required to do this are as follows:

* Create a VM to use as a base
* Ensure the VM has latest updates applied
* Perform additional security checks
* Apply custom configuration and scheduled tasks as required
* Generalise the image
* Test the virtual machine image
* Run validations on the virtual machine
* Either
  * Publish the generalised VM to a shared image gallery (preferred)
  * Generate a SAS URL to the VHD Image
* Publish the Offer through Partner Center

## Resources

* [How to plan a virtual machine offer](https://docs.microsoft.com/azure/marketplace/marketplace-virtual-machines)
