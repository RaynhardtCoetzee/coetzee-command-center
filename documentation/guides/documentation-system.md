# Documentation System

This file tells Cursor how to maintain documentation automatically.

## User Commands:

- `doc` - End of each day: Update today's progress in `documentation/development/daily-log.md`
- `📊 week [N]` - End of each week (Friday): Weekly summary, update roadmap progress
- `📝 Decision: [title]` - After major decisions: Log architectural decision in `documentation/decisions/decisions.md`
- `✅ [task-name]` - After completing tasks: Mark task complete in `documentation/development/roadmap.md`

## Documentation Structure

All documentation files must be in the `documentation/` folder with proper subfolders:

```
documentation/
├── architecture/        # Technical architecture docs
│   ├── architecture.md
│   ├── database-schema.md
│   └── api-conventions.md
├── development/         # Development process docs
│   ├── roadmap.md
│   ├── daily-log.md
│   └── common-tasks.md
├── decisions/          # Architectural decisions
│   └── decisions.md
├── design/            # Design system and patterns
│   ├── design-system.md
│   └── component-patterns.md
└── guides/            # How-to guides
    ├── documentation-system.md
    └── cursor-prompts/
```

## Rules for Cursor:

1. **Proactively suggest documentation updates** when:
   - Features are completed
   - Major code changes are made
   - Decisions are made

2. **End of Day (`doc` command):**
   - Update `documentation/development/daily-log.md`
   - Summarize completed work
   - Update roadmap if tasks finished
   - Note any blockers or issues

3. **End of Week (`📊 week [N]` command):**
   - Review entire week's progress
   - Update `documentation/development/roadmap.md` with completion dates
   - Update progress percentages
   - Summarize achievements in daily-log.md
   - Plan next week's focus

4. **After Decisions (`📝 Decision: [title]` command):**
   - Log in `documentation/decisions/decisions.md` immediately
   - Include: Context, Reasoning, Impact, Alternatives
   - Link to related issues/PRs if applicable

5. **After Tasks (`✅ [task-name]` command):**
   - Mark task complete in `documentation/development/roadmap.md`
   - Add completion date
   - Update progress percentages
   - Note any follow-ups needed

## File Organization Rules

**ALL documentation files MUST be in the `documentation/` folder:**
- ❌ Don't create docs in root or `.cursor/` folder
- ✅ Always use proper subfolder structure
- ✅ Use descriptive filenames in kebab-case
- ✅ Update this index when adding new documentation

## Auto-Update Format:

When updating, say:
"📝 Documentation updated:
- ✅ Roadmap: [what changed]
- 📊 Progress: [old%] → [new%]
- 📝 Added: [what was added]"

