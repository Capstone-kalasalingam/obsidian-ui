import { useState } from "react";
import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { students } from "@/data/teacherMockData";
import { CheckCircle, XCircle, Briefcase, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type AttendanceStatus = "present" | "absent" | "leave";

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"own" | "students">("own");
  const [ownAttendance, setOwnAttendance] = useState<AttendanceStatus>("present");
  const [studentAttendance, setStudentAttendance] = useState(
    students.reduce((acc, student) => {
      acc[student.id] = "present";
      return acc;
    }, {} as Record<number, AttendanceStatus>)
  );
  const { toast } = useToast();

  // Mock attendance data for calendar highlighting
  const attendanceHistory = {
    present: [1, 2, 5, 6, 8, 9, 12, 13, 15, 16, 19, 20, 22, 23],
    absent: [3, 10, 17],
    leave: [7, 14, 21],
  };

  const toggleStudentAttendance = (studentId: number, status: AttendanceStatus) => {
    setStudentAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === status ? "present" : status,
    }));
  };

  const handleSaveAttendance = () => {
    if (view === "own") {
      toast({
        title: "Attendance Marked",
        description: `You marked yourself as ${ownAttendance} for ${format(selectedDate, "PPP")}`,
      });
    } else {
      const summary = Object.values(studentAttendance).reduce(
        (acc, status) => {
          acc[status]++;
          return acc;
        },
        { present: 0, absent: 0, leave: 0 }
      );
      toast({
        title: "Student Attendance Saved",
        description: `Present: ${summary.present}, Absent: ${summary.absent}, Leave: ${summary.leave}`,
      });
    }
  };

  const ownAttendanceSummary = {
    present: attendanceHistory.present.length,
    absent: attendanceHistory.absent.length,
    leave: attendanceHistory.leave.length,
  };

  return (
    <TeacherNav>
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          {/* Header */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Attendance</h1>
            <p className="text-muted-foreground">
              Manage your attendance and track student presence
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex gap-3 mb-6 animate-slide-up">
            <Button
              variant={view === "own" ? "default" : "outline"}
              onClick={() => setView("own")}
              className="flex-1 h-12 font-semibold"
            >
              Own Attendance
            </Button>
            <Button
              variant={view === "students" ? "default" : "outline"}
              onClick={() => setView("students")}
              className="flex-1 h-12 font-semibold"
            >
              Student Attendance
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Calendar Section */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-5 w-5" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className={cn("rounded-md pointer-events-auto")}
                      initialFocus
                      modifiers={{
                        present: (date) =>
                          attendanceHistory.present.includes(date.getDate()) &&
                          view === "own",
                        absent: (date) =>
                          attendanceHistory.absent.includes(date.getDate()) &&
                          view === "own",
                        onLeave: (date) =>
                          attendanceHistory.leave.includes(date.getDate()) &&
                          view === "own",
                      }}
                      modifiersClassNames={{
                        present: "bg-primary/20 text-primary font-bold hover:bg-primary/30",
                        absent: "bg-destructive/20 text-destructive font-bold hover:bg-destructive/30",
                        onLeave: "bg-orange-500/20 text-orange-600 font-bold hover:bg-orange-500/30",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            {/* Attendance Actions */}
            <div className="space-y-6">
              {view === "own" ? (
                /* Own Attendance View */
                <div className="space-y-6 animate-slide-in-left">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Status Buttons */}
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setOwnAttendance("present")}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                            ownAttendance === "present"
                              ? "bg-primary border-primary text-primary-foreground shadow-lg scale-105"
                              : "bg-background border-border hover:border-primary/50"
                          )}
                        >
                          <CheckCircle className="w-6 h-6" />
                          <div className="font-semibold text-sm">Present</div>
                        </button>
                        <button
                          onClick={() => setOwnAttendance("absent")}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                            ownAttendance === "absent"
                              ? "bg-destructive border-destructive text-destructive-foreground shadow-lg scale-105"
                              : "bg-background border-border hover:border-destructive/50"
                          )}
                        >
                          <XCircle className="w-6 h-6" />
                          <div className="font-semibold text-sm">Absent</div>
                        </button>
                        <button
                          onClick={() => setOwnAttendance("leave")}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                            ownAttendance === "leave"
                              ? "bg-orange-500 border-orange-500 text-white shadow-lg scale-105"
                              : "bg-background border-border hover:border-orange-500/50"
                          )}
                        >
                          <Briefcase className="w-6 h-6" />
                          <div className="font-semibold text-sm">Leave</div>
                        </button>
                      </div>

                      <Button onClick={handleSaveAttendance} className="w-full h-11">
                        Save Attendance
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Attendance Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Monthly Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-primary" />
                          </div>
                          <div className="text-2xl font-bold">
                            {ownAttendanceSummary.present}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Days Present
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-destructive" />
                          </div>
                          <div className="text-2xl font-bold">
                            {ownAttendanceSummary.absent}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Days Absent
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-full bg-orange-500/10 flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-orange-600" />
                          </div>
                          <div className="text-2xl font-bold">
                            {ownAttendanceSummary.leave}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            On Leave
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                /* Student Attendance View */
                <div className="space-y-6 animate-slide-in-left">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Class 10 · Section A
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                      {students.slice(0, 6).map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-semibold text-base">{student.name}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                toggleStudentAttendance(student.id, "present")
                              }
                              className={cn(
                                "w-12 h-12 rounded-full font-bold text-base transition-all shadow-sm",
                                studentAttendance[student.id] === "present"
                                  ? "bg-green-500 text-white shadow-md scale-105"
                                  : "bg-background border-2 border-border text-muted-foreground hover:border-green-500/50"
                              )}
                            >
                              P
                            </button>
                            <button
                              onClick={() =>
                                toggleStudentAttendance(student.id, "absent")
                              }
                              className={cn(
                                "w-12 h-12 rounded-full font-bold text-base transition-all shadow-sm",
                                studentAttendance[student.id] === "absent"
                                  ? "bg-red-500 text-white shadow-md scale-105"
                                  : "bg-background border-2 border-border text-muted-foreground hover:border-red-500/50"
                              )}
                            >
                              A
                            </button>
                            <button
                              onClick={() =>
                                toggleStudentAttendance(student.id, "leave")
                              }
                              className={cn(
                                "w-12 h-12 rounded-full font-bold text-base transition-all shadow-sm",
                                studentAttendance[student.id] === "leave"
                                  ? "bg-orange-500 text-white shadow-md scale-105"
                                  : "bg-background border-2 border-border text-muted-foreground hover:border-orange-500/50"
                              )}
                            >
                              L
                            </button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Button onClick={handleSaveAttendance} className="w-full h-11">
                    Save Student Attendance
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          {view === "own" && (
            <Card className="mt-6 animate-fade-in">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary/20 border border-primary/40" />
                    <span className="text-muted-foreground">Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-destructive/20 border border-destructive/40" />
                    <span className="text-muted-foreground">Absent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-500/20 border border-orange-500/40" />
                    <span className="text-muted-foreground">On Leave</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TeacherNav>
  );
}
