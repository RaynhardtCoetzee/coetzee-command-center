'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { TagsInput } from '@/components/ui/tags-input';
import { useCreateTask, useUpdateTask, useTasks } from '@/hooks/use-tasks';
import type { CreateTaskInput, UpdateTaskInput } from '@/lib/validations/task';
import type { Task } from '@prisma/client';

interface TaskFormDialogProps {
  projectId: string;
  taskId?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Extended schema for form (includes optional fields not in DB yet)
const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.date().optional().nullable(),
  tags: z.array(z.string()).default([]),
});

type TaskFormInput = z.infer<typeof taskFormSchema>;

export function TaskFormDialog({
  projectId,
  taskId,
  open,
  onOpenChange,
}: TaskFormDialogProps) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const { data: tasks } = useTasks({ projectId });
  const isEditing = !!taskId;

  // Find the task being edited
  const tasksArray = (tasks as any[]) || [];
  const editingTask = isEditing
    ? (tasksArray.find((t) => t.id === taskId) as Task | undefined)
    : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TaskFormInput>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: null,
      tags: [],
    },
  });

  const status = watch('status');
  const priority = watch('priority');
  const dueDate = watch('dueDate');
  const tags = watch('tags');

  useEffect(() => {
    if (editingTask && open) {
      reset({
        title: editingTask.title,
        description: editingTask.description || '',
        status: (editingTask.status as any) || 'todo',
        priority: (editingTask.priority as any) || 'medium',
        dueDate: (editingTask as any).dueDate ? new Date((editingTask as any).dueDate) : null,
        tags: (editingTask as any).tags || [],
      });
    } else if (open) {
      reset({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: null,
        tags: [],
      });
    }
  }, [editingTask, projectId, reset, open]);

  const onSubmit = async (data: TaskFormInput) => {
    try {
      const taskData: CreateTaskInput | UpdateTaskInput = {
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        priority: data.priority,
        // Note: dueDate and tags are not yet in the schema, will be added later
      };

      if (isEditing && taskId) {
        await updateTask.mutateAsync({
          id: taskId,
          data: taskData as UpdateTaskInput,
        });
      } else {
        await createTask.mutateAsync({
          ...taskData,
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Task description (optional)"
              disabled={isLoading}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
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

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <DatePicker
              date={dueDate || null}
              onSelect={(date) => setValue('dueDate', date || null)}
              disabled={isLoading}
              placeholder="Select due date (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <TagsInput
              tags={tags}
              onTagsChange={(newTags) => setValue('tags', newTags)}
              disabled={isLoading}
              placeholder="Add tags (optional)"
            />
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

