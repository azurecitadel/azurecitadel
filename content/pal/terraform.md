---
title: "Using AzAPI in Terraform"
date: 2026-02-16
author: [ "Richard Cheney" ]
description: "Here is an example Terraform config to create the Partner Admin Link using azapi_resource_action, useful in CI/CD and subscription vending machine situations."
draft: false
weight: 75
menu:
  side:
    parent: pal
    identifier: pal-terraform
series:
  - pal
---

## Introduction

You can also create a Partner Admin Link easily if you have a Terraform config that runs as a service principal or managed identity.

{{< flash >}}
Remember that each security principal can be linked to only one partner ID.

The examples use 314159 as a placeholder as I won't be sharing the partner ID that I use for testing!
{{< /flash >}}

## Example Terraform config

There are multiple ways for azapi to authenticate as a service principal or managed identity.

This example is based on [Authentication: Authenticating via a Service Principal and a Client Secret](https://registry.terraform.io/providers/azure/azapi/latest/docs/guides/service_principal_client_secret#configuring-the-service-principal-in-terraform), and assumes that you have exported **ARM_TENANT_ID**, **ARM_CLIENT_ID**, and **ARM_CLIENT_SECRET**.

```ruby
terraform {
  required_providers {
    azapi = {
      source  = "azure/azapi"
      version = ">= 2.8.0"
    }
  }
}

provider "azapi" {}

variable "partner_id" {
  type    = string
  default = "314159"
}

resource "azapi_resource_action" "pal" {
  type        = "Microsoft.ManagementPartner/partners@2018-02-01"
  resource_id = "/providers/Microsoft.ManagementPartner/partners/${var.partner_id}"
  method      = "PUT"
  when        = "apply"

  body = {
    partnerId = var.partner_id
  }

  response_export_values = {
    id          = "id"
    objectId    = "properties.objectId"
    partnerName = "properties.partnerName"
    partnerId   = "properties.partnerId"
  }
}

resource "azapi_resource_action" "pal_destroy" {
  type        = "Microsoft.ManagementPartner/partners@2018-02-01"
  resource_id = "/providers/Microsoft.ManagementPartner/partners/${var.partner_id}"
  method      = "DELETE"
  when        = "destroy"

  depends_on = [azapi_resource_action.pal]
}

output "pal" {
  value = azapi_resource_action.pal.output
}
```

## Example Terraform run

1. Initialise

    ```bash
    terraform init
    ```

    {{< output >}}
{{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">Initializing the backend...</span>
<span style="font-weight:bold;">Initializing provider plugins...</span>
- Reusing previous version of azure/azapi from the dependency lock file
- Installing azure/azapi v2.8.0...
- Installed azure/azapi v2.8.0 (signed by a HashiCorp partner, key ID <span style="font-weight:bold;">6F0B91BDE98478CF</span>)
Partner and community providers are signed by their developers.
If you'd like to know more about provider signing, you can read about it here:
https://developer.hashicorp.com/terraform/cli/plugins/signing

<span style="font-weight:bold;"></span><span style="font-weight:bold;color:lime;">Terraform has been successfully initialized!</span><span style="color:lime;"></span>
<span style="color:lime;">
You may now begin working with Terraform. Try running &quot;terraform plan&quot; to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.</span>
</pre>
{{< /raw >}}
{{< /output >}}

1. Validate

    ```bash
    terraform validate
    ```

    {{< output >}}
{{< raw >}}
<pre style="color:white; background-color:black">
<span style="color:lime;"></span><span style="font-weight:bold;color:lime;">Success!</span> The configuration is valid.
</pre>
{{< /raw >}}
{{< /output >}}

1. Plan

    ```bash
    terraform plan
    ```

    {{< output >}}
{{< raw >}}
<pre style="color:white; background-color:black">
Terraform used the selected providers to generate the following execution
plan. Resource actions are indicated with the following symbols:
  <span style="color:lime;">+</span> create

Terraform will perform the following actions:

<span style="font-weight:bold;">  # azapi_resource_action.pal</span> will be created
  <span style="color:lime;">+</span> resource &quot;azapi_resource_action&quot; &quot;pal&quot; {
      <span style="color:lime;">+</span> body                   = {
          <span style="color:lime;">+</span> partnerId = &quot;314159&quot;
        }
      <span style="color:lime;">+</span> id                     = (known after apply)
      <span style="color:lime;">+</span> method                 = &quot;PUT&quot;
      <span style="color:lime;">+</span> output                 = (known after apply)
      <span style="color:lime;">+</span> resource_id            = &quot;/providers/Microsoft.ManagementPartner/partners/314159&quot;
      <span style="color:lime;">+</span> response_export_values = {
          <span style="color:lime;">+</span> id          = &quot;id&quot;
          <span style="color:lime;">+</span> objectId    = &quot;properties.objectId&quot;
          <span style="color:lime;">+</span> partnerId   = &quot;properties.partnerId&quot;
          <span style="color:lime;">+</span> partnerName = &quot;properties.partnerName&quot;
        }
      <span style="color:lime;">+</span> sensitive_output       = (sensitive value)
      <span style="color:lime;">+</span> type                   = &quot;Microsoft.ManagementPartner/partners@2018-02-01&quot;
      <span style="color:lime;">+</span> when                   = &quot;apply&quot;
    }

<span style="font-weight:bold;">  # azapi_resource_action.pal_destroy</span> will be created
  <span style="color:lime;">+</span> resource &quot;azapi_resource_action&quot; &quot;pal_destroy&quot; {
      <span style="color:lime;">+</span> id               = (known after apply)
      <span style="color:lime;">+</span> method           = &quot;DELETE&quot;
      <span style="color:lime;">+</span> output           = (known after apply)
      <span style="color:lime;">+</span> resource_id      = &quot;/providers/Microsoft.ManagementPartner/partners/314159&quot;
      <span style="color:lime;">+</span> sensitive_output = (sensitive value)
      <span style="color:lime;">+</span> type             = &quot;Microsoft.ManagementPartner/partners@2018-02-01&quot;
      <span style="color:lime;">+</span> when             = &quot;destroy&quot;
    }

<span style="font-weight:bold;">Plan:</span> 2 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  <span style="color:lime;">+</span> pal = (known after apply)
<span style="filter: contrast(70%) brightness(190%);color:dimgray;">
─────────────────────────────────────────────────────────────────────────────</span>

Note: You didn't use the -out option to save this plan, so Terraform can't
guarantee to take exactly these actions if you run &quot;terraform apply&quot; now.
</pre>
{{< /raw >}}
{{< /output >}}

1. Apply

    ```bash
    terraform apply
    ```

    {{< output >}}
{{< raw >}}
<pre style="color:white; background-color:black">
- snip -

<span style="font-weight:bold;">Plan:</span> 2 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  <span style="color:lime;">+</span> pal = (known after apply)
<span style="font-weight:bold;">
Do you want to perform these actions?</span>
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

yes
  <span style="font-weight:bold;">Enter a value:</span>
<span style="font-weight:bold;">azapi_resource_action.pal: Creating...</span>
<span style="font-weight:bold;">azapi_resource_action.pal: Still creating... [00m10s elapsed]</span>
<span style="font-weight:bold;">azapi_resource_action.pal: Creation complete after 15s [id=/providers/Microsoft.ManagementPartner/partners/314159]</span>
<span style="font-weight:bold;">azapi_resource_action.pal_destroy: Creating...</span>
<span style="font-weight:bold;">azapi_resource_action.pal_destroy: Creation complete after 0s [id=/providers/Microsoft.ManagementPartner/partners/314159]</span>
<span style="font-weight:bold;"></span><span style="font-weight:bold;color:lime;">
Apply complete! Resources: 2 added, 0 changed, 0 destroyed.</span>
<span style="font-weight:bold;"></span><span style="font-weight:bold;color:lime;">
Outputs:

</span>pal = {
  &quot;id&quot; = &quot;/providers/microsoft.managementpartner/partners/314159&quot;
  &quot;objectId&quot; = &quot;84964f8f-22ce-4a1e-ba9d-1e45a53ca1c4&quot;
  &quot;partnerId&quot; = &quot;314159&quot;
  &quot;partnerName&quot; = &quot;Azure Citadel&quot;
}
</pre>
{{< /raw >}}
{{< /output >}}

1. Destroy

    {{< flash "danger" >}}
⚠️ Only use the destroy switch if you are intending to remove the applied config. This is included here to demonstrate the azapi_resource_action.pal_destroy block.
{{< /flash >}}

    ```bash
    terraform destroy
    ```

    {{< output >}}
{{< raw >}}
<pre style="color:white; background-color:black">
<span style="font-weight:bold;">azapi_resource_action.pal: Refreshing state... [id=/providers/Microsoft.ManagementPartner/partners/314159]</span>
<span style="font-weight:bold;">azapi_resource_action.pal_destroy: Refreshing state... [id=/providers/Microsoft.ManagementPartner/partners/314159]</span>

Terraform used the selected providers to generate the following execution
plan. Resource actions are indicated with the following symbols:
  <span style="color:red;">-</span> destroy

Terraform will perform the following actions:

<span style="font-weight:bold;">  # azapi_resource_action.pal</span> will be <span style="font-weight:bold;"></span><span style="font-weight:bold;color:red;">destroyed</span>
  <span style="color:red;">-</span> resource &quot;azapi_resource_action&quot; &quot;pal&quot; {
      <span style="color:red;">-</span> body                   = {
          <span style="color:red;">-</span> partnerId = &quot;314159&quot;
        } <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> id                     = &quot;/providers/Microsoft.ManagementPartner/partners/314159&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> method                 = &quot;PUT&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> output                 = {
          <span style="color:red;">-</span> id          = &quot;/providers/microsoft.managementpartner/partners/314159&quot;
          <span style="color:red;">-</span> objectId    = &quot;84964f8f-22ce-4a1e-ba9d-1e45a53ca1c4&quot;
          <span style="color:red;">-</span> partnerId   = &quot;314159&quot;
          <span style="color:red;">-</span> partnerName = &quot;Azure Citadel&quot;
        } <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> resource_id            = &quot;/providers/Microsoft.ManagementPartner/partners/314159&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> response_export_values = {
          <span style="color:red;">-</span> id          = &quot;id&quot;
          <span style="color:red;">-</span> objectId    = &quot;properties.objectId&quot;
          <span style="color:red;">-</span> partnerId   = &quot;properties.partnerId&quot;
          <span style="color:red;">-</span> partnerName = &quot;properties.partnerName&quot;
        } <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> sensitive_output       = (sensitive value) <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> type                   = &quot;Microsoft.ManagementPartner/partners@2018-02-01&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> when                   = &quot;apply&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
    }

<span style="font-weight:bold;">  # azapi_resource_action.pal_destroy</span> will be <span style="font-weight:bold;"></span><span style="font-weight:bold;color:red;">destroyed</span>
  <span style="color:red;">-</span> resource &quot;azapi_resource_action&quot; &quot;pal_destroy&quot; {
      <span style="color:red;">-</span> id          = &quot;/providers/Microsoft.ManagementPartner/partners/314159&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> method      = &quot;DELETE&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> resource_id = &quot;/providers/Microsoft.ManagementPartner/partners/314159&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> type        = &quot;Microsoft.ManagementPartner/partners@2018-02-01&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
      <span style="color:red;">-</span> when        = &quot;destroy&quot; <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
    }

<span style="font-weight:bold;">Plan:</span> 0 to add, 0 to change, 2 to destroy.

Changes to Outputs:
  <span style="color:red;">-</span> pal = {
      <span style="color:red;">-</span> id          = &quot;/providers/microsoft.managementpartner/partners/314159&quot;
      <span style="color:red;">-</span> objectId    = &quot;84964f8f-22ce-4a1e-ba9d-1e45a53ca1c4&quot;
      <span style="color:red;">-</span> partnerId   = &quot;314159&quot;
      <span style="color:red;">-</span> partnerName = &quot;Azure Citadel&quot;
    } <span style="filter: contrast(70%) brightness(190%);color:dimgray;">-&gt; null</span>
<span style="font-weight:bold;">
Do you really want to destroy all resources?</span>
  Terraform will destroy all your managed infrastructure, as shown above.
  There is no undo. Only 'yes' will be accepted to confirm.

yes
  <span style="font-weight:bold;">Enter a value:</span>
<span style="font-weight:bold;">azapi_resource_action.pal_destroy: Destroying... [id=/providers/Microsoft.ManagementPartner/partners/314159]</span>
<span style="font-weight:bold;">azapi_resource_action.pal_destroy: Still destroying... [id=/providers/Microsoft.ManagementPartner/partners/314159, 00m10s elapsed]</span>
<span style="font-weight:bold;">azapi_resource_action.pal_destroy: Destruction complete after 15s</span>
<span style="font-weight:bold;">azapi_resource_action.pal: Destroying... [id=/providers/Microsoft.ManagementPartner/partners/314159]</span>
<span style="font-weight:bold;">azapi_resource_action.pal: Destruction complete after 0s</span>
<span style="font-weight:bold;"></span><span style="font-weight:bold;color:lime;">
Destroy complete! Resources: 2 destroyed.</span>
</pre>
{{< /raw >}}
{{< /output >}}

## Equivalent Azure CLI commands

These are included for reference only.

1. Set the partner ID

    ```bash
    partnerId=314159
    ```

1. Authenticate

    ```bash
    az login --service-principal --username "${ARM_CLIENT_ID}" --password "${ARM_CLIENT_SECRET}" --tenant "${ARM_TENANT_ID}" --allow-no-subscriptions
    ```

1. Set the URI

    ```bash
    uri="https://management.azure.com/providers/microsoft.managementpartner/partners/${partnerId}?api-version=2018-02-01"
    ```

1. Create the Partner Admin Link

    ```bash
    az rest --method PUT --url $uri --body '{"partnerId": "'${partnerId}'"}'
    ```

1. Delete the Partner Admin Link

    ```bash
    az rest --method DELETE --url $uri
    ```
