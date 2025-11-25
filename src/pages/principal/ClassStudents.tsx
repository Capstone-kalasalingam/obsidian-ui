import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, User, Calendar, Star, AlertCircle } from "lucide-react";
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
...
        </div>
      </div>
    </PrincipalNav>
  );
};

export default ClassStudents;
