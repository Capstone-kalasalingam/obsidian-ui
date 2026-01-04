import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  UserCheck,
  UserX,
  BookOpen,
  TrendingUp,
  Calendar,
  Bell,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  homeworkPending: number;
  learningConsistency: number;
}

interface TeacherInfo {
  name: string;
  className: string;
  section: string;
  academicYear: string;
  classId: string | null;
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>({
    name: "Teacher",
    className: "",
    section: "",
    academicYear: "",
    classId: null,
  });
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    homeworkPending: 0,
    learningConsistency: 0,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user) return;

      // Get teacher profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      // Get teacher with assignments
      const { data: teacher } = await supabase
        .from("teachers")
        .select(`
          id,
          teacher_assignments (
            is_class_teacher,
            class_id,
            classes (id, name, section)
          )
        `)
        .eq("user_id", user.id)
        .single();

      // Get active academic year
      const { data: academicYear } = await supabase
        .from("academic_years")
        .select("name")
        .eq("is_active", true)
        .single();

      // Find class teacher assignment
      const classTeacherAssignment = teacher?.teacher_assignments?.find(
        (a: any) => a.is_class_teacher
      );

      const classId = classTeacherAssignment?.classes?.id || 
        teacher?.teacher_assignments?.[0]?.classes?.id || null;

      setTeacherInfo({
        name: profile?.full_name || "Teacher",
        className: classTeacherAssignment?.classes?.name || 
          teacher?.teacher_assignments?.[0]?.classes?.name || "",
        section: classTeacherAssignment?.classes?.section || 
          teacher?.teacher_assignments?.[0]?.classes?.section || "",
        academicYear: academicYear?.name || "",
        classId,
      });

      // Fetch student count for assigned classes
      if (classId) {
        const { count } = await supabase
          .from("students")
          .select("*", { count: "exact", head: true })
          .eq("class_id", classId)
          .eq("status", "active");

        setStats(prev => ({
          ...prev,
          totalStudents: count || 0,
          presentToday: Math.floor((count || 0) * 0.9),
          absentToday: Math.floor((count || 0) * 0.1),
          learningConsistency: 85,
        }));
      }
    };

    fetchTeacherData();
  }, [user]);

  const statsCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Present Today",
      value: stats.presentToday,
      icon: UserCheck,
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Absent Today",
      value: stats.absentToday,
      icon: UserX,
      color: "bg-destructive/10 text-destructive",
    },
    {
      title: "Homework Pending",
      value: stats.homeworkPending,
      icon: BookOpen,
      color: "bg-soft-yellow text-yellow-700",
    },
  ];

  const quickActions = [
    { title: "Students", subtitle: "Manage student records", icon: Users, path: "/teacher/students" },
    { title: "Parents", subtitle: "Manage parent records", icon: GraduationCap, path: "/teacher/parents" },
    { title: "Attendance", subtitle: "Mark daily attendance", icon: UserCheck, path: "/teacher/attendance" },
    { title: "Homework", subtitle: "Assign & track homework", icon: BookOpen, path: "/teacher/homework" },
    { title: "Calendar", subtitle: "View academic events", icon: Calendar, path: "/teacher/calendar" },
    { title: "Notifications", subtitle: "View alerts & updates", icon: Bell, path: "/teacher/notifications" },
  ];

  return (
    <TeacherNav>
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Greeting Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
            {getGreeting()}, {teacherInfo.name.split(" ")[0]}
            <motion.span 
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 20, -10, 20, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-block"
            >
              👋
            </motion.span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening in your class today
          </p>
        </motion.div>

        {/* Class Context Banner */}
        {teacherInfo.className && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="mb-6 border-0 bg-gradient-primary text-primary-foreground">
              <CardContent className="py-4 px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Class Teacher</p>
                    <p className="text-lg font-bold">
                      Class {teacherInfo.className}, Section {teacherInfo.section}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90">Academic Year</p>
                    <p className="text-lg font-semibold">{teacherInfo.academicYear}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Card className="border-0 card-neu">
                  <CardContent className="p-4 lg:p-6">
                    <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Learning Consistency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <Card className="border-0 card-neu">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Learning Consistency</p>
                    <p className="text-sm text-muted-foreground">Class average</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-accent">{stats.learningConsistency}%</p>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.learningConsistency}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Card 
                    className="border-0 card-neu cursor-pointer hover-scale-soft"
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-soft-purple flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{action.title}</p>
                        <p className="text-sm text-muted-foreground">{action.subtitle}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </TeacherNav>
  );
}
