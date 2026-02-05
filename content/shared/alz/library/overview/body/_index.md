---
headless: true
title: "Azure landing zone Library Overview - Body"
description: "A brief overview of the Azure landing zone Library system architecture, components, and design principles."
---

## Example Libraries

### Platform Libraries

These libraries are maintained by Microsoft's Customer Architecture and Engineering team (CAE) and are hosted in the main [Azure landing zone library](https://aka.ms/alz/library) repo and supporting [documentation](https://aka.ms/alz/library/site). They are semantically versions with controlled releases, changelogs, and [issue tracking](https://aka.ms/alz/issues).

- **[Azure landing zone Library](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/alz)** (alz)
- **[Sovereign landing zone Library](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/slz)** (slz)
- **[Azure Monitoring Baseline Alerts](https://github.com/Azure/Azure-Landing-Zones-Library/tree/main/platform/amba)** (amba)

## Modularity and extensibility

The system supports multiple library sources and dependency chains, enabling organizations to build upon Microsoft baselines while adding custom requirements.

All library components follow semantic versioning principles, ensuring predictable updates and backward compatibility.

## Links

- <https://aka.ms/alz/repo>
- <https://aka.ms/alz/library>
- <https://aka.ms/alz/library/site>
- <https://aka.ms/alz/issues>
