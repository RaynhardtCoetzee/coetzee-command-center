'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddTaskButtonProps {
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  label?: string;
}

export function AddTaskButton({
  onClick,
  variant = 'default',
  size = 'default',
  className,
  label = 'Add Task',
}: AddTaskButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={onClick}
    >
      <Plus className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

