'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Grid3x3, List, X } from 'lucide-react';
import { debounce } from '@/lib/utils';
import { ProjectFilters, type ProjectFilters as ProjectFiltersType } from './project-filters';

type ViewMode = 'grid' | 'list';
type SortOption = 'created' | 'updated' | 'name' | 'status' | 'priority' | 'progress' | 'dueDate';
type StatusFilter = 'all' | 'planning' | 'active' | 'review' | 'completed' | 'archived';

interface ProjectsListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  projectCount: number;
  advancedFilters?: ProjectFiltersType;
  onAdvancedFiltersChange?: (filters: ProjectFiltersType) => void;
}

export function ProjectsListHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  sortOption,
  onSortChange,
  projectCount,
  advancedFilters,
  onAdvancedFiltersChange,
}: ProjectsListHeaderProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce search input
  const debouncedSearch = debounce((value: string) => {
    onSearchChange(value);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  return (
    <div className="space-y-3 sm:space-y-4 w-full">
      {/* Search and Filters Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={localSearch}
            onChange={handleSearchChange}
            className="pl-10 pr-10 w-full"
          />
          {localSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[140px] md:w-[160px] shrink-0 text-sm">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Option */}
        <Select value={sortOption} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[140px] md:w-[160px] shrink-0 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Last Updated</SelectItem>
            <SelectItem value="created">Date Created</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="progress">Progress</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
          </SelectContent>
        </Select>

        {/* Advanced Filters */}
        {onAdvancedFiltersChange && (
          <ProjectFilters
            filters={advancedFilters || {}}
            onFiltersChange={onAdvancedFiltersChange}
          />
        )}
      </div>

      {/* View Toggle and Count */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-xs sm:text-sm text-muted-foreground truncate">
          {projectCount} {projectCount === 1 ? 'project' : 'projects'}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('grid')}
            className="h-8 w-8 sm:h-9 sm:w-9"
            aria-label="Grid view"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('list')}
            className="h-8 w-8 sm:h-9 sm:w-9"
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}


