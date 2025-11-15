# React Query Patterns

This guide documents the React Query (TanStack Query) patterns used throughout the application.

## Setup

Located in `src/app/providers.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});
```

## Query Hooks Pattern

All query hooks follow this pattern:

```typescript
export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectsApi.getAll(filters),
  });
}
```

### Query Keys

Use consistent query key structure:
- `['projects']` - All projects
- `['projects', id]` - Single project
- `['projects', filters]` - Filtered projects
- `['tasks', { projectId }]` - Tasks for project

## Mutation Hooks Pattern

All mutation hooks include optimistic updates:

### Create Mutation
```typescript
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => projectsApi.create(data),
    onMutate: async (newProject) => {
      // 1. Cancel queries
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      
      // 2. Snapshot previous value
      const previousProjects = queryClient.getQueryData(['projects']);
      
      // 3. Optimistically update
      queryClient.setQueryData(['projects'], (old) => {
        const optimistic = { id: `temp-${Date.now()}`, ...newProject };
        return old ? [optimistic, ...old] : [optimistic];
      });
      
      return { previousProjects };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects);
      }
    },
    onSuccess: () => {
      // Invalidate to refresh from server
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
```

### Update Mutation
```typescript
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => projectsApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      
      const previousProjects = queryClient.getQueryData(['projects']);
      const previousProject = queryClient.getQueryData(['projects', id]);
      
      // Optimistically update both list and single query
      queryClient.setQueryData(['projects'], (old) => {
        return old?.map(p => p.id === id ? { ...p, ...data } : p) || old;
      });
      queryClient.setQueryData(['projects', id], (old) => {
        return old ? { ...old, ...data } : old;
      });
      
      return { previousProjects, previousProject };
    },
    onError: (error, variables, context) => {
      // Rollback both queries
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects);
      }
      if (context?.previousProject) {
        queryClient.setQueryData(['projects', variables.id], context.previousProject);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
    },
  });
}
```

### Delete Mutation
```typescript
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => projectsApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      
      const previousProjects = queryClient.getQueryData(['projects']);
      
      // Optimistically remove
      queryClient.setQueryData(['projects'], (old) => {
        return old?.filter(p => p.id !== id) || old;
      });
      
      return { previousProjects };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
```

## Component Usage

### Loading States
```tsx
const { data, isLoading, error } = useProjects();

if (isLoading) {
  return <Skeleton />;
}

if (error) {
  return <Error message={error.message} />;
}

return <ProjectList projects={data} />;
```

### Mutation States
```tsx
const createProject = useCreateProject();

const handleSubmit = async (data) => {
  createProject.mutate(data, {
    onSuccess: () => {
      // Additional success handling
      form.reset();
    },
  });
};

<Button disabled={createProject.isPending}>
  {createProject.isPending ? 'Creating...' : 'Create'}
</Button>
```

## Best Practices

1. **Always cancel queries before optimistic updates** - Prevents race conditions
2. **Always snapshot previous state** - Enables rollback on error
3. **Always invalidate on success** - Ensures cache reflects server state
4. **Handle errors with rollback** - Maintain data consistency
5. **Use consistent query keys** - Makes cache management easier
6. **Provide user feedback** - Toast notifications for success/error

## Available Hooks

### Projects
- `useProjects(filters?)` - Fetch all projects
- `useProject(id)` - Fetch single project
- `useCreateProject()` - Create project (optimistic)
- `useUpdateProject()` - Update project (optimistic)
- `useDeleteProject()` - Delete project (optimistic)

### Tasks
- `useTasks(filters?)` - Fetch tasks
- `useCreateTask()` - Create task (optimistic)
- `useUpdateTask()` - Update task (optimistic)
- `useDeleteTask()` - Delete task (optimistic)

See `src/hooks/use-projects.ts` and `src/hooks/use-tasks.ts` for full implementations.

