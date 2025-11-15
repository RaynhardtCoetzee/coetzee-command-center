'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
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

interface ProjectCardListProps {
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

export function ProjectCardList({ project, onEdit, onDelete }: ProjectCardListProps) {
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
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden">
      <Link href={`/projects/${project.id}`}>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Preview Image or Icon */}
            <div className="flex-shrink-0">
              {previewImage ? (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-muted border">
                  <img
                    src={previewImage}
                    alt={`${project.title} preview`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = placeholderImage;
                    }}
                  />
                </div>
              ) : (
                <div className="hidden sm:block">
                  <FolderKanban className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base md:text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2 mt-1">
                      {project.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
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
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEdit(project);
                      }}
                    >
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

              {/* Badges and Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <Badge className={`${statusColor} text-xs px-2 py-0.5`} variant="default">
                    {project.status}
                  </Badge>
                  <Badge variant="outline" className={`${priorityColor} text-xs px-2 py-0.5`}>
                    {project.priority}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                  {project.client && (
                    <span className="truncate max-w-[120px] sm:max-w-none">
                      Client: <span className="font-medium text-foreground">{project.client.name}</span>
                    </span>
                  )}
                  <span className="truncate">
                    {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                    {taskCount > 0 && (
                      <span className="hidden sm:inline">
                        {' '}({completedTasks} completed)
                      </span>
                    )}
                  </span>
                  <span className="truncate hidden sm:inline">
                    Updated {formatDate(project.updatedAt)}
                  </span>
                </div>
              </div>

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

              {/* Mobile: Last Updated */}
              <div className="text-xs text-muted-foreground sm:hidden pt-1 border-t">
                Updated {formatDate(project.updatedAt)}
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
