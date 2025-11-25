export interface Child {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  profileImage?: string;
}

export interface AttendanceRecord {
  date: string;
  status: "Present" | "Absent";
  subject?: string;
}

export interface ExamMarks {
  examName: string;
  subjects: {
    name: string;
    marksObtained: number;
    totalMarks: number;
    percentage: number;
  }[];
  totalObtained: number;
  totalMarks: number;
  percentage: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  postedBy: string;
  type: "School" | "Class";
}

export interface Suggestion {
  id: string;
  teacherName: string;
  subject: string;
  date: string;
  message: string;
}

export interface FeeDetails {
  totalFee: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  breakdown: {
    item: string;
    amount: number;
  }[];
  paymentHistory: {
    date: string;
    amount: number;
    method: string;
  }[];
}

// Mock Children Data
export const mockChildren: Child[] = [
  {
    id: "1",
    name: "Aarav Sharma",
    class: "10",
    section: "A",
    rollNumber: "101",
  },
  {
    id: "2",
    name: "Priya Sharma",
    class: "8",
    section: "B",
    rollNumber: "205",
  },
];

// Mock Attendance Data
export const mockAttendance: AttendanceRecord[] = [
  { date: "2024-01-15", status: "Present" },
  { date: "2024-01-16", status: "Present" },
  { date: "2024-01-17", status: "Absent" },
  { date: "2024-01-18", status: "Present" },
  { date: "2024-01-19", status: "Present" },
  { date: "2024-01-22", status: "Present" },
  { date: "2024-01-23", status: "Present" },
  { date: "2024-01-24", status: "Present" },
  { date: "2024-01-25", status: "Absent" },
  { date: "2024-01-26", status: "Present" },
];

// Mock Marks Data
export const mockMarks: ExamMarks[] = [
  {
    examName: "Unit Test 1",
    subjects: [
      { name: "Mathematics", marksObtained: 85, totalMarks: 100, percentage: 85 },
      { name: "Science", marksObtained: 78, totalMarks: 100, percentage: 78 },
      { name: "English", marksObtained: 92, totalMarks: 100, percentage: 92 },
      { name: "Social Studies", marksObtained: 88, totalMarks: 100, percentage: 88 },
      { name: "Hindi", marksObtained: 76, totalMarks: 100, percentage: 76 },
    ],
    totalObtained: 419,
    totalMarks: 500,
    percentage: 83.8,
  },
  {
    examName: "Midterm Exam",
    subjects: [
      { name: "Mathematics", marksObtained: 90, totalMarks: 100, percentage: 90 },
      { name: "Science", marksObtained: 82, totalMarks: 100, percentage: 82 },
      { name: "English", marksObtained: 88, totalMarks: 100, percentage: 88 },
      { name: "Social Studies", marksObtained: 85, totalMarks: 100, percentage: 85 },
      { name: "Hindi", marksObtained: 80, totalMarks: 100, percentage: 80 },
    ],
    totalObtained: 425,
    totalMarks: 500,
    percentage: 85,
  },
];

// Mock Announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Annual Sports Day",
    message: "The annual sports day will be held on February 15th, 2024. All students are required to participate. Please bring your sports gear and water bottles.",
    date: "2024-01-10",
    postedBy: "Principal",
    type: "School",
  },
  {
    id: "2",
    title: "Parent-Teacher Meeting",
    message: "Parent-teacher meeting is scheduled for January 25th, 2024 from 10 AM to 2 PM. Your presence is highly appreciated.",
    date: "2024-01-12",
    postedBy: "Class Teacher",
    type: "Class",
  },
  {
    id: "3",
    title: "Science Project Submission",
    message: "Reminder: Science project submissions are due by January 30th, 2024. Late submissions will not be accepted.",
    date: "2024-01-18",
    postedBy: "Science Teacher",
    type: "Class",
  },
];

// Mock Suggestions
export const mockSuggestions: Suggestion[] = [
  {
    id: "1",
    teacherName: "Mrs. Gupta",
    subject: "Mathematics",
    date: "2024-01-14",
    message: "Aarav shows excellent problem-solving skills. Encourage him to participate in math olympiads. He could benefit from additional practice in algebra word problems.",
  },
  {
    id: "2",
    teacherName: "Mr. Kumar",
    subject: "Science",
    date: "2024-01-12",
    message: "Good understanding of concepts but needs to work on practical experiments. Suggest more hands-on activities at home.",
  },
  {
    id: "3",
    teacherName: "Ms. Verma",
    subject: "English",
    date: "2024-01-10",
    message: "Excellent reading comprehension and writing skills. Consider encouraging creative writing and participating in essay competitions.",
  },
];

// Mock Fee Details
export const mockFeeDetails: FeeDetails = {
  totalFee: 45000,
  paidAmount: 30000,
  pendingAmount: 15000,
  dueDate: "2024-02-28",
  breakdown: [
    { item: "Tuition Fee", amount: 30000 },
    { item: "Transportation", amount: 8000 },
    { item: "Books & Materials", amount: 5000 },
    { item: "Activity Fee", amount: 2000 },
  ],
  paymentHistory: [
    { date: "2023-08-15", amount: 15000, method: "Online" },
    { date: "2023-11-20", amount: 15000, method: "Cheque" },
  ],
};
