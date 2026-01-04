import { useState, useEffect } from "react";
import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Phone, BookOpen, GraduationCap, Calendar } from "lucide-react";

interface TeacherProfile {
  name: string;
  email: string;
  phone: string;
  teacherId: string;
  qualification: string;
  joiningDate: string;
  assignedClasses: { name: string; section: string; isClassTeacher: boolean }[];
  subjects: string[];
}

export default function TeacherProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TeacherProfile>({
    name: "",
    email: "",
    phone: "",
    teacherId: "",
    qualification: "",
    joiningDate: "",
    assignedClasses: [],
    subjects: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      // Get profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // Get teacher details with assignments
      const { data: teacherData } = await supabase
        .from("teachers")
        .select(`
          employee_id,
          qualification,
          joining_date,
          teacher_assignments (
            is_class_teacher,
            classes (name, section),
            subjects (name)
          )
        `)
        .eq("user_id", user.id)
        .single();

      if (profileData) {
        const classes = teacherData?.teacher_assignments?.map((a: any) => ({
          name: a.classes?.name || "",
          section: a.classes?.section || "",
          isClassTeacher: a.is_class_teacher,
        })).filter((c: any, i: number, arr: any[]) => 
          arr.findIndex((x: any) => x.name === c.name && x.section === c.section) === i
        ) || [];

        const subjects = [...new Set(
          teacherData?.teacher_assignments?.map((a: any) => a.subjects?.name).filter(Boolean)
        )] as string[];

        setProfile({
          name: profileData.full_name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          teacherId: teacherData?.employee_id || "",
          qualification: teacherData?.qualification || "",
          joiningDate: teacherData?.joining_date || "",
          assignedClasses: classes,
          subjects,
        });
      }
    };

    fetchProfile();
  }, [user]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TeacherNav>
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Profile Header */}
        <Card className="border-0 card-neu mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-muted-foreground">Teacher</p>
                {profile.teacherId && (
                  <Badge variant="secondary" className="mt-2 font-mono">
                    {profile.teacherId}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-0 card-neu mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-soft-purple flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{profile.email || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-soft-purple flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{profile.phone || "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Details */}
        <Card className="border-0 card-neu mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-soft-green flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Qualification</p>
                <p className="font-medium">{profile.qualification || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-soft-green flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Joining Date</p>
                <p className="font-medium">
                  {profile.joiningDate 
                    ? new Date(profile.joiningDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Not set"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Classes */}
        <Card className="border-0 card-neu mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Assigned Classes</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.assignedClasses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.assignedClasses.map((c, i) => (
                  <Badge 
                    key={i} 
                    variant={c.isClassTeacher ? "default" : "secondary"}
                    className="text-sm"
                  >
                    {c.name}-{c.section}
                    {c.isClassTeacher && " (Class Teacher)"}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No classes assigned</p>
            )}
          </CardContent>
        </Card>

        {/* Subjects */}
        <Card className="border-0 card-neu">
          <CardHeader>
            <CardTitle className="text-lg">Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.subjects.map((subject, i) => (
                  <Badge key={i} variant="outline" className="text-sm">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {subject}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No subjects assigned</p>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Profile information is managed by the school administrator. 
          Contact admin for any changes.
        </p>
      </div>
    </TeacherNav>
  );
}
