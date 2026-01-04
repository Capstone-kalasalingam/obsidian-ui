import { useState, useEffect } from "react";
import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  MessageSquare, 
  Bell, 
  BookOpen, 
  Users,
  Clock,
  CheckCircle2,
  Plus,
  X
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  message: string;
  target: string;
  target_details: string | null;
  created_at: string;
}

interface ClassInfo {
  id: string;
  name: string;
  section: string;
}

type MessageType = "announcement" | "reminder" | "update";

export default function Communication() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [assignedClasses, setAssignedClasses] = useState<ClassInfo[]>([]);
  
  // Form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [messageType, setMessageType] = useState<MessageType>("announcement");

  useEffect(() => {
    if (user) {
      fetchTeacherData();
    }
  }, [user]);

  const fetchTeacherData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Get teacher's assigned classes
      const { data: teacher } = await supabase
        .from("teachers")
        .select(`
          id,
          teacher_assignments (
            class_id,
            classes (id, name, section)
          )
        `)
        .eq("user_id", user.id)
        .single();

      if (teacher?.teacher_assignments) {
        const classes = teacher.teacher_assignments
          .map((a: any) => a.classes)
          .filter((c: any) => c !== null);
        
        // Remove duplicates
        const uniqueClasses = classes.filter((c: ClassInfo, index: number, self: ClassInfo[]) =>
          index === self.findIndex((t) => t.id === c.id)
        );
        
        setAssignedClasses(uniqueClasses);
      }

      // Fetch announcements created by this teacher
      const { data: announcements } = await supabase
        .from("announcements")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (announcements) {
        setAnnouncements(announcements);
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    try {
      const targetDetails = selectedClass === "all" 
        ? "All Classes" 
        : assignedClasses.find(c => c.id === selectedClass)?.name + " " + 
          assignedClasses.find(c => c.id === selectedClass)?.section;

      const { error } = await supabase.from("announcements").insert({
        title: `[${messageType.charAt(0).toUpperCase() + messageType.slice(1)}] ${title}`,
        message,
        target: "parents",
        target_details: targetDetails,
        created_by: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "Parents have been notified",
      });

      // Reset form
      setTitle("");
      setMessage("");
      setSelectedClass("all");
      setMessageType("announcement");
      setShowForm(false);

      // Refresh announcements
      fetchTeacherData();
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes("Reminder")) return <Bell className="w-4 h-4" />;
    if (type.includes("Update")) return <BookOpen className="w-4 h-4" />;
    return <MessageSquare className="w-4 h-4" />;
  };

  const getTypeBadgeVariant = (title: string): "default" | "secondary" | "outline" => {
    if (title.includes("[Reminder]")) return "secondary";
    if (title.includes("[Update]")) return "outline";
    return "default";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quickTemplates = [
    {
      type: "reminder" as MessageType,
      title: "Homework Reminder",
      message: "Dear Parents, please ensure your child completes their homework by the due date.",
    },
    {
      type: "update" as MessageType,
      title: "Class Update",
      message: "Dear Parents, I wanted to update you on the recent progress in class.",
    },
    {
      type: "announcement" as MessageType,
      title: "Upcoming Event",
      message: "Dear Parents, please be informed about an upcoming event.",
    },
  ];

  const applyTemplate = (template: typeof quickTemplates[0]) => {
    setMessageType(template.type);
    setTitle(template.title);
    setMessage(template.message);
  };

  return (
    <TeacherNav>
      <div className="container mx-auto px-4 md:px-6 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Parent Communication</h1>
            <p className="text-muted-foreground text-sm">
              Send announcements and learning reminders to parents
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
            {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {showForm ? "Cancel" : "New Message"}
          </Button>
        </div>

        {/* Create Message Form */}
        {showForm && (
          <Card className="mb-6 border-0 shadow-md animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Compose Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Templates */}
              <div>
                <label className="text-sm font-medium mb-2 block">Quick Templates</label>
                <div className="flex flex-wrap gap-2">
                  {quickTemplates.map((template, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => applyTemplate(template)}
                      className="text-xs"
                    >
                      {template.title}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Message Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Message Type</label>
                <Select value={messageType} onValueChange={(v) => setMessageType(v as MessageType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Announcement
                      </div>
                    </SelectItem>
                    <SelectItem value="reminder">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Learning Reminder
                      </div>
                    </SelectItem>
                    <SelectItem value="update">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Class Update
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Target Class */}
              <div>
                <label className="text-sm font-medium mb-2 block">Send To</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        All My Classes
                      </div>
                    </SelectItem>
                    {assignedClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} - {cls.section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input
                  placeholder="e.g., Weekly Progress Update"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea
                  placeholder="Write your message to parents..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Submit */}
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleSubmit}
                disabled={sending}
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send to Parents
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tabs for message history */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Messages</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading messages...</p>
              </div>
            ) : announcements.length === 0 ? (
              <Card className="border-0">
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start communicating with parents
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Message
                  </Button>
                </CardContent>
              </Card>
            ) : (
              announcements.map((announcement) => (
                <Card key={announcement.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={getTypeBadgeVariant(announcement.title)}>
                          {getTypeIcon(announcement.title)}
                          <span className="ml-1">
                            {announcement.title.includes("[Reminder]") ? "Reminder" : 
                             announcement.title.includes("[Update]") ? "Update" : "Announcement"}
                          </span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {announcement.target_details || "Parents"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDate(announcement.created_at)}
                      </div>
                    </div>
                    <h3 className="font-semibold text-base mb-2">
                      {announcement.title.replace(/\[(Announcement|Reminder|Update)\]\s*/, "")}
                    </h3>
                    <p className="text-sm text-muted-foreground">{announcement.message}</p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-green-600">
                      <CheckCircle2 className="w-3 h-3" />
                      Sent
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="announcements" className="space-y-3">
            {announcements
              .filter((a) => a.title.includes("[Announcement]"))
              .map((announcement) => (
                <Card key={announcement.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <Badge>
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Announcement
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(announcement.created_at)}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">
                      {announcement.title.replace("[Announcement] ", "")}
                    </h3>
                    <p className="text-sm text-muted-foreground">{announcement.message}</p>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="reminders" className="space-y-3">
            {announcements
              .filter((a) => a.title.includes("[Reminder]"))
              .map((announcement) => (
                <Card key={announcement.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <Badge variant="secondary">
                        <Bell className="w-3 h-3 mr-1" />
                        Reminder
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(announcement.created_at)}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">
                      {announcement.title.replace("[Reminder] ", "")}
                    </h3>
                    <p className="text-sm text-muted-foreground">{announcement.message}</p>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>

        {/* Mobile FAB */}
        {!showForm && announcements.length > 0 && (
          <Button
            onClick={() => setShowForm(true)}
            size="lg"
            className="fixed bottom-20 right-4 lg:hidden rounded-full w-14 h-14 shadow-lg p-0"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}
      </div>
    </TeacherNav>
  );
}
