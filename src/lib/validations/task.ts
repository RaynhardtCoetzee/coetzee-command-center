import { z } from 'zod';

export const taskStatusSchema = z.enum(['todo', 'in_progress', 'review', 'done']);
export const prioritySchema = z.enum(['low', 'medium', 'high']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  projectId: z.string().cuid('Invalid project ID'),
  description: z.string().optional(),
  status: taskStatusSchema.default('todo'),
  priority: prioritySchema.default('medium'),
  order: z.number().int().min(0).default(0),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  status: taskStatusSchema.optional(),
  priority: prioritySchema.optional(),
  order: z.number().int().min(0).optional(),
});

export const taskQuerySchema = z.object({
  projectId: z.string().cuid().optional(),
  status: taskStatusSchema.optional(),
  priority: prioritySchema.optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;

