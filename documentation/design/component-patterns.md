# Component Patterns

## File Structure
```tsx
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/types/project';

// 2. Types
interface Props {
  project: Project;
}

// 3. Component
export function ProjectCard({ project }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  
  return <div>{/* ... */}</div>;
}
```

## Common Patterns

### Loading States
```tsx
if (isLoading) return <Skeleton />;
if (error) return <Error />;
if (!data) return <Empty />;
return <Content data={data} />;
```

### Custom Hooks with React Query
```tsx
// Query hook
export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectsApi.getAll(filters),
  });
}

// Mutation hook with optimistic updates
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectData) => projectsApi.create(data),
    onMutate: async (newProject) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const previousProjects = queryClient.getQueryData(['projects']);
      // Update cache...
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

## Responsive Patterns

### Mobile-First Components

**Sidebar Component:**
```tsx
// Desktop sidebar - hidden on mobile
export function Sidebar() {
  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-card">
      {/* Sidebar content */}
    </aside>
  );
}
```

**Mobile Sidebar Drawer:**
```tsx
// Mobile sidebar - drawer menu
export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        {/* Navigation menu */}
      </SheetContent>
    </Sheet>
  );
}
```

**Responsive Card:**
```tsx
export function ProjectCard({ project }: Props) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-sm sm:text-base md:text-lg">
          {project.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        {/* Responsive content */}
      </CardContent>
    </Card>
  );
}
```

**Responsive Layout:**
```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
  <div className="flex-1 min-w-0">
    {/* Content */}
  </div>
  <Button className="w-full sm:w-auto shrink-0">
    Action
  </Button>
</div>
```

**Responsive Grid:**
```tsx
// Single column on mobile, multiple on desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <ItemCard key={item.id} item={item} />
  ))}
</div>
```

**Responsive Text:**
```tsx
// Scale text size based on screen
<h1 className="text-2xl sm:text-3xl font-bold">
  Title
</h1>
<p className="text-xs sm:text-sm text-muted-foreground">
  Description
</p>
```

### Responsive Utilities

**Common Patterns:**
- `hidden md:flex` - Hide on mobile, show on desktop
- `flex-col sm:flex-row` - Stack on mobile, row on desktop
- `w-full sm:w-auto` - Full width on mobile, auto on desktop
- `text-xs sm:text-sm md:text-base` - Progressive text sizing
- `p-3 sm:p-4 md:p-6` - Progressive padding
- `gap-2 sm:gap-4` - Progressive spacing
- `min-w-0` - Prevent flex item overflow
- `truncate` - Ellipsis for long text
- `line-clamp-2` - Limit lines with ellipsis

## Naming
- Components: PascalCase
- Files: kebab-case
- Functions: camelCase
- Booleans: is/has/can prefix

