import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Target, 
  Flame, 
  BookOpen,
  Brain,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

// Mock growth data
const growthData = {
  effortScore: 78,
  consistencyScore: 85,
  improvementTrend: "up",
  strongSubjects: [
    { name: "Mathematics", score: 88, trend: "up" },
    { name: "Science", score: 85, trend: "stable" },
  ],
  weakSubjects: [
    { name: "Hindi", score: 62, trend: "up" },
    { name: "Social Studies", score: 68, trend: "down" },
  ],
  weeklyProgress: [
    { week: "Week 1", tasks: 12, completed: 10 },
    { week: "Week 2", tasks: 15, completed: 14 },
    { week: "Week 3", tasks: 14, completed: 12 },
    { week: "Week 4", tasks: 16, completed: 15 },
  ],
  recentActivity: [
    { date: "Today", action: "Completed revision - Quadratic Equations", subject: "Maths" },
    { date: "Today", action: "Asked doubt - Light reflection", subject: "Physics" },
    { date: "Yesterday", action: "Completed 3 tasks", subject: "Mixed" },
    { date: "2 days ago", action: "Achieved 7-day streak", subject: "" },
  ]
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <ArrowUp className="w-4 h-4 text-green-500" />;
    case "down":
      return <ArrowDown className="w-4 h-4 text-red-500" />;
    default:
      return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
};

export default function GrowthDashboard() {
  return (
    <StudentNav>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Personal Growth Dashboard</h1>
          <p className="text-muted-foreground">Track your learning progress and improvement</p>
        </div>

        {/* Main Scores */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Effort Score */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-background">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Target className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Effort Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(growthData.effortScore)}`}>
                    {growthData.effortScore}%
                  </p>
                  <Progress value={growthData.effortScore} className="h-2 mt-2" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Based on task completion, revision, and daily activity
              </p>
            </CardContent>
          </Card>

          {/* Consistency Score */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-background">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Flame className="w-8 h-8 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Consistency Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(growthData.consistencyScore)}`}>
                    {growthData.consistencyScore}%
                  </p>
                  <Progress value={growthData.consistencyScore} className="h-2 mt-2" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Based on daily learning streaks and regularity
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Improvement Trend */}
        <Card className="mb-6 border-green-500/30 bg-green-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-green-500" />
              </div>
              <div>
                <p className="text-lg font-semibold text-green-600">You're Improving! 📈</p>
                <p className="text-muted-foreground">
                  Your scores have increased by 12% compared to last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Analysis */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Strong Subjects */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-green-600">
                <Brain className="w-5 h-5" />
                Strong Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {growthData.strongSubjects.map((subject, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(subject.trend)}
                          <span className="text-xs text-muted-foreground">
                            {subject.trend === "up" ? "Improving" : subject.trend === "down" ? "Declining" : "Stable"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className={`text-xl font-bold ${getScoreColor(subject.score)}`}>
                      {subject.score}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weak Subjects */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-orange-600">
                <Target className="w-5 h-5" />
                Focus Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {growthData.weakSubjects.map((subject, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(subject.trend)}
                          <span className="text-xs text-muted-foreground">
                            {subject.trend === "up" ? "Improving" : subject.trend === "down" ? "Needs attention" : "Stable"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className={`text-xl font-bold ${getScoreColor(subject.score)}`}>
                      {subject.score}%
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                💡 Tip: Spend 10 extra minutes daily on these subjects
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Weekly Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {growthData.weeklyProgress.map((week, i) => {
                const percentage = (week.completed / week.tasks) * 100;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{week.week}</span>
                      <span className="text-muted-foreground">
                        {week.completed}/{week.tasks} tasks
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {growthData.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{activity.date}</span>
                      {activity.subject && (
                        <Badge variant="secondary" className="text-xs">{activity.subject}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          📊 This dashboard shows your effort and growth, not competition with others
        </p>
      </div>
    </StudentNav>
  );
}
