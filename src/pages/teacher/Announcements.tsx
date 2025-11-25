import { useState } from "react";
import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { announcements as initialAnnouncements, classes } from "@/data/teacherMockData";
import { Plus, Bell, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Announcements() {
  const [showForm, setShowForm] = useState(false);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!title || !message || !selectedClass) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newAnnouncement = {
      id: announcements.length + 1,
      title,
      message,
      class: classes.find((c) => c.id === selectedClass)?.name || selectedClass,
      date: new Date().toISOString().split("T")[0],
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setTitle("");
    setMessage("");
    setSelectedClass("");
    setShowForm(false);

    toast({
      title: "Success!",
      description: "Announcement created (Demo mode - stored locally only)",
    });
  };

  return (
    <TeacherNav>
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-4xl">
        <div className="mb-6 md:mb-8 animate-fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Announcements</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Create and manage class announcements
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? "Cancel" : "New"}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-4 md:mb-6 animate-slide-up border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Create New Announcement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Title
                  </label>
                  <Input
                    placeholder="e.g., Parent-Teacher Meeting"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Message
                  </label>
                  <Textarea
                    placeholder="Enter your announcement message..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Target Class/Section
                  </label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" size="lg" onClick={handleSubmit}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Announcement
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Announcements List */}
        <div className="space-y-3 md:space-y-4 animate-slide-in-left">
          {announcements.map((announcement) => (
            <Card
              key={announcement.id}
              className="hover:shadow-lg transition-shadow border-0 shadow-sm"
            >
              <CardContent className="p-4 md:pt-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-block px-3 py-1 bg-muted text-foreground rounded-lg text-xs md:text-sm font-medium">
                      {announcement.class}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(announcement.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg md:text-xl mb-2">
                      {announcement.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {announcement.message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {announcements.length === 0 && (
          <Card className="animate-fade-in border-0">
            <CardContent className="py-12 text-center">
              <Bell className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                No announcements yet
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                Create your first announcement to notify students
              </p>
              <Button onClick={() => setShowForm(true)}>
                Create Announcement
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create Button - Mobile Fixed */}
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
