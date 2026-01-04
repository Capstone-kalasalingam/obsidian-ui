import { useState, useEffect } from "react";
import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, Search, Users, Edit2, Trash2, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

interface Student {
  id: string;
  userId: string;
  name: string;
  studentId: string;
  rollNumber: string;
  className: string;
  section: string;
  status: string;
  parentName?: string;
}

interface Parent {
  id: string;
  userId: string;
  name: string;
  parentId: string;
}

interface ClassInfo {
  id: string;
  name: string;
  section: string;
}

export default function TeacherStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [assignedClasses, setAssignedClasses] = useState<ClassInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    password: "",
    rollNumber: "",
    villageAddress: "",
    residenceType: "",
    parentPhone: "",
    classId: "",
    parentId: "",
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    setIsLoading(true);

    // Get teacher's assigned classes
    const { data: teacher } = await supabase
      .from("teachers")
      .select(`
        id,
        teacher_assignments (
          class_id,
          classes (id, name, section)
        )
      `)
      .eq("user_id", user.id)
      .single();

    if (teacher?.teacher_assignments) {
      const classes = teacher.teacher_assignments
        .map((a: any) => a.classes)
        .filter((c: any, i: number, arr: any[]) => 
          arr.findIndex((x: any) => x.id === c.id) === i
        );
      setAssignedClasses(classes);

      // Fetch students from assigned classes
      const classIds = classes.map((c: ClassInfo) => c.id);
      if (classIds.length > 0) {
        const { data: studentsData } = await supabase
          .from("students")
          .select(`
            id,
            user_id,
            roll_number,
            status,
            class_id,
            classes (name, section),
            profiles!students_user_id_fkey (full_name, email)
          `)
          .in("class_id", classIds);

        if (studentsData) {
          const formattedStudents = studentsData.map((s: any) => ({
            id: s.id,
            userId: s.user_id,
            name: s.profiles?.full_name || "Unknown",
            studentId: s.profiles?.email?.split("@")[0]?.toUpperCase() || "",
            rollNumber: s.roll_number || "",
            className: s.classes?.name || "",
            section: s.classes?.section || "",
            status: s.status || "active",
          }));
          setStudents(formattedStudents);
        }
      }
    }

    // Fetch available parents
    const { data: parentsData } = await supabase
      .from("parents")
      .select(`
        id,
        user_id,
        profiles!parents_user_id_fkey (full_name, email)
      `);

    if (parentsData) {
      const formattedParents = parentsData.map((p: any) => ({
        id: p.id,
        userId: p.user_id,
        name: p.profiles?.full_name || "Unknown",
        parentId: p.profiles?.email?.split("@")[0]?.toUpperCase() || "",
      }));
      setParents(formattedParents);
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      fullName: "",
      password: "",
      rollNumber: "",
      villageAddress: "",
      residenceType: "",
      parentPhone: "",
      classId: "",
      parentId: "",
    });
  };

  const handleCreateStudent = async () => {
    if (!formData.studentId || !formData.fullName || !formData.password || !formData.classId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("create-user", {
        body: {
          studentId: formData.studentId,
          password: formData.password,
          fullName: formData.fullName,
          role: "student",
          classId: formData.classId,
          rollNumber: formData.rollNumber,
          parentIds: formData.parentId ? [formData.parentId] : [],
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast.success("Student created successfully!");
      setIsAddDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error("Error creating student:", error);
      toast.error(error.message || "Failed to create student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TeacherNav>
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Student Management</h1>
            <p className="text-muted-foreground">Add and manage students in your classes</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 card-neu">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{students.length}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 card-neu">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{assignedClasses.length}</p>
                  <p className="text-sm text-muted-foreground">Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-0 card-neu mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, student ID, or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="border-0 card-neu">
          <CardHeader>
            <CardTitle>Students List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No students found matching your search" : "No students added yet"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-mono">{student.studentId}</TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.rollNumber || "-"}</TableCell>
                        <TableCell>{student.className}-{student.section}</TableCell>
                        <TableCell>
                          <Badge variant={student.status === "active" ? "default" : "secondary"}>
                            {student.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Student Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Create a new student account and assign to a class
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID *</Label>
                <Input
                  id="studentId"
                  placeholder="e.g., STU001"
                  value={formData.studentId}
                  onChange={(e) => handleInputChange("studentId", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter student's full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  placeholder="e.g., 101"
                  value={formData.rollNumber}
                  onChange={(e) => handleInputChange("rollNumber", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="villageAddress">Village/Address</Label>
                <Input
                  id="villageAddress"
                  placeholder="Enter village or address"
                  value={formData.villageAddress}
                  onChange={(e) => handleInputChange("villageAddress", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="residenceType">Residence Type *</Label>
                <Select
                  value={formData.residenceType}
                  onValueChange={(value) => handleInputChange("residenceType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day_scholar">Day Scholar</SelectItem>
                    <SelectItem value="hostler">Hostler</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentPhone">Parent Phone Number</Label>
                <Input
                  id="parentPhone"
                  type="tel"
                  placeholder="e.g., 9876543210"
                  value={formData.parentPhone}
                  onChange={(e) => handleInputChange("parentPhone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="classId">Class *</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) => handleInputChange("classId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignedClasses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} - {c.section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentId">Link Parent (Optional)</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) => handleInputChange("parentId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent" />
                  </SelectTrigger>
                  <SelectContent>
                    {parents.map((p) => (
                      <SelectItem key={p.userId} value={p.userId}>
                        {p.name} ({p.parentId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateStudent} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Student"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TeacherNav>
  );
}
