---
title: "Updates from Microsoft Ignite 2022"
description: "Set of links to the new Azure Stack HCI updates announced at Ignite."
layout: single
draft: false
menu:
  side:
    parent: hci
    identifier: hci-ignite
series:
 - hci
weight: 30
---

## Key links

The two key links are

* [Microsoft Ignite 2022 Book of News](http://aka.ms/ignite-2022-book-of-news)

    Covers all of the announcements, with links to updated product pages and supporting blog posts.

* [What's new for Azure Stack HCI at Microsoft Ignite 2022](https://techcommunity.microsoft.com/t5/azure-stack-blog/what-s-new-for-azure-stack-hci-at-microsoft-ignite-2022/ba-p/3650949)

    Great summary blog post from Cosmos Darwin, Principal PM Manager on the Azure Edge & Platform team.

## Azure Hybrid Benefit and Extended Support Updates

One of the most important announcements was commercial with the updated to Azure Hybrid Benefit.

If you have Windows Server Datacenter licences with Software Assurance then you can now deploy Azure Stack HCI, Azure Kubernetes Service (AHS) on Azure Stack HCI and unlimited Windows Server guest operating systems. And all at no additional licensing cost.

* [Maximize your Windows Server investments with new benefits and more flexibility](https://cloudblogs.microsoft.com/windowsserver/2022/10/12/maximize-your-windows-server-investments-with-new-benefits-and-more-flexibility/)

Combine with free Extended Support Updates:

* [Free Extended Security Updates (ESU) through Azure Stack HCI](https://learn.microsoft.com/en-us/azure-stack/hci/manage/azure-benefits-esu)
* [Lifecycle FAQ - Extended Security Updates](https://learn.microsoft.com/en-us/lifecycle/faq/extended-security-updates)

Also look for Azure Arc Boost Program ([AABP](https://aka.ms/aabpblog)) and recently announced changes to Azure Migration and Modernization Program ([AMMP](https://www.microsoft.com/azure/partners/ammp)) to support hybrid and multi-cloud deployments using Azure Arc & Azure security foundations.

## Partner Resource Catalog

There is a great set of resources available to partners in the [Partner Resource Catalog](https://www.microsoft.com/azure/partners/resources?pr=hybrid-multicloud).

The link is prefiltered to the hybrid and multicloud content, but you will find plenty more to explore, download, and use with your customers.

## Additional links

* [VM provisioning through the portal](https://learn.microsoft.com/azure-stack/hci/manage/azure-arc-enabled-virtual-machines) (preview)

    New functionality to provision virtual machines from the Azure Portal directly to the custom locations for your onbaorded Azure Stack HCI clusters.

    Create images from the Azure Marketplace images.

* [Windows Server Azure Edition](https://techcommunity.microsoft.com/t5/windows-server-news-and-best/ignite-2022-what-s-new-in-windows-server-azure-edition/ba-p/3636862)

    Azure Stack HCI is the only platform where youi can run the Azure Edition outside of the public regions.

    Includes hotpatching, SMB over QUIC and more.

* [Deploy Azure Virtual Desktop to Azure Stack HCI](https://techcommunity.microsoft.com/t5/azure-stack-blog/workload-deployment-shouldn-t-be-different-on-cloud-amp-on/ba-p/3650070)

    Another important marketplace image that is deployable to Azure Stack HCI are the multi-session version of Windows 10/11, supporting AVD worker pools where your customer's need them.

* [What's new in Azure Stack HCI, version 22H2](https://learn.microsoft.com/azure-stack/hci/whats-new)

    Main docs page with the new features and improvements. Keep coming back to this one as new preview features will be rolled into this version over the next few months.

    Includes

    * Network ATC v2
    * Storage Replica compression
    * live migration improvements
    * tag based segmentation
    * Azure Stack HCI Environment Checker tool

* [Network ATC: What's coming in Azure Stack HCI 22H2](https://techcommunity.microsoft.com/t5/networking-blog/network-atc-what-s-coming-in-azure-stack-hci-22h2/ba-p/3598442)

    New functionality in Networkuing ATC makes this the preferred route for configuration. If Network ATC provisions adapters, the configuration is 100% supported by Microsoft. It cinludes automatic IP addressing for Storage Adapters, Cluster Network Naming, Proxy Configuration and support for Stretch Storage Spaces Direct (S2D).

* [Windows Admin Center in the Azure Portal](https://cloudblogs.microsoft.com/windowsserver/2022/06/15/preview-of-windows-admin-center-for-azure-arc-enabled-infrastructure/)
* [Manage Azure Arc-enabled Servers using Windows Admin Center in Azure](https://learn.microsoft.com/windows-server/manage/windows-admin-center/azure/manage-arc-hybrid-machines)
* [Windows Admin Center for Azure Virtual Machines is now generally available](https://cloudblogs.microsoft.com/windowsserver/2022/10/12/windows-admin-center-for-azure-virtual-machines-is-now-generally-available/)

## Azure Stack blog page updates:

A few select blog posts from the [Azure Stack blog page](https://techcommunity.microsoft.com/t5/azure-stack-blog/bg-p/AzureStackBlog) from calendar Q4:

* [Tag based Segmentation with Azure Stack HCI](https://techcommunity.microsoft.com/t5/azure-stack-blog/tag-based-segmentation-with-azure-stack-hci/ba-p/3657446)
* [AKS on Azure Stack HCI and Windows Server - November 2022 update](https://techcommunity.microsoft.com/t5/azure-stack-blog/aks-on-azure-stack-hci-and-windows-server-november-2022-update/ba-p/3679297)
* [Windows Admin Center version 2211 is now generally available!](https://techcommunity.microsoft.com/t5/windows-admin-center-blog/windows-admin-center-version-2211-is-now-generally-available/ba-p/3695758)
* [What’s new for Azure Stack HCI in Windows Admin Center v2211](https://techcommunity.microsoft.com/t5/azure-stack-blog/what-s-new-for-azure-stack-hci-in-windows-admin-center-v2211/ba-p/3696262)
* [Accelerate your edge workloads with affordable NVIDIA GPU-powered Azure Stack HCI solutions](https://techcommunity.microsoft.com/t5/azure-stack-blog/accelerate-your-edge-workloads-with-affordable-nvidia-gpu/ba-p/3692795)
