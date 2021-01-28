---
title: "Tagging and Auditing"
date: 2019-05-21
author: [ "Richard Cheney" ]
description: "Enable default resource tagging without compromising innovation using the append and audit effects."
weight: 5
series:
 - policy
menu:
  side:
    parent: policy-initiative
---

## Introduction

Tagging is important in a governed environment and is one of the areas that can be crucial in managing your inventory of resources well. It is also very easy to set up a set of tagging policies that deny the creation of resources and quickly become difficult to live with. We will take a different line here with a set of policies that don't inhibit innovation and do some of the heavy lifting for us, but also remind us to remediate any non-compliant resources.

In this lab we will use the **Modify** effect which is the best way to manage tag values. Modify is also useful for configuring resources, such as setting the user assigned managed identity on compute. Note that Modify can only do this where aliases have been configured.

Note that Modify uses managed identity so you wil need to be able to assign RBAC roles

We will use the builtin tag policies where they fit our requirement and group them in a custom policy initiative. (Policy initiatives used to be called policy sets and you will see remnants of that naming convention in the CLI commands and resourceIds.)

We will define the initiative at a management group level so that all subscriptions underneath that management group can assign the initiative. We will also define any custom policies at this level. If you cannot work at that level then just work at subscription level.

## Management Groups

So far we have been creating our custom policies at the subscription scope. In this lab we will move up a level and define our custom policies at the management group level.

