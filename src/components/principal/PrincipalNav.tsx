import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
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
  UserCheck,
  UserCog,
  ChevronLeft,
  Settings,
  CreditCard,
} from "lucide-react";

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
  { label: "Profile", href: "/principal/profile", icon: User },
];

const SidebarNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link to="/principal/dashboard" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary flex-shrink-0" />
          {!collapsed && <span className="font-bold text-lg">Kalvion</span>}
        </Link>
      </div>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link to={item.href} className="flex items-center gap-3">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto border-t border-border p-4 space-y-2">
        <SidebarMenuButton asChild tooltip="Profile">
          <Link to="/principal/profile" className="flex items-center gap-3">
            <User className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Profile</span>}
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton
          onClick={handleLogout}
          tooltip="Logout"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </SidebarMenuButton>
      </div>
    </Sidebar>
  );
};

const PrincipalNav = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const getPageTitle = () => {
    const currentItem = navItems.find(item => item.href === location.pathname);
    return currentItem?.label || "Dashboard";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <SidebarNav />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="sticky top-0 z-40 h-14 border-b border-border bg-background flex items-center justify-between px-4">
            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="flex flex-col h-full bg-background">
                  <div className="flex h-14 items-center border-b border-border px-4">
                    <Link to="/principal/dashboard" className="flex items-center gap-2">
                      <GraduationCap className="h-6 w-6 text-primary" />
                      <span className="font-bold text-lg">Kalvion</span>
                    </Link>
                  </div>

                  <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-secondary"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="border-t border-border p-4 space-y-2">
                    <Link
                      to="/principal/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary"
                    >
                      <User className="h-5 w-5" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop: Sidebar Toggle */}
            <div className="hidden md:flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-lg font-semibold">{getPageTitle()}</span>
            </div>

            {/* Mobile: Page Title */}
            <h1 className="md:hidden font-semibold text-base">{getPageTitle()}</h1>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 pb-20 md:pb-0 overflow-auto">
            {children}
          </main>

          {/* Bottom Navigation - Mobile only */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 flex items-center justify-around px-2 z-50">
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
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PrincipalNav;
