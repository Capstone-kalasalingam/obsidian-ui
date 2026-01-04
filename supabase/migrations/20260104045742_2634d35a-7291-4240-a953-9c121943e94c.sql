-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target TEXT NOT NULL CHECK (target IN ('school', 'class', 'role')),
  target_details TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone authenticated can view announcements"
ON public.announcements
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "School admins can manage announcements"
ON public.announcements
FOR ALL
USING (has_role(auth.uid(), 'school_admin'::app_role));

-- Enable realtime for required tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.teachers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.classes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;