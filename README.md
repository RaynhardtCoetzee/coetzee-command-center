# Coetzee Command Center

A unified business operations platform for managing projects, clients, components, and documentation.

## Features

- 📁 Project Management
- 👥 Client Tracking
- 🧩 Component Library with Playground
- 📚 Documentation System
- 🔍 Universal Search
- 🌙 Dark Mode

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- PostgreSQL + Prisma ORM
- NextAuth.js v4 (Credentials Provider)
- TanStack Query (React Query)
- next-themes (Dark mode)

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
DIRECT_URL="postgresql://user:password@localhost:5432/dbname"

# NextAuth
NEXTAUTH_SECRET="your-secret-here" # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

3. **Set up database:**

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Seed database (optional - creates demo user)
pnpm db:seed
```

4. **Start development server:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Default Credentials

After seeding, you can login with:
- **Email:** demo@coetzee.dev
- **Password:** demo123

## Project Structure

```
src/
├── app/              # Next.js App Router
├── components/       # React components
├── lib/              # Utilities
├── hooks/            # Custom hooks
└── types/            # TypeScript types
```

## Documentation

See `documentation/` directory for detailed guides:

### Architecture
- [Architecture Guide](documentation/architecture/architecture.md) - Technical architecture and tech stack
- [Database Schema](documentation/architecture/database-schema.md) - Database structure and queries
- [API Conventions](documentation/architecture/api-conventions.md) - API route standards

### Development
- [Roadmap](documentation/development/roadmap.md) - Development timeline and progress
- [Daily Log](documentation/development/daily-log.md) - Daily development log
- [Common Tasks](documentation/development/common-tasks.md) - Frequently used commands

### Decisions & Design
- [Architectural Decisions](documentation/decisions/decisions.md) - Decision log
- [Design System](documentation/design/design-system.md) - UI/UX standards
- [Component Patterns](documentation/design/component-patterns.md) - Code patterns

### Guides
- [Documentation System](documentation/guides/documentation-system.md) - How to maintain docs
- [Database Troubleshooting](documentation/guides/database-troubleshooting.md) - Fix common database issues

## Development

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm lint         # Run ESLint
npx prisma studio # Open database GUI
```

## License

MIT

# coetzee-command-center
