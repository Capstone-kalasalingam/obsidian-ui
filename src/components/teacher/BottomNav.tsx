import { useLocation, useNavigate } from "react-router-dom";
import { Home, CheckSquare, CalendarDays, BookOpen, User } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/teacher/dashboard" },
  { icon: CheckSquare, label: "Attendance", path: "/teacher/attendance" },
  { icon: CalendarDays, label: "Calendar", path: "/teacher/calendar" },
  { icon: BookOpen, label: "Study", path: "/teacher/study-material" },
  { icon: User, label: "Profile", path: "/teacher/profile" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border lg:hidden z-50">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
