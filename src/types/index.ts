import type { Project, Client, Task, User } from '@prisma/client';

// Re-export Prisma types
export type { Project, Client, Task, User };

// Component type (will be added later when Component model is created)
export type Component = {
  id: string;
  name: string;
  description?: string | null;
  code?: string | null;
  category?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Extended types with relations
export type ProjectWithRelations = Project & {
  roadmap?: string | null;
  buildPlan?: string | null;
  screenshots?: string | string[] | null; // Can be JSON string or array
  techStack?: string | string[] | null; // Can be JSON string or array
  client: Client | null;
  tasks: Task[];
  _count?: {
    tasks: number;
  };
};

export type ClientWithRelations = Client & {
  projects: Project[];
  _count?: {
    projects: number;
  };
};

export type TaskWithProject = Task & {
  project: Project;
};

// Form data types
export type ProjectFormData = Omit<
  Project,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>;

export type ClientFormData = Omit<
  Client,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>;

export type TaskFormData = Omit<
  Task,
  'id' | 'userId' | 'projectId' | 'createdAt' | 'updatedAt'
>;

// Status types
export type ProjectStatus = 'planning' | 'active' | 'review' | 'completed' | 'archived';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high';

// UI types
export type Theme = 'light' | 'dark' | 'system';

export interface SearchResults {
  projects: Project[];
  clients: Client[];
  components: Component[];
  docs: any[];
}

