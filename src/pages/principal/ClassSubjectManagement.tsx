import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, BookOpen, GraduationCap, Loader2 } from "lucide-react";
import { z } from "zod";

// Validation schemas
const classSchema = z.object({
  name: z.string().trim().min(1, "Class name is required").max(50, "Class name too long"),
  section: z.string().trim().min(1, "Section is required").max(10, "Section too long"),
});

const subjectSchema = z.object({
  name: z.string().trim().min(1, "Subject name is required").max(100, "Subject name too long"),
  code: z.string().trim().min(1, "Subject code is required").max(20, "Subject code too long").toUpperCase(),
});

type ClassFormData = z.infer<typeof classSchema>;
type SubjectFormData = z.infer<typeof subjectSchema>;

interface ClassRow {
  id: string;
  name: string;
  section: string;
  created_at: string;
}

interface SubjectRow {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

const ClassSubjectManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("classes");
  
  // Class state
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRow | null>(null);
  const [classForm, setClassForm] = useState<ClassFormData>({ name: "", section: "" });
  const [classErrors, setClassErrors] = useState<Partial<ClassFormData>>({});
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);
  
  // Subject state
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectRow | null>(null);
  const [subjectForm, setSubjectForm] = useState<SubjectFormData>({ name: "", code: "" });
  const [subjectErrors, setSubjectErrors] = useState<Partial<SubjectFormData>>({});
  const [deleteSubjectId, setDeleteSubjectId] = useState<string | null>(null);

  // Fetch classes
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("name", { ascending: true })
        .order("section", { ascending: true });
      if (error) throw error;
      return data as ClassRow[];
    },
  });

  // Fetch subjects
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return data as SubjectRow[];
    },
  });

  // Class mutations
  const createClassMutation = useMutation({
    mutationFn: async (data: { name: string; section: string }) => {
      const { error } = await supabase.from("classes").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Class created successfully");
      resetClassForm();
    },
    onError: (error: Error) => {
      if (error.message.includes("duplicate")) {
        toast.error("This class and section already exists");
      } else {
        toast.error("Failed to create class");
      }
    },
  });

  const updateClassMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; section: string } }) => {
      const { error } = await supabase.from("classes").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Class updated successfully");
      resetClassForm();
    },
    onError: (error: Error) => {
      if (error.message.includes("duplicate")) {
        toast.error("This class and section already exists");
      } else {
        toast.error("Failed to update class");
      }
    },
  });

  const deleteClassMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("classes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Class deleted successfully");
      setDeleteClassId(null);
    },
    onError: (error: Error) => {
      if (error.message.includes("violates foreign key")) {
        toast.error("Cannot delete class with assigned students or teachers");
      } else {
        toast.error("Failed to delete class");
      }
    },
  });

  // Subject mutations
  const createSubjectMutation = useMutation({
    mutationFn: async (data: { name: string; code: string }) => {
      const { error } = await supabase.from("subjects").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.success("Subject created successfully");
      resetSubjectForm();
    },
    onError: (error: Error) => {
      if (error.message.includes("duplicate")) {
        toast.error("Subject with this code already exists");
      } else {
        toast.error("Failed to create subject");
      }
    },
  });

  const updateSubjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; code: string } }) => {
      const { error } = await supabase.from("subjects").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.success("Subject updated successfully");
      resetSubjectForm();
    },
    onError: (error: Error) => {
      if (error.message.includes("duplicate")) {
        toast.error("Subject with this code already exists");
      } else {
        toast.error("Failed to update subject");
      }
    },
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("subjects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.success("Subject deleted successfully");
      setDeleteSubjectId(null);
    },
    onError: (error: Error) => {
      if (error.message.includes("violates foreign key")) {
        toast.error("Cannot delete subject with existing assignments");
      } else {
        toast.error("Failed to delete subject");
      }
    },
  });

  // Form handlers
  const resetClassForm = () => {
    setClassDialogOpen(false);
    setEditingClass(null);
    setClassForm({ name: "", section: "" });
    setClassErrors({});
  };

  const resetSubjectForm = () => {
    setSubjectDialogOpen(false);
    setEditingSubject(null);
    setSubjectForm({ name: "", code: "" });
    setSubjectErrors({});
  };

  const handleClassSubmit = () => {
    const result = classSchema.safeParse(classForm);
    if (!result.success) {
      const errors: Partial<ClassFormData> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as keyof ClassFormData] = err.message;
        }
      });
      setClassErrors(errors);
      return;
    }

    const validData = { name: result.data.name, section: result.data.section };
    if (editingClass) {
      updateClassMutation.mutate({ id: editingClass.id, data: validData });
    } else {
      createClassMutation.mutate(validData);
    }
  };

  const handleSubjectSubmit = () => {
    const result = subjectSchema.safeParse(subjectForm);
    if (!result.success) {
      const errors: Partial<SubjectFormData> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as keyof SubjectFormData] = err.message;
        }
      });
      setSubjectErrors(errors);
      return;
    }

    const validData = { name: result.data.name, code: result.data.code };
    if (editingSubject) {
      updateSubjectMutation.mutate({ id: editingSubject.id, data: validData });
    } else {
      createSubjectMutation.mutate(validData);
    }
  };

  const openEditClass = (cls: ClassRow) => {
    setEditingClass(cls);
    setClassForm({ name: cls.name, section: cls.section });
    setClassDialogOpen(true);
  };

  const openEditSubject = (subject: SubjectRow) => {
    setEditingSubject(subject);
    setSubjectForm({ name: subject.name, code: subject.code });
    setSubjectDialogOpen(true);
  };

  const isClassMutating = createClassMutation.isPending || updateClassMutation.isPending;
  const isSubjectMutating = createSubjectMutation.isPending || updateSubjectMutation.isPending;

  return (
    <PrincipalNav>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
          <h1 className="text-xl font-bold">Classes & Subjects</h1>
        </div>

        <div className="px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="classes" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Classes
              </TabsTrigger>
              <TabsTrigger value="subjects" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Subjects
              </TabsTrigger>
            </TabsList>

            {/* Classes Tab */}
            <TabsContent value="classes" className="space-y-4">
              <div className="flex justify-end">
                <Dialog open={classDialogOpen} onOpenChange={(open) => {
                  if (!open) resetClassForm();
                  else setClassDialogOpen(true);
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Class
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingClass ? "Edit Class" : "Add New Class"}</DialogTitle>
                      <DialogDescription>
                        {editingClass ? "Update class details" : "Create a new class with section"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="className">Class Name</Label>
                        <Input
                          id="className"
                          placeholder="e.g., Class 1, Class 2"
                          value={classForm.name}
                          onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                          maxLength={50}
                        />
                        {classErrors.name && (
                          <p className="text-sm text-destructive">{classErrors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="section">Section</Label>
                        <Input
                          id="section"
                          placeholder="e.g., A, B, C"
                          value={classForm.section}
                          onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                          maxLength={10}
                        />
                        {classErrors.section && (
                          <p className="text-sm text-destructive">{classErrors.section}</p>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={resetClassForm}>Cancel</Button>
                      <Button onClick={handleClassSubmit} disabled={isClassMutating}>
                        {isClassMutating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {editingClass ? "Update" : "Create"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {classesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : classes.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No classes found. Add your first class to get started.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {classes.map((cls) => (
                    <Card 
                      key={cls.id} 
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/principal/class/${cls.id}`)}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{cls.name}</h3>
                            <Badge variant="secondary">Section {cls.section}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditClass(cls);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteClassId(cls.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Subjects Tab */}
            <TabsContent value="subjects" className="space-y-4">
              <div className="flex justify-end">
                <Dialog open={subjectDialogOpen} onOpenChange={(open) => {
                  if (!open) resetSubjectForm();
                  else setSubjectDialogOpen(true);
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Subject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingSubject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
                      <DialogDescription>
                        {editingSubject ? "Update subject details" : "Create a new subject"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="subjectName">Subject Name</Label>
                        <Input
                          id="subjectName"
                          placeholder="e.g., Mathematics, Science"
                          value={subjectForm.name}
                          onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                          maxLength={100}
                        />
                        {subjectErrors.name && (
                          <p className="text-sm text-destructive">{subjectErrors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subjectCode">Subject Code</Label>
                        <Input
                          id="subjectCode"
                          placeholder="e.g., MATH, SCI"
                          value={subjectForm.code}
                          onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
                          maxLength={20}
                        />
                        {subjectErrors.code && (
                          <p className="text-sm text-destructive">{subjectErrors.code}</p>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={resetSubjectForm}>Cancel</Button>
                      <Button onClick={handleSubjectSubmit} disabled={isSubjectMutating}>
                        {isSubjectMutating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {editingSubject ? "Update" : "Create"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {subjectsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : subjects.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No subjects found. Add your first subject to get started.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {subjects.map((subject) => (
                    <Card key={subject.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{subject.name}</h3>
                            <Badge variant="outline">{subject.code}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditSubject(subject)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteSubjectId(subject.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Delete Class Confirmation */}
        <AlertDialog open={!!deleteClassId} onOpenChange={() => setDeleteClassId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Class?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Classes with assigned students or teachers cannot be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteClassId && deleteClassMutation.mutate(deleteClassId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteClassMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Subject Confirmation */}
        <AlertDialog open={!!deleteSubjectId} onOpenChange={() => setDeleteSubjectId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Subject?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Subjects with existing assignments cannot be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteSubjectId && deleteSubjectMutation.mutate(deleteSubjectId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteSubjectMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PrincipalNav>
  );
};

export default ClassSubjectManagement;
