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
  Clock,
  Lock,
  UserPlus,
  Download,
  Save,
  ArrowUpCircle,
  UserX,
  Briefcase,
  LayoutDashboard,
  ClipboardList,
  Shield,
  Unlock,
  Eye,
  ArrowRight,
  Layers,
  Database,
  ChevronRight,
  Activity,
} from "lucide-react";
import { format } from "date-fns";

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 800 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setCount(0);
      return;
    }

    let start = 0;
    const increment = Math.ceil(value / (duration / 16));
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
};

// Attendance Badge Component
const AttendanceBadge = ({ percentage }: { percentage: number }) => {
  const getColorClass = () => {
    if (percentage >= 85) return "bg-accent/15 text-accent border-accent/30";
    if (percentage >= 70) return "bg-amber-500/15 text-amber-600 border-amber-500/30";
    return "bg-destructive/15 text-destructive border-destructive/30";
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getColorClass()}`}>
      {percentage}%
    </span>
  );
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
        .maybeSingle();
      if (error) throw error;
      return data as AcademicYear | null;
    },
  });

  // Fetch next academic year
  const { data: nextYear } = useQuery({
    queryKey: ["next-academic-year"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academic_years")
        .select("*")
        .eq("is_active", false)
        .eq("is_locked", false)
        .order("start_date", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
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
        .maybeSingle();

      if (error) return null;
      return (data?.teachers as any)?.profiles?.full_name || "Not Assigned";
    },
  });

  // Mock data for demonstration
  const mockAttendance = {
    students: { total: totalStudents, present: Math.floor(totalStudents * 0.92), absent: Math.floor(totalStudents * 0.08) },
    teachingStaff: { total: totalTeachers, present: Math.floor(totalTeachers * 0.95), absent: Math.floor(totalTeachers * 0.03), onLeave: Math.floor(totalTeachers * 0.02) },
    nonTeachingStaff: { total: 15, present: 14, absent: 1 },
  };

  const studentAttendancePercent = mockAttendance.students.total > 0
    ? Math.round((mockAttendance.students.present / mockAttendance.students.total) * 100)
    : 0;

  const teachingAttendancePercent = mockAttendance.teachingStaff.total > 0
    ? Math.round((mockAttendance.teachingStaff.present / mockAttendance.teachingStaff.total) * 100)
    : 0;

  const nonTeachingAttendancePercent = mockAttendance.nonTeachingStaff.total > 0
    ? Math.round((mockAttendance.nonTeachingStaff.present / mockAttendance.nonTeachingStaff.total) * 100)
    : 0;

  // Mock alerts
  const alerts = [
    { type: "error", message: "2 teachers absent without prior leave", icon: UserX },
    { type: "warning", message: "Attendance not submitted for Class 5-B", icon: Clock },
    { type: "warning", message: "Class 8-A attendance below 75%", icon: AlertTriangle },
    { type: "info", message: "Backup not taken in 7 days", icon: Database },
  ];

  // Mock absent teachers
  const absentTeachers = [
    { name: "Mr. Sharma", class: "5-A", subject: "Mathematics", substitute: true },
    { name: "Ms. Priya", class: "7-B", subject: "Science", substitute: false },
  ];

  // Mock class attendance data
  const classAttendance = studentsByClass.map((cls) => ({
    class_name: cls.class_name,
    section: cls.section,
    total: cls.total,
    present: Math.floor(cls.total * (0.7 + Math.random() * 0.25)),
    percentage: Math.floor(70 + Math.random() * 25),
  }));

  // Mock promotion data
  const promotionStats = {
    eligible: totalStudents,
    promoted: 0,
    pending: totalStudents,
  };

  return (
    <PrincipalNav>
      <div className="min-h-screen bg-[#F7F8FC]">
        {/* TOP HEADER - Sticky */}
        <header className="sticky top-0 z-40 bg-card border-b border-border/60 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">Kalvion – Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Daily School Operations & Academic Control</p>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{format(currentTime, "dd MMM yyyy")}</p>
                    <p className="text-xs">{format(currentTime, "hh:mm a")}</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
          {/* SECTION 1: TODAY'S SCHOOL STATUS - Consolidated Card */}
          <Card className="shadow-sm border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-primary" />
                Today's School Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="divide-y divide-border/50">
                {/* Students Row */}
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">Students</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-2xl font-bold text-foreground">
                        {statsLoading ? "—" : <AnimatedCounter value={mockAttendance.students.present} />}
                      </span>
                      <span className="text-muted-foreground"> / {statsLoading ? "—" : totalStudents}</span>
                    </div>
                    <AttendanceBadge percentage={studentAttendancePercent} />
                  </div>
                </div>

                {/* Teaching Staff Row */}
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(220_80%_55%/0.1)] flex items-center justify-center">
                      <Users className="w-5 h-5 text-[hsl(220_80%_55%)]" />
                    </div>
                    <span className="font-medium text-foreground">Teaching Staff</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-2xl font-bold text-foreground">
                        {statsLoading ? "—" : <AnimatedCounter value={mockAttendance.teachingStaff.present} />}
                      </span>
                      <span className="text-muted-foreground"> / {statsLoading ? "—" : totalTeachers}</span>
                    </div>
                    <AttendanceBadge percentage={teachingAttendancePercent} />
                  </div>
                </div>

                {/* Non-Teaching Staff Row */}
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-medium text-foreground">Non-Teaching Staff</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-2xl font-bold text-foreground">
                        <AnimatedCounter value={mockAttendance.nonTeachingStaff.present} />
                      </span>
                      <span className="text-muted-foreground"> / {mockAttendance.nonTeachingStaff.total}</span>
                    </div>
                    <AttendanceBadge percentage={nonTeachingAttendancePercent} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 2: TEACHING & NON-TEACHING STAFF STATUS - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Teaching Staff Card */}
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-[hsl(220_80%_55%)]" />
                  Teaching Staff – Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3 mb-5">
                  <div className="text-center p-3 bg-muted/40 rounded-xl">
                    <p className="text-2xl font-bold text-foreground">{totalTeachers}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total</p>
                  </div>
                  <div className="text-center p-3 bg-accent/10 rounded-xl">
                    <p className="text-2xl font-bold text-accent">{mockAttendance.teachingStaff.present}</p>
                    <p className="text-xs text-muted-foreground mt-1">Present</p>
                  </div>
                  <div className="text-center p-3 bg-destructive/10 rounded-xl">
                    <p className="text-2xl font-bold text-destructive">{mockAttendance.teachingStaff.absent}</p>
                    <p className="text-xs text-muted-foreground mt-1">Absent</p>
                  </div>
                  <div className="text-center p-3 bg-amber-500/10 rounded-xl">
                    <p className="text-2xl font-bold text-amber-600">{mockAttendance.teachingStaff.onLeave}</p>
                    <p className="text-xs text-muted-foreground mt-1">On Leave</p>
                  </div>
                </div>

                {/* Absent Teachers Table */}
                {absentTeachers.length > 0 && (
                  <div className="border border-border/60 rounded-xl overflow-hidden">
                    <div className="bg-muted/30 px-4 py-2.5 border-b border-border/60">
                      <p className="text-sm font-semibold text-foreground">Absent Teachers</p>
                    </div>
                    <div className="divide-y divide-border/50">
                      {absentTeachers.map((teacher, idx) => (
                        <div key={idx} className="flex items-center justify-between px-4 py-3">
                          <div>
                            <p className="font-medium text-foreground">{teacher.name}</p>
                            <p className="text-xs text-muted-foreground">Class {teacher.class}</p>
                          </div>
                          <Badge 
                            variant={teacher.substitute ? "outline" : "destructive"}
                            className={teacher.substitute ? "border-accent text-accent" : ""}
                          >
                            {teacher.substitute ? "Substitute Assigned" : "No Substitute"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Non-Teaching Staff Card */}
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-600" />
                  Non-Teaching Staff – Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-4 bg-muted/40 rounded-xl">
                    <p className="text-3xl font-bold text-foreground">{mockAttendance.nonTeachingStaff.total}</p>
                    <p className="text-sm text-muted-foreground mt-1">Total</p>
                  </div>
                  <div className="text-center p-4 bg-accent/10 rounded-xl">
                    <p className="text-3xl font-bold text-accent">{mockAttendance.nonTeachingStaff.present}</p>
                    <p className="text-sm text-muted-foreground mt-1">Present</p>
                  </div>
                  <div className="text-center p-4 bg-destructive/10 rounded-xl">
                    <p className="text-3xl font-bold text-destructive">{mockAttendance.nonTeachingStaff.absent}</p>
                    <p className="text-sm text-muted-foreground mt-1">Absent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MAIN GRID - 3 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN - 2 cols wide */}
            <div className="lg:col-span-2 space-y-6">
              {/* SECTION 3: STUDENT ATTENDANCE OVERVIEW */}
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-primary" />
                    Student Attendance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="text-center p-3 bg-muted/40 rounded-xl">
                      <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
                      <p className="text-xs text-muted-foreground mt-1">Total</p>
                    </div>
                    <div className="text-center p-3 bg-accent/10 rounded-xl">
                      <p className="text-2xl font-bold text-accent">{mockAttendance.students.present}</p>
                      <p className="text-xs text-muted-foreground mt-1">Present</p>
                    </div>
                    <div className="text-center p-3 bg-destructive/10 rounded-xl">
                      <p className="text-2xl font-bold text-destructive">{mockAttendance.students.absent}</p>
                      <p className="text-xs text-muted-foreground mt-1">Absent</p>
                    </div>
                  </div>

                  {/* Class-wise Attendance List */}
                  <div className="border border-border/60 rounded-xl overflow-hidden">
                    <div className="bg-muted/30 px-4 py-2.5 border-b border-border/60 flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">Class-wise Attendance</p>
                    </div>
                    <div className="max-h-60 overflow-y-auto scrollbar-smooth divide-y divide-border/50">
                      {classAttendance.map((cls, idx) => (
                        <div key={idx} className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors">
                          <span className="font-medium text-foreground">
                            {cls.class_name} - {cls.section}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-sm ${
                              cls.percentage < 75 ? "text-destructive" : 
                              cls.percentage < 85 ? "text-amber-600" : "text-accent"
                            }`}>
                              {cls.percentage}%
                            </span>
                            {cls.percentage < 75 && (
                              <AlertTriangle className="w-4 h-4 text-destructive" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION 4: STUDENT PROMOTION CONTROL */}
              <Card className="shadow-sm border-0 border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ArrowUpCircle className="w-5 h-5 text-primary" />
                    Student Promotion & Academic Year Transition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Academic Years Display */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Academic Year</p>
                      <p className="text-lg font-bold text-foreground mt-1">{activeYear?.name || "Not Set"}</p>
                    </div>
                    <div className="p-4 bg-muted/40 rounded-xl border border-border/60">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Next Academic Year</p>
                      <p className="text-lg font-bold text-foreground mt-1">{nextYear?.name || "Not Created"}</p>
                    </div>
                  </div>

                  {/* Promotion Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="text-center p-3 bg-accent/10 rounded-xl">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-accent" />
                      </div>
                      <p className="text-2xl font-bold text-accent">{promotionStats.eligible}</p>
                      <p className="text-xs text-muted-foreground mt-1">Eligible</p>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded-xl">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <ArrowUpCircle className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-2xl font-bold text-primary">{promotionStats.promoted}</p>
                      <p className="text-xs text-muted-foreground mt-1">Promoted</p>
                    </div>
                    <div className="text-center p-3 bg-amber-500/10 rounded-xl">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-amber-600" />
                      </div>
                      <p className="text-2xl font-bold text-amber-600">{promotionStats.pending}</p>
                      <p className="text-xs text-muted-foreground mt-1">Pending</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="flex-1 min-w-[140px]">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Summary
                    </Button>
                    <Button className="flex-1 min-w-[140px] bg-primary hover:bg-primary/90">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Promote Students
                    </Button>
                    <Button variant="outline" className="flex-1 min-w-[140px]" disabled={!activeYear || activeYear.is_locked}>
                      <Lock className="w-4 h-4 mr-2" />
                      Lock Year
                    </Button>
                  </div>

                  {/* Warning Text */}
                  <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Promotion actions cannot be undone. Review carefully before proceeding.
                  </p>
                </CardContent>
              </Card>

              {/* Class-wise Quick View */}
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Class-wise Quick View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3 mb-4">
                    <Select value={selectedClass} onValueChange={(val) => { setSelectedClass(val); setSelectedSection(""); }}>
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueClasses.map((cls) => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedSection} onValueChange={setSelectedSection} disabled={!selectedClass}>
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectionsForClass.map((sec) => (
                          <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedClass && selectedSection && selectedClassInfo ? (
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Total Students</p>
                          <p className="text-xl font-bold text-foreground">{selectedClassInfo.total}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Active</p>
                          <p className="text-xl font-bold text-accent">{selectedClassInfo.active}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Absent Today</p>
                          <p className="text-xl font-bold text-destructive">{Math.floor(selectedClassInfo.total * 0.08)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Class Teacher</p>
                          <p className="text-base font-semibold text-foreground truncate">{classTeacher || "..."}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-muted-foreground text-sm">
                      Select a class and section to view details
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* SECTION 6: ALERTS & ATTENTION REQUIRED */}
              <Card className="shadow-sm border-0 border-t-4 border-t-amber-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="w-5 h-5" />
                    Attention Required
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {alerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        alert.type === "error" 
                          ? "bg-destructive/10 border-l-2 border-l-destructive" 
                          : alert.type === "warning"
                          ? "bg-amber-500/10 border-l-2 border-l-amber-500"
                          : "bg-muted/50 border-l-2 border-l-muted-foreground"
                      }`}
                    >
                      <alert.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        alert.type === "error" ? "text-destructive" : 
                        alert.type === "warning" ? "text-amber-600" : "text-muted-foreground"
                      }`} />
                      <p className={`text-sm ${
                        alert.type === "error" ? "text-destructive" : 
                        alert.type === "warning" ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"
                      }`}>
                        {alert.message}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* SECTION 5: ACADEMIC YEAR STATUS */}
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Academic Year Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Active Year</span>
                    <span className="font-semibold text-foreground">{activeYear?.name || "Not Set"}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Admissions</span>
                    <Badge variant={activeYear?.admissions_open ? "default" : "secondary"} className={activeYear?.admissions_open ? "bg-accent text-accent-foreground" : ""}>
                      {activeYear?.admissions_open ? "Open" : "Closed"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Attendance</span>
                    <Badge variant="outline" className={activeYear?.attendance_locked ? "border-destructive text-destructive" : "border-accent text-accent"}>
                      {activeYear?.attendance_locked ? <><Lock className="w-3 h-3 mr-1" /> Locked</> : <><Unlock className="w-3 h-3 mr-1" /> Open</>}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Marks Entry</span>
                    <Badge variant="outline" className={activeYear?.marks_locked ? "border-destructive text-destructive" : "border-accent text-accent"}>
                      {activeYear?.marks_locked ? <><Lock className="w-3 h-3 mr-1" /> Locked</> : <><Unlock className="w-3 h-3 mr-1" /> Open</>}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => navigate("/principal/academic-years")}
                  >
                    Manage Academic Years
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              {/* SECTION 7: QUICK ADMIN ACTIONS */}
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto py-3 flex-col gap-1"
                    onClick={() => navigate("/principal/staff/add")}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="text-xs">Add Teacher</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto py-3 flex-col gap-1"
                    onClick={() => navigate("/principal/classes")}
                  >
                    <Layers className="w-5 h-5" />
                    <span className="text-xs">Add Class</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1">
                    <Download className="w-5 h-5" />
                    <span className="text-xs">Export</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto py-3 flex-col gap-1"
                    onClick={() => navigate("/principal/academic-years")}
                  >
                    <Lock className="w-5 h-5" />
                    <span className="text-xs">Lock Year</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1">
                    <ArrowUpCircle className="w-5 h-5" />
                    <span className="text-xs">Promote</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1">
                    <Save className="w-5 h-5" />
                    <span className="text-xs">Backup</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </PrincipalNav>
  );
};

export default Dashboard;
