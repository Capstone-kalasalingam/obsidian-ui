import { useState } from "react";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useAnnouncements, useClasses } from "@/hooks/usePrincipalData";
import { Plus, Megaphone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const Announcements = () => {
  const { announcements, loading, createAnnouncement } = useAnnouncements();
  const { classes } = useClasses();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [target, setTarget] = useState("school");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetDetails, setTargetDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await createAnnouncement({
        title,
        message,
        target,
        target_details: target !== "school" ? targetDetails : undefined,
      });
      toast.success("Announcement created successfully!");
      setDialogOpen(false);
      setTitle("");
      setMessage("");
      setTarget("school");
      setTargetDetails("");
    } catch (error) {
      toast.error("Failed to create announcement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PrincipalNav>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Announcements</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="rounded-full h-10 px-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90%] rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Create Announcement</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateAnnouncement} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter title" 
                      className="rounded-xl"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Enter message" 
                      rows={4}
                      className="rounded-xl resize-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target">Target Audience</Label>
                    <Select value={target} onValueChange={setTarget}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select target" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border z-50">
                        <SelectItem value="school">Whole School</SelectItem>
                        <SelectItem value="class">Specific Class</SelectItem>
                        <SelectItem value="role">Specific Role</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {target === "class" && (
                    <div className="space-y-2">
                      <Label htmlFor="class">Select Class</Label>
                      <Select value={targetDetails} onValueChange={setTargetDetails}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Choose class" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border z-50">
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={`${cls.name} ${cls.section}`}>
                              {cls.name} - {cls.section}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {target === "role" && (
                    <div className="space-y-2">
                      <Label htmlFor="role">Select Role</Label>
                      <Select value={targetDetails} onValueChange={setTargetDetails}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Choose role" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border z-50">
                          <SelectItem value="Teachers">Teachers</SelectItem>
                          <SelectItem value="Students">Students</SelectItem>
                          <SelectItem value="Parents">Parents</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full rounded-xl"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Announcement"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Announcements List */}
        <div className="px-4 py-4 space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-card border border-border rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-12 h-12 rounded-2xl" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : announcements.length === 0 ? (
            <Card className="bg-card border border-border rounded-2xl">
              <CardContent className="p-8 text-center">
                <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No announcements yet</p>
                <Button 
                  className="mt-4 rounded-xl"
                  onClick={() => setDialogOpen(true)}
                >
                  Create First Announcement
                </Button>
              </CardContent>
            </Card>
          ) : (
            announcements.map((announcement) => (
              <Card 
                key={announcement.id} 
                className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Megaphone className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-base">{announcement.title}</h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {format(new Date(announcement.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {announcement.message}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-block text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                          {announcement.target === "school"
                            ? "Whole School"
                            : announcement.target === "class"
                            ? `Class: ${announcement.target_details}`
                            : `Role: ${announcement.target_details}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </PrincipalNav>
  );
};

export default Announcements;