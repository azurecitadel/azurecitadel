---
headless: true
title: "Azure landing zone - Sections overview"
---

## What is in these labs?

The [Azure landing zone](/alz) and [Sovereign landing zone](/slz) areas contain linked lab series that are designed to help you go deeper on Azure policy at scale. Here is a quick overview of what they cover.

- **Overview**

    A brief overview of the various moving parts with Azure landing zones and Sovereign landing zones. Start here!

- **Run the ALZ Accelerator**

    This series focuses purely on the ALZ Accelerator and the intention is to create a working CI/CD pattern that is suitable for a production environment. Note that the ALZ Accelerator is also usually used to generate the starter configs, but these pages intentionally create an empty config, ready for the next stage.

- **Deploy an Azure or Sovereign landing zone**

    You will start with that empty config created by the ALZ Accelerator. The idea is to build up your knowledge on how the Azure Verified Modules (AVM) are used to deploy the core Azure Landing Zone management group and management configurations. Learn about the Azure Landing Zone pattern modules in the Terraform Registry, including the examples you can reference to build up your own config. Learn how to add in a custom library so that you can override the archetypes in the ALZ library.

- **Understanding libraries**

    OK, time to backtrack. The ALZ platform library (plus SLZ and AMBA) are core to how this all works, and you can create your own ALZ libraries as well, which can be very useful for partners. This allows you to create your own custom libraries if you want to offer a standard set of additional policy controls for customers, or policy packs for sovereign requirements in specific regions or industries. This deep dive will take you into the assets and constructs, plus some useful commands for testing that your custom policies and RBAC role definitions are valid JSON.

- **Reference configs**

    OK, so now you have the core understanding. But you don't want to have to read through all of the pages if you come back at a later point, you just want to get straight to the core info and see how your files should be configured for different library scenarios. Here are a few pages for you to reference.
