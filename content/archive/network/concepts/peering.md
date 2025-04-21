---
title: "Virtual Network Peering"
date: 2021-01-06
author: [ "Binal Shah" ]
description: "Connect two isolated vNets using vNet Peering and validate routing and connectivity."
weight: 4
series:
 - network-concepts
menu:
  side:
    parent: 'network-concepts'
aliases:
 - /network/peering
---

## Lab Overview

This lab covers how to enable connectivity between two virtual networks. Each virtual network is an isolated environment until we allow communication. Here, we will see how to configure vnet peering to enable communication between two virtual networks. Virtual network peering is supported within and across regions. In this lab, we will create peering between two virtual networks, verify route updates and reachability between the peered networks.

### Lab Diagram

![Diagram](/network/concepts/images/lab04-01-diagram.png)

## Check connectivity between virtual networks

So far you have configured two virtual networks from labs 1 and 3. Let’s try to reach virtual machines across the two peers.

1. From the Azure portal, go to the **Virtual machines** page
1. Note the Public IP of VM **vnet1-vm-mgmt1**
1. Note the public IP of VM **vnet-hub-vm1**
1. Connect to virtual machine vnet1-vm-mgmt1 using its public IP

    ```shell
    ssh <username>@<Public_IP_of_VM>
    ```

1. Try to ping private IP of virtual machine vnet-hub-vm1

* _Did the ping succeed?_
* _Why?_

## Peer virtual networks

1. In the Search box at the top of the Azure portal, begin typing vnet1. When **vnet1** appears in the search results, select it.
1. Go to **Settings &rarr; Peerings**, and then select **+ Add**, as shown in the following picture:

    ![add](/network/concepts/images/lab04-02-add.png)

1. Enter, or select, the following information, accept the defaults for the remaining settings, and then select **OK**

    | **Setting** | **Value** |
    |---|---|
    | Name of the peering from vnet1 to remote virtual network | peer-vnet1-to-vnet-hub |
    | Subscription | Select your subscription |
    | Virtual network | vnet-hub |
    | Name of the peering from vnet-hub to vnet1 | peer-vnet-hub-to-vnet1 |
    | Allow forwarded traffic from vnet1 to vnet-hub | Enabled |
    | Allow forwarded traffic from vnet-hub to vnet1 | Enabled |

1. Verify the peering status. This should show as Connected.

    ![verify](/network/concepts/images/lab04-03-verify.png)

    Now verify the routes in vnet1.

1. Go to the virtual machine vnet1-vm-mgmt1 page and go to Settings &rarr; Networking tab
1. Click on the network interface name. See the screenshot below to find the NIC name.

    ![verify](/network/concepts/images/lab04-04-nic.png)

1. The route table should show a route added to the table for network 10.0.0.0/16. The next hop type for this route shows Vnet peering.

    ![next hop](/network/concepts/images/lab04-05-nexthop.png)

## Verify reachability between peered vNets

Let’s try to reach virtual machines across the two peers.

1. From the Azure portal, go to the **Virtual machines** page
1. Note the Public IP of VM **vnet1-vm-mgmt1**
1. Note the public IP of VM **vnet-hub-vm1**
1. Connect to virtual machine vnet1-vm-mgmt1 using its public IP

    ```shell
    ssh <username>@<Public_IP_of_VM>
    ```

1. Try to ping private IP of virtual machine vnet-hub-vm1

* _Is the ping successful?_
* _Which rule was used? Verify the nsg rules._
