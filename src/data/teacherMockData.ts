// Mock data for teacher module

export const teacherInfo = {
  name: "Sarah Johnson",
  email: "sarah.johnson@school.com",
  subject: "Mathematics",
  employeeId: "TCH-2024-001",
};

export const todayClasses = [
  { id: 1, class: "10-A", subject: "Mathematics", time: "09:00 AM - 10:00 AM", room: "Room 201", status: "upcoming" },
  { id: 2, class: "10-B", subject: "Mathematics", time: "10:15 AM - 11:15 AM", room: "Room 201", status: "upcoming" },
  { id: 3, class: "9-A", subject: "Mathematics", time: "11:30 AM - 12:30 PM", room: "Room 203", status: "completed" },
  { id: 4, class: "10-C", subject: "Mathematics", time: "02:00 PM - 03:00 PM", room: "Room 201", status: "upcoming" },
];

export const students = [
  { id: 1, name: "Aarav Sharma", rollNo: "101", status: "present" },
  { id: 2, name: "Diya Patel", rollNo: "102", status: "present" },
  { id: 3, name: "Arjun Kumar", rollNo: "103", status: "absent" },
  { id: 4, name: "Ananya Singh", rollNo: "104", status: "present" },
  { id: 5, name: "Rohan Gupta", rollNo: "105", status: "present" },
  { id: 6, name: "Priya Reddy", rollNo: "106", status: "absent" },
  { id: 7, name: "Vikram Nair", rollNo: "107", status: "present" },
  { id: 8, name: "Ishita Joshi", rollNo: "108", status: "present" },
  { id: 9, name: "Kabir Mehta", rollNo: "109", status: "present" },
  { id: 10, name: "Meera Desai", rollNo: "110", status: "present" },
  { id: 11, name: "Aditya Verma", rollNo: "111", status: "present" },
  { id: 12, name: "Sanya Kapoor", rollNo: "112", status: "present" },
];

export const classes = [
  { id: "10-A", name: "Class 10-A", students: 45 },
  { id: "10-B", name: "Class 10-B", students: 42 },
  { id: "10-C", name: "Class 10-C", students: 40 },
  { id: "9-A", name: "Class 9-A", students: 38 },
];

export const studyMaterials = [
  {
    id: 1,
    title: "Quadratic Equations - Chapter 4",
    type: "PDF",
    class: "10-A",
    subject: "Mathematics",
    date: "2024-03-15",
  },
  {
    id: 2,
    title: "Trigonometry Basics",
    type: "PDF",
    class: "10-B",
    subject: "Mathematics",
    date: "2024-03-14",
  },
  {
    id: 3,
    title: "Previous Year Questions 2023",
    type: "Question Paper",
    class: "10-A",
    subject: "Mathematics",
    date: "2024-03-10",
  },
  {
    id: 4,
    title: "Calculus Tutorial Series",
    type: "Tutorial",
    class: "10-C",
    subject: "Mathematics",
    date: "2024-03-08",
  },
];

export const examTypes = [
  { id: "unit-test-1", name: "Unit Test 1" },
  { id: "midterm", name: "Mid Term" },
  { id: "unit-test-2", name: "Unit Test 2" },
  { id: "final", name: "Final Exam" },
];

export const subjects = [
  { id: "math", name: "Mathematics" },
  { id: "science", name: "Science" },
  { id: "english", name: "English" },
  { id: "social", name: "Social Studies" },
];

export const classProgress = {
  weeklyAttendance: 92,
  classAverage: 78,
  subjectPerformance: [
    { subject: "Algebra", average: 82 },
    { subject: "Geometry", average: 75 },
    { subject: "Trigonometry", average: 80 },
    { subject: "Calculus", average: 72 },
  ],
};

export const announcements = [
  {
    id: 1,
    title: "Parent-Teacher Meeting",
    message: "Parent-teacher meeting scheduled for 20th March. Please ensure all progress reports are updated.",
    class: "10-A",
    date: "2024-03-15",
  },
  {
    id: 2,
    title: "Unit Test Schedule",
    message: "Unit Test 2 will be conducted from 25th-28th March. Syllabus: Chapters 4-6.",
    class: "All Classes",
    date: "2024-03-14",
  },
  {
    id: 3,
    title: "Project Submission",
    message: "Mathematics project on Real-life Applications due by 30th March.",
    class: "10-B",
    date: "2024-03-12",
  },
];

export const suggestions = [
  {
    id: 1,
    studentName: "Arjun Kumar",
    class: "10-A",
    message: "Needs extra practice in trigonometry. Recommend additional worksheets.",
    date: "2024-03-14",
  },
  {
    id: 2,
    studentName: "Priya Reddy",
    class: "10-A",
    message: "Shows excellent problem-solving skills. Can be given advanced level problems.",
    date: "2024-03-13",
  },
  {
    id: 3,
    studentName: "Vikram Nair",
    class: "10-B",
    message: "Requires attention in basic concepts. Schedule remedial classes.",
    date: "2024-03-12",
  },
];

export const pendingAttendance = [
  { class: "10-A", date: "2024-03-15", status: "pending" },
  { class: "10-B", date: "2024-03-15", status: "pending" },
];
