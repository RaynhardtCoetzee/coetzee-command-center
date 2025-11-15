'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Trash2, Calendar, Tag, GripVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useUpdateTask } from '@/hooks/use-tasks';
import type { Task } from '@prisma/client';

interface TaskItemProps {
  task: Task & { project?: { id: string; title: string } };
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
  dragHandleProps?: any;
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

export function TaskItem({ task, onEdit, onDelete, isDragging = false, dragHandleProps }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const updateTask = useUpdateTask();

  const handleStatusToggle = (checked: boolean | 'indeterminate') => {
    // If indeterminate, treat as unchecked
    const isChecked = checked === true;
    const newStatus = isChecked ? 'done' : 'todo';
    updateTask.mutate({
      id: task.id,
      data: { status: newStatus },
    });
  };

  const isCompleted = task.status === 'done';
  const statusColor = statusColors[task.status] || statusColors.todo;
  const priorityColor = priorityColors[task.priority] || priorityColors.medium;

  // Description is now in the schema
  const description = task.description || null;
  // For now, these fields don't exist in the schema, but we'll prepare the UI for them
  const dueDate = (task as any).dueDate ? new Date((task as any).dueDate) : null;
  const tags = (task as any).tags || [];
  const checklist = (task as any).checklist || [];

  return (
    <Card 
      className={`hover:shadow-sm transition-shadow ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          {dragHandleProps && (
            <div
              {...dragHandleProps}
              className={`flex items-center cursor-grab active:cursor-grabbing transition-opacity ${
                isHovered || isDragging ? 'opacity-100' : 'opacity-0'
              } mt-1`}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}

          <Checkbox
            checked={isCompleted}
            onCheckedChange={handleStatusToggle}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-left w-full"
                >
                  <h3
                    className={`text-sm font-medium ${
                      isCompleted ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                </button>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge className={statusColor} variant="outline" onClick={onEdit}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className={priorityColor}>
                    {task.priority}
                  </Badge>
                  {dueDate && (
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(dueDate, 'MMM d')}
                    </Badge>
                  )}
                  {tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      {tags.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-3 pt-3 border-t">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                      {description ? (
                        <p className="text-sm text-foreground whitespace-pre-wrap">{description}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No description provided</p>
                      )}
                    </div>

                    {checklist.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Checklist</p>
                        <ul className="space-y-1">
                          {checklist.map((item: any, index: number) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Checkbox checked={item.completed || false} disabled />
                              <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                                {item.label}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
                      <span>Updated: {format(new Date(task.updatedAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span className="sr-only">{isExpanded ? 'Collapse' : 'Expand'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete task</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

