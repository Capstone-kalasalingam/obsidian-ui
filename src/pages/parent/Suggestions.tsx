import ParentNav from "@/components/parent/ParentNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockChildren, mockSuggestions } from "@/data/parentMockData";
import { MessageSquare, Calendar, User } from "lucide-react";

const ParentSuggestions = () => {
  const currentChild = mockChildren[0];

  return (
    <div className="min-h-screen flex bg-background font-open-sans">
      <ParentNav />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
              <MessageSquare className="h-8 w-8" />
              Teacher Suggestions
            </h1>
            <p className="text-muted-foreground mt-1">
              Feedback and improvement suggestions for {currentChild.name}
            </p>
          </div>

          <Card className="shadow-md bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">About This Section</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is a read-only section where you can view suggestions and feedback from teachers 
                about your child's academic progress and areas for improvement. These insights help you 
                support your child's learning journey at home.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {mockSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {suggestion.teacherName}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-4">
                        <Badge variant="secondary">{suggestion.subject}</Badge>
                        <span className="flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3" />
                          {suggestion.date}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                    <p className="text-foreground leading-relaxed">
                      {suggestion.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {mockSuggestions.length === 0 && (
            <Card className="shadow-md">
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No suggestions available yet
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Teachers will share feedback and suggestions here
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ParentSuggestions;
