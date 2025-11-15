-- Add description column to Task table
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "description" TEXT;

