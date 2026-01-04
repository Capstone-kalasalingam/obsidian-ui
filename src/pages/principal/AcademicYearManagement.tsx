import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PrincipalNav from "@/components/principal/PrincipalNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Plus,
  Calendar,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Shield,
  CalendarDays,
  Users,
  ClipboardCheck,
  FileText,
} from "lucide-react";

type AcademicYear = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_locked: boolean;
  admissions_open: boolean;
  attendance_locked: boolean;
  marks_locked: boolean;
  created_at: string;
  locked_at: string | null;
};

const AcademicYearManagement = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newYear, setNewYear] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

  // Fetch academic years
  const { data: academicYears = [], isLoading } = useQuery({
    queryKey: ["academic-years"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academic_years")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data as AcademicYear[];
    },
  });

  // Create academic year
  const createMutation = useMutation({
    mutationFn: async (yearData: typeof newYear) => {
      const { error } = await supabase.from("academic_years").insert({
        name: yearData.name,
        start_date: yearData.start_date,
        end_date: yearData.end_date,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      toast.success("Academic year created successfully");
      setIsCreateOpen(false);
      setNewYear({ name: "", start_date: "", end_date: "" });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Activate academic year
  const activateMutation = useMutation({
    mutationFn: async (yearId: string) => {
      const { error } = await supabase
        .from("academic_years")
        .update({ is_active: true })
        .eq("id", yearId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      toast.success("Academic year activated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Lock academic year
  const lockMutation = useMutation({
    mutationFn: async (yearId: string) => {
      const { error } = await supabase
        .from("academic_years")
        .update({
          is_locked: true,
          locked_at: new Date().toISOString(),
          attendance_locked: true,
          marks_locked: true,
          admissions_open: false,
        })
        .eq("id", yearId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      toast.success("Academic year locked permanently");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Toggle settings
  const toggleSettingMutation = useMutation({
    mutationFn: async ({
      yearId,
      field,
      value,
    }: {
      yearId: string;
      field: string;
      value: boolean;
    }) => {
      const { error } = await supabase
        .from("academic_years")
        .update({ [field]: value })
        .eq("id", yearId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      toast.success("Setting updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const activeYear = academicYears.find((y) => y.is_active);

  return (
    <PrincipalNav>
      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Academic Year Management
            </h1>
            <p className="text-muted-foreground">
              Control academic lifecycle, admissions, and data locks
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-kalvion-blue to-kalvion-purple hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Create Academic Year
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Academic Year</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Year Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., 2024-25"
                    value={newYear.name}
                    onChange={(e) =>
                      setNewYear({ ...newYear, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={newYear.start_date}
                      onChange={(e) =>
                        setNewYear({ ...newYear, start_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={newYear.end_date}
                      onChange={(e) =>
                        setNewYear({ ...newYear, end_date: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => createMutation.mutate(newYear)}
                  disabled={
                    !newYear.name ||
                    !newYear.start_date ||
                    !newYear.end_date ||
                    createMutation.isPending
                  }
                >
                  Create Year
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Year Banner */}
        {activeYear && (
          <Card className="bg-gradient-to-r from-kalvion-blue/10 to-kalvion-purple/10 border-kalvion-blue/20">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kalvion-blue to-kalvion-purple flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Academic Year
                  </p>
                  <p className="font-semibold text-foreground">
                    {activeYear.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={activeYear.admissions_open ? "default" : "secondary"}
                >
                  {activeYear.admissions_open
                    ? "Admissions Open"
                    : "Admissions Closed"}
                </Badge>
                {activeYear.is_locked && (
                  <Badge variant="destructive">
                    <Lock className="w-3 h-3 mr-1" />
                    Locked
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Academic Years List */}
        <div className="grid gap-4">
          {isLoading ? (
            <Card className="p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </Card>
          ) : academicYears.length === 0 ? (
            <Card className="p-8">
              <div className="text-center">
                <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  No Academic Years
                </h3>
                <p className="text-muted-foreground">
                  Create your first academic year to get started
                </p>
              </div>
            </Card>
          ) : (
            academicYears.map((year) => (
              <Card
                key={year.id}
                className={`transition-all duration-200 ${
                  year.is_active
                    ? "ring-2 ring-kalvion-blue/50"
                    : year.is_locked
                    ? "opacity-75"
                    : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {year.name}
                        {year.is_active && (
                          <Badge className="bg-growth text-white">Active</Badge>
                        )}
                        {year.is_locked && (
                          <Badge variant="outline" className="text-destructive border-destructive">
                            <Lock className="w-3 h-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {format(new Date(year.start_date), "MMM d, yyyy")} -{" "}
                        {format(new Date(year.end_date), "MMM d, yyyy")}
                      </CardDescription>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!year.is_active && !year.is_locked && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => activateMutation.mutate(year.id)}
                          disabled={activateMutation.isPending}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                      )}

                      {!year.is_locked && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Lock className="w-4 h-4 mr-1" />
                              Lock Year
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-destructive" />
                                Lock Academic Year Permanently?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Once locked:
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                  <li>No attendance can be edited</li>
                                  <li>No marks can be changed</li>
                                  <li>No student records can be modified</li>
                                  <li>
                                    Data becomes legally binding and archived
                                  </li>
                                </ul>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => lockMutation.mutate(year.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Lock Permanently
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Controls Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {/* Admissions */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Admissions</span>
                      </div>
                      <Switch
                        checked={year.admissions_open}
                        disabled={year.is_locked}
                        onCheckedChange={(checked) =>
                          toggleSettingMutation.mutate({
                            yearId: year.id,
                            field: "admissions_open",
                            value: checked,
                          })
                        }
                      />
                    </div>

                    {/* Attendance Lock */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Attendance Lock
                        </span>
                      </div>
                      <Switch
                        checked={year.attendance_locked}
                        disabled={year.is_locked}
                        onCheckedChange={(checked) =>
                          toggleSettingMutation.mutate({
                            yearId: year.id,
                            field: "attendance_locked",
                            value: checked,
                          })
                        }
                      />
                    </div>

                    {/* Marks Lock */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Marks Lock</span>
                      </div>
                      <Switch
                        checked={year.marks_locked}
                        disabled={year.is_locked}
                        onCheckedChange={(checked) =>
                          toggleSettingMutation.mutate({
                            yearId: year.id,
                            field: "marks_locked",
                            value: checked,
                          })
                        }
                      />
                    </div>

                    {/* Year Status */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Status</span>
                      </div>
                      <Badge
                        variant={
                          year.is_locked
                            ? "destructive"
                            : year.is_active
                            ? "default"
                            : "secondary"
                        }
                      >
                        {year.is_locked
                          ? "Archived"
                          : year.is_active
                          ? "Current"
                          : "Draft"}
                      </Badge>
                    </div>
                  </div>

                  {/* Locked Info */}
                  {year.is_locked && year.locked_at && (
                    <div className="mt-4 p-3 rounded-lg bg-destructive/10 flex items-center gap-2 text-sm text-destructive">
                      <Lock className="w-4 h-4" />
                      <span>
                        Locked on{" "}
                        {format(new Date(year.locked_at), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </PrincipalNav>
  );
};

export default AcademicYearManagement;
