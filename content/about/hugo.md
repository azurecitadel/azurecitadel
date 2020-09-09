---
title: "Shortcodes"
description: "Hugo specific shortcodes for embedding content."
menu:
  side:
    parent: 'About'
    weight: 9
---

## Introduction

Most of the updated content for the Hugo site should just be standard markdown prefaced with the Hugo Front Matter section.

However Hugo also has a number of options outside of the markdown standard. Some of the most common are listed below.

## Shortcodes

The Hugo [shortcodes](https://gohugo.io/content-management/shortcodes/) are very useful for embedding tweets, Instagram posts, Vimeo videos, etc.

### Youtube

**Example HTML**:

```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/UKBp7LID-go?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
```

**Hugo Shortcode**:

```text
{{</* youtube id="UKBp7LID-go" */>}}
```

**Example**:

{{< youtube id="UKBp7LID-go" autoplay="false" >}}

You can also add `autoplay="true"` as an additional argument.

### Gist

You can add in your GitHub Gists. Great for logs, small scripts etc.

**Source Gist**:

<https://gist.github.com/richeney/ff7850d83d394ef4213c24f53bbfaf02>

**Hugo Shortcode**:

`````text
{{</* gist richeney ff7850d83d394ef4213c24f53bbfaf02 */>}}
`````

**Example**:

{{< gist richeney ff7850d83d394ef4213c24f53bbfaf02 >}}
