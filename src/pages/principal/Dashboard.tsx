import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent } from "@/components/ui/card";
import { mockTeachers, mockClasses, mockAnnouncements, mockAttendanceData } from "@/data/mockData";
import {
  Users,
  GraduationCap,
  BookOpen,
  UserCog,
  Calendar,
  TrendingUp,
  ClipboardCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const totalTeachers = mockTeachers.length;
  const totalStudents = mockClasses.reduce((sum, cls) => sum + cls.students, 0);
  const totalClasses = mockClasses.length;
  const nonTeachingStaff = 18;
  const totalTeacherCount = mockAttendanceData.teachersPresent + mockAttendanceData.teachersAbsent;
  const totalStudentCount = mockAttendanceData.studentsPresent + mockAttendanceData.studentsAbsent;
  const teacherAttendance = Math.round((mockAttendanceData.teachersPresent / totalTeacherCount) * 100);
  const studentAttendance = mockAttendanceData.studentsPresent;

  const summaryCards = [
    {
      title: "Teachers",
      value: totalTeachers,
      icon: Users,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Students",
      value: totalStudents,
      icon: GraduationCap,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Classes",
      value: totalClasses,
      icon: BookOpen,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Non-Teaching Staff",
      value: nonTeachingStaff,
      icon: UserCog,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Teacher Attendance",
      value: `${teacherAttendance}%`,
      subtitle: `${mockAttendanceData.teachersPresent}/${totalTeacherCount} Present`,
      icon: ClipboardCheck,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Student Attendance",
      value: studentAttendance,
      subtitle: `${Math.round((studentAttendance / totalStudentCount) * 100)}% Present Today`,
      icon: TrendingUp,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <PrincipalNav>
      <div className="px-4 py-6 space-y-6">
        {/* Profile Summary */}
        <div className="animate-fade-in bg-card rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <Users className="w-10 h-10 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-xl mb-0.5">Premchandh C</h2>
              <p className="text-sm text-muted-foreground">Principal</p>
            </div>
          </div>
        </div>

        {/* 2x3 Summary Grid */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card 
                key={index} 
                className="bg-card border border-border rounded-2xl hover:shadow-lg transition-all duration-200 active:scale-[0.98] cursor-pointer"
                onClick={() => {
                  if (card.title === "Teachers") navigate("/principal/staff");
                  else if (card.title === "Classes") navigate("/principal/classes");
                  else if (card.title.includes("Attendance")) navigate("/principal/attendance");
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-10 h-10 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${card.iconColor}`} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">{card.value}</p>
                  <p className="text-sm font-medium text-foreground leading-tight">{card.title}</p>
                  {card.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Latest Announcements */}
        <div className="animate-slide-up">
          <h3 className="font-bold text-lg mb-3">Latest Announcements</h3>
          <div className="space-y-2">
            {mockAnnouncements.slice(0, 2).map((announcement) => (
              <div 
                key={announcement.id} 
                className="flex items-center gap-3 py-2"
              >
                <div className="w-1.5 h-1.5 bg-foreground rounded-full flex-shrink-0"></div>
                <p className="text-sm text-foreground">{announcement.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PrincipalNav>
  );
};

export default Dashboard;
