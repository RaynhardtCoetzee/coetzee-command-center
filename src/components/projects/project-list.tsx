'use client';

import { useMemo, useEffect, useState } from 'react';
import { ProjectCard } from './project-card';
import { ProjectCardList } from './project-card-list';
import { ProjectListSkeleton } from './project-skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, FolderKanban, Search, FilterX } from 'lucide-react';
import { useProjects, useDeleteProject } from '@/hooks/use-projects';
import type { ProjectWithRelations } from '@/types';
import type { ProjectFilters } from './project-filters';

type ViewMode = 'grid' | 'list';
type SortOption = 'created' | 'updated' | 'name' | 'status' | 'priority' | 'progress' | 'dueDate';
type StatusFilter = 'all' | 'planning' | 'active' | 'review' | 'completed' | 'archived';

interface ProjectListProps {
  filters?: {
    status?: 'planning' | 'active' | 'review' | 'completed' | 'archived';
    clientId?: string;
    priority?: 'low' | 'medium' | 'high';
  };
  advancedFilters?: ProjectFilters;
  searchQuery?: string;
  statusFilter?: StatusFilter;
  sortOption?: SortOption;
  viewMode?: ViewMode;
  onNewProject: () => void;
  onEditProject: (project: ProjectWithRelations) => void;
  onProjectCountChange?: (count: number) => void;
  onClearFilters?: () => void;
}

export function ProjectList({
  filters,
  advancedFilters,
  searchQuery = '',
  statusFilter = 'all',
  sortOption = 'updated',
  viewMode = 'grid',
  onNewProject,
  onEditProject,
  onProjectCountChange,
  onClearFilters,
}: ProjectListProps) {
  const { data: projects, isLoading, error } = useProjects(filters);
  const deleteProject = useDeleteProject();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectWithRelations | null>(null);

  const handleDeleteClick = (project: ProjectWithRelations) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteProject.mutate(projectToDelete.id);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  // Filter and sort projects client-side
  const filteredAndSortedProjects = useMemo(() => {
    if (!projects) return [];

    let filtered = [...(projects as ProjectWithRelations[])];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((project) =>
        project.title.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.client?.name.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    // Apply advanced filters
    if (advancedFilters) {
      // Client filter
      if (advancedFilters.clientId) {
        filtered = filtered.filter((project) => project.clientId === advancedFilters.clientId);
      }

      // Priority filter
      if (advancedFilters.priority) {
        filtered = filtered.filter((project) => project.priority === advancedFilters.priority);
      }

      // Tech stack filter
      if (advancedFilters.techStack && advancedFilters.techStack.length > 0) {
        filtered = filtered.filter((project) => {
          const projectTechStack = Array.isArray(project.techStack)
            ? project.techStack
            : project.techStack
            ? JSON.parse(project.techStack)
            : [];
          return advancedFilters.techStack!.some((tech) =>
            projectTechStack.some((pt: string) => pt.toLowerCase() === tech.toLowerCase())
          );
        });
      }

      // Date range filter
      if (advancedFilters.dateRange) {
        const { from, to } = advancedFilters.dateRange;
        filtered = filtered.filter((project) => {
          const projectDate = project.dueDate ? new Date(project.dueDate) : null;
          if (!projectDate) return false;
          if (from && projectDate < from) return false;
          if (to && projectDate > to) return false;
          return true;
        });
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'priority': {
          const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        }
        case 'progress': {
          const aProgress = a.progress || 0;
          const bProgress = b.progress || 0;
          return bProgress - aProgress;
        }
        case 'dueDate': {
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          if (aDate === 0 && bDate === 0) return 0;
          if (aDate === 0) return 1;
          if (bDate === 0) return -1;
          return aDate - bDate;
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchQuery, statusFilter, sortOption, advancedFilters]);

  // Notify parent of project count
  useEffect(() => {
    if (onProjectCountChange) {
      onProjectCountChange(filteredAndSortedProjects.length);
    }
  }, [filteredAndSortedProjects.length, onProjectCountChange]);

  if (isLoading) {
    return <ProjectListSkeleton viewMode={viewMode} count={6} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <FilterX className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Failed to load projects</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          {error.message || 'An error occurred while loading projects. Please try again.'}
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </div>
    );
  }

  if (!filteredAndSortedProjects || filteredAndSortedProjects.length === 0) {
    const hasFilters =
      searchQuery.trim() ||
      statusFilter !== 'all' ||
      (advancedFilters &&
        (advancedFilters.clientId ||
          advancedFilters.priority ||
          (advancedFilters.techStack && advancedFilters.techStack.length > 0) ||
          advancedFilters.dateRange));

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="rounded-full bg-muted p-4 mb-4">
          <FolderKanban className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {hasFilters ? 'No projects match your filters' : 'No projects yet'}
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          {hasFilters ? (
            <>
              Try adjusting your search or filters to find what you&apos;re looking for.
            </>
          ) : (
            <>
              Get started by creating your first project. Projects help you organize
              and track your work.
            </>
          )}
        </p>
        {hasFilters ? (
          <div className="flex flex-col sm:flex-row gap-2">
            {onClearFilters && (
              <Button variant="outline" onClick={onClearFilters}>
                <Search className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <Button onClick={onNewProject}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Project
          </Button>
        )}
      </div>
    );
  }

  const ProjectComponent = viewMode === 'grid' ? ProjectCard : ProjectCardList;

  return (
    <>
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-4'
        }
      >
        {filteredAndSortedProjects.map((project: ProjectWithRelations) => (
          <ProjectComponent
            key={project.id}
            project={project as ProjectWithRelations}
            onEdit={onEditProject}
            onDelete={() => handleDeleteClick(project)}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{projectToDelete?.title}&quot;? This action
              cannot be undone and will also delete all associated tasks.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setProjectToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
