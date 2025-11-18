# Architectural Decisions

This log tracks significant architectural decisions made during development.

---

## 2025-11-08: NextAuth.js Version Choice

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

## 2025-11-08: Client-Side Auth Checks for Protected Routes

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
- Created `DashboardAuthCheck` component wrapper
- Dashboard layout no longer needs async session fetching
- Better user experience with loading indicators

**Alternatives Considered:**
- Server-side session check with `getServerSession` (rejected - complexity)
- Middleware-based protection (considered for future)

**Status:** ✅ Implemented

---

