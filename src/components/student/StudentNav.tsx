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
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { studentProfile } from "@/data/studentMockData";
import KalvionChatbot from "./KalvionChatbot";

const menuItems = [
  { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboard },
  { title: "Daily Learning", url: "/student/daily-learning", icon: Lightbulb },
  { title: "Calendar", url: "/student/calendar", icon: CalendarDays },
  { title: "Learn from Image", url: "/student/learn-image", icon: ImagePlus },
  { title: "Rewards", url: "/student/rewards", icon: Trophy },
  { title: "My Growth", url: "/student/growth", icon: TrendingUp },
  { title: "Attendance", url: "/student/attendance", icon: ClipboardCheck },
  { title: "Marks", url: "/student/marks", icon: FileText },
  { title: "Study Materials", url: "/student/materials", icon: BookOpen },
  { title: "Fees", url: "/student/fees", icon: CreditCard },
  { title: "Announcements", url: "/student/announcements", icon: Bell },
  { title: "Profile", url: "/student/profile", icon: User },
];

const bottomNavItems = [
  { title: "Home", url: "/student/dashboard", icon: LayoutDashboard },
  { title: "Learn", url: "/student/daily-learning", icon: Lightbulb },
  { title: "Kalvion", url: "chatbot", icon: Bot },
  { title: "Rewards", url: "/student/rewards", icon: Trophy },
  { title: "Profile", url: "/student/profile", icon: User },
];

const sidebarIcons = [
  { icon: LayoutDashboard, url: "/student/dashboard", label: "Dashboard" },
  { icon: CalendarDays, url: "/student/calendar", label: "Calendar" },
  { icon: Lightbulb, url: "/student/daily-learning", label: "Learning" },
  { icon: Trophy, url: "/student/rewards", label: "Rewards" },
  { icon: User, url: "/student/profile", label: "Profile" },
];

export default function StudentNav({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

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

  const renderSidebarContent = () => (
    <>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white text-sm">{studentProfile.name}</h2>
            <p className="text-xs text-white/70">
              Class {studentProfile.class}{studentProfile.section}
            </p>
          </div>
        </div>
      </div>

      {/* Kalvion Bot Button */}
      <div className="px-4 pt-4">
        <Button
          onClick={() => {
            setChatbotOpen(true);
            setMobileMenuOpen(false);
          }}
          className="w-full bg-white/20 hover:bg-white/30 text-white border-0 gap-2 rounded-xl"
        >
          <Bot className="w-5 h-5" />
          Ask Kalvion
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-4 space-y-1 overflow-y-auto scrollbar-smooth">
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
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-white text-primary shadow-lg"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.title}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 px-4 text-white/80 hover:text-white hover:bg-white/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-gradient-soft">
      {/* Desktop Left Icon Sidebar */}
      <aside className="hidden lg:flex w-20 bg-gradient-to-b from-primary via-primary to-violet-700 flex-col items-center py-6 rounded-r-3xl shadow-2xl">
        {/* Logo */}
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-8">
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        {/* Icon Navigation */}
        <nav className="flex-1 flex flex-col items-center gap-2">
          {sidebarIcons.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.url);
            return (
              <button
                key={item.url}
                onClick={() => navigate(item.url)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group relative ${
                  active
                    ? "bg-white text-primary shadow-lg"
                    : "text-white/70 hover:bg-white/15 hover:text-white"
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                {/* Tooltip */}
                <span className="absolute left-16 bg-foreground text-background px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* AI Bot Button */}
        <button
          onClick={() => setChatbotOpen(true)}
          className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform mt-4"
          title="Ask Kalvion"
        >
          <Bot className="w-5 h-5" />
        </button>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0 bg-gradient-to-b from-primary via-primary to-violet-700 border-0">
          <div className="flex flex-col h-full">
            {renderSidebarContent()}
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
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <Button
            onClick={() => setChatbotOpen(true)}
            size="sm"
            className="gap-2 bg-primary rounded-xl"
          >
            <Bot className="w-4 h-4" />
            Kalvion
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
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center -mt-8 shadow-xl border-4 border-white">
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
