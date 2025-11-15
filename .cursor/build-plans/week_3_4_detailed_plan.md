# 🚀 Week 3-4: Project Management System

## 📊 Overview

**Goal:** Build complete project management with CRUD operations, task system, and drag-and-drop

**Duration:** 2 weeks (10-14 coding days)

**End Result:** Fully functional project tracker that replaces Trello/Asana

---

## ✅ Week 3-4 Deliverables Checklist

By the end, you'll have:

- [ ] Projects list page with grid/list views
- [ ] Project detail page with full information
- [ ] Create/edit project forms with validation
- [ ] Task management with CRUD operations
- [ ] Drag-and-drop task reordering
- [ ] Kanban board view
- [ ] Status badges and progress tracking
- [ ] Project filters and search
- [ ] Project archiving functionality
- [ ] Link projects to clients

---

## 🗓️ Day-by-Day Build Plan

### **DAY 1-2: Database & API Routes**

#### Tasks:
1. Verify Prisma schema is complete (already done in setup)
2. Create API routes for projects
3. Create API routes for tasks
4. Test with Prisma Studio

#### Prompt Cursor:

```
"Week 3-4: Project Management - Day 1

Let's start with the backend:

1. Create /app/api/projects/route.ts with:
   - GET: Fetch all user's projects (with filters for status)
   - POST: Create new project (validate with Zod)
   
2. Create /app/api/projects/[id]/route.ts with:
   - GET: Fetch single project with tasks and client
   - PATCH: Update project
   - DELETE: Delete project

3. Create /app/api/tasks/route.ts with:
   - GET: Fetch tasks (by project)
   - POST: Create task

4. Create /app/api/tasks/[id]/route.ts with:
   - PATCH: Update task (status, order, etc)
   - DELETE: Delete task

Follow .cursor/api-conventions.md for structure.
Include proper auth checks, validation, and error handling."
```

#### Verify:
- [ ] Can create project via API
- [ ] Can fetch projects via API
- [ ] Can update project via API
- [ ] Can create/update tasks via API
- [ ] Proper error responses (401, 400, 500)
All requested features are implemented and working:
-Project CRUD operations
-Task create/update operations
Error handling (401, 400, 404, 500)
Authentication and authorization
Input validation with Zod
Ready for frontend integration

---

### **DAY 3: Validation Schemas & Types**

#### Tasks:
1. Create Zod validation schemas
2. Create TypeScript types
3. Create custom hooks for data fetching

#### Prompt Cursor:

```
"Day 3: Validation & Hooks

1. Create src/lib/validations/project.ts with:
   - projectSchema (Zod schema for creating/updating)
   - taskSchema (Zod schema for tasks)

2. Create src/hooks/use-projects.ts with:
   - useProjects() - fetch all projects
   - useProject(id) - fetch single project
   - useCreateProject() - mutation for creating
   - useUpdateProject(id) - mutation for updating
   - useDeleteProject(id) - mutation for deleting

3. Create src/hooks/use-tasks.ts with:
   - useTasks(projectId) - fetch tasks for project
   - useCreateTask() - create task
   - useUpdateTask(id) - update task
   - useDeleteTask(id) - delete task

Use TanStack Query with proper error handling and optimistic updates."
```

#### Verify:
- [ ] Schemas validate correctly
- [ ] Hooks return proper types
- [ ] Loading states work
- [ ] Error states work

---

### **DAY 4-5: Projects List Page**

#### Tasks:
1. Create projects list page
2. Build project card component
3. Add filters and search
4. Add grid/list view toggle

#### Prompt Cursor:

```
"Day 4: Projects List Page

1. Create src/app/(dashboard)/projects/page.tsx:
   - Fetch projects with useProjects()
   - Show loading skeleton
   - Show empty state if no projects
   - Grid of project cards
   - Filter by status (all, active, archived)
   - Search by title
   - 'New Project' button

2. Create src/components/projects/project-card.tsx:
   - Show project title, description (truncated)
   - Show client name (if linked)
   - Status badge
   - Progress bar (based on tasks)
   - Due date with indicator (overdue = red, soon = yellow)
   - Tech stack tags
   - Click to navigate to detail page
   - Hover effect

3. Create src/components/projects/projects-list-header.tsx:
   - Search input
   - Status filter dropdown
   - View toggle (grid/list)
   - Sort options (due date, created, name)

Follow our design system in .cursor/design-system.md.
Make it responsive and support dark mode."
```

#### Verify:
- [ ] Projects load and display
- [ ] Cards look good
- [ ] Filters work
- [ ] Search works
- [ ] Responsive on mobile
- [ ] Dark mode works
- [ ] Empty state shows correctly

---

### **DAY 6-7: Create/Edit Project Form**

