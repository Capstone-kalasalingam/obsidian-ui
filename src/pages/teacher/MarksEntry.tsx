import { useState } from "react";
import TeacherNav from "@/components/teacher/TeacherNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { students, classes, subjects, examTypes } from "@/data/teacherMockData";
import { Save, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MarksEntry() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [totalMarks, setTotalMarks] = useState("100");
  const [marks, setMarks] = useState<Record<number, string>>({});
  const { toast } = useToast();

  const calculatePercentage = (obtained: string, total: string) => {
    const obtainedNum = parseFloat(obtained);
    const totalNum = parseFloat(total);
    if (isNaN(obtainedNum) || isNaN(totalNum) || totalNum === 0) return "";
    return ((obtainedNum / totalNum) * 100).toFixed(1);
  };

  const handleMarkChange = (studentId: number, value: string) => {
    setMarks((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Success!",
      description: "Marks saved successfully (Demo mode - no backend)",
    });
  };

  const canShowStudents =
    selectedClass && selectedSubject && selectedExam;

  return (
    <TeacherNav>
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
        <div className="mb-6 md:mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Marks Entry</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Enter student marks for assessments
          </p>
        </div>

        <Alert className="mb-4 md:mb-6 animate-slide-up border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 text-sm">
            Demo only — No backend data storage
          </AlertDescription>
        </Alert>

        {/* Filters */}
        <Card className="mb-4 md:mb-6 animate-slide-up border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">Select Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select Class
                </label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select Subject
                </label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Exam Type
                </label>
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Total Marks
                </label>
                <Input
                  type="number"
                  min="1"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marks Entry Table */}
        {canShowStudents ? (
          <Card className="animate-slide-in-left border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">
                Enter Marks - {selectedClass} | {selectedSubject} |{" "}
                {examTypes.find((e) => e.id === selectedExam)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Roll No</th>
                      <th className="text-left p-3 font-semibold">
                        Student Name
                      </th>
                      <th className="text-right p-3 font-semibold">
                        Marks (Out of {totalMarks})
                      </th>
                      <th className="text-right p-3 font-semibold">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => {
                      const percentage = calculatePercentage(marks[student.id] || "", totalMarks);
                      return (
                        <tr
                          key={student.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-3 text-muted-foreground">
                            {student.rollNo}
                          </td>
                          <td className="p-3 font-medium">{student.name}</td>
                          <td className="p-3">
                            <Input
                              type="number"
                              min="0"
                              max={totalMarks}
                              placeholder="Enter marks"
                              value={marks[student.id] || ""}
                              onChange={(e) =>
                                handleMarkChange(student.id, e.target.value)
                              }
                              className="max-w-[120px] ml-auto"
                            />
                          </td>
                          <td className="p-3 text-right font-semibold text-primary">
                            {percentage ? `${percentage}%` : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mt-4 md:mt-6 pt-4 md:pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                  Total Students: {students.length}
                </div>
                <Button size="lg" onClick={handleSave} className="w-full md:w-auto">
                  <Save className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Save Marks
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="animate-fade-in border-0">
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Select class, subject, and exam type
              </h3>
              <p className="text-muted-foreground">
                Fill in all the filters above to view student list
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TeacherNav>
  );
}
