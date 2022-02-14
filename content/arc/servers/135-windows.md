---
title: "Scale Onboarding for Windows"
description: "Onboarding multiple Windows servers using Windows Admin Center."
slug: windows
layout: single
draft: false
menu:
  side:
    parent: arc-servers
    identifier: arc-servers-windows
series:
 - arc-servers
weight: 135
---

## Introduction

There are a number of different approaches to scale onboard on prem Windows servers. Again the [docs](https://aka.ms/AzureArcDocs) and the [jumpstart](https://azurearcjumpstart.io) are great resources.

Alternatives approaches include:

* portal generated PowerShell scripts, again using the service principal
* the [Az.ConnectedMachine](https://docs.microsoft.com/azure/azure-arc/servers/onboard-powershell) module for PowerShell
* the [VMware.PowerCLI](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_servers/scaled_deployment/vmware_scaled_powercli_win/) module for PowerShell
* using [PowerShell DSC](https://docs.microsoft.com/azure/azure-arc/servers/onboard-dsc)
* leveraging [Update Management](https://docs.microsoft.com/azure/azure-arc/servers/onboard-update-management-machines)
* using Azure Hybrid Services within [Windows Admin Center](https://docs.microsoft.com/azure/azure-arc/servers/onboard-windows-admin-center)

We will default to using Windows Admin Center, but **if you do not have either the Global Administrator or Privileged Identity Administrator role in Azure AD then you should skip Windows Admin Center** and instead select one of the other approaches to onboard the Windows VMs.

This page will walk through the installation of Windows Admin Center in gateway mode and then discover the other Windows VMs. This will be full instructions rather than a challenge.

Once that is done then use the references to work out how to authenticate to Azure and leverage the Azure hybrid services within Windows Admin Center.

## Windows Admin Center

This section assumes you have used the Terraform repo with the defaults to create your on prem VMs. It will step through the installation of Windows Admin Center on win-01, which we will use as our gateway server.

### Gateway Server

1. RDP to win-01
1. Disable IEC in Server Manager
1. Use Internet Explorer to install [Microsoft Edge](https://www.microsoft.com/edge)
    * Ensure you select the Windows Server 2019 version from the drop down
    * As you are using Bastion then the browser will auto-detect your laptop's OS
1. Install [Windows Admin Center](http://aka.ms/WindowsAdminCenter)
    * Use a self signed certificate for this hack
    * Redirect HTTP port 80 traffic to HTTPS
1. You may close the Bastion session at this point

### Configure Windows Admin Center

1. Copy the win-01 FQDN from `terraform output`
1. Use your browser to connect to `https://<fqdn>`
    * win-01 has a public IP and the NSG permits WinRM access
    * Skip the warning for the self signed certificate
    * Click on _More choices_ and select _Use a different account_
    * Authenticate as _win-01\onpremadmin_
1. Windows Admin Center will load
1. Click on _+ Add_ and select Server
    * Enter _win-02_ as the server name
    * Use another account for this connection
    * Authenticate as _win-02\onpremadmin_
    * Click on _Add with credentials_
1. Repeat for _win-03_

![Windows Admin Center](/arc/servers/images/windowsAdminCenterConnections.png)

> Note that the Terraform repo deploys Windows VMs into a workgroup rather than a domain and uses local admin accounts. The VM's registries have been modified to [allow local account tokens](https://docs.microsoft.com/windows-server/manage/windows-admin-center/support/troubleshooting#i-can-connect-to-some-servers-but-not-others).In a domain context then adding servers is much cleaner, supporting lists and AD search.

You now have all of the Windows servers

## Azure hybrid center

OK, enough handholding. Back to the challenge format.

## Register with Azure

* Register the gateway to Azure
  * The created service principal requires admin consent

⚠️Do not re-use the service principal that has the "Azure Connected Machine Onboarding" role. You need to create a different appId and service principal for Windows Admin Center.

Allow the Azure wizard to create a new app registration. This app will be called `WindowsAdminCenter-https://<fqdn>`.

![Register](/arc/servers/images/registerToAzure.png)

⚠️ The app registration creation requires admin consent, and this is where you need to be Global Administrator or Privileged Role Administrator when you sign in to Azure on step 5.

### Azure AD app

For info, the automatically created app registration will have specific API permissions:

* Azure Active Directory Graph
  * Directory.AccessAsUser.All
  * User.Read
* Azure Service Management
  * user_impersonation

 It will also have a replyUri set for the application to work correctly. You can see this in the manifest for the app registration.

 ```json
"replyUrlsWithType": [
        {
                "url": "https://<fqdn>:6516/*",
                "type": "Web"
        }
],
 ```

On your engagements it may make more sense to precreate the app with the api permissions replyUri set. If so, follow the [manual steps](https://docs.microsoft.com/windows-server/manage/windows-admin-center/azure/azure-integration#register-your-gateway-with-azure).

## Onboard the three Windows VMs

## Success criteria

Screen share with your proctor to show that you achieved:

1. Onboarding all windows servers
1. Rerun the Resource Graph query or workbook

## Resources

* [Windows Admin Center](https://aka.ms/WindowsAdminCenter)
* [Connect hybrid machines to Azure from Windows Admin Center](https://docs.microsoft.com/azure/azure-arc/servers/onboard-windows-admin-center)
* [App Registration detail for Windows Admin Center](https://docs.microsoft.com/windows-server/manage/windows-admin-center/azure/azure-integration)
* [Azure Arc docs](https://aka.ms/AzureArcDocs)
* [Connect hybrid machines to Azure at scale](https://docs.microsoft.com/azure/azure-arc/servers/onboard-service-principal)
* [Az.ConnectedMachine](https://docs.microsoft.com/azure/azure-arc/servers/onboard-powershell) module for PowerShell
* [PowerShell DSC](https://docs.microsoft.com/azure/azure-arc/servers/onboard-dsc)
* [Update Management](https://docs.microsoft.com/azure/azure-arc/servers/onboard-update-management-machines)
* [Azure Arc Jumpstart](https://azurearcjumpstart.io)
* [VMware.PowerCLI](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_servers/scaled_deployment/vmware_scaled_powercli_win/) module for PowerShell

## Next

All of the servers are onboarded. In the next step we will use the new Azure Monitor Agent and Data Collection Rules to capture metrics and logs from the on prem servers.
