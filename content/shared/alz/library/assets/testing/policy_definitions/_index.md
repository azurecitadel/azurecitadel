---
headless: true
title: "Azure landing zone Library - Policies Definitions"
description: "Commands to check the JSON is syntactically good"
---



The example here is for the [Enforce-KV-Premium.alz_policy_definition.json](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/blob/main/country/nl/bio/policy_definitions/Enforce-KV-Premium.alz_policy_definition.json) file in the richeney-org/Sovereign-Landing-Zone-Packs library.

{{< tabs >}}
{{< tab title="Bash" >}}

Note that the Bash commands will create the policy definition at the subscription scope for the current subscription for testing purposes.

1. Read in the policy definitions

    You will need jq.

    Example for a local policy definition file, as run from the root of the library:

    ```bash
    file="policy_definitions/Enforce-KV-Premium.alz_policy_definition.json"
    json=$(jq -Mc . $file)
    ```

    Example for a policy definition in a public repo:

    ```bash
    uri="https://raw.githubusercontent.com/richeney-org/Sovereign-Landing-Zone-Packs/refs/heads/main/country/nl/bio/policy_definitions/Enforce-KV-Premium.alz_policy_definition.json"
    json=$(curl -sSL $uri | jq -Mc)
    ```

    Note that you will need the URI to the raw version of the file.

    By default the Bash commands will test the creation of the policy set definition at the subscription scope for the current subscription.


1. Check the policy definition can be created

    ```bash
    extend() {
        local arg="$1" value="$2"
        if [[ "$value" != "null" && -n "$value" && "$value" != "{}" && "$value" != "[]" ]]; then
        cmdArgs+=("--$arg" "\"$(sed "s/'/\\\\'/g" <<< "$value" | tr '"' "'")\""); fi
    }

    name="$(jq -r '.name' <<< $json)"
    cmdArgs=("az" "policy" "definition" "create")
    extend "name" "$name"
    extend "mode" "$(jq -r '.properties.mode' <<< $json)"
    extend "description" "$(jq -r '.properties.description' <<< $json)"
    extend "display-name" "$(jq -r '.properties.displayName' <<< $json)"
    extend "rule" "$(jq -c '.properties.policyRule' <<< $json)"
    extend "params" "$(jq -c '.properties.parameters' <<< $json)"
    extend "metadata" "$(jq -c '.properties.metadata' <<< $json)"

    echo "${cmdArgs[@]}"
    ```

1. Create the policy definition

    Check the generated command. If it is good then either copy and paste the command into the terminal or run

    ```bash
    eval "${cmdArgs[@]}"
    ```

1. To remove the test instance of a policy definition

    Current subscription scope:

    ```bash
    az policy definition delete --name "$name"
    ```

    If removing from a management group scope:

    ```bash
    az policy definition delete --name "$name" --management-group "$mgId"
    ```

{{< /tab >}}
{{< /tabs >}}
