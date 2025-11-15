'use client';

import { ProjectForm } from './project-form';
import type { ProjectWithRelations } from '@/types';

interface EditProjectDialogProps {
  project: ProjectWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onSuccess,
}: EditProjectDialogProps) {
  return (
    <ProjectForm
      project={project}
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  );
}


