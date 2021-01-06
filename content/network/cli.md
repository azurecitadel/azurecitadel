---
title: "Using the Azure CLI"
date: 2020-18-01
author: [ "Binal Shah" ]
description: "Use the CLI commands to create a vNet, a VM and then attach an NSG to a subnet."
weight: 3
menu:
  side:
    parent: 'network'
---

## Lab Overview

In this lab, we will learn how to use Azure CLI commands from the cloud shell to create a virtual network, create a virtual machine and attach a network security group to the new subnet. We will familiarize with Azure cloud shell and run CLI commands in Bash shell.

### Lab Diagram

![Diagram](/network/images/lab03-01-diagram.png)

## Start Cloud Shell

1. Launch Cloud Shell from the top navigation of the Azure portal

    ![Portal](/network/images/lab03-02-cloudshell1.png)

1. Select a subscription to create a storage account and Microsoft Azure Files share
1. Select "Create storage"
1. This should bring you to the cloud shell prompt. You can run Azure CLI commands from here.

## Select Bash

Check that the environment drop-down from the left-hand side of shell window says Bash.

![Portal](/network/images/lab03-02-cloudshell1.png)

We are ready to run CLI commands to create our virtual network.

## Create the virtual network

1. Define a group of variables:

    ```shell
    ResourceGroup=rg-lab
    VnetName=vnet-hub
    VnetPrefix=10.0.0.0/16
    SubnetName=vnet-hub-subnet1
    SubnetPrefix=10.0.1.0/24
    Location=westus2
    ```

1. Run the command to create a virtual network vnet-hub, with one subnet vnet-hub-subnet1.

    ```shell
    az network vnet create -g $ResourceGroup -n $VnetName --address-prefix $VnetPrefix --subnet-name $SubnetName --subnet-prefix $SubnetPrefix -l $Location
    ```

## Create the NSG and security rule

1. Define additional variables:

    ```shell
    Nsg=nsg-hub
    NsgRuleName=vnet-hub-allow-ssh
    DestinationAddressPrefix=10.0.1.0/24
    DestinationPortRange=22
    ```

1. Create the Network Security Group and add the security rule

    ```shell
    az network nsg create --name $Nsg --resource-group $ResourceGroup --location $Location
    az network nsg rule create -g $ResourceGroup --nsg-name $Nsg --name $NsgRuleName --direction inbound --destination-address-prefix $DestinationAddressPrefix --destination-port-range $DestinationPortRange --access allow --priority 100
    ```

# Attach the NSG to the subnet

1. Attach the network security group to vnet-hub-subnet1

    ```shell
    az network vnet subnet update -g $ResourceGroup -n $SubnetName --vnet-name $VnetName --network-security-group $Nsg
    ```

# Create a VM

1. Declare additional variables

    ```shell
    VmName=vnet-hub-vm1
    AdminUser=azureuser
    AdminPassword=Azure123456!
    ```

1. Create the virtual machine

    ```shell
    az vm create --resource-group $ResourceGroup --name $VmName --image UbuntuLTS --vnet-name $VnetName --subnet $SubnetName  --admin-username $AdminUser --admin-password $AdminPassword
    az network vnet subnet list -g $ResourceGroup --vnet-name $VnetName -o table
    ```
