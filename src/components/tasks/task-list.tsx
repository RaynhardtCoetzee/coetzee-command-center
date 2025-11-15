'use client';

import { TaskItem } from './task-item';
import { Skeleton } from '@/components/ui/skeleton';
import type { Task } from '@prisma/client';

interface TaskListProps {
  tasks: (Task & { project?: { id: string; title: string } })[];
  isLoading?: boolean;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskList({ tasks, isLoading, onEdit, onDelete }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">
          No tasks yet. Create your first task to get started.
        </p>
      </div>
    );
  }

  // Sort tasks by order, then by createdAt
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div className="space-y-2">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={() => onEdit(task.id)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </div>
  );
}

