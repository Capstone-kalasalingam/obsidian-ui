import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockClasses, mockTeachers, Class } from "@/data/mockData";
import { BookOpen, Users, UserPlus } from "lucide-react";
import { toast } from "sonner";

const ClassManagement = () => {
  const navigate = useNavigate();
  
  // Group classes by name
  const groupedClasses = mockClasses.reduce((acc, cls) => {
    if (!acc[cls.name]) {
      acc[cls.name] = {
        name: cls.name,
        totalStudents: 0,
        sections: []
      };
    }
    acc[cls.name].totalStudents += cls.students;
    acc[cls.name].sections.push(cls);
    return acc;
  }, {} as Record<string, { name: string; totalStudents: number; sections: Class[] }>);

  const uniqueClasses = Object.values(groupedClasses);

  const handleClassClick = (className: string) => {
    const urlClassName = className.toLowerCase().replace(/\s+/g, '-');
    navigate(`/principal/classes/${urlClassName}`);
  };

  return (
    <PrincipalNav>
      <div className="px-4 py-6 space-y-3">
        {/* Class Cards */}
        {uniqueClasses.map((classGroup, index) => (
          <Card 
            key={classGroup.name} 
            onClick={() => handleClassClick(classGroup.name)}
            className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Number Badge */}
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 border-r border-border">
                  <span className="text-2xl font-bold text-foreground">{index + 1}</span>
                </div>
                
                {/* Class Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-0.5">
                    {classGroup.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {classGroup.totalStudents} Students
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PrincipalNav>
  );
};

export default ClassManagement;
