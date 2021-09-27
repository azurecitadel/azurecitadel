---
title: "Custom Script Extension"
description: "The custom script extension opens up opportunities to automate PowerShell and Bash scripts at scale for both cloud and on prem servers."
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-hack-script
series:
 - arc-servers-hack
weight: 190
---

## Introduction

Many of you will be familiar with the custom script extension, and will be pleased to hear that these are also supported on your Windows and linux Arc-enabled servers.

## Portal

Use the extension via the portal to add some software to one of the Windows servers.

* Copy the [example custom script](https://github.com/microsoft/azure_arc/blob/main/azure_arc_servers_jumpstart/scripts/custom_script_windows.ps1)
* Add _adobereader_ to the list of chocolatey packages
* Add to your arcpilotsa\<uniq> storage account
  * container: _powershell_
  * blob: _custom_script_windows.ps1_
* Run the Custom Script Extension on _win-01_ via the portal

## Troubleshooting

* Where can you see the version of the extension?
* Where is the installation logging?
* Where would you check for script errors?
* Where was the script downloaded to?
* Where would you check the status?

## Automated

* use a PowerShell, CLI command or ARM template to run the script on _win02_ and _win03_

## Resources

* [Windows Server Custom Script Extension with Azure Arc enabled servers (video)](https://www.youtube.com/watch?v=0TYn5wgQXow)
* [custom_script_windows.ps1](https://github.com/microsoft/azure_arc/blob/main/azure_arc_servers_jumpstart/scripts/custom_script_windows.ps1)
* [Chocolatey packages](https://community.chocolatey.org/packages)
* [Manage extensions with CLI](https://docs.microsoft.com/azure/azure-arc/servers/manage-vm-extensions-cli)
* [Manage extensions with PowerShell](https://docs.microsoft.com/azure/azure-arc/servers/manage-vm-extensions-powershell)
* [Manage extensions using ARM template](https://docs.microsoft.com/azure/azure-arc/servers/manage-vm-extensions-template)
* [Custom script extension on linux](https://docs.microsoft.com/azure/virtual-machines/extensions/custom-script-linux)
* [Custom script extension on Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/custom-script-windows)

## Next

You're on the home straight! Just managed identities to go, and that is a guided lab.
