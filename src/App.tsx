import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PrincipalLogin from "./pages/principal/Login";
import PrincipalDashboard from "./pages/principal/Dashboard";
import StaffManagement from "./pages/principal/StaffManagement";
import AddStaff from "./pages/principal/AddStaff";
import AssignClassTeacher from "./pages/principal/AssignClassTeacher";
import ClassManagement from "./pages/principal/ClassManagement";
import AttendanceOverview from "./pages/principal/AttendanceOverview";
import Announcements from "./pages/principal/Announcements";
import Reports from "./pages/principal/Reports";
import TeacherDetails from "./pages/principal/TeacherDetails";
import TeacherLogin from "./pages/teacher/Login";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherAttendance from "./pages/teacher/Attendance";
import TeacherStudyMaterial from "./pages/teacher/StudyMaterial";
import TeacherMarksEntry from "./pages/teacher/MarksEntry";
import TeacherClassProgress from "./pages/teacher/ClassProgress";
import TeacherWeeklyReport from "./pages/teacher/WeeklyReport";
import TeacherTimetable from "./pages/teacher/Timetable";
import TeacherAnnouncements from "./pages/teacher/Announcements";
import StudentLogin from "./pages/student/Login";
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import StudentAttendance from "./pages/student/Attendance";
import StudentMarks from "./pages/student/Marks";
import StudentMaterials from "./pages/student/StudyMaterials";
import StudentAnnouncements from "./pages/student/Announcements";
import StudentFees from "./pages/student/Fees";
import ParentLogin from "./pages/parent/Login";
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
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/principal/login" element={<PrincipalLogin />} />
          <Route path="/principal/dashboard" element={<PrincipalDashboard />} />
          <Route path="/principal/staff" element={<StaffManagement />} />
          <Route path="/principal/add-staff" element={<AddStaff />} />
          <Route path="/principal/teacher/:id" element={<TeacherDetails />} />
          <Route path="/principal/classes" element={<ClassManagement />} />
          <Route path="/principal/assign-class-teacher" element={<AssignClassTeacher />} />
          <Route path="/principal/attendance" element={<AttendanceOverview />} />
          <Route path="/principal/announcements" element={<Announcements />} />
          <Route path="/principal/reports" element={<Reports />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/attendance" element={<TeacherAttendance />} />
          <Route path="/teacher/study-material" element={<TeacherStudyMaterial />} />
          <Route path="/teacher/marks" element={<TeacherMarksEntry />} />
          <Route path="/teacher/progress" element={<TeacherClassProgress />} />
          <Route path="/teacher/weekly-report" element={<TeacherWeeklyReport />} />
          <Route path="/teacher/timetable" element={<TeacherTimetable />} />
          <Route path="/teacher/announcements" element={<TeacherAnnouncements />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/marks" element={<StudentMarks />} />
          <Route path="/student/materials" element={<StudentMaterials />} />
          <Route path="/student/announcements" element={<StudentAnnouncements />} />
          <Route path="/student/fees" element={<StudentFees />} />
          <Route path="/parent/login" element={<ParentLogin />} />
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
          <Route path="/parent/child-selection" element={<ParentChildSelection />} />
          <Route path="/parent/attendance" element={<ParentAttendance />} />
          <Route path="/parent/marks" element={<ParentMarks />} />
          <Route path="/parent/announcements" element={<ParentAnnouncements />} />
          <Route path="/parent/suggestions" element={<ParentSuggestions />} />
          <Route path="/parent/fees" element={<ParentFees />} />
          <Route path="/parent/profile" element={<ParentProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
