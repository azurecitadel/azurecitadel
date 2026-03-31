---
headless: true
title: "CMK - Key Vault SKU and cost"
---

Managed HSM would be the production-grade choice for dedicated HSM isolation, but can become dangerously expensive. It runs to thousand USD per month for a minimum cluster.

Key Vault Premium replicates the experience closely enough: same API, same SKR flow, same CMK integration patterns across Azure services. Where a real Managed HSM deployment would differ (security domain, HSM RBAC, backup/recovery), we highlight it in each lab.

Key Vault Premium does not have a fixed charge itself. It charges purely for the keys and their operations. The HSM backed keys are a little more expensive, but in practice the cost for lab exercises is relatively small.

Azure Key Vault Standard does not support Secure Key Release that is required for the Confidential Compute labs.

{{< flash "danger" >}}
💀 Managed HSM has enforced soft delete and purge protection for customer managed keys.

**Deleted Managed HSMs will continue to be charged to your bill until permanently purged at the end of the retention period.**

- The current usage fee per HSM pool is $3.20 per hour. ($76.80 per day, or $2,336 per Azure month of 730 hours.)
- A deleted Managed HSM would charge an additional $6,912 over the default retention period of 90 days.
- You may specify a shorter retention period at creation time.
- Retention times are immutable properties and cannot be changed.
- The minimum retention period is 7 days which equates to $537.60.
{{< /flash >}}

#### References

- [Azure Key Vault pricing (Standard and Premium)](https://azure.microsoft.com/pricing/details/key-vault/)
- [How to choose the right Azure key management solution](https://learn.microsoft.com/azure/security/fundamentals/key-management-choose)
