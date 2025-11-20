---
title: "gist"
description: "Inbuilt. Include GitHub gist files in your markdown. Great for logs, small scripts etc."
menu:
  side:
    parent: 'shortcodes'
series:
 - shortcodes
---

## Source Gist

<https://gist.github.com/richeney/ff7850d83d394ef4213c24f53bbfaf02>

## Hugo Shortcode

`````text
{{</* gist richeney ff7850d83d394ef4213c24f53bbfaf02 */>}}
`````

## Example

{{< gist richeney ff7850d83d394ef4213c24f53bbfaf02 >}}

The shortcode does not respect dark mode. Feel free to override the gist-embed.css file using the <https://codersblock.com/blog/customizing-github-gists/> blob post as a guide.
