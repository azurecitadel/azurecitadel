---
headless: true
title: "Azure Landing Zones Library - Using Libraries"
description: "Where to host, how to access with the alz provider, referencing for dependencies, versioning, overrides and modifiers."
---

## Overview

Where to host, how to access with the alz provider, referencing for dependencies, versioning, overrides and modifiers.

### Centralised Custom Libraries

There is no restriction on how custom libraries are used, but here are a few examples for reuse.

- **Partner Libraries**: Libraries of partner IP fo accelerating customer governance
- **Country Packs**: Sovereign requirements for specific regions

    [nl/bio/2026.01.0](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs/tree/2026.01.0/country/nl/bio): My example country pack for The Netherlands' BIO compliancy.

    In this example the local metadata file is using both the slz and bio libraries.

    ```json
    {
      "$schema": "https://raw.githubusercontent.com/Azure/Azure-Landing-Zones-Library/main/schemas/library_metadata.json",
      "name": "local",
      "display_name": "ALZ Accelerator - Azure Verified Modules for SLZ Platform Landing Zone",
      "description": "This library allows overriding policies, archetypes, and management group architecture in the ALZ Accelerator.",
      "dependencies": [
        {
          "path": "platform/slz",
          "ref": "2025.10.1"
        },
        {
          "custom_url": "github.com/richeney-org/Sovereign-Landing-Zone-Packs//country/nl/bio?ref=2026.01.0"
        }
      ]
    }
    ```

- **Industry Packs**: Industry-specific governance patterns
