---
title: "Publish Offer"
author: [ "Mike Ormond" ]
description: "Create the listing in Partner Center and publish the offer."
date: 2021-06-25
weight: 60
menu:
  side:
    parent: marketplace-aama-offer
    identifier: marketplace-aama-offer-publish
series:
 - marketplace-aama    
---

## Introduction

Now that we have the "technical assets" prepared for our offer, we can proceed to publish via Partner Center. This involves a number of steps including configuring the offer, setting up the listing details and assets and configuring plans, all done through Partner Center.

## Create a New Offer

1. Login to [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace/overview) and navigate to: Commercial Marketplace -> Overview

1. At the top of the screen, Select: New Offer -> Azure Application

   ![Create a new offer in Partner Center](/marketplace/_images/partnercenter-new-offer.png)

1. Enter an `Offer ID` and `Offer alias`. The `Offer ID` must be unique within your account. The `Offer alias` is a friendly name for use within Partner Center.

   > You may want to create an `Offer alias` something like "TEST_OFFER_DO_NOT_PUBLISH_xxxxxxx" to guard against the offer being inadvertently published by another user or in the future.

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
    1. Add a `Primary category` and `Subcategory` eg Media / Media Services
1. Legal
    1. Check the `Use the Standard Contract...` checkbox

        > Be sure to **Save draft** before exiting the page

## Offer listing

Here we define how the offer will appear in the marketplace - the offer listing itself and relevant metadata. For the purposes of the lab, complete as follows:

1. Marketplace details
    1. Enter some text in each of the `Name`, `Search results summary`, `Short description` and `Description` fields
    1. For the `Privacy policy link` enter any valid URL
1. Product information links
    1. Leave any non-required fields blank
    1. Complete the required fields with name, email and phone
1. Marketplace media
    1. Only the Large logo is required
    1. You can use your own image or the [image here](../../_images/logo-ma.png)

        > Be sure to **Save draft** before exiting the page

## Preview audience

A preview audience is able to browse and acquire an offer before it is published in the marketplace. This is intended as a testing mechanism and to provide a limited audience with a preview of the offer. The offer does not go through full certification so it is possible to review and test with the inherent delay that involves. It will take a few hours for a preview to become available as opposed to a few days for a full publish and certification cycle.

As we will not be going through the full publish process it is important a Preview audience is specified otherwise we will not be able to test our efforts. For the purposes of the lab, complete as follows:

1. Enter your Azure Subscription ID in the `Azure Subscription ID` field and a suitable description in the `Description` field
1. You can add multiple subscription IDs but for the lab one will be sufficient

   > Be sure to **Save draft** before exiting the page

## Technical Configuration

1. This section can be skipped. It is only required to authenticate solutions using metered billing where the deployed solution is not the source of events being reported to the metered billing API.

## Plan overview

At least one plan is required for every offer. You can think of the offer as a container for plans which detail the

1. Select `Create new plan` (at the top of the page)
1. Enter a `Plan ID` and `Plan name` and select `Create`
1. You will enter a series of pages to define the individual plan

### Plan setup

This is the "high-level configuration" for the plan. For the purposes of the lab, complete as follows:

1. `Plan type` - select `Managed application`
1. `Azure regions` - leave as `Azure Global` checked and `Azure Government` unchecked

   > Be sure to **Save draft** before exiting the page

### Plan listing

This is the marketplace listing for the plan. eg we might have a bronze, silver, gold plan or "5 users", "25 users" etc. They share the same offer but may provide different capabilities or licence conditions. For the purposes of the lab, complete as follows:

1. `Plan name` should be pre-populated. Leave as is.
1. Enter some short text for `Plan summary` and `Plan description`

   > Be sure to **Save draft** before exiting the page

### Pricing and Availability

Here we describe which markets we want to make the offer available and the pricing model and price point. For the purposes of the lab, complete as follows:

1. `Markets` - select `Edit markets` and add your own market (eg UK) and any other regions you choose
1. `Pricing` - we will set a flat rate price of $0 per month. Enter 0 in the `Price` field
   1. It is useful to create $0 plans for testing as it is in effect a transactable offer but there is no risk of being  billed if we forget to cancel a purchase
   1. We could enter metering dimensions at this stage for custom billing but we will keep things simple for now
1. `Plan visibility` - leave as "Public"

   > Be sure to **Save draft** before exiting the page

### Technical configuration

