import TeacherNav from "@/components/teacher/TeacherNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Percent,
  Upload,
  FileText,
  Megaphone,
  ChevronRight,
} from "lucide-react";

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: "Attendance",
      subtitle: "View own attendance",
      icon: Calendar,
      path: "/teacher/attendance",
      gridArea: "attendance",
    },
    {
      title: "Take Attendance",
      subtitle: "Mark students' attendance",
      icon: Users,
      path: "/teacher/attendance",
      gridArea: "take",
    },
    {
      title: "Class Progress",
      subtitle: "View weekly progress",
      icon: Percent,
      path: "/teacher/progress",
      gridArea: "progress",
    },
    {
      title: "Upload Materials",
      subtitle: "Upload study materials",
      icon: Upload,
      path: "/teacher/study-material",
      gridArea: "upload",
    },
    {
      title: "Previous Question Papers",
      subtitle: "Upload past question papers",
      icon: FileText,
      path: "/teacher/study-material",
      gridArea: "papers",
    },
    {
      title: "Announcements",
      subtitle: "Make announcements",
      icon: Megaphone,
      path: "/teacher/announcements",
      gridArea: "announce",
    },
  ];

  return (
    <TeacherNav>
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              AL
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Alexandra Lewis</h1>
            <p className="text-muted-foreground">Teacher</p>
          </div>
        </div>

        {/* Dashboard Title */}
        <h2 className="text-3xl font-bold mb-6 animate-slide-up">Dashboard</h2>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-background"
                onClick={() => navigate(card.path)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-soft-bg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base mb-1">
                        {card.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-tight">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alternative List View (hidden on mobile, shown on desktop) */}
        <Card className="mt-6 hidden md:block border-0">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {dashboardCards.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-soft-bg transition-colors text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-soft-bg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.subtitle}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </TeacherNav>
  );
}
