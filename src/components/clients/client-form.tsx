'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useCreateClient, useUpdateClient } from '@/hooks/use-clients';
import { createClientSchema, updateClientSchema } from '@/lib/validations/client';
import type { CreateClientInput, UpdateClientInput } from '@/lib/validations/client';
import type { Client } from '@/types';

interface ClientFormProps {
  client?: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ClientForm({ client, open, onOpenChange, onSuccess }: ClientFormProps) {
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const isEditing = !!client;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateClientInput>({
    resolver: zodResolver(isEditing ? updateClientSchema : createClientSchema),
    defaultValues: {
      name: '',
      email: null,
      phone: null,
      status: 'active',
    },
  });

  const status = watch('status');

  useEffect(() => {
    if (client && open) {
      reset({
        name: client.name,
        email: client.email || null,
        phone: client.phone || null,
        status: (client.status || 'active') as 'active' | 'inactive' | 'archived',
      });
    } else if (open) {
      reset({
        name: '',
        email: null,
        phone: null,
        status: 'active',
      });
    }
  }, [client, reset, open]);

  const onSubmit = async (data: CreateClientInput | UpdateClientInput) => {
    try {
      const submitData: any = {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        status: data.status || 'active',
      };

      if (isEditing && client) {
        await updateClient.mutateAsync({ id: client.id, data: submitData });
      } else {
        await createClient.mutateAsync(submitData);
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

  const isLoading = createClient.isPending || updateClient.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Client' : 'Create New Client'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update client information. Changes will be saved immediately.'
              : 'Add a new client to your system. You can link projects to clients later.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Client name"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="client@example.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="+1 (555) 123-4567"
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setValue('status', value as 'active' | 'inactive' | 'archived')}
              disabled={isLoading}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update Client' : 'Create Client'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

