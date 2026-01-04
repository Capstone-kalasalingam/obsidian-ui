import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  UserPlus,
  Calendar,
  BookOpen,
  Brain,
  MessageSquare,
  Bell,
  User,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import BottomNav from "./BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { title: "Dashboard", url: "/teacher/dashboard", icon: LayoutDashboard },
  { title: "Students", url: "/teacher/students", icon: Users },
  { title: "Parents", url: "/teacher/parents", icon: UserPlus },
  { title: "Attendance", url: "/teacher/attendance", icon: ClipboardCheck },
  { title: "Academic Calendar", url: "/teacher/calendar", icon: Calendar },
  { title: "Homework & Practice", url: "/teacher/homework", icon: BookOpen },
  { title: "AI Insights", url: "/teacher/insights", icon: Brain },
  { title: "Parent Communication", url: "/teacher/communication", icon: MessageSquare },
  { title: "Notifications", url: "/teacher/notifications", icon: Bell },
  { title: "Profile", url: "/teacher/profile", icon: User },
];

interface TeacherInfo {
  name: string;
  className: string;
  section: string;
  academicYear: string;
}

export default function TeacherNav({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>({
    name: "Teacher",
    className: "",
    section: "",
    academicYear: "",
  });

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      if (!user) return;

      // Get teacher profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      // Get teacher assignments with class info
      const { data: teacher } = await supabase
        .from("teachers")
        .select(`
          id,
          teacher_assignments (
            is_class_teacher,
            class_id,
            classes (name, section)
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

      setTeacherInfo({
        name: profile?.full_name || "Teacher",
        className: classTeacherAssignment?.classes?.name || "",
        section: classTeacherAssignment?.classes?.section || "",
        academicYear: academicYear?.name || "",
      });
    };

    fetchTeacherInfo();
  }, [user]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.url === location.pathname);
    return currentItem?.title || "Dashboard";
  };

  const renderSidebarContent = () => (
    <>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">{teacherInfo.name}</h2>
            <p className="text-xs text-muted-foreground">Teacher</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto scrollbar-smooth">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.url);
          return (
            <button
              key={item.title}
              onClick={() => {
                navigate(item.url);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.title}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 px-4 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-soft-bg">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-border flex-col bg-card">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-card">
          <div className="flex flex-col h-full">
            {renderSidebarContent()}
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pb-16 lg:pb-0">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center px-4 lg:px-6 sticky top-0 z-10">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden mr-3 hover:bg-secondary p-2 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Back Button - Desktop only */}
          <button 
            onClick={() => navigate(-1)}
            className="hidden lg:block mr-4 hover:bg-secondary p-2 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h1 className="text-lg lg:text-xl font-bold">{getPageTitle()}</h1>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Bottom Navigation - Mobile only */}
        <BottomNav />
      </div>
    </div>
  );
}
