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
import { Plus, Search, Users, Phone, Mail } from "lucide-react";

interface Parent {
  id: string;
  userId: string;
  name: string;
  parentId: string;
  phone: string;
  occupation: string;
  villageAddress: string;
  linkedStudents: string[];
}

export default function TeacherParents() {
  const { user } = useAuth();
  const [parents, setParents] = useState<Parent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    parentId: "",
    fullName: "",
    password: "",
    phone: "",
    occupation: "",
    villageAddress: "",
  });

  useEffect(() => {
    fetchParents();
  }, [user]);

  const fetchParents = async () => {
    if (!user) return;

    setIsLoading(true);

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
      fetchParents();
    } catch (error: any) {
      console.error("Error creating parent:", error);
      toast.error(error.message || "Failed to create parent");
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
      </div>
    </TeacherNav>
  );
}
