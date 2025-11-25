// Mock data for demo purposes

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  salary?: number;
  classAssigned?: string;
  status: "active" | "inactive";
  address?: string;
  joiningDate?: string;
  idNumber?: string;
}

export interface Class {
  id: string;
  name: string;
  section: string;
  students: number;
  teacherId?: string;
  teacherName?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  target: "school" | "class" | "role";
  targetDetails?: string;
  date: string;
}

export interface AttendanceData {
  date: string;
  teachersPresent: number;
  teachersAbsent: number;
  studentsPresent: number;
  studentsAbsent: number;
}

export const mockTeachers: Teacher[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah.j@school.com", phone: "+1234567890", subjects: ["Mathematics"], salary: 50000, classAssigned: "LKG - A", status: "active", address: "123 Maple St, Springfield", joiningDate: "March 12, 2021", idNumber: "12133043" },
  { id: "2", name: "Michael Chen", email: "michael.c@school.com", phone: "+1234567891", subjects: ["English"], salary: 48000, classAssigned: "UKG - A", status: "active", address: "456 Oak Ave, Springfield", joiningDate: "January 15, 2020", idNumber: "12133044" },
  { id: "3", name: "Emily Rodriguez", email: "emily.r@school.com", phone: "+1234567892", subjects: ["Science"], salary: 52000, classAssigned: "Class 1 - A", status: "active", address: "789 Pine Rd, Springfield", joiningDate: "August 20, 2019", idNumber: "12133045" },
  { id: "4", name: "David Kumar", email: "david.k@school.com", phone: "+1234567893", subjects: ["Social Studies"], salary: 47000, classAssigned: "Class 2 - A", status: "active", address: "321 Elm St, Springfield", joiningDate: "June 5, 2022", idNumber: "12133046" },
  { id: "5", name: "Lisa Wang", email: "lisa.w@school.com", phone: "+1234567894", subjects: ["Computer Science"], salary: 55000, classAssigned: "Class 3 - A", status: "active", address: "654 Cedar Ln, Springfield", joiningDate: "September 10, 2018", idNumber: "12133047" },
  { id: "6", name: "Robert Brown", email: "robert.b@school.com", phone: "+1234567895", subjects: ["Mathematics"], salary: 51000, classAssigned: "Class 4 - A", status: "active", address: "987 Birch Dr, Springfield", joiningDate: "April 3, 2020", idNumber: "12133048" },
  { id: "7", name: "Maria Garcia", email: "maria.g@school.com", phone: "+1234567896", subjects: ["English"], salary: 49000, classAssigned: "Class 5 - A", status: "active", address: "147 Willow Way, Springfield", joiningDate: "February 18, 2021", idNumber: "12133049" },
  { id: "8", name: "James Wilson", email: "james.w@school.com", phone: "+1234567897", subjects: ["Science"], salary: 53000, classAssigned: "Class 6 - A", status: "active", address: "258 Spruce St, Springfield", joiningDate: "November 22, 2019", idNumber: "12133050" },
  { id: "9", name: "Patricia Lee", email: "patricia.l@school.com", phone: "+1234567898", subjects: ["Mathematics"], salary: 54000, classAssigned: "Class 7 - A", status: "active", address: "369 Ash Blvd, Springfield", joiningDate: "July 14, 2020", idNumber: "12133051" },
  { id: "10", name: "John Martinez", email: "john.m@school.com", phone: "+1234567899", subjects: ["Social Studies"], salary: 48000, classAssigned: "Class 8 - A", status: "active", address: "741 Poplar Ave, Springfield", joiningDate: "May 8, 2021", idNumber: "12133052" },
  { id: "11", name: "Linda Anderson", email: "linda.a@school.com", phone: "+1234567800", subjects: ["English"], salary: 52000, classAssigned: "Class 9 - A", status: "active", address: "852 Hickory Ct, Springfield", joiningDate: "October 25, 2018", idNumber: "12133053" },
  { id: "12", name: "William Taylor", email: "william.t@school.com", phone: "+1234567801", subjects: ["Science"], salary: 56000, classAssigned: "Class 10 - A", status: "active", address: "963 Redwood Pl, Springfield", joiningDate: "December 1, 2019", idNumber: "12133054" },
  { id: "13", name: "Jennifer Thomas", email: "jennifer.t@school.com", phone: "+1234567802", subjects: ["Hindi"], salary: 47000, classAssigned: "LKG - B", status: "active", address: "159 Cherry Ln, Springfield", joiningDate: "March 30, 2022", idNumber: "12133055" },
  { id: "14", name: "Richard Jackson", email: "richard.j@school.com", phone: "+1234567803", subjects: ["Art"], salary: 45000, classAssigned: "UKG - B", status: "active", address: "357 Magnolia Dr, Springfield", joiningDate: "January 10, 2021", idNumber: "12133056" },
  { id: "15", name: "Susan White", email: "susan.w@school.com", phone: "+1234567804", subjects: ["Music"], salary: 46000, classAssigned: "Class 1 - B", status: "active", address: "753 Walnut St, Springfield", joiningDate: "September 5, 2020", idNumber: "12133057" },
  { id: "16", name: "Charles Harris", email: "charles.h@school.com", phone: "+1234567805", subjects: ["Physical Education"], salary: 44000, status: "active", address: "951 Cypress Rd, Springfield", joiningDate: "June 18, 2019", idNumber: "12133058" },
  { id: "17", name: "Margaret Clark", email: "margaret.c@school.com", phone: "+1234567806", subjects: ["Mathematics"], salary: 50000, classAssigned: "Class 2 - B", status: "active", address: "246 Sycamore Ave, Springfield", joiningDate: "August 12, 2021", idNumber: "12133059" },
  { id: "18", name: "Daniel Lewis", email: "daniel.l@school.com", phone: "+1234567807", subjects: ["English"], salary: 49000, classAssigned: "Class 3 - B", status: "active", address: "468 Beech Ln, Springfield", joiningDate: "April 22, 2020", idNumber: "12133060" },
  { id: "19", name: "Dorothy Robinson", email: "dorothy.r@school.com", phone: "+1234567808", subjects: ["Science"], salary: 51000, classAssigned: "Class 4 - B", status: "active", address: "579 Fir St, Springfield", joiningDate: "November 8, 2019", idNumber: "12133061" },
  { id: "20", name: "Paul Walker", email: "paul.w@school.com", phone: "+1234567809", subjects: ["Social Studies"], salary: 48000, classAssigned: "Class 5 - B", status: "active", address: "680 Laurel Way, Springfield", joiningDate: "February 28, 2022", idNumber: "12133062" },
  { id: "21", name: "Nancy Young", email: "nancy.y@school.com", phone: "+1234567810", subjects: ["Mathematics"], salary: 52000, classAssigned: "Class 6 - B", status: "active", address: "791 Dogwood Pl, Springfield", joiningDate: "July 3, 2020", idNumber: "12133063" },
  { id: "22", name: "Mark Allen", email: "mark.a@school.com", phone: "+1234567811", subjects: ["English"], salary: 50000, classAssigned: "Class 7 - B", status: "active", address: "802 Hawthorn Dr, Springfield", joiningDate: "May 16, 2021", idNumber: "12133064" },
  { id: "23", name: "Betty King", email: "betty.k@school.com", phone: "+1234567812", subjects: ["Science"], salary: 53000, classAssigned: "Class 8 - B", status: "active", address: "913 Juniper Ct, Springfield", joiningDate: "October 9, 2019", idNumber: "12133065" },
  { id: "24", name: "George Wright", email: "george.w@school.com", phone: "+1234567813", subjects: ["Mathematics"], salary: 54000, classAssigned: "Class 9 - B", status: "active", address: "124 Chestnut Blvd, Springfield", joiningDate: "December 20, 2018", idNumber: "12133066" },
  { id: "25", name: "Helen Lopez", email: "helen.l@school.com", phone: "+1234567814", subjects: ["English"], salary: 51000, classAssigned: "Class 10 - B", status: "active", address: "235 Acacia Ave, Springfield", joiningDate: "March 5, 2020", idNumber: "12133067" },
  { id: "26", name: "Steven Hill", email: "steven.h@school.com", phone: "+1234567815", subjects: ["Physics"], salary: 55000, status: "active", address: "346 Cottonwood Ln, Springfield", joiningDate: "January 25, 2021", idNumber: "12133068" },
  { id: "27", name: "Sandra Scott", email: "sandra.s@school.com", phone: "+1234567816", subjects: ["Chemistry"], salary: 55000, status: "active", address: "457 Hemlock Rd, Springfield", joiningDate: "September 17, 2019", idNumber: "12133069" },
  { id: "28", name: "Edward Green", email: "edward.g@school.com", phone: "+1234567817", subjects: ["Biology"], salary: 54000, status: "inactive", address: "568 Alder St, Springfield", joiningDate: "June 30, 2020", idNumber: "12133070" },
];

