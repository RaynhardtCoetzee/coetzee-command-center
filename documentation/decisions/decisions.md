# Architectural Decisions

This log tracks significant architectural decisions made during development.

---

## 2024-11-15: Notebook Preview - Post-MVP Enhancement

**Status:** Deferred to Post-MVP  
**Priority:** Medium  
**Component:** `src/components/projects/notebook-viewer.tsx`

### Context
The notebook preview for projects (roadmap and build plan) has been implemented with basic functionality:
- Three view modes: Preview, Split, and Edit
- Interactive checkboxes in preview mode
- Markdown rendering with `react-markdown` and `remark-gfm`

### Decision
The current notebook preview implementation is functional but needs significant improvements. These enhancements will be reviewed and implemented after MVP completion.

### Reasoning
- Current implementation provides basic functionality needed for MVP
- More advanced features would delay MVP launch
- Better to gather user feedback before investing in advanced notebook features
- Core project management features take priority

### Planned Enhancements (Post-MVP)
- [ ] Enhanced markdown editor with syntax highlighting
- [ ] Better checkbox interaction and state management
- [ ] Collaborative editing features
- [ ] Version history for roadmap/build plan changes
- [ ] Export functionality (PDF, Markdown, HTML)
- [ ] Better mobile experience for notebook editing
- [ ] Keyboard shortcuts for faster editing
- [ ] Auto-save functionality
- [ ] Better markdown preview rendering (tables, code blocks, etc.)
- [ ] Search within notebook content
- [ ] Link navigation between roadmap and build plan sections

### Impact
- **Positive:** Allows focus on core MVP features
- **Positive:** Can gather user feedback before major enhancements
- **Neutral:** Current functionality is sufficient for MVP needs
- **Future:** Will require dedicated sprint for notebook improvements

### Alternatives Considered
1. **Implement now:** Rejected - would delay MVP
2. **Remove feature:** Rejected - basic functionality is needed for MVP
3. **Defer to post-MVP:** ✅ Selected - best balance of functionality and timeline

### Related
- Component: `src/components/projects/notebook-viewer.tsx`
- Component: `src/components/ui/markdown-preview.tsx`
- Feature: Project roadmap and build plan management

---

## 2024-11-15: Mobile-First Responsive Design Pattern

**Decision:** Implement mobile-first responsive design with hidden desktop sidebar and mobile drawer menu

**Context:**
- Sidebar was causing mobile layout issues by taking up space on small screens
- Need to provide mobile navigation without compromising desktop experience
- Users need access to navigation on all device sizes

**Reasoning:**
1. **Mobile-First Approach:** Start with mobile design and enhance for larger screens
2. **Space Efficiency:** Sidebar hidden on mobile allows full-width content
3. **UX Consistency:** Drawer pattern is familiar to mobile users
4. **Progressive Enhancement:** Desktop gets persistent sidebar, mobile gets on-demand drawer
5. **Accessibility:** Both navigation patterns are keyboard accessible

**Implementation:**
- Sidebar uses `hidden md:flex` - only visible on medium screens and up
- Mobile sidebar uses shadcn Sheet component as left-side drawer
- Menu button in header triggers mobile drawer
- Drawer automatically closes on navigation
- Custom close button in drawer header for better UX

**Impact:**
- ✅ Mobile layout no longer constrained by sidebar
- ✅ Full-width content on mobile devices
- ✅ Consistent navigation experience across devices
- ✅ No layout shift issues on mobile
- ✅ Desktop experience unchanged (persistent sidebar)

**Alternatives Considered:**
- **Collapsible sidebar:** Rejected - still takes space when collapsed
- **Bottom navigation:** Rejected - doesn't match desktop experience
- **Top dropdown menu:** Rejected - drawer provides better mobile UX
- **Responsive sidebar width:** Rejected - still takes space on mobile

**Status:** ✅ Implemented and working

---

## 2024-11-15: Store screenshots as JSON string in database

**Context:**
When adding screenshot support to projects, we needed to decide how to store multiple image URLs in the database.

**Reasoning:**
PostgreSQL doesn't natively support arrays in a way that's easily queryable for our use case. Storing as a JSON string allows flexibility (can parse on the client/API layer) while keeping the schema simple. For our use case, we don't need to query individual screenshots, so a JSON array string is sufficient.

