'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useUpdateTask } from '@/hooks/use-tasks';
import type { Task } from '@prisma/client';

interface TaskItemProps {
  task: Task & { project?: { id: string; title: string } };
  onEdit: () => void;
  onDelete: () => void;
}

const statusColors: Record<string, string> = {
  todo: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const updateTask = useUpdateTask();

  const handleStatusToggle = () => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    updateTask.mutate({
      id: task.id,
      data: { status: newStatus },
    });
  };

  const statusColor = statusColors[task.status] || statusColors.todo;
  const priorityColor = priorityColors[task.priority] || priorityColors.medium;

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 mt-0.5"
            onClick={handleStatusToggle}
          >
            {task.status === 'done' ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3
                  className={`text-sm font-medium ${
                    task.status === 'done' ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={statusColor} variant="outline">
                    {task.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className={priorityColor}>
                    {task.priority}
                  </Badge>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

