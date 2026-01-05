import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Users, User, GraduationCap, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ClassInfo {
  id: string;
  name: string;
  section: string;
}

interface Teacher {
  id: string;
  name: string;
  avatar_url: string | null;
  is_class_teacher: boolean;
  subject_name: string;
}

interface Student {
  id: string;
  user_id: string;
  roll_number: string | null;
  name: string;
  avatar_url: string | null;
  status: string | null;
}

const ClassDetails = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) return;

    const fetchClassDetails = async () => {
      setLoading(true);
      try {
        // Fetch class info
        const { data: classData, error: classError } = await supabase
          .from("classes")
          .select("id, name, section")
          .eq("id", classId)
          .single();

        if (classError) throw classError;
        setClassInfo(classData);

        // Fetch teachers assigned to this class
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from("teacher_assignments")
          .select(`
            is_class_teacher,
            teacher:teachers(
              id,
              profile:profiles!teachers_user_id_fkey(full_name, avatar_url)
            ),
            subject:subjects(name)
          `)
          .eq("class_id", classId);

        if (assignmentsError) throw assignmentsError;

        const teachersList: Teacher[] = (assignmentsData || []).map((a: any) => ({
          id: a.teacher?.id || "",
          name: a.teacher?.profile?.full_name || "Unknown",
          avatar_url: a.teacher?.profile?.avatar_url || null,
          is_class_teacher: a.is_class_teacher || false,
          subject_name: a.subject?.name || "Unknown",
        }));
        setTeachers(teachersList);

        // Fetch students in this class
        const { data: studentsData, error: studentsError } = await supabase
          .from("students")
          .select("id, user_id, roll_number, status")
          .eq("class_id", classId)
          .order("roll_number", { ascending: true });

        if (studentsError) throw studentsError;

        // Fetch profiles for students
        const userIds = (studentsData || []).map((s) => s.user_id);
        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url")
            .in("id", userIds);

          const profilesMap = new Map(
            (profilesData || []).map((p) => [p.id, p])
          );

          const studentsList: Student[] = (studentsData || []).map((s) => {
            const profile = profilesMap.get(s.user_id);
            return {
              id: s.id,
              user_id: s.user_id,
              roll_number: s.roll_number,
              name: profile?.full_name || "Unknown",
              avatar_url: profile?.avatar_url || null,
              status: s.status,
            };
          });
          setStudents(studentsList);
        } else {
          setStudents([]);
        }
      } catch (error) {
        console.error("Error fetching class details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();

    // Real-time subscription for students
    const channel = supabase
      .channel("class-details-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students", filter: `class_id=eq.${classId}` },
        () => fetchClassDetails()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teacher_assignments", filter: `class_id=eq.${classId}` },
        () => fetchClassDetails()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [classId]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const classTeacher = teachers.find((t) => t.is_class_teacher);

  if (!loading && !classInfo) {
    return (
      <PrincipalNav>
        <div className="px-4 py-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/principal/classes")}
            className="rounded-full mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <p className="text-muted-foreground">Class not found</p>
        </div>
      </PrincipalNav>
    );
  }

  return (
    <PrincipalNav>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/principal/classes")}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            {loading ? (
              <Skeleton className="h-7 w-40" />
            ) : (
              <div>
                <h1 className="text-xl font-bold">
                  {classInfo?.name} - Section {classInfo?.section}
                </h1>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-6 space-y-6 pb-24">
          {/* Class Teacher Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4" />
                Class Teacher
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ) : classTeacher ? (
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={classTeacher.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(classTeacher.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{classTeacher.name}</p>
                    <Badge variant="secondary">{classTeacher.subject_name}</Badge>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No class teacher assigned</p>
              )}
            </CardContent>
          </Card>

          {/* Subject Teachers Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Subject Teachers ({teachers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-28 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))
              ) : teachers.length === 0 ? (
                <p className="text-muted-foreground text-sm">No teachers assigned</p>
              ) : (
                teachers.map((teacher) => (
                  <div key={`${teacher.id}-${teacher.subject_name}`} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={teacher.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getInitials(teacher.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{teacher.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{teacher.subject_name}</Badge>
                        {teacher.is_class_teacher && (
                          <Badge className="text-xs">Class Teacher</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Students Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Students ({students.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))
              ) : students.length === 0 ? (
                <p className="text-muted-foreground text-sm">No students enrolled</p>
              ) : (
                students.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-8 h-8 flex items-center justify-center text-sm font-medium text-muted-foreground">
                      {index + 1}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={student.avatar_url || undefined} />
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                        {getInitials(student.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Roll No: {student.roll_number || "N/A"}
                      </p>
                    </div>
                    <Badge
                      variant={student.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {student.status || "Active"}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PrincipalNav>
  );
};

export default ClassDetails;