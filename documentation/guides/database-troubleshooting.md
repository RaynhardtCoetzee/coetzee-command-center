# Database Troubleshooting Guide

## Common Issues and Solutions

### Issue: "Unknown argument `fieldName`" Error

**Error Message:**
```
Unknown argument `techStack`. Available options are marked with ?.
```

**Cause:**
This error occurs when:
1. You've added a new field to your Prisma schema (`schema.prisma`)
2. The database has been updated (or needs to be updated)
3. But the Prisma Client hasn't been regenerated

**Solution:**

1. **Sync Database Schema** (if not already done):
   ```bash
   # For development (faster, no migration history)
   npx prisma db push
   
   # OR for production (creates migration)
   npx prisma migrate dev --name add_field_name
   ```

2. **Regenerate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Restart Your Dev Server**:
   ```bash
   # Stop current server (Ctrl+C)
   pnpm dev
   ```

**Quick Fix Command:**
```bash
npx prisma db push && npx prisma generate
```

---

### Issue: Database Connection Failed

**Error Message:**
```
Error: P1001: Can't reach database server at `host:port`
```

**Solutions:**

1. **Check Database Server Status:**
   - Verify your database server is running
   - Check if the database URL is correct in `.env.local`

2. **Verify Environment Variables:**
   ```bash
   # Check if .env.local exists and has correct values
   cat .env.local
   ```

3. **Test Database Connection:**
   ```bash
   npx prisma db pull
   ```

4. **Check Network/Firewall:**
   - Ensure firewall allows database connections
   - Verify network connectivity to database server

---

### Issue: Migration Conflicts

**Error Message:**
```
Error: P3006: Migration failed to apply cleanly to the shadow database
```

**Solutions:**

1. **Use `db push` for Development:**
   ```bash
   npx prisma db push
   ```
   This bypasses migration history and directly syncs schema.

2. **Reset Migration State (Development Only):**
   ```bash
   # WARNING: This deletes all data
   npx prisma migrate reset
   npx prisma migrate dev --name initial_schema
   ```

3. **Mark Migrations as Applied:**
   ```bash
   npx prisma migrate resolve --applied migration_name
   ```

---

### Issue: Column Already Exists

**Error Message:**
```
Error: P2022: The column `Project.techStack` does not exist in the current database.
```

**Solutions:**

1. **Check if Column Actually Exists:**
   ```bash
   npx prisma studio
   ```
   Open the Project model and verify columns.

2. **Manually Add Column (if needed):**
   ```sql
   ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "techStack" TEXT;
   ```

3. **Sync Schema:**
   ```bash
   npx prisma db push
   ```

---

### Issue: Prisma Client Out of Sync

**Symptoms:**
- TypeScript errors about missing fields
- Runtime errors about unknown arguments
- Fields exist in schema but not in generated client

**Solution:**

1. **Regenerate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Restart TypeScript Server:**
   - In VS Code/Cursor: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

3. **Clear Next.js Cache:**
   ```bash
   rm -rf .next
   pnpm dev
   ```

---

## Standard Workflow for Schema Changes

When adding or modifying fields in your Prisma schema:

1. **Update `schema.prisma`**:
   ```prisma
   model Project {
     techStack   String?   @db.Text
     startDate   DateTime?
     dueDate     DateTime?
     budget      Float?
   }
   ```

2. **Sync Database**:
   ```bash
   npx prisma db push
   ```

3. **Regenerate Client**:
   ```bash
   npx prisma generate
   ```

4. **Restart Dev Server**:
   ```bash
   pnpm dev
   ```

---

## Verification Steps

After fixing database issues, verify:

1. **Database Schema is Correct:**
   ```bash
   npx prisma studio
   ```
   - Open the model (e.g., Project)
   - Verify all columns exist
   - Check data types match schema

2. **Prisma Client is Updated:**
   ```bash
   # Check generated client
   cat node_modules/.prisma/client/index.d.ts
   ```
   - Search for your field name
   - Verify it's included

3. **TypeScript Types are Correct:**
   - Check for TypeScript errors in your editor
   - Verify autocomplete shows new fields

4. **API Routes Work:**
   - Test creating/updating records with new fields
   - Check browser console for errors
   - Verify database actually stores the data

---

## Development vs Production

### Development
- Use `prisma db push` for quick schema changes
- No migration history needed
- Faster iteration

### Production
- Use `prisma migrate dev` to create migrations
- Track migration history
- Apply migrations with `prisma migrate deploy`

---

## Common Commands Reference

```bash
# Sync schema to database (development)
npx prisma db push

# Create and apply migration (production)
npx prisma migrate dev --name migration_name

# Regenerate Prisma Client
npx prisma generate

# Open database GUI
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Check database connection
npx prisma db pull

# View migration status
npx prisma migrate status
```

---

## Getting Help

If you're still experiencing issues:

1. **Check Prisma Logs:**
   - Look at terminal output for detailed error messages
   - Check Prisma documentation: https://www.prisma.io/docs

2. **Verify Environment:**
   - Check `.env.local` has correct `DATABASE_URL`
   - Verify database server is accessible

3. **Check Prisma Version:**
   ```bash
   npx prisma --version
   ```

4. **Review Schema:**
   - Ensure schema syntax is correct
   - Check for typos in field names
   - Verify data types match database

---

## Prevention Tips

1. **Always regenerate Prisma Client after schema changes:**
   ```bash
   npx prisma db push && npx prisma generate
   ```

2. **Restart dev server after Prisma changes:**
   - Prisma Client is generated at build time
   - Next.js caches the client

3. **Use TypeScript to catch errors early:**
   - TypeScript will show errors if Prisma Client is out of sync
   - Fix these before running the app

4. **Test database changes locally first:**
   - Don't push schema changes directly to production
   - Test in development environment first


