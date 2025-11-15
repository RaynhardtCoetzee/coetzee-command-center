import { z } from 'zod';

export const projectStatusSchema = z.enum(['planning', 'active', 'review', 'completed', 'archived']);
export const prioritySchema = z.enum(['low', 'medium', 'high']);

const baseProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(10000, 'Description must be less than 10000 characters').optional(),
  roadmap: z.string().max(50000, 'Roadmap must be less than 50000 characters').optional(),
  buildPlan: z.string().max(50000, 'Build plan must be less than 50000 characters').optional(),
  screenshots: z.array(z.string().min(1, 'Screenshot URL is required')).optional().or(z.literal(undefined)),
  techStack: z.array(z.string().min(1, 'Tech stack item cannot be empty')).optional().or(z.literal(undefined)),
  clientId: z.string().cuid().optional().nullable(),
  status: projectStatusSchema.default('planning'),
  priority: prioritySchema.default('medium'),
  progress: z.number().int().min(0).max(100).default(0),
  startDate: z.coerce.date().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
  budget: z.number().min(0, 'Budget must be non-negative').optional().nullable(),
});

export const createProjectSchema = baseProjectSchema.refine((data) => {
  // Due date must be after start date if both are provided
  if (data.startDate && data.dueDate && data.dueDate < data.startDate) {
    return false;
  }
  return true;
}, {
  message: 'Due date must be after start date',
  path: ['dueDate'],
});

export const updateProjectSchema = baseProjectSchema.partial().refine((data) => {
  // Due date must be after start date if both are provided
  if (data.startDate && data.dueDate && data.dueDate < data.startDate) {
    return false;
  }
  return true;
}, {
  message: 'Due date must be after start date',
  path: ['dueDate'],
});

export const projectQuerySchema = z.object({
  status: projectStatusSchema.optional(),
  clientId: z.string().cuid().optional(),
  priority: prioritySchema.optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectQueryInput = z.infer<typeof projectQuerySchema>;

