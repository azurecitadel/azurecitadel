---
title: "GitHub template"
description: "Create a repo in GitHub from the template and then clone it locally."
layout: single
draft: false
menu:
  side:
    parent: fabric
    identifier: fabric-template
series:
 - fabric_terraform_administrator
weight: 20
---

## Introduction

Creating a new repository using a GitHub template is a straightforward process, and out template repo will speed up the rest of the labs. This guide will walk you through the steps to create a new repository from the [fabric_terraform_provider_quickstart](https://github.com/richeney/fabric_terraform_provider_quickstart.git) template and clone it locally.

## Navigate to the Template Repository

Open the [fabric_terraform_provider_quickstart](https://github.com/richeney/fabric_terraform_provider_quickstart.git) repository in a new browser window.

- Windows: Ctrl + right-click on the link above, and select _Open link in new window_
- macOS: ⌘-Option-Shift-click

## Use the Template

![Screenshot showing the "Use this template" button on GitHub.](/fabric/images/github_template_create_repo_1.png)

- Click the green **Use this template** button at the top right of the repository page
- Select **Create a new repository** from the dropdown

## Configure the New Repository

![Screenshot showing the repository creation options on GitHub.](/fabric/images/github_template_create_repo_2.png)

- Provide a name for your new repository
- Optionally, add a description
- Choose the visibility (Public or Private)
- Click **Create repository from template**

## Copy the GitHub CLI clone command

![Screenshot showing the GitHub CLI command to clone a repository.](/fabric/images/github_template_github_cli.png)

- Click the green **Code** button
- Select the **GitHub CLI** tab
- Copy the command to your clipboard

## Clone the Repository Locally

- Open a terminal on your local machine

    ![Screenshot showing the terminal command to clone a repository using GitHub CLI.](/fabric/images/github_template_terminal_gh_repo_clone.png)

- Paste the `gh repo clone` command from your clipboard
- Change into the repository directory with `cd`
- Run `code .` to open Visual Studio Code for the current directory

## Visual Studio Code

You should now have vscode with the cloned template open.

![Screenshot showing the repository opened in Visual Studio Code.](/fabric/images/github_template_repo_vscode.png)

You can now begin working on your project. Add files, make changes, and commit them to your new repository.

## Next

Using a GitHub template repository is an efficient way to kickstart your project with a predefined structure. The [fabric_terraform_provider_quickstart](https://github.com/richeney/fabric_terraform_provider_quickstart.git) template provides a great starting point for Terraform provider development. Happy coding!
