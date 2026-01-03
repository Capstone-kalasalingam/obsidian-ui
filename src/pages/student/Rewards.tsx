import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Flame, 
  Target, 
  BookOpen, 
  MessageSquare, 
  TrendingUp,
  Award,
  Star,
  Zap,
  Trophy
} from "lucide-react";

// Mock rewards data
const rewardsData = {
  points: 1250,
  streakDays: 7,
  tasksCompleted: 45,
  revisionsCompleted: 23,
  doubtsAsked: 12,
  badges: [
    { id: 1, name: "First Steps", description: "Completed your first task", icon: Star, earned: true },
    { id: 2, name: "Week Warrior", description: "7-day learning streak", icon: Flame, earned: true },
    { id: 3, name: "Question Master", description: "Asked 10 doubts", icon: MessageSquare, earned: true },
    { id: 4, name: "Revision Champion", description: "Completed 20 revisions", icon: BookOpen, earned: true },
    { id: 5, name: "Month Master", description: "30-day learning streak", icon: Trophy, earned: false },
    { id: 6, name: "Centurion", description: "Completed 100 tasks", icon: Zap, earned: false },
  ]
};

const statsCards = [
  { 
    label: "Current Streak", 
    value: `${rewardsData.streakDays} days`, 
    icon: Flame, 
    color: "text-orange-500",
    bgColor: "bg-orange-500/10"
  },
  { 
    label: "Total Points", 
    value: rewardsData.points.toLocaleString(), 
    icon: Star, 
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10"
  },
  { 
    label: "Tasks Done", 
    value: rewardsData.tasksCompleted, 
    icon: Target, 
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  { 
    label: "Revisions", 
    value: rewardsData.revisionsCompleted, 
    icon: BookOpen, 
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
];

export default function Rewards() {
  const earnedBadges = rewardsData.badges.filter(b => b.earned);
  const lockedBadges = rewardsData.badges.filter(b => !b.earned);

  // Calculate next milestone
  const nextMilestone = 1500;
  const progressToNext = (rewardsData.points / nextMilestone) * 100;

  return (
    <StudentNav>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Rewards & Progress</h1>
          <p className="text-muted-foreground">Your achievements and growth journey</p>
        </div>

        {/* Points Card */}
        <Card className="mb-6 bg-gradient-to-r from-primary/20 via-primary/10 to-background border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-4xl font-bold text-primary">{rewardsData.points.toLocaleString()}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Next milestone: {nextMilestone.toLocaleString()} points</span>
                <span className="text-primary">{rewardsData.points}/{nextMilestone}</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i}>
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Streak Highlight */}
        <Card className="mb-6 border-orange-500/30 bg-orange-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-500">{rewardsData.streakDays} Day Streak!</p>
                <p className="text-muted-foreground">Keep learning daily to grow your streak 🔥</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earned Badges */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Earned Badges ({earnedBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {earnedBadges.map(badge => {
                const Icon = badge.icon;
                return (
                  <div 
                    key={badge.id} 
                    className="text-center p-4 rounded-xl bg-primary/5 border border-primary/20"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <p className="font-semibold text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Locked Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">
              Badges to Unlock ({lockedBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {lockedBadges.map(badge => {
                const Icon = badge.icon;
                return (
                  <div 
                    key={badge.id} 
                    className="text-center p-4 rounded-xl bg-muted/50 border border-dashed opacity-60"
                  >
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <p className="font-semibold text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">Locked</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Motivation Note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          🌟 Rewards are based on your effort and consistency, not marks!
        </p>
      </div>
    </StudentNav>
  );
}
