---
headless: true
title: "Azure Landing Zones Library - Archetypes"
description: "Documentation for archetype definitions within the Azure Landing Zones Library, including their structure, configuration, and usage patterns."
---

## Archetypes Overview

Archetypes are foundational building blocks in the Azure Landing Zones Library that group together related policies, roles, and configurations into logical governance patterns. They represent standardized configurations that can be applied to management groups to establish consistent governance across different areas of an Azure environment.

## Archetype Concept

### Definition
An archetype is a collection of:
- Policy assignments (definitions and initiatives)
- Custom role definitions
- Configuration parameters
- Metadata and versioning information

### Purpose
Archetypes serve to:
- Standardize governance patterns across management groups
- Simplify complex policy and role management
- Enable consistent compliance postures
- Facilitate reusable governance configurations

## Standard Archetype Types

### Root Archetype
Applied to the root management group, providing organization-wide governance controls.

**Typical Components:**
- Global naming and tagging policies
- Organization-wide security baselines
- Cross-subscription governance controls
- Enterprise-wide compliance frameworks

### Platform Archetype
Applied to platform management groups containing shared infrastructure and services.

**Typical Components:**
- Network security policies
- Identity and access management controls
- Monitoring and logging requirements
- Backup and disaster recovery policies

### Landing Zone Archetype
Applied to management groups containing application workloads and business solutions.

**Typical Components:**
- Application security policies
- Resource optimization controls
- Workload-specific compliance requirements
- Development and operational guidelines

### Connectivity Archetype
Applied to management groups managing network connectivity and hybrid connections.

**Typical Components:**
- Network topology enforcement
- VPN and ExpressRoute policies
- DNS and traffic routing controls
- Network security monitoring

### Identity Archetype
Applied to management groups containing identity and access management resources.

**Typical Components:**
- Identity protection policies
- Conditional access controls
- Privileged identity management
- Authentication and authorization policies

### Management Archetype
Applied to management groups containing operational and monitoring resources.

**Typical Components:**
- Log Analytics workspace policies
- Monitoring and alerting configurations
- Automation and orchestration controls
- Operational security policies

## Archetype Structure

### Configuration Schema
```json
{
  "name": "archetype-name",
  "display_name": "Human Readable Name",
  "description": "Detailed description of archetype purpose",
  "policy_assignments": [
    {
      "name": "policy-assignment-name",
      "policy_definition_id": "/providers/Microsoft.Management/managementGroups/{mg}/providers/Microsoft.Authorization/policyDefinitions/{name}",
      "parameters": {}
    }
  ],
  "policy_set_assignments": [
    {
      "name": "initiative-assignment-name",
      "policy_set_definition_id": "/providers/Microsoft.Management/managementGroups/{mg}/providers/Microsoft.Authorization/policySetDefinitions/{name}",
      "parameters": {}
    }
  ],
  "role_definitions": [
    {
      "name": "custom-role-name",
      "role_definition_id": "/providers/Microsoft.Management/managementGroups/{mg}/providers/Microsoft.Authorization/roleDefinitions/{id}"
    }
  ]
}
```

### Inheritance Patterns
Archetypes support inheritance from parent management groups:
- Child management groups inherit parent archetype configurations
- Local overrides can modify inherited settings
- Explicit exclusions can remove inherited policies

## Customization and Extension

### Override Mechanisms
Organizations can customize archetypes through:

**Parameter Overrides:**
```json
{
  "archetype_config_overrides": {
    "root": {
      "policy_assignments": [
        {
          "name": "existing-policy",
          "parameters": {
            "customParameter": "organizationValue"
          }
        }
      ]
    }
  }
}
```

**Policy Exclusions:**
```json
{
  "archetype_exclusions": {
    "landing_zones": {
      "policy_assignments": ["unwanted-policy-assignment"],
      "policy_set_assignments": ["unwanted-initiative"]
    }
  }
}
```

### Custom Archetypes
Organizations can define completely custom archetypes:

```json
{
  "custom_archetypes": {
    "organization_specific": {
      "display_name": "Organization Specific Governance",
      "description": "Custom governance pattern for specific organizational needs",
      "policy_assignments": [...],
      "role_definitions": [...]
    }
  }
}
```

## Implementation Patterns

### Hierarchical Application
Archetypes are typically applied in a hierarchical manner:

```
Root Management Group (Root Archetype)
├── Platform (Platform Archetype)
│   ├── Connectivity (Connectivity Archetype)
│   ├── Identity (Identity Archetype)
│   └── Management (Management Archetype)
└── Landing Zones (Landing Zone Archetype)
    ├── Corp (Landing Zone + Custom Corp Policies)
    └── Online (Landing Zone + Custom Online Policies)
```

### Composition Strategies
Multiple archetypes can be combined:
- **Additive**: Each archetype adds its own policies
- **Override**: Later archetypes override earlier ones
- **Merge**: Configurations are intelligently merged

### Environment-Specific Variations
Archetypes can vary by environment:
- **Development**: Relaxed policies for experimentation
- **Testing**: Moderate policies for validation
- **Production**: Strict policies for operational workloads

## Best Practices

### Design Principles
- Keep archetypes focused on specific governance domains
- Avoid overlapping responsibilities between archetypes
- Use clear, descriptive names and documentation
- Test archetype combinations before production deployment

### Versioning Strategy
- Use semantic versioning for archetype definitions
- Maintain backward compatibility where possible
- Document breaking changes and migration paths
- Provide rollback procedures for failed updates

### Governance Alignment
- Align archetypes with organizational structure
- Map archetypes to compliance requirements
- Regular review and update of archetype definitions
- Clear ownership and responsibility for archetype maintenance

---

*This documentation provides the foundation for understanding and implementing archetypes within the Azure Landing Zones Library. For specific archetype definitions and configuration examples, refer to the library source repositories and implementation guides.*