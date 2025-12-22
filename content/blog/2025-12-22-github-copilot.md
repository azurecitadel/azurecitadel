+++
Title = "GitHub Copilot CLI"
Date = 2025-12-22T00:00:00Z
people = ["Richard Cheney"]
tags = ["copilot", "ai", "cli"]
draft = false
+++

GitHub Copilot CLI is a powerful command-line tool that brings AI-powered assistance directly to your terminal. This guide walks through installation and configuration, including integration with Microsoft Learn documentation.

{{< flash >}}
**Disclaimer:** This blog post was largely created using GitHub Copilot CLI as a one-time experiment to test its capabilities. This is not representative of future content on Azure Citadel - we remain committed to quality, human-authored content and won't descend into AI slop. This was purely a technical demonstration of the tool's ability to generate structured documentation.

The human content on this page will be in these blue info boxes.
{{< /flash >}}

## Overview

GitHub Copilot CLI provides an interactive terminal assistant that helps with software engineering tasks. It can answer questions, execute commands, search codebases, and integrate with external tools through the Model Context Protocol (MCP). The CLI offers context-aware assistance while you work, making it easier to navigate complex tasks without leaving your terminal.

{{< flash >}}
I am often working with the newer technologies as part of my day job working with partner and I need to make sure that my references are fully up to date. After installing GitHub Copilot I will integrate with the Microsoft Learn MCP server to make sure that is the case, rather than relying on potentially stale training data.
{{< /flash >}}

## Install

First, ensure you have Node.js installed using nvm (Node Version Manager):

```bash
# Install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install a recent Node.js version (22 or later)
nvm install 22

# Set it as default
nvm alias default 22
nvm use default

# Install GitHub Copilot CLI globally
npm install -g @githubnext/github-copilot-cli
```

After installation, authenticate with GitHub:

```bash
github-copilot-cli auth
```

## Adding the Microsoft Learn MCP Server

The Microsoft Learn MCP server provides access to official Microsoft documentation directly within Copilot CLI.

To add the server:

1. Run the MCP server configuration command
2. Enter the server name: `microsoft-learn`
3. Select option `2` for HTTP transport
4. Enter the URL: `http://localhost:3000`
5. Save the configuration

This integration allows Copilot to search and fetch the latest Microsoft documentation when answering questions about Azure, .NET, PowerShell, and other Microsoft technologies.

## Creating Copilot Instructions

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

```bash
# For bash
source ~/.bashrc

# For zsh
source ~/.zshrc
```

Then verify the installation:

```bash
github-copilot-cli --version
```

You're now ready to use GitHub Copilot CLI with Microsoft Learn integration!

---

{{< flash >}}

## Additional info

### Initial GitHub Copilot CLI prompt

This is the prompt I used for this post:

> Create a blog post with today's date. It is a blog post about GitHub Copilot. Include H2 sections for an Overview, for Install (cli steps for npm, nvm, recent version install, default, and copilot install itself), for adding the Microsoft Learn MCP server (name, 2 for http, URL, save), for creating the $HOME/.copilot/copilot-instructions.md (use the current text), and restarting. Include a disclaimer that the whole post has been created using GitHub Copilot, and that is a one off for posts on this site - we won't descend into AI slop - but that it was just a test.

### Correcting the versions

GitHub Copilot created commands based on the technical preview rather than the public preview. My prompt did not specify the version.

- I updated the commands to install Node.js 22. It initially suggested Node.js 18 which would have caused an issue with the newer version
- I switched the install command from `npm install -g @githubnext/github-copilot-cli` to `npm install -g @github/copilot@latest`.
- Updated version command from `github-copilot-cli --version` to `copilot --version` as `copilot` is the new alias.

I asked Copilot about the two versions and this is what I got back:

> Yes, @github/copilot@latest is the stable, officially supported CLI, while @githubnext/github-copilot-cli was the experimental/leading-edge preview that's now largely superseded. @github/copilot is currently in public preview with full GitHub support, offering advanced agentic capabilities, deep GitHub integration, and security policy enforcement. The @githubnext version was GitHub Next's technical preview focused on command translation and has been deprecated in favor of the official CLI.

### Moving the disclaimer

I also moved the disclaimer up to the top of the post. I always like to know when I'm looking at AI generated content myself.

{{< /flash >}}