#### Tasks:
1. Create project form component
2. Add to "new project" page
3. Add to "edit project" modal/page
4. Client selector

#### Prompt Cursor:

```
"Day 6: Project Form

1. Create src/components/projects/project-form.tsx:
   - Use React Hook Form with Zod validation
   - Fields:
     * Title (required)
     * Description (textarea, optional)
     * Client (select dropdown, optional)
     * Status (select: planning, active, review, completed)
     * Priority (select: low, medium, high)
     * Start date (date picker, optional)
     * Due date (date picker, optional)
     * Budget (number input, optional)
     * Tech stack (multi-select or tags input)
   - Real-time validation
   - Loading state on submit
   - Error display
   - Success toast on save

2. Create src/app/(dashboard)/projects/new/page.tsx:
   - Use ProjectForm component
   - On success, redirect to project detail
   - Show 'Cancel' button to go back

3. Create src/components/projects/edit-project-dialog.tsx:
   - Dialog/modal with ProjectForm
   - Pre-fill with existing data
   - On success, close and refetch

Follow .cursor/component-patterns.md for form patterns."
```

#### Verify:
- [ ] Form validates correctly
- [ ] All fields work
- [ ] Client dropdown shows clients
- [ ] Can create new project
- [ ] Can edit existing project
- [ ] Success/error messages show
- [ ] Redirects work

---

### **DAY 8-9: Project Detail Page**

#### Tasks:
1. Create project detail page
2. Show all project information
3. Integrate task list
4. Add quick actions

#### Prompt Cursor:

```
"Day 8: Project Detail Page

1. Create src/app/(dashboard)/projects/[id]/page.tsx:
   - Fetch project with useProject(id)
   - Show loading skeleton
   - 404 if not found

2. Layout sections:
   - Header:
     * Title with edit button
     * Status badge
     * Priority indicator
     * Quick actions (Edit, Archive, Delete)
   
   - Project Info Card:
     * Client (link to client page)
     * Dates (start, due)
     * Budget
     * Progress bar
     * Description
   
   - Tech Stack:
     * Display as badges/pills
   
   - Tasks Section:
     * Task list component (build next)
     * 'Add Task' button
     * Task count summary
   
   - Notes Section:
     * Display notes
     * Edit button

3. Create src/components/projects/project-header.tsx:
   - Title, status, actions
   - Breadcrumbs (Dashboard > Projects > [Name])

4. Create src/components/projects/project-info-card.tsx:
   - Display all project metadata
   - Editable inline or via dialog

Make it look polished with our design system."
```

#### Verify:
- [ ] Project loads correctly
- [ ] All information displays
- [ ] Can navigate to edit
- [ ] Can delete project (with confirmation)
- [ ] Responsive layout
- [ ] Loading states work

---

### **DAY 10-11: Task Management**

#### Tasks:
1. Create task list component
2. Create task item component
3. Add/edit/delete tasks
4. Task status updates

#### Prompt Cursor:

```
"Day 10: Task System

1. Create src/components/projects/task-list.tsx:
   - Fetch tasks with useTasks(projectId)
   - Group by status (todo, in_progress, review, done)
   - Collapsible sections
   - Empty state per section
   - Task count badges

2. Create src/components/projects/task-item.tsx:
   - Checkbox (complete/uncomplete)
   - Title (click to expand details)
   - Priority indicator
   - Due date
   - Quick delete button
   - Expandable details:
     * Description
     * Checklist items (if any)
     * Created/updated dates

3. Create src/components/projects/task-form-dialog.tsx:
   - Dialog for creating/editing tasks
   - Fields:
     * Title (required)
     * Description (optional)
     * Status
     * Priority
     * Due date (optional)
     * Tags (optional)
   - Validation with Zod

4. Create src/components/projects/add-task-button.tsx:
   - Opens task form dialog
   - Quick add inline (just title)

Include optimistic updates when checking off tasks."
```

#### Verify:
- [ ] Tasks display correctly
- [ ] Can add new task
- [ ] Can edit task
- [ ] Can delete task
- [ ] Can check off tasks
- [ ] Grouping by status works
- [ ] Optimistic updates feel snappy

---

### **DAY 12: Drag-and-Drop**

#### Tasks:
1. Install @dnd-kit
2. Add drag-and-drop to tasks
3. Persist new order

#### Prompt Cursor:

```
"Day 12: Drag-and-Drop

1. Implement drag-and-drop reordering in task-list.tsx:
   - Use @dnd-kit/core and @dnd-kit/sortable
   - Allow reordering within same status group
   - Visual feedback while dragging
   - Update task.order field on drop
   - Optimistic update, then sync to server

2. Add drag handle to task-item.tsx:
   - Icon or grip dots
   - Only show on hover
   - Cursor changes to grab

Reference .cursor/component-patterns.md for dnd-kit examples.
Make it smooth and intuitive."
```

