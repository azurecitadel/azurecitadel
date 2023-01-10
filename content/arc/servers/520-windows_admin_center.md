---
title: Windows Admin Center
description: "Configure Windows Admin Center in the Azure Portal to manage on prem Windows servers."
slug: windows_admin_center
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-windows_admin_center
series:
 - arc-servers
weight: 520
---

## Introduction

It is now possible to run Windows Admin Center in the Azure Portal with no need to install any gateway servers in your hybrid or multi-cloud locations. Wide Wold Importers would like to see what functionality is available.

## Challenge

* Create a new security group, Windows Admin Center Administrators
* Configure Windows Admin Center access for the group
* Make sure the group does not have more access than it needs

## Success criteria

Demonstrate:

* access to Windows Admin Center for the Windows on prem servers
* the role assignments for the security group

Questions:

* What networking limitation does the service currently have?
* Is it possible to use Windows Admin Center in the Azure Portal if you are using Azure Lighthouse?

## Resources

* <https://aka.ms/WACinAzure>
* <https://aka.ms/WACinAzure/Arc>

## Next Steps

In the next lab we'll test that you can access your on prem VMs before you start to onboard.
