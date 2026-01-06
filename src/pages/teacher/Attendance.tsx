import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  XCircle,
  CalendarDays,
  Users,
  BookOpen,
  Sparkles,
  Clock,
  TrendingUp,
  MessageSquare,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type AttendanceStatus = "present" | "absent";

interface Student {
  id: string;
  roll_number: string;
  profile: {
    full_name: string;
  };
}

interface ClassInfo {
  id: string;
  name: string;
  section: string;
}

export default function Attendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMonth, setViewMonth] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [studentAttendance, setStudentAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [topicExplanation, setTopicExplanation] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch teacher's assigned classes
  const { data: assignedClasses = [], isLoading: classesLoading } = useQuery({
    queryKey: ["teacher-classes", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data: teacher } = await supabase
        .from("teachers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!teacher) return [];

      const { data: assignments } = await supabase
        .from("teacher_assignments")
        .select(`
          class_id,
          classes (id, name, section)
        `)
        .eq("teacher_id", teacher.id);

      const uniqueClasses = new Map();
      assignments?.forEach((a) => {
        if (a.classes) {
          uniqueClasses.set(a.classes.id, a.classes);
        }
      });

      return Array.from(uniqueClasses.values()) as ClassInfo[];
    },
    enabled: !!user?.id,
  });

  // Fetch students for selected class
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ["class-students", selectedClass],
    queryFn: async () => {
      if (!selectedClass) return [];

      const { data } = await supabase
        .from("students")
        .select(`
          id,
          roll_number,
          profile:profiles!students_user_id_fkey (full_name)
        `)
        .eq("class_id", selectedClass)
        .eq("status", "active")
        .order("roll_number", { ascending: true });

      return (data || []) as unknown as Student[];
    },
    enabled: !!selectedClass,
  });

  // Initialize attendance when students load
  useEffect(() => {
    if (students.length > 0) {
      const initial: Record<string, AttendanceStatus> = {};
      students.forEach((s) => {
        initial[s.id] = "present";
      });
      setStudentAttendance(initial);
    }
  }, [students]);

  const toggleStudentAttendance = (studentId: string) => {
    setStudentAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
    }));
  };

  const presentCount = Object.values(studentAttendance).filter((s) => s === "present").length;
  const absentCount = Object.values(studentAttendance).filter((s) => s === "absent").length;
  const attendancePercentage = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  const handleSubmitAttendance = () => {
    if (!topicExplanation.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter what topic you covered today before submitting attendance.",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmAndSave = async () => {
    setIsSaving(true);
    
    // Simulate save - in real implementation, save to database
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Attendance Saved Successfully",
      description: `Recorded ${presentCount} present, ${absentCount} absent for ${format(selectedDate, "PPP")}`,
    });

    setShowConfirmDialog(false);
    setTopicExplanation("");
    setIsSaving(false);
  };

  const selectedClassInfo = assignedClasses.find((c) => c.id === selectedClass);

  return (
    <TeacherNav>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Premium Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-6 md:p-8 border border-primary/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Student Attendance</h1>
                    <p className="text-muted-foreground">Mark attendance and record today's topic</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary/30 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Calendar & Class Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Class Selection */}
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-3 border-b border-border/50">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Select Class
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {classesLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Choose a class" />
                      </SelectTrigger>
                      <SelectContent>
                        {assignedClasses.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name} - {cls.section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </CardContent>
              </Card>

              {/* Calendar */}
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-2 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-primary" />
                      {format(viewMonth, "MMMM yyyy")}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setViewMonth(subMonths(viewMonth, 1))}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setViewMonth(addMonths(viewMonth, 1))}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    month={viewMonth}
                    onMonthChange={setViewMonth}
                    className="rounded-xl"
                  />
                </CardContent>
              </Card>

              {/* Quick Stats */}
              {selectedClass && students.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 mb-3">
                          <span className="text-2xl font-bold text-primary-foreground">{attendancePercentage}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Attendance Rate</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <div className="text-2xl font-bold text-emerald-600">{presentCount}</div>
                          <div className="text-xs text-muted-foreground">Present</div>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                          <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                          <div className="text-xs text-muted-foreground">Absent</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>

            {/* Right Column - Student List & Topic */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Date & Class Info Header */}
              {selectedClass && (
                <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/10">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">
                            {format(selectedDate, "EEEE, MMMM d, yyyy")}
                          </h2>
                          <p className="text-muted-foreground">
                            {selectedClassInfo?.name} - {selectedClassInfo?.section} • {students.length} students
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {attendancePercentage}% Present
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!selectedClass ? (
                <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-4">
                      <Users className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-1">Select a Class</h3>
                    <p className="text-muted-foreground text-sm">
                      Choose a class from the dropdown to mark attendance
                    </p>
                  </CardContent>
                </Card>
              ) : studentsLoading ? (
                <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-xl" />
                    ))}
                  </CardContent>
                </Card>
              ) : students.length === 0 ? (
                <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-4">
                      <Users className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-1">No Students Found</h3>
                    <p className="text-muted-foreground text-sm">
                      This class has no active students
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Student List */}
                  <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/50">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Mark Attendance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[400px]">
                        <div className="p-4 space-y-3">
                          <AnimatePresence>
                            {students.map((student, index) => (
                              <motion.div
                                key={student.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className={cn(
                                  "flex items-center justify-between p-4 rounded-2xl transition-all duration-300",
                                  studentAttendance[student.id] === "present"
                                    ? "bg-emerald-500/5 border border-emerald-500/20"
                                    : "bg-red-500/5 border border-red-500/20"
                                )}
                              >
                                <div className="flex items-center gap-4">
                                  <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                                    studentAttendance[student.id] === "present"
                                      ? "bg-emerald-500/20 text-emerald-600"
                                      : "bg-red-500/20 text-red-600"
                                  )}>
                                    {student.roll_number || (index + 1)}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-foreground">
                                      {student.profile?.full_name || "Unknown Student"}
                                    </span>
                                    <p className="text-xs text-muted-foreground">Roll No: {student.roll_number || "N/A"}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleStudentAttendance(student.id)}
                                  className={cn(
                                    "relative w-28 h-11 rounded-full font-semibold text-sm transition-all duration-300 shadow-sm flex items-center",
                                    studentAttendance[student.id] === "present"
                                      ? "bg-emerald-500"
                                      : "bg-red-500"
                                  )}
                                >
                                  <span className={cn(
                                    "flex-1 text-center text-white/80 transition-all text-xs",
                                    studentAttendance[student.id] === "present" && "text-white font-bold"
                                  )}>
                                    P
                                  </span>
                                  <span className={cn(
                                    "flex-1 text-center text-white/80 transition-all text-xs",
                                    studentAttendance[student.id] === "absent" && "text-white font-bold"
                                  )}>
                                    A
                                  </span>
                                  <motion.div
                                    layout
                                    className={cn(
                                      "absolute top-1 w-12 h-9 bg-white rounded-full shadow-md flex items-center justify-center",
                                      studentAttendance[student.id] === "present" ? "left-1" : "right-1"
                                    )}
                                  >
                                    {studentAttendance[student.id] === "present" ? (
                                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    ) : (
                                      <XCircle className="w-5 h-5 text-red-500" />
                                    )}
                                  </motion.div>
                                </button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Topic Explanation Section */}
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 via-card to-secondary/5 overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/50">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        Today's Topic Covered
                        <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="topic" className="text-sm font-medium">
                            What topic did you teach today?
                          </Label>
                          <Textarea
                            id="topic"
                            value={topicExplanation}
                            onChange={(e) => setTopicExplanation(e.target.value)}
                            placeholder="e.g., Introduction to Quadratic Equations - Covered standard form, identifying coefficients, and basic examples..."
                            className="min-h-[120px] resize-none bg-background/50 border-border/50 focus:border-primary"
                          />
                          <p className="text-xs text-muted-foreground">
                            This helps track curriculum progress and is shared with parents
                          </p>
                        </div>

                        <Button
                          onClick={handleSubmitAttendance}
                          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
                          disabled={students.length === 0}
                        >
                          <Send className="w-5 h-5 mr-2" />
                          Submit Attendance
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Confirm Attendance Submission
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-xl bg-muted/50 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{format(selectedDate, "PPP")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Class:</span>
                <span className="font-medium">{selectedClassInfo?.name} - {selectedClassInfo?.section}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Present:</span>
                <span className="font-medium text-emerald-600">{presentCount} students</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Absent:</span>
                <span className="font-medium text-red-600">{absentCount} students</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <Label className="text-xs text-muted-foreground mb-1 block">Topic Covered:</Label>
              <p className="text-sm font-medium">{topicExplanation}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmAndSave} 
              disabled={isSaving}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {isSaving ? "Saving..." : "Confirm & Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TeacherNav>
  );
}
