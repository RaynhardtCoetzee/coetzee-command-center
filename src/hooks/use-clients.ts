'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';
import type { Client, ClientWithRelations } from '@/types';

type CreateClientData = {
  name: string;
  email?: string | null;
  phone?: string | null;
  status?: 'active' | 'inactive' | 'archived';
};

type UpdateClientData = Partial<CreateClientData>;

/**
 * Hook to fetch all clients
 */
export function useClients() {
  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: () => clientsApi.getAll(),
  });
}

/**
 * Fetch single client by ID
 */
export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => {
      if (!id) throw new Error('Client ID is required');
      return clientsApi.getById(id);
    },
    enabled: !!id,
  });
}

/**
 * Create a new client
 */
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation<
    Client,
    Error,
    CreateClientData,
    { previousClients?: Client[] }
  >({
    mutationFn: (data: CreateClientData) => clientsApi.create(data) as Promise<Client>,
    onMutate: async (newClient) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['clients'] });

      // Snapshot previous value
      const previousClients = queryClient.getQueryData<Client[]>(['clients']);

      // Optimistically update cache
      queryClient.setQueryData(['clients'], (old: Client[] | undefined) => {
        const optimisticClient = {
          id: `temp-${Date.now()}`,
          name: newClient.name,
          email: newClient.email ?? null,
          phone: newClient.phone ?? null,
          status: newClient.status ?? 'active',
          userId: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Client;
        return old ? [optimisticClient, ...old] : [optimisticClient];
      });

      return { previousClients: previousClients ?? undefined };
    },
    onError: (error: Error, _newClient, context?: { previousClients?: Client[] }) => {
      // Rollback on error
      if (context?.previousClients) {
        queryClient.setQueryData(['clients'], context.previousClients);
      }
      toast({
        title: 'Failed to create client',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: 'Client created',
        description: 'Your client has been created successfully.',
      });
    },
  });
}

/**
 * Update a client
 */
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation<
    Client,
    Error,
    { id: string; data: UpdateClientData },
    { previousClients?: Client[]; previousClient?: ClientWithRelations }
  >({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientData }) =>
      clientsApi.update(id, data) as Promise<Client>,
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['clients'] });
      await queryClient.cancelQueries({ queryKey: ['clients', id] });

      // Snapshot previous values
      const previousClients = queryClient.getQueryData<Client[]>(['clients']);
      const previousClient = queryClient.getQueryData<ClientWithRelations>(['clients', id]);

      // Optimistically update cache
      queryClient.setQueryData(['clients'], (old: Client[] | undefined) => {
        if (!old) return old;
        return old.map((client) =>
          client.id === id ? { ...client, ...data, updatedAt: new Date() } : client
        );
      });

      queryClient.setQueryData(['clients', id], (old: ClientWithRelations | undefined) => {
        if (!old) return old;
        return { ...old, ...data, updatedAt: new Date() };
      });

      return { previousClients: previousClients ?? undefined, previousClient: previousClient ?? undefined };
    },
    onError: (error: Error, variables, context?: { previousClients?: Client[]; previousClient?: ClientWithRelations }) => {
      // Rollback on error
      if (context?.previousClients) {
        queryClient.setQueryData(['clients'], context.previousClients);
      }
      if (context?.previousClient) {
        queryClient.setQueryData(['clients', variables.id], context.previousClient);
      }
      toast({
        title: 'Failed to update client',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', variables.id] });
      toast({
        title: 'Client updated',
        description: 'Your client has been updated successfully.',
      });
    },
  });
}

/**
 * Delete a client
 */
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    string,
    { previousClients?: Client[] }
  >({
    mutationFn: (id: string) => clientsApi.delete(id) as Promise<void>,
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['clients'] });

      // Snapshot previous value
      const previousClients = queryClient.getQueryData<Client[]>(['clients']);

      // Optimistically update cache
      queryClient.setQueryData(['clients'], (old: Client[] | undefined) => {
        if (!old) return old;
        return old.filter((client) => client.id !== id);
      });

      return { previousClients: previousClients ?? undefined };
    },
    onError: (error: Error, _id, context?: { previousClients?: Client[] }) => {
      // Rollback on error
      if (context?.previousClients) {
        queryClient.setQueryData(['clients'], context.previousClients);
      }
      toast({
        title: 'Failed to delete client',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: 'Client deleted',
        description: 'Your client has been deleted successfully.',
      });
    },
  });
}


