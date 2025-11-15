import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, errorResponse, successResponse, validateBody, validateQuery } from '@/lib/api-helpers';
import { createProjectSchema, projectQuerySchema } from '@/lib/validations/project';

/**
 * GET /api/projects
 * Fetch all user's projects with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Auth check
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const { session } = authResult;

    // 2. Validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryResult = validateQuery(searchParams, projectQuerySchema);
    if (queryResult.error) return queryResult.error;
    const filters = queryResult.data;

    // 3. Query database
    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.clientId && { clientId: filters.clientId }),
        ...(filters?.priority && { priority: filters.priority }),
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // 4. Parse JSON fields for each project
    const projectsWithParsedData = projects.map((project: any) => {
      const parsed = { ...project };
      
      // Parse screenshots
      if (parsed.screenshots && typeof parsed.screenshots === 'string') {
        try {
          parsed.screenshots = JSON.parse(parsed.screenshots);
        } catch {
          parsed.screenshots = null;
        }
      } else if (!parsed.screenshots) {
        parsed.screenshots = null;
      }
      
      // Parse techStack
      if (parsed.techStack && typeof parsed.techStack === 'string') {
        try {
          parsed.techStack = JSON.parse(parsed.techStack);
        } catch {
          parsed.techStack = null;
        }
      } else if (!parsed.techStack) {
        parsed.techStack = null;
      }
      
      return parsed;
    });

    // 5. Return response
    return successResponse(projectsWithParsedData);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return errorResponse('Failed to fetch projects', 500);
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const { session } = authResult;

    // 1.5. Verify user exists in database
    const userId = session.user.id;
    console.log('Session user ID:', userId);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      console.error('User not found in database:', userId);
      return errorResponse('User not found. Please log in again.', 401);
    }

    console.log('User verified:', user.email);

    // 2. Validate request body
    const body = await request.json();
    console.log('Received project data:', JSON.stringify(body, null, 2));
    
    const validationResult = validateBody(body, createProjectSchema);
    if (validationResult.error) {
      console.error('Validation failed:', validationResult.error);
      return validationResult.error;
    }
    const data = validationResult.data;
    console.log('Validated project data:', JSON.stringify(data, null, 2));

    // 3. Validate clientId if provided (ensure it belongs to user)
    if (data.clientId) {
      const client = await prisma.client.findFirst({
        where: {
          id: data.clientId,
          userId: user.id, // Use verified user ID
        },
      });

      if (!client) {
        return errorResponse('Client not found or does not belong to you', 404);
      }
    }

    // 4. Create project - build data object with only valid fields
    const projectData: any = {
      userId: user.id, // Use verified user ID from database
      title: data.title,
      description: data.description || null,
      roadmap: data.roadmap || null,
      buildPlan: data.buildPlan || null,
      status: data.status || 'planning',
      priority: data.priority || 'medium',
      progress: data.progress ?? 0,
      clientId: data.clientId || null,
    };
    
    // Handle screenshots - only set if array has items
    if (data.screenshots && Array.isArray(data.screenshots) && data.screenshots.length > 0) {
      projectData.screenshots = JSON.stringify(data.screenshots);
    } else {
      projectData.screenshots = null;
    }
    
    // Handle techStack - only set if array has items
    if (data.techStack && Array.isArray(data.techStack) && data.techStack.length > 0) {
      projectData.techStack = JSON.stringify(data.techStack);
    } else {
      projectData.techStack = null;
    }
    
    // Handle dates - convert to Date objects or set to null
    if (data.startDate) {
      projectData.startDate = new Date(data.startDate);
    } else {
      projectData.startDate = null;
    }
    
    if (data.dueDate) {
      projectData.dueDate = new Date(data.dueDate);
    } else {
      projectData.dueDate = null;
    }
    
    // Handle budget - convert to number or set to null
    if (data.budget !== undefined && data.budget !== null) {
      projectData.budget = typeof data.budget === 'number' ? data.budget : parseFloat(data.budget);
      if (isNaN(projectData.budget)) {
        projectData.budget = null;
      }
    } else {
      projectData.budget = null;
    }

    const project = await prisma.project.create({
      data: projectData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

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
    return successResponse(projectWithParsedData, 201);
  } catch (error: any) {
    console.error('Error creating project:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      cause: error?.cause,
    });
    
    // Return more detailed error message for debugging
    const errorMessage = error?.message || 'Failed to create project';
    const errorCode = error?.code || 'UNKNOWN_ERROR';
    
    return errorResponse(
      `${errorMessage} (Code: ${errorCode})`,
      500
    );
  }
}

