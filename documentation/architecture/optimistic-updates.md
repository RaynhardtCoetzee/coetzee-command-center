# Optimistic Updates Pattern

This project uses **optimistic updates** in all mutation hooks to provide instant UI feedback while maintaining data consistency.

## Overview

Optimistic updates allow the UI to update immediately when a user performs an action (create, update, delete), before the server responds. If the server request fails, the UI automatically rolls back to the previous state.

## Implementation Pattern

All mutation hooks follow this pattern:

```typescript
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectData) => projectsApi.create(data),
    
    // 1. onMutate: Optimistically update cache before mutation
    onMutate: async (newProject) => {
      // Cancel outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ['projects'] });

      // Snapshot previous value for rollback
      const previousProjects = queryClient.getQueryData(['projects']);

      // Optimistically update cache
      queryClient.setQueryData(['projects'], (old: any[]) => {
        const optimisticProject = {
          id: `temp-${Date.now()}`, // Temporary ID
          ...newProject,
          createdAt: new Date(),
          updatedAt: new Date(),
          // ... other required fields
        };
        return old ? [optimisticProject, ...old] : [optimisticProject];
      });

      // Return context for rollback
      return { previousProjects };
    },
    
    // 2. onError: Rollback on failure
    onError: (error: Error, _newProject, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects);
      }
      toast({
        title: 'Failed to create project',
        description: error.message,
        variant: 'destructive',
      });
    },
    
    // 3. onSuccess: Invalidate and refresh
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Project created',
        description: 'Your project has been created successfully.',
      });
    },
  });
}
```

## Hooks with Optimistic Updates

### Projects
- ✅ `useCreateProject()` - Optimistically adds project
- ✅ `useUpdateProject()` - Optimistically updates project
- ✅ `useDeleteProject()` - Optimistically removes project

### Tasks
- ✅ `useCreateTask()` - Optimistically adds task
- ✅ `useUpdateTask()` - Optimistically updates task
- ✅ `useDeleteTask()` - Optimistically removes task

## Benefits

1. **Instant Feedback** - UI updates immediately, no waiting for server
2. **Better UX** - Users see changes right away
3. **Error Recovery** - Automatic rollback if mutation fails
4. **Data Consistency** - Cache always reflects server state after success

## Key Concepts

### Context Snapshot
The `onMutate` callback returns a context object containing previous state. This is used by `onError` to rollback changes.

### Query Cancellation
`queryClient.cancelQueries()` prevents race conditions by canceling any in-flight queries that might overwrite optimistic updates.

### Cache Invalidation
`queryClient.invalidateQueries()` on success ensures the cache is refreshed with server data, replacing optimistic values.

## Error Handling

All mutations include:
- **Rollback** - Restores previous state on error
- **User Feedback** - Toast notification with error message
- **Type Safety** - Proper TypeScript error typing

## Testing Optimistic Updates

1. **Create** - Item appears immediately, disappears if error
2. **Update** - Changes appear immediately, revert if error
3. **Delete** - Item disappears immediately, reappears if error
4. **Network Off** - All operations rollback correctly
5. **Server Error** - Proper error messages displayed

## Best Practices

1. Always cancel queries before optimistic updates
2. Always snapshot previous state for rollback
3. Always invalidate queries on success
4. Always show user feedback (success/error)
5. Use temporary IDs for created items
6. Include all required fields in optimistic data

