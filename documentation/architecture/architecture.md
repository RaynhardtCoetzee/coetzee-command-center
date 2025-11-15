# Architecture Guide

## Tech Stack
- Framework: Next.js 14+ (App Router)
- Language: TypeScript 5.3+
- Styling: Tailwind CSS + shadcn/ui
- Database: PostgreSQL + Prisma
- Auth: NextAuth.js v4.24.13 (stable) - using v4 due to v5 beta compatibility issues
- State: TanStack Query + Zustand

## Folder Structure
```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Auth routes
│   ├── (dashboard)/    # Protected routes
│   └── api/            # API routes
├── components/         # React components
│   ├── ui/            # shadcn/ui base
│   ├── projects/      # Feature-specific
│   └── shared/        # Reusable
├── lib/               # Utilities
├── hooks/             # Custom hooks
├── stores/            # Zustand stores
└── types/             # TypeScript types
```

## Data Flow

### Query Flow
```
Component → useQuery → API Route → Prisma → Database
              ↓
        Cached in React Query
              ↓
        Component re-renders
```

### Mutation Flow (with Optimistic Updates)
```
Component → useMutation → onMutate (optimistic update)
              ↓
        UI updates immediately
              ↓
        API Route → Prisma → Database
              ↓
        onSuccess (invalidate cache) OR onError (rollback)
```

## Component Patterns

### Server Components (Default)
```tsx
export default async function ProjectsPage() {
  const projects = await prisma.project.findMany();
  return <ProjectsList projects={projects} />;
}
```

### Client Components
```tsx
'use client';
import { useState } from 'react';

export function InteractiveComponent() {
  const [count, setCount] = useState(0);
  // ...
}
```

## API Routes

### Standard Structure
```typescript
// app/api/projects/route.ts
export async function GET(request: Request) {
  // 1. Auth check
  // 2. Parse params
  // 3. Database query
  // 4. Return JSON
}
```

## Authentication
```
User visits → Middleware checks → No session? → Redirect to login
                                → Has session? → Allow access
```

