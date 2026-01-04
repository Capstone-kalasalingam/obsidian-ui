import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ChevronRight, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useClasses, useTeachers } from "@/hooks/usePrincipalData";
import { supabase } from "@/integrations/supabase/client";

const AssignClassTeacher = () => {
  const navigate = useNavigate();
  const { classes, loading: classesLoading, refetch: refetchClasses } = useClasses();
  const { teachers, loading: teachersLoading } = useTeachers();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAssign = async () => {
    if (!selectedClass || !selectedTeacher) {
      toast.error("Please select both class and teacher");
      return;
    }

    setSubmitting(true);
    try {
      // First, remove existing class teacher assignment for this class
      await supabase
        .from("teacher_assignments")
        .update({ is_class_teacher: false })
        .eq("class_id", selectedClass)
        .eq("is_class_teacher", true);

      // Check if teacher already has an assignment for this class
      const { data: existingAssignment } = await supabase
        .from("teacher_assignments")
        .select("id")
        .eq("class_id", selectedClass)
        .eq("teacher_id", selectedTeacher)
        .single();

      if (existingAssignment) {
        // Update existing assignment
        await supabase
          .from("teacher_assignments")
          .update({ is_class_teacher: true })
          .eq("id", existingAssignment.id);
      } else {
        // Get first subject to assign (required field)
        const { data: subjects } = await supabase
          .from("subjects")
          .select("id")
          .limit(1);

        if (subjects && subjects.length > 0) {
          await supabase
            .from("teacher_assignments")
            .insert({
              class_id: selectedClass,
              teacher_id: selectedTeacher,
              subject_id: subjects[0].id,
              is_class_teacher: true,
            });
        }
      }

      const teacher = teachers.find(t => t.id === selectedTeacher);
      const classInfo = classes.find(c => c.id === selectedClass);
      
      toast.success(`${teacher?.profile?.full_name} assigned to ${classInfo?.name} - ${classInfo?.section}`);
      refetchClasses();
      navigate("/principal/classes");
    } catch (error) {
      toast.error("Failed to assign class teacher");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTeacherData = teachers.find(t => t.id === selectedTeacher);

  const loading = classesLoading || teachersLoading;

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
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          ) : (
            <>
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
                    {classes.map((cls) => (
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
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {selectedTeacherData.profile?.avatar_url ? (
                            <img 
                              src={selectedTeacherData.profile.avatar_url} 
                              alt="" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <span className="text-base font-medium">
                          {selectedTeacherData.profile?.full_name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Select Teacher</span>
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50">
                    {teachers.map((teacher) => (
                      <SelectItem 
                        key={teacher.id} 
                        value={teacher.id}
                        className="py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {teacher.profile?.avatar_url ? (
                              <img 
                                src={teacher.profile.avatar_url} 
                                alt="" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{teacher.profile?.full_name || "Unknown"}</p>
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
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                        {selectedTeacherData.profile?.avatar_url ? (
                          <img 
                            src={selectedTeacherData.profile.avatar_url} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-base">{selectedTeacherData.profile?.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedTeacherData.profile?.email}
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
                disabled={!selectedClass || !selectedTeacher || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  "Assign"
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </PrincipalNav>
  );
};

export default AssignClassTeacher;