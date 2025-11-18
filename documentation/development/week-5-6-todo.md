# Week 5-6: Client Management System - To-Do List

## 📊 Overview

**Goal:** Build complete client management system with CRUD operations, project linking, and communication history

**Duration:** 2 weeks (14 coding days)

**End Result:** Fully functional client tracker with project associations and communication logs

---

## ✅ Week 5-6 Deliverables Checklist

By the end, you'll have:

- [ ] Clients list page with grid/list views
- [ ] Client detail page with full information
- [ ] Create/edit client forms with validation
- [ ] Link clients to projects
- [ ] View all projects for a client
- [ ] Communication history tracking
- [ ] Add/view/edit communication entries
- [ ] Client statistics (project count, active projects)
- [ ] Client filters and search
- [ ] Mobile-responsive client pages

---

## 🗓️ Day-by-Day Build Plan

### **DAY 1: Complete Client CRUD API**

#### Tasks:
1. Create POST `/api/clients` route (create client)
2. Create PATCH `/api/clients/[id]` route (update client)
3. Create DELETE `/api/clients/[id]` route (delete client)
4. Create GET `/api/clients/[id]` route (get single client with projects)
5. Add Zod validation schemas for client operations
6. Test all routes with proper auth, validation, and error handling

#### Files to Create/Update:
- `src/app/api/clients/[id]/route.ts` (new)
- `src/app/api/clients/route.ts` (update - add POST)
- `src/lib/validations/client.ts` (new)

#### Acceptance Criteria:
- [x] Can create client via API ✅
- [x] Can update client via API ✅
- [x] Can delete client via API ✅
- [x] Can fetch single client with projects ✅
- [x] Proper validation (name required, email format, etc.) ✅
- [x] Proper error responses (401, 400, 404, 409, 500) ✅
- [x] User ownership verification ✅

**Status:** ✅ Completed - November 18, 2025

---

### **DAY 2: Client CRUD UI Components**

#### Tasks:
1. Create `ClientCard` component (for grid view)
2. Create `ClientList` component (for list view)
3. Create `ClientForm` component (create/edit)
4. Create `ClientFormDialog` component
5. Create React Query hooks (`useClients`, `useClient`, `useCreateClient`, `useUpdateClient`, `useDeleteClient`)
6. Update API client with client methods

#### Files to Create:
- `src/components/clients/client-card.tsx`
- `src/components/clients/client-list.tsx`
- `src/components/clients/client-form.tsx`
- `src/components/clients/client-form-dialog.tsx`
- `src/hooks/use-clients.ts` (update - add mutations)
- `src/lib/api-client.ts` (update - add client methods)

#### Acceptance Criteria:
- [ ] ClientCard displays name, email, phone, status, project count
- [ ] ClientForm validates all fields
- [ ] Can create client from UI
- [ ] Can edit client from UI
- [ ] Can delete client from UI (with confirmation)
- [ ] Loading states work
- [ ] Error states handled gracefully

---

### **DAY 3: Clients List Page**

#### Tasks:
1. Create `/clients` page component
2. Add filters (status, search by name/email)
3. Add sorting options (name, date created, project count)
4. Add view toggle (grid/list)
5. Add "Create Client" button
6. Display empty state when no clients
7. Show client statistics (total clients, active clients)

#### Files to Create/Update:
- `src/app/(dashboard)/clients/page.tsx` (update)
- `src/components/clients/clients-list-header.tsx` (new)
- `src/components/clients/client-filters.tsx` (new)

#### Acceptance Criteria:
- [ ] Can view all clients in grid view
- [ ] Can view all clients in list view
- [ ] Can filter by status (active, inactive, archived)
- [ ] Can search by name or email
- [ ] Can sort by name, date, project count
- [ ] Empty state shows helpful message
- [ ] Statistics display correctly

---

### **DAY 4: Client Detail Page**

#### Tasks:
1. Create `/clients/[id]` page component
2. Display client information (name, email, phone, status)
3. Show list of projects linked to this client
4. Add "Edit Client" button
5. Add "Delete Client" button (with confirmation)
6. Add "Add Project" quick action
7. Show client statistics (total projects, active projects, completed projects)

#### Files to Create:
- `src/app/(dashboard)/clients/[id]/page.tsx` (new)
- `src/components/clients/client-header.tsx` (new)
- `src/components/clients/client-info-card.tsx` (new)
- `src/components/clients/client-projects-list.tsx` (new)

#### Acceptance Criteria:
- [ ] Can view client details
- [ ] Can see all projects for this client
- [ ] Can navigate to project from client page
- [ ] Can edit client from detail page
- [ ] Can delete client from detail page
- [ ] Statistics display correctly
- [ ] Empty state when no projects

