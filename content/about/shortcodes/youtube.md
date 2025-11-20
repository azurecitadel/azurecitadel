---
title: "youtube"
description: "Inbuilt. Embed Youtube videos into your pages."
menu:
  side:
    parent: 'shortcodes'
series:
 - shortcodes
---

## Example HTML

```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/UKBp7LID-go?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
```

## Hugo Shortcode

```text
{{</* youtube id="UKBp7LID-go" */>}}
```

## Example

{{< youtube id="UKBp7LID-go" autoplay="false" >}}

You can also add `autoplay="true"` as an additional argument.
