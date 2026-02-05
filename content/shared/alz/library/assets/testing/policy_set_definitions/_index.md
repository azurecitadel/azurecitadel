---
headless: true
title: "Azure landing zone Library - Policy Set Definitions"
description: "Commands to check the JSON is syntactically good"
---

Example here is for the [Deny-NL-Global.alz_policy_set_definition.json](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/blob/main/country/nl/bio/policy_set_definitions/Deny-NL-Global.alz_policy_set_definition.json) file in the richeney-org/Sovereign-Landing-Zone-Packs library.

{{< tabs >}}
{{< tab title="Bash" >}}

1. Read in the policy definition

    You will need jq.

    Example for a local policy set definition file, as run from the root of the library:

    ```bash
    file="policy_set_definitions/Deny-NL-Global.alz_policy_set_definition.json"
    json=$(jq -Mc . $file)
    ```

    Example for a policy set definition in a public repo:

    ```bash
    uri="https://raw.githubusercontent.com/richeney-org/Sovereign-Landing-Zone-Packs/refs/heads/main/country/nl/bio/policy_set_definitions/Deny-NL-Global.alz_policy_set_definition.json"
    json=$(curl -sSL $uri | jq -Mc)
    ```

    Note that you will need the URI to the raw version of the file.

1. Set the management group ID (optional)

    By default the Bash commands will test the creation of the policy set definition at the subscription scope for the current subscription.

    Set the mgId variable to a valid management group ID if you want it created there instead. Example for `alz`.

    ```bash
    mgId="alz"
    ```

1. Generate the CLI command

    ```bash
    extend() {
        local arg="$1" value="$2"
        if [[ "$value" != "null" && -n "$value" && "$value" != "{}" && "$value" != "[]" ]]; then
        cmdArgs+=("--$arg" "\"$(sed "s/'/\\\\'/g" <<< "$value" | tr '"' "'")\""); fi
    }

    name="$(jq -r '.name' <<< $json)"
    cmdArgs=("az" "policy" "set-definition" "create")
    extend "name" "$name"
    extend "description" "$(jq -r '.properties.description' <<< $json)"
    extend "display-name" "$(jq -r '.properties.displayName' <<< $json)"
    extend "definitions" "$(jq -c '.properties.policyDefinitions' <<< $json)"
    extend "params" "$(jq -c '.properties.parameters' <<< $json)"
    extend "metadata" "$(jq -c '.properties.metadata' <<< $json)"
    extend "management-group" "${mgId}"

    echo "${cmdArgs[@]}"
    ```

1. Create the policy set definition

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
