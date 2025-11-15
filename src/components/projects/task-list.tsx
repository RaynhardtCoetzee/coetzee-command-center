'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, LayoutList, Layers } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SortableTaskItem } from './sortable-task-item';
import { useTasks, useUpdateTask } from '@/hooks/use-tasks';
import { useQueryClient } from '@tanstack/react-query';
import type { Task } from '@prisma/client';

interface TaskListProps {
  projectId: string;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: 'To Do', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  review: { label: 'Review', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  done: { label: 'Done', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
};

export function TaskList({ projectId, onEdit, onDelete }: TaskListProps) {
  const { data: tasks, isLoading } = useTasks({ projectId });
  const updateTask = useUpdateTask();
  const queryClient = useQueryClient();
  const [collapsedSections, setCollapsedSections] = useState<Set<TaskStatus>>(new Set());
  const [groupByStatus, setGroupByStatus] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const tasksArray = (tasks as (Task & { project?: { id: string; title: string } })[]) || [];

  // Group tasks by status and sort by order
  const groupedTasks = useMemo(() => {
    const grouped = tasksArray.reduce(
      (acc, task) => {
        const status = (task.status as TaskStatus) || 'todo';
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(task);
        return acc;
      },
      {} as Record<TaskStatus, typeof tasksArray>
    );

    // Sort each group by order, then by createdAt
    Object.keys(grouped).forEach((status) => {
      grouped[status as TaskStatus].sort((a, b) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
    });

    return grouped;
  }, [tasksArray]);

  const toggleSection = (status: TaskStatus) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeTask = tasksArray.find((t) => t.id === active.id);
    const overTask = tasksArray.find((t) => t.id === over.id);

    if (!activeTask || !overTask) {
      return;
    }

    // Only allow reordering within the same status group
    if (activeTask.status !== overTask.status) {
      return;
    }

    const status = activeTask.status as TaskStatus;
    const tasksInStatus = [...(groupedTasks[status] || [])];
    const oldIndex = tasksInStatus.findIndex((t) => t.id === active.id);
    const newIndex = tasksInStatus.findIndex((t) => t.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Calculate new order values
    const reorderedTasks = [...tasksInStatus];
    const [removed] = reorderedTasks.splice(oldIndex, 1);
    reorderedTasks.splice(newIndex, 0, removed);

    // Optimistically update the UI
    const previousTasks = queryClient.getQueryData(['tasks', { projectId }]);
    
    queryClient.setQueryData(['tasks', { projectId }], (old: any[]) => {
      if (!old) return old;
      
      // Create a map for quick lookup
      const taskMap = new Map(old.map((t) => [t.id, { ...t }]));
      
      // Update order values
      reorderedTasks.forEach((task, index) => {
        const updatedTask = taskMap.get(task.id);
        if (updatedTask) {
          updatedTask.order = index;
        }
      });
      
      return Array.from(taskMap.values());
    });

    // Update each task's order on the server
    try {
      const updates = reorderedTasks
        .map((task, index) => {
          if (task.order !== index) {
            return updateTask.mutateAsync({
              id: task.id,
              data: { order: index },
            });
          }
          return null;
        })
        .filter((update): update is Promise<any> => update !== null);
      
      if (updates.length > 0) {
        await Promise.all(updates);
      }
      
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['tasks', { projectId }] });
    } catch (error) {
      // Rollback on error
      if (previousTasks) {
        queryClient.setQueryData(['tasks', { projectId }], previousTasks);
      }
      console.error('Failed to update task order:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  const statuses: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];

  // Sort tasks by order, then by createdAt when not grouped
  const sortedTasks = [...tasksArray].sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  if (!groupByStatus) {
    // Ungrouped view - show all tasks in a simple list with drag-and-drop
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4">
          {/* View Toggle */}
          <div className="flex items-center justify-between pb-2 border-b">
            <span className="text-sm font-medium">View Options</span>
            <div className="flex items-center gap-2">
              <Button
                variant={groupByStatus ? 'default' : 'outline'}
                size="sm"
                onClick={() => setGroupByStatus(true)}
                className="h-8"
              >
                <Layers className="h-4 w-4 mr-2" />
                Grouped
              </Button>
              <Button
                variant={!groupByStatus ? 'default' : 'outline'}
                size="sm"
                onClick={() => setGroupByStatus(false)}
                className="h-8"
              >
                <LayoutList className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>

          {/* Task List */}
          {sortedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <LayoutList className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium mb-1">No tasks yet</h3>
              <p className="text-xs text-muted-foreground mb-4 max-w-sm">
                Get started by creating your first task. Tasks help you break down your project into manageable pieces.
              </p>
            </div>
          ) : (
            <SortableContext
              items={sortedTasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sortedTasks.map((task) => (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    onEdit={() => onEdit(task.id)}
                    onDelete={() => onDelete(task.id)}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </DndContext>
    );
  }

  // Grouped view with drag-and-drop per status group
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        {/* View Toggle */}
        <div className="flex items-center justify-between pb-2 border-b">
          <span className="text-sm font-medium">View Options</span>
          <div className="flex items-center gap-2">
            <Button
              variant={groupByStatus ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGroupByStatus(true)}
              className="h-8"
            >
              <Layers className="h-4 w-4 mr-2" />
              Grouped
            </Button>
            <Button
              variant={!groupByStatus ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGroupByStatus(false)}
              className="h-8"
            >
              <LayoutList className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        {/* Grouped Tasks by Status */}
        {statuses.map((status) => {
          const tasksInStatus = groupedTasks[status] || [];
          const isCollapsed = collapsedSections.has(status);
          const config = statusConfig[status];

          return (
            <div key={status} className="border rounded-lg">
              <Button
                variant="ghost"
                className="w-full justify-between p-4 h-auto hover:bg-muted/50"
                onClick={() => toggleSection(status)}
              >
                <div className="flex items-center gap-2">
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">{config.label}</span>
                  <Badge variant="secondary" className={config.color}>
                    {tasksInStatus.length}
                  </Badge>
                </div>
              </Button>

              {!isCollapsed && (
                <div className="px-4 pb-4 space-y-2">
                  {tasksInStatus.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      No tasks in {config.label.toLowerCase()}
                    </div>
                  ) : (
                    <SortableContext
                      items={tasksInStatus.map((t) => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {tasksInStatus.map((task) => (
                        <SortableTaskItem
                          key={task.id}
                          task={task}
                          onEdit={() => onEdit(task.id)}
                          onDelete={() => onDelete(task.id)}
                        />
                      ))}
                    </SortableContext>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
