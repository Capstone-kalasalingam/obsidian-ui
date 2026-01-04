import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Teacher = Tables<"teachers"> & {
  profile?: Tables<"profiles"> | null;
  assignments?: (Tables<"teacher_assignments"> & {
    class?: Tables<"classes"> | null;
    subject?: Tables<"subjects"> | null;
  })[];
};

type Class = Tables<"classes"> & {
  students_count?: number;
  class_teacher?: {
    name: string;
    id: string;
  } | null;
};

type Student = Tables<"students"> & {
  profile?: Tables<"profiles"> | null;
  class?: Tables<"classes"> | null;
};

type Announcement = Tables<"announcements">;

export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTeachers = async () => {
    try {
      const { data: teachersData, error: teachersError } = await supabase
        .from("teachers")
        .select(`
          *,
          profile:profiles!teachers_user_id_fkey(*),
          assignments:teacher_assignments(
            *,
            class:classes(*),
            subject:subjects(*)
          )
        `);

      if (teachersError) throw teachersError;
      setTeachers(teachersData || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();

    const channel = supabase
      .channel("teachers-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teachers" },
        () => fetchTeachers()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => fetchTeachers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { teachers, loading, error, refetch: fetchTeachers };
}

export function useClasses() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClasses = async () => {
    try {
      // Fetch classes
      const { data: classesData, error: classesError } = await supabase
        .from("classes")
        .select("*");

      if (classesError) throw classesError;

      // Fetch student counts per class
      const { data: studentsData } = await supabase
        .from("students")
        .select("class_id");

      // Fetch class teachers
      const { data: assignmentsData } = await supabase
        .from("teacher_assignments")
        .select(`
          class_id,
          is_class_teacher,
          teacher:teachers(
            id,
            profile:profiles!teachers_user_id_fkey(full_name)
          )
        `)
        .eq("is_class_teacher", true);

      const studentCounts = (studentsData || []).reduce((acc, s) => {
        acc[s.class_id] = (acc[s.class_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const classTeachers = (assignmentsData || []).reduce((acc, a) => {
        if (a.teacher && a.teacher.profile) {
          acc[a.class_id] = {
            id: a.teacher.id,
            name: a.teacher.profile.full_name || "Unknown",
          };
        }
        return acc;
      }, {} as Record<string, { id: string; name: string }>);

      const enrichedClasses = (classesData || []).map((c) => ({
        ...c,
        students_count: studentCounts[c.id] || 0,
        class_teacher: classTeachers[c.id] || null,
      }));

      setClasses(enrichedClasses);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();

    const channel = supabase
      .channel("classes-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "classes" },
        () => fetchClasses()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        () => fetchClasses()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teacher_assignments" },
        () => fetchClasses()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { classes, loading, error, refetch: fetchClasses };
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStudents = async () => {
    try {
      const { data, error: studentsError } = await supabase
        .from("students")
        .select(`
          *,
          profile:profiles!students_user_id_fkey(*),
          class:classes(*)
        `);

      if (studentsError) throw studentsError;
      setStudents(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();

    const channel = supabase
      .channel("students-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        () => fetchStudents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { students, loading, error, refetch: fetchStudents };
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnnouncements = async () => {
    try {
      const { data, error: announcementsError } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (announcementsError) throw announcementsError;
      setAnnouncements(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createAnnouncement = async (announcement: {
    title: string;
    message: string;
    target: string;
    target_details?: string;
  }) => {
    const { error } = await supabase.from("announcements").insert(announcement);
    if (error) throw error;
    await fetchAnnouncements();
  };

  useEffect(() => {
    fetchAnnouncements();

    const channel = supabase
      .channel("announcements-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        () => fetchAnnouncements()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { announcements, loading, error, refetch: fetchAnnouncements, createAnnouncement };
}

export function useDashboardStats() {
  const { teachers, loading: teachersLoading } = useTeachers();
  const { classes, loading: classesLoading } = useClasses();
  const { students, loading: studentsLoading } = useStudents();

  const totalTeachers = teachers.length;
  const totalStudents = students.length;
  const totalClasses = classes.length;

  return {
    totalTeachers,
    totalStudents,
    totalClasses,
    loading: teachersLoading || classesLoading || studentsLoading,
  };
}
