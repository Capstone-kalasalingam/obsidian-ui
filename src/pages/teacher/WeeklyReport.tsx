import { useState } from "react";
import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { classes } from "@/data/teacherMockData";
import { CalendarIcon, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock data for subject comparison
const subjectData = [
  { subject: "English", marks: 62 },
  { subject: "Math", marks: 70 },
  { subject: "Science", marks: 55 },
  { subject: "History", marks: 75 },
  { subject: "Geography", marks: 88 },
];

export default function WeeklyReport() {
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState<Date>();

  return (
    <TeacherNav>
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
        <div className="mb-6 md:mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">
            Class Progress
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Weekly progress tracking and analytics
          </p>
        </div>

        {/* Class Selection & Date Picker */}
        <Card className="mb-4 md:mb-6 animate-slide-up border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">Select Class & Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select Class
                </label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select Week
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress Card */}
        {selectedClass && (
          <div className="space-y-4 md:space-y-6 animate-slide-in-left">
            <Card className="border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base md:text-lg">
                    {selectedClass}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    Weekly progress card
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-6 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Average Marks
                    </p>
                    <p className="text-5xl font-bold">76%</p>
                  </div>
                  <div className="text-center p-6 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Attendance
                    </p>
                    <p className="text-5xl font-bold">92%</p>
                  </div>
                </div>

                {/* Subject Comparison Chart */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Subject Comparison
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={subjectData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="subject"
                        tick={{ fontSize: 12 }}
                        angle={0}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="marks"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ r: 6, fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Top Performer</p>
                      <p className="text-2xl font-bold mt-1">Jane Doe</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Assignments Due</p>
                      <p className="text-2xl font-bold mt-1">5</p>
                    </div>
                    <CalendarIcon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Class Average</p>
                      <p className="text-2xl font-bold mt-1">B+</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">A</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {!selectedClass && (
          <Card className="animate-fade-in border-0">
            <CardContent className="py-12 text-center">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Select a class to view progress
              </h3>
              <p className="text-muted-foreground">
                Choose a class from the dropdown above to see weekly progress data
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TeacherNav>
  );
}
