import { useState } from "react";
import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const timetableData = {
  Mon: [
    { period: "1st", time: "9:00-10:00", subject: "English", class: "10 A" },
    { period: "2nd", time: "10:00-11:00", subject: "English", class: "10 B" },
    { period: "3rd", time: "11:15-12:15", subject: "History", class: "9 C" },
    { period: "4th", time: "12:15-1:15", subject: "Geography", class: "8 A" },
    { period: "5th", time: "2:15-3:15", subject: "Physics", class: "11 B" },
  ],
  Tue: [
    { period: "1st", time: "9:00-10:00", subject: "English", class: "9 A" },
    { period: "2nd", time: "10:00-11:00", subject: "English", class: "10 A" },
    { period: "3rd", time: "11:15-12:15", subject: "History", class: "10 C" },
    { period: "4th", time: "12:15-1:15", subject: "Geography", class: "9 B" },
    { period: "5th", time: "2:15-3:15", subject: "Physics", class: "11 A" },
  ],
  Wed: [
    { period: "1st", time: "9:00-10:00", subject: "History", class: "10 B" },
    { period: "2nd", time: "10:00-11:00", subject: "English", class: "9 C" },
    { period: "3rd", time: "11:15-12:15", subject: "Geography", class: "10 A" },
    { period: "4th", time: "12:15-1:15", subject: "English", class: "11 B" },
    { period: "5th", time: "2:15-3:15", subject: "History", class: "9 A" },
  ],
  Thu: [
    { period: "1st", time: "9:00-10:00", subject: "Physics", class: "10 A" },
    { period: "2nd", time: "10:00-11:00", subject: "Geography", class: "9 A" },
    { period: "3rd", time: "11:15-12:15", subject: "English", class: "10 C" },
    { period: "4th", time: "12:15-1:15", subject: "History", class: "11 A" },
    { period: "5th", time: "2:15-3:15", subject: "English", class: "9 B" },
  ],
  Fri: [
    { period: "1st", time: "9:00-10:00", subject: "Geography", class: "10 C" },
    { period: "2nd", time: "10:00-11:00", subject: "History", class: "9 B" },
    { period: "3rd", time: "11:15-12:15", subject: "Physics", class: "10 A" },
    { period: "4th", time: "12:15-1:15", subject: "English", class: "11 C" },
    { period: "5th", time: "2:15-3:15", subject: "Geography", class: "9 C" },
  ],
};

export default function Timetable() {
  const [selectedDay, setSelectedDay] = useState<string>("Tue");
  const currentSchedule = timetableData[selectedDay as keyof typeof timetableData];

  // Get current day
  const getCurrentDay = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = days[new Date().getDay()];
    return daysOfWeek.includes(today) ? today : "Mon";
  };

  return (
    <TeacherNav>
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          {/* Header */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              My Timetable
            </h1>
            <p className="text-muted-foreground">
              Your weekly class schedule at a glance
            </p>
          </div>

          {/* Day Selector - Grid Layout for Mobile */}
          <div className="mb-6 animate-slide-up">
            <div className="grid grid-cols-5 gap-2 md:flex md:gap-3">
              {daysOfWeek.map((day) => {
                const isToday = day === getCurrentDay();
                const isSelected = selectedDay === day;
                
                return (
                  <Button
                    key={day}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setSelectedDay(day)}
                    className={`flex-1 font-semibold relative ${
                      isSelected
                        ? "shadow-md"
                        : "hover:bg-accent"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1 w-full">
                      <span className="text-xs md:text-sm">{day}</span>
                      {isToday && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary absolute bottom-1" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Schedule Cards */}
          <div className="space-y-3 animate-slide-in-left">
            {currentSchedule.map((period, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/60"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Period Badge - Left Side */}
                    <div className="bg-primary/5 px-6 py-4 flex items-center justify-center sm:justify-start sm:w-32 border-b sm:border-b-0 sm:border-r border-border/50">
                      <div className="text-center sm:text-left">
                        <div className="text-sm text-muted-foreground font-medium mb-1">
                          Period
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {period.period.replace(/\D/g, '')}
                        </div>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Subject & Class */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <h3 className="text-lg md:text-xl font-bold">
                              {period.subject}
                            </h3>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Class {period.class}
                          </Badge>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg sm:ml-4">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-sm">
                            {period.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Break Info */}
          <Card className="mt-6 border-0 bg-gradient-to-r from-primary/10 to-primary/5 animate-fade-in">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-sm md:text-base">
                    Lunch Break
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    1:15 PM - 2:15 PM
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
