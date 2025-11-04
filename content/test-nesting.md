---
title: "Nesting Test"
description: "Testing nested shortcodes"
tabs:
  - test1
  - test2
  - test3
---

# Simple Nesting Test

## Test 1: Flash in Mode

{{< modes >}}
{{< mode title="Test1" >}}

{{< flash >}}
This is a **flash** message with markdown.
{{< /flash >}}

Normal content here.

{{< /mode >}}
{{< /modes >}}

## Test 2: Details in Mode

{{< modes >}}
{{< mode title="Test2" >}}

{{< details "Click to expand" >}}
This is **details** content with markdown.

- List item 1
- List item 2
{{< /details >}}

{{< /mode >}}
{{< /modes >}}

## Test 3: Multiple Nesting

{{< modes >}}
{{< mode title="Test3" >}}

{{< flash >}}
Flash message first.
{{< /flash >}}

Some content between.

{{< details "More info" >}}
Details content here.

{{< flash >}}
Nested flash inside details!
{{< /flash >}}

{{< /details >}}

{{< /mode >}}
{{< /modes >}}