---
title: "Create the custom policy"
date: 2020-08-25
author: [ "Richard Cheney" ]
description: ""
weight: 4
draft: false
series:
 - policy-custom
menu:
  side:
    parent: policy-custom
---

## Create a custom policy

OK, you now have all of the building blocks and info to create the policy, plus a selection of links. The lab will start you off with a template and then you can work through the sections to start fleshing it out. It will be more painful than just copying and pasting code blocks, but no-one learns much that way.

> **If you do get stuck then scroll to the [example azurepolicy.json](#example-azurepolicyjson).**

## Policy template

1. Press `CTRL`+`SHIFT`+`E` to open the Explorer
1. Create a new file called _azurepolicy.json_
1. Copy in the [template](https://docs.microsoft.com/azure/governance/policy/tutorials/create-custom-policy-definition#compose-the-definition) below:

    ```json
    {
        "properties": {
            "displayName": "<displayName>",
            "description": "<description>",
            "mode": "<mode>",
            "metadata": {
                "version": "0.1.0",
                "category": "categoryName",
                "preview": true
            },
            "parameters": {
                    <parameters>
            },
            "policyRule": {
                "if": {
                    <rule>
                },
                "then": {
                    "effect": "<effect>"
                }
            }
        }
    }
    ```

## Core properties

Customise the *core properties*

1. Update **displayName** to "_Deny JIT requests with source Any_"
1. Update **description** to "_Deny Just In Time (JIT) requests with Any as the source address prefix._"
1. Set **mode** to "_All_"

Indexed mode should only be used when dealing with resources that have tags and locations.

## Metadata

The [metadata](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#metadata) block is optional but can be very useful. The _version_, _category_ and _preview_ keys are known ad common properties and control where and how the policy is displayed in the portal.

1. Set the **category** to "_Just In Time_"

    You can specify a pre-existing category that is already used by the inbuilt policies, or create a new category.

You can also create your own key value pairs within the metadata block to add information that is useful to you. For instance, you could add a creator name, link back to a source repo or refer back to a change request record.

## Parameters

Using [parameters](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#parameters) makes your policies more flexible and can reduce the number of custom policies you have to create. Make use of the [strongTypes](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#strongtype) where possible.

1. Add a parameter called _ports_
1. Add a suitable displayname and description
1. Default the parameter to the standard set of Just In Time ports

## Policy Rule

Modify the *policyRule* section to deny JIT security rules that have the source address prefix set to Any.

1. Ensure the **if** handles either the networkSecurityGroups or securityRules resourceTypes
1. Use the _ports_ parameter
1. If the condition is evaluated as _true_ **then** the [effect](https://docs.microsoft.com/azure/governance/policy/concepts/effects) should be Deny

## Example azurepolicy.json

If you want to see how your finished template compares to the one I created - or you've just got a bit stuck - then click on the button below.

{{< details "azuredeploy.json">}}
```json
{
  "properties": {
    "displayName": "Deny JIT requests with source Any",
    "description": "Deny Just In Time (JIT) requests with Any as the source address prefix.",
    "mode": "All",
    "metadata": {
      "version": "0.1.0",
      "category": "Just In Time",
      "preview": true
    },
    "parameters": {
      "ports": {
        "type": "array",
        "metadata": {
          "description": "The list of destination ports to check. Defaults to the standard Just In Time set.",
          "displayName": "Array of ports to check for."
        },
        "defaultValue": [
          "22",
          "3389",
          "5985",
          "5986"
        ]
      }
    },
    "policyRule": {
      "if": {
        "anyOf": [
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
                "in": "[parameters('ports')]"
              }
            ]
          },
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
        ]
      },
      "then": {
        "effect": "deny"
      }
    }
  }
}
```

{{< /details >}}

## Create the additional files

The convention is to create a set of three files as different commands use either the full azuredeploy.json, or the azurepolicy.parameter.json and azurepolicy.rules.json.

1. Create the additional files using jq

```bash
jq .properties.parameters < azurepolicy.json > azurepolicy.parameters.json
jq .properties.policyRule < azurepolicy.json > azurepolicy.rules.json
```

## Next steps

OK, we have our set of files. Let's define the policy and assign it for testing.
