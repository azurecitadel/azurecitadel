+++
Title = "GitHub Copilot CLI and WorkIQ"
Date = 2026-02-12T00:00:00Z
people = ["Richard Cheney"]
tags = ["copilot", "workiq", "cli"]
draft = false
+++

How do you add Work IQ as an MCP server if your GitHub Copilot CLI is running in WSL2? Here is an option that was shared with me when I hit into a security policy at work. I thought I'd pass it forward.

Adding MCP tools into GitHub Copilot gives an amazing extensibility and also allow Copilot's various models to reason across context from multiple sources. In the last blog I added the Microsoft Learn MCP server to GitHub Copilot (GHCP) which I run in Ubuntu in WSL2.

Microsoft's three IQ products were announced at Ignite back in November and extend Microsoft 365 Copilot with greater context:

- **Work IQ** provides insights into you, your organisation, people you work with, and your work
- **Fabric IQ** enables analytics and business intelligence across the data estate and its ontology
- **Foundry IQ** offers amazing agentic RAG grounding with defined knowledge bases and extended knowledge source support

We'll see lots of use cases with agentic AI leveraging these - and often together - but I thought I'd start simple and bring my work context into my conversations with GitHub Copilot.

## WSL2 Issue

After following the official [Work IQ MCP preview](https://learn.microsoft.com/microsoft-365-copilot/extensibility/workiq-overview) instructions it all looked good, but I then came up against a security policy issue that prevented me from using it. Work IQ was permitted on enrolled devices, and WSL2's subsystem does not show up that way.

## Workaround

The answer is to reconfigure the MCP server to run at the Windows OS level, rather than natively in the WSL2 subsystem. THis is easy as WSL2 supports running [Windows commands](https://learn.microsoft.com/windows/wsl/filesystems#run-windows-tools-from-linux) directly within the subsystem.

Here's how to configure it.

## Installing Work IQ at the Windows OS level

Open PowerShell as admin. (I right click on the Windows icon, select **Terminal (Admin)**, and then open PowerShell 7.)

1. Install NodeJS if you don't have it.

    ```powershell
    winget install OpenJS.NodeJS.LTS
    ```

1. Find the most recent tarball for Work IQ

    ```powershell
    npm view @microsoft/workiq dist.tarball
    ```

    {{< output "Example output" >}}
```text
https://registry.npmjs.org/@microsoft/workiq/-/workiq-0.2.8.tgz
```
{{< /output >}}

    Or run the command without dist.tarball to get detailed release info (from `npm help view`).

    ```powershell
    npm view @microsoft/workiq
    ```
    {{< output "Example output" >}}
{{< raw style="color:white; background-color:black" >}}
<pre>
<span style="text-decoration:underline;"></span><span style="text-decoration:underline;color:aqua;">@microsoft/workiq@0.2.8</span><span style="text-decoration:underline;"></span> | <span style="color:lime;">SEE EULA</span> | deps: <span style="color:aqua;">none</span> | versions: <span style="color:aqua;">4</span>
MCP server for Microsoft 365 Copilot
<span style="color:#3333FF;">https://github.com/microsoft/work-iq-mcp#readme</span>

keywords: <span style="color:aqua;">copilot</span>, <span style="color:aqua;">m365</span>, <span style="color:aqua;">mcp</span>, <span style="color:aqua;">mcp-server</span>, <span style="color:aqua;">ai</span>, <span style="color:aqua;">agents</span>, <span style="color:aqua;">workiq</span>

bin: <span style="color:aqua;">workiq</span>

dist
.tarball: <span style="color:#3333FF;">https://registry.npmjs.org/@microsoft/workiq/-/workiq-0.2.8.tgz</span>
.shasum: <span style="color:lime;">f1b934c506994cde6c87a94e00349f792d105ff7</span>
.integrity: <span style="color:lime;">sha512-pbgnJDLPGrsYb5mCY6WzFtUNcRwSHkll7phgx+DZXSDbZoPs6mDJtQ2s39606Rp8qpx7b3OrkfFOr0SuzPIVEA==</span>
.unpackedSize: <span style="color:#3333FF;">119.0 MB</span>

maintainers:
- <span style="color:#3333FF;">microsoft1es</span> &lt;npmjs@microsoft.com&gt;
- <span style="color:#3333FF;">microsoft-oss-releases</span> &lt;microsoft-oss-publishing@microsoft.com&gt;

dist-tags:
<span style="color:#3333FF;">latest</span>: 0.2.8

published <span style="color:aqua;">2 weeks ago</span> by <span style="color:#3333FF;">microsoft1es</span> &lt;npmjs@microsoft.com&gt;
</pre>
{{< /raw >}}
{{< /output >}}

1. Install Work IQ globally

    ```powershell
    npm.cmd install -g https://registry.npmjs.org/@microsoft/workiq/-/workiq-0.2.8.tgz
    ```

1. Close down and then reopen PowerShell

1. Accept the EULA

    ```powershell
    workiq.cmd accept-eula
    ```

1. Test it out

    ```powershell
    workiq.cmd ask --question "Who is my manager?"
    ```

## Reconfiguring Work IQ in WSL2

1. Open GitHub Copilot CLI

    ```bash
    copilot
    ```

1. Remove the workiq plugin

    The default commands install Work IQ as a plugin using npx. If you have it and need too remove it:

    ```bash
    /plugin uninstall workiq
    ```

1. Add in the WorkIQ MCP server

    ```bash
    /mcp add WorkIQ
    ```

    This will open up the interactive MCP addition and the name will have been prepopulated.

    - Leave the **Server Type** as **Local**.
    - Set the **Command**

        ```powershell
        powershell.exe -c "workiq.cmd mcp"
        ```

    Leave the other fields as default and save with **ctrl**+**s**.

1. Display the MCP server

    ```bash
    /mcp show WorkIQ
    ```

    {{< output "Example Output" >}}

```text
● MCP Server: WorkIQ

  Type: local
  Command: powershell.exe
  Status: Enabled

  Tools (2/2 enabled):
    ✓ accept_eula: Accept the End User License Agreement (EULA) to enable full ...
    ✓ ask_work_iq: Ask a question to Microsoft 365 Copilot for information abou...
```

{{< /output >}}

1. Display as JSON

    You can run shell commands within GutHub Copilot CLI bu either prefixing them with `!` or by using **shift*+**tab**. Either way will switch you into the yellow Shell mode.

    ```shell
    jq < ~/.copilot/mcp-config.json
    ```

    {{< output "Example mcp-config.json" >}}

```json
{
  "mcpServers": {
    "MicrosoftLearn": {
      "tools": [
        "*"
      ],
      "type": "http",
      "url": "https://learn.microsoft.com/api/mcp",
      "headers": {}
    },
    "WorkIQ": {
      "type": "local",
      "command": "powershell.exe",
      "tools": [
        "*"
      ],
      "args": [
        "-c",
        "workiq.cmd mcp"
      ]
    }
  }
}
```

{{< /output >}}

## Work IQ in use

Now that Work IQ is configured as an MCP server, you can ask GitHub Copilot CLI questions about your work context and it will use the WorkIQ MCP to query your Microsoft 365 data.

{{< output "GitHub Copilot CLI with WorkIQ:" >}}
![GitHub Copilot CLI with WorkIQ MCP server displaying a question about work context being answered using Microsoft 365 data](/blog/images/2026-02-13-github-copilot-workiq.png)
{{< /output >}}

This demonstrates the power of combining GitHub Copilot CLI with Work IQ - you can now ask questions about your work context and get answers directly within your development workflow.
