import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar, TrendingUp } from "lucide-react";
import { attendanceData, monthlyAttendance } from "@/data/studentMockData";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Convert attendance data to a map for easy lookup
  const attendanceMap = attendanceData.reduce((acc, record) => {
    const dateKey = new Date(record.date).toDateString();
    acc[dateKey] = record.status;
    return acc;
  }, {} as Record<string, string>);

  // Get present and absent dates for calendar highlighting
  const presentDates = attendanceData
    .filter(record => record.status === "Present")
    .map(record => new Date(record.date));
  
  const absentDates = attendanceData
    .filter(record => record.status === "Absent")
    .map(record => new Date(record.date));

  return (
    <StudentNav>
      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
        {/* Overview Card */}
        <Card className="shadow-lg border animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Calendar className="h-5 w-5" />
              Monthly Overview - March 2024
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-primary/5 rounded-lg">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Attendance Rate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-bold text-primary">{monthlyAttendance.percentage}%</span>
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
              </div>
              <div className="p-3 md:p-4 bg-primary/5 rounded-lg">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Days</p>
                <span className="text-2xl md:text-3xl font-bold">{monthlyAttendance.totalDays}</span>
              </div>
              <div className="p-3 md:p-4 bg-primary/5 rounded-lg">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Present Days</p>
                <span className="text-2xl md:text-3xl font-bold text-primary">{monthlyAttendance.presentDays}</span>
              </div>
              <div className="p-3 md:p-4 bg-destructive/5 rounded-lg">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Absent Days</p>
                <span className="text-2xl md:text-3xl font-bold text-destructive">{monthlyAttendance.absentDays}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calendar View */}
          <Card className="shadow-lg border animate-slide-up">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Attendance Calendar</CardTitle>
              <p className="text-sm text-muted-foreground">Visual representation of your attendance</p>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className={cn("rounded-md border pointer-events-auto")}
                modifiers={{
                  present: presentDates,
                  absent: absentDates,
                }}
                modifiersClassNames={{
                  present: "bg-primary/20 text-primary font-bold hover:bg-primary/30 border-primary/40",
                  absent: "bg-destructive/20 text-destructive font-bold hover:bg-destructive/30 border-destructive/40",
                }}
              />
            </CardContent>
            <CardContent className="pt-0">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary/20 border border-primary/40" />
                  <span className="text-muted-foreground">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-destructive/20 border border-destructive/40" />
                  <span className="text-muted-foreground">Absent</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Records */}
          <Card className="shadow-lg border animate-slide-up">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Attendance Records</CardTitle>
              <p className="text-sm text-muted-foreground">Recent attendance history</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {attendanceData.map((record) => (
                  <div
                    key={record.date}
                    className="flex items-center justify-between p-3 md:p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm md:text-base">
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                      </p>
                    </div>
                    <Badge
                      variant={record.status === "Present" ? "default" : "destructive"}
                      className="font-medium text-xs md:text-sm"
                    >
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Note */}
        <Card className="shadow-md border bg-primary/5 animate-slide-up">
          <CardContent className="p-4">
            <p className="text-sm text-foreground">
              <strong>Demo Mode:</strong> This is read-only attendance data for demonstration purposes only.
            </p>
          </CardContent>
        </Card>
      </div>
    </StudentNav>
  );
};

export default Attendance;
