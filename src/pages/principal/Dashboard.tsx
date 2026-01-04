import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useDashboardStats } from "@/hooks/usePrincipalData";
import {
  Calendar,
  Users,
  GraduationCap,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lock,
  UserPlus,
  Download,
  Save,
  TrendingUp,
  UserMinus,
  UserCheck,
  UserX,
  Building,
  RefreshCw,
  ChevronRight,
  Unlock,
} from "lucide-react";
import { format } from "date-fns";

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const incrementTime = duration / end;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, Math.max(incrementTime, 10));

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
};

type AcademicYear = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_locked: boolean;
  admissions_open: boolean;
  attendance_locked: boolean;
  marks_locked: boolean;
};

type ClassAttendance = {
  class_name: string;
  section: string;
  total: number;
  present: number;
  percentage: number;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const { totalTeachers, totalStudents, totalClasses, loading: statsLoading } = useDashboardStats();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch active academic year
  const { data: activeYear } = useQuery({
    queryKey: ["active-academic-year"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academic_years")
        .select("*")
        .eq("is_active", true)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data as AcademicYear | null;
    },
  });

  // Fetch all classes for filtering
  const { data: classes = [] } = useQuery({
    queryKey: ["all-classes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("classes").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch students by class with counts
  const { data: studentsByClass = [] } = useQuery({
    queryKey: ["students-by-class-dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select(`id, status, classes!inner(id, name, section)`);
      if (error) throw error;

      const grouped: Record<string, { class_id: string; class_name: string; section: string; total: number; active: number }> = {};
      data?.forEach((student: any) => {
        const key = `${student.classes.name}-${student.classes.section}`;
        if (!grouped[key]) {
          grouped[key] = {
            class_id: student.classes.id,
            class_name: student.classes.name,
            section: student.classes.section,
            total: 0,
            active: 0,
          };
        }
        grouped[key].total++;
        if (student.status === "active" || !student.status) grouped[key].active++;
      });

      return Object.values(grouped).sort((a, b) => {
        const aNum = parseInt(a.class_name.replace(/\D/g, "")) || 0;
        const bNum = parseInt(b.class_name.replace(/\D/g, "")) || 0;
        if (aNum !== bNum) return aNum - bNum;
        return a.section.localeCompare(b.section);
      });
    },
  });

  // Get unique class names and sections
  const uniqueClasses = [...new Set(classes.map((c) => c.name))];
  const sectionsForClass = classes.filter((c) => c.name === selectedClass).map((c) => c.section);

  // Get selected class info
  const selectedClassInfo = studentsByClass.find(
    (c) => c.class_name === selectedClass && c.section === selectedSection
  );

  // Fetch class teacher for selected class
  const { data: classTeacher } = useQuery({
    queryKey: ["class-teacher", selectedClass, selectedSection],
    enabled: !!selectedClass && !!selectedSection,
    queryFn: async () => {
      const classData = classes.find((c) => c.name === selectedClass && c.section === selectedSection);
      if (!classData) return null;

      const { data, error } = await supabase
        .from("teacher_assignments")
        .select(`is_class_teacher, teachers(id, profiles:user_id(full_name))`)
        .eq("class_id", classData.id)
        .eq("is_class_teacher", true)
        .single();

      if (error) return null;
      return (data?.teachers as any)?.profiles?.full_name || "Not Assigned";
    },
  });

  // Mock attendance data (in real app, fetch from attendance table)
  const mockAttendance = {
    students: { total: totalStudents, present: Math.floor(totalStudents * 0.92), absent: Math.floor(totalStudents * 0.08) },
    teachingStaff: { total: totalTeachers, present: Math.floor(totalTeachers * 0.95), absent: Math.floor(totalTeachers * 0.03), onLeave: Math.floor(totalTeachers * 0.02) },
    nonTeachingStaff: { total: 15, present: 14, absent: 1 },
  };

  const studentAttendancePercent = mockAttendance.students.total > 0
    ? Math.round((mockAttendance.students.present / mockAttendance.students.total) * 100)
    : 0;

  // Mock alerts
  const alerts = [
    { type: "warning", message: "Attendance not submitted for Class 5-B", icon: Clock },
    { type: "error", message: "2 teachers absent without prior leave", icon: UserX },
    { type: "warning", message: "Class 8-A attendance below 75%", icon: AlertTriangle },
  ];

  // Mock absent teachers
  const absentTeachers = [
    { name: "Mr. Sharma", class: "Class 5-A", subject: "Mathematics", substitute: "Assigned" },
    { name: "Ms. Priya", class: "Class 7-B", subject: "Science", substitute: "Not Assigned" },
  ];

  // Mock class attendance data
  const classAttendance: ClassAttendance[] = studentsByClass.map((cls) => ({
    class_name: cls.class_name,
    section: cls.section,
    total: cls.total,
    present: Math.floor(cls.total * (0.7 + Math.random() * 0.25)),
    percentage: Math.floor(70 + Math.random() * 25),
  }));

  return (
    <PrincipalNav>
      <div className="min-h-screen bg-[hsl(var(--soft-bg))]">
        {/* TOP HEADER */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Kalvion – Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Daily School Operations Overview</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{format(currentTime, "EEEE, dd MMMM yyyy")}</p>
                <p className="text-xs text-muted-foreground">{format(currentTime, "hh:mm a")}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
          {/* SECTION 1: TOP SUMMARY CARDS - STUDENTS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {statsLoading ? "..." : <AnimatedCounter value={totalStudents} />}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-accent">
                      <AnimatedCounter value={mockAttendance.students.present} />
                    </p>
                    <p className="text-sm text-muted-foreground">Present Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <UserX className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-destructive">
                      <AnimatedCounter value={mockAttendance.students.absent} />
                    </p>
                    <p className="text-sm text-muted-foreground">Absent Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${studentAttendancePercent >= 85 ? "bg-accent/10" : "bg-amber-500/10"}`}>
                    <TrendingUp className={`w-6 h-6 ${studentAttendancePercent >= 85 ? "text-accent" : "text-amber-600"}`} />
                  </div>
                  <div>
                    <p className={`text-3xl font-bold ${studentAttendancePercent >= 85 ? "text-accent" : "text-amber-600"}`}>
                      <AnimatedCounter value={studentAttendancePercent} />%
                    </p>
                    <p className="text-sm text-muted-foreground">Attendance %</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* STAFF SUMMARY CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(220_80%_55%/0.1)] flex items-center justify-center">
                    <Users className="w-6 h-6 text-[hsl(220_80%_55%)]" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {statsLoading ? "..." : <AnimatedCounter value={totalTeachers} />}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Staff</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-accent">
                      <AnimatedCounter value={mockAttendance.teachingStaff.present} />
                    </p>
                    <p className="text-sm text-muted-foreground">Present</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <UserX className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-destructive">
                      <AnimatedCounter value={mockAttendance.teachingStaff.absent} />
                    </p>
                    <p className="text-sm text-muted-foreground">Absent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-amber-600">
                      <AnimatedCounter value={mockAttendance.teachingStaff.onLeave} />
                    </p>
                    <p className="text-sm text-muted-foreground">On Leave</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              {/* SECTION 2: TEACHING STAFF STATUS */}
              <Card className="bg-card shadow-sm">
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Teaching Staff – Today
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-foreground">{totalTeachers}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center p-3 bg-accent/10 rounded-lg">
                      <p className="text-2xl font-bold text-accent">{mockAttendance.teachingStaff.present}</p>
                      <p className="text-xs text-muted-foreground">Present</p>
                    </div>
                    <div className="text-center p-3 bg-destructive/10 rounded-lg">
                      <p className="text-2xl font-bold text-destructive">{mockAttendance.teachingStaff.absent}</p>
                      <p className="text-xs text-muted-foreground">Absent</p>
                    </div>
                    <div className="text-center p-3 bg-amber-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-amber-600">{mockAttendance.teachingStaff.onLeave}</p>
                      <p className="text-xs text-muted-foreground">On Leave</p>
                    </div>
                  </div>

                  {/* Absent Teachers Table */}
                  {absentTeachers.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Absent Teachers</p>
                      <div className="bg-muted/30 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left p-3 font-medium text-muted-foreground">Teacher</th>
                              <th className="text-left p-3 font-medium text-muted-foreground">Class</th>
                              <th className="text-left p-3 font-medium text-muted-foreground">Substitute</th>
                            </tr>
                          </thead>
                          <tbody>
                            {absentTeachers.map((teacher, idx) => (
                              <tr key={idx} className="border-t border-border">
                                <td className="p-3 text-foreground">{teacher.name}</td>
                                <td className="p-3 text-foreground">{teacher.class}</td>
                                <td className="p-3">
                                  <Badge
                                    variant={teacher.substitute === "Assigned" ? "default" : "destructive"}
                                    className={teacher.substitute === "Assigned" ? "bg-accent" : ""}
                                  >
                                    {teacher.substitute}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* SECTION 3: NON-TEACHING STAFF STATUS */}
              <Card className="bg-card shadow-sm">
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="w-5 h-5 text-[hsl(220_80%_55%)]" />
                    Non-Teaching Staff – Today
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-foreground">{mockAttendance.nonTeachingStaff.total}</p>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center p-4 bg-accent/10 rounded-lg">
                      <p className="text-2xl font-bold text-accent">{mockAttendance.nonTeachingStaff.present}</p>
                      <p className="text-sm text-muted-foreground">Present</p>
                    </div>
                    <div className="text-center p-4 bg-destructive/10 rounded-lg">
                      <p className="text-2xl font-bold text-destructive">{mockAttendance.nonTeachingStaff.absent}</p>
                      <p className="text-sm text-muted-foreground">Absent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION 4: STUDENT ATTENDANCE OVERVIEW */}
              <Card className="bg-card shadow-sm">
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Student Attendance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xl font-bold text-foreground">{totalStudents}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center p-3 bg-accent/10 rounded-lg">
                      <p className="text-xl font-bold text-accent">{mockAttendance.students.present}</p>
                      <p className="text-xs text-muted-foreground">Present</p>
                    </div>
                    <div className="text-center p-3 bg-destructive/10 rounded-lg">
                      <p className="text-xl font-bold text-destructive">{mockAttendance.students.absent}</p>
                      <p className="text-xs text-muted-foreground">Absent</p>
                    </div>
                  </div>

                  {/* Class-wise Attendance List */}
                  <div className="max-h-64 overflow-y-auto scrollbar-smooth">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="text-left p-3 font-medium text-muted-foreground">Class</th>
                          <th className="text-right p-3 font-medium text-muted-foreground">Attendance %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classAttendance.map((cls, idx) => (
                          <tr key={idx} className="border-t border-border">
                            <td className="p-3 text-foreground font-medium">
                              {cls.class_name} - {cls.section}
                            </td>
                            <td className="p-3 text-right">
                              <span className={`font-semibold ${cls.percentage < 75 ? "text-destructive" : cls.percentage < 85 ? "text-amber-600" : "text-accent"}`}>
                                {cls.percentage}%
                              </span>
                              {cls.percentage < 75 && (
                                <AlertTriangle className="w-4 h-4 text-destructive inline ml-2" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION 5: CLASS-WISE QUICK VIEW */}
              <Card className="bg-card shadow-sm">
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Class-wise Quick View
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex gap-4 mb-4">
                    <Select value={selectedClass} onValueChange={(val) => { setSelectedClass(val); setSelectedSection(""); }}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueClasses.map((cls) => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedSection} onValueChange={setSelectedSection} disabled={!selectedClass}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select Section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectionsForClass.map((sec) => (
                          <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedClass && selectedSection && selectedClassInfo ? (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Students</p>
                          <p className="text-xl font-bold text-foreground">{selectedClassInfo.total}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Active</p>
                          <p className="text-xl font-bold text-accent">{selectedClassInfo.active}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Absent Today</p>
                          <p className="text-xl font-bold text-destructive">{Math.floor(selectedClassInfo.total * 0.08)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Class Teacher</p>
                          <p className="text-lg font-semibold text-foreground">{classTeacher || "Loading..."}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Select a class and section to view details</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* SECTION 6: ALERTS & ATTENTION REQUIRED */}
              <Card className="bg-card shadow-sm border-l-4 border-l-amber-500">
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-lg flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="w-5 h-5" />
                    Attention Required
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {alerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        alert.type === "error" ? "bg-destructive/10" : "bg-amber-500/10"
                      }`}
                    >
                      <alert.icon className={`w-5 h-5 mt-0.5 ${alert.type === "error" ? "text-destructive" : "text-amber-600"}`} />
                      <p className={`text-sm ${alert.type === "error" ? "text-destructive" : "text-amber-700"}`}>
                        {alert.message}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* SECTION 7: ACADEMIC YEAR STATUS */}
              <Card className="bg-card shadow-sm">
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Academic Year Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Year</span>
                    <span className="font-semibold text-foreground">{activeYear?.name || "Not Set"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Admissions</span>
                    <Badge variant={activeYear?.admissions_open ? "default" : "secondary"} className={activeYear?.admissions_open ? "bg-accent" : ""}>
                      {activeYear?.admissions_open ? "Open" : "Closed"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Attendance</span>
                    <Badge variant={activeYear?.attendance_locked ? "destructive" : "outline"}>
                      {activeYear?.attendance_locked ? <><Lock className="w-3 h-3 mr-1" /> Locked</> : <><Unlock className="w-3 h-3 mr-1" /> Open</>}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Marks Entry</span>
                    <Badge variant={activeYear?.marks_locked ? "destructive" : "outline"}>
                      {activeYear?.marks_locked ? <><Lock className="w-3 h-3 mr-1" /> Locked</> : <><Unlock className="w-3 h-3 mr-1" /> Open</>}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => navigate("/principal/academic-years")}
                  >
                    Manage Academic Years
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              {/* SECTION 8: QUICK ACTION BUTTONS */}
              <Card className="bg-card shadow-sm">
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/principal/staff/add")}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Teacher
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/principal/classes")}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Add Class / Section
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export Attendance
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/principal/academic-years")}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Lock Academic Year
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Promote Students
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Save className="w-4 h-4 mr-2" />
                    Take Backup
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PrincipalNav>
  );
};

export default Dashboard;
