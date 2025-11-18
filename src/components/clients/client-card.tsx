'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Building2, Mail, Phone } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Client } from '@/types';

interface ClientCardProps {
  client: Client & {
    _count?: {
      projects: number;
    };
  };
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  archived: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
};

export function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  const statusColor = statusColors[client.status] || statusColors.active;
  const projectCount = client._count?.projects || 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group h-full flex flex-col overflow-hidden">
      <Link href={`/clients/${client.id}`} className="flex flex-col flex-1 min-h-0">
        <CardHeader className="pb-2 sm:pb-3 flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                <CardTitle className="text-sm sm:text-base md:text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {client.name}
                </CardTitle>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(client);
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(client.id);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6 flex-1 flex flex-col justify-between min-h-0">
          <div className="space-y-2 sm:space-y-3">
            {/* Status Badge */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <Badge className={`${statusColor} text-xs px-2 py-0.5`} variant="default">
                {client.status}
              </Badge>
            </div>

            {/* Contact Information */}
            <div className="space-y-1.5 sm:space-y-2">
              {client.email && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{client.phone}</span>
                </div>
              )}
              {!client.email && !client.phone && (
                <div className="text-xs sm:text-sm text-muted-foreground italic">
                  No contact information
                </div>
              )}
            </div>
          </div>

          {/* Project Count and Last Updated */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground pt-2 sm:pt-3 border-t mt-auto">
            <div className="truncate">
              {projectCount} {projectCount === 1 ? 'project' : 'projects'}
            </div>
            <div className="truncate sm:text-right text-xs">
              {formatDate(client.updatedAt)}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

