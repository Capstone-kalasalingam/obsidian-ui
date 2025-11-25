import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ChevronRight, User } from "lucide-react";
import { toast } from "sonner";
import { mockClasses, mockTeachers } from "@/data/mockData";

const AssignClassTeacher = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const handleAssign = () => {
    if (!selectedClass || !selectedTeacher) {
      toast.error("Please select both class and teacher");
      return;
    }

    const teacher = mockTeachers.find(t => t.id === selectedTeacher);
    const classInfo = mockClasses.find(c => c.id === selectedClass);
    
    toast.success(`${teacher?.name} assigned to ${classInfo?.name} - ${classInfo?.section}`);
    navigate("/principal/classes");
  };

  const selectedTeacherData = mockTeachers.find(t => t.id === selectedTeacher);

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
            <h1 className="text-xl font-bold">Assign Class Teacher</h1>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 max-w-2xl mx-auto space-y-8">
          {/* Class Selection */}
          <div className="space-y-3">
            <Label htmlFor="class" className="text-lg font-bold">
              Class
            </Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger 
                id="class" 
                className="h-14 text-base rounded-2xl bg-background border-border"
              >
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                {mockClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} - {cls.section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Teacher Selection */}
          <div className="space-y-3">
            <Label htmlFor="teacher" className="text-lg font-bold">
              Teacher
            </Label>
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger 
                id="teacher" 
                className="h-16 text-base rounded-2xl bg-background border-border"
              >
                {selectedTeacherData ? (
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-base font-medium">
                      {selectedTeacherData.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Select Teacher</span>
                )}
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                {mockTeachers
                  .filter(t => t.status === "active")
                  .map((teacher) => (
                    <SelectItem 
                      key={teacher.id} 
                      value={teacher.id}
                      className="py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {teacher.subjects.join(", ")}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* Show selected teacher card */}
            {selectedTeacherData && (
              <div 
                className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl cursor-pointer hover:shadow-md transition-all"
                onClick={() => navigate(`/principal/teacher/${selectedTeacherData.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-base">{selectedTeacherData.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedTeacherData.subjects.join(", ")}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Assign Button */}
          <Button
            onClick={handleAssign}
            className="w-full h-14 text-base rounded-2xl mt-8"
            size="lg"
            disabled={!selectedClass || !selectedTeacher}
          >
            Assign
          </Button>
        </div>
      </div>
    </PrincipalNav>
  );
};

export default AssignClassTeacher;
