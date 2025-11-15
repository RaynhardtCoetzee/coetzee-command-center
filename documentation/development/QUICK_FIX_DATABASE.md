# Quick Fix: Database Issues

## "Unknown argument" Error

If you see this error:
```
Unknown argument `techStack`. Available options are marked with ?.
```

### Quick Fix (3 steps):

```bash
# 1. Sync database schema
npx prisma db push

# 2. Regenerate Prisma Client
npx prisma generate

# 3. Restart dev server
pnpm dev
```

### One-Line Fix:

```bash
npx prisma db push && npx prisma generate
```

Then restart your dev server.

---

## Why This Happens

1. You added a field to `schema.prisma`
2. Database was updated (or needs updating)
3. Prisma Client wasn't regenerated
4. Code tries to use the field, but Prisma doesn't know about it

---

## Prevention

After modifying `schema.prisma`, always run:

```bash
npx prisma db push && npx prisma generate
```

---

## More Help

See [Database Troubleshooting Guide](../guides/database-troubleshooting.md) for:
- Other common issues
- Detailed solutions
- Verification steps
- Production migration guide


