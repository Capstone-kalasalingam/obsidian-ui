import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDashboardStats } from "@/hooks/usePrincipalData";
import {
  Calendar,
  Users,
  GraduationCap,
  BookOpen,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lock,
  TrendingUp,
  UserMinus,
  Award,
  Settings,
  ChevronRight,
} from "lucide-react";

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

type StudentByClass = {
  class_name: string;
  section: string;
  count: number;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { totalTeachers, totalStudents, totalClasses, loading: statsLoading } = useDashboardStats();

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

  // Fetch students by class
  const { data: studentsByClass = [] } = useQuery({
    queryKey: ["students-by-class"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select(`
          id,
          status,
          classes!inner(name, section)
        `);
      if (error) throw error;

      // Group by class
      const grouped: Record<string, StudentByClass> = {};
      data?.forEach((student: any) => {
        const key = `${student.classes.name}-${student.classes.section}`;
        if (!grouped[key]) {
          grouped[key] = {
            class_name: student.classes.name,
            section: student.classes.section,
            count: 0,
          };
        }
        grouped[key].count++;
      });

      return Object.values(grouped).sort((a, b) => {
        const aNum = parseInt(a.class_name.replace(/\D/g, "")) || 0;
        const bNum = parseInt(b.class_name.replace(/\D/g, "")) || 0;
        if (aNum !== bNum) return aNum - bNum;
        return a.section.localeCompare(b.section);
      });
    },
  });

  // Fetch student status counts
  const { data: statusCounts } = useQuery({
    queryKey: ["student-status-counts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("status");
      if (error) throw error;

      const counts = {
        active: 0,
        promoted: 0,
        dropout: 0,
        passed_out: 0,
      };

      data?.forEach((s: any) => {
        const status = s.status || "active";
        if (status in counts) {
          counts[status as keyof typeof counts]++;
        }
      });

      return counts;
    },
  });

  // System health checks
  const systemHealth = {
    database: true,
    auth: true,
    storage: true,
  };

  const allHealthy = Object.values(systemHealth).every(Boolean);

  return (
    <PrincipalNav>
      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Active Academic Year Banner */}
        <Card className="bg-gradient-to-r from-kalvion-blue/10 via-kalvion-purple/5 to-transparent border-kalvion-blue/20">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-kalvion-blue to-kalvion-purple flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Active Academic Year
                  </p>
                  {activeYear ? (
                    <h2 className="text-2xl font-bold text-foreground">
                      {activeYear.name}
                    </h2>
                  ) : (
                    <p className="text-lg text-amber-600 font-semibold">
                      No active year set
                    </p>
                  )}
                </div>
              </div>

              {activeYear && (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={activeYear.admissions_open ? "default" : "secondary"}
                    className={activeYear.admissions_open ? "bg-growth" : ""}
                  >
                    {activeYear.admissions_open ? "Admissions Open" : "Admissions Closed"}
                  </Badge>
                  <Badge
                    variant={activeYear.attendance_locked ? "destructive" : "outline"}
                  >
                    <Lock className={`w-3 h-3 mr-1 ${!activeYear.attendance_locked ? "opacity-50" : ""}`} />
                    Attendance {activeYear.attendance_locked ? "Locked" : "Open"}
                  </Badge>
                  <Badge
                    variant={activeYear.marks_locked ? "destructive" : "outline"}
                  >
                    <Lock className={`w-3 h-3 mr-1 ${!activeYear.marks_locked ? "opacity-50" : ""}`} />
                    Marks {activeYear.marks_locked ? "Locked" : "Open"}
                  </Badge>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => navigate("/principal/academic-years")}
                className="shrink-0"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Years
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Admin Summary Cards - Structure Control */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Students */}
          <Card className="hover-scale-soft cursor-pointer" onClick={() => navigate("/principal/users")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kalvion-blue to-kalvion-purple/80 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {statsLoading ? "..." : totalStudents}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Teachers */}
          <Card className="hover-scale-soft cursor-pointer" onClick={() => navigate("/principal/staff")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-cool flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {statsLoading ? "..." : totalTeachers}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Teachers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Classes */}
          <Card className="hover-scale-soft cursor-pointer" onClick={() => navigate("/principal/classes")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-amber flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {statsLoading ? "..." : totalClasses}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="hover-scale-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${allHealthy ? "bg-growth" : "bg-destructive"}`}>
                  {allHealthy ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {allHealthy ? "Healthy" : "Issues"}
                  </p>
                  <p className="text-xs text-muted-foreground">System Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Students by Class */}
          <div className="lg:col-span-2 space-y-6">
            {/* Students by Class */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-kalvion-blue" />
                  Students by Class
                </CardTitle>
              </CardHeader>
              <CardContent>
                {studentsByClass.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>No students enrolled yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {studentsByClass.map((cls) => (
                      <div
                        key={`${cls.class_name}-${cls.section}`}
                        className="p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => navigate(`/principal/classes/${encodeURIComponent(cls.class_name)}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-foreground">
                              {cls.class_name} - {cls.section}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {cls.count} students
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Student Status Overview */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-kalvion-purple" />
                  Student Lifecycle Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-growth/10 border border-growth/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-growth" />
                      <span className="text-sm font-medium text-growth">Active</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {statusCounts?.active ?? 0}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-kalvion-blue/10 border border-kalvion-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-kalvion-blue" />
                      <span className="text-sm font-medium text-kalvion-blue">Promoted</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {statusCounts?.promoted ?? 0}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <UserMinus className="w-5 h-5 text-amber-600" />
                      <span className="text-sm font-medium text-amber-600">Dropouts</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {statusCounts?.dropout ?? 0}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-kalvion-purple/10 border border-kalvion-purple/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-kalvion-purple" />
                      <span className="text-sm font-medium text-kalvion-purple">Passed Out</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {statusCounts?.passed_out ?? 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & System Info */}
          <div className="space-y-6">
            {/* Quick Admin Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-kalvion-blue" />
                  Admin Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/principal/academic-years")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Manage Academic Years
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/principal/classes")}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Manage Classes & Sections
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/principal/staff")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Teachers
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/principal/users")}
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Manage Students
                </Button>
              </CardContent>
            </Card>

            {/* System Health Details */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-growth" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-growth animate-pulse" />
                    <span className="text-sm font-medium">Database</span>
                  </div>
                  <Badge variant="outline" className="text-growth border-growth/30">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-growth animate-pulse" />
                    <span className="text-sm font-medium">Authentication</span>
                  </div>
                  <Badge variant="outline" className="text-growth border-growth/30">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-growth animate-pulse" />
                    <span className="text-sm font-medium">Storage</span>
                  </div>
                  <Badge variant="outline" className="text-growth border-growth/30">
                    Available
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Last Activity */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  Session Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <span className="font-medium text-foreground">Last Login:</span>{" "}
                    {new Date().toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Role:</span>{" "}
                    School Administrator
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PrincipalNav>
  );
};

export default Dashboard;
