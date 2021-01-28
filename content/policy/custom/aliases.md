---
title: "Policy Aliases"
date: 2020-08-25
author: [ "Richard Cheney" ]
description: ""
weight: 2
draft: false
series:
 - policy-custom
menu:
  side:
    parent: policy-custom
---


## Discovering aliases

In this lab section you will use the vscode extension to create a policy to meet the customer requirement in the scenario above. The lab will highlight the functionality of the extension, as well as understanding how aliases work.

We'll be initally working in Bash before moving to vscode, but feel free to use similar PowerShell commands or the portal as long as you get to the same point.

## Create an NSG

Start by creating an NSG containing an offending rule.

Log into Azure and select the correct subscription before starting.

1. Create a resource group

    ```bash
    az group create --name custom_policy_lab --location uksouth
    ```

1. Create a network security group

    ```bash
    az network nsg create --name offender --resource-group custom_policy_lab --location uksouth
    ```

1. Add a rule similar to the any source JIT rule

    ```bash
    az network nsg rule create --name anysourcerule \
      --nsg-name offender \
      --resource-group custom_policy_lab \
      --direction Inbound \
      --priority 100 \
      --destination-address-prefix 10.0.0.4 \
      --destination-port 22
    ```

    You will now have an NSG with an offending rule that matches those created by JIT.

    ![offending rule](/policy/custom/images/custom-offender-anysourcerule.png)

## Find aliases with the Policy extension

Before creating a custom policy it is important to understand which aliases to use. These will be used as [fields](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#fields) in the policyRule. We then need to determine the logic we want to create.

The Azure Policy extension in vscode helps to view resources and policies and to discover the right aliases to use in your policy rules, but also be aware that it is a preview extension and does not always include the full set of available aliases.

1. Create a working folder for the lab

    ```bash
    mkdir ~/custom_policy_lab
    ```

1. Open the folder in vscode

    ```bash
    code ~/custom_policy_lab
    ```

1. Open the extension side bar ('CTRL'+'SHIFT'+'E')
1. Click on Azure Policy
    * Install the extension if you haven't done so already
    * Log in to Azure if the toast notification prompts you
    * It takes a couple of minutes to discover your resources and policy information
1. Browse the policy section to view the policies, initiatives and assignments
1. Browse the Resource Groups and click on your NSG

    ![extension](/policy/custom/images/custom-extension-resource.png)

    The resource type is **Microsoft.Network/networkSecurityGroups**.

    The **destinationPortRange** and **sourceAddressPrefix** are the two properties that were populated. We should also check the rule to ensure that the **direction** is _Inbound_ and **access** is _Allow_.

    > NSG rules also allow you to specify either source address prefixes and destination port ranges as arrays, so should we also check the **destinationPortRanges** and **sourceAddressPrefixes** as well to make sure nothing slips through the net?

1. Browse the Resource Providers and drill into Microsoft.Network and then networkSecurityGroups

    * If you click on the offender NSG then you'll see the same resource info as before

1. Hover over the **destinationPortRange** and copy the alias

    ![alias](/policy/custom/images/custom-extension-resourcealias.png)

    * Create a new file called aliases
    * Paste in the alias
    * Repeat the process for **sourceAddressPrefix**

    Your list of aliases from the resource level should be:

    ```text
    Microsoft.Network/networkSecurityGroups/securityRules[*].destinationPortRange
    Microsoft.Network/networkSecurityGroups/securityRules[*].sourceAddressPrefix
    ```

1. Hover over the destinationPortRanges and sourceAddressPrefixes arrays

    Note that the vscode extension does not display aliases for these.

    As already mentioned, the extension is in preview and has not yet been updated to include all aliases.

    We will use the CLI soon to pull out all of the available aliases and to understand how they differ.

1. Explore the sub-resource

    * Open the tree for the Resource Providers and you will see securityRules as a sub resource type
    * Click on anysourcerule

    ![alias](/policy/custom/images/custom-extension-subresourcealias.png)

    OK, now we have more aliases that we could use if we are working at the sub resource level.

    ```text
    Microsoft.Network/networkSecurityGroups/securityRules.destinationPortRange
    Microsoft.Network/networkSecurityGroups/securityRules.sourceAddressPrefix
    ```

    Many of the more complex resources have sub-resources and the resource provider tree is a great way of finding those.

## Find aliases with the Azure CLI

We'll use the Azure CLI to get a definitive list of the aliases as the vscode extension isn't showing everything. Some of these commands won't be pretty as they are using some complex JMESPATH queries to dig out the information.

> Alternatively you can use the Resource Graph, PowerShell or REST API to query for [aliases](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#aliases).

1. List the resourceTypes

    We already know that we can look at the resource or sub-resource level. Let's show those:

    ```bash
    az provider show --namespace Microsoft.Network --expand "resourceTypes/aliases" --query "resourceTypes[?starts_with(resourceType, 'networkSecurityGroups')].resourceType" --output yaml
    ```

    Expected output:

    ```yaml
    - networkSecurityGroups
    - networkSecurityGroups/securityRules
    ```

1. You can use the Azure CLI to check for all available aliases.

    OK, let's list out the possible sourceAddress aliases to test where the source address could be set to Any.

    ```bash
    az provider show --namespace Microsoft.Network --expand "resourceTypes/aliases" --query "resourceTypes[?starts_with(resourceType, 'networkSecurityGroups')].{type: resourceType, alias:aliases[?contains(name, 'sourceAddress')].name}" --output yamlc
    ```

    Example output:

    ```yaml
    - alias:
      - Microsoft.Network/networkSecurityGroups/securityRules[*].sourceAddressPrefix
      - Microsoft.Network/networkSecurityGroups/securityRules[*].sourceAddressPrefixes[*]
      - Microsoft.Network/networkSecurityGroups/securityRules[*].sourceAddressPrefixes
      type: networkSecurityGroups
    - alias:
      - Microsoft.Network/networkSecurityGroups/securityRules/sourceAddressPrefix
      - Microsoft.Network/networkSecurityGroups/securityRules/sourceAddressPrefixes[*]
      - Microsoft.Network/networkSecurityGroups/securityRules/sourceAddressPrefixes
      type: networkSecurityGroups/securityRules
    ```

    > (I've removed the defaultSecurityRules as we're ignoring those.)

The set of aliases for destinationPortRange matches the list format above.

OK, so we know which aliases we can work with. In the next section we'll determine the logic and see the constructs in the policy structure that we can use.
