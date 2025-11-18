import { z } from 'zod';

export const clientStatusSchema = z.enum(['active', 'inactive', 'archived']);

const baseClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  email: z.string().email('Invalid email format').optional().nullable(),
  phone: z.string().max(50, 'Phone must be less than 50 characters').optional().nullable(),
  status: clientStatusSchema.default('active'),
});

export const createClientSchema = baseClientSchema;

export const updateClientSchema = baseClientSchema.partial();

export const clientQuerySchema = z.object({
  status: clientStatusSchema.optional(),
  search: z.string().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type ClientQueryInput = z.infer<typeof clientQuerySchema>;

