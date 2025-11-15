'use client';

import { useDroppable } from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Task } from '@prisma/client';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: (Task & { project?: { id: string; title: string } })[];
  count: number;
  children: React.ReactNode;
}

const columnColors: Record<string, string> = {
  todo: 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50',
  in_progress: 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/50',
  review: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/50',
  done: 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/50',
};

export function KanbanColumn({ id, title, tasks, count, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'column',
      status: id,
    },
  });

  const columnColor = columnColors[id] || columnColors.todo;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col h-[600px] rounded-lg border-2 transition-colors',
        columnColor,
        isOver && 'border-primary ring-2 ring-primary ring-offset-2'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
        <h3 className="font-semibold text-sm">{title}</h3>
        <Badge variant="secondary" className="ml-2">
          {count}
        </Badge>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            No tasks
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