**Impact:**
- **Positive:** Simple schema, easy to serialize/deserialize, works well with Prisma's Text type
- **Negative:** Can't query individual screenshots at database level, requires parsing JSON

**Alternatives Considered:**
1. **Separate Screenshot table:** More normalized, but adds complexity with foreign keys and additional queries. Rejected for simplicity at this stage.
2. **PostgreSQL array type:** Could use Prisma's native array support, but JSON string is more portable and easier to work with in our API layer.

**Implementation:**
Screenshots stored as JSON string: `["url1", "url2"]`. Parsed in API routes and returned as array to frontend.

**Status:** ✅ Implemented

---

## 2024-11-15 - Decision: Use optimistic updates for all mutations

**Context:**
When implementing the React Query hooks for projects and tasks, we had to decide whether to use optimistic updates (update UI immediately before server responds) or wait for server confirmation before updating the UI.

**Reasoning:**
Optimistic updates provide a significantly better user experience by making the UI feel instant and responsive. Users see their changes immediately, which is especially important for common actions like creating, updating, or deleting items. The pattern also handles errors gracefully by automatically rolling back changes if the server request fails.

**Impact:**
- **Positive:** Immediate UI feedback, better perceived performance, professional user experience. Errors are handled gracefully with automatic rollback.
- **Negative:** Slightly more complex code with `onMutate`, `onError`, and `onSuccess` callbacks. Requires careful context management for rollback functionality.

**Alternatives Considered:**
1. **Wait for server response:** Simpler code, but feels slow and unresponsive. Rejected because it provides poor user experience.
2. **Manual state management:** Could manage optimistic state manually, but React Query's built-in support is more robust and less error-prone.

**Implementation:**
All mutation hooks (`useCreateProject`, `useUpdateProject`, `useDeleteProject`, `useCreateTask`, `useUpdateTask`, `useDeleteTask`) implement optimistic updates with proper rollback on error.

**Status:** ✅ Implemented

---

## 2024-11-15: Client-Side Auth Checks for Protected Routes

**Decision:** Use client-side authentication checks instead of server-side for dashboard layout

**Context:**
- NextAuth v4/v5 session retrieval in App Router server components can be complex
- Need seamless user experience with loading states

**Reasoning:**
1. **Simplicity:** Client-side checks with `useSession` are straightforward
2. **UX:** Can show loading states during auth check
3. **Compatibility:** Works reliably across all Next.js versions
4. **Flexibility:** Easier to add features like "Remember me" later

**Impact:**
- Created `DashboardAuthCheck` component for client-side session management
- Shows loading state while checking authentication
- Redirects to login if not authenticated
- Simple and maintainable implementation

**Alternatives Considered:**
- Server-side session checks (rejected - more complex, harder to show loading states)
- Middleware-based auth (rejected - need per-page control)

**Status:** ✅ Implemented and working

---

## 2024-11-15: NextAuth.js Version Choice

**Decision:** Use NextAuth.js v4.24.13 (stable) instead of v5 beta

**Context:**
- Initially planned to use NextAuth.js v5.0.0-beta.30
- Encountered compatibility issues with Next.js 14.1.0
- Error: `TypeError: next_dist_server_web_exports_next_request__WEBPACK_IMPORTED_MODULE_0__ is not a constructor`

**Reasoning:**
1. **Stability:** v4 is production-ready and battle-tested
2. **Compatibility:** v5 beta.30 has known issues with Next.js 14.1.0 App Router
3. **Feature Parity:** v4 has all required features for this project (Credentials Provider, JWT sessions, Prisma adapter)
4. **Migration Path:** Can upgrade to v5 stable when released without major refactoring

**Impact:**
- Updated `src/lib/auth.ts` to use `NextAuthOptions` instead of `NextAuthConfig`
- Route handler uses standard NextAuth v4 pattern
- All features remain fully functional
- No loss of functionality for current requirements

**Alternatives Considered:**
- Downgrade Next.js to 14.0.x (rejected - want latest features)
- Use different auth library (rejected - NextAuth is industry standard)
- Wait for v5 fix (rejected - need stable foundation now)

**Status:** ✅ Implemented and working

---
