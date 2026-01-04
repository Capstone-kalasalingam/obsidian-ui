-- Add policy for teachers to delete students in their assigned classes
CREATE POLICY "Teachers can delete students in their classes"
ON public.students
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM teacher_assignments ta
    JOIN teachers t ON t.id = ta.teacher_id
    WHERE t.user_id = auth.uid()
    AND ta.class_id = students.class_id
  )
);