This assumes you have the permissions to do so. If any of the following commands fail then you have the [fallback options](#fallback-options)

1. Create a management group

    ```bash
    az account management-group create --name policytest --display-name "Policy Testing"
    ```

1. Move your subscription under the management group

    It is assumed that you are using your own personal subscription for this lab.

    Go back up to the root tenant group and click on the ellipsis (**...**) to the right of your subscription.

    Click on Move and then select the Policy Testing management group from the drop down list.

## Fallback options

If everything worked then skip to the [next section](#requirement). If anything failed then you do not have sufficient access.

Here are your fallback options:

1. To complete the labs as written then ideally you be assigned **Owner** at Tenant Root Group
1. If not, ask the Owner to create the _policytest_ management group, move your subscription to it and assign the following roles

    * **Management Group Contributor**
    * **Resource Policy Contributor**
    * **User Access Administrator**

1. Finally, if none of the above are possible then just work at the subscription scope, assuming you are Owner at that level

## Requirement

As part of our governance, the following tags are required on all resource groups and resources.

* Owner
* Department
* Application
* Environment
* Downtime
* Costcode

Resource groups should ideally have the first three specified. If not then they will be created with an empty value and fail subsequent compliancy audits.

Department must be selected from a list of permitted values, which will be specified at assignment as an array of strings.

Costcode and Environment will be set at the subscription level and inherited if not specified. We will allow these to deviate from the subscription level default values so that specific resource groups can be used for other costcodes.

Downtime will always use a default of "Tuesday, 04:00-04:30" if unspecified.

Resources will always inherit all six tags from the resource group. Resources should never have different tag values to the resource group that they are in.

## Builtin policies

Browse the [policy definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions) and filter Category to _Tags_.

Ignore those that mention "Require" or "Append" in the description and instead check out those that have "Add" or "Inherit". They usually make use of the Modify effect.  Review the JSON to understand the logic.

In this lab we will use the following builtin policies:

| **GUID** | **Descriptions** |
|---|---|
| 40df99da-1232-49b1-a39a-6da8d878f469 | Inherit a tag from the subscription if missing |
| 96670d01-0a4d-4649-9c89-2d3abc0a5025 | Require a tag on resource group |
| cd3aa116-8754-49c9-a813-ad46512ece54 | Inherit a tag from the resource group |
| 726aca4c-86e9-4b04-b0c5-073027359532 | Add a tag to a resource group |
| 2a0e14a6-b0a6-4fab-991a-187a4f81c498 | Append a tag with a default value |

We will want some specific audit policies - one to check for empty strings, and another to check that it is a string that is one of an array of permitted values - that do not exist as builtin policies, so we'll add those later.

You can use the CLI to view a definition: `az policy definition show --name <GUID>`

The full resourceId for a builtin policy is `/providers/Microsoft.Authorization/policyDefinitions/<GUID>`.

## Initial policy initiative

We'll now iterate on an initial version of the custom policy initiative, focusing on setting tags at the resource group level. The custom policies and resource group inheritance will be added later.

1. Review the policy initiative structure

    Take a look at the policy initiative structure docs: <https://docs.microsoft.com/azure/governance/policy/concepts/initiative-definition-structure>

    Note that it contains a number of properties:

    * display name
    * description
    * metadata
    * parameters
    * policy definitions

    > We will ignore the policy groups as they are for more formal compliancy levels.

    The metadata will determine where we see the initiative in the portal.

    The policy definitions is an array. Each object in the array is nice and short, with only the policyDefinitionId plus the parameter values required by the definition.

1. Check the syntax for the CLI command

    ```bash
    az policy set-definition create --help
    ```

    Note that name, display name, description and metadata are all switches. Policy definitions can either be JSON strings or JSON files. Parameters are also handled this way.

    This is the reason that many Git repos for policy definitions will have the full definition file (suitable for ARM templates) plus separate files containing only the parameters and policy definitions (for use with CLI commands). We will follow the convention and construct the same.

1. Create a new subdirectory called initiatives

    ```bash
    mkdir -pm 755 initiatives/tags
    cd initiatives/tags
    ```

1. Check the definition for "Add a tag to a resource group"

    We'll be starting with setting the **Owner** tag at the resource group, so check the required parameters for adding a tag to a resource group. We checked this builtin policy in the portal, so we know the resource ID already.

    ```bash
    az policy definition show --name 726aca4c-86e9-4b04-b0c5-073027359532 --output jsonc
    ```

    {{< details "Expected output" >}}
```json
{
  "description": "Adds the specified tag and value when any resource group missing this tag is created or updated. Existing resource groups can be remediated by triggering a remediation task. If the tag exists with a different value it will not be changed.",
  "displayName": "Add a tag to resource groups",
  "id": "/providers/Microsoft.Authorization/policyDefinitions/726aca4c-86e9-4b04-b0c5-073027359532",
  "metadata": {
    "category": "Tags",
    "version": "1.0.0"
  },
  "mode": "All",
  "name": "726aca4c-86e9-4b04-b0c5-073027359532",
  "parameters": {
    "tagName": {
      "allowedValues": null,
      "defaultValue": null,
      "metadata": {
        "additionalProperties": null,
        "description": "Name of the tag, such as 'environment'",
        "displayName": "Tag Name"
      },
      "type": "String"
    },
    "tagValue": {
      "allowedValues": null,
      "defaultValue": null,
      "metadata": {
        "additionalProperties": null,
        "description": "Value of the tag, such as 'production'",
        "displayName": "Tag Value"
      },
      "type": "String"
    }
  },
  "policyRule": {
    "if": {
      "allOf": [
        {
          "equals": "Microsoft.Resources/subscriptions/resourceGroups",
          "field": "type"
        },
        {
          "exists": "false",
          "field": "[concat('tags[', parameters('tagName'), ']')]"
        }
      ]
    },
    "then": {
      "details": {
        "operations": [
          {
            "field": "[concat('tags[', parameters('tagName'), ']')]",
            "operation": "add",
            "value": "[parameters('tagValue')]"
          }
        ],
        "roleDefinitionIds": [
          "/providers/microsoft.authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
        ]
      },
      "effect": "modify"
    }
  },
  "policyType": "BuiltIn",
  "type": "Microsoft.Authorization/policyDefinitions"
}
```
{{< /details >}}

    OK, so the policyDefinitionId should be /providers/Microsoft.Authorization/policyDefinitions/726aca4c-86e9-4b04-b0c5-073027359532 and the expected parameters are tagName and tagValue.

1. Create tags.json

    Create a file called tags.json with the following content.

    ```json
    {
        "properties": {
            "displayName": "Azure Citadel Tags",
            "policyType": "Custom",
            "description": "Custom tags: Owner",
            "metadata": {
                "version": "1.0.0",
                "category": "Tags"
            },
            "parameters": {},
            "policyDefinitions": [
                    {
                    "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/726aca4c-86e9-4b04-b0c5-073027359532",
                    "parameters": {
                        "tagName": {
                            "value": "Owner"
                        },
                        "tagValue": {
                            "value": ""
                        }
                    }
                }
            ]
        }
    }
    ```

    Note that the element in the policyDefinitions array specifies the right policyDefinitionId and sets the default value to an empty string.

1. Save the file.

1. Create the tags.definitions.json

    Use jq to create the definitions.json.

    ```bash
    jq .properties.policyDefinitions < tags.json > tags.definitions.json
    ```

## Define, assign and test

OK, we will create the definition and test it out.

1. Create the policy initiative definitions

    Create the definition at the policytest management group.

    ```bash
    az policy set-definition create --name tags \
      --display-name "Azure Citadel Tags" \
      --metadata version="1.0.0" category=Tags \
      --description "Custom tags: Owner" \
      --management-group policytest \
      --definitions tags.definitions.json
    ```

    > If you couldn't create the management group earlier then change the `--management-group` switch to `--subscription <subscription_id>`.

1. Set variables

    Set the policy initiative definition ID and subscriptionScope, plus default location.

    ```text
    policySetDefinitionId=$(az policy set-definition show --management-group policytest --name tags --query id -otsv)
    subscriptionScope=/subscriptions/$(az account show --query id -otsv)
    export AZURE_DEFAULTS_LOCATION=uksouth
    ```

1. Create the assignment

    Create the policy initiative assignment at the subscription scope.

    ```bash
    az policy assignment create --name tags \
      --scope $subscriptionScope \
      --policy-set-definition $policySetDefinitionId \
      --assign-identity --location uksouth\
      --role "Tag Contributor" --identity-scope $subscriptionScope
    ```

    The _Modify_ effect requires a managed identity. Here we are creating a system assigned identity in UK South with Tag Contributor at the subscription scope.

1. Create test resource groups

    ```bash
    az group create --name policytest1 --tags Owner="Richard Cheney"
    az group create --name policytest2
    ```

    Note that the second resource group should still have the Owner tag, but it will be empty.

## Add in additional policies

OK, time to fly solo.

Extend your array of policy definitions to handle setting the following tags at resource group level:

* Department
* Application
* Environment
* Downtime
* Costcode

Don't forget to recreate the tags.definitions.json file.

## Custom policies

There are more BuiltIn policies, but they use the deny effect.  We'll create some Custom policies that use audit instead. I have created a few example policies using the format seen in ARM templates:

{{< details "auditemptytag.json" >}}
```json
{
    "type": "Microsoft.Authorization/policyDefinitions",
    "name": "auditEmptyTagValue",
    "properties": {
        "displayName": "Audit tag exists and has a value",
        "description": "This policy audits that a tag exists and has a non-empty value.",
        "policyType": "Custom",
        "mode": "Indexed",
        "parameters": {
            "tagName": {
                "type": "String",
                "metadata": {
                    "description": "Name of the tag, e.g. 'Environment'",
                    "displayName": "Tag Name"
                }
            }
        },
        "policyRule": {
            "if": {
                "anyOf": [
                    {
                        "exists": "false",
                        "field": "[concat('tags[', parameters('tagName'), ']')]"
                    },
                    {
                        "field": "[concat('tags[', parameters('tagName'), ']')]",
                        "match": ""
                    }
                ]
            },
            "then": {
                "effect": "audit"
            }
        }
    }
}
```
{{< /details >}}

Source: <https://github.com/richeney/arm/blob/master/policies/auditemptytag.json>

{{< details "audittagvalues.json" >}}
```json
{
    "type": "Microsoft.Authorization/policyDefinitions",
    "name": "auditTagValues",
    "properties": {
        "displayName": "Audit tag exists and has a value from the allowedList",
        "description": "This policy audits that a tag exists and has a value from the specified list",
        "policyType": "Custom",
        "mode": "Indexed",
        "parameters": {
            "tagName": {
                "metadata": {
                    "description": "Name of the tag, such as 'costcode'",
                    "displayName": "Tag Name"
                },
                "type": "String"
            },
            "tagValues": {
                "metadata": {
                    "description": "The list of permitted tag values",
                    "displayName": "Permitted Tag Values"
                },
                "type": "Array"
            }
        },
        "policyRule": {
            "if": {
                "anyOf": [
                    {
                        "field": "[concat('tags[', parameters('tagName'), ']')]",
                        "exists": "false"
                    },
                    {
                        "field": "[concat('tags[', parameters('tagName'), ']')]",
                        "notIn": "[parameters('tagValues')]"
                    }
                ]
            },
            "then": {
                "effect": "audit"
            }
        }
    }
}
```
{{< /details >}}

Source: <https://github.com/richeney/arm/blob/master/policies/audittagvalues.json>

{{< details "audittagvaluepattern.json" >}}
```json
{
    "type": "Microsoft.Authorization/policyDefinitions",
    "name": "auditTagValuePattern",
    "properties": {
        "displayName": "Audit tag exists and that the value matches the pattern",
        "description": "This policy audits that a tag exists and has a value that matches the specified pattern",
        "policyType": "Custom",
        "mode": "Indexed",
        "parameters": {
            "tagName": {
                "type": "String",
                "metadata": {
                    "description": "Name of the tag, e.g. 'Costcode'",
                    "displayName": "Tag Name"
                }
            },
            "tagValuePattern": {
                "type": "String",
                "metadata": {
                    "description": "Pattern to use for names. Use ? for characters and # for numbers.",
                    "displayName": "Tag Value Pattern"
                }
            }
        },
        "policyRule": {
            "if": {
                "not": {
                    "field": "[concat('tags.', parameters('tagName'))]",
                    "match": "[parameters('tagValuePattern')]"
                }
            },
            "then": {
                "effect": "audit"
            }
        }
    }
}
```
{{< /details >}}

Source: <https://github.com/richeney/arm/blob/master/policies/audittagvaluepattern.json>

Note how the files contain both the rule and the parameters, as well as the values we have been specifying using the CLI switches. When you look at the policy samples then you'll notice that each sample has a full file for use in ARM template deployments, plus the parameters and rules versions for PowerShell and CLI commands.



## Create the custom policies using addpolicy.sh

The three custom policy files are the full ARM template style JSON so we'll use a utility script, [addpolicy.sh](https://github.com/richeney/arm/blob/master/scripts/addpolicy.sh), to extract the information from it and create the CLI command on the fly.

1. Download the addpolicy.sh script to the current working directory

    ```bash
    curl -sSL https://raw.githubusercontent.com/richeney/arm/master/scripts/addpolicy.sh --output addpolicy.sh && chmod 755 addpolicy.sh
    ```

    > You will need to have the correct RBAC permissions to create policies at the Root Tenant Group to use the script. If you do not have the `Microsoft.Authorization/policyassignments/*` RBAC permission fpr the Root Tenant Group then delete the `--management-group $tenantId \` line from the multi-line `az policy definition create` command.  The custom policies will be created at the subscription scope instead.

1. Use the command without any parameters to display the usage

    ```bash
    ./addpolicy
    ```

1. Add the three custom policies

    If you created the _policytest_ management group then run:

    ```bash
    ./addpolicy.sh -m policytest auditemptytag audittagvalues audittagvaluepattern
    ```

    > If you are having to work at the subscription scope then omit the `-m policytest` switch.

    The script will output the IDs of the resulting policies. Example IDs for the auditemptytag policy:

    | **Scope** | **resourceId** |
    |---|---|
    | Management Group | /providers/Microsoft.Management/managementgroups/policytest/providers/Microsoft.Authorization/policyDefinitions/auditEmptyTagValue |
    | Subscription | /subscriptions/2d31be49-d999-4415-bb65-8aec2c90ba62/providers/Microsoft.Authorization/policyDefinitions/auditEmptyTagValue |

1. List out the custom policies

    In case you need to find out the resourceIds for your custom policies:

    ```bash
    az policy definition list --management-group policytest --query "[? policyType == 'Custom'].id"
    ```

    This should return something similar to:

    ```json
    [
      "/providers/Microsoft.Management/managementgroups/f246eeb7-b820-4971-a083-9e100e084ed0/providers/Microsoft.Authorization/policyDefinitions/auditEmptyTagValue",
      "/providers/Microsoft.Management/managementgroups/f246eeb7-b820-4971-a083-9e100e084ed0/providers/Microsoft.Authorization/policyDefinitions/auditTagValuePattern",
      "/providers/Microsoft.Management/managementgroups/f246eeb7-b820-4971-a083-9e100e084ed0/providers/Microsoft.Authorization/policyDefinitions/auditTagValues"
    ]
    ```

## Custom Policy Initiative

Now, remember that policy initiatives can only use either the BuiltIn policies, or those Custom policies that have been created at the same scope point or higher. It is therefore our recommendation to maintain your own library of parameterised custom policies, and to define those at the highest scope point possible.  You can then customise your policy initiatives per management group or subscription, either through different definitions or via policy initiative parameters.

Now that we have our list of BuiltIn and Custom policies, let's define a policy initiative for tagging that uses a parameter. Once it has been defined then we'll assign it to a lower management group level, specifying the correct Environment value for that scope point.

## Policy initiative definition

1. Create a new subdirectory called initiatives

    ```bash
    mkdir -m 755 initiatives
    cd initiatives
    ```

1. Copy in the following JSON into a new file in the initiatives folder called **tags.definition.json**:

    ```json
    [
        {
            "comment": "Create Owner tag if it does not exist",
            "parameters": {
                "tagName": {
                    "value": "Owner"
                },
                "tagValue": {
                    "value": ""
                }
            },
            "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/2a0e14a6-b0a6-4fab-991a-187a4f81c498"
        },
        {
            "comment": "Audit Owner tag if it is empty",
            "parameters": {
                "tagName": {
                    "value": "Owner"
                }
            },
            "policyDefinitionId": "/providers/Microsoft.Management/managementgroups/f246eeb7-b820-4971-a083-9e100e084ed0/providers/Microsoft.Authorization/policyDefinitions/auditEmptyTagValue"
        },
        {
            "comment": "Create Department tag if it does not exist",
            "parameters": {
                "tagName": {
                    "value": "Department"
                },
                "tagValue": {
                    "value": ""
                }
            },
            "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/2a0e14a6-b0a6-4fab-991a-187a4f81c498"
        },
        {
            "comment": "Check if Department is in the defined list",
            "parameters": {
                "tagName": {
                    "value": "Department"
                },
                "tagValues": {
                    "value": [
                        "Finance",
                        "Human Resources",
                        "Logistics",
                        "Sales",
                        "IT"
                    ]
                }
            },
            "policyDefinitionId": "/providers/Microsoft.Management/managementgroups/f246eeb7-b820-4971-a083-9e100e084ed0/providers/Microsoft.Authorization/policyDefinitions/auditTagValues"
        },
        {
            "comment": "Create Application tag if it does not exist",
            "parameters": {
                "tagName": {
                    "value": "Application"
                },
                "tagValue": {
                    "value": ""
                }
            },
            "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/2a0e14a6-b0a6-4fab-991a-187a4f81c498"
        },
        {
            "comment": "Audit Application tag if it is empty",
            "parameters": {
                "tagName": {
                    "value": "Application"
                }
            },
            "policyDefinitionId": "/providers/Microsoft.Management/managementgroups/f246eeb7-b820-4971-a083-9e100e084ed0/providers/Microsoft.Authorization/policyDefinitions/auditEmptyTagValue"
        },
        {
            "comment": "Create Environment tag with parameters value if it does not exist",
            "parameters": {
                "tagName": {
                    "value": "Environment"
                },
                "tagValue": {
                    "value": "[parameters('Environment')]"
                }
            },
            "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/2a0e14a6-b0a6-4fab-991a-187a4f81c498"
        },
        {
            "comment": "Deny Environment tag if it isn't set to the parameter",
            "parameters": {
                "tagName": {
                    "value": "Environment"
                },
                "tagValue": {
                    "value": "[parameters('Environment')]"
                }
            },
            "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/1e30110a-5ceb-460c-a204-c1c3969c6d62"
        },
        {
            "comment": "Create Downtime tag if it does not exist, with default value",
            "parameters": {
                "tagName": {
                    "value": "Downtime"
                },
                "tagValue": {
                    "value": "Tuesday, 04:00-04:30"
                }
            },
            "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/2a0e14a6-b0a6-4fab-991a-187a4f81c498"
        },
        {
            "comment": "Audit Downtime tag if it is empty",
            "parameters": {
                "tagName": {
                    "value": "Downtime"
                }
            },
            "policyDefinitionId": "/providers/Microsoft.Management/managementgroups/f246eeb7-b820-4971-a083-9e100e084ed0/providers/Microsoft.Authorization/policyDefinitions/auditEmptyTagValue"
        },
        {
            "comment": "Create Costcode tag if it does not exist",
            "parameters": {
                "tagName": {
                    "value": "Costcode"
                },
                "tagValue": {
                    "value": ""
                }
            },
            "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/2a0e14a6-b0a6-4fab-991a-187a4f81c498"
        },
        {
            "comment": "Check that Costcode tag value is a six digit number",
            "parameters": {
                "tagName": {
                    "value": "Costcode"
                },
                "tagValuePattern": {
                    "value": "######"
                }
            },
            "policyDefinitionId": "/providers/Microsoft.Management/managementgroups/f246eeb7-b820-4971-a083-9e100e084ed0/providers/Microsoft.Authorization/policyDefinitions/auditTagValuePattern"
        }
    ]
    ```

    You can see that it is simple to understand, if you know which policyDefinitionIds you are using. Don;t forget to include comments as these will be discarded by the CLI when defining the policy initiative.

    The initiative will force the Environment value to be a specific value, and this has been parameterised. So we need a parameters file for it

1. Create the a **tags.parameters.json** files in the initiatives folder

    ```json
    {
        "Environment": {
            "type": "string",
            "metadata": {
                "description": "Environment, from permitted list",
                "displayName": "Environment"
            },
            "defaultValue": "Prod",
            "allowedValues": [
                "Prod",
                "UAT",
                "Test",
                "Dev"
            ]
        }
    }
    ```

    Note that if you are using an allowedValues list that your defaultValue must be from that list or the definition will not create.

1. Go back up to the parent directory

    ```bash
    cd ..
    ```

1. Create the policy initiative definition

    ```bash
    az policy set-definition create --name tags --display-name "Standard Tags" --description "Tags: Owner, Department, Application, Environment, Downtime, Costcode" --management-group $tenantId --definitions initiatives/tags.definition.json --params initiatives/tags.parameters.json
    ```

    > If you cannot create policy initiative definitions as the Tenant Root Group level then change the scope to another management group, or to the subscription level using the `--subscription` switch. (Note that all of the CLI commands support the `--help` switch, e.g. `az policy set-definition create --help`.)

    Your initiative should be defined with a resourceId similar to the following format:

    ```text
    /providers/Microsoft.Management/managementgroups/f246eeb7-b820-4971-a083-9e100e084ed0/providers/Microsoft.Authorization/policySetDefinitions/tags
    ```

    And you can list out your custom initiatives at the Tenant Root Group using a command similar to the custom policy ine we used earlier in the lab:

    ```bash
    az policy set-definition list --management-group $tenantId --query "[? policyType == 'Custom'].id"
    ```

## Testing the tagging initiative

The initiative has now been defined at the Tenant Root Group. You should still have the Dev management group that you created in lab 4, which had an ID of 230.  We'll eventually assign the initiative there and specify the value of Environment.

But first, let's test it out at a safer resource group level. (It is assumed that you still have a default location set using `az configure --defaults location=westeurope`.)

1. Create the resource group

    ```bash
    az group create --name tagInitiativeTest
    ```

1. Assign the initiative

    ```bash
    initiativeId=/providers/Microsoft.Management/managementgroups/${tenantId}/providers/Microsoft.Authorization/policySetDefinitions/tags
    az policy assignment create --name tags --display-name "Standard Tags" --policy-set-definition $initiativeId --params '{"Environment":{"value": "Dev"}}' --resource-group tagInitiativeTest
    ```

1. Create a test resource

    ```bash
    az disk create --resource-group tagInitiativeTest -n DeleteMe --size-gb 10 --output jsonc
    ```

    The tags in the command output should look like this:

    ```jsonc
      "tags": {
        "Application": "",
        "Costcode": "",
        "Department": "",
        "Downtime": "Tuesday, 04:00-04:30",
        "Environment": "Dev",
        "Owner": ""
      }
    ```

    All of the tags have been created for us.  This is normally preferable to stopping deployment if they are not defined at that point. Downtime is set to the initiative's default value, and Environment is hardcoded to Dev.

1. Check compliancy

    After a period of time, the compliancy with Azure Policy should show the managed disk resource as being out of compliance. Set the scope level to be the tagInitiativeTest resource group within your subscription:

    ![Non Compliant](/policy/images/lab5-noncompliant.png)

    You can also use CLI commands to interrogate the state:

    ```bash
    az policy state list --resource-group tagInitiativeTest --policy-assignment tags --query "[?! isCompliant ].{resourceId:resourceId, policy:policyDefinitionName}" --output table
    ```

1. Update the tags

    Manually update the tags to make the resource compliant for the next compliancy poll

    ![Updated Tags](/policy/images/lab5-updatedtags.png)

1. Use REST API call to trigger evaluation

    The Azure docs have information on the standard [evaluation triggers](https://docs.microsoft.com/en-us/azure/governance/policy/how-to/get-compliance-data#evaluation-triggers), but I'm going to assume that you're impatient and don't want to wait 24 hours for the standard compliance evaluation cycle to go round.

    We'll use the REST API to trigger an [on demand scan](https://docs.microsoft.com/en-us/azure/governance/policy/how-to/get-compliance-data#on-demand-evaluation-scan) on our resource group. (Hopefully this will become a CLI command in the future.)

    ```bash
    subscriptionId=$(az account show --output tsv --query id)
    rg=tagInitiativeTest
    triggeruri=https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$rg/providers/Microsoft.PolicyInsights/policyStates/latest/triggerEvaluation?api-version=2018-07-01-preview

    accessToken=$(az account get-access-token --output tsv --query accessToken)
    curl --silent --include --header "Authorization: Bearer $accessToken" --header "Content-Type: application/json" --data '{}' --request POST $triggeruri
    ```

    You should get back a number of header from the HTTP 202 response, including a location URI.

1. Wait for evaluation completion

    You can track the scanning event in the Activity Log if you have non-compliant resources:

    * Azure Policy
    * Click on the Standard Tags policy assigned to the test resource group scope
    * Click on Non-compliant Resources
    * Click on the ellipsis (**...**) to the right of the non-compliant resource
    * Click on Show Activity Logs

    The _Trigger Policy Insights Compliance Evaluation_ operation will show a status of 'Accepted', which will become 'Started' and then 'Succeeded' once the policy evaluation has finished.

1. \[Optional] - Query the location URI for scanning status

    Alternatively, you can use REST You can use a REST API GET command against that location URI.

    The REST call returns **202 Accepted** whilst running and then **200 OK** once the evaluation has completed.

    Here is an example of the REST call against the location URI:

    ```bash
    locationuri=https://management.azure.com/subscriptions/2d31be49-d959-4415-bb65-8aec2c90ba62/providers/Microsoft.PolicyInsights/asyncOperationResults/eyJpZCI6IlBTUkFKb2I6MkRFMTVERjczMSIsImxvY2F0aW9uIjoiIn0?api-version=2018-07-01-preview

    curl --silent --include --header "Authorization: Bearer $accessToken" --header "Content-Type: application/json" --request GET $locationuri
    ```

    > Note that your location URI will not be the same as the one above. Use the `location:` value in the trigger output.

1. Verify compliancy

    Once the resources have been rescanned, you can return to the Azure Policy screen and verify that the resource is now compliant with the Default Tagging policy initiative.

    ![Compliant](/policy/images/lab5-compliant.png)

## Assigning the policy initiative to a management group

1. Remove the test resource group

    Deleting the test resource group will delete the resource group, the resources and the policy assignment.

    ```bash
    az group delete --yes --no-wait --name tagInitiativeTest
    ```

1. Add the policy to a higher scope point

    Now that you have tested the policy, you can assign it at a more appropriate scope point, such as the Dev management group.

    ```bash
    tenantId=$(az account show --query tenantId --output tsv)
    initiatives=/providers/Microsoft.Management/managementgroups/${tenantId}/providers/Microsoft.Authorization/policySetDefinitions
    mgs=/providers/Microsoft.Management/managementGroups
    az policy assignment create --name tags --display-name "Standard Tags" --policy-set-definition $initiatives/tags --params '{"Environment":{"value": "Dev"}}' --scope $mgs/230
    ```

## Resources

The following resources are useful. If you want to manage custom policies effectively then make sure you run through the GitHub policy as code tutorial

* <https://docs.microsoft.com/azure/governance/policy/tutorials/govern-tags>
* <https://docs.microsoft.com/azure/governance/policy/concepts/effects#modify>
* <https://docs.microsoft.com/azure/governance/policy/concepts/policy-as-code>
* <https://docs.microsoft.com/azure/governance/policy/tutorials/policy-as-code-github>

## Wrapping up

OK, that is quite a few labs covering the creation of policies and initiatives, and how they work with management groups.

In the next lab we will explore an example workflow for deploying a new tenancy in Azure, using Terraform to create the management groups, policy definitions, assignments and RBAC assignments.
