'use client';

import { useState } from 'react';
import { ClientCard } from './client-card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Building2, FilterX } from 'lucide-react';
import { useClients, useDeleteClient } from '@/hooks/use-clients';
import type { Client } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

type ViewMode = 'grid' | 'list';

interface ClientListProps {
  viewMode?: ViewMode;
  onEditClient: (client: Client) => void;
}

export function ClientList({ viewMode = 'grid', onEditClient }: ClientListProps) {
  const { data: clients, isLoading, error } = useClients();
  const deleteClient = useDeleteClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      deleteClient.mutate(clientToDelete.id);
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-4'
        }
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <FilterX className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Failed to load clients</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          {error.message || 'An error occurred while loading clients. Please try again.'}
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Get started by creating your first client. Clients help you organize and track your business relationships.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-4'
        }
      >
        {clients.map((client: Client) => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={onEditClient}
            onDelete={() => handleDeleteClick(client)}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{clientToDelete?.name}&quot;? This action
              cannot be undone. Projects linked to this client will have their client association removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setClientToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

