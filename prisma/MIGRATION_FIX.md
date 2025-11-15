# Migration Fix Instructions

## Problem
Prisma Migrate is failing because the shadow database doesn't have the Project table from earlier migrations.

## Solution Options

### Option 1: Use `prisma db push` (Recommended for Development)
This bypasses migrations and syncs your schema directly to the database:

```bash
npx prisma db push
```

This will:
- Sync your current schema to the database
- Add any missing columns (startDate, dueDate, budget, techStack)
- Skip migration history

**Note:** This is safe for development but not recommended for production.

### Option 2: Fix Migration State
If you want to keep using migrations:

1. **Mark migrations as applied** (if database already has the changes):
```bash
npx prisma migrate resolve --applied 20241115000000_add_roadmap_buildplan_screenshots
npx prisma migrate resolve --applied 20241115200000_add_roadmap_buildplan_screenshots
npx prisma migrate resolve --applied 20251115015217_add_roadmap_buildplan_screenshots
```

2. **Create a new migration for new fields**:
```bash
npx prisma migrate dev --name add_project_fields
```

### Option 3: Reset and Create Fresh Migration
⚠️ **WARNING: This will delete all data**

```bash
npx prisma migrate reset
npx prisma migrate dev --name initial_schema
```

## Current Schema Changes Needed
The following fields need to be added to the Project table:
- `startDate` (DateTime, optional)
- `dueDate` (DateTime, optional)
- `budget` (Float, optional)
- `techStack` (Text, optional - JSON array)

## Database Connection Issue
Before running any migration commands, ensure:
1. Your database server is running
2. Your `.env` file has correct `DATABASE_URL` and `DIRECT_URL`
3. Your database connection is accessible

## Recommended Approach
For development, use `prisma db push` as it's simpler and doesn't require migration history management.


