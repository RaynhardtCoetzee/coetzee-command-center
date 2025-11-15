'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Filter, X, CalendarIcon } from 'lucide-react';
import { useClients } from '@/hooks/use-clients';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export type ProjectFilters = {
  clientId?: string;
  priority?: 'low' | 'medium' | 'high';
  techStack?: string[];
  dateRange?: {
    from?: Date;
    to?: Date;
  };
};

interface ProjectFiltersProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  availableTechStack?: string[];
}

export function ProjectFilters({
  filters,
  onFiltersChange,
  availableTechStack = [],
}: ProjectFiltersProps) {
  const { data: clients } = useClients();
  const [isOpen, setIsOpen] = useState(false);
  
  // Ensure clients is an array
  const clientsArray = Array.isArray(clients) ? clients : [];

  const activeFilterCount = [
    filters.clientId,
    filters.priority,
    filters.techStack?.length,
    filters.dateRange?.from || filters.dateRange?.to,
  ].filter(Boolean).length;

  const handleClientChange = (clientId: string) => {
    onFiltersChange({
      ...filters,
      clientId: clientId === 'all' ? undefined : clientId,
    });
  };

  const handlePriorityChange = (priority: string) => {
    onFiltersChange({
      ...filters,
      priority: priority === 'all' ? undefined : (priority as 'low' | 'medium' | 'high'),
    });
  };

  const handleTechStackToggle = (tech: string) => {
    const current = filters.techStack || [];
    const updated = current.includes(tech)
      ? current.filter((t) => t !== tech)
      : [...current, tech];
    onFiltersChange({
      ...filters,
      techStack: updated.length > 0 ? updated : undefined,
    });
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
    onFiltersChange({
      ...filters,
      dateRange: range?.from || range?.to ? range : undefined,
    });
  };

  const handleReset = () => {
    onFiltersChange({});
    setIsOpen(false);
  };

  // Extract unique tech stack from projects (if not provided)
  // For now, we'll use a common list or allow manual entry
  const commonTechStack = [
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Python',
    'PostgreSQL',
    'MongoDB',
    'Tailwind CSS',
    'Prisma',
    'Docker',
    ...availableTechStack,
  ].filter((tech, index, self) => self.indexOf(tech) === index);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Advanced Filters</h3>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-7 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>

          {/* Client Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Client</Label>
            <Select
              value={filters.clientId || 'all'}
              onValueChange={handleClientChange}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="All clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All clients</SelectItem>
                {clientsArray.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Priority</Label>
            <Select
              value={filters.priority || 'all'}
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal h-9',
                    !filters.dateRange?.from && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, 'LLL dd, y')} -{' '}
                        {format(filters.dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(filters.dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange?.from}
                  selected={{
                    from: filters.dateRange?.from,
                    to: filters.dateRange?.to,
                  }}
                  onSelect={(range) => handleDateRangeChange(range)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Tech Stack Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Tech Stack</Label>
            <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2">
              {commonTechStack.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">
                  No tech stack available
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {commonTechStack.map((tech) => {
                    const isSelected = filters.techStack?.includes(tech);
                    return (
                      <Button
                        key={tech}
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleTechStackToggle(tech)}
                      >
                        {tech}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="pt-2 border-t">
              <div className="flex flex-wrap gap-1.5">
                {filters.clientId && (
                  <Badge variant="secondary" className="text-xs">
                    Client: {clientsArray.find((c) => c.id === filters.clientId)?.name || 'Unknown'}
                    <button
                      onClick={() => handleClientChange('all')}
                      className="ml-1.5 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.priority && (
                  <Badge variant="secondary" className="text-xs">
                    Priority: {filters.priority}
                    <button
                      onClick={() => handlePriorityChange('all')}
                      className="ml-1.5 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.techStack && filters.techStack.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Tech: {filters.techStack.length}
                    <button
                      onClick={() => onFiltersChange({ ...filters, techStack: undefined })}
                      className="ml-1.5 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {(filters.dateRange?.from || filters.dateRange?.to) && (
                  <Badge variant="secondary" className="text-xs">
                    Date Range
                    <button
                      onClick={() => handleDateRangeChange(undefined)}
                      className="ml-1.5 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

