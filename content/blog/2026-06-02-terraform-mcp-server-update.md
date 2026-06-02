+++
Title = "Terraform MCP Server update"
Date = 2026-06-02T00:00:00Z
people = ["Richard Cheney"]
tags = ["terraform", "mcp", "copilot", "ai", "docker"]
draft = false
+++

The Terraform MCP Server has evolved significantly since I covered it in the [Fabric Terraform series](/fabric/expanding). It has moved well beyond a simple registry lookup tool and is now at v0.5.2. Here is a summary of what has changed and how to think about which configuration is right for you.

{{< flash >}}
Note that this post was largely generated using GitHub Copilot CLI (Claude Opus 4.6) as I used it to compare my previous post with the new functionality rolled into the Terraform MCP server. I had a conversation to understand the changes, the most secure MCP server types, and the simplest route for most users given different scenarios. I figured the output was useful enough to warrant a quick blog post.
{{< /flash >}}

## What has changed?

### HCP Terraform and Terraform Enterprise integration (v0.3.0)

The biggest change. The server can now authenticate with HCP Terraform or Terraform Enterprise using `TFE_TOKEN` and `TFE_ADDRESS` environment variables, unlocking full workspace management via Copilot agent mode — creating and deleting workspaces, managing variables and tags, triggering runs, attaching policy sets, inspecting plan and apply logs, and more.

As a result the JSON configuration changed. For v0.3.0 and above you pass the credentials as environment variables into the Docker container:

```json
{
  "servers": {
    "terraform": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e", "TFE_TOKEN=${input:tfe_token}",
        "-e", "TFE_ADDRESS=${input:tfe_address}",
        "hashicorp/terraform-mcp-server:0.5.2"
      ]
    }
  },
  "inputs": [
    {
      "type": "promptString",
      "id": "tfe_token",
      "description": "Terraform API Token",
      "password": true
    },
    {
      "type": "promptString",
      "id": "tfe_address",
      "description": "Terraform Address",
      "password": false
    }
  ]
}
```

The `inputs` block is a VS Code feature that prompts you securely for values at startup — a clean way to avoid hardcoding credentials.

If you are only using the public registry (no HCP Terraform or TFE), you do not need the credentials at all and the original simpler config still works fine — just pin a version tag:

```json
{
  "servers": {
    "terraform": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "hashicorp/terraform-mcp-server:0.5.2"
      ]
    }
  }
}
```

### Toolsets and tool filtering (v0.4.0)

With so many new tools the server now supports `--toolsets` and `--tools` flags to selectively enable groups or individual tools. The available toolsets are:

| Toolset | Description |
|---|---|
| `registry` | Public Terraform Registry — providers, modules, policies |
| `registry-private` | Private registry in HCP Terraform or TFE |
| `terraform` | Workspace operations, runs, variables, policy sets, stacks |
| `all` | Everything |

The default is `registry` only, which keeps the tool count low and is appropriate for most developers. The 128-tool limit in GitHub Copilot agent mode is still worth keeping in mind.

### Notable new tools

A flavour of what has been added across the versions:

- **v0.3.0**: Workspaces, organisations, projects, workspace variables and tags, runs, variable sets, private registry
- **v0.3.2**: `get_provider_capabilities`, `create_no_code_workspace`
- **v0.4.0**: Policy sets, Stacks (`list_stacks`, `get_stack_details`), `get_token_permissions`
- **v0.5.0**: `get_plan_json_output`, `get_plan_details`, `get_plan_logs`, `get_apply_details`, `get_apply_logs`
- **v0.5.3**: `get_sentinel_mock`

### Additional IDE support

The README now includes configuration examples for Cursor, Claude Desktop, Claude Code, Gemini, Amazon Q Developer, Kiro CLI, and Bob IDE — not just VS Code.

## Is stdio still the right choice?

Yes, for individual developers. Stdio is actually the more secure transport — the MCP server runs as a child process communicating over stdin/stdout with no network port exposed. There is no remote attack surface.

The streamable HTTP transport opens a network port and requires additional hardening (CORS, TLS, rate limiting). HashiCorp's own documentation recommends running locally at `127.0.0.1` and only exposing remotely with additional security controls in place. There is no public hosted HTTPS endpoint from HashiCorp for the registry.

## When does a shared hosted instance make sense?

If your team has a private Terraform registry (HCP Terraform or Terraform Enterprise), hosting a single shared MCP server instance makes sense. Rather than every developer running Docker locally with their own token, you can centralise:

- Credential management (`TFE_TOKEN` configured once)
- Private registry and workspace tool access for the whole team
- Credential rotation in one place

**Azure Container Apps** is the natural fit for this — it scales to zero when idle so costs nothing between uses, provides built-in HTTPS ingress, and supports managed identity for back-end authentication. Microsoft has [official documentation](https://learn.microsoft.com/en-us/azure/container-apps/mcp-overview) for hosting MCP servers on ACA.

## Decision tree

| Scenario | Recommended config |
|---|---|
| Solo dev, public registry only | Local Docker, stdio, no credentials |
| Solo dev, HCP Terraform / TFE | Local Docker, stdio, with `TFE_TOKEN` |
| Team, public registry only | Local Docker per developer — no shared state needed |
| Team, private registry / HCP Terraform | Shared Azure Container Apps instance |

## Updating the Fabric Terraform series

The [Expanding your config](/fabric/expanding) page in the Fabric Terraform series uses the simple registry-only configuration, which still works. The only change worth making there is pinning the image version rather than using `latest`. If you are working with a team on a shared private registry, the ACA-hosted approach above is the upgrade path.
