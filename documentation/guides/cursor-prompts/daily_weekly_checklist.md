# 📋 Coetzee Command Center - Documentation Checklist

Print this out or keep on your second monitor!

---

## ☀️ DAILY CHECKLIST (End of Coding Session)

### Quick Documentation (5 minutes)

**Before closing Cursor each day, say:**

```
"End of day documentation:
Today I completed: [list features/tasks]
Tomorrow I'll work on: [next focus]
Update roadmap and log any decisions"
```

**Manual Checklist:**
- [ ] Screenshot anything cool you built today
- [ ] Note any bugs to fix tomorrow
- [ ] Update .cursor/roadmap.md "Current Sprint" notes
- [ ] Git commit with meaningful message

**Cursor Prompt:**
```bash
"doc"  # Then verify Cursor updates the right things
```

---

## 📅 MONDAY CHECKLIST (Week Start)

### Set Weekly Focus (10 minutes)

**Prompt Cursor:**
```
"Week [N] planning:
This week's goal: [main objective]
Tasks to complete:
- Task 1
- Task 2  
- Task 3
Update roadmap with this week's focus"
```

**Manual Actions:**
- [ ] Review last week's progress
- [ ] Set realistic goals for this week (3-5 tasks)
- [ ] Block calendar time for coding
- [ ] Review .cursor/roadmap.md to see current phase

**Save This View:**
Keep `.cursor/roadmap.md` open in a tab all week

---

## 🎯 WEDNESDAY CHECKLIST (Mid-Week Check)

### Progress Check (5 minutes)

**Prompt Cursor:**
```
"Mid-week check for week [N]:
Completed so far: [list]
Still in progress: [list]  
Am I on track? Update progress percentage"
```

**Manual Actions:**
- [ ] Are you 50%+ done with this week's goals?
- [ ] If behind, what can you adjust?
- [ ] If ahead, what can you add?
- [ ] Update .cursor/roadmap.md Current Sprint section

---

## 🎉 FRIDAY CHECKLIST (Week End)

### Weekly Review (30 minutes)

**Big Prompt for Cursor:**
```
"📊 WEEKLY REVIEW - Week [N]

Completed this week:
1. [Feature/task 1]
2. [Feature/task 2]
3. [Feature/task 3]

In progress (not finished):
- [Task A] - 70% done
- [Task B] - 30% done

Blockers encountered:
- [Any issues that slowed you down]

Decisions made:
- [Decision 1 + why]
- [Decision 2 + why]

What I learned:
- [New skill/technique]
- [Helpful resource found]

Next week's focus:
- [Priority 1]
- [Priority 2]

Please:
1. Update .cursor/roadmap.md completely
2. Mark all completed tasks with [x]
3. Update progress percentages
4. Add decisions to decision log
5. Update "Completed Milestones" if any phase done
6. Create "Current Sprint" section for next week"
```

**Manual Actions:**
- [ ] Review git commits from this week
- [ ] Celebrate wins! (Even small ones)
- [ ] Screenshot your best work
- [ ] Update any design/architecture docs if needed
- [ ] Plan next week's schedule
- [ ] Backup/push all code to GitHub

---

## 🗓️ MONTHLY CHECKLIST (End of Month)

### Monthly Review (1 hour)

**Prompt Cursor:**
```
"📈 MONTHLY REVIEW - [Month Name]

Completed this month:
[List all major features/milestones]

Progress by phase:
- Phase 1: [% complete]
- Current week: [N]

Key decisions made:
[List major architectural/tech decisions]

Metrics:
- Features completed: [N]
- Components created: [N]
- API routes built: [N]
- Documentation pages: [N]

Challenges faced:
[What was difficult?]

Lessons learned:
[What would you do differently?]

Next month's goals:
[What phase/features are next?]

Please update:
1. All roadmap progress
2. Add monthly milestone
3. Update any outdated architecture docs
4. Compile decision log summary"
```

**Manual Actions:**
- [ ] Review entire .cursor/roadmap.md
- [ ] Update README with latest screenshots
- [ ] Review and refactor any messy code
- [ ] Performance check (run Lighthouse)
- [ ] Security check (update dependencies)
- [ ] Backup database
- [ ] Update project README
- [ ] Consider writing a blog post about progress