export const mockClasses: Class[] = [
  { id: "1", name: "LKG", section: "A", students: 25, teacherId: "1", teacherName: "Sarah Johnson" },
  { id: "2", name: "LKG", section: "B", students: 23, teacherId: "13", teacherName: "Jennifer Thomas" },
  { id: "3", name: "UKG", section: "A", students: 28, teacherId: "2", teacherName: "Michael Chen" },
  { id: "4", name: "UKG", section: "B", students: 26, teacherId: "14", teacherName: "Richard Jackson" },
  { id: "5", name: "Class 1", section: "A", students: 30, teacherId: "3", teacherName: "Emily Rodriguez" },
  { id: "6", name: "Class 1", section: "B", students: 29, teacherId: "15", teacherName: "Susan White" },
  { id: "7", name: "Class 2", section: "A", students: 32, teacherId: "4", teacherName: "David Kumar" },
  { id: "8", name: "Class 2", section: "B", students: 31, teacherId: "17", teacherName: "Margaret Clark" },
  { id: "9", name: "Class 3", section: "A", students: 35, teacherId: "5", teacherName: "Lisa Wang" },
  { id: "10", name: "Class 3", section: "B", students: 33, teacherId: "18", teacherName: "Daniel Lewis" },
  { id: "11", name: "Class 4", section: "A", students: 34, teacherId: "6", teacherName: "Robert Brown" },
  { id: "12", name: "Class 4", section: "B", students: 32, teacherId: "19", teacherName: "Dorothy Robinson" },
  { id: "13", name: "Class 5", section: "A", students: 36, teacherId: "7", teacherName: "Maria Garcia" },
  { id: "14", name: "Class 5", section: "B", students: 35, teacherId: "20", teacherName: "Paul Walker" },
  { id: "15", name: "Class 6", section: "A", students: 38, teacherId: "8", teacherName: "James Wilson" },
  { id: "16", name: "Class 6", section: "B", students: 37, teacherId: "21", teacherName: "Nancy Young" },
  { id: "17", name: "Class 7", section: "A", students: 40, teacherId: "9", teacherName: "Patricia Lee" },
  { id: "18", name: "Class 7", section: "B", students: 39, teacherId: "22", teacherName: "Mark Allen" },
  { id: "19", name: "Class 8", section: "A", students: 42, teacherId: "10", teacherName: "John Martinez" },
  { id: "20", name: "Class 8", section: "B", students: 41, teacherId: "23", teacherName: "Betty King" },
  { id: "21", name: "Class 9", section: "A", students: 40, teacherId: "11", teacherName: "Linda Anderson" },
  { id: "22", name: "Class 9", section: "B", students: 38, teacherId: "24", teacherName: "George Wright" },
  { id: "23", name: "Class 10", section: "A", students: 35, teacherId: "12", teacherName: "William Taylor" },
  { id: "24", name: "Class 10", section: "B", students: 34, teacherId: "25", teacherName: "Helen Lopez" },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "School Sports Day",
    message: "Annual sports day will be held next Friday. All students and teachers are requested to participate.",
    target: "school",
    date: "2024-01-15",
  },
  {
    id: "2",
    title: "Grade 10 Exam Schedule",
    message: "Mid-term exams for Grade 10 will start from January 20th. Please check the detailed schedule on the notice board.",
    target: "class",
    targetDetails: "Grade 10",
    date: "2024-01-14",
  },
  {
    id: "3",
    title: "Parent-Teacher Meeting",
    message: "Monthly parent-teacher meeting scheduled for January 25th at 3 PM.",
    target: "role",
    targetDetails: "Parents",
    date: "2024-01-13",
  },
];

export const mockAttendanceData: AttendanceData = {
  date: new Date().toISOString().split("T")[0],
  teachersPresent: 26,
  teachersAbsent: 2,
  studentsPresent: 732,
  studentsAbsent: 48,
};

export const mockAttendanceTrends = [
  { month: "Sep", teachers: 95, students: 92 },
  { month: "Oct", teachers: 93, students: 90 },
  { month: "Nov", teachers: 96, students: 93 },
  { month: "Dec", teachers: 94, students: 91 },
  { month: "Jan", teachers: 95, students: 94 },
];
