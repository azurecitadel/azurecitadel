---
title: "output"
description: "Custom. Display expected command output with visual distinction from input commands."
menu:
  side:
    parent: 'shortcodes'
series:
 - shortcodes
---

## Hugo shortcode

The `output` shortcode creates a visually distinct section for displaying expected command output. It adds an "Expected output:" label and applies a dark grey background to code blocks within it, helping differentiate command input from expected results.

```text
{{</* output */>}}
Your expected output content goes here.
You can include code blocks with syntax highlighting.
{{</* /output */>}}
```

## Usage with different languages

The shortcode supports all standard markdown code block syntax highlighting. You can include any language-specific code blocks within the output shortcode, and they will render with the dark grey background to distinguish them from command input.

### Parameters

The output shortcode accepts two optional parameters:

1. **Label text** (default: "Expected output:"):
   - Use custom text to replace the default label
   - Use empty string `""` to hide the label entirely
2. **Details title**: If provided, wraps the output in a collapsible details section

### Usage variants

```text
{{</* output */>}}                                    <!-- Default label -->
{{</* output "API Response:" */>}}                    <!-- Custom label -->
{{</* output "" */>}}                                 <!-- No label -->
{{</* output "Expected output:" "Show output" */>}}   <!-- Collapsible with default label -->
{{</* output "Results:" "Click to expand" */>}}       <!-- Collapsible with custom label -->
{{</* output "" "Show details" */>}}                  <!-- Collapsible with no label -->
```

## Example with JSON output

{{< output >}}
```json
{
    "name": "@microsoft/workiq",
    "version": "0.2.8",
    "description": "MCP server for Microsoft 365 Copilot",
    "keywords": ["copilot", "m365", "mcp"],
    "bin": {
        "workiq": "./bin/workiq"
    }
}
```
{{< /output >}}

## Example with CLI output

{{< output >}}
```text
workiq.cmd ask --question "Who is my manager?"

Query: Who is my manager?
Result: Based on your organizational data, your manager is John Smith (john.smith@company.com).
```
{{< /output >}}

## Example with custom label

{{< output "API Response:" >}}
```json
{
    "success": true,
    "data": {
        "userId": "123",
        "email": "user@example.com"
    }
}
```
{{< /output >}}

## Example with no label

{{< output "" >}}
```text
Connection established successfully
Authenticated as: admin@domain.com
Ready to proceed...
```
{{< /output >}}

## Example with collapsible details

{{< output "Expected output:" "Click to see full npm output" >}}
```text
npm WARN deprecated har-validator@5.1.5: this library is no longer supported
npm WARN deprecated uuid@3.4.0: Please upgrade to version 7 or higher
npm WARN deprecated request@2.88.2: request has been deprecated

added 847 packages, and audited 848 packages in 45s
found 0 vulnerabilities
```
{{< /output >}}

## Example with custom collapsible label

{{< output "Console log:" "Show debug output" >}}
```text
[DEBUG] Starting application initialization
[INFO] Loading configuration from config.json
[DEBUG] Database connection established
[INFO] Server listening on port 3000
[DEBUG] All middleware loaded successfully
```
{{< /output >}}

## Visual distinction

The output shortcode provides clear visual separation between:
- **Command input**: Standard code blocks with the theme's default styling
- **Expected output**: Dark grey background (#161b22) matching the theme's subtle canvas color

This helps readers quickly distinguish between what they should type and what they should expect to see.