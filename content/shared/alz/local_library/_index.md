---
headless: true
title: "Azure Landing Zones Library - Local Library"
description: "Simple code blocks for creating a local library"
---

{{< tabs >}}

{{< tab title="Bash" >}}

These commands are designed for Bash on a Linux/macOS system. Ensure that you are in the root of your Azure Landing Zone repo.

```bash
tmp=$(mktemp -d)
git clone -n --depth=1 --filter=tree:0 "https://github.com/Azure/alz-terraform-accelerator" "$tmp"
lib_folder_path="templates/platform_landing_zone/lib"
git -C "$tmp" sparse-checkout set --no-cone "$lib_folder_path"
git -C "$tmp" checkout
cp -r "$tmp/$lib_folder_path" .
rm -rf "$tmp"
```

{{< /tab >}}
{{< tab title="PowerShell" >}}

These commands are designed for PowerShell on a Windows system. Ensure that you are in the root of your Azure Landing Zone repo.

```powershell
$tmp = Join-Path $env:TEMP (New-Guid)
New-Item -ItemType Directory -Path $tmp
git clone -n --depth=1 --filter=tree:0 "https://github.com/Azure/alz-terraform-accelerator" "$tmp"
$lib = "templates/platform_landing_zone/lib"
git -C $tmp sparse-checkout set --no-cone $lib
git -C $tmp checkout
Copy-Item -Path "$tmp/$lib" -Recurse -Force
Remove-Item -Path $tmp -Recurse -Force
```

{{< /tab >}}
{{< /tabs >}}

The code blocks creates a local library using similar logic to the documentation for the Azure Landing Zone accelerator, and pulls the [example lib folder](https://github.com/Azure/alz-terraform-accelerator/raw/refs/heads/main/templates/platform_landing_zone/lib) from the ALZ Accelerator repo.
