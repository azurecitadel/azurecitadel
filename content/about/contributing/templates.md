---
title: "Page Templates"
description: "Understanding Hugo page templates and layouts available in the Azure Citadel theme"
weight: 50
draft: false
---

# Page Templates

The Azure Citadel Hugo theme provides several page templates (layouts) to control how your content is rendered. Understanding these templates helps you choose the right presentation for your content.

## Available Templates

### Default Templates

If you don't specify a `layout:` in your front matter, Hugo automatically chooses:

- **Index pages** (`_index.md` files) → Uses `list.html`
- **Regular pages** → Uses `single.html`

### Explicit Layout Options

You can override the default behavior by specifying a layout in your front matter:

```yaml
---
title: "My Page"
layout: series
---
```

## Template Reference

### `single` Layout

**Purpose**: Individual content pages
**Usage**: `layout: single`
**Features**:
- Clean, focused layout for article content
- Table of contents in right sidebar (if headings present)
- Contribution section at bottom
- No child page listing

**Best for**: Documentation pages, articles, tutorials

### `series` Layout

**Purpose**: Multi-part content with sequential navigation
**Usage**: `layout: series`
**Features**:
- Right sidebar with series progress indicator
- Visual progress bar showing completion status
- Previous/Next navigation between series pages
- Auto-generated listing of child pages
- Series-aware table of contents
- Bottom pagination with series context

**Best for**: Workshops, multi-part tutorials, step-by-step guides

**Advanced Feature**: Insert `<!-- SERIES_PAGES -->` marker in your content to control where child pages appear (allows content before AND after the page listing)

**Requirements**: Pages in the series must have a `series` parameter in front matter:
```yaml
series: ["my-workshop-series"]
```

**Example with custom placement**:
```markdown
---
layout: series
---

# My Workshop Series

Welcome to this workshop series...

## Workshop Modules

<!-- SERIES_PAGES -->

## Prerequisites

Additional information after the module listing...
```### `list` Layout (Default for Index Pages)

**Purpose**: Section overview pages
**Usage**: Default for `_index.md` files, or `layout: list`
**Features**:
- Page title and description
- All markdown content rendered first
- Auto-generated child page tiles
- Clean, simple presentation

**Best for**: Section landing pages, category overviews

### Special Templates

#### `blank` Layout
**Purpose**: Minimal pages without standard site navigation
**Usage**: `layout: blank`
**Features**: Bare-bones HTML structure
**Best for**: Special-purpose pages, embeds, print versions

## Template Selection Guide

| Content Type | Recommended Template | Reason |
|--------------|---------------------|---------|
| Documentation article | `single` | Focused reading experience |
| Multi-part workshop | `series` | Sequential navigation and progress tracking |
| Workshop with custom content placement | `series` + `<!-- SERIES_PAGES -->` | Content control around page listings |
| Section landing page | `list` (default) | Overview with child page navigation |
| Category overview | `list` | Simple, clean presentation |
| Special purpose page | `blank` | Minimal interference |

## Front Matter Examples

### Basic Article
```yaml
---
title: "Getting Started with Azure CLI"
description: "Learn the basics of Azure CLI"
layout: single
---
```

### Workshop Series
```yaml
---
title: "Azure Landing Zones Workshop"
description: "Complete workshop series for ALZ"
layout: series
series: ["alz-workshop"]
---
```

### Series with Content Control
```yaml
---
title: "Advanced Kubernetes Workshop"
description: "Deep dive into Kubernetes concepts"
layout: series
series: ["k8s-advanced"]
---
```

Then add `<!-- SERIES_PAGES -->` marker in your markdown content where you want the child pages to appear.## Template Development

### Creating Custom Templates

Templates are located in `themes/citadel/layouts/_default/`. To create a new template:

1. Create a new `.html` file in the layouts directory
2. Use Hugo template syntax and extend the base template
3. Reference it in front matter with `layout: your-template-name`

### Template Hierarchy

Hugo follows a specific lookup order for templates:
1. `layout:` specified in front matter
2. Section-specific template (e.g., `layouts/alz/list.html`)
3. Default template (`layouts/_default/list.html` or `single.html`)

## Best Practices

1. **Use `single` for most documentation** - It's optimized for reading
2. **Use `series` for sequential content** - Provides navigation context
3. **Use `series-split` when you need content control** - Allows custom placement
4. **Test your layout choice** - Preview to ensure the presentation matches your intent
5. **Be consistent within sections** - Use the same template for similar content types

## Shortcodes vs Templates

Remember that templates control page layout, while [shortcodes](/about/contributing/shortcodes) control content within pages:

- **Templates**: Overall page structure and navigation
- **Shortcodes**: Embedded content like diagrams, videos, code blocks

Both work together to create the complete page experience.
