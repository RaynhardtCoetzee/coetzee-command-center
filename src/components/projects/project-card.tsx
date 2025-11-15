'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, FolderKanban } from 'lucide-react';
import { formatDate, calculateProgress } from '@/lib/utils';
import type { ProjectWithRelations } from '@/types';

interface ProjectCardProps {
  project: ProjectWithRelations;
  onEdit: (project: ProjectWithRelations) => void;
  onDelete: (id: string) => void;
}

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

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const statusColor = statusColors[project.status] || statusColors.planning;
  const priorityColor = priorityColors[project.priority] || priorityColors.medium;
  const taskCount = project._count?.tasks || project.tasks?.length || 0;
  
  // Calculate progress from tasks if available
  const tasks = project.tasks || [];
  const completedTasks = tasks.filter((task) => task.status === 'done').length;
  const taskProgress = taskCount > 0 ? calculateProgress(completedTasks, taskCount) : 0;
  const progress = project.progress || taskProgress;

  // Parse screenshots and get preview image
  const screenshots = project.screenshots
    ? typeof project.screenshots === 'string'
      ? JSON.parse(project.screenshots)
      : project.screenshots
    : [];
  const previewImage = screenshots.length > 0 ? screenshots[0] : null;

  // Placeholder SVG for missing images
  const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEMyNy41ODE3IDIwIDI0IDIzLjU4MTcgMjQgMjhDMjQgMzIuNDE4MyAyNy41ODE3IDM2IDMyIDM2QzM2LjQxODMgMzYgNDAgMzIuNDE4MyA0MCAyOEM0MCAyMy41ODE3IDM2LjQxODMgMjAgMzIgMjBaIiBmaWxsPSIjOUI5Q0E0Ii8+CjxwYXRoIGQ9Ik0xNiA0OEwxNiA0MEwyNCA0MEwyNCA0OEgxNloiIGZpbGw9IiM5QjlDQTQiLz4KPHBhdGggZD0iTTQwIDQ4TDQwIDQwTDQ4IDQwTDQ4IDQ4SDQwWiIgZmlsbD0iIzlCOUNBNCIvPgo8L3N2Zz4K';

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group h-full flex flex-col overflow-hidden">
      <Link href={`/projects/${project.id}`} className="flex flex-col flex-1 min-h-0">
        {/* Preview Image */}
        {previewImage && (
          <div className="relative w-full h-40 sm:h-48 overflow-hidden bg-muted">
            <img
              src={previewImage}
              alt={`${project.title} preview`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = placeholderImage;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        <CardHeader className="pb-2 sm:pb-3 flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <FolderKanban className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base md:text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
              </div>
              {project.description && (
                <CardDescription className="line-clamp-2 text-xs sm:text-sm mt-1">
                  {project.description}
                </CardDescription>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(project);
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(project.id);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6 flex-1 flex flex-col justify-between min-h-0">
          <div className="space-y-2 sm:space-y-3">
            {/* Status and Priority Badges */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <Badge className={`${statusColor} text-xs px-2 py-0.5`} variant="default">
                {project.status}
              </Badge>
              <Badge variant="outline" className={`${priorityColor} text-xs px-2 py-0.5`}>
                {project.priority}
              </Badge>
            </div>

            {/* Client */}
            {project.client && (
              <div className="text-xs sm:text-sm text-muted-foreground truncate">
                Client: <span className="font-medium text-foreground">{project.client.name}</span>
              </div>
            )}

            {/* Progress Bar */}
            {taskCount > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5 sm:h-2" />
              </div>
            )}
          </div>

          {/* Task Count and Last Updated */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground pt-2 sm:pt-3 border-t mt-auto">
            <div className="truncate">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
              {taskCount > 0 && (
                <span className="ml-1 hidden sm:inline">
                  ({completedTasks} completed)
                </span>
              )}
            </div>
            <div className="truncate sm:text-right text-xs">
              {formatDate(project.updatedAt)}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
