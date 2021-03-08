---
title: "Manual Onboarding"
description: "Work through the first challenge, onboarding a pair of \"on prem\" machines into Azure and adding agents."
layout: single
draft: false
series:
 - arc-servers-hack-proctor
weight: 2
---

## Tasks

Should be simple enough as this is a gentle intro.

1. Use the [arc-onprem-servers](https://github.com/azurecitadel/arc-onprem-servers) repo

    Deploy the two VMs. The README has the instructions.

    The `terraform output` has the password and connectivity info.

1. Generate the manual scripts

    Go to the [Servers - Azure Arc](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.HybridCompute%2Fmachines) page in the portal.

    Change the tags.

    Download.

1. Copy the file (or its contents) to a script on the target servers.

    Linux hints

    * In WSL the Downloads folder is there in /mnt/c/Users/\<username>/Downloads.

    * Either edit the file (e.g. code .) or copy

    * scp command format is

        ```bash
        scp /path/to/file <username>@<hostname>:/path/to/file
        ```

        The ssh command should give them the user and host part.

    * Example scp command (if stuck)

        ```bash
        scp /mnt/c/Users/richeney/Downloads/OnboardingScript.sh arcdemo@arclinuxvm-f7a1d2eb-linux1.uksouth.cloudapp.azure.com:/tmp
        ```

    * Log on using the ssh command in `terraform output` and run the script as root

        ```bash
        sudo /tmp/OnboardingScript.sh
        ```

    Windows hints

    * Same flow as for Linux, using [Remote Desktop](https://www.microsoft.com/p/microsoft-remote-desktop/9wzdncrfj3ps).

    * Go to Server Manager --> Local Server and switch off IEC for Admins. (Seriously, why is IE being shipped as the default browser? Embarrassing.)

    * If you are using the older Remote Desktop Connection you can upload the OnboardingScript.ps1 script up. With the newer universal app, Remote Desktop, then you just use the clipboard. Run the PowerShell ISE as Administrator.

    * Note that you don't need to switch off the Windows PowerShell execution policy as the Terraform does that when setting up WinRM. However, here is the command for reference:

    ```powershell
    Set-ExecutionPolicy Bypass -Scope Process
    ```

1. Check the Portal screen to make sure they are visible

## Success criteria

1. The two VMs are in the resource group
1. The resource provider type is **Microsoft.HybridCompute/machines**
1. Base Resource Graph query:

    ```text
    resources
    | where type == "microsoft.hybridcompute/machines"
    | project name,resourceGroup,tags.Owner,id
    ```

1. Extra points Resource Graph query:

    ```text
    resources
    | where type == "microsoft.hybridcompute/machines"
    | project name,resourceGroup,tags.Owner,properties.osName,id
    | project-rename owner=tags_Owner, OS=properties_osName
    ```
