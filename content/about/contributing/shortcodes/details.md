---
title: "details"
description: "Custom. Create collapsible content sections with a clickable summary header."
menu:
  side:
    parent: 'shortcodes'
series:
 - shortcodes
---

## Hugo shortcode

The `details` shortcode creates a collapsible section with a clickable summary. It takes one parameter for the summary text and renders the inner content as markdown.

```text
{{</* details "Click to expand" */>}}
This content is hidden by default and will be revealed when the user clicks on the summary.

You can include:
- **Markdown formatting**
- Lists and code blocks
- Images and links
{{</* /details */>}}
```

## Raw variant

There's also a `details_raw` variant that doesn't process the inner content as markdown:

```text
{{</* details_raw "Raw content" */>}}
<p>This HTML will be rendered as-is without markdown processing.</p>
{{</* /details_raw */>}}
```

## Example

{{< details "Show example content" >}}
This is an example of collapsible content using the details shortcode.

**Features:**

- Content is hidden by default
- Clickable summary header
- Supports full markdown formatting
- Great for optional information, troubleshooting steps, or detailed explanations

```bash
# You can even include code blocks
echo "This is hidden until expanded"
```

{{< /details >}}

## Use cases

- **Optional information**: Hide detailed explanations that not all users need
- **Troubleshooting sections**: Keep solutions collapsed until needed
- **Advanced configuration**: Show basic steps by default, hide complex options
- **FAQ sections**: Questions visible, answers hidden until clicked
- **Code examples**: Show the concept, hide implementation details