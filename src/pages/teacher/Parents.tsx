import { useState, useEffect, useRef } from "react";
import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Plus, Search, Users, Edit2, Trash2, Link2, Upload, Download, FileSpreadsheet } from "lucide-react";

interface Parent {
  id: string;
  userId: string;
  name: string;
  parentId: string;
  phone: string;
  occupation: string;
  villageAddress: string;
  linkedStudentIds: string[];
  linkedStudents: string[];
}

interface Student {
  id: string;
  name: string;
  className: string;
  section: string;
}

interface CSVParent {
  parentId: string;
  fullName: string;
  password: string;
  phone: string;
  occupation: string;
  villageAddress: string;
}

export default function TeacherParents() {
  const { user } = useAuth();
  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "linked" | "unlinked">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isBulkImportDialogOpen, setIsBulkImportDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<CSVParent[]>([]);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, errors: [] as string[] });
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    parentId: "",
    fullName: "",
    password: "",
    phone: "",
    occupation: "",
    villageAddress: "",
  });

  const [editFormData, setEditFormData] = useState({
    phone: "",
    occupation: "",
    villageAddress: "",
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

    let classIds: string[] = [];
    if (teacher?.teacher_assignments) {
      const classes = teacher.teacher_assignments
        .map((a: any) => a.classes)
        .filter((c: any, i: number, arr: any[]) => 
          arr.findIndex((x: any) => x.id === c.id) === i
        );
      classIds = classes.map((c: any) => c.id);

      // Fetch students from assigned classes
      if (classIds.length > 0) {
        const { data: studentsData } = await supabase
          .from("students")
          .select(`
            id,
            user_id,
            class_id,
            classes (name, section)
          `)
          .in("class_id", classIds);

        if (studentsData && studentsData.length > 0) {
          const userIds = studentsData.map((s: any) => s.user_id);
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", userIds);

          const profilesMap = new Map(
            (profilesData || []).map((p: any) => [p.id, p])
          );

          const formattedStudents = studentsData.map((s: any) => {
            const profile = profilesMap.get(s.user_id);
            return {
              id: s.id,
              name: profile?.full_name || "Unknown",
              className: s.classes?.name || "",
              section: s.classes?.section || "",
            };
          });
          setStudents(formattedStudents);
        } else {
          setStudents([]);
        }
      }
    }

    // Fetch parents with their linked students
    const { data: parentsData } = await supabase
      .from("parents")
      .select(`
        id,
        user_id,
        occupation,
        village_address,
        profiles!parents_user_id_fkey (full_name, email, phone),
        student_parents (
          student_id,
          students (
            profiles!students_user_id_fkey (full_name)
          )
        )
      `);

    if (parentsData) {
      const formattedParents = parentsData.map((p: any) => ({
        id: p.id,
        userId: p.user_id,
        name: p.profiles?.full_name || "Unknown",
        parentId: p.profiles?.email?.split("@")[0]?.toUpperCase() || "",
        phone: p.profiles?.phone || "",
        occupation: p.occupation || "",
        villageAddress: p.village_address || "",
        linkedStudentIds: p.student_parents?.map((sp: any) => sp.student_id).filter(Boolean) || [],
        linkedStudents: p.student_parents?.map((sp: any) => 
          sp.students?.profiles?.full_name
        ).filter(Boolean) || [],
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
      parentId: "",
      fullName: "",
      password: "",
      phone: "",
      occupation: "",
      villageAddress: "",
    });
  };

  const handleCreateParent = async () => {
    if (!formData.parentId || !formData.fullName || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await supabase.functions.invoke("create-user", {
        body: {
          parentId: formData.parentId,
          password: formData.password,
          fullName: formData.fullName,
          role: "parent",
          phone: formData.phone,
          occupation: formData.occupation,
          villageAddress: formData.villageAddress,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast.success("Parent created successfully!");
      setIsAddDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error("Error creating parent:", error);
      toast.error(error.message || "Failed to create parent");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (parent: Parent) => {
    setSelectedParent(parent);
    setEditFormData({
      phone: parent.phone,
      occupation: parent.occupation,
      villageAddress: parent.villageAddress,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateParent = async () => {
    if (!selectedParent) return;

    setIsSubmitting(true);

    try {
      // Update profile (phone)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          phone: editFormData.phone || null,
        })
        .eq("id", selectedParent.userId);

      if (profileError) throw profileError;

      // Update parent record (occupation, village_address)
      const { error: parentError } = await supabase
        .from("parents")
        .update({
          occupation: editFormData.occupation || null,
          village_address: editFormData.villageAddress || null,
        })
        .eq("id", selectedParent.id);

      if (parentError) throw parentError;

      toast.success("Parent updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedParent(null);
      fetchData();
    } catch (error: any) {
      console.error("Error updating parent:", error);
      toast.error(error.message || "Failed to update parent");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (parent: Parent) => {
    setSelectedParent(parent);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteParent = async () => {
    if (!selectedParent) return;

    setIsSubmitting(true);

    try {
      // First delete student_parents links
      const { error: linkError } = await supabase
        .from("student_parents")
        .delete()
        .eq("parent_id", selectedParent.id);

      if (linkError) throw linkError;

      // Delete parent record
      const { error: parentError } = await supabase
        .from("parents")
        .delete()
        .eq("id", selectedParent.id);

      if (parentError) throw parentError;

      toast.success("Parent deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedParent(null);
      fetchData();
    } catch (error: any) {
      console.error("Error deleting parent:", error);
      toast.error(error.message || "Failed to delete parent");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkClick = (parent: Parent) => {
    setSelectedParent(parent);
    setSelectedStudentIds(parent.linkedStudentIds);
    setStudentSearchQuery("");
    setIsLinkDialogOpen(true);
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleUpdateLinks = async () => {
    if (!selectedParent) return;

    setIsSubmitting(true);

    try {
      // Get current links
      const currentLinks = selectedParent.linkedStudentIds;
      const newLinks = selectedStudentIds;

      // Find links to remove
      const toRemove = currentLinks.filter(id => !newLinks.includes(id));
      // Find links to add
      const toAdd = newLinks.filter(id => !currentLinks.includes(id));

      // Remove old links
      if (toRemove.length > 0) {
        const { error: removeError } = await supabase
          .from("student_parents")
          .delete()
          .eq("parent_id", selectedParent.id)
          .in("student_id", toRemove);

        if (removeError) throw removeError;
      }

      // Add new links
      if (toAdd.length > 0) {
        const newLinkRecords = toAdd.map(studentId => ({
          parent_id: selectedParent.id,
          student_id: studentId,
          is_primary: currentLinks.length === 0 && toAdd.indexOf(studentId) === 0,
        }));

        const { error: addError } = await supabase
          .from("student_parents")
          .insert(newLinkRecords);

        if (addError) throw addError;
      }

      toast.success("Student links updated successfully!");
      setIsLinkDialogOpen(false);
      setSelectedParent(null);
      fetchData();
    } catch (error: any) {
      console.error("Error updating student links:", error);
      toast.error(error.message || "Failed to update student links");
    } finally {
      setIsSubmitting(false);
    }
  };

  // CSV Import Functions
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
      const requiredHeaders = ['parentid', 'fullname', 'password'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        toast.error(`Missing required columns: ${missingHeaders.join(', ')}`);
        return;
      }

      const parsedData: CSVParent[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length < headers.length) continue;

        const row: any = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx] || '';
        });

        parsedData.push({
          parentId: row.parentid || '',
          fullName: row.fullname || '',
          password: row.password || '',
          phone: row.phone || '',
          occupation: row.occupation || '',
          villageAddress: row.villageaddress || row.village || '',
        });
      }

      if (parsedData.length === 0) {
        toast.error("No valid parent data found in CSV");
        return;
      }

      setCsvData(parsedData);
      toast.success(`${parsedData.length} parents found in CSV`);
    };
    reader.readAsText(file);
  };

  const handleBulkImport = async () => {
    if (csvData.length === 0) {
      toast.error("No CSV data to import");
      return;
    }

    setIsSubmitting(true);
    setImportProgress({ current: 0, total: csvData.length, errors: [] });

    const errors: string[] = [];

    for (let i = 0; i < csvData.length; i++) {
      const parent = csvData[i];
      setImportProgress(prev => ({ ...prev, current: i + 1 }));

      if (!parent.parentId || !parent.fullName || !parent.password) {
        errors.push(`Row ${i + 1}: Missing required fields`);
        continue;
      }

      try {
        const response = await supabase.functions.invoke("create-user", {
          body: {
            parentId: parent.parentId,
            password: parent.password,
            fullName: parent.fullName,
            role: "parent",
            phone: parent.phone,
            occupation: parent.occupation,
            villageAddress: parent.villageAddress,
          },
        });

        if (response.error) {
          errors.push(`Row ${i + 1} (${parent.parentId}): ${response.error.message}`);
        }
      } catch (error: any) {
        errors.push(`Row ${i + 1} (${parent.parentId}): ${error.message}`);
      }
    }

    setImportProgress(prev => ({ ...prev, errors }));
    setIsSubmitting(false);

    if (errors.length === 0) {
      toast.success(`Successfully imported ${csvData.length} parents!`);
      setIsBulkImportDialogOpen(false);
      setCsvData([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchData();
    } else {
      toast.warning(`Import completed with ${errors.length} errors`);
    }
  };

  const downloadTemplate = () => {
    const headers = ['parentId', 'fullName', 'password', 'phone', 'occupation', 'villageAddress'];
    const sampleRow = ['PAR001', 'Sample Parent', 'password123', '9876543210', 'Farmer', 'Ramapur'];
    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parents_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredParents = parents.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.parentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery);
    
    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "linked" && p.linkedStudents.length > 0) ||
      (filterStatus === "unlinked" && p.linkedStudents.length === 0);

    return matchesSearch && matchesFilter;
  });

  return (
    <TeacherNav>
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Parent Management</h1>
            <p className="text-muted-foreground">Add and manage parent accounts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsBulkImportDialogOpen(true)} className="gap-2">
              <Upload className="w-4 h-4" />
              Bulk Import
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Parent
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="border-0 card-neu">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{parents.length}</p>
                  <p className="text-sm text-muted-foreground">Total Parents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 card-neu">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {parents.filter(p => p.linkedStudents.length > 0).length}
                  </p>
                  <p className="text-sm text-muted-foreground">With Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 card-neu">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {parents.filter(p => p.linkedStudents.length === 0).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Unlinked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <Card className="border-0 card-neu mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, parent ID, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={(v: "all" | "linked" | "unlinked") => setFilterStatus(v)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Parents</SelectItem>
                  <SelectItem value="linked">With Students</SelectItem>
                  <SelectItem value="unlinked">Without Students</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Parents Table */}
        <Card className="border-0 card-neu">
          <CardHeader>
            <CardTitle>Parents List ({filteredParents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : filteredParents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery || filterStatus !== "all" ? "No parents found matching your criteria" : "No parents added yet"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parent ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Village</TableHead>
                      <TableHead>Occupation</TableHead>
                      <TableHead>Linked Students</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParents.map((parent) => (
                      <TableRow key={parent.id}>
                        <TableCell className="font-mono">{parent.parentId}</TableCell>
                        <TableCell className="font-medium">{parent.name}</TableCell>
                        <TableCell>{parent.phone || "-"}</TableCell>
                        <TableCell>{parent.villageAddress || "-"}</TableCell>
                        <TableCell>{parent.occupation || "-"}</TableCell>
                        <TableCell>
                          {parent.linkedStudents.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {parent.linkedStudents.map((name, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {name}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">No students linked</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleLinkClick(parent)}
                              title="Link/Unlink Students"
                            >
                              <Link2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(parent)}
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(parent)}
                              className="text-destructive hover:text-destructive"
                              title="Delete"
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

        {/* Add Parent Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Parent</DialogTitle>
              <DialogDescription>
                Create a new parent account. You can link students later.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="parentId">Parent ID *</Label>
                <Input
                  id="parentId"
                  placeholder="e.g., PAR001"
                  value={formData.parentId}
                  onChange={(e) => handleInputChange("parentId", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter parent's full name"
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
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="e.g., 9876543210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  placeholder="e.g., Engineer"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="villageAddress">Village Name</Label>
                <Input
                  id="villageAddress"
                  placeholder="e.g., Ramapur"
                  value={formData.villageAddress}
                  onChange={(e) => handleInputChange("villageAddress", e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateParent} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Parent"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Parent Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Parent</DialogTitle>
              <DialogDescription>
                Update parent details for {selectedParent?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editPhone">Phone Number</Label>
                <Input
                  id="editPhone"
                  placeholder="e.g., 9876543210"
                  value={editFormData.phone}
                  onChange={(e) => handleEditInputChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editOccupation">Occupation</Label>
                <Input
                  id="editOccupation"
                  placeholder="e.g., Engineer"
                  value={editFormData.occupation}
                  onChange={(e) => handleEditInputChange("occupation", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editVillageAddress">Village Name</Label>
                <Input
                  id="editVillageAddress"
                  placeholder="e.g., Ramapur"
                  value={editFormData.villageAddress}
                  onChange={(e) => handleEditInputChange("villageAddress", e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateParent} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Parent</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedParent?.name}? This will also remove all student links. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteParent}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Link Students Dialog */}
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Link Students</DialogTitle>
              <DialogDescription>
                Select students to link to {selectedParent?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="py-2 max-h-[300px] overflow-y-auto">
              {students.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No students available in your assigned classes
                </p>
              ) : (
                <div className="space-y-2">
                  {students
                    .filter((student) =>
                      student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                      student.className.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                      student.section.toLowerCase().includes(studentSearchQuery.toLowerCase())
                    )
                    .map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleStudentSelection(student.id)}
                      >
                        <Checkbox
                          checked={selectedStudentIds.includes(student.id)}
                          onCheckedChange={() => toggleStudentSelection(student.id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.className} - {student.section}
                          </p>
                        </div>
                      </div>
                    ))}
                  {students.filter((student) =>
                    student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                    student.className.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                    student.section.toLowerCase().includes(studentSearchQuery.toLowerCase())
                  ).length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No students found matching "{studentSearchQuery}"
                    </p>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateLinks} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Links"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Import Dialog */}
        <Dialog open={isBulkImportDialogOpen} onOpenChange={(open) => {
          setIsBulkImportDialogOpen(open);
          if (!open) {
            setCsvData([]);
            setImportProgress({ current: 0, total: 0, errors: [] });
            if (fileInputRef.current) fileInputRef.current.value = '';
          }
        }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Bulk Import Parents</DialogTitle>
              <DialogDescription>
                Upload a CSV file to import multiple parents at once
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2">
                  <Download className="w-4 h-4" />
                  Download Template
                </Button>
                <span className="text-sm text-muted-foreground">
                  Use this template for correct format
                </span>
              </div>

              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <FileSpreadsheet className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Click to upload CSV file</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Required columns: parentId, fullName, password
                  </p>
                </label>
              </div>

              {csvData.length > 0 && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-medium">{csvData.length} parents ready to import</p>
                  <p className="text-sm text-muted-foreground">
                    Preview: {csvData.slice(0, 3).map(p => p.fullName).join(', ')}
                    {csvData.length > 3 && ` and ${csvData.length - 3} more...`}
                  </p>
                </div>
              )}

              {importProgress.total > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{importProgress.current} / {importProgress.total}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                    />
                  </div>
                  {importProgress.errors.length > 0 && (
                    <div className="mt-2 max-h-32 overflow-y-auto">
                      {importProgress.errors.map((err, i) => (
                        <p key={i} className="text-xs text-destructive">{err}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBulkImportDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleBulkImport} 
                disabled={isSubmitting || csvData.length === 0}
              >
                {isSubmitting ? `Importing ${importProgress.current}/${importProgress.total}...` : "Import Parents"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TeacherNav>
  );
}
