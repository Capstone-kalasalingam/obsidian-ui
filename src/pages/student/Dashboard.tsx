import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  FileText, 
  BookOpen, 
  CalendarDays, 
  DollarSign, 
  Megaphone 
} from "lucide-react";
import { Link } from "react-router-dom";
import { studentProfile } from "@/data/studentMockData";

const Dashboard = () => {
  const quickAccessItems = [
    { 
      title: "Attendance", 
      icon: CheckCircle, 
      path: "/student/attendance",
      bgColor: "bg-background"
    },
    { 
      title: "Marks", 
      icon: FileText, 
      path: "/student/marks",
      bgColor: "bg-background"
    },
    { 
      title: "Study Materials", 
      icon: BookOpen, 
      path: "/student/materials",
      bgColor: "bg-background"
    },
    { 
      title: "Timetable", 
      icon: CalendarDays, 
      path: "/student/attendance",
      bgColor: "bg-background"
    },
    { 
      title: "Fees", 
      icon: DollarSign, 
      path: "/student/fees",
      bgColor: "bg-background"
    },
    { 
      title: "Announcements", 
      icon: Megaphone, 
      path: "/student/announcements",
      bgColor: "bg-background"
    },
  ];

  return (
    <StudentNav>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">
                {studentProfile.name.charAt(0)}
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-1">Hello, {studentProfile.name.split(' ')[0]}</h1>
          <p className="text-muted-foreground">Class {studentProfile.class}</p>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up">
          {quickAccessItems.map((item, index) => (
            <Link key={item.path} to={item.path}>
              <Card 
                className={`${item.bgColor} border shadow-sm hover:shadow-md transition-all cursor-pointer h-full`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="w-14 h-14 rounded-2xl border-2 border-border flex items-center justify-center">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <span className="text-base font-semibold">{item.title}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </StudentNav>
  );
};

export default Dashboard;
