import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, errorResponse, successResponse, validateBody } from '@/lib/api-helpers';
import { updateProjectSchema } from '@/lib/validations/project';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/projects/[id]
 * Fetch single project with tasks and client
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // 1. Auth check
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const { session } = authResult;

    // 2. Get project ID from params
    const { id } = await context.params;

    // 3. Query database
    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
          },
        },
        tasks: {
          orderBy: [
            { order: 'asc' },
            { createdAt: 'asc' },
          ],
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    // 4. Check if project exists
    if (!project) {
      return errorResponse('Project not found', 404);
    }

    // 5. Parse JSON fields
    const projectWithParsedData: any = {
      ...project,
    };
    
    // Parse screenshots
    if (projectWithParsedData.screenshots && typeof projectWithParsedData.screenshots === 'string') {
      try {
        projectWithParsedData.screenshots = JSON.parse(projectWithParsedData.screenshots);
      } catch {
        projectWithParsedData.screenshots = null;
      }
    } else if (!projectWithParsedData.screenshots) {
      projectWithParsedData.screenshots = null;
    }
    
    // Parse techStack
    if (projectWithParsedData.techStack && typeof projectWithParsedData.techStack === 'string') {
      try {
        projectWithParsedData.techStack = JSON.parse(projectWithParsedData.techStack);
      } catch {
        projectWithParsedData.techStack = null;
      }
    } else if (!projectWithParsedData.techStack) {
      projectWithParsedData.techStack = null;
    }

    // 6. Return response
    return successResponse(projectWithParsedData);
  } catch (error) {
    console.error('Error fetching project:', error);
    return errorResponse('Failed to fetch project', 500);
  }
}

/**
 * PATCH /api/projects/[id]
 * Update project
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    // 1. Auth check
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const { session } = authResult;

    // 2. Get project ID from params
    const { id } = await context.params;

    // 3. Validate request body
    const body = await request.json();
    const validationResult = validateBody(body, updateProjectSchema);
    if (validationResult.error) return validationResult.error;
    const data = validationResult.data;

    // 4. Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingProject) {
      return errorResponse('Project not found', 404);
    }

    // 5. Validate clientId if provided
    if (data.clientId !== undefined && data.clientId !== null) {
      const client = await prisma.client.findFirst({
        where: {
          id: data.clientId,
          userId: session.user.id,
        },
      });

      if (!client) {
        return errorResponse('Client not found or does not belong to you', 404);
      }
    }

    // 6. Update project
    const updateData: any = { ...data };
    
    // Handle screenshots
    if (updateData.screenshots !== undefined) {
      updateData.screenshots = updateData.screenshots && updateData.screenshots.length > 0
        ? JSON.stringify(updateData.screenshots)
        : null;
    }
    
    // Handle techStack
    if (updateData.techStack !== undefined) {
      updateData.techStack = updateData.techStack && updateData.techStack.length > 0
        ? JSON.stringify(updateData.techStack)
        : null;
    }
    
    // Handle dates
    if (updateData.startDate !== undefined) {
      updateData.startDate = updateData.startDate ? new Date(updateData.startDate) : null;
    }
    if (updateData.dueDate !== undefined) {
      updateData.dueDate = updateData.dueDate ? new Date(updateData.dueDate) : null;
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tasks: {
          orderBy: [
            { order: 'asc' },
            { createdAt: 'asc' },
          ],
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    // 7. Parse JSON fields
    const projectWithParsedData: any = {
      ...project,
    };
    
    // Parse screenshots
    if (projectWithParsedData.screenshots && typeof projectWithParsedData.screenshots === 'string') {
      try {
        projectWithParsedData.screenshots = JSON.parse(projectWithParsedData.screenshots);
      } catch {
        projectWithParsedData.screenshots = null;
      }
    } else if (!projectWithParsedData.screenshots) {
      projectWithParsedData.screenshots = null;
    }
    
    // Parse techStack
    if (projectWithParsedData.techStack && typeof projectWithParsedData.techStack === 'string') {
      try {
        projectWithParsedData.techStack = JSON.parse(projectWithParsedData.techStack);
      } catch {
        projectWithParsedData.techStack = null;
      }
    } else if (!projectWithParsedData.techStack) {
      projectWithParsedData.techStack = null;
    }

    // 8. Return response
    return successResponse(projectWithParsedData);
  } catch (error) {
    console.error('Error updating project:', error);
    return errorResponse('Failed to update project', 500);
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete project
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // 1. Auth check
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const { session } = authResult;

    // 2. Get project ID from params
    const { id } = await context.params;

    // 3. Check if project exists and belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!project) {
      return errorResponse('Project not found', 404);
    }

    // 4. Delete project (tasks will be cascade deleted)
    await prisma.project.delete({
      where: { id },
    });

    // 5. Return response
    return successResponse({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return errorResponse('Failed to delete project', 500);
  }
}

