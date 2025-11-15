import { useQuery } from '@tanstack/react-query';
import { clientsApi } from '@/lib/api-client';
import type { Client } from '@/types';

/**
 * Hook to fetch all clients
 */
export function useClients() {
  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: () => clientsApi.getAll(),
  });
}


