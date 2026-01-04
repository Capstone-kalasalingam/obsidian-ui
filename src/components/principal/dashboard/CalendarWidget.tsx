import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

// Sample events - would come from database
const events = [
  { date: new Date(2026, 0, 6), type: "exam", title: "Mid-term Exams" },
  { date: new Date(2026, 0, 10), type: "revision", title: "Revision Week" },
  { date: new Date(2026, 0, 15), type: "event", title: "Sports Day" },
  { date: new Date(2026, 0, 20), type: "holiday", title: "Republic Day" },
];

type EventType = "exam" | "revision" | "event" | "holiday";

const getEventStyle = (type: EventType) => {
  switch (type) {
    case "exam":
      return "bg-kalvion-purple text-white";
    case "revision":
      return "bg-growth text-white";
    case "event":
      return "bg-learning text-white";
    case "holiday":
      return "bg-attention text-white";
  }
};

const CalendarWidget = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const eventDates = events.map((e) => e.date.toDateString());

  const modifiers = {
    event: (day: Date) => eventDates.includes(day.toDateString()),
  };

  const modifiersStyles = {
    event: {
      fontWeight: "bold",
    },
  };

  const upcomingEvents = events
    .filter((e) => e.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  return (
    <Card className="bg-card border-0 rounded-2xl shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          Academic Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-xl border-0 p-0"
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4 w-full",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 h-9 w-9",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-muted rounded-lg transition-colors",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
        />

        {/* Upcoming Events */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Upcoming
          </p>
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getEventStyle(event.type as EventType)}`} />
                <span className="text-sm text-foreground">{event.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {event.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <Badge variant="secondary" className="text-xs bg-kalvion-purple/10 text-kalvion-purple border-0">
            Exams
          </Badge>
          <Badge variant="secondary" className="text-xs bg-growth/10 text-growth border-0">
            Revision
          </Badge>
          <Badge variant="secondary" className="text-xs bg-learning/10 text-learning border-0">
            Events
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;
