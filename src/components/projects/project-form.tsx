'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useCreateProject, useUpdateProject } from '@/hooks/use-projects';
import { useClients } from '@/hooks/use-clients';
import { createProjectSchema } from '@/lib/validations/project';
import type { CreateProjectInput } from '@/lib/validations/project';
import type { ProjectWithRelations } from '@/types';
import { DatePicker } from '@/components/ui/date-picker';
import { TagsInput } from '@/components/ui/tags-input';
import { useToast } from '@/hooks/use-toast';

interface ProjectFormProps {
  project?: ProjectWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ProjectForm({ project, open, onOpenChange, onSuccess }: ProjectFormProps) {
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { toast } = useToast();
  const isEditing = !!project;
  
  // Ensure clients is an array
  const clientsArray = Array.isArray(clients) ? clients : [];

  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [techStack, setTechStack] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: '',
      description: '',
      roadmap: '',
      buildPlan: '',
      screenshots: [],
      techStack: [],
      status: 'planning',
      priority: 'medium',
      progress: 0,
      clientId: null,
      startDate: null,
      dueDate: null,
      budget: null,
    },
  });

  const status = watch('status');
  const priority = watch('priority');
  const clientId = watch('clientId');
  const startDate = watch('startDate');
  const dueDate = watch('dueDate');

  useEffect(() => {
    if (project) {
      const screenshotsArray = project.screenshots
        ? typeof project.screenshots === 'string'
          ? JSON.parse(project.screenshots)
          : project.screenshots
        : [];
      
      const techStackArray = project.techStack
        ? typeof project.techStack === 'string'
          ? JSON.parse(project.techStack)
          : project.techStack
        : [];
      
      setScreenshots(screenshotsArray);
      setTechStack(techStackArray);
      
      reset({
        title: project.title,
        description: project.description || '',
        roadmap: project.roadmap || '',
        buildPlan: project.buildPlan || '',
        screenshots: screenshotsArray,
        techStack: techStackArray,
        status: project.status as any,
        priority: project.priority as any,
        progress: project.progress,
        clientId: project.clientId || null,
        startDate: project.startDate ? new Date(project.startDate) : null,
        dueDate: project.dueDate ? new Date(project.dueDate) : null,
        budget: project.budget || null,
      });
    } else {
      setScreenshots([]);
      setTechStack([]);
      reset({
        title: '',
        description: '',
        roadmap: '',
        buildPlan: '',
        screenshots: [],
        techStack: [],
        status: 'planning',
        priority: 'medium',
        progress: 0,
        clientId: null,
        startDate: null,
        dueDate: null,
        budget: null,
      });
    }
  }, [project, reset, open]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const fileArray = Array.from(files);
    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    // Upload files sequentially to avoid overwhelming the server
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          errors.push(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          errors.push(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        // Create form data
        const formData = new FormData();
        formData.append('file', file);

        // Upload file
        const response = await fetch('/api/upload/screenshot', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({ error: 'Upload failed' }));
          errors.push(`${file.name}: ${error.error || 'Upload failed'}`);
          continue;
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        errors.push(`${file.name}: ${error instanceof Error ? error.message : 'Upload failed'}`);
      }
    }

    // Update screenshots with successfully uploaded files
    if (uploadedUrls.length > 0) {
      const newScreenshots = [...screenshots, ...uploadedUrls];
      setScreenshots(newScreenshots);
      setValue('screenshots', newScreenshots);
      toast({
        title: 'Upload successful',
        description: `${uploadedUrls.length} screenshot(s) uploaded successfully.`,
      });
    }

    // Show errors if any
    if (errors.length > 0) {
      toast({
        title: 'Upload errors',
        description: errors.join(', '),
        variant: 'destructive',
      });
    }

    setUploading(false);
  };

  const handleRemoveScreenshot = (index: number) => {
    const newScreenshots = screenshots.filter((_, i) => i !== index);
    setScreenshots(newScreenshots);
    setValue('screenshots', newScreenshots);
  };

  const handleTechStackChange = (tags: string[]) => {
    setTechStack(tags);
    setValue('techStack', tags);
  };

  const onSubmit = async (data: CreateProjectInput) => {
    try {
      // Build submit data with only defined values
      const submitData: any = {
        title: data.title,
        description: data.description || undefined,
        roadmap: data.roadmap || undefined,
        buildPlan: data.buildPlan || undefined,
        status: data.status || 'planning',
        priority: data.priority || 'medium',
        progress: data.progress ?? 0,
        clientId: data.clientId || null,
      };
      
      // Only include screenshots if array has items
      if (screenshots && screenshots.length > 0) {
        submitData.screenshots = screenshots;
      }
      
      // Only include techStack if array has items
      if (techStack && techStack.length > 0) {
        submitData.techStack = techStack;
      }
      
      // Handle dates - convert to ISO string or set to null
      if (data.startDate) {
        submitData.startDate = data.startDate instanceof Date 
          ? data.startDate.toISOString() 
          : data.startDate;
      } else {
        submitData.startDate = null;
      }
      
      if (data.dueDate) {
        submitData.dueDate = data.dueDate instanceof Date 
          ? data.dueDate.toISOString() 
          : data.dueDate;
      } else {
        submitData.dueDate = null;
      }
      
      // Handle budget - only include if provided
      if (data.budget !== undefined && data.budget !== null) {
        submitData.budget = typeof data.budget === 'number' ? data.budget : parseFloat(String(data.budget));
        if (isNaN(submitData.budget)) {
          submitData.budget = null;
        }
      } else {
        submitData.budget = null;
      }
      
      console.log('Submitting project data:', submitData);
      
      if (isEditing) {
        await updateProject.mutateAsync({ id: project.id, data: submitData });
      } else {
        await createProject.mutateAsync(submitData);
      }
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled by the hook
      console.error('Form submission error:', error);
    }
  };

  const isLoading = createProject.isPending || updateProject.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Project' : 'Create New Project'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your project details below.'
              : 'Fill in the details to create a new project.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Project title"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Project description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Client Selector */}
          <div className="space-y-2">
            <Label htmlFor="clientId">Client</Label>
            <Select
              value={clientId || 'none'}
              onValueChange={(value) => setValue('clientId', value === 'none' ? null : value, { shouldValidate: true })}
              disabled={isLoading || clientsLoading}
            >
              <SelectTrigger id="clientId">
                <SelectValue placeholder="Select a client (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No client</SelectItem>
                {clientsArray.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && (
              <p className="text-sm text-destructive">{errors.clientId.message}</p>
            )}
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setValue('status', value as any)}
                disabled={isLoading}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => setValue('priority', value as any)}
                disabled={isLoading}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Start Date and Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <DatePicker
                date={startDate ? (typeof startDate === 'string' ? new Date(startDate) : startDate) : null}
                onSelect={(date) => setValue('startDate', date || null, { shouldValidate: true })}
                disabled={isLoading}
                placeholder="Select start date"
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <DatePicker
                date={dueDate ? (typeof dueDate === 'string' ? new Date(dueDate) : dueDate) : null}
                onSelect={(date) => setValue('dueDate', date || null, { shouldValidate: true })}
                disabled={isLoading}
                placeholder="Select due date"
              />
              {errors.dueDate && (
                <p className="text-sm text-destructive">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          {/* Budget and Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...register('budget', { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.budget && (
                <p className="text-sm text-destructive">{errors.budget.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                {...register('progress', { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.progress && (
                <p className="text-sm text-destructive">{errors.progress.message}</p>
              )}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <Label htmlFor="techStack">Tech Stack</Label>
            <TagsInput
              tags={techStack}
              onTagsChange={handleTechStackChange}
              placeholder="Add technology (e.g., React, TypeScript)"
              disabled={isLoading}
            />
            {errors.techStack && (
              <p className="text-sm text-destructive">
                {errors.techStack.message}
              </p>
            )}
          </div>

          {/* Roadmap */}
          <div className="space-y-2">
            <Label htmlFor="roadmap">Roadmap</Label>
            <textarea
              id="roadmap"
              {...register('roadmap')}
              placeholder="Enter your project roadmap (supports markdown)"
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-y"
              disabled={isLoading}
            />
            {errors.roadmap && (
              <p className="text-sm text-destructive">{errors.roadmap.message}</p>
            )}
          </div>

          {/* Build Plan */}
          <div className="space-y-2">
            <Label htmlFor="buildPlan">Build Plan</Label>
            <textarea
              id="buildPlan"
              {...register('buildPlan')}
              placeholder="Enter your build plan (supports markdown)"
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-y"
              disabled={isLoading}
            />
            {errors.buildPlan && (
              <p className="text-sm text-destructive">{errors.buildPlan.message}</p>
            )}
          </div>

          {/* Screenshots */}
          <div className="space-y-2">
            <Label htmlFor="screenshots">Screenshots</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="file"
                  id="screenshots"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  disabled={isLoading || uploading}
                  className="flex-1 cursor-pointer"
                />
                {uploading && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    Uploading...
                  </div>
                )}
              </div>
              {screenshots.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {screenshots.map((url, index) => (
                    <div
                      key={index}
                      className="relative group border rounded-md overflow-hidden"
                    >
                      <img
                        src={url}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEMyNy41ODE3IDIwIDI0IDIzLjU4MTcgMjQgMjhDMjQgMzIuNDE4MyAyNy41ODE3IDM2IDMyIDM2QzM2LjQxODMgMzYgNDAgMzIuNDE4MyA0MCAyOEM0MCAyMy41ODE3IDM2LjQxODMgMjAgMzIgMjBaIiBmaWxsPSIjOUI5Q0E0Ii8+CjxwYXRoIGQ9Ik0xNiA0OEwxNiA0MEwyNCA0MEwyNCA0OEgxNloiIGZpbGw9IiM5QjlDQTQiLz4KPHBhdGggZD0iTTQwIDQ4TDQwIDQwTDQ4IDQwTDQ4IDQ4SDQwWiIgZmlsbD0iIzlCOUNBNCIvPgo8L3N2Zz4K';
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveScreenshot(index)}
                        disabled={isLoading}
                        className="absolute top-1 right-1 h-6 w-6 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove screenshot</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Upload image files (JPG, PNG, WebP, GIF). Maximum file size: 5MB per image.
              </p>
            </div>
            {errors.screenshots && (
              <p className="text-sm text-destructive">
                {errors.screenshots.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? isEditing
                  ? 'Updating...'
                  : 'Creating...'
                : isEditing
                  ? 'Update Project'
                  : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
