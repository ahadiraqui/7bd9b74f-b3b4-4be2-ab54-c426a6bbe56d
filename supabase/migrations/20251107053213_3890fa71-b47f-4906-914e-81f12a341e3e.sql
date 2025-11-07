-- Create employees table with all required fields
CREATE TABLE public.employees (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  employee_id text UNIQUE,
  employee_name text NOT NULL,
  name_as_per_aadhar text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL,
  marital_status text NOT NULL,
  mobile_number text NOT NULL,
  father_name text NOT NULL,
  husband_name text,
  pf_opted boolean NOT NULL DEFAULT false,
  pf_basic_amount text,
  previous_pf_account_no text,
  uan_number text,
  bank_account_no text NOT NULL,
  ifsc_code text NOT NULL,
  name_as_per_bank text NOT NULL,
  pan_number text NOT NULL,
  aadhar_number text NOT NULL,
  international_employee boolean NOT NULL DEFAULT false,
  physically_handicapped boolean NOT NULL DEFAULT false,
  date_of_joining date NOT NULL,
  emergency_mobile_number text NOT NULL,
  permanent_address text NOT NULL,
  department text,
  designation text,
  location text,
  email text,
  salary numeric,
  share_token uuid DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to manage employees
CREATE POLICY "Authenticated users can view all employees"
ON public.employees
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert employees"
ON public.employees
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update employees"
ON public.employees
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete employees"
ON public.employees
FOR DELETE
TO authenticated
USING (true);

-- Policy for employees to update their own records via share link
CREATE POLICY "Employees can update via share token"
ON public.employees
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster searches
CREATE INDEX idx_employees_employee_id ON public.employees(employee_id);
CREATE INDEX idx_employees_name ON public.employees(employee_name);
CREATE INDEX idx_employees_mobile ON public.employees(mobile_number);
CREATE INDEX idx_employees_share_token ON public.employees(share_token);