-- Add separate parent details table linked to students
CREATE TABLE IF NOT EXISTS public.student_parent_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  father_name TEXT NULL,
  mother_name TEXT NULL,
  occupation TEXT NULL,
  phone TEXT NULL,
  address TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id)
);

ALTER TABLE public.student_parent_details ENABLE ROW LEVEL SECURITY;

-- Generic updated_at trigger function (safe if already exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_student_parent_details_updated_at ON public.student_parent_details;
CREATE TRIGGER update_student_parent_details_updated_at
BEFORE UPDATE ON public.student_parent_details
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RLS policies
-- School admins: full access
DROP POLICY IF EXISTS "School admins can manage student parent details" ON public.student_parent_details;
CREATE POLICY "School admins can manage student parent details"
ON public.student_parent_details
FOR ALL
USING (has_role(auth.uid(), 'school_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'school_admin'::app_role));

-- Teachers: manage details for students in their classes
DROP POLICY IF EXISTS "Teachers can manage their class student parent details" ON public.student_parent_details;
CREATE POLICY "Teachers can manage their class student parent details"
ON public.student_parent_details
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.students s
    JOIN public.teacher_assignments ta ON ta.class_id = s.class_id
    JOIN public.teachers t ON t.id = ta.teacher_id
    WHERE s.id = student_parent_details.student_id
      AND t.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.students s
    JOIN public.teacher_assignments ta ON ta.class_id = s.class_id
    JOIN public.teachers t ON t.id = ta.teacher_id
    WHERE s.id = student_parent_details.student_id
      AND t.user_id = auth.uid()
  )
);

-- Students: view their own student parent details
DROP POLICY IF EXISTS "Students can view their own parent details" ON public.student_parent_details;
CREATE POLICY "Students can view their own parent details"
ON public.student_parent_details
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.students s
    WHERE s.id = student_parent_details.student_id
      AND s.user_id = auth.uid()
  )
);

-- Parents: view details for their linked children
DROP POLICY IF EXISTS "Parents can view their children parent details" ON public.student_parent_details;
CREATE POLICY "Parents can view their children parent details"
ON public.student_parent_details
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.student_parents sp
    JOIN public.parents p ON p.id = sp.parent_id
    WHERE sp.student_id = student_parent_details.student_id
      AND p.user_id = auth.uid()
  )
);

CREATE INDEX IF NOT EXISTS idx_student_parent_details_student_id ON public.student_parent_details(student_id);
