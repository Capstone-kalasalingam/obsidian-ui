import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Lightbulb, 
  CalendarDays, 
  ImagePlus, 
  Trophy, 
  TrendingUp,
  BookOpen,
  FileText,
  ClipboardCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { studentProfile } from "@/data/studentMockData";

const Dashboard = () => {
  const quickAccessItems = [
    { 
      title: "Daily Learning", 
      icon: Lightbulb, 
      path: "/student/daily-learning",
      description: "Your tasks for today",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    { 
      title: "Calendar", 
      icon: CalendarDays, 
      path: "/student/calendar",
      description: "Exams & holidays",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      title: "Learn from Image", 
      icon: ImagePlus, 
      path: "/student/learn-image",
      description: "Upload & understand",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    { 
      title: "Rewards", 
      icon: Trophy, 
      path: "/student/rewards",
      description: "Your achievements",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    { 
      title: "My Growth", 
      icon: TrendingUp, 
      path: "/student/growth",
      description: "Track progress",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    { 
      title: "Study Materials", 
      icon: BookOpen, 
      path: "/student/materials",
      description: "Notes & PDFs",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10"
    },
    { 
      title: "Marks", 
      icon: FileText, 
      path: "/student/marks",
      description: "Exam results",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10"
    },
    { 
      title: "Attendance", 
      icon: ClipboardCheck, 
      path: "/student/attendance",
      description: "Your presence",
      color: "text-teal-500",
      bgColor: "bg-teal-500/10"
    },
  ];

  return (
    <StudentNav>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">
              {studentProfile.name.charAt(0)}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Hello, {studentProfile.name.split(' ')[0]}! 👋</h1>
          <p className="text-muted-foreground">Class {studentProfile.class}-{studentProfile.section}</p>
        </div>

        {/* Today's Tip */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">Today's Learning Tip</p>
              <p className="text-sm text-muted-foreground">
                Spend 10 minutes revising what you learned yesterday. It helps remember better! 🧠
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Grid */}
        <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 gap-4 animate-slide-up">
          {quickAccessItems.map((item, index) => (
            <Link key={item.path} to={item.path}>
              <Card 
                className="border shadow-sm hover:shadow-md transition-all cursor-pointer h-full hover:border-primary/30"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold">{item.title}</span>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Motivation */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          "Every day is a chance to learn something new!" ✨
        </p>
      </div>
    </StudentNav>
  );
};

export default Dashboard;
