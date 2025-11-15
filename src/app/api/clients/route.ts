import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, errorResponse, successResponse } from '@/lib/api-helpers';

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
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // 3. Return response
    return successResponse(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return errorResponse('Failed to fetch clients', 500);
  }
}


