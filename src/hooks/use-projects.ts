'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';
import type { ProjectWithRelations } from '@/types';

type ProjectFilters = {
  status?: 'planning' | 'active' | 'review' | 'completed' | 'archived';
  clientId?: string;
  priority?: 'low' | 'medium' | 'high';
};

type CreateProjectData = {
  title: string;
  description?: string;
  roadmap?: string;
  buildPlan?: string;
  screenshots?: string[];
  techStack?: string[];
  clientId?: string | null;
  status?: 'planning' | 'active' | 'review' | 'completed' | 'archived';
  priority?: 'low' | 'medium' | 'high';
  progress?: number;
  startDate?: Date | string | null;
  dueDate?: Date | string | null;
  budget?: number | null;
};

type UpdateProjectData = Partial<CreateProjectData>;

/**
 * Fetch all projects
 */
export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectsApi.getAll(filters),
  });
}

/**
 * Fetch single project by ID
 */
export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => {
      if (!id) throw new Error('Project ID is required');
      return projectsApi.getById(id);
    },
    enabled: !!id,
  });
}

/**
 * Create a new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectData) => projectsApi.create(data),
    onMutate: async (newProject) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['projects'] });

      // Snapshot previous value
      const previousProjects = queryClient.getQueryData(['projects']);

      // Optimistically update cache
      queryClient.setQueryData(['projects'], (old: ProjectWithRelations[] | undefined) => {
        const optimisticProject: ProjectWithRelations = {
          id: `temp-${Date.now()}`,
          ...newProject,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: '',
          client: null,
          tasks: [],
          _count: { tasks: 0 },
        } as ProjectWithRelations;
        return old ? [optimisticProject, ...old] : [optimisticProject];
      });

      return { previousProjects };
    },
    onError: (error: Error, _newProject, context) => {
      // Rollback on error
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects);
      }
      toast({
        title: 'Failed to create project',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Project created',
        description: 'Your project has been created successfully.',
      });
    },
  });
}

/**
 * Update a project
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectData }) =>
      projectsApi.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      await queryClient.cancelQueries({ queryKey: ['projects', id] });

      // Snapshot previous values
      const previousProjects = queryClient.getQueryData(['projects']);
      const previousProject = queryClient.getQueryData(['projects', id]);

      // Optimistically update cache
      queryClient.setQueryData(['projects'], (old: ProjectWithRelations[] | undefined) => {
        if (!old) return old;
        return old.map((project) =>
          project.id === id ? { ...project, ...data, updatedAt: new Date() } : project
        );
      });

      queryClient.setQueryData(['projects', id], (old: ProjectWithRelations | undefined) => {
        if (!old) return old;
        return { ...old, ...data, updatedAt: new Date() };
      });

      return { previousProjects, previousProject };
    },
    onError: (error: Error, variables, context) => {
      // Rollback on error
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects);
      }
      if (context?.previousProject) {
        queryClient.setQueryData(['projects', variables.id], context.previousProject);
      }
      toast({
        title: 'Failed to update project',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
      toast({
        title: 'Project updated',
        description: 'Your project has been updated successfully.',
      });
    },
  });
}

/**
 * Delete a project
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['projects'] });

      // Snapshot previous value
      const previousProjects = queryClient.getQueryData(['projects']);

      // Optimistically update cache
      queryClient.setQueryData(['projects'], (old: ProjectWithRelations[] | undefined) => {
        if (!old) return old;
        return old.filter((project) => project.id !== id);
      });

      return { previousProjects };
    },
    onError: (error: Error, _id, context) => {
      // Rollback on error
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects);
      }
      toast({
        title: 'Failed to delete project',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Project deleted',
        description: 'Your project has been deleted successfully.',
      });
    },
  });
}

