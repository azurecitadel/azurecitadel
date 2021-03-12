---
title: "Publish Offer"
author: [ "Mike Ormond" ]
description: "Create the listing in Partner Center and publish the offer."
date: 2021-01-06
weight: 60
nonav: true
menu:
  side:
    parent: 'amp-vm-offer'
---

## Introduction

Now that we have the "technical assets" prepared for our offer, we can proceed to publish via Partner Center. This involves a number of steps including configuring the offer, setting up the listing details and assets and configuring plans, all done through Partner Center.

## Create a New Offer

1. Login to [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace/overview) and navigate to: Commercial Marketplace -> Overview

1. At the top of the screen, Select: New Offer -> Azure Virtual Machine

   ![Create a new offer in Partner Center](/marketplace/images/partnercenter-new-offer.png)

1. Enter an ```Offer ID``` and ```Offer alias```. The ```Offer ID``` must be unique within your account. The ```Offer alias``` is a friendly name for use within Partner Center.

   > You may want to create an ```Offer alias``` something like "TEST_OFFER_DO_NOT_PUBLISH_xxxxxxx" to guard against the offer being inadvertently published by another user or in the future.

## Offer Setup

Here we enter fundamental details about the offer and can connect a destination for Customer leads generated through the marketplace. For the purposes of the lab, complete as follows:

1. Alias
    1. Leave per above
1. Test drive
    1. Leave unchecked
1. Customer leads
    1. Leave as "No CRM System connected'

## Properties

Here we define the relevant categories the offer should appear in the marketplace and the legal terms. For the purposes of the lab, complete as follows:

1. Categories
    1. Select a ```Primary category``` and ```Subcategory``` eg Media / Media Services
1. Legal
    1. Check the ```Use the Standard Contract...``` checkbox

   > Be sure to **Save draft** before exiting the page

## Offer listing

Here we define how the offer will appear in the marketplace - the offer listing itself and relevant metadata. For the purposes of the lab, complete as follows:

1. Marketplace details
    1. Enter some text in each of the ```Name```, ```Search results summary```, ```Short description``` and ```Description``` fields
    1. For the ```Privacy policy link``` enter any valid URL
1. Useful links
    1. Leave any non-required fields blank
    1. Complete the require fields with name, email and phone
1. Marketplace media
    1. Only the Large logo is required
    1. You can use your own image or the [image here](../../images/logo.png)

   > Be sure to **Save draft** before exiting the page

## Preview audience

A preview audience is able to browse and acquire an offer before it is published in the marketplace. This is intended as a testing mechanism and to provide a limited audience with a preview of the offer. The offer does not go through full certification so it is possible to review and test with the inherent delay that involves. It will take a few hours for a preview to become available as opposed to a few days for a full publish and certification cycle.

As we will not be going through the full publish process it is important a Preview audience is specified otherwise we will not be able to test our efforts. For the purposes of the lab, complete as follows:

1. Enter your Azure Subscription ID in the ```Azure Subscription ID``` field and a suitable description in the ```Description``` field
1. You can add multiple subscription IDs but for the lab one will be sufficient

   > Be sure to **Save draft** before exiting the page

## Plan overview

At least one plan is required for every offer. You can think of the offer as a container for plans which detail the

1. Select ```Create new plan``` (at the top of the page)
1. Enter a ```Plan ID``` and ```Plan name``` and select ```Create```
1. You will enter a series of pages to define the individual plan

### Plan setup

This is the "high-level configuration" for the plan. For the purposes of the lab, complete as follows:

1. ```Reuse technical configuration``` - leave unchecked
1. ```Azure regions``` - leave as ```Azure Global``` checked and ```Azure Government``` unchecked

### Plan listing

This is the marketplace listing for the plan. eg we might have a bronze, silver, gold plan or "5 users", "25 users" etc. The share the same offer but may provide different capabilities or licence conditions. For the purposes of the lab, complete as follows:

1. ```Plan name``` should be pre-populated. Leave as is.
1. Enter some short text for ```Plan summary``` and ```Plan description```

   > Be sure to **Save draft** before exiting the page

### Pricing and availability

Here we describe which markets we want to make the offer available and the pricing model and price point. For the purposes of the lab, complete as follows:

