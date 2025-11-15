---
headless: true
title: "Azure Landing Zones - Bootstrap Prerequisites"
---


## Overview

For the bootstrap you will need a few [prerequisites](https://azure.github.io/Azure-Landing-Zones/accelerator/userguide/1_prerequisites/github/) as summarised below. This page includes links to the official documentation, but you will also find the commands repeated here to save you jumping around too much.

{{< flash >}}

1. Access to an Azure tenant with one to four [subscriptions](https://azure.github.io/Azure-Landing-Zones/accelerator/userguide/1_prerequisites/platform-subscriptions/) for use in the Platform Landing Zone area:

    * **management** (mandatory)
    * **connectivity** (recommended)
    * **identity**
    * **security**

    (It is assumed that the subscriptions will be directly under the Tenant Root Group in Management Groups.)

1. An ID with Global Administrator

    **Note that you will need to temporarily elevate a Global Administrator ID and assign root level privileges for the duration of the bootstrap.** (As per the elevate and demote pages in this series.)

1. A GitHub organization

    If you are an individual GitHub user then you can [create an organization](https://github.com/account/organizations/new) for free. For example, my GitHub organization for testing is `richeney-org`.

    You will also need the ability to create [personal access tokens](#create-personal-access-tokens) in the context of your organization.

1. PowerShell with the [ALZ module](#alz-powershell-module) installed
1. [Visual Studio Code](https://aka.ms/vscode) with the [Hashicorp Terraform](https://marketplace.visualstudio.com/items?itemName=HashiCorp.terraform) extension

{{< /flash >}}

## Create personal access tokens

1. Authenticate to GitHub

1. Go to Settings

    Click on your profile at the top right and select [Settings](https://github.com/settings/profile)

1. Switch setting context at the top of the page to your organization

    The URL will switch to `https://github.com/organizations/orgName/settings/profile`.

1. Navigate to Developer Settings > Personal Access Tokens > Fine-grained tokens

### Bootstrap

Create a personal access token for the **bootstrap** process.

1. Click on **Generate new token**.
    * Token Name: `Azure Landing Zone accelerator`
    * Description: `Short-lived token for the ALZ Accelerator bootstrap process`
    * Resource Owner: **Switch to your organization**
    * Expiration: Custom, select short period.
    * Repository access: All repositories

1. Add **Repositories** permissions

    |Permission|Access|
    |---|---|
    | Actions | Read and write |
    | Administration | Read and write |
    | Contents | Read and write |
    | Environments | Read and write |
    | Secrets | Read and write |
    | Variables | Read and write |
    | Workflows | Read and write |

1. Add **Organizations** permissions

    |Permission|Access|
    |---|---|
    | Members | Read and write |
    | Self-hosted runners | Read and write |

1. Generate the token.
1. Copy the token value and keep it somewhere safe.

### Private Runners

Create a personal access token for the **private runners**

1. Click on **Generate new token**.

    * Token Name: `Azure Landing Zone private runners`
    * Description: `Long-term token used by the private runners`
    * Resource Owner: **Switch to your organization**
    * Expiration: Select no expiration.
    * Repository access: All repositories

1. Add **Repositories** permissions

    |Permission|Access|
    |---|---|
    | Administration | Read and write |

1. Add **Organizations** permissions

    |Permission|Access|
    |---|---|
    | Self-hosted runners | Read and write |

1. Generate the token.
1. Copy the token value and keep it somewhere safe.

## ALZ PowerShell module

As per the [bootstrap](https://azure.github.io/Azure-Landing-Zones/accelerator/userguide/2_start/) page:

1. Open [PowerShell 7](https://learn.microsoft.com/powershell/scripting/install/installing-powershell?view=powershell-7.4)
1. Trust the

    ```powershell
    Set-PSRepository -Name 'PSGallery' -InstallationPolicy Trusted
    ```

1. Install the ALZ module

    ```powershell
    Install-Module -Name ALZ -Scope CurrentUser
    ```

    {{< details "Additional commands" >}}

If the module is already installed then you can run this command to check for an update.

```powershell
Update-Module -Name ALZ
```

Check the version number(s):

```powershell
Get-InstalledModule -Name ALZ
```

The ALZ PowerShell module is open source at <https://github.com/Azure/ALZ-PowerShell-Module>.

{{< /details >}}

## Setup

1. Bash, plus [Visual Studio Code](https://aka.ms/vscode) with the [Hashicorp Terraform](https://marketplace.visualstudio.com/items?itemName=HashiCorp.terraform) extension

    These labs assume you will be working in a Bash environment, and you have vscode configured with the Terraform extension.  See our [Setup](/setup) page for a recommended config.

ℹ️ If the pages prove very popular then I will add PowerShell for those who prefer to stay within the Windows OS level.
