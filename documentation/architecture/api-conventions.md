# API Conventions

## Structure

All API routes follow this standard pattern:

```typescript
import { NextRequest } from 'next/server';
import { requireAuth, errorResponse, successResponse, validateBody, validateQuery } from '@/lib/api-helpers';
import { createProjectSchema, projectQuerySchema } from '@/lib/validations/project';

export async function GET(request: NextRequest) {
  try {
    // 1. Auth check
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const { session } = authResult;

    // 2. Validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryResult = validateQuery(searchParams, projectQuerySchema);
    if (queryResult.error) return queryResult.error;
    const filters = queryResult.data;

    // 3. Query database
    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
        ...filters,
      },
    });

    // 4. Return response
    return successResponse(projects);
  } catch (error) {
    console.error('Error:', error);
    return errorResponse('Failed to fetch projects', 500);
  }
}
```

## API Helper Functions

Located in `src/lib/api-helpers.ts`:

### `requireAuth()`
Checks if user is authenticated, returns 401 if not.
```typescript
const authResult = await requireAuth();
if (authResult.error) return authResult.error;
const { session } = authResult;
```

### `errorResponse(message, status, issues)`
Creates standardized error response.
```typescript
return errorResponse('Validation failed', 400, ['field: message']);
```

### `successResponse(data, status)`
Creates standardized success response.
```typescript
return successResponse(projects, 200);
```

### `validateBody(body, schema)`
Validates request body with Zod schema.
```typescript
const result = validateBody(body, createProjectSchema);
if (result.error) return result.error;
const data = result.data;
```

### `validateQuery(params, schema)`
Validates query parameters with Zod schema.
```typescript
const result = validateQuery(searchParams, projectQuerySchema);
if (result.error) return result.error;
const filters = result.data;
```

## API Client

Located in `src/lib/api-client.ts`:

Centralized functions for calling API routes from the frontend.

### Projects API
```typescript
import { projectsApi } from '@/lib/api-client';

// Fetch all projects
const projects = await projectsApi.getAll({ status: 'active' });

// Fetch single project
const project = await projectsApi.getById(id);

// Create project
const newProject = await projectsApi.create({ title: 'New Project' });

// Update project
const updated = await projectsApi.update(id, { title: 'Updated' });

// Delete project
await projectsApi.delete(id);
```

### Tasks API
```typescript
import { tasksApi } from '@/lib/api-client';

// Fetch tasks
const tasks = await tasksApi.getAll({ projectId: 'xxx' });

// Create task
const task = await tasksApi.create({ title: 'Task', projectId: 'xxx' });

// Update task
await tasksApi.update(id, { status: 'done' });

// Delete task
await tasksApi.delete(id);
```

## Status Codes
- `200` - Success
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (not authenticated)
- `404` - Not Found (resource doesn't exist)
- `500` - Server Error (internal error)

## Response Format

### Success Response
```json
{
  "id": "...",
  "title": "...",
  ...
}
```

### Error Response
```json
{
  "error": "Error message",
  "issues": [
    "field: validation message",
    "anotherField: another message"
  ]
}
```

## Authentication

All API routes require authentication:
- Use `requireAuth()` helper for auth checks
- Returns `401 Unauthorized` if not authenticated
- Session includes `user.id` for user-scoped queries

## Validation

All input validation uses Zod:
- Request body: `validateBody(body, schema)`
- Query params: `validateQuery(params, schema)`
- Returns `400 Bad Request` with validation errors if invalid

## Ownership Checks

All operations verify user ownership:
- Projects/Tasks must belong to the authenticated user
- Clients must belong to the authenticated user
- Cross-entity links (project→client) validate ownership

## Error Handling

Always wrap database operations in try/catch:
```typescript
try {
  // ... operation
} catch (error) {
  console.error('Error:', error);
  return errorResponse('Failed to...', 500);
}
```

