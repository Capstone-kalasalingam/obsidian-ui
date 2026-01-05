import { useState, useEffect, useRef } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Plus, Search, Users, Edit2, Trash2, UserPlus, Upload, Download, FileSpreadsheet } from "lucide-react";
import { AddStudentDialog } from "@/components/teacher/AddStudentDialog";

interface Student {
  id: string;
  userId: string;
  name: string;
  studentId: string;
  rollNumber: string;
  className: string;
  classId: string;
  section: string;
  status: string;
  residenceType: string;
  villageAddress: string;
  parentPhone: string;
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

interface CSVStudent {
  studentId: string;
  fullName: string;
  password: string;
  rollNumber: string;
  villageAddress: string;
  residenceType: string;
  parentPhone: string;
}

export default function TeacherStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [assignedClasses, setAssignedClasses] = useState<ClassInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkImportDialogOpen, setIsBulkImportDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [csvData, setCsvData] = useState<CSVStudent[]>([]);
  const [bulkImportClassId, setBulkImportClassId] = useState("");
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, errors: [] as string[] });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [editFormData, setEditFormData] = useState({
    rollNumber: "",
    villageAddress: "",
    residenceType: "",
    parentPhone: "",
    status: "",
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  // Real-time subscription for students
  useEffect(() => {
    const channel = supabase
      .channel('students-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students'
        },
        () => {
          fetchData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
        const { data: studentsData, error: studentsError } = await supabase
          .from("students")
          .select(`
            id,
            user_id,
            roll_number,
            status,
            residence_type,
            village_address,
            parent_phone,
            class_id,
            classes (name, section)
          `)
          .in("class_id", classIds);

        if (studentsError) {
          console.error("Error fetching students:", studentsError);
        }

        if (studentsData && studentsData.length > 0) {
          // Fetch profiles separately - now with RLS policy allowing teachers to see student profiles
          const userIds = studentsData.map((s: any) => s.user_id);
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, full_name, email")
            .in("id", userIds);

          if (profilesError) {
            console.error("Error fetching profiles:", profilesError);
          }

          const profilesMap = new Map(
            (profilesData || []).map((p: any) => [p.id, p])
          );

          const formattedStudents = studentsData.map((s: any) => {
            const profile = profilesMap.get(s.user_id);
            return {
              id: s.id,
              userId: s.user_id,
              name: profile?.full_name || "Unknown",
              studentId: profile?.email?.split("@")[0]?.toUpperCase() || "",
              rollNumber: s.roll_number || "",
              className: s.classes?.name || "",
              classId: s.class_id,
              section: s.classes?.section || "",
              status: s.status || "active",
              residenceType: s.residence_type || "day_scholar",
              villageAddress: s.village_address || "",
              parentPhone: s.parent_phone || "",
            };
          });
          setStudents(formattedStudents);
        } else {
          setStudents([]);
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

  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
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

    // Validate roll number is numeric
    if (formData.rollNumber && !/^\d+$/.test(formData.rollNumber)) {
      toast.error("Roll number must be a number");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await supabase.functions.invoke("create-user", {
        body: {
          studentId: formData.studentId,
          password: formData.password,
          fullName: formData.fullName,
          role: "student",
          classId: formData.classId,
          rollNumber: formData.rollNumber,
          villageAddress: formData.villageAddress,
          residenceType: formData.residenceType || "day_scholar",
          parentPhone: formData.parentPhone,
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
      if (error.message?.includes("students_class_roll_unique")) {
        toast.error("Roll number already exists in this class");
      } else {
        toast.error(error.message || "Failed to create student");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditFormData({
      rollNumber: student.rollNumber,
      villageAddress: student.villageAddress,
      residenceType: student.residenceType,
      parentPhone: student.parentPhone,
      status: student.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateStudent = async () => {
    if (!selectedStudent) return;

    // Validate roll number is numeric
    if (editFormData.rollNumber && !/^\d+$/.test(editFormData.rollNumber)) {
      toast.error("Roll number must be a number");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("students")
        .update({
          roll_number: editFormData.rollNumber || null,
          village_address: editFormData.villageAddress || null,
          residence_type: editFormData.residenceType || "day_scholar",
          parent_phone: editFormData.parentPhone || null,
          status: editFormData.status,
        })
        .eq("id", selectedStudent.id);

      if (error) {
        if (error.message?.includes("students_class_roll_unique")) {
          toast.error("Roll number already exists in this class");
        } else {
          throw error;
        }
        return;
      }

      toast.success("Student updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedStudent(null);
      fetchData();
    } catch (error: any) {
      console.error("Error updating student:", error);
      toast.error(error.message || "Failed to update student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;

    setIsSubmitting(true);

    try {
      // Delete the student record (will cascade or handle as needed)
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", selectedStudent.id);

      if (error) throw error;

      toast.success("Student deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedStudent(null);
      fetchData();
    } catch (error: any) {
      console.error("Error deleting student:", error);
      toast.error(error.message || "Failed to delete student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error("CSV file must have a header row and at least one data row");
        return;
      }

      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      const requiredHeaders = ['studentid', 'fullname', 'password'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        toast.error(`Missing required columns: ${missingHeaders.join(', ')}`);
        return;
      }

      const parsedData: CSVStudent[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length < headers.length) continue;

        const row: any = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx] || '';
        });

        parsedData.push({
          studentId: row.studentid || '',
          fullName: row.fullname || '',
          password: row.password || '',
          rollNumber: row.rollnumber || '',
          villageAddress: row.villageaddress || row.address || '',
          residenceType: row.residencetype || 'day_scholar',
          parentPhone: row.parentphone || row.phone || '',
        });
      }

      if (parsedData.length === 0) {
        toast.error("No valid student data found in CSV");
        return;
      }

      setCsvData(parsedData);
      toast.success(`${parsedData.length} students found in CSV`);
    };
    reader.readAsText(file);
  };

  const handleBulkImport = async () => {
    if (!bulkImportClassId) {
      toast.error("Please select a class for bulk import");
      return;
    }

    if (csvData.length === 0) {
      toast.error("No CSV data to import");
      return;
    }

    setIsSubmitting(true);
    setImportProgress({ current: 0, total: csvData.length, errors: [] });

    const errors: string[] = [];
    let successCount = 0;

    for (let i = 0; i < csvData.length; i++) {
      const student = csvData[i];
      setImportProgress(prev => ({ ...prev, current: i + 1 }));

      if (!student.studentId || !student.fullName || !student.password) {
        errors.push(`Row ${i + 1}: Missing required fields (studentId, fullName, or password)`);
        continue;
      }

      try {
        const response = await supabase.functions.invoke("create-user", {
          body: {
            studentId: student.studentId,
            password: student.password,
            fullName: student.fullName,
            role: "student",
            classId: bulkImportClassId,
            rollNumber: student.rollNumber,
            villageAddress: student.villageAddress,
            residenceType: student.residenceType || "day_scholar",
            parentPhone: student.parentPhone,
            parentIds: [],
          },
        });

        if (response.error) {
          errors.push(`Row ${i + 1} (${student.studentId}): ${response.error.message}`);
        } else {
          successCount++;
        }
      } catch (error: any) {
        errors.push(`Row ${i + 1} (${student.studentId}): ${error.message || 'Unknown error'}`);
      }
    }

    setImportProgress(prev => ({ ...prev, errors }));
    setIsSubmitting(false);

    if (successCount > 0) {
      toast.success(`Successfully imported ${successCount} students`);
      fetchData();
    }

    if (errors.length > 0) {
      toast.error(`${errors.length} errors occurred during import`);
    }

    if (successCount === csvData.length) {
      setIsBulkImportDialogOpen(false);
      setCsvData([]);
      setBulkImportClassId("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const downloadCSVTemplate = () => {
    const headers = "studentId,fullName,password,rollNumber,villageAddress,residenceType,parentPhone";
    const example = "STU001,John Doe,password123,1,Village Name,day_scholar,9876543210";
    const csvContent = `${headers}\n${example}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <TeacherNav>
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Student Management</h1>
            <p className="text-muted-foreground">Add and manage students in your classes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsBulkImportDialogOpen(true)} className="gap-2">
              <Upload className="w-4 h-4" />
              Bulk Import
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </div>
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
                      <TableHead>Residence</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-mono">{student.studentId || "-"}</TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.rollNumber || "-"}</TableCell>
                        <TableCell>{student.className}-{student.section}</TableCell>
                        <TableCell>
                          <Badge variant={student.residenceType === "hostler" ? "secondary" : "outline"}>
                            {student.residenceType === "hostler" ? "Hostler" : "Day Scholar"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.status === "active" ? "default" : "secondary"}>
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(student)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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
        <AddStudentDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          assignedClasses={assignedClasses}
          parents={parents}
          onSuccess={fetchData}
        />

        {/* Edit Student Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>
                Update student information for {selectedStudent?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editRollNumber">Roll Number (unique per class)</Label>
                <Input
                  id="editRollNumber"
                  type="number"
                  placeholder="e.g., 1"
                  value={editFormData.rollNumber}
                  onChange={(e) => handleEditInputChange("rollNumber", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editVillageAddress">Village/Address</Label>
                <Input
                  id="editVillageAddress"
                  placeholder="Enter village or address"
                  value={editFormData.villageAddress}
                  onChange={(e) => handleEditInputChange("villageAddress", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editResidenceType">Residence Type</Label>
                <Select
                  value={editFormData.residenceType}
                  onValueChange={(value) => handleEditInputChange("residenceType", value)}
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
                <Label htmlFor="editParentPhone">Parent Phone Number</Label>
                <Input
                  id="editParentPhone"
                  type="tel"
                  placeholder="e.g., 9876543210"
                  value={editFormData.parentPhone}
                  onChange={(e) => handleEditInputChange("parentPhone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value) => handleEditInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStudent} disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Student"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Student</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedStudent?.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteStudent}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bulk Import Dialog */}
        <Dialog open={isBulkImportDialogOpen} onOpenChange={(open) => {
          setIsBulkImportDialogOpen(open);
          if (!open) {
            setCsvData([]);
            setBulkImportClassId("");
            setImportProgress({ current: 0, total: 0, errors: [] });
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        }}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Bulk Import Students
              </DialogTitle>
              <DialogDescription>
                Upload a CSV file to import multiple students at once
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Download Template */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="text-sm">
                  <p className="font-medium">Download CSV Template</p>
                  <p className="text-muted-foreground text-xs">Use this template to format your data</p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadCSVTemplate} className="gap-2">
                  <Download className="w-4 h-4" />
                  Template
                </Button>
              </div>

              {/* Class Selection */}
              <div className="space-y-2">
                <Label>Select Class *</Label>
                <Select
                  value={bulkImportClassId}
                  onValueChange={setBulkImportClassId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose class for all imported students" />
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

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Upload CSV File *</Label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Required columns: studentId, fullName, password. Optional: rollNumber, villageAddress, residenceType, parentPhone
                </p>
              </div>

              {/* Preview */}
              {csvData.length > 0 && (
                <div className="space-y-2">
                  <Label>Preview ({csvData.length} students)</Label>
                  <div className="max-h-40 overflow-y-auto border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Student ID</TableHead>
                          <TableHead className="text-xs">Name</TableHead>
                          <TableHead className="text-xs">Roll No</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {csvData.slice(0, 5).map((student, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-xs py-1">{student.studentId}</TableCell>
                            <TableCell className="text-xs py-1">{student.fullName}</TableCell>
                            <TableCell className="text-xs py-1">{student.rollNumber || '-'}</TableCell>
                          </TableRow>
                        ))}
                        {csvData.length > 5 && (
                          <TableRow>
                            <TableCell colSpan={3} className="text-xs py-1 text-center text-muted-foreground">
                              ...and {csvData.length - 5} more
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Progress */}
              {isSubmitting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Importing...</span>
                    <span>{importProgress.current} / {importProgress.total}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Errors */}
              {importProgress.errors.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-destructive">Import Errors</Label>
                  <div className="max-h-32 overflow-y-auto p-2 bg-destructive/10 rounded-lg text-xs space-y-1">
                    {importProgress.errors.map((error, idx) => (
                      <p key={idx} className="text-destructive">{error}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsBulkImportDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleBulkImport} 
                disabled={isSubmitting || csvData.length === 0 || !bulkImportClassId}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>Importing...</>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Import {csvData.length} Students
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TeacherNav>
  );
}
