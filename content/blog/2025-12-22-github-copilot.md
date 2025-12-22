+++
Title = "GitHub Copilot CLI"
Date = 2025-12-22T00:00:00Z
people = ["Richard Cheney"]
tags = ["copilot", "ai", "cli"]
draft = false
+++

GitHub Copilot CLI is a powerful command-line tool that brings AI-powered assistance directly to your terminal. This guide walks through installation and configuration, including integration with Microsoft Learn documentation.

## Overview

GitHub Copilot CLI provides an interactive terminal assistant that helps with software engineering tasks. It can answer questions, execute commands, search codebases, and integrate with external tools through the Model Context Protocol (MCP). The CLI offers context-aware assistance while you work, making it easier to navigate complex tasks without leaving your terminal.

I am often working with the newer technologies as part of my day job working with partner and I need to make sure that my references are fully up to date. After installing GitHub Copilot I will integrate with the Microsoft Learn MCP server to make sure that is the case, rather than relying on potentially stale training data.

## Install

### Node.js and nvm

First, ensure you have Node.js installed using nvm (Node Version Manager).

This guide is based on installing nvm and Node.js into [WLS2](https://learn.microsoft.com/windows/dev-environment/javascript/nodejs-on-wsl), but you can also find guides for [Windows](https://learn.microsoft.com/windows/dev-environment/javascript/nodejs-on-windows) and other OS.

1. Install nvm

    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
    ```

1. Install a supported Node.js version (22 or later)

    ```bash
    nvm install 22
    ```

1. Set it as default

    ```bash
    nvm alias default 22
    nvm use default
    ```

1. Show the installed versions and the currently set version.

    ```bash
    nvm ls
    ```

### GitHub CLI

1. Install GitHub Copilot CLI

    ```bash
    npm install -g @github/copilot@latest
    ```

1. Verify the installation

    ```bash
    copilot --version
    ```

    Example output:

    ```text
    0.0.372
    Commit: 5534560
    ```

1. Start GitHub Copilot at the CLI

    ```bash
    copilot
    ```

1. Authenticate to the GitHub MCP Server

    ```bash
    /login
    ```

    Follow the guided instructions.

## Adding the Microsoft Learn MCP Server

The GitHub Copilot CLI is already set up with the GitHub MCP Server with a subset of tools suitable for CLI use. (You can override this with a switch to use the full set of tools.)  GitHub Copilot will use the same set of stored credentials tha the GitHub CLI uses when connecting to the integrated GitHub MCP server.

In this section we will look at the process to add MCP servers. Here we'll add the Microsoft Learn MCP server to provide access to official Microsoft documentation directly within Copilot CLI.

1. Start GitHub Copilot at the CLI

    ```bash
    copilot
    ```

1. Run the MCP server configuration command

    ```bash
    /mcp add
    ```

1. Enter the server name

    ```text
    Microsoft-Learn
    ```

1. Select option `2` for HTTP transport
1. Enter the URL

    ```text
    https://learn.microsoft.com/api/mcp
    ```

1. Save the configuration
1. Use `q` to quit the wizard

The will create a ~/.copilot/mcp-config.json file.

```json
{
  "mcpServers": {
    "Microsoft-Learn": {
      "type": "http",
      "url": "https://learn.microsoft.com/api/mcp",
      "headers": {},
      "tools": [
        "*"
      ]
    }
  }
}
```

## Creating Copilot instructions

Create a custom instructions file to enhance Copilot's behavior:

```bash
mkdir -p $HOME/.copilot
cat > $HOME/.copilot/copilot-instructions.md << 'EOF'
# Copilot Instructions

## Microsoft Documentation

When answering questions about Microsoft technologies (Azure, .NET, C#, F#, ASP.NET Core, Microsoft.Extensions, NuGet, Entity Framework, PowerShell, Azure CLI, etc.), always use the `microsoft_docs_search`, `microsoft_docs_fetch`, or `microsoft_code_sample_search` MCP tools to verify information against official Microsoft Learn documentation.

These tools provide access to the latest official documentation and may contain more detailed or newer information than the training data.
EOF
```

This configuration ensures that Copilot always references official Microsoft documentation when answering questions about Microsoft technologies.

## Restarting

After making configuration changes, restart your terminal session or reload your shell configuration:

1. Restart by sourcing your config

    ```bash
    source ~/.bashrc
    ```

    Use `source ~/.zshrc` for zsh.

You're now ready to use GitHub Copilot CLI with Microsoft Learn integration!
