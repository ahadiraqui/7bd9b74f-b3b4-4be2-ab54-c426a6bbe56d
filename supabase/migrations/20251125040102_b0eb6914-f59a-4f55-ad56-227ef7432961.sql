-- Add new fields to employees table
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active',
ADD COLUMN IF NOT EXISTS work_mode TEXT,
ADD COLUMN IF NOT EXISTS highest_qualification TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_person_name TEXT,
ADD COLUMN IF NOT EXISTS current_location TEXT;

-- Update employee_name to be nullable since we'll use first_name + last_name
ALTER TABLE public.employees 
ALTER COLUMN employee_name DROP NOT NULL;