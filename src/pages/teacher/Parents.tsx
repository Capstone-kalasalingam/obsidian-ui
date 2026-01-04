import { useState, useEffect } from "react";
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
import { Plus, Search, Users, Edit2, Trash2, Link2 } from "lucide-react";

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

export default function TeacherParents() {
  const { user } = useAuth();
  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

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

  const filteredParents = parents.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.parentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  );

  return (
    <TeacherNav>
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Parent Management</h1>
            <p className="text-muted-foreground">Add and manage parent accounts</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Parent
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
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
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
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
        </div>

        {/* Search */}
        <Card className="border-0 card-neu mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, parent ID, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Parents Table */}
        <Card className="border-0 card-neu">
          <CardHeader>
            <CardTitle>Parents List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : filteredParents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No parents found matching your search" : "No parents added yet"}
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

            <div className="py-4 max-h-[300px] overflow-y-auto">
              {students.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No students available in your assigned classes
                </p>
              ) : (
                <div className="space-y-2">
                  {students.map((student) => (
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
      </div>
    </TeacherNav>
  );
}
