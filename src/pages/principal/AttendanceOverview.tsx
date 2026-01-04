import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent } from "@/components/ui/card";
import { useTeachers, useStudents } from "@/hooks/usePrincipalData";
import { Calendar, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const AttendanceOverview = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { teachers, loading: teachersLoading } = useTeachers();
  const { students, loading: studentsLoading } = useStudents();

  const loading = teachersLoading || studentsLoading;

  return (
    <PrincipalNav>
      <div className="px-4 py-6 space-y-6">
        {/* Date Selector */}
        <div className="space-y-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border border-border rounded-2xl shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                <p className="text-3xl font-bold mb-1">{teachers.length}</p>
              )}
              <p className="text-sm font-medium text-foreground">Total Teachers</p>
              <p className="text-xs text-muted-foreground mt-1">Active staff</p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border rounded-2xl shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                <p className="text-3xl font-bold mb-1">{students.length}</p>
              )}
              <p className="text-sm font-medium text-foreground">Total Students</p>
              <p className="text-xs text-muted-foreground mt-1">Enrolled students</p>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="bg-card border border-border rounded-2xl">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Attendance Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Detailed attendance tracking will be available soon. Currently showing total counts of teachers and students in the system.
            </p>
          </CardContent>
        </Card>
      </div>
    </PrincipalNav>
  );
};

export default AttendanceOverview;