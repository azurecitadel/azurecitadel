---
headless: true
title: "Azure Landing Zones Library - Creating and using custom libraries"
description: "Where to host, how to secure."
---

## Overview

Where to host, how to access with the alz provider, referencing for dependencies, versioning, overrides and modifiers.

## Reference repos

This series has described the assets and structure of a library, but it is always a good idea to look at examples.

Here is a reminder of the key ones used on these pages.

### Platform libraries

All maintained in the platform subfolder of <https://aka.ms/alz/library>.

- [platform/alz](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/alz)
- [platform/slz](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/slz)
- [platform/amba](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/amba)

{{< flash "tip" >}}
Note that slz and amba are actually good examples of custom libraries.

The slz library is a good example of a "stacked" library, extending the dependency (alz) and creating new management groups in the architecture.

The amba library is more standalone and assumes that the management group hierarchy is already in place - note the `"exists": true` against the management groups in the architecture files - and it serves a slightly different purpose. It could also be "sideloaded" as the second library in an array if you wanted both alz/slz and amba deployed together.
{{< /flash >}}

### Azure Citadel example custom libraries

These may be found pinned in the <https://github.com/richeney-org> GitHub organisation and illustrate repos containing either a single or multiple libraries.

- [Azure-Citadel-Custom-Library](https://github.com/richeney-org/Azure-Citadel-Custom-Library)

    Example custom library for Azure Landing Zones' alz provider for partners or organisations that repeatably deploy customised landing zones.

    This is a single library and the assets (and default directory structure) are up at the root of the repo.

- [Sovereign-Landing-Zone-Packs](https://github.com/richeney-org/Sovereign-Landing-Zone-Packs)

    Example repo hosting multiple libraries to extend a Sovereign Landing Zone to meet country and industry requirements.

    Each library will be in a subfolder.

## Semantic versioning, tags and releases

TODO

## Specifying versions and folders with custom_url

TODO
