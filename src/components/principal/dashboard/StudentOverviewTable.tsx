import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStudents } from "@/hooks/usePrincipalData";

type ImprovementStatus = "improving" | "stable" | "needs-revision";

interface StudentRow {
  id: string;
  name: string;
  avatar: string;
  className: string;
  attendance: number;
  learningConsistency: number;
  status: ImprovementStatus;
}

const getStatusBadge = (status: ImprovementStatus) => {
  switch (status) {
    case "improving":
      return (
        <Badge className="bg-growth/10 text-growth hover:bg-growth/20 border-0 font-medium">
          Improving
        </Badge>
      );
    case "stable":
      return (
        <Badge className="bg-learning/10 text-learning hover:bg-learning/20 border-0 font-medium">
          Stable
        </Badge>
      );
    case "needs-revision":
      return (
        <Badge className="bg-attention/10 text-attention hover:bg-attention/20 border-0 font-medium">
          Needs Revision
        </Badge>
      );
  }
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const StudentOverviewTable = () => {
  const { students, loading } = useStudents();

  // Transform real students data with placeholder metrics
  const studentRows: StudentRow[] = students.slice(0, 6).map((student, index) => {
    const statuses: ImprovementStatus[] = ["improving", "stable", "needs-revision"];
    return {
      id: student.id,
      name: student.profile?.full_name || "Unknown Student",
      avatar: student.profile?.avatar_url || "",
      className: student.class ? `${student.class.name} ${student.class.section}` : "N/A",
      attendance: 85 + Math.floor(Math.random() * 15), // Placeholder
      learningConsistency: 70 + Math.floor(Math.random() * 25), // Placeholder
      status: statuses[index % 3],
    };
  });

  return (
    <Card className="bg-card border-0 rounded-2xl shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Student Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : studentRows.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No students found. Add students to see the overview.
          </p>
        ) : (
          <div className="space-y-3">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground px-2 pb-2">
              <div className="col-span-4">Student</div>
              <div className="col-span-2">Class</div>
              <div className="col-span-2 text-center">Attendance</div>
              <div className="col-span-2 text-center">Learning</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            {/* Rows */}
            {studentRows.map((student, index) => (
              <div
                key={student.id}
                className={`grid grid-cols-12 gap-4 items-center p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer hover-scale-soft animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Student */}
                <div className="col-span-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-kalvion-blue to-kalvion-purple text-white text-sm">
                      {getInitials(student.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm text-foreground truncate">
                    {student.name}
                  </span>
                </div>

                {/* Class */}
                <div className="col-span-2 text-sm text-muted-foreground">
                  {student.className}
                </div>

                {/* Attendance */}
                <div className="col-span-2 text-center">
                  <span className={`text-sm font-medium ${
                    student.attendance >= 90 ? "text-growth" : 
                    student.attendance >= 75 ? "text-foreground" : 
                    "text-attention"
                  }`}>
                    {student.attendance}%
                  </span>
                </div>

                {/* Learning Consistency */}
                <div className="col-span-2 text-center">
                  <span className={`text-sm font-medium ${
                    student.learningConsistency >= 85 ? "text-growth" : 
                    student.learningConsistency >= 70 ? "text-foreground" : 
                    "text-attention"
                  }`}>
                    {student.learningConsistency}%
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2 text-right">
                  {getStatusBadge(student.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentOverviewTable;
