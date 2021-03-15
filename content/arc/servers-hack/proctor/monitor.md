---
title: "Monitoring"
description: "Configure the new Azure Monitoring Agent and Data Collection Rules. Optionally integrate with Azure Security Center and Azure Sentinel."
layout: single
draft: false
series:
 - arc-servers-hack-proctor
weight: 5
---

## Azure Monitoring Agent (AMA)

* Create a new Log Analytics Workspace

  In the portal, navigate to **Log Analytics Workspaces** and **Create**.
  
  * Name: `arc-loganalytics-ama`
  * Resource group: `arc-hack`

* Deploy the new Azure Monitoring Agent to our virtual machines

    To be installed via Extension - either via PowerShell, CLI or ARM template:
    [Install the Azure Monitor agent (preview)](https://docs.microsoft.com/en-us/azure/azure-monitor/agents/azure-monitor-agent-install?tabs=ARMAgentPowerShell%2CPowerShellWindows%2CPowerShellWindowsArc%2CCLIWindows%2CCLIWindowsArc#install-with-powershell)
    ```powershell
    Set-AzVMExtension -Name AMAWindows -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location>
    ```

* Confirm the virtual machines are communicating to the Log Analytics Workspace

    Check the `Heartbeat` table within the Log Analytics Workspace.
* Ensure that the Log Analytics Workspace is set up so that users only have access to the logs of resources they have acces to

    Confirm that the **Access control mode** on the Log Analtics Workspace is set to `Use resource or workspace permissions`. The other mode is `Require workspace permissions`. This can be viewed on the Log Analytics overview section and changed within the **Log Analytics Workspace** under **Properties**

## Data Collection Rules (DCRs)

### Security Operations Centers (SOC) team
You are part of the Security Operations Centers (SOC) team.

* Set up a Data Collection Rule for all your Azure arc virtual machines to send their authentication logs to

    Create a DCR under Azure Monitor.
    * Name: `arc-dcr-soc`
    * Platform Type: `Custom`
    * Resources: `Select the Arc servers`
    * **Collect and Deliver**
    * Data Source Type: `Linux syslog`:
        * LOG_AUTH `LOG_DEBUG`
        * LOG_AUTHPRIV `LOG_DEBUG`
        * All others as `None` - saves ingestion and data storage costs.
    * Data Source Type: `Windows event logs`:
        * Select `Audit success` and `Audit failure`

* (Optional) Validate the security logs are visible in the Log Analytics Workspace

    * For Windows:
    ```
    Event 
    | where EventLog == "Security"
    ```


### Cost Management team

You are part of the Cost Management team and performing an exercise on reducing costs. 

* Deploy a Data Collection Rule to collate the RAM usage data and % of free disk space for all VMs

    Create a DCR under Azure Monitor.
    * Name: `arc-dcr-costmanagement`
    * Platform Type: `Custom`
    * Resources: `Select the Arc servers`
    * **Collect and Deliver**
    * Data Source Type: `Performance Counters`
        * Select `Custom`
        * Then select:
            * `\Memory\% Committed Bytes In Use`
            * `\LogicalDisk(_Total)\% Free Space`

* (Optional) Produce a workbook showing the % utilisation of CPU, RAM and free disk space for all VMs

    * Naviagate to Azure Monitor in the Azure Portal
    * Select **Workbooks** on the left hand menu
    * Create a workbook with two visualations or alternatively, use the GitHub Azure Monitor Workbook Community

### Linux Application Team

You are part of a Linux application team.

* (Optional) Deploy a Data Collection Rule to collate any system errors and send to a Log Analytics Workspace

    Create a DCR under Azure Monitor.
    * Name: `arc-dcr-linux`
    * Platform Type: `Linux`
    * Resources: `Select the Arc servers`
    * **Collect and Deliver**
    * Data Source Type: `Linux syslog`:
        * `LOG_WARNING` on all categories - saves ingestion and data storage costs.
        * Could argue `LOG_DEBUG` on all however as not specified if development environment

* (Optional) Create an Azure Monitor Alert to notify the application team on an error

    * Navigate to the Azure Monitor
    * **Alerts** on the left hand menu
    * Create a log alert to alert on the errors

## Integrate with Azure Security Center

* Enable Azure Security Center on your Azure Arc connected machines


- In the Azure portal, navigate to the Security Center blade, select **Security solutions**, and then in the **Add data sources** section select **Non-Azure servers**.
- On the **Add new non-Azure servers** blade, select the **+ Add Servers** button referencing the Log Analytics workspace you created in the previous task.
- Navigate to the **Security Center | Pricing & settings** blade and select the Log Analytics workspace.
- On the **Security Center | Getting Started** blade and enable Azure Defender on the Log Analytics workspace.
- Navigate to the **Settings | Azure Defender plans** blade and ensure that Azure Defender is enabled on 1 server.
- Switch to the **Settings | Data collection** blade and select the **Common** option for collection of **Windows security events**.
- Navigate to the **arcch-vm1** blade, select **Security**, an verify that **Azure Defender for Servers** is **On**.

## Integrate with Azure Sentinel

* Enable Azure Sentinel on your Azure Arc connected machines by configuring the Log Analytics agent to forward events to Azure Sentinel such as Common Event Format (CEF) or Syslog

    - In the Azure portal, connect Azure Sentinel to the Log Analytics workspace you created in the previous challenge.

## Success criteria

Screen share with your proctor to show that you achieved:

1. Azure Monitoring Agent (AMA) is reporting to your new Log Analytics Workspace

    - Validate that all Arc machines are reporting to the new Log Analytics Workspace
    ```
    Heartbeat
    | summarize by Computer
    ```

1. Data Collection Rules are applied and data is being gathered from the Azure arc connected machines

    - **Azure Monitor** from the Azure Portal
    - Select **Data Collection Rules**
    - Ensure the two/three rules have been created and the DCRs have the servers selected as sources

1. Open Azure Security Center and view the Secure Score for your Azure arc connected machine
    - Alternatively, review the **Security Center \| Inventory** blade and verify that it includes the **Servers - Azure Arc** entry representing the **arcch-vm1** Hyper-V VM.
1. From Azure Sentinel, view collected events from your Azure Arc connected machine
    - In the Azure portal, navigate to the **Azure Sentinel \| Data Connectors** blade, select **Security Events** entry, and then select **Go to analytics**. 