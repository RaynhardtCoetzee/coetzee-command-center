# Database Schema

> **Note:** This project uses Supabase (PostgreSQL) as the database. Connection pooling is configured for optimal performance in serverless environments. Use the pooled connection string (`DATABASE_URL`) for application queries and the direct connection string (`DIRECT_URL`) for migrations.

```prisma
// Complete schema will be here
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
  id          String   @id @default(cuid())
  title       String
  userId      String
  clientId    String?
  status      String   @default("planning")
  user        User     @relation(fields: [userId], references: [id])
  client      Client?  @relation(fields: [clientId], references: [id])
  tasks       Task[]
}

model Task {
  id          String   @id @default(cuid())
  title       String
  projectId   String
  status      String   @default("todo")
  project     Project  @relation(fields: [projectId], references: [id])
}
```

## Common Queries

### Get projects with client
```typescript
const projects = await prisma.project.findMany({
  where: { userId: session.user.id },
  include: { client: true },
});
```

