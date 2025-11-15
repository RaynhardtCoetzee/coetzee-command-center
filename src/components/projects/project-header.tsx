'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronRight, Edit, Archive, Trash2, MoreVertical } from 'lucide-react';
import type { ProjectWithRelations } from '@/types';

const statusColors: Record<string, string> = {
  planning: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  completed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  archived: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

interface ProjectHeaderProps {
  project: ProjectWithRelations;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export function ProjectHeader({ project, onEdit, onArchive, onDelete }: ProjectHeaderProps) {
  const statusColor = statusColors[project.status] || statusColors.planning;
  const priorityColor = priorityColors[project.priority] || priorityColors.medium;
  const isArchived = project.status === 'archived';

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/dashboard"
          className="hover:text-foreground transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href="/projects"
          className="hover:text-foreground transition-colors"
        >
          Projects
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{project.title}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">{project.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={statusColor}>{project.status}</Badge>
            <Badge variant="outline" className={priorityColor}>
              {project.priority}
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="hidden sm:flex"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onArchive}
                disabled={isArchived}
              >
                <Archive className="mr-2 h-4 w-4" />
                {isArchived ? 'Already Archived' : 'Archive Project'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