This is what all the work in the previous sections was leading up to. This is where we reference the assets we've created and provide the deployment package to the marketplace. For the purposes of the lab, complete as follows:

1. `Reuse technical configuration` - leave unchecked
1. `Version` - enter 1.0.0
1. Note the [Customer usage attribution ID](https://docs.microsoft.com/en-gb/azure/marketplace/azure-partner-customer-usage-attribution#commercial-marketplace-azure-apps)
1. Upload your deployment package zip file. It will take a few moments to be ingested
1. `Enable just-in-time (JIT) access` - leave unchecked
   1. [JIT access](https://docs.microsoft.com/en-gb/azure/marketplace/plan-azure-app-managed-app#just-in-time-jit-access) allows the customer to control publisher access to the deployed solution
1. `Deployment mode` - leave as `Complete`
1. `Notification Endpoint URL` - leave blank
   1. It is possible to provide a [webhook endpoint](https://docs.microsoft.com/en-gb/azure/marketplace/plan-azure-app-managed-app#notification-endpoint-url) to get notifications of operations on the managed application
1. `Customize allowed customer actions` - leave unchecked
   1. By default, the customer has read-only access to the Managed resource group. The publisher can grant additional permissions via 'allowed customer actions'
1. `Public Azure` - Here we will enter details of the security principals that will be granted RBAC permissions on the Managed resource group in the customer tenant. If you can use an identity from a different AAD tenant than the 'target' tenant you will be using for testing, that's ideal. It will work if the identity is in the same tenant as the Managed resource group but it can be a bit confusing and it doesn't demonstrate the delegated permissions.
   1. `Azure Active Directory tenant ID` - enter the tenant ID for a security principal (SP) that will manage the deployed resources
   1. `Authorizations` - enter a SP Object ID for the SP that will manage the deployed resources. Select `Owner` for the `Role definition`

      {{< details "Where to get the Tenant ID and Object ID" >}}

1. Either using the Azure Portal
   1. Sign in as the desired user (ie the **publisher** identity that will **manage** the resource)
   1. Navigate to the AAD blade in the Azure Portal
   1. Copy the `Tenant ID` - paste into the `Azure Active Directory tenant ID` field in Partner Center
   1. Navigate to the AAD -> Users blade in the Azure Portal
   1. Select the desired user (you can also use a service principal or group)
   1. Copy the user's `Object ID` - paste into the `Principal ID` field in Partner Center
1. Or using the Azure CLI
   1. Sign in to the Azure CLI as the desired user
   1. The following command will return the Tenant ID

   ```bash
   az account get-access-token --query tenant --output tsv
   ```

   1. The following command will return the Object ID

   ```bash
   az ad user show --id user@domain.com --query objectId --output tsv
   ```

      {{</details>}}

1. `Policy settings` - leave this blank

      > Be sure to **Save draft** before exiting the page

> Click on `Plan overview` at the top of the page to revert to the offer pages

## Co-sell with Microsoft

You are not required to enter anything on the Co-sell tab for the purposed of this lab.

## Resell through CSPs

1. Select "No partners in the CSP program"

   > Be sure to **Save draft** before exiting the page

## Review and Publish

We are now ready to review and publish (to a preview audience) the offer we have created.

1. Select "Review and publish" at the top of the page. You should see a summary like the below:

   ![Publish summary screenshot](../../_images/partnercenter-publish-summary-st.png)

1. If any of the sections are not marked as "Complete", go back and review.
1. Select "Publish" at the top of the page.
1. This will start the publish process. It will take a few hours before the preview becomes available.

   ![Publish status screenshot](../../_images/partnercenter-publish-status.png)

1. Note the "Publisher signoff" stage in the process. This is a manual step where the publisher must confirm approval before the offer is fully published in the marketplace.

   > You will not do this for a test offer such as the one we are creating in this lab.

1. Check back after a few hours. Preview links should be created for Azure Marketplace and the Azure Portal.
1. Use the preview links to deploy your offer into your subscription.

## Cleanup Resources

1. Once completed, you can cleanup resources by deleting the resource created above

## Resources

* [Plan a solution template for an Azure application offer](https://docs.microsoft.com/azure/marketplace/plan-azure-app-solution-template)
* [Customer usage attribution ID](https://docs.microsoft.com/en-gb/azure/marketplace/azure-partner-customer-usage-attribution#commercial-marketplace-azure-apps)

---
