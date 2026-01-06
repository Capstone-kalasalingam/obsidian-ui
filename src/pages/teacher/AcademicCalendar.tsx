import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, isWithinInterval, addMonths, subMonths } from "date-fns";
import {
  Calendar as CalendarIcon,
  BookOpen,
  PartyPopper,
  GraduationCap,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type EventType = "exam" | "holiday" | "revision" | "event";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  event_type: string;
  class_name: string | null;
  subject: string | null;
}

const eventTypeConfig: Record<EventType, { label: string; icon: typeof CalendarIcon; gradient: string; bgGlow: string }> = {
  exam: { 
    label: "Exam", 
    icon: GraduationCap, 
    gradient: "from-violet-500 to-purple-600",
    bgGlow: "shadow-violet-500/20"
  },
  holiday: { 
    label: "Holiday", 
    icon: PartyPopper, 
    gradient: "from-emerald-500 to-teal-600",
    bgGlow: "shadow-emerald-500/20"
  },
  revision: { 
    label: "Revision", 
    icon: BookOpen, 
    gradient: "from-amber-500 to-orange-600",
    bgGlow: "shadow-amber-500/20"
  },
  event: { 
    label: "Event", 
    icon: CalendarIcon, 
    gradient: "from-blue-500 to-cyan-600",
    bgGlow: "shadow-blue-500/20"
  },
};

export default function TeacherAcademicCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMonth, setViewMonth] = useState<Date>(new Date());

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["teacher-calendar-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academic_calendar_events")
        .select("*")
        .order("event_date", { ascending: true });
      if (error) throw error;
      return data as CalendarEvent[];
    },
  });

  const selectedDateEvents = events.filter((event) => {
    const eventDate = parseISO(event.event_date);
    if (event.end_date) {
      const endDate = parseISO(event.end_date);
      return isWithinInterval(selectedDate, { start: eventDate, end: endDate });
    }
    return isSameDay(eventDate, selectedDate);
  });

  const monthEvents = events.filter((event) => {
    const eventDate = parseISO(event.event_date);
    const monthStart = startOfMonth(viewMonth);
    const monthEnd = endOfMonth(viewMonth);
    return isWithinInterval(eventDate, { start: monthStart, end: monthEnd });
  });

  const upcomingEvents = events
    .filter((event) => parseISO(event.event_date) >= new Date())
    .slice(0, 5);

  const eventDates = events.map((e) => parseISO(e.event_date));

  return (
    <TeacherNav>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Premium Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-6 md:p-8 border border-primary/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                    <CalendarIcon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Academic Calendar</h1>
                    <p className="text-muted-foreground">Track important dates, exams & events</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary/30 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <Card className="overflow-hidden border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-2 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      {format(viewMonth, "MMMM yyyy")}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setViewMonth(subMonths(viewMonth, 1))}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setViewMonth(addMonths(viewMonth, 1))}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    month={viewMonth}
                    onMonthChange={setViewMonth}
                    modifiers={{
                      hasEvent: eventDates,
                    }}
                    modifiersClassNames={{
                      hasEvent: "bg-primary/20 font-bold ring-2 ring-primary/30",
                    }}
                    className="rounded-xl"
                  />
                </CardContent>
              </Card>

              {/* Upcoming Events Quick View */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="mt-6 border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-3 border-b border-border/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[200px]">
                      {isLoading ? (
                        <div className="p-4 space-y-3">
                          {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                          ))}
                        </div>
                      ) : upcomingEvents.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No upcoming events</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-border/50">
                          {upcomingEvents.map((event) => {
                            const config = eventTypeConfig[event.event_type as EventType] || eventTypeConfig.event;
                            const Icon = config.icon;
                            return (
                              <div
                                key={event.id}
                                className="p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                                onClick={() => setSelectedDate(parseISO(event.event_date))}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient}`}>
                                    <Icon className="w-3.5 h-3.5 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{event.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {format(parseISO(event.event_date), "MMM d")}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Events Detail Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Selected Date Events */}
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-gradient-to-r from-muted/50 to-transparent">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold">
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </span>
                      <p className="text-sm text-muted-foreground font-normal">
                        {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''} scheduled
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <Skeleton key={i} className="h-24 w-full rounded-xl" />
                        ))}
                      </div>
                    ) : selectedDateEvents.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="text-center py-12"
                      >
                        <div className="w-20 h-20 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-4">
                          <CalendarIcon className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-1">No Events</h3>
                        <p className="text-muted-foreground text-sm">
                          No events scheduled for this date
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        {selectedDateEvents.map((event, index) => {
                          const config = eventTypeConfig[event.event_type as EventType] || eventTypeConfig.event;
                          const Icon = config.icon;
                          return (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`p-5 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border/50 shadow-lg ${config.bgGlow} hover:shadow-xl transition-all duration-300`}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg`}>
                                  <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <h3 className="font-semibold text-lg text-foreground">{event.title}</h3>
                                      <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <Badge 
                                          variant="secondary" 
                                          className={`bg-gradient-to-r ${config.gradient} text-white border-0`}
                                        >
                                          {config.label}
                                        </Badge>
                                        {event.class_name && (
                                          <Badge variant="outline" className="bg-background/50">
                                            {event.class_name}
                                          </Badge>
                                        )}
                                        {event.subject && (
                                          <Badge variant="outline" className="bg-background/50">
                                            {event.subject}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {event.description && (
                                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                                      {event.description}
                                    </p>
                                  )}
                                  {event.end_date && (
                                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      Until {format(parseISO(event.end_date), "MMMM d, yyyy")}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Month Overview */}
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="text-base font-semibold">
                    This Month's Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(eventTypeConfig).map(([type, config]) => {
                      const count = monthEvents.filter((e) => e.event_type === type).length;
                      const Icon = config.icon;
                      return (
                        <motion.div
                          key={type}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/50 text-center`}
                        >
                          <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-2`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-2xl font-bold text-foreground">{count}</div>
                          <div className="text-xs text-muted-foreground">{config.label}s</div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </TeacherNav>
  );
}