---

### **DAY 5: Link Clients to Projects**

#### Tasks:
1. Update project form to include client selection
2. Add client dropdown/autocomplete in project form
3. Update project cards to show client name
4. Update project detail page to show client link
5. Add "View Client" link from project page
6. Update project filters to filter by client

#### Files to Update:
- `src/components/projects/project-form.tsx`
- `src/components/projects/project-card.tsx`
- `src/components/projects/project-card-list.tsx`
- `src/app/(dashboard)/projects/[id]/page.tsx`
- `src/components/projects/project-filters.tsx`

#### Acceptance Criteria:
- [ ] Can select client when creating project
- [ ] Can change client when editing project
- [ ] Client name displays on project cards
- [ ] Can navigate from project to client
- [ ] Can filter projects by client
- [ ] Client link works correctly

---

### **DAY 6: Validation & Hooks with Optimistic Updates**

#### Tasks:
1. Enhance client mutation hooks with optimistic updates
2. Add proper error handling with rollback
3. Add context snapshots for failed mutations
4. Verify all Zod validation schemas
5. Add loading states to all client operations
6. Add error states to all client operations

#### Files to Update:
- `src/hooks/use-clients.ts`
- `src/lib/validations/client.ts`

#### Acceptance Criteria:
- [ ] All mutations provide instant UI feedback
- [ ] Errors rollback correctly
- [ ] Loading states work everywhere
- [ ] Error states are helpful
- [ ] TypeScript types are correct
- [ ] No console errors

---

### **DAY 7: Communication History Model & API**

#### Tasks:
1. Create Communication model in Prisma schema
2. Run migration to add Communication table
3. Create POST `/api/clients/[id]/communications` route
4. Create GET `/api/clients/[id]/communications` route
5. Create PATCH `/api/communications/[id]` route
6. Create DELETE `/api/communications/[id]` route
7. Add Zod validation for communications

#### Files to Create:
- `prisma/schema.prisma` (update - add Communication model)
- `src/app/api/clients/[id]/communications/route.ts` (new)
- `src/app/api/communications/[id]/route.ts` (new)
- `src/lib/validations/communication.ts` (new)

#### Communication Model Fields:
- id (String, cuid)
- clientId (String, foreign key)
- userId (String, foreign key)
- type (String: 'email', 'call', 'meeting', 'note')
- subject (String, optional)
- content (String, Text)
- date (DateTime)
- createdAt, updatedAt

#### Acceptance Criteria:
- [ ] Can create communication entry via API
- [ ] Can fetch all communications for a client
- [ ] Can update communication via API
- [ ] Can delete communication via API
- [ ] Proper validation (type required, content required)
- [ ] User ownership verification

---

### **DAY 8: Communication History UI Components**

#### Tasks:
1. Create `CommunicationList` component
2. Create `CommunicationItem` component
3. Create `CommunicationForm` component
4. Create `CommunicationFormDialog` component
5. Create React Query hooks for communications
6. Update API client with communication methods

#### Files to Create:
- `src/components/clients/communication-list.tsx`
- `src/components/clients/communication-item.tsx`
- `src/components/clients/communication-form.tsx`
- `src/components/clients/communication-form-dialog.tsx`
- `src/hooks/use-communications.ts` (new)
- `src/lib/api-client.ts` (update - add communication methods)

#### Acceptance Criteria:
- [ ] Can view communication history
- [ ] Communications display in chronological order
- [ ] Can see communication type, date, subject, content
- [ ] Can create new communication entry
- [ ] Can edit communication entry
- [ ] Can delete communication entry
- [ ] Form validates all fields

---

### **DAY 9: Add Communication Entries from Client Page**

#### Tasks:
1. Add communication section to client detail page
2. Add "Add Communication" button
3. Integrate communication form dialog
4. Show communication timeline
5. Add filters for communication type
6. Add search within communications

#### Files to Update:
- `src/app/(dashboard)/clients/[id]/page.tsx`
- `src/components/clients/communication-list.tsx` (update - add filters)

#### Acceptance Criteria:
- [ ] Can add communication from client page
- [ ] Communications display on client page
- [ ] Can filter by communication type
- [ ] Can search communications
- [ ] Timeline view works correctly
- [ ] Optimistic updates work

---

### **DAY 10: Client Statistics and Project Count**

#### Tasks:
1. Add project count to client cards
2. Add statistics card to client detail page
3. Show active projects count
4. Show completed projects count
5. Show total projects count
6. Add project status breakdown chart (optional)

#### Files to Update:
- `src/components/clients/client-card.tsx`
- `src/components/clients/client-info-card.tsx`
- `src/app/(dashboard)/clients/[id]/page.tsx`

