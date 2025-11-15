'use client';

import { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '@prisma/client';

interface KanbanTaskCardProps {
  task: Task & { project?: { id: string; title: string } };
  onClick: () => void;
}

// Status colors available for future use
// const statusColors: Record<string, string> = {
//   todo: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
//   in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
//   review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
//   done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
// };

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function KanbanTaskCard({ task, onClick }: KanbanTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const wasDraggingRef = useRef(false);

  useEffect(() => {
    if (isDragging) {
      wasDraggingRef.current = true;
    } else if (wasDraggingRef.current) {
      // Reset after a short delay to allow click events to be processed
      const timer = setTimeout(() => {
        wasDraggingRef.current = false;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isDragging]);

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColor = priorityColors[task.priority] || priorityColors.medium;
  const dueDate = (task as any).dueDate ? new Date((task as any).dueDate) : null;
  const tags = (task as any).tags || [];

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click if we just finished dragging
    if (wasDraggingRef.current) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    onClick();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card
        className={`hover:shadow-md transition-shadow ${
          isDragging ? 'shadow-lg' : ''
        }`}
        onClick={handleClick}
      >
        <CardContent className="p-3 space-y-2">
          <h4 className="text-sm font-medium leading-tight line-clamp-2">
            {task.title}
          </h4>

          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className={`text-xs ${priorityColor}`}>
              {task.priority}
            </Badge>
            {dueDate && (
              <Badge variant="outline" className="text-xs gap-1">
                <Calendar className="h-3 w-3" />
                {format(dueDate, 'MMM d')}
              </Badge>
            )}
            {tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {tags.length}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

