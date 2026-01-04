import { useState, useEffect } from 'react';
import PrincipalNav from '@/components/principal/PrincipalNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Loader2, UserPlus, Eye, EyeOff, BookOpen, Search, 
  Edit, Trash2, Users, ChevronDown, X, Check
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const createTeacherSchema = z.object({
  teacherCode: z.string().min(3, 'Teacher Code must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

interface Teacher {
  id: string;
  user_id: string;
  employee_id: string | null;
  profile: {
    full_name: string | null;
    email: string;
    phone: string | null;
  } | null;
  assignments: {
    class_id: string;
    subject_id: string;
    class: { id: string; name: string; section: string } | null;
    subject: { id: string; name: string } | null;
  }[];
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface Class {
  id: string;
  name: string;
  section: string;
}

const UserManagement = () => {
  // Teachers list state
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form data
  const [formData, setFormData] = useState({
    teacherCode: '',
    password: '',
    fullName: '',
    employeeId: '',
    phone: '',
  });

  // Subjects and Classes
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [classesOpen, setClassesOpen] = useState(false);

  // Fetch teachers
  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          id,
          user_id,
          employee_id,
          profile:profiles!teachers_user_id_fkey(full_name, email, phone),
          assignments:teacher_assignments(
            class_id,
            subject_id,
            class:classes(id, name, section),
            subject:subjects(id, name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to handle the profile structure
      const transformedData = (data || []).map(teacher => ({
        ...teacher,
        profile: Array.isArray(teacher.profile) ? teacher.profile[0] : teacher.profile,
        assignments: (teacher.assignments || []).map((a: { class_id: string; subject_id: string; class: unknown; subject: unknown }) => ({
          ...a,
          class: Array.isArray(a.class) ? a.class[0] : a.class,
          subject: Array.isArray(a.subject) ? a.subject[0] : a.subject,
        })),
      }));
      
      setTeachers(transformedData as Teacher[]);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects and classes
  const fetchSubjectsAndClasses = async () => {
    try {
      const [subjectsRes, classesRes] = await Promise.all([
        supabase.from('subjects').select('id, name, code').order('name'),
        supabase.from('classes').select('id, name, section').order('name'),
      ]);

      if (subjectsRes.data) setSubjects(subjectsRes.data);
      if (classesRes.data) setClasses(classesRes.data);
    } catch (error) {
      console.error('Error fetching subjects/classes:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchSubjectsAndClasses();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const resetForm = () => {
    setFormData({
      teacherCode: '',
      password: '',
      fullName: '',
      employeeId: '',
      phone: '',
    });
    setSelectedSubjects([]);
    setSelectedClasses([]);
    setErrors({});
    setShowPassword(false);
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = createTeacherSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }

    if (selectedClasses.length === 0) {
      toast.error('Please select at least one class');
      return;
    }

    setFormLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          teacherCode: formData.teacherCode,
          password: formData.password,
          fullName: formData.fullName,
          role: 'teacher',
          phone: formData.phone,
          employeeId: formData.employeeId,
          subjectIds: selectedSubjects,
          classIds: selectedClasses,
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to create teacher');
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      toast.success('Teacher created successfully!');
      setIsCreateOpen(false);
      resetForm();
      fetchTeachers();
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;

    setFormLoading(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone: formData.phone || null,
        })
        .eq('id', selectedTeacher.user_id);

      if (profileError) throw profileError;

      // Update teacher employee_id
      const { error: teacherError } = await supabase
        .from('teachers')
        .update({ employee_id: formData.employeeId })
        .eq('id', selectedTeacher.id);

      if (teacherError) throw teacherError;

      // Delete existing assignments
      await supabase
        .from('teacher_assignments')
        .delete()
        .eq('teacher_id', selectedTeacher.id);

      // Create new assignments
      if (selectedSubjects.length > 0 && selectedClasses.length > 0) {
        const assignments = [];
        for (const classId of selectedClasses) {
          for (const subjectId of selectedSubjects) {
            assignments.push({
              teacher_id: selectedTeacher.id,
              class_id: classId,
              subject_id: subjectId,
              is_class_teacher: false,
            });
          }
        }

        const { error: assignError } = await supabase
          .from('teacher_assignments')
          .insert(assignments);

        if (assignError) throw assignError;
      }

      toast.success('Teacher updated successfully!');
      setIsEditOpen(false);
      resetForm();
      setSelectedTeacher(null);
      fetchTeachers();
    } catch (error) {
      console.error('Error updating teacher:', error);
      toast.error('Failed to update teacher');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTeacher = async () => {
    if (!selectedTeacher) return;

    setFormLoading(true);

    try {
      // Delete teacher assignments first
      await supabase
        .from('teacher_assignments')
        .delete()
        .eq('teacher_id', selectedTeacher.id);

      // Delete teacher record
      const { error: teacherError } = await supabase
        .from('teachers')
        .delete()
        .eq('id', selectedTeacher.id);

      if (teacherError) throw teacherError;

      toast.success('Teacher deleted successfully!');
      setIsDeleteOpen(false);
      setSelectedTeacher(null);
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error('Failed to delete teacher');
    } finally {
      setFormLoading(false);
    }
  };

  const openEditDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      teacherCode: teacher.profile?.email?.split('@')[0] || '',
      password: '',
      fullName: teacher.profile?.full_name || '',
      employeeId: teacher.employee_id || '',
      phone: teacher.profile?.phone || '',
    });
    
    // Get unique subject and class IDs from assignments
    const subjectIds = [...new Set(teacher.assignments.map(a => a.subject_id))];
    const classIds = [...new Set(teacher.assignments.map(a => a.class_id))];
    setSelectedSubjects(subjectIds);
    setSelectedClasses(classIds);
    
    setIsEditOpen(true);
  };

  const openDeleteDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteOpen(true);
  };

  const toggleSubject = (id: string) => {
    setSelectedSubjects(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleClass = (id: string) => {
    setSelectedClasses(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const filteredTeachers = teachers.filter(teacher => {
    const searchLower = searchQuery.toLowerCase();
    return (
      teacher.profile?.full_name?.toLowerCase().includes(searchLower) ||
      teacher.profile?.email?.toLowerCase().includes(searchLower) ||
      teacher.employee_id?.toLowerCase().includes(searchLower)
    );
  });

  const getUniqueSubjects = (assignments: Teacher['assignments']) => {
    const uniqueSubjects = new Map();
    assignments.forEach(a => {
      if (a.subject) {
        uniqueSubjects.set(a.subject.id, a.subject.name);
      }
    });
    return Array.from(uniqueSubjects.values());
  };

  const getUniqueClasses = (assignments: Teacher['assignments']) => {
    const uniqueClasses = new Map();
    assignments.forEach(a => {
      if (a.class) {
        uniqueClasses.set(a.class.id, `${a.class.name} ${a.class.section}`);
      }
    });
    return Array.from(uniqueClasses.values());
  };

  const MultiSelectDropdown = ({ 
    label, 
    items, 
    selected, 
    onToggle, 
    isOpen, 
    setIsOpen,
    getLabel 
  }: { 
    label: string;
    items: { id: string; name: string; section?: string }[];
    selected: string[];
    onToggle: (id: string) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    getLabel: (item: { id: string; name: string; section?: string }) => string;
  }) => (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full justify-between"
        >
          <span className="truncate">
            {selected.length > 0 
              ? `${selected.length} selected` 
              : `Select ${label}`}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 border rounded-md p-2 max-h-48 overflow-y-auto bg-background">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground p-2">No {label.toLowerCase()} available</p>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
              onClick={() => onToggle(item.id)}
            >
              <Checkbox checked={selected.includes(item.id)} />
              <span className="text-sm">{getLabel(item)}</span>
            </div>
          ))
        )}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <PrincipalNav>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-primary" />
              Teacher Management
            </h1>
            <p className="text-muted-foreground mt-1">Create, edit, and manage teacher accounts</p>
          </div>
          <Button onClick={() => { resetForm(); setIsCreateOpen(true); }} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Teacher
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{teachers.length}</p>
                <p className="text-sm text-muted-foreground">Total Teachers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{subjects.length}</p>
                <p className="text-sm text-muted-foreground">Subjects</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{classes.length}</p>
                <p className="text-sm text-muted-foreground">Classes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Teachers List</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No teachers found matching your search' : 'No teachers added yet'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Teacher Code</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">
                          {teacher.profile?.full_name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{teacher.employee_id || 'N/A'}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {teacher.profile?.email?.split('@')[0] || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {getUniqueSubjects(teacher.assignments).slice(0, 2).map((subject, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                            {getUniqueSubjects(teacher.assignments).length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{getUniqueSubjects(teacher.assignments).length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {getUniqueClasses(teacher.assignments).slice(0, 2).map((cls, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {cls}
                              </Badge>
                            ))}
                            {getUniqueClasses(teacher.assignments).length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{getUniqueClasses(teacher.assignments).length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(teacher)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => openDeleteDialog(teacher)}
                            >
                              <Trash2 className="h-4 w-4" />
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

        {/* Create Teacher Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add New Teacher
              </DialogTitle>
              <DialogDescription>
                Enter the teacher details and assign subjects and classes
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={errors.fullName ? 'border-destructive' : ''}
                    disabled={formLoading}
                  />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    placeholder="e.g., TCH-001"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    className={errors.employeeId ? 'border-destructive' : ''}
                    disabled={formLoading}
                  />
                  {errors.employeeId && <p className="text-sm text-destructive">{errors.employeeId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacherCode">Teacher Code *</Label>
                  <Input
                    id="teacherCode"
                    placeholder="Enter teacher code"
                    value={formData.teacherCode}
                    onChange={(e) => handleInputChange('teacherCode', e.target.value)}
                    className={errors.teacherCode ? 'border-destructive' : ''}
                    disabled={formLoading}
                  />
                  {errors.teacherCode && <p className="text-sm text-destructive">{errors.teacherCode}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                      disabled={formLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={errors.phone ? 'border-destructive' : ''}
                    disabled={formLoading}
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Subjects *</Label>
                  <MultiSelectDropdown
                    label="Subjects"
                    items={subjects}
                    selected={selectedSubjects}
                    onToggle={toggleSubject}
                    isOpen={subjectsOpen}
                    setIsOpen={setSubjectsOpen}
                    getLabel={(item) => item.name}
                  />
                  {selectedSubjects.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedSubjects.map(id => {
                        const subject = subjects.find(s => s.id === id);
                        return subject ? (
                          <Badge key={id} variant="secondary" className="gap-1">
                            {subject.name}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => toggleSubject(id)} 
                            />
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Classes *</Label>
                  <MultiSelectDropdown
                    label="Classes"
                    items={classes}
                    selected={selectedClasses}
                    onToggle={toggleClass}
                    isOpen={classesOpen}
                    setIsOpen={setClassesOpen}
                    getLabel={(item) => `${item.name} ${item.section || ''}`}
                  />
                  {selectedClasses.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedClasses.map(id => {
                        const cls = classes.find(c => c.id === id);
                        return cls ? (
                          <Badge key={id} variant="outline" className="gap-1">
                            {cls.name} {cls.section}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => toggleClass(id)} 
                            />
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={formLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Create Teacher
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Teacher Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Edit Teacher
              </DialogTitle>
              <DialogDescription>
                Update teacher details and assignments
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditTeacher} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-fullName">Full Name *</Label>
                  <Input
                    id="edit-fullName"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    disabled={formLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-employeeId">Employee ID *</Label>
                  <Input
                    id="edit-employeeId"
                    placeholder="e.g., TCH-001"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    disabled={formLoading}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-teacherCode">Teacher Code</Label>
                  <Input
                    id="edit-teacherCode"
                    value={formData.teacherCode}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Teacher code cannot be changed</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-phone">Phone Number *</Label>
                  <Input
                    id="edit-phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={formLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subjects *</Label>
                  <MultiSelectDropdown
                    label="Subjects"
                    items={subjects}
                    selected={selectedSubjects}
                    onToggle={toggleSubject}
                    isOpen={subjectsOpen}
                    setIsOpen={setSubjectsOpen}
                    getLabel={(item) => item.name}
                  />
                  {selectedSubjects.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedSubjects.map(id => {
                        const subject = subjects.find(s => s.id === id);
                        return subject ? (
                          <Badge key={id} variant="secondary" className="gap-1">
                            {subject.name}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => toggleSubject(id)} 
                            />
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Classes *</Label>
                  <MultiSelectDropdown
                    label="Classes"
                    items={classes}
                    selected={selectedClasses}
                    onToggle={toggleClass}
                    isOpen={classesOpen}
                    setIsOpen={setClassesOpen}
                    getLabel={(item) => `${item.name} ${item.section || ''}`}
                  />
                  {selectedClasses.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedClasses.map(id => {
                        const cls = classes.find(c => c.id === id);
                        return cls ? (
                          <Badge key={id} variant="outline" className="gap-1">
                            {cls.name} {cls.section}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => toggleClass(id)} 
                            />
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={formLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedTeacher?.profile?.full_name}? 
                This will remove the teacher record and all their class assignments. 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={formLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteTeacher}
                disabled={formLoading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PrincipalNav>
  );
};

export default UserManagement;