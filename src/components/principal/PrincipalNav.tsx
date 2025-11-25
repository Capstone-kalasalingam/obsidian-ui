import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  Megaphone,
  FileText,
  User,
  LogOut,
  Menu,
  Bell,
  GraduationCap,
  UsersRound,
  UserPlus,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/principal/dashboard", icon: LayoutDashboard },
  { label: "Staff Management", href: "/principal/staff", icon: Users },
  { label: "Classes", href: "/principal/classes", icon: BookOpen },
  { label: "Assign Teacher", href: "/principal/assign-class-teacher", icon: UserPlus },
  { label: "Attendance", href: "/principal/attendance", icon: ClipboardCheck },
  { label: "Announcements", href: "/principal/announcements", icon: Megaphone },
  { label: "Reports", href: "/principal/reports", icon: FileText },
];

const bottomNavItems = [
  { label: "Dashboard", href: "/principal/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/principal/attendance", icon: UsersRound },
  { label: "Teachers", href: "/principal/staff", icon: Users },
  { label: "Profile", href: "/principal/dashboard", icon: User },
];

const PrincipalNav = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    navigate("/principal/login");
  };

  const getPageTitle = () => {
    const currentItem = navItems.find(item => item.href === location.pathname);
    return currentItem?.label || "Dashboard";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="sticky top-0 z-50 w-full bg-background border-b border-border">
        <div className="flex h-14 items-center justify-between px-4">
        {/* Mobile Menu Trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex flex-col h-full bg-background">
              {/* Sidebar Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Dr. Sarah Johnson</p>
                    <p className="text-xs text-muted-foreground">Principal</p>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 py-6 px-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-border space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-4 px-4"
                  onClick={() => {
                    setMobileOpen(false);
                    // Navigate to profile
                  }}
                >
                  <User className="w-5 h-5" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-4 px-4 text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo - Hidden on mobile, shown on desktop */}
        <Link to="/principal/dashboard" className="hidden md:flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          <span className="font-semibold text-base">SchoolHub</span>
        </Link>

        {/* Page Title - Centered on mobile */}
        <h1 className="md:hidden font-semibold text-base absolute left-1/2 transform -translate-x-1/2">
          {getPageTitle()}
        </h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="w-5 h-5" />
          </Button>
        </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom Navigation - Mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t h-16 flex items-center justify-around px-2 z-50">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors min-w-[64px] ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default PrincipalNav;
