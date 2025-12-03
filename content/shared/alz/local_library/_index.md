---
headless: true
title: "Azure Landing Zones Library - Local Library"
description: "Simple code blocks for creating a local library"
---

{{< tabs >}}

{{< tab title="Bash" >}}

```bash
commands
```

{{< /tab >}}
{{< tab title="PowerShell" >}}

```powershell
$tempFolderName = "~/accelerator/temp"
New-Item -ItemType "directory" $tempFolderName
$tempFolder = Resolve-Path -Path $tempFolderName
git clone -n --depth=1 --filter=tree:0 "https://github.com/Azure/alz-terraform-accelerator" "$tempFolder"
cd $tempFolder

$libFolderPath = "templates/platform_landing_zone/lib"
git sparse-checkout set --no-cone $libFolderPath
git checkout
cd ~
Copy-Item -Path "$tempFolder/$libFolderPath" -Destination "~/accelerator/config" -Recurse -Force
Remove-Item -Path $tempFolder -Recurse -Force
```

{{< /tab >}}
{{< /tabs >}}
