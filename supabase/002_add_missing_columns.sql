-- Migration: Add missing columns to job_applications
-- Run this in Supabase SQL Editor if you get schema cache errors

-- Add location column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'job_applications'
      AND column_name = 'location'
  ) THEN
    ALTER TABLE public.job_applications ADD COLUMN location text;
  END IF;
END $$;

-- Add salary_range column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'job_applications'
      AND column_name = 'salary_range'
  ) THEN
    ALTER TABLE public.job_applications ADD COLUMN salary_range text;
  END IF;
END $$;

-- Add recruiter_name column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'job_applications'
      AND column_name = 'recruiter_name'
  ) THEN
    ALTER TABLE public.job_applications ADD COLUMN recruiter_name text;
  END IF;
END $$;

-- Add recruiter_contact column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'job_applications'
      AND column_name = 'recruiter_contact'
  ) THEN
    ALTER TABLE public.job_applications ADD COLUMN recruiter_contact text;
  END IF;
END $$;

-- Add follow_up_date column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'job_applications'
      AND column_name = 'follow_up_date'
  ) THEN
    ALTER TABLE public.job_applications ADD COLUMN follow_up_date date;
  END IF;
END $$;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
