---
headless: true
title: "CMK - Key Vault SKU and cost"
---

Managed HSM would be the production-grade choice for dedicated HSM isolation, but it runs to several thousand USD per month for a minimum cluster — impractical for training. Key Vault Premium replicates the experience closely enough: same API, same SKR flow, same CMK integration patterns across Azure services. Where a real Managed HSM deployment would differ (security domain, HSM RBAC, backup/recovery), we highlight it in each lab.

Key Vault Premium is priced per operation at a slightly higher rate than Standard — in practice the cost for lab exercises is negligible.

{{< flash "danger" >}}
Managed HSM enforces both soft delete and purge protection and these cannot be disabled. If you create one and then delete it, it remains available — and chargeable — for 90 days before it is permanently purged. There is no way to accelerate this. Avoid creating Managed HSM resources unless you intend to keep them.
{{< /flash >}}

For the full decision guide, see [How to choose the right Azure key management solution](https://learn.microsoft.com/azure/security/fundamentals/key-management-choose).

#### References

- [Azure Key Vault pricing (Standard and Premium)](https://azure.microsoft.com/pricing/details/key-vault/)
- [Azure Managed HSM pricing](https://azure.microsoft.com/pricing/details/azure-dedicated-hsm/)
- [How to choose the right Azure key management solution](https://learn.microsoft.com/azure/security/fundamentals/key-management-choose)
