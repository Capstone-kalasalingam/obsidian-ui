import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface StudentData {
  id: string;
  fullName: string;
  firstName: string;
  email: string;
  phone: string | null;
  rollNumber: string | null;
  className: string;
  section: string;
  classDisplay: string;
  status: string;
  residenceType: string;
  villageAddress: string | null;
  parentPhone: string | null;
  academicYear: string | null;
  // Learning profile
  currentStreakDays: number;
  longestStreakDays: number;
  totalTasksCompleted: number;
  confidenceScore: number;
  lastActivityDate: string | null;
  // Parent details
  fatherName: string | null;
  motherName: string | null;
  parentOccupation: string | null;
}

interface SubjectData {
  id: string;
  name: string;
  code: string;
  proficiencyLevel: string | null;
  score: number;
}

export function useStudentData() {
  const { user } = useAuth();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch student record with profile, class, and academic year
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select(`
            id,
            roll_number,
            status,
            residence_type,
            village_address,
            parent_phone,
            class_id,
            academic_year_id,
            classes (
              id,
              name,
              section
            ),
            academic_years (
              id,
              name
            )
          `)
          .eq('user_id', user.id)
          .single();

        if (studentError) {
          console.error('Error fetching student:', studentError);
          setError('Failed to fetch student data');
          setLoading(false);
          return;
        }

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, email, phone')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        // Fetch learning profile
        const { data: learningProfile } = await supabase
          .from('student_learning_profiles')
          .select('*')
          .eq('student_id', studentData.id)
          .single();

        // Fetch parent details
        const { data: parentDetails } = await supabase
          .from('student_parent_details')
          .select('*')
          .eq('student_id', studentData.id)
          .single();

        // Fetch subjects for this class
        const { data: classSubjects } = await supabase
          .from('class_subjects')
          .select(`
            subject_id,
            subjects (
              id,
              name,
              code
            )
          `)
          .eq('class_id', studentData.class_id);

        // Fetch student proficiencies
        const { data: proficiencies } = await supabase
          .from('student_subject_proficiencies')
          .select('*')
          .eq('student_id', studentData.id);

        // Build subjects list with proficiency data
        const subjectsList: SubjectData[] = (classSubjects || []).map((cs: any) => {
          const prof = proficiencies?.find((p: any) => p.subject_id === cs.subjects.id);
          return {
            id: cs.subjects.id,
            name: cs.subjects.name,
            code: cs.subjects.code,
            proficiencyLevel: prof?.proficiency_level || 'average',
            score: prof?.score || 50,
          };
        });

        const classInfo = studentData.classes as any;
        const academicYear = studentData.academic_years as any;
        const fullName = profileData?.full_name || 'Student';

        setStudent({
          id: studentData.id,
          fullName,
          firstName: fullName.split(' ')[0],
          email: profileData?.email || '',
          phone: profileData?.phone || null,
          rollNumber: studentData.roll_number,
          className: classInfo?.name || '',
          section: classInfo?.section || '',
          classDisplay: classInfo ? `${classInfo.name}-${classInfo.section}` : '',
          status: studentData.status || 'active',
          residenceType: studentData.residence_type || 'day_scholar',
          villageAddress: studentData.village_address,
          parentPhone: studentData.parent_phone,
          academicYear: academicYear?.name || null,
          currentStreakDays: learningProfile?.current_streak_days || 0,
          longestStreakDays: learningProfile?.longest_streak_days || 0,
          totalTasksCompleted: learningProfile?.total_tasks_completed || 0,
          confidenceScore: learningProfile?.confidence_score || 50,
          lastActivityDate: learningProfile?.last_activity_date || null,
          fatherName: parentDetails?.father_name || null,
          motherName: parentDetails?.mother_name || null,
          parentOccupation: parentDetails?.occupation || null,
        });

        setSubjects(subjectsList);
      } catch (err) {
        console.error('Error in useStudentData:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();

    // Set up real-time subscription for student updates
    const channel = supabase
      .channel('student-data-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchStudentData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_learning_profiles',
        },
        () => {
          fetchStudentData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { student, subjects, loading, error };
}
