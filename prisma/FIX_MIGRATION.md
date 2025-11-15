# Fix Migration Issues

## Problem
Prisma Migrate is failing because:
1. Shadow database doesn't have the Project table
2. There are duplicate migrations for the same columns
3. Database connection issues

## Solutions

### Solution 1: Use `prisma db push` (Recommended for Development)
This is the simplest solution for development. It bypasses migrations and syncs your schema directly:

```bash
# When database is available, run:
npx prisma db push

# Then regenerate Prisma Client:
npx prisma generate
```

### Solution 2: Manually Apply SQL
If you prefer to use migrations, you can manually apply the SQL:

1. **Check what columns already exist** in your database
2. **Run the SQL in `prisma/migrations/add_new_fields.sql`** to add missing columns
3. **Mark migrations as applied**:
```bash
npx prisma migrate resolve --applied 20241115000000_add_roadmap_buildplan_screenshots
npx prisma migrate resolve --applied 20241115200000_add_roadmap_buildplan_screenshots
npx prisma migrate resolve --applied 20251115015217_add_roadmap_buildplan_screenshots
```

4. **Create a new migration** for any remaining changes:
```bash
npx prisma migrate dev --name add_project_fields
```

### Solution 3: Clean Up and Start Fresh (Development Only)
⚠️ **WARNING: This will delete all data**

1. **Delete migration history**:
```bash
# Remove old migrations (keep init migration)
rm -rf prisma/migrations/20241115000000_add_roadmap_buildplan_screenshots
rm -rf prisma/migrations/20241115200000_add_roadmap_buildplan_screenshots
```

2. **Mark existing migrations as applied**:
```bash
npx prisma migrate resolve --applied 20251114225245_init
npx prisma migrate resolve --applied 20251115001225_add_nextauth_models
npx prisma migrate resolve --applied 20251115015217_add_roadmap_buildplan_screenshots
```

3. **Create new migration**:
```bash
npx prisma migrate dev --name add_project_fields
```

## Current Required Fields
The following fields need to be in the Project table:
- ✅ `roadmap` (TEXT) - Already in migrations
- ✅ `buildPlan` (TEXT) - Already in migrations
- ✅ `screenshots` (TEXT) - Already in migrations
- ❌ `techStack` (TEXT) - Needs to be added
- ❌ `startDate` (TIMESTAMP) - Needs to be added
- ❌ `dueDate` (TIMESTAMP) - Needs to be added
- ❌ `budget` (DOUBLE PRECISION) - Needs to be added

## Recommended Approach
**For Development:** Use `prisma db push` - it's simpler and doesn't require migration management.

**For Production:** Clean up migrations and create proper migration history.

## Database Connection
Make sure your database is accessible before running any commands:
- Check `DATABASE_URL` in `.env`
- Check `DIRECT_URL` in `.env`
- Verify database server is running


