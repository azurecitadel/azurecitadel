---
title: "Expanding your Terraform config"
description: "A few tips to build out your config. A collection of friendly URLs, tips of using the Fabric CLI and Terraform Model Context Protocol (MCP) server, plus the native Git integration for Fabric workspaces."
layout: single
draft: false
menu:
  side:
    parent: fabric
    identifier: fabric-expanding
series:
 - fabric_terraform_administrator
weight: 80

---

## Introduction

OK, we have spent a lot of time with tooling, with configuring app registrations and managed identity for the user context and CI/CD scenarios, plus working with repos and pipelines.

You are set to develop faster with a Git repo in the user context and then switch to the productionised version in the cloud Git provider and deployment.

This page covers some useful tooling and additional links to help you on your way as you expand your Terraform config in the fabric ecosystem.

## Fabric Terraform provider documentation

Resource number one is the provider documentation itself.
[Terraform on Microsoft Fabric Documentation](https://aka.ms/terraform/fabric)

Again, each resource and data source page will have information on whether the feature is preview or not, and whether it can be used by a service principal.

Let's look at an example for [Event Streams](https://registry.terraform.io/providers/microsoft/fabric/latest/docs/resources/eventstream).

![Screenshot of the Fabric Terraform provider documentation for the Event Stream resource](/fabric/images/fabricProvider_fabricEventStream.png)

Many of the attributes are pretty simple and well described in the documentation and examples, but some of the more complex attributes such as the format of the definition JSON are not well documented.

How do you find out what the content of the definition JSON template should look like?

## Using the Fabric CLI

This is where the Fabric CLI is absolute gold dust. A common workflow is to manually create a customised resource in the Fabric portal, then use the Fabric CLI to inspect and understand its configuration. This approach helps you bridge the gap between manual changes and infrastructure as code.

1. **Create the resource manually**

   In the Fabric portal, create your custom resource, such as an Event Stream and configure it as needed.

1. **Authenticate with the Fabric CLI**

    Authenticate into Fabric.

    ```shell
    fab auth login
    ```

    Check your authentication status.

    ```shell
    fab auth status
    ```

1. List the workspaces

    ```shell
    fab ls
    ```

    Example output:

    ```text
    My workspace.Personal
    aidwfactoryStreaming.Workspace
    aidwiotfactory.Workspace
    ```

1. List the resources in a workspace

    Example:

    ```text
    fab ls aidwiotfactory.Workspace
    ```

    Example output:

    ```text
    DataflowsStagingLakehouse.SemanticModel
    DataflowsStagingLakehouse.SQLEndpoint
    DataflowsStagingLakehouse.Lakehouse
    DataflowsStagingWarehouse.SemanticModel
    DataflowsStagingWarehouse.Warehouse
    IoT.Dashboard
    Test.Report
    Test OneLake.Report
    Test OneLake_Dataset_2080000_651f1831-8e0a-f011-bae2-000d3a3012e8.SemanticModel
    Test_Dataset_2080000_a508f593-770a-f011-bae2-000d3a3012e8.SemanticModel
    aidwBronze2SilverActivityData.DataPipeline
    aidwCopySilverActivity.CopyJob
    aidwFactoryBronze2SilverCompletions.DataPipeline
    aidwSilverToGold.Notebook
    aidwfactorybronze.SemanticModel
    aidwfactorybronze.SQLEndpoint
    aidwfactorybronze.Lakehouse
    aidwfactorygold.SemanticModel
    aidwfactorygold.SQLEndpoint
    aidwfactorygold.Lakehouse
    aidwfactorysilver.SemanticModel
    aidwfactorysilver.SQLEndpoint
    aidwfactorysilver.Lakehouse
    testSources.Eventstream
    ```

1. **Inspect a resource**

   Use the Fabric CLI to view a resource as JSON.

   Example:

   ```sh
   fab get aidwiotfactory.Workspace/testSources.Eventstream -q .
   ```

1. **List queryable properties**

    List the queryable properties in the resource:

    ```shell
    fab get aidwiotfactory.Workspace/testSources.Eventstream -f
    ```

    Example output:

    ```text
    id
    type
    displayName
    description
    workspaceId
    definition.parts[0].path
    definition.parts[0].payload.sources
    definition.parts[0].payload.destinations
    definition.parts[0].payload.streams
    definition.parts[0].payload.operators
    definition.parts[0].payload.compatibilityLevel
    definition.parts[0].payloadType
    definition.parts[1].path
    definition.parts[1].payload.retentionTimeInDays
    definition.parts[1].payload.eventThroughputLevel
    definition.parts[1].payloadType
    definition.parts[2].path
    definition.parts[2].payload.$schema
    definition.parts[2].payload.metadata
    definition.parts[2].payload.config
    definition.parts[2].payloadType
    connections
    ```

    Note that the `-f` forces the output, otherwise you are prompted in v1.0.0 with:

    ```text
    ? Item definition is retrieved without its sensitivity label. Are you sure? (Y/n)
    ```

1. **Query a single property and create a JSON file**

    There are a couple of small challenges with creating output for Terraform use:

    - the warning message above is also sent to stdout
    - the end of line is Windows format, i.e. CRLF

    This shell command takes the definition property and outputs to a file.

    ```shell
    fab get aidwiotfactory.Workspace/testSources.Eventstream -fq definition | grep -v "sensitivity label" | jq . > eventstream.json.tmpl
    ```

    You will then need to configure and test from there, but this approach should take you a long way.

Additional resources can be found here:

- <https://github.com/RuiRomano/fabric-cli-powerbi-cicd-sample>
- <https://github.com/murggu/fab-demos>

## Model Context Protocol (MCP) for Terraform

{{< flash >}}
This is a more advanced area that involves running a Docker container so that you can run an MCP server locally for your GitHub Copilot to use as an extra tool in Agent mode. The server requests information directly from the Terraform registry so that your model can formulate responses using provider code and documentation as the source of truth. This can provide more detail and generate better config examples than you will get from the documentation pages alone.

⚠️ Note that this is in beta at the time of writing.
{{< /flash >}}

The [Model Context Protocol](https://modelcontextprotocol.io/introduction) (MCP) is an open standard for describing and sharing model context in a consistent way. MCP helps teams collaborate and integrate tools more effectively by providing a common language for model context.

HashiCorp provides an MCP server to support the Model Context Protocol within Terraform workflows. This server enables advanced collaboration, context sharing, and integration with other tools, enhancing the Terraform experience.

As per the [MCP Server for Terraform Documentation](https://developer.hashicorp.com/terraform/docs/tools/mcp-server) you will need:

- [Docker](https://docs.docker.com/desktop)
- [Visual Studio Code with Copilot](https://code.visualstudio.com/docs) (or Cursor or Anthropic Claude Desktop)
- [Enable MCP in VS Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) (preview)
  - [Enable the MCP support setting](vscode://settings/chat.mcp.enabled)
  - Add .vscode/mcp.json

      ```json
      {
        "servers": {
            "terraform-mcp-server": {
                "command": "docker",
                "args": [
                   "run",
                   "-i",
                   "--rm",
                   "hashicorp/terraform-mcp-server:0.1.0"
                ]
            }
        }
      }
      ```

- Open vscode and Copilot in Agent Mode
- Check on the tools to see the MCP Server in the list
- The MCP server should then be used to augment your results
- Force a direct reference using # and the tool name

> ℹ️ Note that I have not tested this mode as there is a group policy prohibiting third party MCP servers. Arranging an exception.

## Git Integration with Microsoft Fabric

Terraform is not the only way to integrate Git with a Microsoft Fabric config.

Another option is to look at the [Git Integration in Microsoft Fabric](https://learn.microsoft.com/fabric/cicd/git-integration/intro-to-git-integration), enabling version control, collaboration, and CI/CD workflows for items within a Fabric workspace. This is handled directly within the Fabric GUI and is in preview at the time of writing.

{{< flash >}}
As a suggestion, I would consider using both approaches, pinned the to the right persona. Common personas seen in Microsoft Fabric are Data Engineers, Data Scientists, Data Analysts, Fabric Administrators and Data Stewards.

For Fabric Administration I can see Terraform being a natural place to configure capacities, group memberships, RBAC permissions and more. Potentially Data Engineers who want to bootstrap with standard pipelines and transformations, or Data Analysts who want to instantiate notebooks and reports consistently.

However many will want to use the FabriC UI directly, and use the Git integration whilst staying in the flow when working solo or as part of a small v-team.

And there is no reason why these two approaches cannot co-exist.
{{< /flash >}}

## Additional resource links

- <https://microsoft.github.io/fabric-cli/>
- <https://github.com/RuiRomano/fabric-cli-powerbi-cicd-sample>
- <https://github.com/murggu/fab-demos>

## Next

These labs should have given you a good overview on how you may approach automating Microsoft Fabric deployments and configurations with the growing ecosystem of tooling including the Fabric CLI, Fabric Terraform provider, Git integration for Fabric and the Terraform MCP server, plus clear guidance on configuring access when in user context and using managed identity as your workload identity.