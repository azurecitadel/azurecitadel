---
title: "User IDs & PAL"
date: 2025-10-10
author: [ "Richard Cheney" ]
description: "If you are have a user ID in a customer tenant to provide a managed service on their Azure services then follow this page to configure Partner Admin Link."
draft: false
weight: 30
menu:
  side:
    parent: pal
    identifier: pal-user
series:
  - pal
---

## In brief

{{< flash >}}

1. Authenticate in the customer context:

    - sign on as the user the customer created for you in their tenant, or
    - if invited as a guest into their tenant then a) sign on and b} switch directory to the customer tenant

1. Link your ID to the PartnerID using the CLI, PowerShell or the Azure Portal screen.

{{< /flash >}}

The information here is lifted straight from the main documentation which is found at <https://aka.ms/partneradminlink>.

## Creating the Partner Admin Link

When you have access to the customer's resources, use the Azure portal, PowerShell, or the Azure CLI to link your Partner ID to your user ID. Link the Partner ID in each customer tenant.

{{< modes default="Portal" >}}
  {{< mode title="Portal" >}}

  First, ensure you have authenticated as the correct user and you are in the correct customer directory.

  1. Open the [Azure Portal](https://portal.azure.com).
  1. Click on the [Settings](https://portal.azure.com/#settings/directory) icon at the top.
  1. Select the [Microsoft partner network](https://portal.azure.com/#blade/Microsoft_Azure_Billing/managementpartnerblade) link in Useful Links at the bottom left.

      ![Microsoft partner network link on the Settings page in the Azure Portal](/pal/images/pal-mpn-dark.png)

  1. Enter your Partner ID.

      ![Link to a partner ID](/pal/images/pal-link-dark.png)

  1. Click on the **Link a partner ID** button to save.

  {{< /mode >}}
  {{< mode title="PowerShell" >}}

  ### Use PowerShell to create the link

  1. Install the [Az.ManagementPartner](https://www.powershellgallery.com/packages/Az.ManagementPartner/) PowerShell module.

      ```powershell
      Install-Module -Name Az.ManagementPartner -Repository PSGallery -Force
      ```

  1. Sign in to the customer's tenant.

      ```powershell
      Connect-AzAccount -TenantId <tenantId>
      ```

  1. Create the Partner Admin Link.

      ```powershell
      New-AzManagementPartner -PartnerId <partnerId>
      ```

  1. Additional commands

      Display the partner ID.

      ```powershell
      Get-AzManagementPartner
      ```

      Update the partner ID.

      ```powershell
      Update-AzManagementPartner -PartnerId <partnerId>
      ```

      Delete the Partner Admin Link.

      ```powershell
      Remove-AzManagementPartner -PartnerId <partnerId>
      ```

  {{< /mode >}}
  {{< mode title="Azure CLI" >}}

  ### Use the Azure CLI to create the link

  1. Install the Azure CLI's managementpartner extension.

      ```shell
      az extension add --name managementpartner
      ```

  1. Sign in to the customer's tenant.

      ```powershell
      az login --tenant <tenantId>
      ```

  1. Create the Partner Admin Link.

      ```powershell
      az managementpartner create --partner-id <partnerId>
      ```

  1. Additional commands

      Display the partner ID.

      ```powershell
      az managementpartner show
      ```

      Update the partner ID.

      ```powershell
      az managementpartner update --partner-id <partnerId>
      ```

      Delete the Partner Admin Link.

      ```powershell
      az managementpartner delete --partner-id <partnerId>
      ```

  {{< /mode >}}
{{< /modes >}}


## Why do you have to switch into each customer tenant?

Your user ID in your home tenant may have been invited as a guest to multiple customer environments. You are signing in with the same MFA each time, so why do you need to switch into each customer tenant and recreate the Partner Admin Link in each one?

When you accept an invitation, Entra creates a new objectId in the customer's tenant. (The User Principal Name for a guest ID includes #EXT#, e.g. first.last_partner.com#EXT#\@customer.com.)

The Partner Admin Link is between the tenantId.objectId and the partnerId as you can see in the JSON output above for the Azure CLI commands.
