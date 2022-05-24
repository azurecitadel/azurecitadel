---
title: "raw"
description: "Custom. Embed raw HTML code when markdown doesn't go far enough. The example shows how to capture coloured ASCII output from terraform."
menu:
  side:
    parent: 'shortcodes'
series:
 - shortcodes
---

## Hugo Shortcode

In this example we capture the coloured ASCII output from `terraform`. This assumes you are using bash in a supporting terminal (e.g. Microsoft Terminal) and you will need to pre-install `aha`.

1. Run a command through aha

    For example:

    ```bash
    terraform validate | aha --black
    ```

    Truncated output, showing only the `<body></body>` section:

    ```html
    <body style="color:white; background-color:black">
    <pre>
    <span style="color:lime;"></span><span style="color:lime;font-weight:bold;">Success!</span> The configuration is valid.
    </pre>
    </body>
    ```

1. Use the `raw` shortcode

    Add a `raw` shortcode section into your markdown. Add in the HTML, moving the `<body>` styling into the `<pre>` as per the example below:

    ```text
    {{</* raw */>}}
    <pre style="color:white; background-color:black">
    <span style="color:lime;"></span><span style="color:lime;font-weight:bold;">Success!</span> The configuration is valid.
    </pre>
    {{</* /raw */>}}
    ```

Check the .md files in /content/terraform for examples.

## Example

{{< raw >}}
<pre style="color:white; background-color:black">
<span style="color:lime;"></span><span style="color:lime;font-weight:bold;">Success!</span> The configuration is valid.
</pre>
{{< /raw >}}
