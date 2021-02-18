---
title: "Get started"
date: 2021-01-04
author: [ "Richard Cheney" ]
description: "Introduction to using the Azure CLI"
weight: 2
series:
 - cli
menu:
  side:
    parent: cli
aliases:
    - /prereqs/cli/cli-2-firststeps/
---

## Logging into Azure

Log into Azure using ```az login```.  (Note that this is not necessary in Cloud Shell.)

You will be prompted to enter a code into  [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and then authenticate the session.

> In the Windows Terminal you can double click the code to highlight. When text is highlighted then `CTRL`+`C` will copy to the clipboard. Use `CTRL` + Click on the URL to open and then `CTRL`+`V` to paste.

The session tokens survive for a number of days so if you are using a shared machine then always issue ```az logout``` at the end of your session.

See below if you have multiple Azure IDs and/or subscriptions.

## Help

* ```az``` shows the main help and list of the commands
* ```az <command> --help``` shows help for that command
  * if there are subcommands then you can use the ```--help``` or ```-h``` at any level
* ```az find -q <str>``` will search the index for commands containing ```<str>```
  * e.g. ```az find -q image```
* the [Azure CLI reference](https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest) has a description of the available commands and parameters
* most of the [Azure documentation](https://docs.microsoft.com/en-us/azure/#pivot=products&panel=all) sections have examples and tutorials for CLI 2.0 alongside the Portal and PowerShell

The CLI includes tab auto-complete for both switches and values, which is very useful for auto-completing resource groups, resource names and long subscription descriptions.

## Configure

Run `az configure` to initiate an interactive session to configure defaults for your output format, logging of sessions, data collection.

The `--resource-group` and `--location` switches are common to many commands. If you want to set default values then use `az configure --default group=myRG location=westeurope`.

The argument must be a space delimited list of key=value pairs, and defaults may be unset by a blank string, e.g. `group=''`.

The other way to default those switches is to export the `AZURE_DEFAULTS_GROUP` and `AZURE_DEFAULTS_LOCATION` environment variables within the current shell.

## Output formats

At this point I will assume that you have some resource groups, and that some of those contain virtual machines.

The following command lists out your resource groups, each demonstrating the output formats available

| **Command** | **Output** |
|---|---|
| `az group list --output table` | Human readable table |
| `az group list --output json` | JSON output |
| `az group list --output jsonc` | Coloured JSON output (includes control characters) |
| `az group list --output tsv` | Tab seperated values |
| `az group list --output yaml` | YAML format output |
| `az group list --output yamlc` | Coloured YAML format output |

You can also use "none" if you just need the return code and want to suppress output.

Any scripting should *always* specify the output format as CLI users can use the ```az configure``` command to set their preferred default output format.

A couple of points of note

* The JSON and YAML output formats contains the most information about the resources
* The JSON output is great when combined with jq
* The jsonc and yaml outputs are more human readable
* The table output shows a header.  The columns (and the header name) can be customised using JMESPATH queries.  More on those later.
* The tsv output has more information than the table, but no headers. As it does not include quotes around the values, it makes it a good way of reading values into Bash variables, working well with the cut command in a pipeline.  Again, for scripting I would highly recommend using the ``--query`` to specify the columns.

## Multiple subscriptions

If you have multiple subscriptions then the CLI will work in the context of the active subscription.

| **Command** | **Output** |
|---|---|
| `az account list` | Lists the available subscriptions |
| `az account show` | Shows the active subscription, or "context" |
| `az account set --subscription <subscriptionId>` | Switches to the subscription  |

If you are constantly switcing between subscriptions then consider adding aliases to the bottom of your `~/.bashrc` file, e.g.:

```shell
alias vs='az account set --subscription <subscriptionId>; az account show'
```

You can also specify `--subscription` on individual CLI commands.
