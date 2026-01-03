-- Create classes table (grade + section)
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- e.g., "Class 1", "Class 2"
  section TEXT NOT NULL, -- e.g., "A", "B", "C"
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(name, section)
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create class_subjects (which subjects are taught in which class)
CREATE TABLE public.class_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(class_id, subject_id)
);

-- Create students table (links user profile to a class)
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE RESTRICT,
  roll_number TEXT,
  admission_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create teachers table (links user profile as teacher)
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  employee_id TEXT UNIQUE,
  qualification TEXT,
  joining_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create teacher_assignments (teacher ↔ subject ↔ class mapping)
CREATE TABLE public.teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  is_class_teacher BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(teacher_id, class_id, subject_id)
);

-- Create parents table (links user profile as parent)
CREATE TABLE public.parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  occupation TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create student_parents (many-to-many: one student can have multiple parents)
CREATE TABLE public.student_parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
  relationship TEXT, -- e.g., "Father", "Mother", "Guardian"
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, parent_id)
);

-- Enable RLS on all tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_parents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for classes (viewable by all authenticated, managed by admin)
CREATE POLICY "Anyone can view classes" ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "School admins can manage classes" ON public.classes FOR ALL USING (has_role(auth.uid(), 'school_admin'));

-- RLS Policies for subjects
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "School admins can manage subjects" ON public.subjects FOR ALL USING (has_role(auth.uid(), 'school_admin'));

-- RLS Policies for class_subjects
CREATE POLICY "Anyone can view class_subjects" ON public.class_subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "School admins can manage class_subjects" ON public.class_subjects FOR ALL USING (has_role(auth.uid(), 'school_admin'));

-- RLS Policies for students
CREATE POLICY "School admins can manage students" ON public.students FOR ALL USING (has_role(auth.uid(), 'school_admin'));
CREATE POLICY "Students can view own record" ON public.students FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Teachers can view students in their classes" ON public.students FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.teacher_assignments ta
    JOIN public.teachers t ON t.id = ta.teacher_id
    WHERE t.user_id = auth.uid() AND ta.class_id = students.class_id
  )
);

-- RLS Policies for teachers
CREATE POLICY "School admins can manage teachers" ON public.teachers FOR ALL USING (has_role(auth.uid(), 'school_admin'));
CREATE POLICY "Teachers can view own record" ON public.teachers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Anyone authenticated can view teachers" ON public.teachers FOR SELECT TO authenticated USING (true);

-- RLS Policies for teacher_assignments
CREATE POLICY "Anyone can view teacher_assignments" ON public.teacher_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "School admins can manage teacher_assignments" ON public.teacher_assignments FOR ALL USING (has_role(auth.uid(), 'school_admin'));

-- RLS Policies for parents
CREATE POLICY "School admins can manage parents" ON public.parents FOR ALL USING (has_role(auth.uid(), 'school_admin'));
CREATE POLICY "Parents can view own record" ON public.parents FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for student_parents
CREATE POLICY "School admins can manage student_parents" ON public.student_parents FOR ALL USING (has_role(auth.uid(), 'school_admin'));
CREATE POLICY "Parents can view their children links" ON public.student_parents FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.parents p WHERE p.id = student_parents.parent_id AND p.user_id = auth.uid())
);
CREATE POLICY "Students can view their parent links" ON public.student_parents FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_parents.student_id AND s.user_id = auth.uid())
);

-- Add update triggers
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON public.parents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();