---

## 🚨 AFTER MAJOR DECISIONS (Immediate)

### Decision Logging (2 minutes)

**When you make an important choice, immediately say:**

```
"📝 Log Decision:

Title: [e.g., "Switching from Prisma to Drizzle"]
Context: [What problem/situation?]
Decision: [What did you choose?]
Why: [Your reasoning - 1-2 sentences]
Alternatives: [What else did you consider?]
Impact: [How does this change the project?]
Status: Implemented / Planned

Add to .cursor/roadmap.md decision log"
```

**Examples of "Major Decisions":**
- Choosing between libraries/frameworks
- Changing database structure significantly
- Adding/removing major features
- Architectural changes
- Deployment platform choices
- Authentication strategy changes

---

## ✅ AFTER COMPLETING ROADMAP TASKS (Immediate)

### Task Completion (1 minute)

**Every time you finish a task from the roadmap:**

```
"✅ Completed: [Task name]
Week: [N]
Files changed: [list]
Mark complete in roadmap and update progress %"
```

**Quick Check:**
- [ ] Does it work as expected?
- [ ] Is it responsive?
- [ ] Dark mode working?
- [ ] Did you commit the code?

---

## 🎨 AFTER DISCOVERING NEW PATTERNS (As Needed)

### Pattern Documentation (5 minutes)

**When you solve something complex or find a great pattern:**

```
"📚 New Pattern Found:

Name: [e.g., "Optimistic Updates with Error Rollback"]
Problem: [What does this solve?]
Solution: [Your approach]
When to use: [Specific scenarios]
Example code: [Brief snippet or filename]

Add to .cursor/component-patterns.md"
```

**Examples of Patterns Worth Documenting:**
- Complex form validation
- Reusable hooks
- Animation patterns
- Data fetching strategies
- Error handling approaches
- Layout patterns

---

## 💾 BACKUP CHECKLIST (Weekly)

### Protect Your Work (5 minutes)

**Every Friday after review:**

- [ ] Git push all branches
- [ ] Ensure main/develop branches are up to date
- [ ] Check GitHub Actions are passing
- [ ] Export database schema backup
- [ ] Verify .env.example is up to date
- [ ] Push to remote repository
- [ ] Optional: Create release tag if milestone hit

**Quick command:**
```bash
git add .
git commit -m "docs: weekly review week [N]"
git push origin main
```

---

## 🎯 SIMPLIFIED DAILY WORKFLOW

Can't do the full checklist? Use this minimal version:

### Morning (30 seconds):
```
"What's my focus today?"
[Check Current Sprint in roadmap.md]
```

### During Day (as you work):
```
"✅ [task-name]"  # Mark tasks complete
"📝 [quick decision note]"  # Log decisions
```

### Evening (2 minutes):
```
"doc"  # Update everything
[Verify and approve Cursor's updates]
```

### Friday (10 minutes):
```
"📊 week [N]"  # Full weekly review
[Verify and approve Cursor's updates]
```

---

## 📱 PHONE/MOBILE VERSION

### Can't access computer? Send yourself notes:

**Email/Note to Self:**
```
Week N Update:
✅ Done: [task]
📝 Decision: [choice]
💡 Learned: [thing]
🚧 Tomorrow: [focus]
```

Then on Monday, prompt Cursor:
```
"Update docs from my notes: [paste notes]"
```

---

## 🎨 VISUAL PROGRESS TRACKER

### Print and hang on wall:

```
┌─────────────────────────────────────┐
│  COETZEE COMMAND CENTER - PHASE 1   │
├─────────────────────────────────────┤
│                                     │
│  Week 1-2: Setup          [████████] 100%  │
│  Week 3-4: Projects       [████░░░░]  50%  │
│  Week 5-6: Clients        [░░░░░░░░]   0%  │
│  Week 7-8: Components     [░░░░░░░░]   0%  │
│  Week 9:   Docs           [░░░░░░░░]   0%  │
│  Week 10:  Dashboard      [░░░░░░░░]   0%  │
│  Week 11:  Polish         [░░░░░░░░]   0%  │
│  Week 12:  Launch         [░░░░░░░░]   0%  │
│                                     │
│  Overall Progress:         [███░░░░░]  31%  │
└─────────────────────────────────────┘

Current Week: 3
Current Focus: Project Management
Days Left in Phase 1: 77 days
```