#### Verify:
- [ ] Can drag tasks
- [ ] Visual feedback is clear
- [ ] Order persists after refresh
- [ ] Works on touch devices
- [ ] No janky animations

---

### **DAY 13: Kanban Board View**

#### Tasks:
1. Create kanban board component
2. Add view toggle
3. Drag tasks between columns

#### Prompt Cursor:

```
"Day 13: Kanban Board

1. Create src/components/projects/kanban-board.tsx:
   - 4 columns: To Do, In Progress, Review, Done
   - Each column shows tasks with that status
   - Drag tasks between columns = status change
   - Task count in column header
   - Scrollable columns

2. Create src/components/projects/kanban-column.tsx:
   - Column header with status and count
   - Drop zone for tasks
   - Visual feedback when hovering

3. Create src/components/projects/kanban-task-card.tsx:
   - Compact task card for kanban
   - Title, priority, due date
   - Click to open full task details

4. Add view toggle to project detail page:
   - Button to switch List ↔ Kanban
   - Store preference in localStorage or Zustand

Use @dnd-kit for drag between columns."
```

#### Verify:
- [ ] Kanban board displays
- [ ] Can drag between columns
- [ ] Status updates correctly
- [ ] View toggle works
- [ ] Preference persists

---

### **DAY 14: Polish & Filters**

#### Tasks:
1. Add advanced filtering
2. Add sorting options
3. Add loading skeletons
4. Add empty states
5. Add toast notifications

#### Prompt Cursor:

```
"Day 14: Polish & Complete

1. Add to projects list page:
   - Advanced filters (client, date range, tech stack)
   - Sort by: name, due date, created, priority, progress
   - Loading skeletons that match card layout
   - Beautiful empty states with CTAs

2. Add to project detail:
   - Loading skeleton for full page
   - Empty state for no tasks
   - Confirmation dialogs for delete actions
   - Success toasts for all actions

3. Create src/components/projects/project-filters.tsx:
   - Popover/dropdown with all filter options
   - Reset filters button
   - Show active filter count

4. Create src/components/projects/project-skeleton.tsx:
   - Skeleton for project cards
   - Skeleton for project detail

5. Test error states:
   - Network error handling
   - 404 not found pages
   - Permission errors

Make everything feel polished and professional."
```

#### Verify:
- [ ] Filters all work
- [ ] Sorting works
- [ ] Loading states look good
- [ ] Empty states are helpful
- [ ] Errors are handled gracefully
- [ ] Everything is responsive
- [ ] Dark mode perfect

---

## 🎯 Week 3-4 Components List

### Components to Build:

```
src/components/projects/
├── project-card.tsx           # Display project in grid
├── project-form.tsx           # Create/edit form
├── project-header.tsx         # Page header with actions
├── project-info-card.tsx      # Project details display
├── project-filters.tsx        # Advanced filtering
├── project-skeleton.tsx       # Loading skeletons
├── projects-list-header.tsx   # Search, filters, view toggle
├── task-list.tsx             # List of tasks
├── task-item.tsx             # Single task display
├── task-form-dialog.tsx      # Add/edit task
├── add-task-button.tsx       # Quick add button
├── kanban-board.tsx          # Kanban view
├── kanban-column.tsx         # Single kanban column
├── kanban-task-card.tsx      # Task card for kanban
└── edit-project-dialog.tsx   # Edit modal
```

---

## 🎨 Design Reference

### Color Coding:
- **Planning**: Blue (--primary-500)
- **Active**: Green (--success)
- **Review**: Orange (--warning)
- **Completed**: Gray (--muted)
- **Archived**: Light gray

### Priority Indicators:
- **High**: Red dot or border
- **Medium**: Yellow dot
- **Low**: Green dot

### Progress Bar:
- 0-30%: Red background
- 31-70%: Yellow background
- 71-100%: Green background

---

## 📚 Key Features Explained

### 1. **Optimistic Updates**
When user checks a task, UI updates immediately before server responds.

```typescript
const { mutate } = useUpdateTask(taskId);

const handleCheck = () => {
  // Update UI immediately
  queryClient.setQueryData(['tasks'], (old) => 
    old.map(t => t.id === taskId ? {...t, completed: true} : t)
  );
  
  // Send to server
  mutate({ completed: true });
};
```

### 2. **Drag-and-Drop**
Tasks can be reordered within status groups or moved between statuses.

```typescript
const handleDragEnd = (event) => {
  const { active, over } = event;
  // Calculate new order/status
  // Update locally then sync to server
};
```

### 3. **Real-time Validation**
Forms validate as user types using Zod + React Hook Form.

```typescript
const form = useForm({
  resolver: zodResolver(projectSchema),
  mode: 'onChange', // Validate on change
});
```

