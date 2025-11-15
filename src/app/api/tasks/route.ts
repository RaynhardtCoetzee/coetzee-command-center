import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, errorResponse, successResponse, validateBody, validateQuery } from '@/lib/api-helpers';
import { createTaskSchema, taskQuerySchema } from '@/lib/validations/task';

/**
 * GET /api/tasks
 * Fetch tasks with optional filters (by project, status, priority)
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Auth check
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const { session } = authResult;

    // 2. Validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryResult = validateQuery(searchParams, taskQuerySchema);
    if (queryResult.error) return queryResult.error;
    const filters = queryResult.data;

    // 3. Query database
    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        ...(filters.projectId && { projectId: filters.projectId }),
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    // 4. Return response
    return successResponse(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return errorResponse('Failed to fetch tasks', 500);
  }
}

/**
 * POST /api/tasks
 * Create a new task
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const { session } = authResult;

    // 2. Validate request body
    const body = await request.json();
    const validationResult = validateBody(body, createTaskSchema);
    if (validationResult.error) return validationResult.error;
    const data = validationResult.data;

    // 3. Validate project exists and belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return errorResponse('Project not found or does not belong to you', 404);
    }

    // 4. Get the highest order value for this project to place new task at the end
    const lastTask = await prisma.task.findFirst({
      where: { projectId: data.projectId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const order = data.order ?? (lastTask ? lastTask.order + 1 : 0);

    // 5. Create task
    const task = await prisma.task.create({
      data: {
        ...data,
        order,
        userId: session.user.id,
      },
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
    return successResponse(task, 201);
  } catch (error) {
    console.error('Error creating task:', error);
    return errorResponse('Failed to create task', 500);
  }
}

