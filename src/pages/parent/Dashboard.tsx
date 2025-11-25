import { Link } from "react-router-dom";
import ParentNav from "@/components/parent/ParentNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockChildren, mockAttendance, mockMarks, mockAnnouncements, mockFeeDetails } from "@/data/parentMockData";
import { Calendar, FileText, CreditCard, Megaphone, TrendingUp, AlertCircle } from "lucide-react";

const ParentDashboard = () => {
  // Using first child for demo
  const currentChild = mockChildren[0];
  
  // Calculate attendance percentage
  const totalDays = mockAttendance.length;
  const presentDays = mockAttendance.filter(r => r.status === "Present").length;
  const attendancePercentage = Math.round((presentDays / totalDays) * 100);

  // Get latest exam
  const latestExam = mockMarks[mockMarks.length - 1];

  // Get recent announcements
  const recentAnnouncements = mockAnnouncements.slice(0, 3);

  return (
    <div className="min-h-screen flex bg-background font-open-sans">
      <ParentNav />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Welcome Back!
              </h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Viewing data for {currentChild.name}
              </p>
            </div>
            <Badge variant="outline" className="text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2" />
              Demo Mode
            </Badge>
          </div>

          {/* Child Info Card */}
          <Card className="shadow-md border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Student Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold">{currentChild.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-semibold">{currentChild.class} - {currentChild.section}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Roll Number</p>
                <p className="font-semibold">{currentChild.rollNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="font-semibold text-primary">{attendancePercentage}%</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="shadow-md border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{attendancePercentage}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {presentDays} of {totalDays} days present
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Latest Exam</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{latestExam.percentage}%</div>
                <p className="text-xs text-muted-foreground mt-1">{latestExam.examName}</p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fee Pending</CardTitle>
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">
                  ₹{mockFeeDetails.pendingAmount.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Due: {mockFeeDetails.dueDate}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Announcements</CardTitle>
                <Megaphone className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{mockAnnouncements.length}</div>
                <p className="text-xs text-muted-foreground mt-1">New updates</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="shadow-md border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
              <CardDescription className="text-sm">Access important sections quickly</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <Link to="/parent/attendance">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>View Attendance</span>
                </Button>
              </Link>
              <Link to="/parent/marks">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span>View Marks</span>
                </Button>
              </Link>
              <Link to="/parent/fees">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <CreditCard className="h-6 w-6" />
                  <span>Fee Status</span>
                </Button>
              </Link>
              <Link to="/parent/announcements">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Megaphone className="h-6 w-6" />
                  <span>Announcements</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Performance */}
          <Card className="shadow-md border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                Recent Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestExam.subjects.slice(0, 5).map((subject) => (
                  <div key={subject.name} className="flex items-center justify-between">
                    <span className="font-medium">{subject.name}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${subject.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-16 text-right">
                        {subject.marksObtained}/{subject.totalMarks}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card className="shadow-md border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {announcement.message.slice(0, 100)}...
                      </p>
                    </div>
                    <Badge variant={announcement.type === "School" ? "default" : "secondary"}>
                      {announcement.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>{announcement.postedBy}</span>
                    <span>•</span>
                    <span>{announcement.date}</span>
                  </div>
                </div>
              ))}
              <Link to="/parent/announcements">
                <Button variant="outline" className="w-full">View All Announcements</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
