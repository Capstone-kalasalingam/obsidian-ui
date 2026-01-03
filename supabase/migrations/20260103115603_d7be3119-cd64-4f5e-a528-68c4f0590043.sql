-- Student Learning Profiles (core learning data per student)
CREATE TABLE public.student_learning_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE UNIQUE,
  confidence_score INTEGER DEFAULT 50 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  total_tasks_completed INTEGER DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Subject Proficiency per Student (strong/weak subjects tracking)
CREATE TYPE public.proficiency_level AS ENUM ('weak', 'average', 'strong');

CREATE TABLE public.student_subject_proficiencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  proficiency_level proficiency_level DEFAULT 'average',
  score INTEGER DEFAULT 50 CHECK (score >= 0 AND score <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, subject_id)
);

-- Daily Activity Log (tracks what students did each day)
CREATE TABLE public.student_daily_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  tasks_completed INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, activity_date)
);

-- Daily Learning Tasks (1% tasks - teacher-defined or syllabus-based)
CREATE TYPE public.task_type AS ENUM ('teacher_defined', 'syllabus_based');

CREATE TABLE public.daily_learning_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  estimated_minutes INTEGER DEFAULT 10 CHECK (estimated_minutes >= 1 AND estimated_minutes <= 30),
  task_date DATE NOT NULL,
  task_type task_type DEFAULT 'teacher_defined',
  created_by UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Student Task Completions
CREATE TYPE public.task_status AS ENUM ('pending', 'in_progress', 'completed', 'skipped');

CREATE TABLE public.student_task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.daily_learning_tasks(id) ON DELETE CASCADE,
  status task_status DEFAULT 'pending',
  time_spent_minutes INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, task_id)
);

-- Enable RLS on all tables
ALTER TABLE public.student_learning_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_subject_proficiencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_learning_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_task_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_learning_profiles
CREATE POLICY "School admins can manage learning profiles" ON public.student_learning_profiles 
  FOR ALL USING (has_role(auth.uid(), 'school_admin'));
CREATE POLICY "Students can view own profile" ON public.student_learning_profiles 
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.user_id = auth.uid()));
CREATE POLICY "Teachers can view their class students profiles" ON public.student_learning_profiles 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students s
      JOIN public.teacher_assignments ta ON ta.class_id = s.class_id
      JOIN public.teachers t ON t.id = ta.teacher_id
      WHERE s.id = student_learning_profiles.student_id AND t.user_id = auth.uid()
    )
  );
CREATE POLICY "Parents can view their children profiles" ON public.student_learning_profiles 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.student_parents sp
      JOIN public.parents p ON p.id = sp.parent_id
      WHERE sp.student_id = student_learning_profiles.student_id AND p.user_id = auth.uid()
    )
  );

-- RLS Policies for student_subject_proficiencies
CREATE POLICY "School admins can manage proficiencies" ON public.student_subject_proficiencies 
  FOR ALL USING (has_role(auth.uid(), 'school_admin'));
CREATE POLICY "Students can view own proficiencies" ON public.student_subject_proficiencies 
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.user_id = auth.uid()));
CREATE POLICY "Teachers can manage their class students proficiencies" ON public.student_subject_proficiencies 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.students s
      JOIN public.teacher_assignments ta ON ta.class_id = s.class_id
      JOIN public.teachers t ON t.id = ta.teacher_id
      WHERE s.id = student_subject_proficiencies.student_id AND t.user_id = auth.uid()
    )
  );
CREATE POLICY "Parents can view their children proficiencies" ON public.student_subject_proficiencies 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.student_parents sp
      JOIN public.parents p ON p.id = sp.parent_id
      WHERE sp.student_id = student_subject_proficiencies.student_id AND p.user_id = auth.uid()
    )
  );

-- RLS Policies for student_daily_activities
CREATE POLICY "School admins can manage daily activities" ON public.student_daily_activities 
  FOR ALL USING (has_role(auth.uid(), 'school_admin'));
CREATE POLICY "Students can manage own activities" ON public.student_daily_activities 
  FOR ALL USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.user_id = auth.uid()));
CREATE POLICY "Teachers can view their class students activities" ON public.student_daily_activities 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students s
      JOIN public.teacher_assignments ta ON ta.class_id = s.class_id
      JOIN public.teachers t ON t.id = ta.teacher_id
      WHERE s.id = student_daily_activities.student_id AND t.user_id = auth.uid()
    )
  );
CREATE POLICY "Parents can view their children activities" ON public.student_daily_activities 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.student_parents sp
      JOIN public.parents p ON p.id = sp.parent_id
      WHERE sp.student_id = student_daily_activities.student_id AND p.user_id = auth.uid()
    )
  );

