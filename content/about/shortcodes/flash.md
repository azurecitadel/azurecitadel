---
title: "flash"
description: "Custom. Create alert boxes with markdown content in different colors."
menu:
  side:
    parent: 'shortcodes'
series:
 - shortcodes
---

## Hugo shortcode

The flash shortcode supports different types: `note` (default), `tip`, `warning`, and `danger`.

```text
{{</* flash */>}}
Default blue note box for general information.
{{</* /flash */>}}

{{</* flash "tip" */>}}
Green tip box for helpful suggestions.
{{</* /flash */>}}

{{</* flash "warning" */>}}
Yellow warning box for important notices.
{{</* /flash */>}}

{{</* flash "danger" */>}}
Red danger box for critical alerts.
{{</* /flash */>}}
```

## Examples

### Default (Note)

{{< flash >}}
List of role assignments (permissions):

* **Virtual Machine Contributor**
* **Azure Connected Machine Resource Administrator**
* **Monitoring Contributor**
* **Log Analytics Contributor**
{{< /flash >}}

### Tip

{{< flash "tip" >}}
**Pro tip:** Use the Azure CLI with `--query` parameter to filter results and reduce output size.

You can also use `--output table` for better readability in the terminal.
{{< /flash >}}

### Warning

{{< flash "warning" >}}
**Important:** This action will modify your Azure subscription settings. Make sure you have:

1. Proper permissions (Contributor or Owner role)
2. Backup of current configuration
3. Tested the changes in a development environment first
{{< /flash >}}

### Danger

{{< flash "danger" >}}
**Critical:** The following operation will **permanently delete** all resources in the resource group.

This action **cannot be undone**. Ensure you have backups of any important data before proceeding.
{{< /flash >}}
