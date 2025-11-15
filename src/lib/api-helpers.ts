import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { z } from 'zod';

/**
 * Get the current session for API routes
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Check if user is authenticated, return 401 if not
 */
export async function requireAuth() {
  const session = await getSession();
  
  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized', issues: [] },
        { status: 401 }
      ),
      session: null,
    };
  }

  return { session, error: null };
}

/**
 * Create an error response
 */
export function errorResponse(
  message: string,
  status: number = 400,
  issues: string[] = []
) {
  return NextResponse.json(
    { error: message, issues },
    { status }
  );
}

/**
 * Create a success response
 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Validate request body with Zod schema
 */
export function validateBody<T extends z.ZodTypeAny>(
  body: unknown,
  schema: T
): { data: z.infer<T>; error: NextResponse | null } {
  const result = schema.safeParse(body);

  if (!result.success) {
    const issues = result.error.errors.map((err) => {
      const path = err.path.join('.');
      return path ? `${path}: ${err.message}` : err.message;
    });

    return {
      data: null as z.infer<T>,
      error: errorResponse('Validation failed', 400, issues),
    };
  }

  return { data: result.data, error: null };
}

/**
 * Validate query parameters with Zod schema
 */
export function validateQuery<T extends z.ZodTypeAny>(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
  schema: T
): { data: z.infer<T>; error: NextResponse | null } {
  // Convert URLSearchParams or Record to plain object
  const queryObj: Record<string, string | undefined> = {};
  
  if (params instanceof URLSearchParams) {
    params.forEach((value, key) => {
      queryObj[key] = value;
    });
  } else {
    Object.entries(params).forEach(([key, value]) => {
      queryObj[key] = Array.isArray(value) ? value[0] : value;
    });
  }

  const result = schema.safeParse(queryObj);

  if (!result.success) {
    const issues = result.error.errors.map((err) => {
      const path = err.path.join('.');
      return path ? `${path}: ${err.message}` : err.message;
    });

    return {
      data: null as z.infer<T>,
      error: errorResponse('Invalid query parameters', 400, issues),
    };
  }

  return { data: result.data, error: null };
}

