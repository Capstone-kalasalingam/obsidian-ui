-- Create academic_years table for lifecycle control
CREATE TABLE public.academic_years (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE, -- e.g., "2024-25"
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  admissions_open boolean DEFAULT false,
  attendance_locked boolean DEFAULT false,
  marks_locked boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  locked_at timestamp with time zone,
  locked_by uuid REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;

-- Anyone can view academic years
CREATE POLICY "Anyone can view academic years"
ON public.academic_years
FOR SELECT
USING (true);

-- Only school admins can manage academic years
CREATE POLICY "School admins can manage academic years"
ON public.academic_years
FOR ALL
USING (has_role(auth.uid(), 'school_admin'::app_role));

-- Add academic_year_id to students table for tracking which year they belong to
ALTER TABLE public.students 
ADD COLUMN academic_year_id uuid REFERENCES public.academic_years(id),
ADD COLUMN status text DEFAULT 'active' CHECK (status IN ('active', 'promoted', 'dropout', 'passed_out'));

-- Create trigger for updated_at
CREATE TRIGGER update_academic_years_updated_at
BEFORE UPDATE ON public.academic_years
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Ensure only one academic year can be active at a time
CREATE OR REPLACE FUNCTION public.ensure_single_active_year()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE public.academic_years SET is_active = false WHERE id != NEW.id AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER ensure_single_active_academic_year
BEFORE INSERT OR UPDATE ON public.academic_years
FOR EACH ROW
WHEN (NEW.is_active = true)
EXECUTE FUNCTION public.ensure_single_active_year();