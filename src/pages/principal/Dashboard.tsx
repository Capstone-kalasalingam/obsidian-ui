import PrincipalNav from "@/components/principal/PrincipalNav";
import SummaryCard from "@/components/principal/dashboard/SummaryCard";
import PerformanceChart from "@/components/principal/dashboard/PerformanceChart";
import StudentOverviewTable from "@/components/principal/dashboard/StudentOverviewTable";
import RecentActivityCard from "@/components/principal/dashboard/RecentActivityCard";
import CalendarWidget from "@/components/principal/dashboard/CalendarWidget";
import { useDashboardStats, useAnnouncements } from "@/hooks/usePrincipalData";
import {
  Users,
  GraduationCap,
  TrendingUp,
  BookOpen,
} from "lucide-react";

const Dashboard = () => {
  const { totalTeachers, totalStudents, totalClasses, loading } = useDashboardStats();
  const { announcements } = useAnnouncements();

  const summaryCards = [
    {
      title: "Total Students",
      value: loading ? 0 : totalStudents,
      subtitle: "Active enrollments",
      icon: GraduationCap,
      gradientClass: "bg-gradient-to-br from-kalvion-blue to-kalvion-purple",
    },
    {
      title: "Total Teachers",
      value: loading ? 0 : totalTeachers,
      subtitle: "Faculty members",
      icon: Users,
      gradientClass: "bg-gradient-cool",
    },
    {
      title: "Attendance Consistency",
      value: "92%",
      subtitle: "This month average",
      icon: TrendingUp,
      gradientClass: "bg-gradient-green",
    },
    {
      title: "Learning Consistency",
      value: "85%",
      subtitle: "Student engagement",
      icon: BookOpen,
      gradientClass: "bg-gradient-amber",
    },
  ];

  return (
    <PrincipalNav>
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Summary Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, index) => (
            <SummaryCard
              key={card.title}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              icon={card.icon}
              gradientClass={card.gradientClass}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts and Table */}
          <div className="lg:col-span-2 space-y-6">
            <PerformanceChart />
            <StudentOverviewTable />
          </div>

          {/* Right Column - Activity, Calendar */}
          <div className="space-y-6">
            <RecentActivityCard />
            <CalendarWidget />
          </div>
        </div>
      </div>
    </PrincipalNav>
  );
};

export default Dashboard;
