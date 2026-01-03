import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Star,
  Flame,
  Target,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { studentProfile } from "@/data/studentMockData";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// Activity data for chart
const activityData = [
  { day: "Jan", practice: 30, revision: 20 },
  { day: "Feb", practice: 45, revision: 35 },
  { day: "Mar", practice: 35, revision: 40 },
  { day: "Apr", practice: 55, revision: 30 },
  { day: "May", practice: 40, revision: 45 },
  { day: "Jun", practice: 60, revision: 50 },
];

// Today's courses
const todaysCourses = [
  {
    id: 1,
    title: "Biology Molecular",
    topics: ["Genetics", "Cells", "Photosynthesis", "DNA Structure"],
    progress: 72,
    icon: "🧬",
    color: "from-green-400 to-emerald-500"
  },
  {
    id: 2,
    title: "Core Literacy",
    topics: ["Grammar", "Essay Writing", "Vocabulary", "Comprehension"],
    progress: 64,
    icon: "📚",
    color: "from-orange-400 to-amber-500"
  }
];

// Challenges
const challenges = [
  {
    id: 1,
    title: "Check In Daily",
    description: "Open the app on a daily basis",
    icon: "🏆",
    bgColor: "bg-gradient-to-br from-violet-400 to-purple-500"
  },
  {
    id: 2,
    title: "Daily Target",
    description: "Complete all daily assignments to get rewards",
    icon: "🎯",
    bgColor: "bg-gradient-to-br from-amber-300 to-yellow-400"
  }
];

const Dashboard = () => {
  const firstName = studentProfile.name.split(' ')[0];

  return (
    <StudentNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50/30">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header Section */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Greeting */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Hello, {firstName} 👋
                  </h1>
                  <p className="text-muted-foreground">
                    Continue your learning journey and achieve your goals today!
                  </p>
                </div>
              </div>

              {/* Today's Courses */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Today's course</h2>
                <div className="space-y-4">
                  {todaysCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                          {/* Circular Progress */}
                          <div className="relative shrink-0">
                            <svg className="w-20 h-20 -rotate-90">
                              <circle
                                cx="40"
                                cy="40"
                                r="34"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="6"
                                className="text-muted/20"
                              />
                              <circle
                                cx="40"
                                cy="40"
                                r="34"
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="6"
                                strokeDasharray={`${course.progress * 2.14} 214`}
                                strokeLinecap="round"
                                className="text-green-500"
                              />
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#22c55e" />
                                  <stop offset="100%" stopColor="#10b981" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="text-lg font-bold">{course.progress}%</span>
                            </span>
                          </div>

                          {/* Course Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{course.icon}</span>
                              <h3 className="font-semibold text-lg">{course.title}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {course.topics.map((topic, i) => (
                                <span key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                                  {topic}
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="rounded-full">
                                Learn
                              </Button>
                              <Button size="sm" className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                                Continue
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Your class section - Table style */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Your class</h2>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-3 mb-3">
                      <span className="w-8">№</span>
                      <span className="flex-1">Course</span>
                      <span className="w-20 text-center">Duration</span>
                      <span className="w-20 text-center">Done</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xl">
                        🧪
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Microbiology/Science</p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-500" /> Bacteria
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-green-500" /> Viruses
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Fungi
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Cell Division
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* XP Card */}
              <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-0 overflow-hidden relative">
                <CardContent className="p-6">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute right-2 top-2 w-16 h-16 flex items-center justify-center">
                    <span className="text-4xl">💎</span>
                  </div>
                  <p className="text-5xl font-bold mb-1">2400 <span className="text-2xl font-normal">XP</span></p>
                  <p className="text-white/70 text-sm mb-4">Points</p>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="rounded-full bg-white/20 text-white border-0 hover:bg-white/30">
                      Redeem
                    </Button>
                    <Button size="sm" className="rounded-full bg-pink-500 text-white border-0 hover:bg-pink-600">
                      Get More
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Extra Stats */}
              <Card className="bg-white">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Extra Marine</h3>
                  <p className="text-xs text-muted-foreground mb-3">Student Kit Pack</p>
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">24</p>
                      <p className="text-xs text-muted-foreground">Courses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">36</p>
                      <p className="text-xs text-muted-foreground">Certificates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Challenges */}
              <div className="grid grid-cols-2 gap-3">
                {challenges.map((challenge) => (
                  <Card key={challenge.id} className={`${challenge.bgColor} text-white border-0 overflow-hidden`}>
                    <CardContent className="p-4">
                      <span className="text-2xl mb-2 block">{challenge.icon}</span>
                      <h4 className="font-semibold text-sm mb-1">{challenge.title}</h4>
                      <p className="text-xs text-white/80 leading-tight">{challenge.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Activity Chart */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Learning activity</h3>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-violet-500" />
                    Practice
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-pink-400" />
                    Revision
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full border-2 border-muted-foreground" />
                    Part of Review
                  </span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorPractice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRevision" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f472b6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f472b6" stopOpacity={0}/>
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
                      dataKey="practice" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPractice)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revision" 
                      stroke="#f472b6" 
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevision)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {[
                { title: "Daily Learning", icon: Lightbulb, path: "/student/daily-learning", color: "from-yellow-400 to-orange-500" },
                { title: "Calendar", icon: CalendarDays, path: "/student/calendar", color: "from-blue-400 to-indigo-500" },
                { title: "Learn Image", icon: ImagePlus, path: "/student/learn-image", color: "from-purple-400 to-pink-500" },
                { title: "Rewards", icon: Trophy, path: "/student/rewards", color: "from-amber-400 to-yellow-500" },
                { title: "My Growth", icon: TrendingUp, path: "/student/growth", color: "from-green-400 to-emerald-500" },
                { title: "Materials", icon: BookOpen, path: "/student/materials", color: "from-indigo-400 to-violet-500" },
                { title: "Marks", icon: FileText, path: "/student/marks", color: "from-pink-400 to-rose-500" },
                { title: "Attendance", icon: ClipboardCheck, path: "/student/attendance", color: "from-teal-400 to-cyan-500" },
              ].map((item, i) => (
                <Link key={item.path} to={item.path}>
                  <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-lg`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-medium">{item.title}</span>
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
