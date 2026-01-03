import { useState } from "react";
import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Play, 
  SkipForward,
  Lightbulb,
  Target,
  Flame,
  Sparkles,
  Brain,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration_minutes: number;
  task_type: string;
  status: "pending" | "completed" | "skipped";
  icon: string;
  color: string;
}

// Mock tasks for demo
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Revise Quadratic Equations",
    description: "Go through the formulas and solve 2 practice problems",
    subject: "Mathematics",
    duration_minutes: 15,
    task_type: "revision",
    status: "pending",
    icon: "📐",
    color: "from-violet-500 to-purple-600"
  },
  {
    id: "2",
    title: "Read Chapter 5 - Light",
    description: "Focus on reflection and refraction concepts",
    subject: "Physics",
    duration_minutes: 10,
    task_type: "reading",
    status: "pending",
    icon: "💡",
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: "3",
    title: "Practice Hindi Grammar",
    description: "Complete exercises on Samas",
    subject: "Hindi",
    duration_minutes: 10,
    task_type: "practice",
    status: "completed",
    icon: "📝",
    color: "from-orange-500 to-amber-600"
  }
];

export default function DailyLearning() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [skipReason, setSkipReason] = useState("");
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const [taskToSkip, setTaskToSkip] = useState<Task | null>(null);
  const { user } = useAuth();

  const completedCount = tasks.filter(t => t.status === "completed").length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleStartTask = (task: Task) => {
    setActiveTask(task);
    toast.info(`Starting: ${task.title}`);
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: "completed" as const } : t
    ));
    setActiveTask(null);
    toast.success("Great job! Task completed! 🎉");
  };

  const openSkipDialog = (task: Task) => {
    setTaskToSkip(task);
    setSkipDialogOpen(true);
  };

  const handleSkipTask = () => {
    if (!taskToSkip) return;
    
    setTasks(prev => prev.map(t => 
      t.id === taskToSkip.id ? { ...t, status: "skipped" as const } : t
    ));
    setSkipDialogOpen(false);
    setSkipReason("");
    setTaskToSkip(null);
    toast.info("Task skipped. Try to complete it later!");
  };

  const pendingTasks = tasks.filter(t => t.status === "pending");
  const completedTasks = tasks.filter(t => t.status === "completed");

  return (
    <StudentNav>
      <div className="min-h-screen bg-gradient-soft">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Daily Learning Guide</h1>
                <p className="text-muted-foreground">Your personalized study plan for today</p>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <Card className="mb-8 bg-gradient-to-r from-primary via-violet-600 to-purple-600 text-white border-0 overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute right-20 bottom-0 w-24 h-24 bg-white/5 rounded-full" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Flame className="w-8 h-8 text-orange-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Today's Progress</p>
                    <p className="text-sm text-white/80">
                      {completedCount} of {totalCount} tasks completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-bold">{Math.round(progress)}%</p>
                  <p className="text-sm text-white/70">Complete</p>
                </div>
              </div>
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendation Card */}
          <Card className="mb-8 bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200/50 overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-amber-500 text-white border-0">AI Recommendation</Badge>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Focus on Mathematics Today</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on your recent performance, spending extra time on Quadratic Equations will help strengthen your understanding.
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Estimated: 15 minutes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Task */}
          {activeTask && (
            <Card className="mb-8 border-2 border-primary/30 shadow-xl bg-white overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary to-violet-500" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-primary/10 text-primary border-0 px-3 py-1">
                    <Zap className="w-3 h-3 mr-1" />
                    In Progress
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {activeTask.duration_minutes} min
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeTask.color} flex items-center justify-center text-3xl shadow-lg`}>
                    {activeTask.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{activeTask.title}</h3>
                    <p className="text-muted-foreground mb-3">{activeTask.description}</p>
                    <Badge variant="secondary" className="rounded-full">{activeTask.subject}</Badge>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl h-12" 
                    onClick={() => handleCompleteTask(activeTask.id)}
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Mark Complete
                  </Button>
                  <Button 
                    variant="outline"
                    className="rounded-xl h-12"
                    onClick={() => openSkipDialog(activeTask)}
                  >
                    <SkipForward className="w-5 h-5 mr-2" />
                    Skip
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Pending Tasks
              </h2>
              <div className="space-y-4">
                {pendingTasks.map(task => {
                  const isActive = activeTask?.id === task.id;
                  
                  return (
                    <Card 
                      key={task.id} 
                      className={`transition-all hover:shadow-lg ${isActive ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                          {/* Circular Progress */}
                          <div className="relative shrink-0">
                            <svg className="w-16 h-16 -rotate-90">
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="5"
                                className="text-muted/20"
                              />
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                fill="none"
                                stroke="url(#progressGradient)"
                                strokeWidth="5"
                                strokeDasharray="0 176"
                                strokeLinecap="round"
                              />
                              <defs>
                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#8b5cf6" />
                                  <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-2xl">
                              {task.icon}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg">{task.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                              {task.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                              <Badge variant="secondary" className="rounded-full text-xs">
                                {task.subject}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {task.duration_minutes} min
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                              onClick={() => handleStartTask(task)}
                              disabled={isActive}
                            >
                              Learn
                            </Button>
                            <Button 
                              size="sm"
                              className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                              onClick={() => handleStartTask(task)}
                              disabled={isActive}
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Start
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Completed Today
              </h2>
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <Card key={task.id} className="bg-green-50/50 border-green-100">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">
                          {task.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{task.title}</h3>
                          <Badge variant="secondary" className="text-xs mt-1 rounded-full">
                            {task.subject}
                          </Badge>
                        </div>
                        <Badge className="bg-green-500 text-white border-0 rounded-full">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Done
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Motivation */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              Keep going! Small steps lead to big achievements.
            </p>
          </div>
        </div>
      </div>

      {/* Skip Dialog */}
      <Dialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Skip Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Why are you skipping "{taskToSkip?.title}"?
            </p>
            <Textarea
              placeholder="e.g., Too tired, Will do later, Need help..."
              value={skipReason}
              onChange={(e) => setSkipReason(e.target.value)}
              className="rounded-xl"
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setSkipDialogOpen(false)} className="flex-1 rounded-xl">
                Cancel
              </Button>
              <Button onClick={handleSkipTask} className="flex-1 rounded-xl">
                Skip Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </StudentNav>
  );
}
