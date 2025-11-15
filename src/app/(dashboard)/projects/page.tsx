'use client';

import { useState } from 'react';
import { ProjectList } from '@/components/projects/project-list';
import { ProjectsListHeader } from '@/components/projects/projects-list-header';
import { ProjectForm } from '@/components/projects/project-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { ProjectWithRelations } from '@/types';
import type { ProjectFilters } from '@/components/projects/project-filters';

type ViewMode = 'grid' | 'list';
type SortOption = 'created' | 'updated' | 'name' | 'status' | 'priority' | 'progress' | 'dueDate';
type StatusFilter = 'all' | 'planning' | 'active' | 'review' | 'completed' | 'archived';

export default function ProjectsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithRelations | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('updated');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [projectCount, setProjectCount] = useState(0);
  const [advancedFilters, setAdvancedFilters] = useState<ProjectFilters>({});

  const handleNewProject = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEditProject = (project: ProjectWithRelations) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setAdvancedFilters({});
  };

  // Convert status filter to API filter format
  const apiFilters = statusFilter !== 'all' 
    ? { status: statusFilter }
    : undefined;

  return (
    <div className="space-y-4 sm:space-y-6 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Projects</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Manage your projects and track their progress
          </p>
        </div>
        <Button onClick={handleNewProject} className="w-full sm:w-auto shrink-0" size="default">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Filters and Search */}
      <ProjectsListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortOption={sortOption}
        onSortChange={setSortOption}
        projectCount={projectCount}
        advancedFilters={advancedFilters}
        onAdvancedFiltersChange={setAdvancedFilters}
      />

      {/* Projects List */}
      <ProjectList
        filters={apiFilters}
        advancedFilters={advancedFilters}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        sortOption={sortOption}
        viewMode={viewMode}
        onNewProject={handleNewProject}
        onEditProject={handleEditProject}
        onProjectCountChange={setProjectCount}
        onClearFilters={handleClearFilters}
      />

      {/* Project Form Dialog */}
      <ProjectForm
        project={editingProject}
        open={isFormOpen}
        onOpenChange={handleFormClose}
      />
    </div>
  );
}
