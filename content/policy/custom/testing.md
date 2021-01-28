---
title: "Define, assign and test"
date: 2020-08-25
author: [ "Richard Cheney" ]
description: "Define the custom policy at the right scope point. Assign it and test it out to confirm that it works as expected."
weight: 5
draft: false
series:
 - policy-custom
menu:
  side:
    parent: policy-custom
---

## Introduction

We'll define and assign the custom policy at the subscription scope to test it out.

## Define the policy

1. Determine your subscription scope

    ```bash
    subscriptionId=$(az account show --query id --output tsv)
    ```

1. Create the custom policy definition

    ```bash
    az policy definition create --name jitDenySourceAny \
      --display-name "Deny JIT requests with source Any" \
      --description "Deny Just In Time (JIT) requests with Any as the source address prefix." \
      --metadata version="0.1.0" category="Just In Time" preview=true \
      --mode All \
      --params "@azurepolicy.parameters.json" \
      --rules "@azurepolicy.rules.json" \
      --subscription $subscriptionId
    ```

## Assign the policy

1. Assign the custom policy

    ```bash
    az policy assignment create --name jitDenySourceAny \
      --display-name "Deny Just In Time requests with All Configured Ports" \
      --policy jitDenySourceAny \
      --scope "/subscriptions/$subscriptionId"
    ```

    > I normally recommend bundling custom policies together into a policy initiative and assigning the initiative instead. That approach is better from a lifecycle management perspective.

If you go back into the portal you can see the [definition](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions) (in the new category) and the [assignment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Assignments).

## Test the policy

1. Remove the original rule

    ```bash
    az network nsg rule delete --name anysourcerule --nsg-name offender --resource-group custom_policy_lab
    ```

1. Add it back in

    ```bash
    az network nsg rule create --name anysourcerule \
      --nsg-name offender \
      --resource-group custom_policy_lab \
      --direction Inbound \
      --priority 100 \
      --destination-address-prefix 10.0.0.4 \
      --destination-port 22
    ```

    Example output:

    ```text
    Resource 'anysourcerule' was disallowed by policy. Policy identifiers: '[{"policyAssignment":{"name":"Deny Just In Time requests with All Configured Ports","id":"/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/providers/Microsoft.Authorization/policyAssignments/jitDenySourceAny"},"policyDefinition":{"name":"Deny JIT requests with source Any","id":"/subscriptions/2ca40be1-7e80-4f2b-92f7-06b2123a68cc/providers/Microsoft.Authorization/policyDefinitions/jitDenySourceAny"}}]'.
    ```

    OK, the policy is working as required. Job done!

## Finishing up

Thankfully, creating custom policies is an increasingly rare event as the number of built in policies grows each day. There is also a growing amount of community content out there. But if you need to create your own policies then understanding aliases and the policy structure is vital.

If you have created a new custom policy that you couldn't find anywhere else then perhaps it could be useful to others. You could always contribute to the set of community policies.

Perhaps it would be good to keep your custom policies and initiatives in a GitHub repo and use GitHub Actions to push them into production. Or embed into infrastructure as code such as ARM templates or Terraform configs.

## References

* [Azure Policy documentation](https://docs.microsoft.com/azure/governance/policy/)
* [Azure Policy definition structure](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure)
  * [aliases](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#aliases)
  * [conditions](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#conditions)
  * [count](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#count)
  * [effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)
  * [fields](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#fields)
  * [logical operators](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#logical-operators)
  * [metadata](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#metadata)
  * [parameters](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#parameters)
  * [splat aliases](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#understanding-the--alias)
  * [template](https://docs.microsoft.com/azure/governance/policy/tutorials/create-custom-policy-definition#compose-the-definition)
* [Tutorial: Implement Azure Policy as Code with GitHub](https://docs.microsoft.com/azure/governance/policy/tutorials/policy-as-code-github)
* [Azure Policy extension](https://marketplace.visualstudio.com/items?itemName=AzurePolicy.azurepolicyextension)
* [Azure Policy extension documentation](https://docs.microsoft.com/azure/governance/policy/how-to/extension-for-vscode)
