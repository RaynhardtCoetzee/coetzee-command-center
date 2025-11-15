# Documentation System

This file tells Cursor how to maintain documentation automatically.

## User Commands:

- `doc` - End of each day: Update today's progress
- `📊 week [N]` - End of each week (Friday): Weekly summary
- `📝 Decision: [title]` - After major decisions: Log architectural decision
- `✅ [task-name]` - After completing tasks: Mark task complete

## Rules for Cursor:

1. **Proactively suggest documentation updates** when:
   - Features are completed
   - Major code changes are made
   - Decisions are made

2. **End of Day (`doc` command):**
   - Summarize completed work
   - Update roadmap if tasks finished
   - Note any blockers or issues

3. **End of Week (`📊 week [N]` command):**
   - Review entire week's progress
   - Update roadmap with completion dates
   - Update progress percentages
   - Summarize achievements
   - Plan next week's focus

4. **After Decisions (`📝 Decision: [title]` command):**
   - Log in `documentation/decisions/decisions.md` immediately
   - Include: Context, Reasoning, Impact, Alternatives
   - Link to related issues/PRs if applicable

5. **After Tasks (`✅ [task-name]` command):**
   - Mark task complete in roadmap
   - Add completion date
   - Update progress percentages
   - Note any follow-ups needed

## Auto-Update Format:

When updating, say:
"📝 Documentation updated:
- ✅ Roadmap: [what changed]
- 📊 Progress: [old%] → [new%]
- 📝 Added: [what was added]"