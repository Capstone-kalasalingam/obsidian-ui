import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ParentNav from "@/components/parent/ParentNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockChildren } from "@/data/parentMockData";
import { User, ArrowRight } from "lucide-react";

const ChildSelection = () => {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  const handleSelectChild = (childId: string) => {
    setSelectedChild(childId);
    // In a real app, this would update the global state
    setTimeout(() => {
      navigate("/parent/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen flex bg-background font-open-sans">
      <ParentNav />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
          <div className="text-center mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Select Child
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Choose which child's information you want to view
            </p>
          </div>

          <Card className="shadow-md border-0 bg-muted/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Demo Mode:</strong> Selecting a child will update the dashboard with their mock data
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {mockChildren.map((child) => (
              <Card
                key={child.id}
                className={`shadow-md border-0 hover:shadow-lg transition-all cursor-pointer ${
                  selectedChild === child.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleSelectChild(child.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base md:text-lg truncate">{child.name}</CardTitle>
                        <CardDescription className="mt-1 text-xs md:text-sm">
                          Roll No: {child.rollNumber}
                        </CardDescription>
                      </div>
                    </div>
                    {selectedChild === child.id && (
                      <Badge variant="default" className="flex-shrink-0 text-xs">Selected</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Class</p>
                      <p className="font-semibold text-base">{child.class}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Section</p>
                      <p className="font-semibold text-base">{child.section}</p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full group"
                    variant={selectedChild === child.id ? "default" : "outline"}
                  >
                    View Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChildSelection;
