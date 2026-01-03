import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PrincipalDashboard from "./pages/principal/Dashboard";
import PrincipalProfile from "./pages/principal/Profile";
import StaffManagement from "./pages/principal/StaffManagement";
import AddStaff from "./pages/principal/AddStaff";
import EditStaff from "./pages/principal/EditStaff";
import AssignClassTeacher from "./pages/principal/AssignClassTeacher";
import ClassManagement from "./pages/principal/ClassManagement";
import ClassStudents from "./pages/principal/ClassStudents";
import AttendanceOverview from "./pages/principal/AttendanceOverview";
import Announcements from "./pages/principal/Announcements";
import Reports from "./pages/principal/Reports";
import PrincipalFees from "./pages/principal/Fees";
import TeacherDetails from "./pages/principal/TeacherDetails";
import UserManagement from "./pages/principal/UserManagement";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherAttendance from "./pages/teacher/Attendance";
import TeacherStudyMaterial from "./pages/teacher/StudyMaterial";
import TeacherMarksEntry from "./pages/teacher/MarksEntry";
import TeacherClassProgress from "./pages/teacher/ClassProgress";
import TeacherWeeklyReport from "./pages/teacher/WeeklyReport";
import TeacherTimetable from "./pages/teacher/Timetable";
import TeacherAnnouncements from "./pages/teacher/Announcements";
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import StudentAttendance from "./pages/student/Attendance";
import StudentMarks from "./pages/student/Marks";
import StudentMaterials from "./pages/student/StudyMaterials";
import StudentAnnouncements from "./pages/student/Announcements";
import StudentFees from "./pages/student/Fees";
import ParentDashboard from "./pages/parent/Dashboard";
import ParentChildSelection from "./pages/parent/ChildSelection";
import ParentAttendance from "./pages/parent/Attendance";
import ParentMarks from "./pages/parent/Marks";
import ParentAnnouncements from "./pages/parent/Announcements";
import ParentSuggestions from "./pages/parent/Suggestions";
import ParentFees from "./pages/parent/Fees";
import ParentProfile from "./pages/parent/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Principal/School Admin Routes */}
            <Route path="/principal/dashboard" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <PrincipalDashboard />
              </ProtectedRoute>
            } />
            <Route path="/principal/profile" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <PrincipalProfile />
              </ProtectedRoute>
            } />
            <Route path="/principal/staff" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <StaffManagement />
              </ProtectedRoute>
            } />
            <Route path="/principal/add-staff" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <AddStaff />
              </ProtectedRoute>
            } />
            <Route path="/principal/edit-staff/:id" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <EditStaff />
              </ProtectedRoute>
            } />
            <Route path="/principal/teacher/:id" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <TeacherDetails />
              </ProtectedRoute>
            } />
            <Route path="/principal/classes" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <ClassManagement />
              </ProtectedRoute>
            } />
            <Route path="/principal/classes/:className" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <ClassStudents />
              </ProtectedRoute>
            } />
            <Route path="/principal/assign-class-teacher" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <AssignClassTeacher />
              </ProtectedRoute>
            } />
            <Route path="/principal/attendance" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <AttendanceOverview />
              </ProtectedRoute>
            } />
            <Route path="/principal/announcements" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <Announcements />
              </ProtectedRoute>
            } />
            <Route path="/principal/reports" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/principal/fees" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <PrincipalFees />
              </ProtectedRoute>
            } />
            <Route path="/principal/users" element={
              <ProtectedRoute allowedRoles={['school_admin']}>
                <UserManagement />
              </ProtectedRoute>
            } />

            {/* Teacher Routes */}
            <Route path="/teacher/dashboard" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } />
            <Route path="/teacher/attendance" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherAttendance />
              </ProtectedRoute>
            } />
            <Route path="/teacher/study-material" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherStudyMaterial />
              </ProtectedRoute>
            } />
            <Route path="/teacher/marks" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherMarksEntry />
              </ProtectedRoute>
            } />
            <Route path="/teacher/progress" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherClassProgress />
              </ProtectedRoute>
            } />
            <Route path="/teacher/weekly-report" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherWeeklyReport />
              </ProtectedRoute>
            } />
            <Route path="/teacher/timetable" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherTimetable />
              </ProtectedRoute>
            } />
            <Route path="/teacher/announcements" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherAnnouncements />
              </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/student/attendance" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentAttendance />
              </ProtectedRoute>
            } />
            <Route path="/student/marks" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentMarks />
              </ProtectedRoute>
            } />
            <Route path="/student/materials" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentMaterials />
              </ProtectedRoute>
            } />
            <Route path="/student/announcements" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentAnnouncements />
              </ProtectedRoute>
            } />
            <Route path="/student/fees" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentFees />
              </ProtectedRoute>
            } />

            {/* Parent Routes */}
            <Route path="/parent/dashboard" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/parent/child-selection" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentChildSelection />
              </ProtectedRoute>
            } />
            <Route path="/parent/attendance" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentAttendance />
              </ProtectedRoute>
            } />
            <Route path="/parent/marks" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentMarks />
              </ProtectedRoute>
            } />
            <Route path="/parent/announcements" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentAnnouncements />
              </ProtectedRoute>
            } />
            <Route path="/parent/suggestions" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentSuggestions />
              </ProtectedRoute>
            } />
            <Route path="/parent/fees" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentFees />
              </ProtectedRoute>
            } />
            <Route path="/parent/profile" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentProfile />
              </ProtectedRoute>
            } />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
