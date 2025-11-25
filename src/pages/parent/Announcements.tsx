import { useState } from "react";
import ParentNav from "@/components/parent/ParentNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockAnnouncements } from "@/data/parentMockData";
import { Megaphone, ChevronDown, ChevronUp, Calendar } from "lucide-react";

const ParentAnnouncements = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen flex bg-background font-open-sans">
      <ParentNav />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2 md:gap-3">
              <Megaphone className="h-6 w-6 md:h-7 md:w-7" />
              Announcements
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Stay updated with school and class notifications
            </p>
          </div>

          <Card className="shadow-md border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">All Announcements</CardTitle>
              <CardDescription className="text-sm">
                View-only mode - Latest updates from school and teachers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="shadow-sm border-0 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {announcement.date}
                          </div>
                          <span>•</span>
                          <span>Posted by {announcement.postedBy}</span>
                        </div>
                      </div>
                      <Badge
                        variant={announcement.type === "School" ? "default" : "secondary"}
                        className="ml-2"
                      >
                        {announcement.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {expandedId === announcement.id
                        ? announcement.message
                        : `${announcement.message.slice(0, 150)}...`}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(announcement.id)}
                      className="mt-3 gap-2"
                    >
                      {expandedId === announcement.id ? (
                        <>
                          Show Less <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Read More <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ParentAnnouncements;
