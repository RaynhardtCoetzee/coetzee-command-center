# Common Tasks

## Database
```bash
npx prisma migrate dev    # Create migration
npx prisma db push        # Sync schema (development)
npx prisma generate       # Generate client
npx prisma studio         # Open GUI
npx prisma db pull        # Check connection
```

### Common Database Issues
- **"Unknown argument" error?** → Run `npx prisma generate`
- **Schema out of sync?** → Run `npx prisma db push`
- **Connection failed?** → Check `.env.local` and database server
- See [Database Troubleshooting Guide](../guides/database-troubleshooting.md) for detailed solutions

## Development
```bash
pnpm dev                  # Start dev
pnpm build                # Build
pnpm lint                 # Lint code
```

## Components
```bash
npx shadcn@latest add button  # Add component
```

## Documentation Update Checklist

Use this prompt:

"Documentation update check:

- [ ] Roadmap tasks marked complete?
- [ ] Progress percentages updated?
- [ ] Current sprint section updated?
- [ ] Decision log entries added?
- [ ] New patterns documented?
- [ ] Architecture changes noted?
- [ ] Completion dates added?

Current week: [N]
What changed: [brief summary]"

