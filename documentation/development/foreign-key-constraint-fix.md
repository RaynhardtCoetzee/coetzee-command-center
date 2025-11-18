# Foreign Key Constraint Fix - 2025-11-09

## Issue

**Error:** `Foreign key constraint violated on the constraint: Project_userId_fkey (Code: P2003)`

**Cause:** The `userId` from the session doesn't exist in the `User` table in the database.

## Root Cause

This can happen when:
1. The user was deleted from the database but the session still has their ID
2. The session has an invalid/corrupted user ID
3. The user ID in the session doesn't match any user in the database
4. Database was reset but session wasn't cleared

## Solution Applied

### 1. Added User Verification in API Route

**File:** `src/app/api/projects/route.ts`

Added verification to check if the user exists in the database before creating the project:

```typescript
// 1. Auth check
const authResult = await requireAuth();
if (authResult.error) return authResult.error;
const { session } = authResult;

// 1.5. Verify user exists in database
const userId = session.user.id;
console.log('Session user ID:', userId);

const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, email: true },
});

if (!user) {
  console.error('User not found in database:', userId);
  return errorResponse('User not found. Please log in again.', 401);
}

console.log('User verified:', user.email);
```

### 2. Use Verified User ID

Changed all references from `session.user.id` to `user.id` (the verified user from database):

```typescript
// Before
userId: session.user.id,

// After
userId: user.id, // Use verified user ID from database
```

### 3. Updated Client Validation

Updated client validation to use the verified user ID:

```typescript
// Before
userId: session.user.id,

// After
userId: user.id, // Use verified user ID
```

## How to Fix

### If you're getting this error:

1. **Log out and log back in:**
   - This will refresh your session with a valid user ID
   - Go to `/login` and sign in again

2. **Check if your user exists in the database:**
   ```bash
   npx prisma studio
   ```
   - Open the `User` table
   - Verify your user exists

3. **If user doesn't exist, create one:**
   ```bash
   pnpm db:seed
   ```
   - This creates a demo user: `demo@coetzee.dev` / `demo123`

4. **Clear your session:**
   - Clear browser cookies/localStorage
   - Or use incognito/private browsing

## Prevention

The fix adds verification that:
- ✅ User exists in database before creating projects
- ✅ Uses verified user ID from database (not just session)
- ✅ Provides clear error message if user not found
- ✅ Logs user ID for debugging

## Status

✅ **FIXED** - User verification added to prevent foreign key constraint violations

## Related Files

- `src/app/api/projects/route.ts` - Added user verification
- `src/lib/api-helpers.ts` - Could add verification here too (future improvement)

## Future Improvements

1. Add user verification to `requireAuth()` helper function
2. Add user verification to all API routes that use `userId`
3. Add session refresh mechanism if user not found
4. Add better error messages for foreign key violations


