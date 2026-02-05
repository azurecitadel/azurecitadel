---
headless: true
title: "Azure landing zone Library - Local Library - SLZ add on"
description: "Add SLZ overrides to the local library"
---

As you are using the Sovereign landing zone then run these commands to extend the default local library with additional override files for the additional archetypes found in the Sovereign landing zone.

{{< flash "warning" >}}
⚠️ As well as adding the additional override files, these commands will also overwrite the following files:

- **lib/alz_library_metadata.json** - library dependency on the Sovereign landing zone, which has its own dependency on the Azure landing zone
- **lib/architecture_definitions/alz_custom.alz_architecture_definition.yaml** - additional archetype overrides
{{< /flash >}}

{{< tabs >}}

{{< tab title="Bash" >}}

These commands are designed for Bash on a Linux/macOS system. Ensure that you are in the root of your Azure landing zone repo.

```bash
tmp=$(mktemp -d)
git clone -n --depth=1 --filter=tree:0 "https://github.com/Azure/alz-terraform-accelerator" "$tmp"
lib_folder_path="templates/platform_landing_zone/examples/slz/lib"
git -C "$tmp" sparse-checkout set --no-cone "$lib_folder_path"
git -C "$tmp" checkout
cp -r "$tmp/$lib_folder_path" .
rm -rf "$tmp"
```

{{< /tab >}}
{{< tab title="PowerShell" >}}

These commands are designed for PowerShell on a Windows system. Ensure that you are in the root of your Azure landing zone repo.

```powershell
$tmp = Join-Path $env:TEMP (New-Guid)
New-Item -ItemType Directory -Path $tmp
git clone -n --depth=1 --filter=tree:0 "https://github.com/Azure/alz-terraform-accelerator" "$tmp"
$lib = "templates/platform_landing_zone/examples/slz/lib"
git -C $tmp sparse-checkout set --no-cone $lib
git -C $tmp checkout
Copy-Item -Path "$tmp/$lib" -Recurse -Force
Remove-Item -Path $tmp -Recurse -Force
```

{{< /tab >}}
{{< /tabs >}}

These code blocks are fundamentally the same as the ones used to initialise the local library, but extend it using the [slz lib add on folder](https://github.com/Azure/alz-terraform-accelerator/raw/refs/heads/main/templates/platform_landing_zone/examples/slz/lib) from the same ALZ Accelerator repo.
