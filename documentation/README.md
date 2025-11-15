# Documentation

This directory contains all project documentation organized by category.

## Structure

```
documentation/
├── architecture/        # Technical architecture documentation
│   ├── architecture.md         # Overall architecture, tech stack
│   ├── database-schema.md      # Database schema and queries
│   ├── api-conventions.md      # API route standards
│   └── optimistic-updates.md   # Optimistic updates pattern
│
├── development/         # Development process documentation
│   ├── roadmap.md              # Development timeline and progress
│   ├── daily-log.md            # Daily development log
│   ├── weekly-review.md        # Weekly development summaries
│   └── common-tasks.md         # Frequently used commands
│
├── decisions/          # Architectural decision log
│   └── decisions.md            # All architectural decisions
│
├── design/            # Design system and component patterns
│   ├── design-system.md        # UI/UX standards, colors, typography
│   └── component-patterns.md   # Code patterns and conventions
│
└── guides/            # How-to guides
        ├── documentation-system.md # How to maintain documentation
        ├── mobile-responsiveness.md # Mobile-first responsive design guide
        ├── database-troubleshooting.md # Fix common database issues
        └── cursor-prompts/         # Cursor AI prompts and templates
```

## Quick Links

- [Roadmap](development/roadmap.md) - See current progress
- [Daily Log](development/daily-log.md) - Today's work
- [Weekly Review](development/weekly-review.md) - Weekly summaries
- [Architecture](architecture/architecture.md) - Tech stack overview
- [Database Schema](architecture/database-schema.md) - Database structure
- [API Conventions](architecture/api-conventions.md) - API standards
- [Optimistic Updates](architecture/optimistic-updates.md) - Optimistic update patterns
- [Decisions](decisions/decisions.md) - Architectural decisions
- [Design System](design/design-system.md) - UI/UX guidelines
- [Component Patterns](design/component-patterns.md) - Component code patterns
- [React Query Patterns](guides/react-query-patterns.md) - React Query usage guide
- [Mobile Responsiveness](guides/mobile-responsiveness.md) - Mobile-first design guide
- [Database Troubleshooting](guides/database-troubleshooting.md) - Fix common database issues

## Adding New Documentation

All documentation files **must** be placed in the appropriate subfolder:

- Architecture docs → `architecture/`
- Development process → `development/`
- Decisions → `decisions/`
- Design/UI → `design/`
- How-to guides → `guides/`

Use descriptive filenames in kebab-case (e.g., `api-conventions.md`).

