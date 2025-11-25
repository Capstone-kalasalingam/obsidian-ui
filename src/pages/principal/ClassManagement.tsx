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
  const [classes, setClasses] = useState<Class[]>(mockClasses);

  const handleAssignTeacher = (classId: string, teacherId: string) => {
    const teacher = mockTeachers.find((t) => t.id === teacherId);
    setClasses(
      classes.map((cls) =>
        cls.id === classId
          ? { ...cls, teacherId, teacherName: teacher?.name || "Not Assigned" }
          : cls
      )
    );
    toast.success("Class teacher assigned successfully!");
  };

  return (
    <PrincipalNav>
      <div className="px-4 py-6 space-y-3">
        {/* Class Cards */}
        {classes.map((cls, index) => (
          <Card 
            key={cls.id} 
            className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
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
                    {cls.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {cls.students} Students
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Floating Assign Button */}
        <Button
          size="lg"
          onClick={() => navigate("/principal/assign-class-teacher")}
          className="fixed bottom-6 right-6 rounded-full w-auto h-12 px-6 shadow-lg z-50"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Assign Teacher
        </Button>
      </div>
    </PrincipalNav>
  );
};

export default ClassManagement;
