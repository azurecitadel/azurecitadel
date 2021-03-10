---
title: "Scale Onboarding"
description: "Onboarding multiple Linux and WIndows servers with a service principal, then automate conneting with the azcmagent."
layout: single
draft: false
series:
 - arc-servers-hack-proctor
weight: 4
---

## Tasks

Text

## Success criteria

* Text

    ```text
    resources
    | where type == "microsoft.hybridcompute/machines"
    | project name,resourceGroup,tags.Owner,properties.osName,id
    | project-rename owner=tags_Owner, platform=tags_Platform, OS=properties_osName
    ```
