import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import {
  Plus,
  Calendar as CalendarIcon,
  BookOpen,
  PartyPopper,
  GraduationCap,
  Clock,
  Pencil,
  Trash2,
} from "lucide-react";

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
  created_at: string;
}

const eventTypeConfig: Record<EventType, { label: string; icon: typeof CalendarIcon; color: string; bgColor: string }> = {
  exam: { label: "Exam", icon: GraduationCap, color: "text-kalvion-purple", bgColor: "bg-kalvion-purple/10" },
  holiday: { label: "Holiday", icon: PartyPopper, color: "text-growth", bgColor: "bg-growth/10" },
  revision: { label: "Revision", icon: BookOpen, color: "text-learning", bgColor: "bg-learning/10" },
  event: { label: "Event", icon: CalendarIcon, color: "text-attention", bgColor: "bg-attention/10" },
};

const AcademicCalendar = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMonth, setViewMonth] = useState<Date>(new Date());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    end_date: "",
    event_type: "event" as EventType,
    class_name: "",
    subject: "",
  });

  // Fetch events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["academic-calendar-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academic_calendar_events")
        .select("*")
        .order("event_date", { ascending: true });
      if (error) throw error;
      return data as CalendarEvent[];
    },
  });

  // Create event mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("academic_calendar_events").insert({
        title: data.title,
        description: data.description || null,
        event_date: data.event_date,
        end_date: data.end_date || null,
        event_type: data.event_type,
        class_name: data.class_name || null,
        subject: data.subject || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-calendar-events"] });
      toast.success("Event created successfully");
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to create event: " + error.message);
    },
  });

  // Update event mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("academic_calendar_events")
        .update({
          title: data.title,
          description: data.description || null,
          event_date: data.event_date,
          end_date: data.end_date || null,
          event_type: data.event_type,
          class_name: data.class_name || null,
          subject: data.subject || null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-calendar-events"] });
      toast.success("Event updated successfully");
      setIsEditOpen(false);
      setSelectedEvent(null);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to update event: " + error.message);
    },
  });

  // Delete event mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("academic_calendar_events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-calendar-events"] });
      toast.success("Event deleted successfully");
      setIsDeleteOpen(false);
      setSelectedEvent(null);
    },
    onError: (error) => {
      toast.error("Failed to delete event: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      event_date: "",
      end_date: "",
      event_type: "event",
      class_name: "",
      subject: "",
    });
  };

  const handleCreate = () => {
    if (!formData.title || !formData.event_date) {
      toast.error("Please fill in required fields");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEdit = () => {
    if (!selectedEvent || !formData.title || !formData.event_date) {
      toast.error("Please fill in required fields");
      return;
    }
    updateMutation.mutate({ id: selectedEvent.id, data: formData });
  };

  const openEditDialog = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      event_date: event.event_date,
      end_date: event.end_date || "",
      event_type: event.event_type as EventType,
      class_name: event.class_name || "",
      subject: event.subject || "",
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDeleteOpen(true);
  };

  // Get events for selected date
  const selectedDateEvents = events.filter((event) => {
    const eventDate = parseISO(event.event_date);
    if (event.end_date) {
      const endDate = parseISO(event.end_date);
      return isWithinInterval(selectedDate, { start: eventDate, end: endDate });
    }
    return isSameDay(eventDate, selectedDate);
  });

  // Get events for current month view
  const monthEvents = events.filter((event) => {
    const eventDate = parseISO(event.event_date);
    const monthStart = startOfMonth(viewMonth);
    const monthEnd = endOfMonth(viewMonth);
    return isWithinInterval(eventDate, { start: monthStart, end: monthEnd });
  });

  // Get dates with events for calendar highlighting
  const eventDates = events.map((e) => parseISO(e.event_date));

  const EventForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Event title"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event_date">Start Date *</Label>
          <Input
            id="event_date"
            type="date"
            value={formData.event_date}
            onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="event_type">Event Type *</Label>
        <Select
          value={formData.event_type}
          onValueChange={(value) => setFormData({ ...formData, event_type: value as EventType })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="exam">📝 Exam</SelectItem>
            <SelectItem value="holiday">🎉 Holiday</SelectItem>
            <SelectItem value="revision">📖 Revision</SelectItem>
            <SelectItem value="event">📅 Event</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="class_name">Class (Optional)</Label>
          <Input
            id="class_name"
            value={formData.class_name}
            onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
            placeholder="e.g., Class 6"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject (Optional)</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="e.g., Mathematics"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Event description..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setIsCreateOpen(false);
            setIsEditOpen(false);
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );

  return (
    <PrincipalNav>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Academic Calendar</h1>
            <p className="text-muted-foreground">Manage school events, exams, holidays, and revision periods</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-kalvion-blue to-kalvion-purple hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <EventForm onSubmit={handleCreate} submitLabel="Create Event" />
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-1 bg-card border-0 rounded-2xl shadow-card">
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                onMonthChange={setViewMonth}
                modifiers={{
                  hasEvent: eventDates,
                }}
                modifiersClassNames={{
                  hasEvent: "bg-kalvion-purple/20 font-bold",
                }}
                className="rounded-lg"
              />
            </CardContent>
          </Card>

          {/* Events for Selected Date */}
          <Card className="lg:col-span-2 bg-card border-0 rounded-2xl shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-kalvion-purple" />
                Events on {format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading events...</div>
              ) : selectedDateEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground">No events scheduled for this date</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setFormData({ ...formData, event_date: format(selectedDate, "yyyy-MM-dd") });
                      setIsCreateOpen(true);
                    }}
                    className="mt-2"
                  >
                    Add an event
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event, index) => {
                    const config = eventTypeConfig[event.event_type as EventType] || eventTypeConfig.event;
                    const Icon = config.icon;
                    return (
                      <div
                        key={event.id}
                        className={`p-4 rounded-xl ${config.bgColor} animate-fade-in hover-scale-soft cursor-pointer`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-background/50`}>
                              <Icon className={`w-5 h-5 ${config.color}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{event.title}</h3>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {config.label}
                                </Badge>
                                {event.class_name && (
                                  <Badge variant="outline" className="text-xs">
                                    {event.class_name}
                                  </Badge>
                                )}
                                {event.subject && (
                                  <Badge variant="outline" className="text-xs">
                                    {event.subject}
                                  </Badge>
                                )}
                              </div>
                              {event.description && (
                                <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                              )}
                              {event.end_date && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Until {format(parseISO(event.end_date), "MMM d, yyyy")}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditDialog(event);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteDialog(event);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events List */}
        <Card className="bg-card border-0 rounded-2xl shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">This Month's Events</CardTitle>
          </CardHeader>
          <CardContent>
            {monthEvents.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No events this month</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {monthEvents.map((event, index) => {
                  const config = eventTypeConfig[event.event_type as EventType] || eventTypeConfig.event;
                  const Icon = config.icon;
                  return (
                    <div
                      key={event.id}
                      className={`p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-all animate-fade-in hover-scale-soft cursor-pointer`}
                      style={{ animationDelay: `${index * 30}ms` }}
                      onClick={() => setSelectedDate(parseISO(event.event_date))}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {format(parseISO(event.event_date), "MMM d")}
                            {event.end_date && ` - ${format(parseISO(event.end_date), "MMM d")}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            <EventForm onSubmit={handleEdit} submitLabel="Save Changes" />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Event</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedEvent && deleteMutation.mutate(selectedEvent.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PrincipalNav>
  );
};

export default AcademicCalendar;
