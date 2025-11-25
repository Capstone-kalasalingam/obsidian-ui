import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  FileText,
  TrendingUp,
  Bell,
  User,
  LogOut,
  ChevronLeft,
  Calendar,
  Menu,
  X,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { teacherInfo } from "@/data/teacherMockData";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import BottomNav from "./BottomNav";

const menuItems = [
  { title: "Dashboard", url: "/teacher/dashboard", icon: LayoutDashboard },
  { title: "Attendance", url: "/teacher/attendance", icon: ClipboardCheck },
  { title: "Study Material", url: "/teacher/study-material", icon: BookOpen },
  { title: "Marks Entry", url: "/teacher/marks", icon: FileText },
  { title: "Class Progress", url: "/teacher/progress", icon: TrendingUp },
  { title: "Weekly Report", url: "/teacher/weekly-report", icon: Calendar },
  { title: "Timetable", url: "/teacher/timetable", icon: CalendarDays },
  { title: "Announcements", url: "/teacher/announcements", icon: Bell },
];

export default function TeacherNav({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    navigate("/");
  };

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.url === location.pathname);
    return currentItem?.title || "Dashboard";
  };

  const renderSidebarContent = () => (
    <>
      {/* Sidebar Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">{teacherInfo.name}</h2>
            <p className="text-xs text-muted-foreground">{teacherInfo.subject}</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
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
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 px-4 text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex w-80 border-r flex-col">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {renderSidebarContent()}
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pb-16 lg:pb-0">
        {/* Top Header */}
        <header className="h-16 bg-background border-b border-border flex items-center px-4 lg:px-6 sticky top-0 z-10">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden mr-3 hover:bg-muted p-2 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Back Button - Hidden on mobile */}
          <button 
            onClick={() => navigate(-1)}
            className="hidden lg:block mr-4 hover:bg-muted p-2 rounded-lg transition-colors"
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
