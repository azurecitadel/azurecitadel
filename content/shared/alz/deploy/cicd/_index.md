---
headless: true
title: "Azure Landing Zones - Initial ALZ config for management and management groups"
---

## Overview

On this page you will:

1. Create a git branch
1. Commit and publish
1. Create a pull request
1. Review the changes
1. Squash and merge

{{< flash "warning" >}}
Note that this step will naturally create resources that will add costs to your Azure billing.
{{< /flash >}}

## Create a branch

The main brach is protected to you must create a pull request on a feature branch. Note that the current branch is shown in Visual Studio Code's status bar.

1. Open the Command Palette (`CTRL`+`SHIFT`+`P`)
1. Select **Git: Create Branch...**
1. Set the branch name to **initial**

## Commit

Now you will stage and commit your changes to the local Git repository.

1. Go to Source Control in the primary side bar. (`CTRL`+`SHIFT`+`G`)

    The pane will display main.tf, terraform.tf,and variables.tf as Changes.

1. Select variables.tf to view the changes.
1. Select all three files and click on the **+** to Stage Changes.

    All three files will now show as Staged Changes.

1. Type "Initial Commit" into the message box above the Commit button.
1. Click the **Commit** button.

The commit show now show in the Graph pane. Note that it is local is now ahead of the commits on the origin's main branch.

## Publish

The Commit button will have changed to Publish Branch. Publishing the branch will push the commit from the local repo to the origin and this should trigger the CI pipeline.

1. Click on the **Publish Branch" button

Note that the Initial Commit in the Graph now has the cloud symbol next to it.

## Pull request

You will need to run the Pull Request to trigger the CI checks and prompt a review.

1. Open the GitHub repo in a web page

    You can use `gh repo view --web` in the terminal if you have the GitHub CLI installed.

    Or right click on the commit in Source Control's Graph to **Open on GitHub**.

1. Click on **Pull Requests**.

    GitHub should show that the initial branch had recent pushes.

1. Click on the **Compare & pull request** button
1. Add a description.

    ```text
    Initial Azure Landing Zones definition. Added:

    - alz provider, linked to the core Azure Landing Zones library
    - `alz` architecture name specified in the standard management group AVM module
    - plus the related management module
    ```

1. Click on the green **Create pull request** button
1. Wait a few seconds and you will see the CI workflow become triggered

    The checks will be embedded in the Pull Request conversation. Click on the running test name to go straight to the workflow run in the Actions menu. You can drill into the run for detailed log output.

If your local tests ran successfully then the checks in the Pull Request should also pass, and you should also see no conflicts with the base branch.

## Squash and merge

You can then squash and merge the Pull Request. (If you have multiple commits in tour branch then squash will collapse them into a single commit to keep everything clean.)

1. Click on the green **Squash and merge** button.

    - Feel free to update the system generated message and description
    - Click on the **Confirm squash and merge** button

The page will update and show the **Pull request successfully merged and closed** message.

## Delete branch (optional)

You can also clean up the branch now that the Pull Request (PR) has been merged.

1. Click on the **Delete branch** button in the Pull Request conversation.

    This deletes the origin/initial branch.

1. Open the Integrated Terminal in Visual Studio Code
1. Switch back to the main branch

    ```bash
    git switch main
    ```

1. Pull the update

    ```bash
    git pull
    ```

1. Delete the local initial branch

    ```bash
    git branch -d initial
    ```

Note that the Graph has been updated and the main branch should show it is synced with the remote (cloud) version.

If you click on the most recent commit then it will display the three files. Confirm by clicking on variables.tf to view the diff.

## Review

The merge (pull) into the main branch will trigger the Continuous Deployment (CD) workflow. The first job in the workflow runs in the Plan environment, and generates the plan artifact. The environment rules will then force a review, pausing after the **CD / Plan with Terraform** job.

1. View the plan

    - Click on the **CD / Plan with Terraform** job
    - Click on the **Show the Plan for Review** step

    The plan is large, so allow a little time for it to be displayed in full.

1. Review the plan output and confirm the planned changes are as expected.

## Approval

{{< flash "warning" >}}
⚠️ This is the key control step. Your GitHub ID will be associated with the approval. Never approve a plan without a full and thorough review.
{{< /flash >}}

1. Go back in the browser to return to the paused workflow
1. Click on **Review deployments**
1. Check the **alz-mgmt-apply** box
1. Add a comment

    ```text
    Looks good to me.
    ```

1. Click on the green **Approve and deploy**

## Deployment

The **CD / Apply with Terraform** step will start to run once the plan has been approved.

Click on the job name to view the log in the workflow. The core Azure Landing Zone will be deployed. Expect it to take up to ten minutes.

![A successfully completed deployment step in GitHub Actions](/shared/alz/deploy/cicd/complete.png)

## References

- <https://aka.ms/alz>
- <https://aka.ms/alz/accelerator/docs>
- <https://github.com/Azure/alz-terraform-accelerator>
