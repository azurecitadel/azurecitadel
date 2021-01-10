---
title: "Remote Container"
description: "Run Hugo locally using only Visual Studio Code and the Remote Container extension."
weight: 2
menu:
  side:
    parent: 'Contributing'
---


## Overview

Sometimes you want to make a larger, more complex change to the site and want to be able to build and run it locally to verify changes manually.

It can be a pain to set up the build infrastructure locally for any project, especially when dealing with a mixture of technologies and versions.

Thankfully Azure Citadel makes use of [Visual Studio Code - Remote Containers](https://code.visualstudio.com/docs/remote/containers) to make this easier.

On your local computer you will still need the following tools set up, however they are not specific to this one repository and can be re-used for every project that makes use of Remote Containers.

* [Docker](https://docs.docker.com/get-started/)
* Visual Studio Code
* The Remote Containers extension for Visual Studio Code

If this is still too much infrastructure to maintain or you are in an environment that restricts what can be installed and run locally, you should look at using a cloud-hosted instance of the container using [GitHub Codespaces](/about/contributing/github-codespaces).

## Running Locally

### Checkout Code

From a terminal run the following.

```bash
git clone git@github.com:azurecitadel/azurecitadel.git
code azurecitadel
```

### Re-open in container

Use the Remote Container extension to open this project in VS Code, as shown in the following video

{{< youtube id="g6UACfsHKKM" autoplay="false">}}

### Serve content

Open a new terminal window in VS Code and tell Hugo to start serving the local content on localhost:1313

```bash
hugo serve
```

![Run hugo serve](/about/contributing/remote-container-1-hugo-serve.png)

## Technical Details

You can follow links to see exactly what is being run when running inside a remote container.
* [Docker image](https://github.com/azurecitadel/azurecitadel/blob/main/.devcontainer/Dockerfile)
* [Development container configuration](https://github.com/azurecitadel/azurecitadel/blob/main/.devcontainer/devcontainer.json)
