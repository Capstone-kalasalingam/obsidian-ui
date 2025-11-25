import { useState } from "react";
import ParentNav from "@/components/parent/ParentNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockChildren, mockAttendance } from "@/data/parentMockData";
import { Calendar, TrendingUp, Clock } from "lucide-react";

const ParentAttendance = () => {
  const currentChild = mockChildren[0];
  const [selectedMonth, setSelectedMonth] = useState("January");

  const totalDays = mockAttendance.length;
  const presentDays = mockAttendance.filter(r => r.status === "Present").length;
  const absentDays = totalDays - presentDays;
  const attendancePercentage = Math.round((presentDays / totalDays) * 100);

  return (
    <div className="min-h-screen flex bg-background font-open-sans">
      <ParentNav />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Attendance Overview
              </h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                {currentChild.name} - Class {currentChild.class}{currentChild.section}
              </p>
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="January">January 2024</SelectItem>
                <SelectItem value="February">February 2024</SelectItem>
                <SelectItem value="March">March 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="shadow-md border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Attendance</CardTitle>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{attendancePercentage}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Overall attendance rate
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present Days</CardTitle>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{presentDays}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Days attended
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">{absentDays}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Days missed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Records */}
          <Card className="shadow-md border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Attendance Records</CardTitle>
              <CardDescription className="text-sm">Daily attendance status for {selectedMonth}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAttendance.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{record.date}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={record.status === "Present" ? "default" : "destructive"}
                      className="text-sm px-4 py-1"
                    >
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Visual Progress Bar */}
          <Card className="shadow-md border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Monthly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Present</span>
                    <span className="text-sm font-medium">{presentDays}/{totalDays} days</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${attendancePercentage}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Absent</span>
                    <span className="text-sm font-medium">{absentDays}/{totalDays} days</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-destructive h-3 rounded-full transition-all"
                      style={{ width: `${(absentDays / totalDays) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ParentAttendance;
