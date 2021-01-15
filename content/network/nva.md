---
title: "NVA CSR1000v"
date: 2021-01-06
author: [ "Binal Shah" ]
description: "Deploy a Cisco network virtual appliance from the Azure Marketplace."
weight: 6
series:
 - network
menu:
  side:
    parent: 'network'
---

## Lab Overview

Let’s look at how to deploy an NVA on Azure. We will deploy a Cisco CSR 1000v router from Azure Marketplace. Note that there are a wide range of network virtual appliances available from several vendors.

## Deploy network virtual appliance CSR1000v in Azure

1. Deploy a CSR1000v virtual router in Azure.
    1. From the portal home page, click on **+ Create a resource**.
    1. Type "csr" in the search box.
    1. This should give you a drop down menu on options on how to deploy the CSR. Select option ‘CSR1000v Solution Deployment’ and click **Create**.
1. This will bring up a configuration screen for CSR. Follow the steps to complete the configuration and create the CSR. Remember to add 2 network interfaces to CSR. Follow prompts to create a new virtual network. We will use this vnet as simulated on-premises environment.

    | **Setting** | **Value** |
    |---|---|
    | | |
    | **Basics** | |
    | VM name | csr1 |
    | Username | Azureuser |
    | Password | \<password of your choice> |
    | Resource Group | Click **Create new** to create a new resource group **rg-csr** |
    | Location | West US 2 |
    | | |
    | **Cisco CSR settings** | |
    | Number of network interfaces in CSR | 2 |
    | Availability set  | For this lab, select **No** |
    | Virtual-network | **vnet1** |
    | First subnet | Name: **vnet1-subnet1** |
    | | Address prefix: **10.1.1.0/24** |
    | Second subnet | Name: **vnet1-subnet2** |
    | | Address prefix: **10.1.2.0/24** |

1. Verify configuration and click OK to go to the page to buy the CSR. Add your name, email address, phone number and click Buy. Remember NVA charges will apply.
1. Go to the Virtual machines page. You should see the VM 'csr1' listed.
1. Once the status of the VM changes to 'Running', click on the name. This takes you to the VM overview page.

    ![Summary](/network/images/lab06-01-summary.png)

## Connect

1. Once the virtual machine is created, go to the VM and get the public IP.
1. From a terminal, connect to the VM as follows:

    ```shell
    ssh azureuser@<public-ip-of-csr-vm>
    ```

    This brings you to the CSR prompt where you can view and configure the CSR.

## Verify

Verify that the network security group was applied to the CSR. When you created a CSR NVA virtual machine, a network security group was applied to the CSR interfaces.

1. Go to Network Security Groups and find NSG **csr1-SSH-SecurityGroup**
1. Under **Settings**, go to **Network interfaces**
1. See the network security group applied on the two csr network interfaces
1. Verify the **Inbound Security** rules under **Settings**
1. Review the rules allowed
