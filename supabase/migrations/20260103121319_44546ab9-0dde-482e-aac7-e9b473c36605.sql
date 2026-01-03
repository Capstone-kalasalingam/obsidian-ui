-- Student Self Reflections Table
CREATE TABLE public.student_reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  week_start DATE NOT NULL,
  understood_well TEXT,
  confused_about TEXT,
  want_to_improve TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Chat History Table
CREATE TABLE public.student_ai_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Academic Calendar Events Table
CREATE TABLE public.academic_calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  end_date DATE,
  event_type TEXT NOT NULL CHECK (event_type IN ('exam', 'unit_test', 'homework', 'project', 'holiday', 'event', 'revision')),
  class_name TEXT,
  subject TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_ai_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_reflections
CREATE POLICY "Students can view their own reflections"
ON public.student_reflections FOR SELECT
USING (EXISTS (SELECT 1 FROM students s WHERE s.id = student_reflections.student_id AND s.user_id = auth.uid()));

CREATE POLICY "Students can insert their own reflections"
ON public.student_reflections FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM students s WHERE s.id = student_reflections.student_id AND s.user_id = auth.uid()));

CREATE POLICY "Students can update their own reflections"
ON public.student_reflections FOR UPDATE
USING (EXISTS (SELECT 1 FROM students s WHERE s.id = student_reflections.student_id AND s.user_id = auth.uid()));

CREATE POLICY "School admins can manage reflections"
ON public.student_reflections FOR ALL
USING (public.has_role(auth.uid(), 'school_admin'));

-- RLS Policies for student_ai_chats
CREATE POLICY "Students can view their own chats"
ON public.student_ai_chats FOR SELECT
USING (EXISTS (SELECT 1 FROM students s WHERE s.id = student_ai_chats.student_id AND s.user_id = auth.uid()));

CREATE POLICY "Students can insert their own chats"
ON public.student_ai_chats FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM students s WHERE s.id = student_ai_chats.student_id AND s.user_id = auth.uid()));

CREATE POLICY "Students can update their own chats"
ON public.student_ai_chats FOR UPDATE
USING (EXISTS (SELECT 1 FROM students s WHERE s.id = student_ai_chats.student_id AND s.user_id = auth.uid()));

CREATE POLICY "School admins can manage chats"
ON public.student_ai_chats FOR ALL
USING (public.has_role(auth.uid(), 'school_admin'));

-- RLS Policies for academic_calendar_events (public read for students)
CREATE POLICY "Anyone can view calendar events"
ON public.academic_calendar_events FOR SELECT
USING (true);

CREATE POLICY "School admins can manage calendar events"
ON public.academic_calendar_events FOR ALL
USING (public.has_role(auth.uid(), 'school_admin'));

-- Trigger for updating student_ai_chats updated_at
CREATE TRIGGER update_student_ai_chats_updated_at
BEFORE UPDATE ON public.student_ai_chats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();