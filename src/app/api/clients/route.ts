import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, errorResponse, successResponse, validateBody } from '@/lib/api-helpers';
import { createClientSchema } from '@/lib/validations/client';

// Mark this route as dynamic since it uses authentication
export const dynamic = 'force-dynamic';

/**
 * GET /api/clients
 * Fetch all user's clients
 */
export async function GET(_request: NextRequest) {
  try {
    // 1. Auth check
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const { session } = authResult;

    // 2. Query database
    const clients = await prisma.client.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    // 3. Return response
    return successResponse(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return errorResponse('Failed to fetch clients', 500);
  }
}

/**
 * POST /api/clients
 * Create a new client
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const { session } = authResult;

    // 2. Validate request body
    const body = await request.json();
    const validationResult = validateBody(body, createClientSchema);
    if (validationResult.error) return validationResult.error;
    const data = validationResult.data;

    // 3. Create client
    const client = await prisma.client.create({
      data: {
        userId: session.user.id,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        status: data.status || 'active',
      },
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    // 4. Return response
    return successResponse(client, 201);
  } catch (error: any) {
    console.error('Error creating client:', error);
    
    // Handle unique constraint violations
    if (error?.code === 'P2002') {
      return errorResponse('A client with this email already exists', 409);
    }
    
    return errorResponse('Failed to create client', 500);
  }
}


