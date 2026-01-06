import { useState, useEffect } from "react";
import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  BellRing, 
  Check, 
  CheckCheck, 
  Megaphone,
  Calendar,
  Users,
  BookOpen,
  AlertTriangle,
  MessageSquare,
  Clock,
  Trash2,
  MoreVertical
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "announcement" | "attendance" | "student" | "homework" | "alert" | "message";
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Mock notifications (will be replaced with real data)
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Announcement from Principal",
    message: "Parent-Teacher Meeting scheduled for next Saturday. Please prepare student progress reports.",
    type: "announcement",
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "2",
    title: "Low Attendance Alert",
    message: "Class 8-A has below 80% attendance today. 6 students are absent.",
    type: "alert",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "Homework Submissions",
    message: "15 students have submitted the Mathematics assignment. 10 pending.",
    type: "homework",
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "New Parent Message",
    message: "Mrs. Sharma has sent a message regarding her child's absence.",
    type: "message",
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "5",
    title: "Academic Calendar Update",
    message: "Mid-term examinations have been rescheduled to 15th February.",
    type: "announcement",
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    title: "Student Progress Alert",
    message: "Rahul Kumar's performance has dropped in recent tests. Attention needed.",
    type: "student",
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "announcement": return <Megaphone className="w-5 h-5" />;
      case "attendance": return <Calendar className="w-5 h-5" />;
      case "student": return <Users className="w-5 h-5" />;
      case "homework": return <BookOpen className="w-5 h-5" />;
      case "alert": return <AlertTriangle className="w-5 h-5" />;
      case "message": return <MessageSquare className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "announcement": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "attendance": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "student": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "homework": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "alert": return "bg-red-500/10 text-red-600 border-red-500/20";
      case "message": return "bg-cyan-500/10 text-cyan-600 border-cyan-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case "announcement": return "bg-blue-500/10";
      case "attendance": return "bg-purple-500/10";
      case "student": return "bg-emerald-500/10";
      case "homework": return "bg-amber-500/10";
      case "alert": return "bg-red-500/10";
      case "message": return "bg-cyan-500/10";
      default: return "bg-muted";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    toast.success("Marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification deleted");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.isRead;
    return n.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const stats = {
    total: notifications.length,
    unread: unreadCount,
    announcements: notifications.filter(n => n.type === "announcement").length,
    alerts: notifications.filter(n => n.type === "alert").length,
  };

  return (
    <TeacherNav>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="p-4 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 relative">
                  <BellRing className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                Notifications
              </h1>
              <p className="text-muted-foreground mt-1">Stay updated with school activities and alerts</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="w-4 h-4" />
                Mark All Read
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 text-destructive hover:text-destructive"
                onClick={clearAll}
                disabled={notifications.length === 0}
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-none shadow-lg bg-gradient-to-br from-card to-card/80">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10">
                    <BellRing className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{stats.unread}</p>
                    <p className="text-xs text-amber-600/70">Unread</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10">
                    <Megaphone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.announcements}</p>
                    <p className="text-xs text-blue-600/70">Announcements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-500/10">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.alerts}</p>
                    <p className="text-xs text-red-600/70">Alerts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs & Notifications List */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-card border flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="all" className="gap-1.5">
                All
                <Badge variant="secondary" className="text-xs px-1.5">{notifications.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" className="gap-1.5">
                Unread
                {unreadCount > 0 && (
                  <Badge className="text-xs px-1.5 bg-amber-500">{unreadCount}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="announcement">Announcements</TabsTrigger>
              <TabsTrigger value="alert">Alerts</TabsTrigger>
              <TabsTrigger value="message">Messages</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-4">
              <Card className="border-none shadow-lg">
                <ScrollArea className="h-[calc(100vh-450px)] min-h-[400px]">
                  <div className="divide-y divide-border">
                    {filteredNotifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 mx-auto text-muted-foreground/40" />
                        <h3 className="mt-4 font-semibold text-lg">No Notifications</h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          You're all caught up!
                        </p>
                      </div>
                    ) : (
                      filteredNotifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={cn(
                            "p-4 lg:p-5 hover:bg-muted/50 transition-colors cursor-pointer group",
                            !notification.isRead && "bg-primary/5"
                          )}
                        >
                          <div className="flex gap-4">
                            {/* Icon */}
                            <div className={cn(
                              "p-2.5 rounded-xl shrink-0 h-fit",
                              getIconBgColor(notification.type)
                            )}>
                              {getTypeIcon(notification.type)}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className={cn(
                                      "font-medium",
                                      !notification.isRead && "font-semibold"
                                    )}>
                                      {notification.title}
                                    </h3>
                                    {!notification.isRead && (
                                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <Badge variant="outline" className={cn("text-xs", getTypeColor(notification.type))}>
                                      {notification.type}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Actions */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {!notification.isRead && (
                                      <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                        <Check className="w-4 h-4 mr-2" />
                                        Mark as read
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem 
                                      onClick={() => deleteNotification(notification.id)}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TeacherNav>
  );
}
