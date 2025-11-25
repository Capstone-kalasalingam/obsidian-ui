import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { classProgress } from "@/data/teacherMockData";
import { TrendingUp, Users, Award, BarChart3 } from "lucide-react";

export default function ClassProgress() {
  return (
    <TeacherNav>
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
        <div className="mb-6 md:mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Class Progress Overview</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Analytics and performance metrics (Mock Data)
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8 animate-slide-up">
          <Card className="hover:shadow-lg transition-shadow border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Weekly Attendance
                  </p>
                  <p className="text-4xl font-bold">
                    {classProgress.weeklyAttendance}%
                  </p>
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +3% from last week
                  </p>
                </div>
                <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Class Average Marks
                  </p>
                  <p className="text-4xl font-bold">
                    {classProgress.classAverage}%
                  </p>
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +5% from last term
                  </p>
                </div>
                <div className="w-16 h-16 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject-wise Performance */}
        <Card className="animate-slide-in-left border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 md:gap-3">
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <CardTitle className="text-base md:text-lg">Subject-wise Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {classProgress.subjectPerformance.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{item.subject}</span>
                    <span className="text-lg font-bold text-primary">
                      {item.average}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${item.average}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6 animate-slide-up">
          <Card className="border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm md:text-base">Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Diya Patel", score: 95 },
                  { name: "Aarav Sharma", score: 92 },
                  { name: "Ishita Joshi", score: 90 },
                ].map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="font-medium">{student.name}</span>
                    <span className="text-primary font-bold">
                      {student.score}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Needs Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Arjun Kumar", score: 55 },
                  { name: "Priya Reddy", score: 58 },
                  { name: "Vikram Nair", score: 62 },
                ].map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="font-medium">{student.name}</span>
                    <span className="text-orange-600 font-bold">
                      {student.score}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    Attendance Improving
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    +8% over 2 weeks
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    Math Scores Rising
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Average up by 6 points
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm font-medium text-orange-800">
                    Geometry Struggling
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    Consider extra classes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherNav>
  );
}
