import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, FileText, Calendar, User } from "lucide-react";

interface Activity {
  id: string;
  type: "student" | "homework" | "event" | "teacher";
  title: string;
  subtitle: string;
  time: string;
  avatar?: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "student",
    title: "Arjun Sharma",
    subtitle: "Completed daily learning tasks",
    time: "2 min ago",
  },
  {
    id: "2",
    type: "homework",
    title: "Grade 8 Math",
    subtitle: "15 submissions received",
    time: "10 min ago",
  },
  {
    id: "3",
    type: "event",
    title: "Parent Meeting",
    subtitle: "Scheduled for tomorrow",
    time: "1 hour ago",
  },
  {
    id: "4",
    type: "teacher",
    title: "Ms. Priya Kumar",
    subtitle: "Updated class progress report",
    time: "2 hours ago",
  },
];

const getIcon = (type: Activity["type"]) => {
  switch (type) {
    case "student":
      return <User className="w-4 h-4" />;
    case "homework":
      return <FileText className="w-4 h-4" />;
    case "event":
      return <Calendar className="w-4 h-4" />;
    case "teacher":
      return <User className="w-4 h-4" />;
  }
};

const getGradient = (type: Activity["type"]) => {
  switch (type) {
    case "student":
      return "bg-gradient-to-br from-kalvion-blue to-kalvion-purple";
    case "homework":
      return "bg-gradient-green";
    case "event":
      return "bg-gradient-amber";
    case "teacher":
      return "bg-gradient-cool";
  }
};

const RecentActivityCard = () => {
  return (
    <Card className="bg-card border-0 rounded-2xl shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className={`${getGradient(activity.type)} text-white`}>
                {getIcon(activity.type)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {activity.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {activity.subtitle}
              </p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
