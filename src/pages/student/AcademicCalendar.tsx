import { useState } from "react";
import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  FileText, 
  CalendarDays, 
  PartyPopper,
  GraduationCap,
  ClipboardList
} from "lucide-react";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

// Mock calendar events - in production, fetch from database
const mockEvents = [
  { id: 1, title: "Unit Test 1 - Maths", date: new Date(2026, 0, 10), type: "unit_test", subject: "Mathematics" },
  { id: 2, title: "Science Project Submission", date: new Date(2026, 0, 15), type: "project", subject: "Science" },
  { id: 3, title: "Republic Day", date: new Date(2026, 0, 26), type: "holiday" },
  { id: 4, title: "Half Yearly Exams Begin", date: new Date(2026, 1, 1), type: "exam" },
  { id: 5, title: "Half Yearly Exams End", date: new Date(2026, 1, 10), type: "exam" },
  { id: 6, title: "Revision - Physics", date: new Date(2026, 0, 5), type: "revision", subject: "Physics" },
  { id: 7, title: "Hindi Essay Homework", date: new Date(2026, 0, 8), type: "homework", subject: "Hindi" },
  { id: 8, title: "Annual Day", date: new Date(2026, 1, 20), type: "event" },
  { id: 9, title: "Sports Day", date: new Date(2026, 2, 5), type: "event" },
  { id: 10, title: "Final Exams", date: new Date(2026, 2, 15), type: "exam" },
];

const eventTypeConfig = {
  exam: { label: "Exam", icon: GraduationCap, color: "bg-destructive text-destructive-foreground" },
  unit_test: { label: "Unit Test", icon: FileText, color: "bg-orange-500 text-white" },
  homework: { label: "Homework", icon: ClipboardList, color: "bg-blue-500 text-white" },
  project: { label: "Project", icon: BookOpen, color: "bg-purple-500 text-white" },
  holiday: { label: "Holiday", icon: PartyPopper, color: "bg-green-500 text-white" },
  event: { label: "Event", icon: CalendarDays, color: "bg-pink-500 text-white" },
  revision: { label: "Revision", icon: BookOpen, color: "bg-yellow-500 text-black" },
};

export default function AcademicCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event => isSameDay(event.date, date));
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  // Get dates that have events for highlighting
  const daysWithEvents = mockEvents.map(e => e.date);

  // Today's events
  const todayEvents = getEventsForDate(new Date());

  return (
    <StudentNav>
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Academic Calendar</h1>
          <p className="text-muted-foreground">View exams, holidays, and important dates</p>
        </div>

        {/* Today's Highlight */}
        {todayEvents.length > 0 && (
          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                Today's Academic Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todayEvents.map(event => {
                  const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
                  const Icon = config.icon;
                  return (
                    <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg bg-background">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        {event.subject && (
                          <p className="text-xs text-muted-foreground">{event.subject}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <Card>
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                month={month}
                onMonthChange={setMonth}
                className="w-full"
                modifiers={{
                  hasEvent: daysWithEvents
                }}
                modifiersStyles={{
                  hasEvent: {
                    fontWeight: "bold",
                    textDecoration: "underline",
                    textDecorationColor: "hsl(var(--primary))",
                    textUnderlineOffset: "4px"
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Events for Selected Date */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map(event => {
                    const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
                    const Icon = config.icon;
                    return (
                      <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{event.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {config.label}
                            </Badge>
                            {event.subject && (
                              <span className="text-xs text-muted-foreground">{event.subject}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No events scheduled for this day</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Event Type Legend */}
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(eventTypeConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${config.color}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <span className="text-sm">{config.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentNav>
  );
}
