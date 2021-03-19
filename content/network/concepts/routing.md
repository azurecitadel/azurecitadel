---
title: "Routing Tables"
date: 2021-01-06
author: [ "Binal Shah" ]
description: "Understand how Azure routes traffic in a virtual network and how user defined routes can be used to change the default behaviour."
weight: 7
series:
 - network-concepts
menu:
  side:
    parent: 'network-concepts'
aliases:
 - /network/routing
---

## Lab Overview

Let’s look at how routing and custom routes work in a virtual network. We spun up a CSR in the previous lab. We will check how user defined routes work through a network virtual appliance with CSR as an example NVA.

## Lab Diagram

![Diagram](/network/concepts/images/lab07-01-summary.png)

## Create a route table

1. On the upper-left side of the screen, select **Create a resource > Networking > Route table**.
1. In **Create route table**, enter or select this information:

    | **Setting** | **Value** |
    |---|---|
    | Name | **rt-nva** |
    | Subscription | _Select your subscription_ |
    | Resource group | *Create new*, enter **rg-lab**, and select **OK** |
    | Location | Leave the default **West US 2** |

3. Select **Create**.

The new route table should show up in the list.

## Create a route

1. Click on the route table 'rt-nva' that you just created.
1. Under Settings, select Routes > + Add.
1. In Add route, enter or select this information

    | **Setting** | **Value** |
    |---|---|
    | Route name | **route-to-nva** |
    | Address prefix | **10.0.1.0/24** |
    | Next hop type | **Virtual appliance** |
    | Next hop address | **10.1.1.5** (or IP of the NVA CSR) |

1. Select OK.

## Associate a route table to a subnet

Click on the route table 'rt-nva' that you just created.

1. From the route table rt-nva page, under **Settings**, select **Subnets**
1. Click **Associate**, enter or select this information:

    | **Setting** | **Value** |
    |---|---|
    | Virtual network | **vnet1** |
    | Subnet | **vnet1-subnet2** |

1. Select **OK**

## Enable IP Forwarding on the NVA

Enable IP Forwarding on the NVA VM's network interface.

1. Go to the virtual machines page and click on VM **csr1**
1. Select **Networking** from the VM blade on the left and click on the network interface for the VM
1. Click on **IP Configuration** tab in the left blade under _Settings_
1. Verify **IP forwarding** is enabled

## Test the routing

Test routing from the vnet2-vm-web1 VM to the 10.0.1.0/24 subnet.

1. SSH into the virtual machine vnet1-vm-web1
    * Ping the CSR1000v VM csr1
    * Verify pings are successful
2. Now ping the destination vm vnet-hub-vm1 using its private IP address 10.0.1.4
    * Pings should be successful
3. Run `traceroute` to the vnet-hub-vm1 virtual machine

    ```text
    azuser@vnet1-vm-web1:~$ traceroute 10.0.1.4
    traceroute to 10.0.1.4 (10.0.1.4), 30 hops max, 60 byte packets
    1  10.1.1.6 (10.1.1.6)  1.913 ms  1.900 ms  1.873 ms
    2  * 10.0.1.4 (10.0.1.4)  3.760 ms *
    ```

    The next hop for the destination shows as the IP address of the CSR1000v virtual machine. This is our user defined routes in action.
