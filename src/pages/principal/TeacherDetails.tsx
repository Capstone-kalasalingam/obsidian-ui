import { useEffect, useState } from "react";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit2, Smartphone, MapPin, Calendar, User, Mail, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const TeacherDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      const { data, error } = await supabase
        .from("teachers")
        .select(`
          *,
          profile:profiles!teachers_user_id_fkey(*),
          assignments:teacher_assignments(
            *,
            class:classes(*),
            subject:subjects(*)
          )
        `)
        .eq("id", id)
        .single();

      if (!error && data) {
        setTeacher(data);
      }
      setLoading(false);
    };

    fetchTeacher();
  }, [id]);

  if (loading) {
    return (
      <PrincipalNav>
        <div className="min-h-screen bg-background">
          <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          <div className="px-4 py-8 max-w-2xl mx-auto space-y-6">
            <div className="flex flex-col items-center">
              <Skeleton className="w-36 h-36 rounded-full" />
              <Skeleton className="h-6 w-40 mt-4" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
          </div>
        </div>
      </PrincipalNav>
    );
  }

  if (!teacher) {
    return (
      <PrincipalNav>
        <div className="flex items-center justify-center h-full">
          <p>Teacher not found</p>
        </div>
      </PrincipalNav>
    );
  }

  const assignedClasses = teacher.assignments
    ?.filter((a: any) => a.class)
    .map((a: any) => `${a.class.name} - ${a.class.section}`)
    .join(", ") || "No classes assigned";

  const subjects = teacher.assignments
    ?.filter((a: any) => a.subject)
    .map((a: any) => a.subject.name)
    .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
    .join(", ") || "No subjects assigned";

  return (
    <PrincipalNav>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/principal/staff")}
                className="rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold">Teacher Details</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-8 max-w-2xl mx-auto space-y-6">
          {/* Profile Section */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-36 h-36 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
              {teacher.profile?.avatar_url ? (
                <img 
                  src={teacher.profile.avatar_url} 
                  alt={teacher.profile.full_name || ""} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-16 h-16 text-primary/60" />
                </div>
              )}
            </div>
            <div>
              <h2 className="font-bold text-2xl mb-1">{teacher.profile?.full_name || "Unknown"}</h2>
              <p className="text-base text-muted-foreground">{teacher.profile?.email}</p>
            </div>
          </div>

          {/* Details Cards */}
          <div className="space-y-4 mt-8">
            {/* Employee ID */}
            <Card className="bg-card border border-border rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-0.5">Employee ID</p>
                    <p className="text-base text-muted-foreground">
                      {teacher.employee_id || "Not assigned"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phone */}
            {teacher.profile?.phone && (
              <Card className="bg-card border border-border rounded-2xl shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-0.5">Phone</p>
                      <p className="text-base text-muted-foreground">
                        {teacher.profile.phone}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Subjects */}
            <Card className="bg-card border border-border rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-0.5">Subjects</p>
                    <p className="text-base text-muted-foreground">
                      {subjects}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Classes */}
            <Card className="bg-card border border-border rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-0.5">Assigned Classes</p>
                    <p className="text-base text-muted-foreground">
                      {assignedClasses}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Joining Date */}
            <Card className="bg-card border border-border rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-0.5">Joining Date</p>
                    <p className="text-base text-muted-foreground">
                      {teacher.joining_date 
                        ? format(new Date(teacher.joining_date), "MMMM d, yyyy")
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PrincipalNav>
  );
};

export default TeacherDetails;