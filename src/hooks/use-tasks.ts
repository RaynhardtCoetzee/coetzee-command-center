'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';
import type { Task } from '@prisma/client';

type TaskWithProject = Task & {
  project: { id: string; title: string; status: string };
};

type TaskFilters = {
  projectId?: string;
  status?: 'todo' | 'in_progress' | 'review' | 'done';
  priority?: 'low' | 'medium' | 'high';
};

type CreateTaskData = {
  title: string;
  projectId: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'review' | 'done';
  priority?: 'low' | 'medium' | 'high';
  order?: number;
};

type UpdateTaskData = Partial<CreateTaskData>;

/**
 * Fetch all tasks
 */
export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksApi.getAll(filters),
  });
}

/**
 * Create a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskData) => tasksApi.create(data),
    onMutate: async (newTask) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['tasks', { projectId: newTask.projectId }] });

      // Snapshot previous values
      const previousTasks = queryClient.getQueryData(['tasks']);
      const previousProjectTasks = queryClient.getQueryData([
        'tasks',
        { projectId: newTask.projectId },
      ]);

      // Optimistically update cache
      const optimisticTask: TaskWithProject = {
        id: `temp-${Date.now()}`,
        ...newTask,
        userId: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        project: { id: newTask.projectId, title: '', status: '' },
      } as TaskWithProject;

      queryClient.setQueryData(['tasks'], (old: TaskWithProject[] | undefined) => {
        return old ? [...old, optimisticTask] : [optimisticTask];
      });

      queryClient.setQueryData(
        ['tasks', { projectId: newTask.projectId }],
        (old: TaskWithProject[] | undefined) => {
          return old ? [...old, optimisticTask] : [optimisticTask];
        }
      );

      return { previousTasks, previousProjectTasks };
    },
    onError: (error: Error, variables, context?: { previousTasks?: TaskWithProject[]; previousProjectTasks?: TaskWithProject[] }) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      if (context?.previousProjectTasks) {
        queryClient.setQueryData(['tasks', { projectId: variables.projectId }], context.previousProjectTasks);
      }
      toast({
        title: 'Failed to create task',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
      toast({
        title: 'Task created',
        description: 'Your task has been created successfully.',
      });
    },
  });
}

/**
 * Update a task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation<TaskWithProject, Error, { id: string; data: UpdateTaskData }>({
    mutationFn: ({ id, data }) => tasksApi.update(id, data) as Promise<TaskWithProject>,
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot previous values
      const previousTasks = queryClient.getQueryData<TaskWithProject[]>(['tasks']);
      
      // Find the task to get its projectId
      const tasksArray = previousTasks || [];
      const taskToUpdate = tasksArray.find((t) => t.id === id);
      const projectId = taskToUpdate?.projectId;

      // Optimistically update cache for all tasks
      queryClient.setQueryData(['tasks'], (old: TaskWithProject[] | undefined) => {
        if (!old) return old;
        return old.map((task) =>
          task.id === id ? { ...task, ...data, updatedAt: new Date() } : task
        );
      });

      // Also update project-specific query if we have projectId
      if (projectId) {
        const previousProjectTasks = queryClient.getQueryData<TaskWithProject[]>([
          'tasks',
          { projectId },
        ]);
        
        queryClient.setQueryData(
          ['tasks', { projectId }],
          (old: TaskWithProject[] | undefined) => {
            if (!old) return old;
            return old.map((task) =>
              task.id === id ? { ...task, ...data, updatedAt: new Date() } : task
            );
          }
        );

        return { previousTasks, previousProjectTasks, projectId };
      }

      return { previousTasks };
    },
    onError: (error: Error, variables, context?: { previousTasks?: TaskWithProject[]; previousProjectTasks?: TaskWithProject[]; projectId?: string }) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      if (context?.previousProjectTasks && context?.projectId) {
        queryClient.setQueryData(
          ['tasks', { projectId: context.projectId }],
          context.previousProjectTasks
        );
      }
      toast({
        title: 'Failed to update task',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects', task.project.id] });
      toast({
        title: 'Task updated',
        description: 'Your task has been updated successfully.',
      });
    },
  });
}

/**
 * Delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(['tasks']);

      // Optimistically update cache
      queryClient.setQueryData(['tasks'], (old: TaskWithProject[] | undefined) => {
        if (!old) return old;
        return old.filter((task) => task.id !== id);
      });

      return { previousTasks };
    },
    onError: (error: Error, _id, context?: { previousTasks?: TaskWithProject[] }) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      toast({
        title: 'Failed to delete task',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Task deleted',
        description: 'Your task has been deleted successfully.',
      });
    },
  });
}

