import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, errorResponse, successResponse, validateBody } from '@/lib/api-helpers';
import { updateClientSchema } from '@/lib/validations/client';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/clients/[id]
 * Fetch single client with projects
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    // 1. Auth check
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const { session } = authResult;

    // 2. Get client ID from params
    const { id } = await context.params;

    // 3. Query database
    const client = await prisma.client.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        projects: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            progress: true,
            dueDate: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
        },
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    // 4. Check if client exists
    if (!client) {
      return errorResponse('Client not found', 404);
    }

    // 5. Return response
    return successResponse(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return errorResponse('Failed to fetch client', 500);
  }
}

/**
 * PATCH /api/clients/[id]
 * Update client
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    // 1. Auth check
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const { session } = authResult;

    // 2. Get client ID from params
    const { id } = await context.params;

    // 3. Validate request body
    const body = await request.json();
    const validationResult = validateBody(body, updateClientSchema);
    if (validationResult.error) return validationResult.error;
    const data = validationResult.data;

    // 4. Check if client exists and belongs to user
    const existingClient = await prisma.client.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingClient) {
      return errorResponse('Client not found', 404);
    }

    // 5. Update client
    const client = await prisma.client.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        email: data.email !== undefined ? data.email : undefined,
        phone: data.phone !== undefined ? data.phone : undefined,
        status: data.status,
      },
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    // 6. Return response
    return successResponse(client);
  } catch (error: any) {
    console.error('Error updating client:', error);
    
    // Handle unique constraint violations
    if (error?.code === 'P2002') {
      return errorResponse('A client with this email already exists', 409);
    }
    
    return errorResponse('Failed to update client', 500);
  }
}

/**
 * DELETE /api/clients/[id]
 * Delete client
 */
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    // 1. Auth check
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const { session } = authResult;

    // 2. Get client ID from params
    const { id } = await context.params;

    // 3. Check if client exists and belongs to user
    const existingClient = await prisma.client.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    if (!existingClient) {
      return errorResponse('Client not found', 404);
    }

    // 4. Check if client has projects (optional: warn user)
    if (existingClient._count.projects > 0) {
      // Note: Projects will have clientId set to null due to onDelete: SetNull
      // We could return an error here if we want to prevent deletion, but
      // the current schema allows it, so we'll proceed
    }

    // 5. Delete client
    await prisma.client.delete({
      where: {
        id,
      },
    });

    // 6. Return success response
    return successResponse({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return errorResponse('Failed to delete client', 500);
  }
}

