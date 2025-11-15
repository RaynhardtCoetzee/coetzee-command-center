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

### Custom Hooks
```tsx
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
}
```

## Naming
- Components: PascalCase
- Files: kebab-case
- Functions: camelCase
- Booleans: is/has/can prefix

