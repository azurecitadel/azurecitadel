#!/bin/bash

subscriptionId=$(az account show --query id --output tsv)

read -r -d '' policyRule <<'EOF'
{
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.Network/networkSecurityGroups/securityRules"
      },
      {
        "field": "Microsoft.Network/networkSecurityGroups/securityRules/sourceAddressPrefix",
        "equals": "*"
      },
      {
        "anyOf": [
          {
            "field": "Microsoft.Network/networkSecurityGroups/securityRules/destinationPortRanges",
            "contains": "22"
          },
          {
            "field": "Microsoft.Network/networkSecurityGroups/securityRules/destinationPortRanges",
            "contains": "3389"
          },
          {
            "field": "Microsoft.Network/networkSecurityGroups/securityRules/destinationPortRange",
            "equals": "22"
          },
          {
            "field": "Microsoft.Network/networkSecurityGroups/securityRules/destinationPortRange",
            "equals": "3389"
          }
        ]
      }
    ]
  },
  "then": {
    "effect": "deny"
  }
}
EOF

az policy definition create \
  --name "denyWildcardJITSecurityRules" \
  --display-name "Prevent JIT adding port 22 or 3389 security rules with a source address wildcard." \
  --description "Prevent JIT from adding any port 22 or 3389 security rules with a wildcard for the source address, forcing specified IP address(es) only." \
  --mode "Indexed" \
  --subscription $subscriptionId \
  --rules "$policyRule"

az policy assignment create \
  --name "Block wildcard JIT rules" \
  --policy "denyWildcardJITsecurityRules" \
  --scope "/subscriptions/$subscriptionId"