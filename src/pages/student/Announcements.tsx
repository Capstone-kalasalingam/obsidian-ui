import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, User, Calendar } from "lucide-react";
import { announcements } from "@/data/studentMockData";

const Announcements = () => {
  return (
    <StudentNav>
      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-4">{announcements.map((announcement, index) => (
          <Card 
            key={announcement.id} 
            className="shadow-md border hover:shadow-lg transition-shadow animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <Badge variant="outline" className="gap-1">
                      <User className="h-3 w-3" />
                      {announcement.source}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(announcement.date).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{announcement.message}</p>
            </CardContent>
          </Card>
        ))}

        {/* Demo Note */}
        <Card className="shadow-md border bg-blue-50 dark:bg-blue-950">
          <CardContent className="p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Demo Mode:</strong> This is a read-only view. No interaction or reply functionality available.
            </p>
          </CardContent>
        </Card>
      </div>
    </StudentNav>
  );
};

export default Announcements;
