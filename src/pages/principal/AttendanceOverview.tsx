import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent } from "@/components/ui/card";
import { mockAttendanceData, mockTeachers } from "@/data/mockData";
import { Calendar, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const AttendanceOverview = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showTeacherDialog, setShowTeacherDialog] = useState(false);

  const totalTeachers = mockAttendanceData.teachersPresent + mockAttendanceData.teachersAbsent;
  const totalStudents = mockAttendanceData.studentsPresent + mockAttendanceData.studentsAbsent;
  const teacherPercentage = Math.round((mockAttendanceData.teachersPresent / totalTeachers) * 100);
  const studentPercentage = Math.round((mockAttendanceData.studentsPresent / totalStudents) * 100);

  // Mock teachers on leave (taking the last 2 teachers as on leave)
  const teachersOnLeave = mockTeachers.slice(-mockAttendanceData.teachersAbsent);
  
  // Pie chart data
  const pieData = [
    { name: 'Present', value: mockAttendanceData.teachersPresent, color: '#22c55e' },
    { name: 'On Leave', value: mockAttendanceData.teachersAbsent, color: '#ef4444' },
  ];

  return (
    <PrincipalNav>
      <div className="px-4 py-6 space-y-6">
        {/* Date Selector */}
        <div className="space-y-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="bg-card border border-border rounded-2xl shadow-card cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setShowTeacherDialog(true)}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">{mockAttendanceData.teachersPresent}</p>
              <p className="text-sm font-medium text-foreground">Teachers Present</p>
              <p className="text-xs text-muted-foreground mt-1">Out of {totalTeachers} • Tap to view</p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border rounded-2xl shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-destructive" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">{mockAttendanceData.studentsAbsent}</p>
              <p className="text-sm font-medium text-foreground">Students Absent</p>
              <p className="text-xs text-muted-foreground mt-1">Out of {totalStudents}</p>
            </CardContent>
          </Card>
        </div>

        {/* Teacher Attendance Dialog */}
        <Dialog open={showTeacherDialog} onOpenChange={setShowTeacherDialog}>
          <DialogContent className="max-w-[90%] max-h-[85vh] overflow-y-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Teacher Attendance</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 mt-4">
              {/* Pie Chart */}
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-green-50 border-green-200 rounded-xl">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-700">{mockAttendanceData.teachersPresent}</p>
                    <p className="text-sm font-medium text-green-600">Present</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-200 rounded-xl">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-red-700">{mockAttendanceData.teachersAbsent}</p>
                    <p className="text-sm font-medium text-red-600">On Leave</p>
                  </CardContent>
                </Card>
              </div>

              {/* Teachers on Leave List */}
              {teachersOnLeave.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-base">Teachers on Leave</h4>
                  <div className="space-y-2">
                    {teachersOnLeave.map((teacher) => (
                      <Card key={teacher.id} className="bg-card border border-border rounded-xl">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-red-700">
                                {teacher.name.split(" ").map(n => n[0]).join("")}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{teacher.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {teacher.subjects.join(", ")} • {teacher.classAssigned || "No class assigned"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PrincipalNav>
  );
};

export default AttendanceOverview;
