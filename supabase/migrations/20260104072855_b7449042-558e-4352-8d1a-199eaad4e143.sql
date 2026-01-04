-- Add residence_type, village_address, and parent_phone columns to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS residence_type text DEFAULT 'day_scholar',
ADD COLUMN IF NOT EXISTS village_address text,
ADD COLUMN IF NOT EXISTS parent_phone text;