#### Acceptance Criteria:
- [ ] Project count displays on client cards
- [ ] Statistics display on client detail page
- [ ] Counts are accurate
- [ ] Updates when projects change
- [ ] Loading states work

---

### **DAY 11: Mobile Responsiveness for Client Pages**

#### Tasks:
1. Make clients list page mobile-responsive
2. Make client detail page mobile-responsive
3. Optimize client cards for mobile
4. Make communication list mobile-friendly
5. Ensure touch-friendly interactions
6. Test on mobile devices

#### Files to Update:
- `src/app/(dashboard)/clients/page.tsx`
- `src/app/(dashboard)/clients/[id]/page.tsx`
- `src/components/clients/client-card.tsx`
- `src/components/clients/communication-list.tsx`

#### Acceptance Criteria:
- [ ] Clients list works on mobile
- [ ] Client detail page works on mobile
- [ ] Forms are mobile-friendly
- [ ] Touch interactions work
- [ ] No horizontal scrolling
- [ ] Text is readable

---

### **DAY 12: Client Import/Export (Optional Enhancement)**

#### Tasks:
1. Add export clients to CSV functionality
2. Add import clients from CSV functionality
3. Add validation for imported data
4. Show import results/errors

#### Files to Create:
- `src/app/api/clients/export/route.ts` (new)
- `src/app/api/clients/import/route.ts` (new)
- `src/components/clients/client-import-dialog.tsx` (new)

#### Acceptance Criteria:
- [ ] Can export clients to CSV
- [ ] Can import clients from CSV
- [ ] Validation works for imports
- [ ] Errors are displayed clearly
- [ ] Import preview before confirming

---

### **DAY 13: Polish and Error Handling**

#### Tasks:
1. Review all error messages
2. Add helpful empty states
3. Improve loading states
4. Add success toasts
5. Review accessibility
6. Fix any UI inconsistencies
7. Add keyboard shortcuts (optional)

#### Files to Review:
- All client-related components
- All client API routes
- All client hooks

#### Acceptance Criteria:
- [ ] All error messages are helpful
- [ ] Empty states are informative
- [ ] Loading states are clear
- [ ] Success feedback is visible
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

---

### **DAY 14: Testing and Documentation**

#### Tasks:
1. Test all client CRUD operations
2. Test client-project linking
3. Test communication history
4. Test filters and search
5. Test mobile responsiveness
6. Update documentation
7. Create client management guide

#### Files to Create/Update:
- `documentation/guides/client-management.md` (new)
- `documentation/development/roadmap.md` (update)

#### Acceptance Criteria:
- [ ] All features work correctly
- [ ] No console errors
- [ ] TypeScript compiles
- [ ] ESLint passes
- [ ] Documentation is complete
- [ ] Ready for Week 7-8

---

## 📋 Week 5-6 Completion Checklist

### Functionality:
- [ ] Can view all clients (grid/list views)
- [ ] Can create new client
- [ ] Can edit client
- [ ] Can delete client (with confirmation)
- [ ] Can filter clients (status, search)
- [ ] Can sort clients (name, date, project count)
- [ ] Can view client details
- [ ] Can see all projects for a client
- [ ] Can link client to project
- [ ] Can add communication entries
- [ ] Can view communication history
- [ ] Can edit/delete communications
- [ ] Client statistics display correctly

### Quality:
- [ ] All forms validate properly
- [ ] Loading states everywhere
- [ ] Error states handled gracefully
- [ ] Empty states are helpful
- [ ] Responsive on mobile
- [ ] Dark mode works perfectly
- [ ] Animations are smooth
- [ ] No console errors
- [ ] TypeScript compiles
- [ ] ESLint passes

### Performance:
- [ ] Page loads quickly
- [ ] Optimistic updates feel instant
- [ ] No unnecessary re-renders
- [ ] Proper React Query caching

---

## 🎯 Key Features to Build

1. **Client CRUD** - Full create, read, update, delete operations
2. **Client-Project Linking** - Associate projects with clients
3. **Communication History** - Track all client interactions
4. **Client Statistics** - View project counts and status breakdowns
5. **Search & Filters** - Find clients quickly
6. **Mobile Responsive** - Works on all devices

---

## 📝 Notes

- Follow the same patterns established in Week 3-4 (Projects)
- Use existing components from shadcn/ui
- Maintain consistency with project management UI
- Keep optimistic updates for instant feedback
- Ensure proper error handling throughout
- Document any decisions or trade-offs

---

## 🚀 Week 5-6 Kickoff

**Ready to start Day 1!**

Begin with: "Let's start Week 5-6 Day 1: Complete Client CRUD API routes"

