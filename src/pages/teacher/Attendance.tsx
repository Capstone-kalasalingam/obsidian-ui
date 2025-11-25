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
import { CheckCircle, XCircle, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type AttendanceStatus = "present" | "absent";

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
    absent: [3, 10, 17, 7, 14, 21],
  };

  const toggleStudentAttendance = (studentId: number) => {
    setStudentAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
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
        { present: 0, absent: 0 }
      );
      toast({
        title: "Student Attendance Saved",
        description: `Present: ${summary.present}, Absent: ${summary.absent}`,
      });
    }
  };

  const ownAttendanceSummary = {
    present: attendanceHistory.present.length,
    absent: attendanceHistory.absent.length,
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
                      }}
                      modifiersClassNames={{
                        present: "bg-primary/20 text-primary font-bold hover:bg-primary/30",
                        absent: "bg-destructive/20 text-destructive font-bold hover:bg-destructive/30",
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
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setOwnAttendance("present")}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                            ownAttendance === "present"
                              ? "bg-green-500 border-green-500 text-white shadow-lg scale-105"
                              : "bg-background border-border hover:border-green-500/50"
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
                              ? "bg-red-500 border-red-500 text-white shadow-lg scale-105"
                              : "bg-background border-border hover:border-red-500/50"
                          )}
                        >
                          <XCircle className="w-6 h-6" />
                          <div className="font-semibold text-sm">Absent</div>
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
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          </div>
                          <div className="text-2xl font-bold">
                            {ownAttendanceSummary.present}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Days Present
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-500" />
                          </div>
                          <div className="text-2xl font-bold">
                            {ownAttendanceSummary.absent}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Days Absent
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                /* Student Attendance View */
                <div className="space-y-6 animate-slide-in-left">
                  {/* Real-time Summary Counter */}
                  <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-green-500">
                              {Object.values(studentAttendance).filter(s => s === "present").length}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">Present</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-500" />
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-red-500">
                              {Object.values(studentAttendance).filter(s => s === "absent").length}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">Absent</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

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
                          <button
                            onClick={() => toggleStudentAttendance(student.id)}
                            className={cn(
                              "relative w-32 h-12 rounded-full font-bold text-sm transition-all shadow-sm flex items-center justify-between px-2",
                              studentAttendance[student.id] === "present"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            )}
                          >
                            <span className={cn(
                              "flex-1 text-center transition-opacity",
                              studentAttendance[student.id] === "present" ? "opacity-100" : "opacity-50"
                            )}>
                              Present
                            </span>
                            <span className={cn(
                              "flex-1 text-center transition-opacity",
                              studentAttendance[student.id] === "absent" ? "opacity-100" : "opacity-50"
                            )}>
                              Absent
                            </span>
                            <div
                              className={cn(
                                "absolute top-1 w-14 h-10 bg-white rounded-full shadow-md transition-all",
                                studentAttendance[student.id] === "present"
                                  ? "left-1"
                                  : "right-1"
                              )}
                            />
                          </button>
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
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TeacherNav>
  );
}
