import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  User, 
  GraduationCap, 
  MapPin, 
  Phone, 
  Lock, 
  Users, 
  Home,
  Briefcase,
  CheckCircle,
  Loader2,
  X
} from "lucide-react";

interface ClassInfo {
  id: string;
  name: string;
  section: string;
}

interface Parent {
  id: string;
  userId: string;
  name: string;
  parentId: string;
}

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignedClasses: ClassInfo[];
  parents: Parent[];
  onSuccess: () => void;
}

export function AddStudentDialog({
  open,
  onOpenChange,
  assignedClasses,
  parents,
  onSuccess,
}: AddStudentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<"student" | "parent">("student");

  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    password: "",
    rollNumber: "",
    villageAddress: "",
    residenceType: "day_scholar",
    parentPhone: "",
    classId: "",
    parentId: "",
    // Parent info fields
    fatherName: "",
    motherName: "",
    parentOccupation: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      fullName: "",
      password: "",
      rollNumber: "",
      villageAddress: "",
      residenceType: "day_scholar",
      parentPhone: "",
      classId: "",
      parentId: "",
      fatherName: "",
      motherName: "",
      parentOccupation: "",
    });
    setActiveSection("student");
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onOpenChange(false);
    }
  };

  const handleCreateStudent = async () => {
    if (!formData.studentId || !formData.fullName || !formData.password || !formData.classId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.rollNumber && !/^\d+$/.test(formData.rollNumber)) {
      toast.error("Roll number must be a number");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-user", {
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
          // Include parent info in metadata
          fatherName: formData.fatherName,
          motherName: formData.motherName,
          parentOccupation: formData.parentOccupation,
        },
      });

      if (error) throw error;

      // Check for error in response data
      if (data?.error) {
        if (data.error.includes("already been registered")) {
          toast.error("A student with this ID already exists. Please use a different Student ID.");
        } else if (data.error.includes("students_class_roll_unique")) {
          toast.error("This roll number is already taken in this class");
        } else {
          toast.error(data.error);
        }
        setIsSubmitting(false);
        return;
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        onOpenChange(false);
        onSuccess();
        toast.success("Student added successfully!");
      }, 1500);
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to create student";
      if (errorMessage.includes("already been registered")) {
        toast.error("A student with this ID already exists. Please use a different Student ID.");
      } else if (errorMessage.includes("students_class_roll_unique")) {
        toast.error("This roll number is already taken in this class");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden p-0 gap-0 bg-background border-border">
        {/* Success Animation Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-background/95 rounded-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", duration: 0.5 }}
                  className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center"
                >
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 text-lg font-semibold text-foreground"
                >
                  Student Added!
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">Add New Student</DialogTitle>
                <p className="text-sm text-muted-foreground">Fill in student and parent details</p>
              </div>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveSection("student")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                activeSection === "student"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <User className="w-4 h-4 inline-block mr-2" />
              Student Info
            </button>
            <button
              onClick={() => setActiveSection("parent")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                activeSection === "parent"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              Parent Info
            </button>
          </div>
        </DialogHeader>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[50vh] px-6 py-4">
          <AnimatePresence mode="wait">
            {activeSection === "student" ? (
              <motion.div
                key="student"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Student ID */}
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Student ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="studentId"
                    placeholder="e.g., STU001"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange("studentId", e.target.value.toUpperCase())}
                    className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors"
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Enter student's full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors"
                  />
                </div>

                {/* Class & Roll Number Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="classId" className="text-sm font-medium">
                      Class <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.classId}
                      onValueChange={(value) => handleInputChange("classId", value)}
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-border">
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
                    <Label htmlFor="rollNumber" className="text-sm font-medium">
                      Roll Number
                    </Label>
                    <Input
                      id="rollNumber"
                      type="number"
                      placeholder="e.g., 1"
                      value={formData.rollNumber}
                      onChange={(e) => handleInputChange("rollNumber", e.target.value)}
                      className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors"
                    />
                  </div>
                </div>

                {/* Residence Type */}
                <div className="space-y-2">
                  <Label htmlFor="residenceType" className="text-sm font-medium flex items-center gap-2">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    Residence Type
                  </Label>
                  <Select
                    value={formData.residenceType}
                    onValueChange={(value) => handleInputChange("residenceType", value)}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-border">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day_scholar">Day Scholar</SelectItem>
                      <SelectItem value="hostler">Hostler</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Village/Address */}
                <div className="space-y-2">
                  <Label htmlFor="villageAddress" className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Village/Address
                  </Label>
                  <Input
                    id="villageAddress"
                    placeholder="Enter village or address"
                    value={formData.villageAddress}
                    onChange={(e) => handleInputChange("villageAddress", e.target.value)}
                    className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="parent"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Father Name */}
                <div className="space-y-2">
                  <Label htmlFor="fatherName" className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Father's Name
                  </Label>
                  <Input
                    id="fatherName"
                    placeholder="Enter father's name"
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange("fatherName", e.target.value)}
                    className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors"
                  />
                </div>

                {/* Mother Name */}
                <div className="space-y-2">
                  <Label htmlFor="motherName" className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Mother's Name
                  </Label>
                  <Input
                    id="motherName"
                    placeholder="Enter mother's name"
                    value={formData.motherName}
                    onChange={(e) => handleInputChange("motherName", e.target.value)}
                    className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors"
                  />
                </div>

                {/* Parent Occupation */}
                <div className="space-y-2">
                  <Label htmlFor="parentOccupation" className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    Parent Occupation
                  </Label>
                  <Input
                    id="parentOccupation"
                    placeholder="e.g., Farmer, Teacher, Business"
                    value={formData.parentOccupation}
                    onChange={(e) => handleInputChange("parentOccupation", e.target.value)}
                    className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors"
                  />
                </div>

                {/* Parent Phone */}
                <div className="space-y-2">
                  <Label htmlFor="parentPhone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Parent Phone Number
                  </Label>
                  <Input
                    id="parentPhone"
                    type="tel"
                    placeholder="e.g., 9876543210"
                    value={formData.parentPhone}
                    onChange={(e) => handleInputChange("parentPhone", e.target.value)}
                    className="h-12 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors"
                  />
                </div>

                {/* Link Existing Parent */}
                <div className="space-y-2">
                  <Label htmlFor="parentId" className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    Link Existing Parent (Optional)
                  </Label>
                  <Select
                    value={formData.parentId}
                    onValueChange={(value) => handleInputChange("parentId", value)}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-border">
                      <SelectValue placeholder="Select parent account" />
                    </SelectTrigger>
                    <SelectContent>
                      {parents.map((p) => (
                        <SelectItem key={p.userId} value={p.userId}>
                          {p.name} ({p.parentId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Link to an existing parent account if available
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateStudent}
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Create Student
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
