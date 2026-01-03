import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  Megaphone,
  FileText,
  LogOut,
  Menu,
  Bell,
  GraduationCap,
  UserPlus,
  UserCheck,
  UserCog,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Sun,
  Moon,
  HelpCircle,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";

const navItems = [
  { label: "Dashboard", href: "/principal/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/principal/users", icon: UserCog },
  { label: "Staff Management", href: "/principal/staff", icon: Users },
  { label: "Add Staff", href: "/principal/add-staff", icon: UserPlus },
  { label: "Classes & Subjects", href: "/principal/classes", icon: BookOpen },
  { label: "Assign Teacher", href: "/principal/assign-class-teacher", icon: UserCheck },
  { label: "Attendance", href: "/principal/attendance", icon: ClipboardCheck },
  { label: "Announcements", href: "/principal/announcements", icon: Megaphone },
  { label: "Reports", href: "/principal/reports", icon: FileText },
  { label: "Fees", href: "/principal/fees", icon: CreditCard },
];

const bottomNavItems = [
  { label: "Dashboard", href: "/principal/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/principal/users", icon: UserCog },
  { label: "Staff", href: "/principal/staff", icon: Users },
  { label: "Classes", href: "/principal/classes", icon: BookOpen },
];

const bottomMenuItems = [
  { label: "Help & Support", href: "/principal/profile", icon: HelpCircle },
];

const PrincipalNav = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const { signOut } = useAuth();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const isActive = (path: string) => location.pathname === path;

  const renderSidebarContent = (collapsed = false) => (
    <TooltipProvider delayDuration={0}>
      {/* Logo Section */}
      <div className={`p-5 ${collapsed ? 'px-3' : ''}`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-white text-lg tracking-tight">Kalvion</h1>
              <p className="text-[10px] text-white/60 font-medium tracking-wide">Admin Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-smooth">
        <div className={`text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2 ${collapsed ? 'text-center' : 'px-3'}`}>
          {collapsed ? '•••' : 'Management'}
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    navigate(item.href);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    active
                      ? "bg-white text-primary shadow-lg shadow-white/20"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                >
                  <div className={`${active ? 'text-primary' : 'text-white/70 group-hover:text-white'} transition-colors`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {!collapsed && (
                    <div className="flex-1 text-left">
                      <span>{item.label}</span>
                    </div>
                  )}
                  {active && !collapsed && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/10 space-y-1">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    navigate(item.href);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all ${collapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {!collapsed && item.label}
                </button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
          );
        })}

        {/* Dark Mode Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleDarkMode}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all ${collapsed ? 'justify-center px-0' : ''}`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {!collapsed && (isDarkMode ? 'Light Mode' : 'Dark Mode')}
            </button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</TooltipContent>}
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && 'Logout'}
            </button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
        </Tooltip>
      </div>
    </TooltipProvider>
  );

  return (
    <div className="min-h-screen flex bg-gradient-soft">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col bg-gradient-to-b from-[#6366f1] via-[#7c3aed] to-[#6366f1] transition-all duration-300 ease-in-out rounded-r-3xl shadow-2xl shadow-primary/20 relative ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:scale-110 transition-transform z-10"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {renderSidebarContent(sidebarCollapsed)}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-80 p-0 bg-gradient-to-b from-[#6366f1] via-[#7c3aed] to-[#6366f1] border-0">
          <div className="flex flex-col h-full">
            {renderSidebarContent(false)}
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header - Mobile Only */}
        <header className="lg:hidden h-16 bg-white/80 backdrop-blur-xl border-b flex items-center justify-between px-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className="hover:bg-muted p-2 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#7c3aed] flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-foreground">Kalvion</span>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          <PageTransition key={location.pathname}>
            {children}
          </PageTransition>
        </main>

        {/* Bottom Navigation - Mobile only */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t h-20 flex items-center justify-around px-2 z-50 rounded-t-3xl shadow-lg">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all min-w-[60px] ${
                  active 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''} transition-transform`} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default PrincipalNav;
