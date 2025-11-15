'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { KanbanColumn } from './kanban-column';
import { KanbanTaskCard } from './kanban-task-card';
import { useTasks, useUpdateTask } from '@/hooks/use-tasks';
import { Skeleton } from '@/components/ui/skeleton';
import type { Task } from '@prisma/client';
import type { TaskStatus } from '@/types';

interface KanbanBoardProps {
  projectId: string;
  onTaskClick: (taskId: string) => void;
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

export function KanbanBoard({ projectId, onTaskClick }: KanbanBoardProps) {
  const { data: tasks, isLoading } = useTasks({ projectId });
  const updateTask = useUpdateTask();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const tasksArray = (tasks as (Task & { project?: { id: string; title: string } })[]) || [];

  // Group tasks by status
  const tasksByStatus = tasksArray.reduce(
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

  const handleDragStart = (_event: DragStartEvent) => {
    // Optional: Add visual feedback during drag start
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Optional: Add visual feedback during drag
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const taskId = active.id as string;
    const task = tasksArray.find((t) => t.id === taskId);

    if (!task) {
      return;
    }

    const overData = over.data.current;
    let newStatus: TaskStatus | null = null;

    // Check if dropped on a column
    if (overData?.type === 'column') {
      newStatus = overData.status as TaskStatus;
    } 
    // Check if dropped on another task (get status from that task's column)
    else if (overData?.type === 'task') {
      const overTask = tasksArray.find((t) => t.id === over.id);
      if (overTask) {
        newStatus = (overTask.status as TaskStatus) || 'todo';
      }
    }
    // Check if dropped directly on a column by ID
    else if (columns.some((col) => col.id === over.id)) {
      newStatus = over.id as TaskStatus;
    }

    // Only update if status changed and we found a valid status
    if (newStatus && task.status !== newStatus) {
      updateTask.mutate({
        id: taskId,
        data: { status: newStatus },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
        {columns.map((column) => {
          const columnTasks = tasksByStatus[column.id] || [];
          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={columnTasks}
              count={columnTasks.length}
            >
              {columnTasks.map((task) => (
                <KanbanTaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onTaskClick(task.id)}
                />
              ))}
            </KanbanColumn>
          );
        })}
      </div>
    </DndContext>
  );
}

