import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Flame, 
  Target, 
  BookOpen, 
  MessageSquare, 
  TrendingUp,
  Award,
  Star,
  Zap,
  Trophy,
  Sparkles,
  Crown,
  Medal
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";

// Mock rewards data
const rewardsData = {
  points: 2400,
  streakDays: 7,
  tasksCompleted: 45,
  revisionsCompleted: 23,
  doubtsAsked: 12,
  level: 5,
  badges: [
    { id: 1, name: "First Steps", description: "Completed your first task", icon: Star, earned: true, color: "from-yellow-400 to-orange-500" },
    { id: 2, name: "Week Warrior", description: "7-day learning streak", icon: Flame, earned: true, color: "from-orange-400 to-red-500" },
    { id: 3, name: "Question Master", description: "Asked 10 doubts", icon: MessageSquare, earned: true, color: "from-blue-400 to-indigo-500" },
    { id: 4, name: "Revision Champion", description: "Completed 20 revisions", icon: BookOpen, earned: true, color: "from-green-400 to-emerald-500" },
    { id: 5, name: "Month Master", description: "30-day learning streak", icon: Trophy, earned: false, color: "from-purple-400 to-pink-500" },
    { id: 6, name: "Centurion", description: "Completed 100 tasks", icon: Zap, earned: false, color: "from-cyan-400 to-blue-500" },
  ]
};

// Activity data for chart
const activityData = [
  { day: "Mon", tasks: 4, revision: 2 },
  { day: "Tue", tasks: 6, revision: 3 },
  { day: "Wed", tasks: 3, revision: 4 },
  { day: "Thu", tasks: 8, revision: 2 },
  { day: "Fri", tasks: 5, revision: 5 },
  { day: "Sat", tasks: 7, revision: 3 },
  { day: "Sun", tasks: 4, revision: 6 },
];

const progressItems = [
  { subject: "Mathematics", progress: 79, color: "bg-violet-500", icon: "📐" },
  { subject: "Science", progress: 64, color: "bg-emerald-500", icon: "🔬" },
  { subject: "English", progress: 85, color: "bg-blue-500", icon: "📚" },
];

export default function Rewards() {
  const earnedBadges = rewardsData.badges.filter(b => b.earned);
  const lockedBadges = rewardsData.badges.filter(b => !b.earned);

  return (
    <StudentNav>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Greeting Card */}
          <Card className="flex-1 bg-gradient-to-br from-violet-600 to-purple-700 text-white border-0 overflow-hidden relative">
            <CardContent className="p-6">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute right-4 bottom-4 w-20 h-20 bg-white/5 rounded-full" />
              <h1 className="text-2xl font-bold mb-1">Hello, Arka 👋</h1>
              <p className="text-white/80 text-sm mb-4">
                Continue your learning journey and earn more rewards!
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                  <Crown className="w-5 h-5 text-yellow-300" />
                  <span className="font-semibold">Level {rewardsData.level}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                  <Flame className="w-5 h-5 text-orange-300" />
                  <span className="font-semibold">{rewardsData.streakDays} Days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* XP Card */}
          <Card className="lg:w-56 bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 relative overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
              <Sparkles className="w-8 h-8 mb-2 text-yellow-200" />
              <p className="text-4xl font-bold">{rewardsData.points.toLocaleString()}</p>
              <p className="text-white/80 text-sm">XP Points</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200/50">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-200">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">{rewardsData.streakDays}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200/50">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
                <Target className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">{rewardsData.tasksCompleted}</p>
              <p className="text-xs text-muted-foreground">Tasks Done</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200/50">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-200">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">{rewardsData.revisionsCompleted}</p>
              <p className="text-xs text-muted-foreground">Revisions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200/50">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-200">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">{rewardsData.doubtsAsked}</p>
              <p className="text-xs text-muted-foreground">Doubts Asked</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Progress Section */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Subject Progress</h3>
              <div className="space-y-5">
                {progressItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="relative">
                      <svg className="w-16 h-16 -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="6"
                          className="text-muted/30"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="6"
                          strokeDasharray={`${item.progress * 1.76} 176`}
                          strokeLinecap="round"
                          className={item.color.replace('bg-', 'text-')}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                        {item.progress}%
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium flex items-center gap-2">
                        <span>{item.icon}</span>
                        {item.subject}
                      </p>
                      <p className="text-xs text-muted-foreground">Keep going!</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Chart */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Learning Activity</h3>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-violet-500" />
                    Tasks
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    Revisions
                  </span>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRevision" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#9ca3af' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#9ca3af' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tasks" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTasks)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revision" 
                      stroke="#34d399" 
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevision)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Medal className="w-5 h-5 text-yellow-500" />
                Your Badges
              </h3>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {earnedBadges.length} earned
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {earnedBadges.map(badge => {
                const Icon = badge.icon;
                return (
                  <div 
                    key={badge.id} 
                    className="text-center group"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform cursor-pointer`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-medium text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                );
              })}
              {lockedBadges.map(badge => {
                const Icon = badge.icon;
                return (
                  <div 
                    key={badge.id} 
                    className="text-center opacity-40"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-2 border-2 border-dashed border-muted-foreground/30">
                      <Icon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">Locked</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Motivation */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            Rewards are based on your effort and consistency, not marks!
          </p>
        </div>
      </div>
    </StudentNav>
  );
}
