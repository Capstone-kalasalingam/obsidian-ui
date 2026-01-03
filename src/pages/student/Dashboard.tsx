import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  CalendarDays, 
  ImagePlus, 
  Trophy, 
  TrendingUp,
  BookOpen,
  FileText,
  ClipboardCheck,
  Sparkles,
  Clock,
  CheckCircle2,
  Flame,
  Target,
  Zap,
  Star,
  GraduationCap
} from "lucide-react";
import { Link } from "react-router-dom";
import { studentProfile } from "@/data/studentMockData";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// Activity data for chart
const activityData = [
  { day: "Mon", practice: 30, revision: 20 },
  { day: "Tue", practice: 45, revision: 35 },
  { day: "Wed", practice: 35, revision: 40 },
  { day: "Thu", practice: 55, revision: 30 },
  { day: "Fri", practice: 40, revision: 45 },
  { day: "Sat", practice: 60, revision: 50 },
  { day: "Sun", practice: 50, revision: 40 },
];

// Today's courses
const todaysCourses = [
  {
    id: 1,
    title: "Biology Molecular",
    topics: ["Genetics", "Cells", "Photosynthesis"],
    progress: 72,
    icon: "🧬",
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    id: 2,
    title: "Core Literacy",
    topics: ["Grammar", "Essay Writing", "Vocabulary"],
    progress: 64,
    icon: "📚",
    gradient: "from-amber-500 to-orange-600"
  },
  {
    id: 3,
    title: "Mathematics",
    topics: ["Algebra", "Geometry", "Calculus"],
    progress: 85,
    icon: "📐",
    gradient: "from-blue-500 to-indigo-600"
  }
];

// Stats data
const statsData = [
  { label: "Streak", value: "12", unit: "days", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
  { label: "Tasks Done", value: "48", unit: "this week", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "XP Points", value: "2,400", unit: "earned", icon: Zap, color: "text-primary", bg: "bg-primary/10" },
  { label: "Rank", value: "#5", unit: "in class", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
];

// Quick actions
const quickActions = [
  { title: "AI Learning", icon: Lightbulb, path: "/student/daily-learning", gradient: "from-violet-500 to-purple-600" },
  { title: "Calendar", icon: CalendarDays, path: "/student/calendar", gradient: "from-blue-500 to-cyan-600" },
  { title: "Image Learn", icon: ImagePlus, path: "/student/learn-image", gradient: "from-pink-500 to-rose-600" },
  { title: "Rewards", icon: Trophy, path: "/student/rewards", gradient: "from-amber-500 to-yellow-600" },
  { title: "My Growth", icon: TrendingUp, path: "/student/growth", gradient: "from-emerald-500 to-green-600" },
  { title: "Materials", icon: BookOpen, path: "/student/materials", gradient: "from-indigo-500 to-violet-600" },
  { title: "Marks", icon: FileText, path: "/student/marks", gradient: "from-rose-500 to-pink-600" },
  { title: "Attendance", icon: ClipboardCheck, path: "/student/attendance", gradient: "from-teal-500 to-cyan-600" },
];

const Dashboard = () => {
  const firstName = studentProfile.name.split(' ')[0];

  return (
    <StudentNav>
      <div className="min-h-screen bg-gradient-soft">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header Section */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Greeting & Courses */}
            <div className="lg:col-span-2 space-y-6">
              {/* Greeting Card */}
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary via-violet-600 to-purple-700 text-white">
                <CardContent className="p-6 relative">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute right-4 bottom-4 w-20 h-20 bg-white/5 rounded-full blur-xl" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <GraduationCap className="w-7 h-7" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold">Hello, {firstName} 👋</h1>
                        <p className="text-white/70 text-sm">Let's continue your learning journey!</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {statsData.map((stat) => (
                        <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                          <stat.icon className="w-5 h-5 mb-1 text-white/80" />
                          <p className="text-xl font-bold">{stat.value}</p>
                          <p className="text-[10px] text-white/60 uppercase tracking-wide">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Courses */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Today's Courses
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {todaysCourses.map((course) => (
                    <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-card">
                      <CardContent className="p-5">
                        {/* Circular Progress */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-3xl">{course.icon}</span>
                          <div className="relative w-14 h-14">
                            <svg className="w-14 h-14 -rotate-90">
                              <circle
                                cx="28"
                                cy="28"
                                r="24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-muted"
                              />
                              <circle
                                cx="28"
                                cy="28"
                                r="24"
                                fill="none"
                                stroke="url(#progressGradient)"
                                strokeWidth="4"
                                strokeDasharray={`${course.progress * 1.51} 151`}
                                strokeLinecap="round"
                              />
                              <defs>
                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                              {course.progress}%
                            </span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-foreground mb-2">{course.title}</h3>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {course.topics.map((topic, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {topic}
                            </span>
                          ))}
                        </div>
                        <Button 
                          size="sm" 
                          className={`w-full rounded-xl bg-gradient-to-r ${course.gradient} text-white border-0 hover:opacity-90`}
                        >
                          Continue Learning
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Learning Activity Chart */}
              <Card className="border-0 bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Learning Activity
                    </h3>
                    <div className="flex gap-4 text-xs">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary" />
                        Practice
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-accent" />
                        Revision
                      </span>
                    </div>
                  </div>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData}>
                        <defs>
                          <linearGradient id="colorPractice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorRevision" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'hsl(var(--card))', 
                            border: 'none', 
                            borderRadius: '12px',
                            boxShadow: 'var(--shadow-card)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="practice" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorPractice)"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revision" 
                          stroke="hsl(var(--accent))" 
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

            {/* Right Column - XP & Achievements */}
            <div className="space-y-6">
              {/* XP Card */}
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary via-violet-600 to-indigo-700 text-white">
                <CardContent className="p-6 relative">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-4xl font-bold">2,400</p>
                      <p className="text-white/60 text-sm">XP Points</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-3xl">💎</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" className="rounded-xl bg-white/20 text-white border-0 hover:bg-white/30">
                      Redeem
                    </Button>
                    <Button size="sm" className="rounded-xl bg-accent text-white border-0 hover:bg-accent/90">
                      <Zap className="w-4 h-4 mr-1" />
                      Earn More
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Challenge */}
              <Card className="border-0 bg-gradient-to-br from-amber-400 to-orange-500 text-white overflow-hidden">
                <CardContent className="p-5 relative">
                  <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Daily Challenge</h4>
                      <p className="text-xs text-white/70">Complete 5 lessons today</p>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                    <div className="bg-white h-full rounded-full w-3/5 transition-all" />
                  </div>
                  <p className="text-xs mt-2 text-white/80">3 of 5 completed</p>
                </CardContent>
              </Card>

              {/* Streak Card */}
              <Card className="border-0 bg-gradient-to-br from-rose-500 to-pink-600 text-white overflow-hidden">
                <CardContent className="p-5 relative">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                      <Flame className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">12 Days</p>
                      <p className="text-sm text-white/70">Learning Streak 🔥</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="border-0 bg-card">
                <CardContent className="p-5">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    Recent Badges
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {['🏆', '⭐', '🎯', '🚀', '💡', '📚', '🎓', '🌟'].map((badge, i) => (
                      <div 
                        key={i}
                        className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-pointer"
                      >
                        {badge}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Quick Access
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {quickActions.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-0 bg-card">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-lg`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-foreground">{item.title}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Motivation */}
          <p className="text-center text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Every day is a chance to learn something new!
          </p>
        </div>
      </div>
    </StudentNav>
  );
};

export default Dashboard;
