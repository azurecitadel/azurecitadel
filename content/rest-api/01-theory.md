---
title: "REST API theory"
date: 2021-02-16
slug: theory
draft: false
author: [ "Richard Cheney" ]
description: "This is a level set for those who don't use REST APIs. Feel free to skip to the next lab if you are already comfortable."
weight: 1
menu:
  side:
    parent: 'rest-api'
series:
 - rest-api
layout: single
---

## Introduction

REST API calls contact an endpoint using standard HTTP protocols.

If authentication is required then a bearer token will be included in an `Authorization` header.

The headers also include the `Content-type`, set to `application/json`.

The API operations are limited to Create, Read, Update or Delete, collectively known as CRUD operations.

The calls use the following methods:

| **Method** | **Description** |
|---|---|
| GET | Reads and output information |
| PUT | Creates a new resource if it does not exist |
| POST | Usually used to create a new entity in an array or set, or effect an action |
| PATCH | Usually used to update a property on an existing resource |
| DELETE | Delete a resource |

> Note that there is some flexibility and usage is not strict. For instance you will often see PUT commands used to update resources or create if they do not exist ("crupdate") and also partial updates.

The path for the API call is the URI or unique resource identifier, i.e. the `{scheme}://{host}/{resource_path}?{query_string}`. Here is an example to read the resource group

| Component | Example |
|---|---|
| `{scheme}` | `https` |
| `{host}` | `management.azure.com` |
| `{resource_path}` | `/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup` |
| `{query_string}` | `api-version=2021-04-01` |

All Azure REST API output is in JSON format.

The input used for PUT, POST or PATCH calls is also in JSON format and is called the request body or payload.

The HTTP return codes are used to denote success or failure. A status code 200 is successful. Additional information may also be in the return headers.

## References

* <https://docs.microsoft.com/rest/api/azure/>
