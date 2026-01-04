import { useState, useEffect } from "react";
import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Brain,
  TrendingDown,
  AlertTriangle,
  BookOpen,
  Users,
  Lightbulb,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeakTopic {
  subject: string;
  topic: string;
  avgScore: number;
  studentsAffected: number;
}

interface LowEngagementStudent {
  id: string;
  name: string;
  rollNumber: string;
  attendanceRate: number;
  tasksCompleted: number;
  lastActive: string;
}

interface RevisionGap {
  subject: string;
  topic: string;
  daysSinceRevision: number;
  importance: "high" | "medium" | "low";
}

export default function AIInsights() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [teacherClass, setTeacherClass] = useState<{ name: string; section: string } | null>(null);
  
  // Mock data for AI insights - in production, this would come from AI analysis
  const [weakTopics] = useState<WeakTopic[]>([
    { subject: "Mathematics", topic: "Fractions & Decimals", avgScore: 45, studentsAffected: 12 },
    { subject: "Science", topic: "Chemical Reactions", avgScore: 52, studentsAffected: 8 },
    { subject: "English", topic: "Grammar - Tenses", avgScore: 58, studentsAffected: 6 },
    { subject: "Mathematics", topic: "Algebra Basics", avgScore: 62, studentsAffected: 5 },
  ]);

  const [lowEngagementStudents] = useState<LowEngagementStudent[]>([
    { id: "1", name: "Rahul Sharma", rollNumber: "15", attendanceRate: 65, tasksCompleted: 3, lastActive: "5 days ago" },
    { id: "2", name: "Priya Patel", rollNumber: "22", attendanceRate: 72, tasksCompleted: 5, lastActive: "3 days ago" },
    { id: "3", name: "Amit Kumar", rollNumber: "08", attendanceRate: 78, tasksCompleted: 4, lastActive: "4 days ago" },
  ]);

  const [revisionGaps] = useState<RevisionGap[]>([
    { subject: "Mathematics", topic: "Number Systems", daysSinceRevision: 45, importance: "high" },
    { subject: "Science", topic: "Photosynthesis", daysSinceRevision: 30, importance: "medium" },
    { subject: "English", topic: "Essay Writing", daysSinceRevision: 25, importance: "medium" },
    { subject: "History", topic: "Medieval Period", daysSinceRevision: 60, importance: "high" },
    { subject: "Geography", topic: "Climate Zones", daysSinceRevision: 20, importance: "low" },
  ]);

  useEffect(() => {
    const fetchTeacherClass = async () => {
      if (!user) return;

      const { data: teacher } = await supabase
        .from("teachers")
        .select(`
          teacher_assignments (
            is_class_teacher,
            classes (name, section)
          )
        `)
        .eq("user_id", user.id)
        .single();

      const classTeacherAssignment = teacher?.teacher_assignments?.find(
        (a: any) => a.is_class_teacher
      );

      if (classTeacherAssignment?.classes) {
        setTeacherClass({
          name: classTeacherAssignment.classes.name,
          section: classTeacherAssignment.classes.section,
        });
      }

      setLoading(false);
    };

    fetchTeacherClass();
  }, [user]);

  const getScoreColor = (score: number) => {
    if (score < 50) return "text-destructive";
    if (score < 70) return "text-amber-500";
    return "text-emerald-500";
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Medium</Badge>;
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  return (
    <TeacherNav>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">AI Insights</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Smart recommendations for your class
              {teacherClass && ` - ${teacherClass.name} ${teacherClass.section}`}
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh Insights
          </Button>
        </div>

        {/* Advisory Note */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">AI-Powered Recommendations</p>
                <p className="text-sm text-muted-foreground">
                  These insights are generated based on attendance patterns, task completions, and learning data. 
                  Use them as guidance to support your students effectively.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weak Topics Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-destructive" />
                <CardTitle className="text-lg">Weak Topics in Class</CardTitle>
              </div>
              <CardDescription>
                Topics where students are struggling the most
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : (
                weakTopics.map((topic, index) => (
                  <div key={index} className="p-4 rounded-lg bg-secondary/50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{topic.topic}</p>
                        <p className="text-sm text-muted-foreground">{topic.subject}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {topic.studentsAffected} students
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Class Average</span>
                        <span className={`font-medium ${getScoreColor(topic.avgScore)}`}>
                          {topic.avgScore}%
                        </span>
                      </div>
                      <Progress value={topic.avgScore} className="h-2" />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Low Engagement Students */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg">Students with Low Engagement</CardTitle>
              </div>
              <CardDescription>
                Students who may need additional attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : (
                lowEngagementStudents.map((student) => (
                  <div key={student.id} className="p-4 rounded-lg bg-secondary/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">Roll No: {student.rollNumber}</p>
                      </div>
                      <Badge variant="outline" className="text-muted-foreground">
                        {student.lastActive}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Attendance</p>
                        <p className={`font-medium ${getScoreColor(student.attendanceRate)}`}>
                          {student.attendanceRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tasks This Week</p>
                        <p className="font-medium">{student.tasksCompleted} completed</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Revision Gaps */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Revision Gaps</CardTitle>
              </div>
              <CardDescription>
                Topics that haven't been revised in a while
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground col-span-full">Loading...</div>
                ) : (
                  revisionGaps.map((gap, index) => (
                    <div key={index} className="p-4 rounded-lg bg-secondary/50 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium">{gap.topic}</p>
                          <p className="text-sm text-muted-foreground">{gap.subject}</p>
                        </div>
                        {getImportanceBadge(gap.importance)}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-muted-foreground">
                          Last revised {gap.daysSinceRevision} days ago
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suggestions Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Suggested Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <p className="text-sm">
                  <span className="font-medium">Schedule a revision session</span> for Fractions & Decimals - 
                  12 students are struggling with this topic.
                </p>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <p className="text-sm">
                  <span className="font-medium">Follow up with Rahul Sharma</span> - 
                  attendance has dropped and hasn't completed tasks in 5 days.
                </p>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <p className="text-sm">
                  <span className="font-medium">Plan a quick recap</span> of Number Systems and Medieval Period - 
                  both haven't been revised in over a month.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </TeacherNav>
  );
}
