---
title: "Azure Baristas"
description: "Background information for the Azure Baristas scenario."
layout: single
draft: true
weight: 4
series:
 - es-hack-day1
menu:
  side:
    parent: es-hack-day1
---

## Company background & information

* Global coffee brand (roastery, wholesale, distribution, retail)
* HQ in London. Regional HQs in New York, Dubai, Frankfurt & Singapore
* Warehouses, distribution centres & coffee shops in all these locations
* 100s of other coffee shops in each continent, each lead by their regional HQ
* No operations in China currently
* Strict data sovereignty requirements for all operations in Germany
* Due to COVID-19 looking to migrate all IT workloads to Microsoft Azure
* Currently a typical VMware vSphere estate in each of the regional HQs either in the offices or in co-lo DCs in the same countries, all have a DR DC in the same country too.
* Around 10,000 VMs worldwide
* Due to COVID-19 – heavy investment in online shop/website as main revenue stream for business
* Developed by teams across the globe – local teams focus on regional specific features/offers/promos
* Another development team is developing a separate payment service which is subject to PCI-DSS which will be used by the online shop/website
* Global MPLS connecting all sites with regional DC hubs acting as internet breakout points. No local breakouts at each site
* Already utilising Microsoft 365 services (EOL, SharePoint, Teams etc.)

## Technical details

* Have a global EA with Microsoft for Microsoft 365 services, Azure consumption & Windows Server/Client licensing (all have active Software Assurance)
* Microsoft 365 Licenses: Office 365 E5 & EM+S E3 for all users
* Azure EA Prepayment (aka Commit): $10 million over 3 years
* Azure Subscriptions: 3 subscriptions in total that developers have been using to test and play in. Can be deleted if required.
* Azure AD Tenant: azurebaristas.onmicrosoft.com
* Synced with on-premise AD DS Domain: azbaristas.local via Azure AD Connect, Password Hash Sync Enabled & SSO
* Centralised Network team that manages all networking globally with strong skills in the Citrix networking space (ADC, NetScaler etc.)
* All IT staff are trained and certified in Microsoft Azure and have basic to intermediate experience with ARM Templates, Git, GitHub/Azure DevOps.
* A CCoE has been formed between 3 members of each IT team from each regional HQ – total of 12 members – now at ‘Ready’ phase of CAF

## Requirements

* Need to be able to report costs for each continent & country easily
* Want to replace MPLS solution with cloud-based SD-WAN approach
  * Also allowing local internet breakout from all sites to improve SaaS application performance and load on global WAN.
* Require ability to deny certain Azure Resources/Services
  * The CCoE are concerned with users deploying HDInsight clusters within Azure
* Require separated Production, Staging & Development environments for security and cost separation/reporting
  * The CCoE do not want development or staging environments and associated VNETs to be able to communicate with production
  * All production VMs must be backed up, however selected VMs in dev/test environments may need backing up also
* Require built-in platform regulatory compliance security checks and reporting for all production environments (PCI-DSS, ISO27001, CIS etc.)
  * ISO27001 & CIS for all environments except Sandbox subscriptions
  * PCI-DSS for the payment system
* Require unrestricted area for developers to innovate on new solutions/services
  * Not allowed any connectivity into corporate networks
* Require a more granular approach to admin access to environments within Azure
  * The CCoE are concerned as currently there are to many domain admins and enterprise admins within their estate
* Real customer data is not allowed to exist in unrestricted developer environments, it must be anonymised
* All Subnets must be protected with NSGs and cannot be disabled
* All Resources, Resource Groups & Subscriptions must be tagged with the following Tags (at a minimum):
  * Cost-Centre, Environment, IT-Owner-Contact, Service-Application
* Azure Activity Logs for all Subscriptions & Diagnostic settings for all Azure Resources should be enabled automatically and sent to a Log Analytics Workspace
* No M-Series or LS-Series VMs can be deployed
  * Except for the SAP environments
* TDE & Auditing should be enforced on all Azure SQL DBs/Servers
* Azure Monitor VM Insights should be enabled on all Production VMs and any required agents automatically installed
* No Public IP Addresses are allowed in the environment except for Core networking, Sandboxes & Online applications.

## Stretch Goals

* Create a custom policy and assign to a scope within Azure via AzOps (GitHub Actions)
* For the ‘Cost-Centre’ tag it should only accept values starting with the following: “AZBACC-”
  * Each value should only be 10 characters in length
* How would an Azure MSP/Support Partner gain access to the Azure Baristas Azure environment?
* How can we block Azure Sentinel from being deployed but not stopping Log Analytics Workspaces from being deployed?
* Need to be able to prevent incorrect licensing options being selected for VMs – AHUB must be enabled on Production only VMs (stretch goal)