### 4. **Smart Filtering**
Filter by multiple criteria simultaneously with URL state.

```typescript
// URL: /projects?status=active&client=abc123&sort=dueDate
const filters = {
  status: searchParams.get('status'),
  clientId: searchParams.get('client'),
  sort: searchParams.get('sort') || 'createdAt',
};
```

---

## 🐛 Common Issues & Solutions

### Issue: Tasks not reordering
**Solution:** Make sure task.order field is being updated in database

### Issue: Drag-and-drop janky
**Solution:** Use proper collision detection: `closestCorners`

### Issue: Form not validating
**Solution:** Check Zod schema matches Prisma schema types

### Issue: Progress bar not updating
**Solution:** Recalculate progress when tasks change status

### Issue: Infinite loading state
**Solution:** Check API route returns proper status codes

---

## ✅ End of Week 3-4 Checklist

### Functionality:
- [ ] Can view all projects
- [ ] Can create new project
- [ ] Can edit project
- [ ] Can delete project (with confirmation)
- [ ] Can archive project
- [ ] Can filter projects
- [ ] Can search projects
- [ ] Can sort projects
- [ ] Can view project details
- [ ] Can add tasks to project
- [ ] Can edit tasks
- [ ] Can delete tasks
- [ ] Can reorder tasks (drag-drop)
- [ ] Can change task status
- [ ] Can view kanban board
- [ ] Can drag tasks between columns
- [ ] Progress auto-calculates

### Quality:
- [ ] All forms validate properly
- [ ] Loading states everywhere
- [ ] Error states handled
- [ ] Empty states are helpful
- [ ] Responsive on mobile
- [ ] Dark mode works perfectly
- [ ] Animations are smooth
- [ ] No console errors
- [ ] TypeScript compiles
- [ ] ESLint passes

### Performance:
- [ ] Page loads < 2 seconds
- [ ] Optimistic updates feel instant
- [ ] No unnecessary re-renders
- [ ] Proper React Query caching

---

## 📸 Screenshots to Take

Document your progress with screenshots:
1. Projects list view (grid)
2. Project detail page
3. Task list with different statuses
4. Kanban board view
5. Create project form
6. Mobile responsive view

---

## 🎓 What You'll Learn

By end of week 3-4, you'll be proficient in:
- React Query for data fetching
- React Hook Form + Zod validation
- Drag-and-drop with @dnd-kit
- Optimistic UI updates
- Complex filtering/sorting
- Component composition
- TypeScript generics
- API route patterns
- Database relationships

---

## 🚀 Week 3-4 Kickoff Prompt

**Say this to Cursor to start:**

```
"🚀 Starting Week 3-4: Project Management System

Goal: Build complete project CRUD with task management, drag-and-drop, and kanban board.

Reference:
- .cursor/roadmap.md - Week 3-4 section
- .cursor/architecture.md - For patterns
- .cursor/design-system.md - For styling
- .cursor/api-conventions.md - For API routes

Let's start with Day 1: API Routes for projects.

Create /app/api/projects/route.ts with full CRUD operations.
Follow all our conventions for auth, validation, and error handling."
```

---

## 📊 Track Your Progress

### Daily Update:
```
"Day [N] complete:
✅ Built: [what you built]
⏱️ Time spent: [hours]
🐛 Issues: [any problems]
📝 Learned: [new things]
Update roadmap"
```

### End of Week 4:
```
"📊 Week 3-4 Complete!

Built:
- Projects list page
- Project CRUD
- Task management
- Drag-and-drop
- Kanban board
- [list all features]

Progress: Week 3-4 now 100% ✅
Moving to: Week 5-6 (Client Management)

Update all documentation"
```

---

## 💡 Pro Tips

1. **Build iteratively** - Don't try to perfect each component. Get it working, then polish.

2. **Test as you go** - After each component, test it thoroughly before moving on.

3. **Use demo data** - Your seed data should have enough projects/tasks to test properly.

4. **Mobile first** - Build responsive from the start, don't retrofit later.

5. **Copy patterns** - If you solve something complex, document it in component-patterns.md immediately.

6. **Take breaks** - This is 2 weeks of solid building. Don't burn out!

---

## 🎉 Celebrate Milestones

### Mid-week (After Day 7):
- [ ] Projects list is working
- [ ] Can create/edit projects
- [ ] Take screenshot, share progress!

### End of Week 4:
- [ ] Full project management complete
- [ ] Drag-and-drop working
- [ ] Kanban board live
- [ ] 🎉 **YOU JUST BUILT A PROJECT TRACKER!**

---

**Ready to start? Say to Cursor:** 

```
"Let's begin Week 3-4. Start with Day 1: API Routes."
```

🚀 **Let's build something awesome!**
