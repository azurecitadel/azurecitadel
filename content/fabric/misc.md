---
title: "Miscellaneous"
description: "Not so frequently asked questions."
layout: single
draft: true
menu:
  side:
    parent: fabric
    identifier: fabric-misc
series:
 - fabric_terraform_administrator
weight: 90
---

## Introduction

This is a collection of miscellaneous information on automating Fabric which may prove useful in searches. I'll keep this page in FAQ format, although I very much doubt these questions will be frequently asked.

 However, you only need the full cosmetic name for Terraform, which is everything preceding .Fabric in the table above.**.

See the [Fabric API](https://learn.microsoft.com/rest/api/fabric/articles/) and the associated Terraform [fabric_workspace](https://registry.terraform.io/providers/microsoft/fabric/latest/docs/resources/workspace) resource.

Note that the fabricId is inexplicably unavailable via the [Azure REST API](https://learn.microsoft.com/en-us/rest/api/microsoftfabric/fabric-capacities/list-by-resource-group) (and therefore `az fabric capacity list` or Terraform's [azurerm_fabric_capacity](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/fabric_capacity)).

As a side noe, the EOL on non-Windows systems is CRLF on preview version 0.2.0. You can work around this in scripts by using jq, e.g. `fabricId=$(fab get .capacities/shared.Capacity -q . | jq -r .fabricId)`.