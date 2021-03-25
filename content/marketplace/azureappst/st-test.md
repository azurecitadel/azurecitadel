---
title: "Validate ARM Template"
author: [ "Mike Ormond" ]
description: "Validate the ARM template."
date: 2021-03-25
weight: 30
menu:
  side:
    parent: marketplace-aast-offer
    identifier: marketplace-aast-offer-test
series:
 - marketplace-aast
---

## Introduction

It is important that we vaidate our ARM template before publishing. There are a number of specific best practice checks that will be performed on the template as part of the publishing process to meet the [certification requirements for Azure Applications](https://docs.microsoft.com/legal/marketplace/certification-policies#3004-technical-requirements). Many of these are automated in the [Azure Resource Manager Template Toolkit](https://github.com/Azure/arm-ttk). If the ARM template does not conform it will fail certification.

## Install the ARM template test toolkit

1. The tests require PowerShell. If you don't have PowerShell installed, [install PowerShell Core for your OS](https://docs.microsoft.com/powershell/scripting/install/installing-powershell?view=powershell-7.1).
1. Download the [latest zip ARM Temlate Toolkit file](https://aka.ms/arm-ttk-latest) and extract it to a suitable folder
1. In PowerShell, navigate to the folder in the previous step
1. You may need to modify your [execution policy](https://docs.microsoft.com/powershell/module/microsoft.powershell.core/about/about_execution_policies) for the script to work
   1. Execute the following PowerShell command in the arm-ttk folder

      ```PowerShell
      Get-ChildItem *.ps1, *.psd1, *.ps1xml, *.psm1 -Recurse | Unblock-File
      ```

1. Import the module
   1. Execute the following PowerShell command

      ```PowerShell
      Import-Module .\arm-ttk.psd1
      ```

1. For more details, see [Use ARM template test toolkit](https://docs.microsoft.com/azure/azure-resource-manager/templates/test-toolkit)

## Run the tests

   1. Execute the following PowerShell command to run the tests. It may be easier to make a copy of the ARM template a save it in the arm-ttk folder

      ```PowerShell
      Test-AzTemplate -TemplatePath \path\to\template_to_be_tested
      ```

      ![Arm template test toolkit output sample](/marketplace/images/arm-ttk.png)
   2. Review the results and address any issues

## Resources

* [Commercial marketplace certification policies](https://docs.microsoft.com/legal/marketplace/certification-policies)
* [Azure Resource Manager Templates - Best Practices Guide](https://github.com/Azure/azure-quickstart-templates/blob/master/1-CONTRIBUTION-GUIDE/best-practices.md)
* [MS Learn - Validate Azure resources by using the ARM Template Test Toolkit](https://docs.microsoft.com/learn/modules/arm-template-test/)

---