1. ```Markets``` should be pre-populated for all markets except China which has some specific restrictions. Leave it as is.
1. ```Pricing``` - leave the radio buttons as default and enter 0 for the ```Price per core```
1. ```Free Trial``` - leave as "No Trial"
1. ```Plan visibility``` - leave as "Public"
1. ```Hide plan``` - leave unchecked

   > Be sure to **Save draft** before exiting the page

### Technical configuration

This is what all the work in the previous sections was leading up to. This is where we reference the assets we've created and provide the VM image to the marketplace. For the purposes of the lab, complete as follows:

1. ```Operating system``` - change the family to "Linux"
1. ```Vendor``` - change to "Ubuntu"
1. ```OS friendly name``` - change to Ubuntu
1. ```Recommended VM Sizes``` - for a real offer we could recommend optimal VM sizes for our offer. There's no need to complete this for the lab.
1. ```Open ports``` - add port 80 as follows

   ![Open http port](../../images/partnercenter-open-ports.png)

1. ```Properties``` - leave ```Supports accelerated networking``` unchecked
1. ```Generations``` - leave ```Generation type``` as "Generation 1"
1. ```VM Images``` - set the ```Disk version``` to "1.0.0"
1. ```Select a method to provide your VM image``` - select the method you followed in the lab, "Shared Image Gallery" or "SAS URI"

{{< details "Use Shared Image Gallery approach" >}}

1. Click on ```Select shared image```
1. A flyout will appear displaying the Shared Image Galleries you have access to
1. Expand the ```marketplace_sig``` gallery
1. Select the image we created earlier in the lab. It should be identified as version 1.0.0.

{{< /details >}}

{{< details "Use SAS URI approach" >}}

1. Paste in the SAS URL you saved at the end of the "VM Offer with SAS" step of the lab.

{{< /details >}}

   > Be sure to **Save draft** before exiting the page
   >
   > Click on ```Plan overview``` at the top of the page to revert to the offer pages

## Co-sell with Microsoft

You are not required to enter anything on the Co-sell tab for the purposed of this lab.

## Resell through CSPs

1. Select "No partners in the CSP program"

   > Be sure to **Save draft** before exiting the page

## Review and Publish

We are now ready to review and publish (to a preview audience) the offer we have created.

1. Select "Review and publish" at the top of the page. You should see a summary like the below:

   ![Publish summary screenshot](../../images/partnercenter-publish-summary.png)

1. If any of the sections are not marked as "Complete", go back and review.
1. Select "Publish" at the top of the page.
1. This will start the publish process. It will take a few hours before the preview becomes available.

   ![Publish status screenshot](../../images/partnercenter-publish-status.png)

1. Note the "Publisher signoff" stage in the process. This is a manual step where the publisher must confirm approval before the offer is fully published in the marketplace.

   > You will not do this for a test offer such as the one we are creating in this lab.

1. Check back after a few hours. Preview links should be created for Azure Marketplace and the Azure Portal.
1. Use the preview links to deploy your VM Offer into your subscription.
1. You should be able to perform the following tests that we completed previously:
   1. Confirm that browsing to the IP address of the new VM displays the NGINX welcome page - NOTE you may need to add a rule on the NSG to allow incoming traffic on Port 80.
   1. SSH into the new VM and confirm the presence of a /tmp/users.txt file with a creation time matching the last reboot.

## Cleanup Resources

1. Once completed, you can cleanup resources by deleting the two Resource Groups created during the lab
   1. ```marketplace-vm-offer```
   1. ```marketplace-vm-offer-test```

## Resources

* [How to plan a virtual machine offer](https://docs.microsoft.com/en-gb/azure/marketplace/marketplace-virtual-machines)
* [How to create a virtual machine offer on Azure Marketplace](https://docs.microsoft.com/en-gb/azure/marketplace/azure-vm-create)

---

{{< raw >}}
  <nav class="paginate-container" aria-label="Pagination">
    <div class="pagination">
      <a class="previous_page" rel="next" href="../vmoffer-sig" aria-label="Previous Page">VM Offer with SIG</a>
      <a class="previous_page" rel="next" href="../vmoffer-sas" aria-label="Previous Page">VM Offer with SAS</a>
      <!-- <span class="previous_page" aria-disabled="true">Previous</span> -->
      <a class="text-gray-light" href="." aria-label="Top">Publish Offer</a>
      <span class="next_page" aria-disabled="true">Next</span>
    </div>
  </nav>
{{< /raw >}}
