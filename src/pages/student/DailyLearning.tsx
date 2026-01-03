import { useState, useEffect } from "react";
import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Play, 
  SkipForward,
  Lightbulb,
  Target,
  Flame
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration_minutes: number;
  task_type: string;
  status: "pending" | "completed" | "skipped";
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
    status: "pending"
  },
  {
    id: "2",
    title: "Read Chapter 5 - Light",
    description: "Focus on reflection and refraction concepts",
    subject: "Physics",
    duration_minutes: 10,
    task_type: "reading",
    status: "pending"
  },
  {
    id: "3",
    title: "Practice Hindi Grammar",
    description: "Complete exercises on Samas",
    subject: "Hindi",
    duration_minutes: 10,
    task_type: "practice",
    status: "completed"
  }
];

const taskTypeIcons = {
  revision: BookOpen,
  practice: Target,
  reading: BookOpen,
  quiz: Lightbulb
};

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
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Daily Learning Guide</h1>
          <p className="text-muted-foreground">Your personalized study plan for today</p>
        </div>

        {/* Progress Card */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Today's Progress</p>
                  <p className="text-sm text-muted-foreground">
                    {completedCount} of {totalCount} tasks done
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{Math.round(progress)}%</p>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Active Task */}
        {activeTask && (
          <Card className="mb-6 border-primary shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary">In Progress</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {activeTask.duration_minutes} min
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">{activeTask.title}</h3>
              <p className="text-muted-foreground mb-4">{activeTask.description}</p>
              <Badge variant="secondary">{activeTask.subject}</Badge>
              <div className="flex gap-3 mt-6">
                <Button 
                  className="flex-1" 
                  onClick={() => handleCompleteTask(activeTask.id)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => openSkipDialog(activeTask)}
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Pending Tasks</h2>
            <div className="space-y-3">
              {pendingTasks.map(task => {
                const Icon = taskTypeIcons[task.task_type as keyof typeof taskTypeIcons] || BookOpen;
                const isActive = activeTask?.id === task.id;
                
                return (
                  <Card 
                    key={task.id} 
                    className={`transition-all ${isActive ? 'opacity-50' : 'hover:shadow-md'}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {task.subject}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.duration_minutes} min
                            </span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleStartTask(task)}
                          disabled={isActive}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
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
            <h2 className="text-lg font-semibold mb-3 text-muted-foreground">Completed</h2>
            <div className="space-y-3">
              {completedTasks.map(task => (
                <Card key={task.id} className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium line-through opacity-75">{task.title}</h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {task.subject}
                        </Badge>
                      </div>
                      <Badge className="bg-green-500">Done</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Skip Dialog */}
        <Dialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
          <DialogContent>
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
              />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSkipDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSkipTask} className="flex-1">
                  Skip Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </StudentNav>
  );
}
