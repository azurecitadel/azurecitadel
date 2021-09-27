---
title: "Custom Script Extension"
description: "The custom script extension opens up opportunities to automate PowerShell and Bash scripts at scale for both cloud and on prem servers."
layout: single
draft: false
series:
 - arc-servers-hack-proctor
weight: 190
url: /arc/servers/hack/script/proctor
---


## Portal

  The portal submission is pretty simple.

## Questions

* Where can you see the version of the extension?

  Portal's extension blade.

* Where is the installation logging?

  ```text
  %ProgramData%\GuestConfig\ext_mgr_logs
  ```

  where `%ProgramData%` is usually `C:\ProgramData`.

* Where would you check for script output and errors?

  ```text
  %ProgramData%\GuestConfig\extension_logs\Microsoft.Compute.CustomScriptExtension\
  ```

* Where was the script downloaded to?

  ```text
  C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.10.12\Downloads\0\
  ```

  > CustomScriptExtension version number will change in the future, of course.

* Where would you check the status?

  ```text
  C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.10.12\status
  ```

Answers are pulled from the [Troubleshooting](https://docs.microsoft.com/azure/azure-arc/servers/troubleshoot-vm-extensions) page.

Also useful:

  ```bash
  az connectedmachine extension show --name CustomScriptExtension --machine-name "win-02" --resource-group "arc_pilot"
  ```

## Automated

⚠️ The Set-AzVMCustomScriptExtension from the [main page](https://docs.microsoft.com/en-us/azure/virtual-machines/extensions/custom-script-windows#powershell-deployment) will fail.

Use the pages in the Azure Arc area instead.

### Azure CLI

```bash
scriptUri="https://arcpilotsadfc4852d.blob.core.windows.net/powershell/custom_script_windows.ps1"
command="powershell -ExecutionPolicy Unrestricted -File custom_script_windows.ps1"
az connectedmachine extension create --machine-name "win-02" --name "CustomScriptExtension" --type "CustomScriptExtension" --publisher "Microsoft.Compute" --protected-settings "{\"commandToExecute\": \"$command\", \"fileUris\": [\"$scriptUri\"]}" --type-handler-version "1.10" --resource-group "arc_pilot" --location "uksouth"
```

### PowerShell

```powershell
$protectedSetting = @{
  commandToExecute = "powershell -ExecutionPolicy Unrestricted -File custom_script_windows.ps1"
  fileUris = @("https://arcpilotsadfc4852d.blob.core.windows.net/powershell/custom_script_windows.ps1")
  }
New-AzConnectedMachineExtension -MachineName "win-03" -Name CustomScriptExtension -ExtensionType "CustomScriptExtension" -Publisher "Microsoft.Compute" -Settings @{} -ProtectedSetting $protectedSetting -ResourceGroupName "arc_pilot" -Location "uksouth"
```

### ARM

azuredeploy.json:

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "type": "string"
        }
    },
    "resources": [
        {
            "name": "[concat(parameters('vmName'),'/CustomScriptExtension')]",
            "type": "Microsoft.HybridCompute/machines/extensions",
            "location": "uksouth",
            "apiVersion": "2019-08-02-preview",
            "properties": {
                "publisher": "Microsoft.Compute",
                "type": "CustomScriptExtension",
                "autoUpgradeMinorVersion": true,
                "settings": {},
                "protectedSettings": {
                    "fileUris": [
                      "https://arcpilotsadfc4852d.blob.core.windows.net/powershell/custom_script_windows.ps1"
                    ],
                    "commandToExecute": "powershell -ExecutionPolicy Unrestricted -File custom_script_windows.ps1"
                }
            }
        }
    ]
}
```

Command:

```bash
az deployment group create --template-file azuredeploy.json --parameters vmName=win-01 --resource-group arc_pilot
```
