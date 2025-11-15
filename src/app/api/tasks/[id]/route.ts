import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, errorResponse, successResponse, validateBody } from '@/lib/api-helpers';
import { updateTaskSchema } from '@/lib/validations/task';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/tasks/[id]
 * Update task (status, order, priority, title)
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    // 1. Auth check
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const { session } = authResult;

    // 2. Get task ID from params
    const { id } = await context.params;

    // 3. Validate request body
    const body = await request.json();
    const validationResult = validateBody(body, updateTaskSchema);
    if (validationResult.error) return validationResult.error;
    const data = validationResult.data;

    // 4. Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingTask) {
      return errorResponse('Task not found', 404);
    }

    // 5. Update task
    const task = await prisma.task.update({
      where: { id },
      data,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    // 6. Return response
    return successResponse(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return errorResponse('Failed to update task', 500);
  }
}

/**
 * DELETE /api/tasks/[id]
 * Delete task
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // 1. Auth check
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const { session } = authResult;

    // 2. Get task ID from params
    const { id } = await context.params;

    // 3. Check if task exists and belongs to user
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!task) {
      return errorResponse('Task not found', 404);
    }

    // 4. Delete task
    await prisma.task.delete({
      where: { id },
    });

    // 5. Return response
    return successResponse({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return errorResponse('Failed to delete task', 500);
  }
}

