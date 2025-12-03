---
headless: true
title: "Azure Landing Zones Library - Architectures"
description: "Documentation for architecture definitions within the Azure Landing Zones Library, including management group hierarchies and archetype assignments."
---

## Architectures Overview

Architectures in the Azure Landing Zones Library define the management group hierarchy and the assignment of archetypes to specific management groups. They represent the overall organizational structure and governance model for Azure environments, providing the blueprint for how governance controls are applied across the enterprise.

## Architecture Concept

### Definition
An architecture defines:
- Management group hierarchy and relationships
- Management group naming and display names
- Archetype assignments to management groups
- Subscription placement and organization
- Governance inheritance patterns

### Purpose
Architectures serve to:
- Establish organizational structure in Azure
- Define governance boundaries and inheritance
- Enable scalable management group design
- Provide templates for consistent deployments

## Standard Architecture Patterns

### Azure Landing Zone (ALZ) Architecture
The foundational architecture pattern for enterprise Azure deployments.

**Structure:**
```
Tenant Root Group
└── {Customer Name}
    ├── Platform
    │   ├── Connectivity
    │   ├── Identity
    │   └── Management
    ├── Landing Zones
    │   ├── Corp
    │   └── Online
    ├── Sandbox
    └── Decommissioned
```

**Archetype Mapping:**
- **Root**: Enterprise-wide governance and compliance
- **Platform**: Shared services and infrastructure governance
- **Connectivity**: Network and connectivity policies
- **Identity**: Identity and access management controls
- **Management**: Operational monitoring and management
- **Landing Zones**: Application workload governance
- **Corp**: Corporate connectivity workload policies
- **Online**: Internet-facing workload policies
- **Sandbox**: Development and experimentation policies
- **Decommissioned**: Archival and cleanup policies

### Sovereign Landing Zone (SLZ) Architecture
Extended architecture pattern for sovereign cloud requirements.

**Additional Components:**
- Enhanced compliance and data residency controls
- Country-specific regulatory compliance archetypes
- Specialized security and encryption requirements
- Government and public sector governance patterns

### Small/Medium Enterprise Architecture
Simplified architecture pattern for smaller organizations.

**Structure:**
```
Tenant Root Group
└── {Customer Name}
    ├── Platform
    └── Workloads
        ├── Production
        ├── Non-Production
        └── Sandbox
```

## Architecture Definition Schema

### Basic Structure
```json
{
  "name": "architecture-name",
  "display_name": "Human Readable Architecture Name",
  "description": "Detailed description of architecture purpose and scope",
  "management_groups": [
    {
      "id": "mg-id",
      "display_name": "Management Group Display Name",
      "parent_id": "parent-mg-id",
      "archetypes": ["archetype1", "archetype2"]
    }
  ],
  "subscription_placements": [
    {
      "subscription_id": "sub-id",
      "management_group_id": "mg-id"
    }
  ]
}
```

### Advanced Configuration
```json
{
  "architecture_definition": {
    "name": "alz",
    "management_groups": [
      {
        "id": "root",
        "display_name": "Root",
        "parent_id": null,
        "archetypes": ["root"],
        "exists": false
      },
      {
        "id": "platform",
        "display_name": "Platform",
        "parent_id": "root",
        "archetypes": ["platform"],
        "exists": false
      }
    ]
  }
}
```

## Management Group Design Patterns

### Hierarchical Organization
Management groups support nested hierarchies up to 6 levels deep:

```
Level 1: Tenant Root Group (Azure Default)
Level 2: Enterprise Root
Level 3: Functional Areas (Platform, Landing Zones)
Level 4: Environment Types (Production, Non-Production)
Level 5: Application Groups
Level 6: Specific Applications
```

### Functional Separation
Common patterns for functional separation:

**By Service Type:**
- Platform Services
- Application Workloads
- Shared Services
- Development/Testing

**By Environment:**
- Production
- Pre-Production
- Development
- Sandbox

**By Business Unit:**
- Finance
- Marketing
- Operations
- Human Resources

**By Compliance Requirement:**
- PCI DSS Scope
- HIPAA Workloads
- Government Data
- Public Data

## Archetype Assignment Strategies

### Inheritance Patterns
Archetypes are inherited down the management group hierarchy:

```
Root (Root Archetype)
├── Platform (Root + Platform Archetypes)
│   └── Connectivity (Root + Platform + Connectivity Archetypes)
└── Landing Zones (Root + Landing Zone Archetypes)
    └── Corp (Root + Landing Zone + Corp Archetypes)
```

### Override Mechanisms
Child management groups can override parent archetype configurations:
- Parameter value overrides
- Policy exclusions
- Additional archetype assignments
- Custom policy assignments

### Composition Rules
Multiple archetypes on the same management group:
- Policies are additive unless explicitly overridden
- Role definitions are merged
- Conflicts are resolved using precedence rules

## Customization and Extension

### Architecture Modifications
Organizations can customize standard architectures:

**Management Group Additions:**
```json
{
  "archetype_config_overrides": {
    "root": {
      "management_groups": [
        {
          "id": "custom-mg",
          "display_name": "Custom Management Group",
          "parent_id": "landing_zones",
          "archetypes": ["landing_zones", "custom_archetype"]
        }
      ]
    }
  }
}
```

**Subscription Placements:**
```json
{
  "subscription_placements": [
    {
      "subscription_id": "12345678-1234-1234-1234-123456789012",
      "management_group_id": "corp"
    }
  ]
}
```

### Multi-Region Architectures
Support for multi-region deployments:
- Region-specific management groups
- Cross-region governance policies
- Data residency compliance controls
- Regional disaster recovery patterns

## Implementation Considerations

### Naming Conventions
Consistent naming patterns for management groups:

```
{prefix}-{function}-{environment}-{region}
Examples:
- contoso-platform-prod-eastus
- contoso-workloads-dev-westeurope
- contoso-connectivity-shared-global
```

### Scaling Patterns
Design considerations for large-scale deployments:
- Maximum management group depth (6 levels)
- Management group limits (10,000 per tenant)
- Subscription limits (1,000 per management group)
- Policy assignment inheritance complexity

### Migration Strategies
Approaches for evolving architectures:
- Phased migration approaches
- Blue-green management group deployments
- Rollback procedures for failed migrations
- Subscription movement strategies

## Best Practices

### Design Principles
- Align with organizational structure and governance needs
- Keep hierarchy as flat as practical
- Use descriptive names that reflect purpose
- Plan for future growth and organizational changes

### Governance Alignment
- Map management groups to compliance boundaries
- Align with budget and cost management requirements
- Consider operational responsibilities and ownership
- Plan for delegation and role-based access control

### Operational Excellence
- Document architecture decisions and rationale
- Implement monitoring and alerting for changes
- Regular review and optimization of structure
- Clear change management processes

---

*This documentation provides comprehensive guidance for designing and implementing management group architectures within the Azure Landing Zones Library. For specific architecture templates and implementation examples, refer to the library source repositories.*