-- Ensure roll number is unique within a class (when provided)
ALTER TABLE public.students
  DROP CONSTRAINT IF EXISTS students_class_roll_unique;
ALTER TABLE public.students
  ADD CONSTRAINT students_class_roll_unique UNIQUE (class_id, roll_number);

-- Allow teachers to view student profiles for students in their assigned classes
DROP POLICY IF EXISTS "Teachers can view student profiles" ON public.profiles;
CREATE POLICY "Teachers can view student profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.students s
    JOIN public.teacher_assignments ta ON ta.class_id = s.class_id
    JOIN public.teachers t ON t.id = ta.teacher_id
    WHERE s.user_id = profiles.id
      AND t.user_id = auth.uid()
  )
);