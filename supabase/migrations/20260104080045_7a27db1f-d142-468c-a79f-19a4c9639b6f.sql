-- Allow teachers to delete parents they can view
CREATE POLICY "Teachers can delete parents"
ON public.parents
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM teachers t
    WHERE t.user_id = auth.uid()
  )
);

-- Allow teachers to update parents
CREATE POLICY "Teachers can update parents"
ON public.parents
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM teachers t
    WHERE t.user_id = auth.uid()
  )
);

-- Allow teachers to view all parents (needed for linking)
CREATE POLICY "Teachers can view parents"
ON public.parents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM teachers t
    WHERE t.user_id = auth.uid()
  )
);

-- Allow teachers to manage student_parents links for students in their classes
CREATE POLICY "Teachers can insert student_parents"
ON public.student_parents
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM students s
    JOIN teacher_assignments ta ON ta.class_id = s.class_id
    JOIN teachers t ON t.id = ta.teacher_id
    WHERE s.id = student_parents.student_id AND t.user_id = auth.uid()
  )
);

CREATE POLICY "Teachers can delete student_parents"
ON public.student_parents
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM students s
    JOIN teacher_assignments ta ON ta.class_id = s.class_id
    JOIN teachers t ON t.id = ta.teacher_id
    WHERE s.id = student_parents.student_id AND t.user_id = auth.uid()
  )
);

-- Allow teachers to view all student_parents (for linking UI)
CREATE POLICY "Teachers can view student_parents"
ON public.student_parents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM teachers t
    WHERE t.user_id = auth.uid()
  )
);