---
headless: true
title: "Azure Landing Zones Library - Policy Assignments"
description: "Commands to check the JSON is syntactically good. Remember that you will need the custom definitions."
---

Example here is for the [Audit-NL-BIO.alz_policy_assignment.json](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/blob/main/country/nl/bio/policy_assignments/Audit-NL-BIO.alz_policy_assignment.json) file in the richeney-org/Sovereign-Landing-Zone-Packs library. This has no custom policy or policy set definitions and therefore no dependencies.

{{< tabs >}}
{{< tab title="Bash" >}}

1. Read in the policy definition

    You will need jq.

    Example for a local policy assignment file, as run from the root of the library:

    ```bash
    file="policy_assignments/Audit-NL-BIO.alz_policy_assignment.json"
    json=$(jq -Mc . $file)
    ```

    Example for a policy assignment in a public repo:

    ```bash
    uri="https://raw.githubusercontent.com/richeney-org/Sovereign-Landing-Zone-Packs/refs/heads/main/country/nl/bio/policy_assignments/Audit-NL-BIO.alz_policy_assignment.json"
    json=$(curl -sSL $uri | jq -Mc)
    ```

    Note that you will need the URI to the raw version of the file.

1. Set the management group ID

    Set the mgId variable to a valid management group ID. Example for `test`.

    ```bash
    mgId="test"
    ```

    Example command to create a management group called test:

    ```bash
    az account management-group create --name test --display-name "Test scope for custom library"
    ```

1. Generate the CLI command

    ```bash
    extend() {
        local arg="$1" value="$2"
        if [[ "$value" != "null" && -n "$value" && "$value" != "{}" && "$value" != "[]" ]]; then
        cmdArgs+=("--$arg" "\"$(sed "s/'/\\\\'/g" <<< "$value" | tr '"' "'")\""); fi
    }

    name="$(jq -r '.name' <<< $json)"
    cmdArgs=("az" "policy" "assignment" "create")
    extend "name" "$name"
    extend "description" "$(jq -r '.properties.description' <<< $json)"
    extend "display-name" "$(jq -r '.properties.displayName' <<< $json)"
    extend "policy" "$(jq -r '.properties.policyDefinitionId' <<< $json)"
    extend "enforcement-mode" "$(jq -r '.properties.enforcementMode' <<< $json)"
    extend "definitions" "$(jq -c '.properties.policyDefinitions' <<< $json)"
    extend "non-compliance-messages" "$(jq -c '.properties.parameters' <<< $json)"
    extend "not-scopes" "$(jq -c '.properties.notScopes' <<< $json)"
    extend "params" "$(jq -c '.properties.parameters' <<< $json)"
    extend "metadata" "$(jq -c '.properties.metadata' <<< $json)"
    extend "scope" "/providers/Microsoft.Management/managementGroups/${mgId}"

    echo "${cmdArgs[@]}"
    ```

1. Create the policy assignment

    Check the generated command. If it is good then either copy and paste the command into the terminal or run

    ```bash
    eval "${cmdArgs[@]}"
    ```

1. To remove the test instance of a policy set definition

    Current subscription scope:

    ```bash
    az policy set-definition delete --name "$name"
    ```

    If removing from a management group scope:

    ```bash
    az policy set-definition delete --name "$name" --management-group "$mgId"
    ```

{{< /tab >}}
{{< /tabs >}}
