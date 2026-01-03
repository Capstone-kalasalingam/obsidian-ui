import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, User } from "lucide-react";
import { weeklyTimetable } from "@/data/studentMockData";
import { useState } from "react";
import { cn } from "@/lib/utils";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const subjectColors: Record<string, string> = {
  Telugu: "from-orange-500 to-red-500",
  Hindi: "from-amber-500 to-orange-500",
  English: "from-blue-500 to-indigo-500",
  Mathematics: "from-violet-500 to-purple-500",
  Science: "from-emerald-500 to-teal-500",
  "Social Studies": "from-cyan-500 to-blue-500",
  "Physical Education": "from-green-500 to-emerald-500",
  "Art & Craft": "from-pink-500 to-rose-500",
  Library: "from-slate-500 to-gray-600",
};

const Timetable = () => {
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date().getDay();
    return today === 0 ? "Monday" : days[today - 1] || "Monday";
  });

  const todaySchedule = weeklyTimetable[selectedDay as keyof typeof weeklyTimetable] || [];

  return (
    <StudentNav>
      <div className="min-h-screen bg-gradient-soft">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-primary" />
              Weekly Timetable
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Your class schedule for the week</p>
          </div>

          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {days.map((day) => {
              const isToday = day === selectedDay;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                    isToday
                      ? "bg-gradient-to-r from-primary to-violet-600 text-white shadow-lg"
                      : "bg-card text-muted-foreground hover:bg-muted"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Schedule Grid */}
          <div className="space-y-3">
            {todaySchedule.map((period, index) => (
              <Card
                key={index}
                className="border-0 bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    {/* Period Number */}
                    <div className={cn(
                      "w-16 flex-shrink-0 flex flex-col items-center justify-center bg-gradient-to-br text-white",
                      subjectColors[period.subject] || "from-gray-500 to-gray-600"
                    )}>
                      <span className="text-xs opacity-80">Period</span>
                      <span className="text-2xl font-bold">{period.period}</span>
                    </div>

                    {/* Period Details */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{period.subject}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {period.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {period.teacher}
                            </span>
                          </div>
                        </div>
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-lg",
                          "bg-gradient-to-br shadow-md",
                          subjectColors[period.subject] || "from-gray-500 to-gray-600"
                        )}>
                          {period.subject === "Telugu" && "📖"}
                          {period.subject === "Hindi" && "📝"}
                          {period.subject === "English" && "📚"}
                          {period.subject === "Mathematics" && "📐"}
                          {period.subject === "Science" && "🔬"}
                          {period.subject === "Social Studies" && "🌍"}
                          {period.subject === "Physical Education" && "⚽"}
                          {period.subject === "Art & Craft" && "🎨"}
                          {period.subject === "Library" && "📚"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Break Info */}
          <Card className="mt-6 border-0 bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Short Break: 10:30 - 10:45 AM
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Lunch Break: 12:15 - 1:00 PM
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentNav>
  );
};

export default Timetable;