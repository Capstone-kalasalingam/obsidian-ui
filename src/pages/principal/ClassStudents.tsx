import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus, Users, User, Calendar, Star, AlertCircle } from "lucide-react";
import { mockClasses, Class } from "@/data/mockData";

const ClassStudents = () => {
  const navigate = useNavigate();
  const { className } = useParams<{ className: string }>();
  
  // Filter sections for this class
  const classSections = mockClasses.filter(
    (cls) => cls.name.toLowerCase().replace(/\s+/g, '-') === className
  );

  if (classSections.length === 0) {
    return (
      <PrincipalNav>
        <div className="px-4 py-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/principal/classes")}
            className="rounded-full mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <p className="text-muted-foreground">Class not found</p>
        </div>
      </PrincipalNav>
    );
  }

  const displayClassName = classSections[0].name;

  return (
    <PrincipalNav>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/principal/classes")}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">{displayClassName}</h1>
          </div>
        </div>

        {/* Sections List */}
        <div className="px-4 py-6 space-y-3 pb-24">
          {classSections.map((section, index) => (
            <Card 
              key={section.id} 
              className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Number Badge */}
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 border-r border-border">
                    <span className="text-2xl font-bold text-foreground">{index + 1}</span>
                  </div>
                  
                  {/* Section Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1">
                      {section.name} - Section {section.section}
                    </h3>
                    
                    {/* Basic Info */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{section.students} Students</span>
                      </div>
                      {section.teacherName && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span className="truncate">{section.teacherName}</span>
                        </div>
                      )}
                    </div>

                    {/* Performance Stats */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Attendance</p>
                          <p className="text-sm font-bold text-foreground">{section.attendancePercentage}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Top</p>
                          <p className="text-sm font-bold text-foreground">{section.topPerformers}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Weak</p>
                          <p className="text-sm font-bold text-foreground">{section.weakPerformers}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Floating Assign Button */}
        <Button
          size="lg"
          onClick={() => navigate("/principal/assign-class-teacher")}
          className="fixed bottom-20 md:bottom-6 right-6 rounded-full w-auto h-12 px-6 shadow-lg z-50"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Assign Teacher
        </Button>
      </div>
    </PrincipalNav>
  );
};

export default ClassStudents;
