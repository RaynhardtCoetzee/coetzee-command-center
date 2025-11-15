# Database Schema

> **Note:** This project uses PostgreSQL as the database. Connection pooling is configured for optimal performance in serverless environments. Use the pooled connection string (`DATABASE_URL`) for application queries and the direct connection string (`DIRECT_URL`) for migrations.

```prisma
// Complete schema
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  projects  Project[]
  clients   Client[]
}

model Client {
  id        String   @id @default(cuid())
  name      String
  email     String?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  projects  Project[]
}

model Project {
  id          String    @id @default(cuid())
  userId      String
  clientId    String?
  title       String
  description String?   @db.Text
  roadmap     String?   @db.Text      // Project roadmap/planning content
  buildPlan   String?   @db.Text      // Build plan/implementation details
  screenshots String?   @db.Text      // JSON array of image URLs
  status      String    @default("planning")
  priority    String    @default("medium")
  progress    Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  client      Client?   @relation(fields: [clientId], references: [id], onDelete: SetNull)
  tasks       Task[]
  
  @@index([userId])
  @@index([clientId])
}

model Task {
  id          String    @id @default(cuid())
  userId      String
  projectId   String
  title       String
  status      String    @default("todo")
  priority    String    @default("medium")
  order       Int       @default(0)       // For drag-and-drop ordering
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([projectId])
}
```

## Common Queries

### Get projects with client and task count
```typescript
const projects = await prisma.project.findMany({
  where: { userId: session.user.id },
  include: {
    client: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    _count: {
      select: {
        tasks: true,
      },
    },
  },
  orderBy: {
    updatedAt: 'desc',
  },
});
```

### Get single project with tasks
```typescript
const project = await prisma.project.findFirst({
  where: {
    id,
    userId: session.user.id,
  },
  include: {
    client: true,
    tasks: {
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    },
  },
});
```

### Get tasks for a project
```typescript
const tasks = await prisma.task.findMany({
  where: {
    projectId,
    userId: session.user.id,
  },
  include: {
    project: {
      select: {
        id: true,
        title: true,
        status: true,
      },
    },
  },
  orderBy: [
    { order: 'asc' },
    { createdAt: 'asc' },
  ],
});
```

## Field Notes

### Project Fields
- `roadmap` - Text field for project roadmap/planning (supports markdown)
- `buildPlan` - Text field for build plan/implementation details (supports markdown)
- `screenshots` - JSON string containing array of image URLs: `["url1", "url2"]`
- `status` - Enum: `planning`, `active`, `review`, `completed`, `archived`
- `priority` - Enum: `low`, `medium`, `high`
- `progress` - Integer 0-100 representing completion percentage

### Task Fields
- `order` - Integer for drag-and-drop ordering (higher = later in list)
- `status` - Enum: `todo`, `in_progress`, `review`, `done`
- `priority` - Enum: `low`, `medium`, `high`

## Data Relationships

- **User → Projects** - One-to-many, cascade delete
- **User → Clients** - One-to-many, cascade delete
- **User → Tasks** - One-to-many, cascade delete
- **Client → Projects** - One-to-many, set null on delete
- **Project → Tasks** - One-to-many, cascade delete

## Indexes

- `Project.userId` - Indexed for fast user-scoped queries
- `Project.clientId` - Indexed for fast client-scoped queries
- `Task.userId` - Indexed for fast user-scoped queries
- `Task.projectId` - Indexed for fast project-scoped queries
