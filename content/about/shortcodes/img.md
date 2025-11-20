---
title: "img"
description: "Custom. GitHub-style responsive images that adapt to both system preference and manual theme toggle."
menu:
  side:
    parent: 'shortcodes'
series:
 - shortcodes
---

Inspired by [GitHub's theme-responsive images](https://github.blog/changelog/2022-05-19-specify-theme-context-for-images-in-markdown-beta/), this shortcode creates images that automatically switch between light and dark variants based on the current theme mode.

**Key Features:**

- ✅ Works with system `prefers-color-scheme`
- ✅ Responds to manual theme toggle
- ✅ GitHub-style styling with borders and hover effects
- ✅ Cross-tab synchronization
- ✅ Print-friendly (uses light version)

## Example HTML Output

```html
<p class="theme-responsive-image">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="/about/images/dark.png" data-dark-src="/about/images/dark.png">
    <source media="(prefers-color-scheme: light)" srcset="/about/images/light.png" data-light-src="/about/images/light.png">
    <img alt="Shows a sun in light mode and a moon in dark mode."
         src="/about/images/light.png"
         data-light-src="/about/images/light.png"
         data-dark-src="/about/images/dark.png"
         data-theme-responsive="true">
  </picture>
</p>
```

## Hugo shortcode

```text
{{</* img light="/about/images/light.png" dark="/about/images/dark.png" alt="Shows a sun in light mode and a moon in dark mode." */>}}
```

**Parameters:**

- `light` - Image for light theme
- `dark` - Image for dark theme
- `src` - Fallback image (optional)
- `alt` - Alt text (recommended for accessibility)
- `class` - Additional CSS classes (optional)

## Example

{{< img light="/about/images/light.png" dark="/about/images/dark.png" alt="Shows a sun in light mode and a moon in dark mode." >}}
