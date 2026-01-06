import { useState, useEffect } from "react";
import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  BookOpen, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Target,
  GraduationCap,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  dueDate: Date;
  status: "active" | "completed" | "overdue";
  type: "homework" | "practice" | "project";
  submissionCount: number;
  totalStudents: number;
}

interface ClassData {
  id: string;
  name: string;
  section: string;
}

interface SubjectData {
  id: string;
  name: string;
}

// Mock assignments data (will be replaced with real data later)
const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Chapter 5 - Quadratic Equations Practice",
    description: "Complete exercises 1-20 from the textbook",
    subject: "Mathematics",
    class: "Class 8-A",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: "active",
    type: "homework",
    submissionCount: 12,
    totalStudents: 30
  },
  {
    id: "2",
    title: "Essay on Environmental Conservation",
    description: "Write a 500-word essay on ways to protect our environment",
    subject: "English",
    class: "Class 8-A",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "active",
    type: "project",
    submissionCount: 5,
    totalStudents: 30
  },
  {
    id: "3",
    title: "Daily Practice - Fractions",
    description: "15-minute daily practice on fraction operations",
    subject: "Mathematics",
    class: "Class 7-B",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: "overdue",
    type: "practice",
    submissionCount: 25,
    totalStudents: 28
  }
];

export default function Homework() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState("all");
  
  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classId: "",
    subjectId: "",
    type: "homework" as "homework" | "practice" | "project",
    dueDate: new Date()
  });

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user) return;

      // Get teacher info
      const { data: teacher } = await supabase
        .from("teachers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!teacher) return;

      // Get assigned classes
      const { data: assignmentsData } = await supabase
        .from("teacher_assignments")
        .select(`
          class_id,
          subject_id,
          classes (id, name, section),
          subjects (id, name)
        `)
        .eq("teacher_id", teacher.id);

      if (assignmentsData) {
        const uniqueClasses = new Map();
        const uniqueSubjects = new Map();
        
        assignmentsData.forEach((a: any) => {
          if (a.classes) {
            uniqueClasses.set(a.classes.id, {
              id: a.classes.id,
              name: a.classes.name,
              section: a.classes.section
            });
          }
          if (a.subjects) {
            uniqueSubjects.set(a.subjects.id, {
              id: a.subjects.id,
              name: a.subjects.name
            });
          }
        });
        
        setClasses(Array.from(uniqueClasses.values()));
        setSubjects(Array.from(uniqueSubjects.values()));
      }
    };

    fetchTeacherData();
  }, [user]);

  const handleCreateAssignment = () => {
    if (!formData.title || !formData.classId || !formData.subjectId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedClass = classes.find(c => c.id === formData.classId);
    const selectedSubject = subjects.find(s => s.id === formData.subjectId);

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      subject: selectedSubject?.name || "",
      class: `${selectedClass?.name}-${selectedClass?.section}` || "",
      dueDate: formData.dueDate,
      status: "active",
      type: formData.type,
      submissionCount: 0,
      totalStudents: 30
    };

    setAssignments([newAssignment, ...assignments]);
    setIsDialogOpen(false);
    setFormData({
      title: "",
      description: "",
      classId: "",
      subjectId: "",
      type: "homework",
      dueDate: new Date()
    });
    toast.success("Assignment created successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "completed": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "overdue": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "homework": return <FileText className="w-4 h-4" />;
      case "practice": return <Target className="w-4 h-4" />;
      case "project": return <GraduationCap className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const filteredAssignments = assignments.filter(a => {
    if (activeTab === "all") return true;
    return a.status === activeTab;
  });

  const stats = {
    active: assignments.filter(a => a.status === "active").length,
    completed: assignments.filter(a => a.status === "completed").length,
    overdue: assignments.filter(a => a.status === "overdue").length,
    total: assignments.length
  };

  return (
    <TeacherNav>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="p-4 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <BookOpen className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                </div>
                Homework & Practice
              </h1>
              <p className="text-muted-foreground mt-1">Create and manage assignments for your students</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4" />
                  Create Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    New Assignment
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter assignment title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the assignment..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1.5 min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Class *</Label>
                      <Select
                        value={formData.classId}
                        onValueChange={(value) => setFormData({ ...formData, classId: value })}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}-{c.section}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Subject *</Label>
                      <Select
                        value={formData.subjectId}
                        onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: "homework" | "practice" | "project") => 
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="homework">Homework</SelectItem>
                          <SelectItem value="practice">Practice</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full mt-1.5 justify-start text-left font-normal",
                              !formData.dueDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.dueDate}
                            onSelect={(date) => date && setFormData({ ...formData, dueDate: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <Button onClick={handleCreateAssignment} className="w-full mt-6">
                    Create Assignment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-none shadow-lg bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{stats.active}</p>
                    <p className="text-xs text-emerald-600/70">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.completed}</p>
                    <p className="text-xs text-blue-600/70">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-500/10">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.overdue}</p>
                    <p className="text-xs text-red-600/70">Overdue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-card border">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-4">
              <div className="space-y-4">
                {filteredAssignments.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="p-8 text-center">
                      <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40" />
                      <h3 className="mt-4 font-semibold text-lg">No Assignments Yet</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Create your first assignment to get started
                      </p>
                      <Button className="mt-4 gap-2" onClick={() => setIsDialogOpen(true)}>
                        <Plus className="w-4 h-4" />
                        Create Assignment
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  filteredAssignments.map((assignment) => (
                    <Card key={assignment.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                      <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row">
                          {/* Left accent */}
                          <div className={cn(
                            "w-full lg:w-1.5 h-1.5 lg:h-auto",
                            assignment.status === "active" && "bg-emerald-500",
                            assignment.status === "completed" && "bg-blue-500",
                            assignment.status === "overdue" && "bg-red-500"
                          )} />
                          
                          <div className="flex-1 p-4 lg:p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="outline" className="gap-1 text-xs">
                                    {getTypeIcon(assignment.type)}
                                    {assignment.type}
                                  </Badge>
                                  <Badge className={cn("text-xs", getStatusColor(assignment.status))}>
                                    {assignment.status}
                                  </Badge>
                                </div>
                                
                                <h3 className="font-semibold text-lg mt-2 group-hover:text-primary transition-colors">
                                  {assignment.title}
                                </h3>
                                
                                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                                  {assignment.description}
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1.5">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{assignment.subject}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4" />
                                    <span>{assignment.class}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>Due: {format(assignment.dueDate, "MMM dd, yyyy")}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-3">
                                {/* Submission progress */}
                                <div className="text-right">
                                  <p className="text-sm font-medium">
                                    {assignment.submissionCount}/{assignment.totalStudents}
                                  </p>
                                  <p className="text-xs text-muted-foreground">Submissions</p>
                                </div>
                                
                                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{ 
                                      width: `${(assignment.submissionCount / assignment.totalStudents) * 100}%` 
                                    }}
                                  />
                                </div>
                                
                                {/* Actions */}
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="gap-1.5">
                                    <Eye className="w-4 h-4" />
                                    View
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TeacherNav>
  );
}
