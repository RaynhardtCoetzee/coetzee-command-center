'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateTask, useUpdateTask, useTasks } from '@/hooks/use-tasks';
import { createTaskSchema, updateTaskSchema } from '@/lib/validations/task';
import type { CreateTaskInput, UpdateTaskInput } from '@/lib/validations/task';

interface TaskFormProps {
  projectId: string;
  taskId?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskForm({ projectId, taskId, open, onOpenChange }: TaskFormProps) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const { data: tasks } = useTasks({ projectId });
  const isEditing = !!taskId;

  // Find the task being edited
  const tasksArray = (tasks as any[]) || [];
  const editingTask = isEditing
    ? tasksArray.find((t) => t.id === taskId)
    : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateTaskInput | UpdateTaskInput>({
    resolver: zodResolver(isEditing ? updateTaskSchema : createTaskSchema),
    defaultValues: {
      title: '',
      projectId,
      status: 'todo',
      priority: 'medium',
      order: 0,
    },
  });

  const status = watch('status');
  const priority = watch('priority');

  useEffect(() => {
    if (editingTask) {
      reset({
        title: editingTask.title,
        status: editingTask.status,
        priority: editingTask.priority,
        order: editingTask.order,
      });
    } else {
      reset({
        title: '',
        projectId,
        status: 'todo',
        priority: 'medium',
        order: 0,
      });
    }
  }, [editingTask, projectId, reset, open]);

  const onSubmit = async (data: CreateTaskInput | UpdateTaskInput) => {
    try {
      if (isEditing && taskId) {
        await updateTask.mutateAsync({
          id: taskId,
          data: data as UpdateTaskInput,
        });
      } else {
        await createTask.mutateAsync({
          ...data,
          projectId,
        } as CreateTaskInput);
      }
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const isLoading = createTask.isPending || updateTask.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your task details below.'
              : 'Fill in the details to create a new task.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Task title"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setValue('status', value as any)}
                disabled={isLoading}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => setValue('priority', value as any)}
                disabled={isLoading}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? isEditing
                  ? 'Updating...'
                  : 'Creating...'
                : isEditing
                  ? 'Update Task'
                  : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

