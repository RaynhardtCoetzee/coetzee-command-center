'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileText, ArrowLeft, LayoutList, Columns } from 'lucide-react';
import { useProject, useDeleteProject, useUpdateProject } from '@/hooks/use-projects';
import { useDeleteTask } from '@/hooks/use-tasks';
import { ProjectForm } from '@/components/projects/project-form';
import { TaskList, TaskFormDialog, AddTaskButton, KanbanBoard } from '@/components/projects';
import { ProjectHeader } from '@/components/projects/project-header';
import { ProjectInfoCard } from '@/components/projects/project-info-card';
import { NotebookViewer } from '@/components/projects/notebook-viewer';
import { ProjectDetailSkeleton } from '@/components/projects/project-skeleton';
import { useViewPreference } from '@/stores/view-preference';
import { toast } from '@/hooks/use-toast';
import type { ProjectWithRelations } from '@/types';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { data: project, isLoading, error } = useProject(projectId);
  const deleteProject = useDeleteProject();
  const deleteTask = useDeleteTask();
  const updateProject = useUpdateProject();
  const { taskView, setTaskView } = useViewPreference();
  
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isDeleteTaskDialogOpen, setIsDeleteTaskDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleteDialogOpen(false);
    deleteProject.mutate(projectId, {
      onSuccess: () => {
        toast({
          title: 'Project deleted',
          description: 'The project has been deleted successfully.',
        });
        router.push('/projects');
      },
    });
  };

  const handleArchive = async () => {
    setIsArchiveDialogOpen(false);
    updateProject.mutate(
      {
        id: projectId,
        data: { status: 'archived' },
      },
      {
        onSuccess: () => {
          toast({
            title: 'Project archived',
            description: 'The project has been archived successfully.',
          });
        },
      }
    );
  };

  const handleEdit = () => {
    setIsEditFormOpen(true);
  };

  const handleNewTask = () => {
    setEditingTaskId(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (taskId: string) => {
    setEditingTaskId(taskId);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteTaskDialogOpen(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      deleteTask.mutate(taskToDelete, {
        onSuccess: () => {
          toast({
            title: 'Task deleted',
            description: 'The task has been deleted successfully.',
          });
        },
      });
      setIsDeleteTaskDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  // Loading state
  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  // Error state
  if (error || !project) {
    const is404 = error?.message?.includes('404') || error?.message?.includes('not found') || !project;
    
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <FileText className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {is404 ? 'Project not found' : 'Failed to load project'}
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          {is404
            ? "The project you're looking for doesn't exist or has been deleted."
            : error?.message || 'An error occurred while loading the project. Please try again.'}
        </p>
        <Button onClick={() => router.push('/projects')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    );
  }

  const projectData = project as ProjectWithRelations;
  const hasNotes = !!(projectData.roadmap || projectData.buildPlan);

  // Parse screenshots and get preview image
  const screenshots = projectData.screenshots
    ? typeof projectData.screenshots === 'string'
      ? JSON.parse(projectData.screenshots)
      : projectData.screenshots
    : [];
  const previewImage = screenshots.length > 0 ? screenshots[0] : null;

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header */}
      <ProjectHeader
        project={projectData}
        onEdit={handleEdit}
        onArchive={() => setIsArchiveDialogOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      {/* Preview Image */}
      {previewImage && (
        <div className="relative w-full rounded-lg overflow-hidden border bg-muted">
          <img
            src={previewImage}
            alt={`${projectData.title} preview`}
            className="w-full h-64 sm:h-80 md:h-96 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEMyNy41ODE3IDIwIDI0IDIzLjU4MTcgMjQgMjhDMjQgMzIuNDE4MyAyNy41ODE3IDM2IDMyIDM2QzM2LjQxODMgMzYgNDAgMzIuNDE4MyA0MCAyOEM0MCAyMy41ODE3IDM2LjQxODMgMjAgMzIgMjBaIiBmaWxsPSIjOUI5Q0E0Ii8+CjxwYXRoIGQ9Ik0xNiA0OEwxNiA0MEwyNCA0MEwyNCA0OEgxNloiIGZpbGw9IiM5QjlDQTQiLz4KPHBhdGggZD0iTTQwIDQ4TDQwIDQwTDQ4IDQwTDQ4IDQ4SDQwWiIgZmlsbD0iIzlCOUNBNCIvPgo8L3N2Zz4K';
            }}
          />
          <a
            href={previewImage}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors group"
            title="Click to view full size"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-md">
              View Full Size
            </span>
          </a>
        </div>
      )}

      {/* Project Info Card */}
      <ProjectInfoCard project={projectData} onEdit={handleEdit} />

      {/* Tech Stack - Already included in ProjectInfoCard, but keeping for reference */}
      
      {/* Tasks Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                Manage and track your project tasks
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={taskView === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTaskView('list')}
                  className="h-8"
                >
                  <LayoutList className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={taskView === 'kanban' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTaskView('kanban')}
                  className="h-8"
                >
                  <Columns className="h-4 w-4 mr-2" />
                  Kanban
                </Button>
              </div>
              <AddTaskButton onClick={handleNewTask} className="w-full sm:w-auto" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {taskView === 'kanban' ? (
            <KanbanBoard
              projectId={projectId}
              onTaskClick={handleEditTask}
            />
          ) : (
            <TaskList
              projectId={projectId}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
        </CardContent>
      </Card>

      {/* Notes Section */}
      {hasNotes && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Notes</CardTitle>
                <CardDescription>
                  Project roadmap and build plan
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsNotebookOpen(true)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Edit Notes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm text-muted-foreground">
                {projectData.roadmap && projectData.buildPlan
                  ? 'Roadmap and Build Plan available. Click "Edit Notes" to view and edit.'
                  : projectData.roadmap
                  ? 'Roadmap available. Click "Edit Notes" to view and edit.'
                  : 'Build Plan available. Click "Edit Notes" to view and edit.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Screenshots Section (if more than one screenshot) */}
      {screenshots.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>All Screenshots</CardTitle>
            <CardDescription>
              {screenshots.length} {screenshots.length === 1 ? 'screenshot' : 'screenshots'} available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {screenshots.map((url: string, index: number) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-48 object-cover rounded-md border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEMyNy41ODE3IDIwIDI0IDIzLjU4MTcgMjQgMjhDMjQgMzIuNDE4MyAyNy41ODE3IDM2IDMyIDM2QzM2LjQxODMgMzYgNDAgMzIuNDE4MyA0MCAyOEM0MCAyMy41ODE3IDM2LjQxODMgMjAgMzIgMjBaIiBmaWxsPSIjOUI5Q0E0Ii8+CjxwYXRoIGQ9Ik0xNiA0OEwxNiA0MEwyNCA0MEwyNCA0OEgxNloiIGZpbGw9IiM5QjlDQTQiLz4KPHBhdGggZD0iTTQwIDQ4TDQwIDQwTDQ4IDQwTDQ4IDQ4SDQwWiIgZmlsbD0iIzlCOUNBNCIvPgo8L3N2Zz4K';
                    }}
                  />
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                  >
                    <span className="text-white text-sm">View Full Size</span>
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Project Form */}
      <ProjectForm
        project={projectData}
        open={isEditFormOpen}
        onOpenChange={setIsEditFormOpen}
      />

      {/* Task Form Dialog */}
      <TaskFormDialog
        projectId={projectId}
        taskId={editingTaskId}
        open={isTaskFormOpen}
        onOpenChange={(open) => {
          setIsTaskFormOpen(open);
          if (!open) setEditingTaskId(null);
        }}
      />

      {/* Notebook Viewer */}
      <NotebookViewer
        open={isNotebookOpen}
        onOpenChange={setIsNotebookOpen}
        roadmap={projectData.roadmap || ''}
        buildPlan={projectData.buildPlan || ''}
        onSave={async (roadmap, buildPlan) => {
          await updateProject.mutateAsync({
            id: projectId,
            data: { roadmap, buildPlan },
          });
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{projectData.title}&quot;? This action cannot be undone
              and will also delete all associated tasks.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive &quot;{projectData.title}&quot;? You can unarchive it later
              by editing the project.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsArchiveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleArchive}>
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Task Confirmation Dialog */}
      <Dialog open={isDeleteTaskDialogOpen} onOpenChange={setIsDeleteTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteTaskDialogOpen(false);
                setTaskToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTask}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