-- RLS Policies for daily_learning_tasks
CREATE POLICY "School admins can manage tasks" ON public.daily_learning_tasks 
  FOR ALL USING (has_role(auth.uid(), 'school_admin'));
CREATE POLICY "Teachers can manage their class tasks" ON public.daily_learning_tasks 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.teacher_assignments ta
      JOIN public.teachers t ON t.id = ta.teacher_id
      WHERE ta.class_id = daily_learning_tasks.class_id AND t.user_id = auth.uid()
    )
  );
CREATE POLICY "Students can view their class tasks" ON public.daily_learning_tasks 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students s WHERE s.class_id = daily_learning_tasks.class_id AND s.user_id = auth.uid()
    )
  );
CREATE POLICY "Parents can view their children class tasks" ON public.daily_learning_tasks 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.student_parents sp
      JOIN public.students s ON s.id = sp.student_id
      JOIN public.parents p ON p.id = sp.parent_id
      WHERE s.class_id = daily_learning_tasks.class_id AND p.user_id = auth.uid()
    )
  );

-- RLS Policies for student_task_completions
CREATE POLICY "School admins can manage completions" ON public.student_task_completions 
  FOR ALL USING (has_role(auth.uid(), 'school_admin'));
CREATE POLICY "Students can manage own completions" ON public.student_task_completions 
  FOR ALL USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.user_id = auth.uid()));
CREATE POLICY "Teachers can view their class students completions" ON public.student_task_completions 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students s
      JOIN public.teacher_assignments ta ON ta.class_id = s.class_id
      JOIN public.teachers t ON t.id = ta.teacher_id
      WHERE s.id = student_task_completions.student_id AND t.user_id = auth.uid()
    )
  );
CREATE POLICY "Parents can view their children completions" ON public.student_task_completions 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.student_parents sp
      JOIN public.parents p ON p.id = sp.parent_id
      WHERE sp.student_id = student_task_completions.student_id AND p.user_id = auth.uid()
    )
  );

-- Update triggers
CREATE TRIGGER update_student_learning_profiles_updated_at 
  BEFORE UPDATE ON public.student_learning_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_subject_proficiencies_updated_at 
  BEFORE UPDATE ON public.student_subject_proficiencies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-create learning profile when student is created
CREATE OR REPLACE FUNCTION public.create_student_learning_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.student_learning_profiles (student_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_student_created_create_profile
  AFTER INSERT ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.create_student_learning_profile();

-- Function to update learning profile after task completion
CREATE OR REPLACE FUNCTION public.update_learning_profile_on_completion()
RETURNS TRIGGER AS $$
DECLARE
  today DATE := CURRENT_DATE;
  last_date DATE;
  current_streak INTEGER;
BEGIN
  IF NEW.status = 'completed' AND (OLD IS NULL OR OLD.status != 'completed') THEN
    -- Get current profile data
    SELECT last_activity_date, current_streak_days INTO last_date, current_streak
    FROM public.student_learning_profiles WHERE student_id = NEW.student_id;
    
    -- Calculate new streak
    IF last_date IS NULL OR last_date < today - 1 THEN
      current_streak := 1;
    ELSIF last_date = today - 1 THEN
      current_streak := COALESCE(current_streak, 0) + 1;
    END IF;
    
    -- Update profile
    UPDATE public.student_learning_profiles
    SET 
      total_tasks_completed = total_tasks_completed + 1,
      last_activity_date = today,
      current_streak_days = current_streak,
      longest_streak_days = GREATEST(longest_streak_days, current_streak),
      confidence_score = LEAST(100, confidence_score + 1)
    WHERE student_id = NEW.student_id;
    
    -- Update or insert daily activity
    INSERT INTO public.student_daily_activities (student_id, activity_date, tasks_completed, time_spent_minutes)
    VALUES (NEW.student_id, today, 1, COALESCE(NEW.time_spent_minutes, 0))
    ON CONFLICT (student_id, activity_date)
    DO UPDATE SET 
      tasks_completed = student_daily_activities.tasks_completed + 1,
      time_spent_minutes = student_daily_activities.time_spent_minutes + COALESCE(NEW.time_spent_minutes, 0);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_task_completion_update_profile
  AFTER INSERT OR UPDATE ON public.student_task_completions
  FOR EACH ROW EXECUTE FUNCTION public.update_learning_profile_on_completion();

-- Index for performance
CREATE INDEX idx_daily_tasks_class_date ON public.daily_learning_tasks(class_id, task_date);
CREATE INDEX idx_task_completions_student_task ON public.student_task_completions(student_id, task_id);
CREATE INDEX idx_daily_activities_student_date ON public.student_daily_activities(student_id, activity_date);