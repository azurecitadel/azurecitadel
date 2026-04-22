---
headless: true
title: "Azure landing zone - Terraform Registry overview"
---

## Terraform

The Azure landing zone and Sovereign landing zone are intended to be used by multiple clients, including Bicep. These pages focus purely on Terraform as a client, so in this section we will run through the alz provider, Azure Verified Modules, and the AVM modules in the Terraform Registry. Again, everything in this section is the product of the CAE team that created the library format.

### The alz provider

The Azure landing zone library format is read on Terraform using the [alz provider](https://registry.terraform.io/providers/Azure/alz/latest/docs) and then used by the Azure Verified Module. (See below.)

The alz provider is relatively simple. Its role is to download the library (or libraries) locally, into the `./alzlib` folder. The folder should be excluded from your public Git provider (e.g. GitHub, Azure DevOps, etc.) using .gitignore.

It supports multiple libraries, and those libraries can also recurively pull in their own library dependencies. Most of the optional argument for the provider relate to authentication, but there are two important arguments that control behaviour.

- `library_fetch_dependencies` controls whether to recursively download any dependencies found in a library's metadata file. (Default is `true`.)
- `library_overwrite_enabled` controls whether assets can be overwritten by other libraries. (Default is `false`.)

### Azure Verified Modules

The home for Azure Verified Modules (AVM) is <https://aka.ms/avm>. Here you will find information on the initiative and the various resource and pattern modules that are combined to create more complex infrastructure as code deployments.

AVM has fundamentally changed the delivery of Azure landing zones, and it is more modular and better supported than ever before. There is a specific ethos behind the design and implementation of the modules and they are used for many of the platform and workload accelerators.

There is nothing stopping you from combining the AVM Terraform modules with your own Terraform config and modules, and therefore this is more appealing to partners who have defined their own infrastructure as code IP.

### Terraform registry

There are five AVM modules for Azure landing zones in the Terraform registry. Each of these has an extensive documentation page, plus a selection of examples in the drop down at the top.

- [**Azure/avm-ptn-alz**](https://registry.terraform.io/modules/Azure/avm-ptn-alz/azurerm/latest)

    The core module for deploying management groups, policies definitions and assignments, and customer RBAC role definitions. This is the module that uses the alz provider and the local .alzlib folder it generates. This registry search shows all of the modules starting with [Azure/avm-ptn/alz](https://registry.terraform.io/search/modules?q=Azure%2Favm-ptn-alz).

- [**Azure/avm-ptn-alz-management**](https://registry.terraform.io/modules/Azure/avm-ptn-alz-management/azurerm/latest)

    Deploys the standard Azure landing zone resource for the management subscription, such as an Azure Monitor Log Analytics Workspace for resource diagnostics, Data Collection Rules for Azure Monitor Agent, etc. This module works hand in hand with the avm-ptn-alz module as these resources are required by some of the Azure landing zone's policies.

- [**Azure/avm-ptn-alz-connectivity-hub-and-spoke-vnet**](https://registry.terraform.io/modules/Azure/avm-ptn-alz-connectivity-hub-and-spoke-vnet/azurerm/latest)

    The first of two provided modules for the connectivity subscription. This one provides plenty of options for deploying standard hub and spoke resources, including gateways for ExpressRoute and VPN, Private DNS Zones and Private DNS Zone Resolver, Azure Firewall, Azure Bastion and more. Supports single and multi region deployments.

- [**Azure/avm-ptn-alz-connectivity-virtual-wan**](https://registry.terraform.io/modules/Azure/avm-ptn-alz-connectivity-virtual-wan/azurerm/latest)

    This module is for those taking the Azure Virtual WAN path for connectivity, including support for Azure Firewall, Azure Bastion, and sidecar virtual networks for NVAs and other resources that are not supported in the main hub. Supports, minimal configs through to complex multiregion deployments with many network connections.

- [**Azure/avm-ptn-alz-sub-vending**](https://registry.terraform.io/modules/Azure/avm-ptn-alz-sub-vending/azurerm/latest)

    Azure landing zones inherited many of the design concepts from enterprise-scale landing zones, and one of those was the use of subscriptions as a scaling element and a strong scope for RBAC role assigmments. [Subscription vending](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/design-area/subscription-vending) is a recommended mechanism for dynamic environments.

{{< flash "tip" >}}
The initial launch of these partner focused labs is limited to the core **avm-ptn-alz** and **avm-ptn-alz-management** modules.
{{< /flash >}}
