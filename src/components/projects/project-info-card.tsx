'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Edit, Calendar, DollarSign, User, Target } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { ProjectWithRelations } from '@/types';

interface ProjectInfoCardProps {
  project: ProjectWithRelations;
  onEdit?: () => void;
}

export function ProjectInfoCard({ project, onEdit }: ProjectInfoCardProps) {
  // Parse tech stack
  const techStack = project.techStack
    ? typeof project.techStack === 'string'
      ? JSON.parse(project.techStack)
      : project.techStack
    : [];

  // Calculate progress from tasks if available
  const tasks = project.tasks || [];
  const completedTasks = tasks.filter((task) => task.status === 'done').length;
  const taskCount = tasks.length;
  const taskProgress = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;
  const progress = project.progress ?? taskProgress;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Project Information</CardTitle>
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Client */}
        {project.client && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Client</h3>
            </div>
            {project.client.id ? (
              <Link
                href={`/clients/${project.client.id}`}
                className="text-sm text-primary hover:underline"
              >
                {project.client.name}
                {project.client.email && (
                  <span className="text-muted-foreground ml-2">
                    ({project.client.email})
                  </span>
                )}
              </Link>
            ) : (
              <p className="text-sm">
                {project.client.name}
                {project.client.email && (
                  <span className="text-muted-foreground ml-2">
                    ({project.client.email})
                  </span>
                )}
              </p>
            )}
          </div>
        )}

        {/* Dates */}
        {(project.startDate || project.dueDate) && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Timeline</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.startDate && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                  <p className="text-sm font-medium">
                    {formatDate(project.startDate)}
                  </p>
                </div>
              )}
              {project.dueDate && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                  <p className="text-sm font-medium">
                    {formatDate(project.dueDate)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Budget */}
        {project.budget && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Budget</h3>
            </div>
            <p className="text-lg font-semibold">
              {formatCurrency(project.budget)}
            </p>
          </div>
        )}

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Progress</h3>
            </div>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          {taskCount > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {completedTasks} of {taskCount} tasks completed
            </p>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <div>
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {project.description}
            </p>
          </div>
        )}

        {/* Tech Stack */}
        {techStack.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

