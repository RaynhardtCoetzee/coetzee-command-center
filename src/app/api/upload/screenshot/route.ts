import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { put } from '@vercel/blob';
import { requireAuth, errorResponse, successResponse } from '@/lib/api-helpers';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

/**
 * POST /api/upload/screenshot
 * Upload a screenshot image file
 * 
 * Uses Vercel Blob Storage in production, local filesystem in development.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const { session } = authResult;

    // 2. Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return errorResponse('No file provided', 400);
    }

    // 3. Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse(
        `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`,
        400
      );
    }

    // 4. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse(`File size too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`, 400);
    }

    // 5. Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `screenshots/${session.user.id}-${timestamp}-${randomString}.${fileExtension}`;

    // 6. Check if we're in production (Vercel)
    const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // Use Vercel Blob Storage in production
      const blob = await put(filename, file, {
        access: 'public',
        contentType: file.type,
      });

      return successResponse({ url: blob.url, filename: blob.pathname });
    } else {
      // Development: Use local filesystem
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'screenshots');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      const localFilename = filename.split('/').pop() || filename;
      const filepath = join(uploadsDir, localFilename);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Return file URL
      const fileUrl = `/uploads/screenshots/${localFilename}`;
      return successResponse({ url: fileUrl, filename: localFilename });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return errorResponse('Failed to upload file', 500);
  }
}


