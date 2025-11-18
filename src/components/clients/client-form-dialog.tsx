'use client';

import { ClientForm } from './client-form';
import type { Client } from '@/types';

interface ClientFormDialogProps {
  client?: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ClientFormDialog({ client, open, onOpenChange, onSuccess }: ClientFormDialogProps) {
  return (
    <ClientForm
      client={client}
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  );
}

