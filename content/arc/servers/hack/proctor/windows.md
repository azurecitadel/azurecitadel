---
title: "Scale Onboarding for Windows"
description: "Onboarding multiple Windows servers using Windows Admin Center."
layout: single
draft: false
series:
 - arc-servers-hack-proctor
weight: 135
url: /arc/servers/hack/windows/proctor
---

## Onboarding

OK, this one is a little open as they are given the choice in how to onboard.

Default choices are to use:

* Windows Admin Center (if they are Global Admins)
* Portal generated script (if they are not)

But if they are feeling a bit more curious then they can go down different paths in the knowledge that the proctor support might not be as strong!

## Windows Admin Center

The lab details the setup and config steps pretty well. If they have used the Terraform repo with the defaults variable values then it is pretty robust.

If they have changed anything then it needs WinRM for the various hosts (i.e. internet to win-01, then win-01 to both win-02 and win-03). If they are working with another on prem platform then bear that in mind.

Give them time and space to explore Windows Admin Center.

PowerShell scripts are exposed in Windows Admin Center - terminal icon at the top right.

Connecting the gateway server to Azure will fail if they cannot grant admin consent on the service principal as part of the wizard. If so then they can always ask the global admin to do it as a separate step: <https://docs.microsoft.com/azure/active-directory/manage-apps/grant-admin-consent>

Annoyances:

* Onboarding with Windows Admin Center is simple, but seems to be per server
* No obvious support for Azure management plane tagging as part of the onboarding experience

## Discussion points

Good to discuss some of the different approaches. Feel free to mention the upcoming appliance for VMware.

## Success criteria

Screen share with your proctor to show that you achieved:

1. Onboarding all windows servers
1. Redisplay the Resource Graph report or workbook
