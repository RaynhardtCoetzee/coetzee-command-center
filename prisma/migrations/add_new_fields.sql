-- Migration to add new fields to Project table
-- Run this manually if migrations are having issues

-- Add new fields if they don't exist
ALTER TABLE "Project" 
ADD COLUMN IF NOT EXISTS "techStack" TEXT,
ADD COLUMN IF NOT EXISTS "startDate" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "dueDate" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "budget" DOUBLE PRECISION;

-- Add index on dueDate if it doesn't exist
CREATE INDEX IF NOT EXISTS "Project_dueDate_idx" ON "Project"("dueDate");


