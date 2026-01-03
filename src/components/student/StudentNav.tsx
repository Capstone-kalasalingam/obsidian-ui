import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  FileText,
  BookOpen,
  Bell,
  User,
  LogOut,
  Menu,
  CreditCard,
  CalendarDays,
  Lightbulb,
  ImagePlus,
  Trophy,
  TrendingUp,
  Bot,
  GraduationCap,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { studentProfile } from "@/data/studentMockData";
import KalvionChatbot from "./KalvionChatbot";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mainMenuItems = [
  { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboard, description: "Overview of daily learning" },
  { title: "Academic Calendar", url: "/student/calendar", icon: CalendarDays, description: "Schedule & exams" },
  { title: "AI Learning Guide", url: "/student/daily-learning", icon: Lightbulb, description: "Daily AI tasks" },
  { title: "Learn from Image", url: "/student/learn-image", icon: ImagePlus, description: "AI image explanation" },
  { title: "Study Materials", url: "/student/materials", icon: BookOpen, description: "Practice & homework" },
  { title: "Rewards", url: "/student/rewards", icon: Trophy, description: "Badges & XP points" },
  { title: "Growth Dashboard", url: "/student/growth", icon: TrendingUp, description: "Learning insights" },
];

const secondaryMenuItems = [
  { title: "Attendance", url: "/student/attendance", icon: ClipboardCheck },
  { title: "Marks", url: "/student/marks", icon: FileText },
  { title: "Fees", url: "/student/fees", icon: CreditCard },
  { title: "Announcements", url: "/student/announcements", icon: Bell },
];

const bottomMenuItems = [
  { title: "Profile", url: "/student/profile", icon: User },
  { title: "Settings", url: "/student/profile", icon: Settings },
  { title: "Help & Support", url: "/student/profile", icon: HelpCircle },
];

const bottomNavItems = [
  { title: "Home", url: "/student/dashboard", icon: LayoutDashboard },
  { title: "Learn", url: "/student/daily-learning", icon: Lightbulb },
  { title: "Kalvion", url: "chatbot", icon: Bot },
  { title: "Rewards", url: "/student/rewards", icon: Trophy },
  { title: "Profile", url: "/student/profile", icon: User },
];

export default function StudentNav({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    navigate("/");
  };

  const handleBottomNavClick = (url: string) => {
    if (url === "chatbot") {
      setChatbotOpen(true);
    } else {
      navigate(url);
    }
  };

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
              <p className="text-[10px] text-white/60 font-medium tracking-wide">Learn • Grow • Succeed</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Button */}
      <div className={`px-3 pb-4 ${collapsed ? 'px-2' : ''}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                setChatbotOpen(true);
                setMobileMenuOpen(false);
              }}
              className={`w-full bg-gradient-to-r from-accent to-emerald-400 hover:from-accent/90 hover:to-emerald-400/90 text-white border-0 gap-2 rounded-xl shadow-lg shadow-accent/30 transition-all hover:scale-[1.02] ${collapsed ? 'px-0 justify-center' : ''}`}
            >
              <Bot className="w-5 h-5" />
              {!collapsed && <span className="font-medium">Ask Kalvion</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Ask Kalvion AI</TooltipContent>}
        </Tooltip>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-smooth">
        <div className={`text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2 ${collapsed ? 'text-center' : 'px-3'}`}>
          {collapsed ? '•••' : 'Main Menu'}
        </div>
        
        {mainMenuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.url);
          
          return (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    navigate(item.url);
                    setMobileMenuOpen(false);
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
                      <span>{item.title}</span>
                    </div>
                  )}
                  {active && !collapsed && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
            </Tooltip>
          );
        })}

        {/* Secondary Items */}
        <div className={`text-[10px] font-semibold text-white/40 uppercase tracking-wider mt-6 mb-2 ${collapsed ? 'text-center' : 'px-3'}`}>
          {collapsed ? '•••' : 'Academic'}
        </div>
        
        {secondaryMenuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.url);
          
          return (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    navigate(item.url);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    active
                      ? "bg-white text-primary shadow-lg shadow-white/20"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                  {!collapsed && item.title}
                </button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
            </Tooltip>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/10 space-y-1">
        {/* Profile Card */}
        {!collapsed && (
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-emerald-400 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                {studentProfile.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{studentProfile.name}</p>
                <p className="text-white/60 text-xs">Class {studentProfile.class}{studentProfile.section}</p>
              </div>
            </div>
          </div>
        )}

        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    navigate(item.url);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all ${collapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {!collapsed && item.title}
                </button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
            </Tooltip>
          );
        })}

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
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
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
              onClick={() => setMobileMenuOpen(true)}
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
          
          <Button
            onClick={() => setChatbotOpen(true)}
            size="sm"
            className="gap-2 bg-gradient-to-r from-accent to-emerald-400 rounded-xl shadow-lg shadow-accent/30"
          >
            <Bot className="w-4 h-4" />
            Ask AI
          </Button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          {children}
        </main>

        {/* Bottom Navigation - Mobile only */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t h-20 flex items-center justify-around px-2 z-50 rounded-t-3xl shadow-lg">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = item.url !== "chatbot" && isActive(item.url);
            const isChatbot = item.url === "chatbot";
            
            return (
              <button
                key={item.title}
                onClick={() => handleBottomNavClick(item.url)}
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all min-w-[60px] ${
                  isChatbot 
                    ? ""
                    : active 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isChatbot ? (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#7c3aed] flex items-center justify-center -mt-8 shadow-xl border-4 border-white">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''} transition-transform`} />
                )}
                <span className={`text-xs font-medium ${isChatbot ? "mt-1" : ""}`}>
                  {item.title}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Kalvion Chatbot */}
      <KalvionChatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </div>
  );
}
