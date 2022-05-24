---
title: "img"
description: "Custom. Specify different images to match the system light and dark modes used by the Azure Citadel site theme."
menu:
  side:
    parent: 'shortcodes'
series:
 - shortcodes
---

Inspired by the [GitHub post](https://github.blog/changelog/2022-05-19-specify-theme-context-for-images-in-markdown-beta/), this shortcode enables you to use light / dark mode appropriate images using the `prefers-color-scheme` feature.

## Example HTML

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/about/images/dark.png">
  <img alt="Shows a sun in light mode and a moon in dark mode." src="/about/images/light.png">
</picture>
```

## Hugo shortcode

```text
{{</* img light="/about/images/light.png" dark="/about/images/dark.png" alt="Shows a sun in light mode and a moon in dark mode." */>}}
```

Pick any two named variables from `src`, `light` and `dark`. The `alt` text is optional but recommended for inclusivity.

## Example

{{< img light="/about/images/light.png" dark="/about/images/dark.png" alt="Shows a sun in light mode and a moon in dark mode." >}}