Update this manually or prompt Cursor for ASCII art progress!

---

## 🏆 MILESTONE CELEBRATIONS

### When you complete a major milestone:

**Prompt Cursor:**
```
"🎉 MILESTONE COMPLETE: [Name]
Date: [Today's date]
What was achieved: [Summary]
Time taken: [Estimated vs actual]
Key features: [List]

Update roadmap with completed milestone
Add to achievement log"
```

**Then YOU celebrate:**
- [ ] Take a break!
- [ ] Share progress (Twitter/LinkedIn)
- [ ] Show someone what you built
- [ ] Treat yourself to something nice
- [ ] Update portfolio with screenshots
- [ ] Write a blog post

---

## 🔧 TROUBLESHOOTING DOCUMENTATION

### If Cursor isn't updating docs properly:

**Try this prompt:**
```
"Cursor, I need you to be more proactive about documentation.

From now on, after completing ANY task:
1. Automatically ask: 'Should I update the roadmap?'
2. Show me exactly what you plan to update
3. Wait for my approval before making changes

Let's practice:
I just completed building the project card component.
What should you do now?"
```

**Reset if needed:**
```
"Reset: Please re-read .cursorrules and .cursor/roadmap.md
Follow the documentation rules strictly going forward"
```

---

## 📊 PROGRESS METRICS TO TRACK

Keep a simple spreadsheet or note:

| Week | Tasks Done | Hours Coded | Features Added | Bugs Fixed |
|------|-----------|-------------|----------------|------------|
| 1    | 4         | 12          | 0              | 0          |
| 2    | 6         | 15          | 2              | 3          |
| 3    | ...       | ...         | ...            | ...        |

---

## 🎯 REMEMBER

**The goal is NOT perfect documentation.**

**The goal is:**
- ✅ Track your progress
- ✅ Remember your decisions
- ✅ See how far you've come
- ✅ Learn from what works

**Don't let documentation slow you down.**

**If you only do ONE thing:** Weekly Friday review (30 mins)

---

## 💡 PRO TIPS

1. **Set a Friday 4pm alarm** - "Time for weekly review"
2. **Keep roadmap.md pinned** in Cursor sidebar
3. **Use voice-to-text** for quick notes during coding
4. **Batch documentation** - Don't break flow during coding
5. **Make it satisfying** - Checking off tasks feels GOOD
6. **Share progress** - Post screenshots, hold yourself accountable
7. **Be honest** - If you're behind, adjust the plan
8. **Celebrate wins** - Even small completions matter

---

## 🖨️ PRINT-FRIENDLY VERSION

### Daily Quick Check:
```
□ Completed: _________________
□ Tomorrow: _________________  
□ Say: "doc"
```

### Weekly Review (Friday):
```
Week: ___  Date: _________

✅ Done:
□ _______________________
□ _______________________
□ _______________________

📝 Decisions:
_____________________________
_____________________________

💡 Learned:
_____________________________
_____________________________

🎯 Next Week:
□ _______________________
□ _______________________

Say: "📊 week [N]"
```

---

## 🚀 START TODAY

**Right now, say to Cursor:**

```
"Let's establish our documentation routine.

Going forward:
- End of each day: I'll say 'doc'
- End of each week (Friday): I'll say '📊 week [N]'  
- After major decisions: I'll say '📝 Decision: [title]'
- After completing tasks: I'll say '✅ [task-name]'

You should:
- Proactively ask about documentation
- Update roadmap automatically
- Keep decision log current
- Track progress percentages

Acknowledge and let's start with today's update:
Today I completed: [what you did today]"
```

---

**Remember: 5 minutes of documentation today saves 5 hours of confusion next month!** 

🎉 **Happy documenting!**
