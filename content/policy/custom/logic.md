---
title: "Determine the logic"
date: 2020-08-25
author: [ "Richard Cheney" ]
description: "You can't create a policy without knowing the logic that you need to embed in the policy."
weight: 3
draft: false
series:
 - policy-custom
menu:
  side:
    parent: policy-custom
---

## Introduction

OK, lots of options which could result in a very complex policy if were had to deal with all the possible permutations. Having some knowledge of how the Azure Resource Manager works can help reduce that complexity. Let's work through it.

## Which resourceTypes?

We have to test the `networkSecurityGroup/securityRules` resourceType. The JIT process will [create a single security rule](https://docs.microsoft.com/rest/api/virtualnetwork/securityrules/createorupdate) against the existing NSG.

But we should also test the aliases at both the `networkSecurityGroup` resourceType. Our policy should also prevent the [creation or update of an NSG](https://docs.microsoft.com/rest/api/virtualnetwork/networksecuritygroups/createorupdate) with these securityRules within them.

Your rules should always include a `"field": "type"` rule so the system knows which resourceTypes to filter for testing.

```json
{
  "field": "type",
  "equals": "Microsoft.Network/networkSecurityGroups/securityRules"
}
```

We'll work through the additional test conditions for the `Microsoft.Network/networkSecurityGroups/securityRules` resourceType before moving on to `Microsoft.Network/networkSecurityGroups`.

## Source Address set to Any?

The **sourceAddressPrefix** property will have a string value. String values are supported by a wide range of [conditions](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#conditions).

We will use `"equals": "*"` to test:

```json
{
  "field": "Microsoft.Network/networkSecurityGroups/securityRules/sourceAddressPrefix",
  "equals": "*"
}
```

Do we also need to test the sourceAddressPrefixes or sourceAddressPrefixes[*] aliases? The answer is no.

The Azure Resource Manager layer prevents '\*' being combined with other values in a sourceAddressPrefixes range. If you specify sourceAddressPrefixes with '\*' by itself (a single element array) then sourceAddressPrefix will be set to '\*' and sourceAddressPrefixes will be set to an empty array.

Sometimes you have to test a few variants to understand the behaviour.

## Destination Port Ranges?

We need to test that the destination port ranges does not equal any of our Just In Time ports. The most likely are 22 and 3389, although the WinRM ports could also be requested.

The [JIT request API](https://docs.microsoft.com/rest/api/securitycenter/jitnetworkaccesspolicies/initiate#initiate-an-action-on-a-jit-network-access-policy) call only allows a single destination port range value to be entered so we can forget the destinationPortRanges and destinationPortRanges[*] aliases and just test the destinationPortRange.

```json
{
  "field": "Microsoft.Network/networkSecurityGroups/securityRules/destinationPortRange",
  "in": [
    "22",
    "3389",
    "5985",
    "5986"
  ]
}
```

## Logical operators

There are three [logical operators](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#logical-operators) that you can use when nesting JSON for more complex conditions

* not
* allOf
* anyOf

You can nest _allOf_ within _not_ to create _noneOf_.

At the `networkSecurityGroups/securityRules` resourceType level we need all three conditions to be true, plus the *direction:Inbound* and *access:Allow* properties, so the JSON would look like this:

```json
{
  "allOf": [
    {
      "field": "type",
      "equals": "Microsoft.Network/networkSecurityGroups/securityRules"
    },
    {
      "field": "Microsoft.Network/networkSecurityGroups/securityRules/direction",
      "equals": "Inbound"
    },
    {
      "field": "Microsoft.Network/networkSecurityGroups/securityRules/access",
      "equals": "Allow"
    },
    {
      "field": "Microsoft.Network/networkSecurityGroups/securityRules/sourceAddressPrefix",
      "equals": "*"
    },
    {
      "field": "Microsoft.Network/networkSecurityGroups/securityRules/destinationPortRange",
      "in": [
        "22",
        "3389",
        "5985",
        "5986"
      ]
    }
  ]
}
```

We will use a parameter for that array of ports to make the policy more flexible.

OK, that is the `networkSecurityGroups/securityRules` resourceType done.

## Splat aliases

Now for the `networkSecurityGroups` resourceType. Here are the matching aliases:

* Microsoft.Network/networkSecurityGroups/securityRules[*].sourceAddressPrefix
* Microsoft.Network/networkSecurityGroups/securityRules[*].destinationPortRange

There is good documentation to help you [understand the [*] alias](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#understanding-the--alias). I'll call them splat aliases as they are similar to the splat expressions in Terraform.

With splat aliases there is an implicit loop so that you can use the string evaluators on each iteration. It is worth understanding the effect of the implicit AND between those iterations on the [evaluations](https://docs.microsoft.com/azure/governance/policy/how-to/author-policies-for-arrays#evaluating-the--alias). Here are a few common variants:

* _All_

    ```json
    {
      "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].sourceAddressPrefix",
      "equals": "*"
    }
    ```

* _None_

    ```json
    {
      "not": {
        "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].sourceAddressPrefix",
        "equals": "*"
      }
    }
    ```

* _Any_

    ```json
    {
      "not": {
        "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].sourceAddressPrefix",
        "notEquals": "*"
      }
    }
    ```

    If you see _not_ and _notEquals_ combined then it will be on a splat alias.

## Count

We will need to do a compound test of all of the conditions whilst cycling through the splat aliases, and we want a _true_ result if any of the security rules in an NSG tick all of the boxes. This is where [count](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#count) comes in. Count can be used to see how many of the iterations meet the condition criteria, so you can check for _none_ or _all_ or _any_, or for an exact number.

Therefore, here is the JSON for the 'networkSecurityGroups' level.

```json
{
  "allOf": [
    {
      "field": "type",
      "equals": "Microsoft.Network/networkSecurityGroups"
    },
    {
      "count": {
        "field": "Microsoft.Network/networkSecurityGroups/securityRules[*]",
        "where": {
          "allOf": [
            {
              "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].direction",
              "equals": "Inbound"
            },
            {
              "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].access",
              "equals": "Allow"
            },
            {
              "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].sourceAddressPrefix",
              "equals": "*"
            },
            {
              "field": "Microsoft.Network/networkSecurityGroups/securityRules[*].destinationPortRange",
              "in": "[parameters('ports')]"
            }
          ]
        }
      },
      "greater": 0
    }
  ]
}
```

## Next steps

OK, we have everything we need. Let's start building the custom policy.
