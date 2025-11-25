import StudentNav from "@/components/student/StudentNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { marksData } from "@/data/studentMockData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Marks = () => {
  const getPercentage = (marks: number, totalMarks: number) => {
    return ((marks / totalMarks) * 100).toFixed(1);
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "A+", color: "bg-green-600" };
    if (percentage >= 80) return { grade: "A", color: "bg-green-500" };
    if (percentage >= 70) return { grade: "B+", color: "bg-blue-500" };
    if (percentage >= 60) return { grade: "B", color: "bg-blue-400" };
    if (percentage >= 50) return { grade: "C", color: "bg-yellow-500" };
    return { grade: "D", color: "bg-red-500" };
  };

  return (
    <StudentNav>
      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        <Accordion type="single" collapsible className="space-y-4">
          {marksData.map((examData, examIndex) => {
            const totalMarks = examData.subjects.reduce((sum, subject) => sum + subject.marks, 0);
            const totalPossible = examData.subjects.reduce((sum, subject) => sum + subject.totalMarks, 0);
            const overallPercentage = (totalMarks / totalPossible) * 100;

            return (
              <AccordionItem 
                key={examIndex} 
                value={`item-${examIndex}`}
                className="border-0"
              >
                <Card className="shadow-lg border animate-slide-up bg-card">
                  <AccordionTrigger className="hover:no-underline p-0">
                    <CardContent className="p-6 w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                            <FileText className="h-6 w-6 text-foreground" />
                          </div>
                          <div className="text-left">
                            <h2 className="text-lg font-bold text-foreground">{examData.exam}</h2>
                            <p className="text-sm text-muted-foreground">
                              Date: {new Date(examData.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right mr-4">
                          <p className="text-2xl font-bold text-green-600">
                            {overallPercentage.toFixed(1)}%
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {totalMarks}/{totalPossible} marks
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-6 pb-6 pt-0">
                    <div className="space-y-3">
                      {examData.subjects.map((subject, subjectIndex) => {
                        const percentage = parseFloat(getPercentage(subject.marks, subject.totalMarks));
                        const gradeInfo = getGrade(percentage);
                        
                        return (
                          <div
                            key={subjectIndex}
                            className="bg-muted rounded-xl p-4 flex items-center justify-between"
                          >
                            <h3 className="text-lg font-semibold text-foreground flex-1">{subject.name}</h3>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-xl font-bold text-foreground">
                                  {subject.marks}/{subject.totalMarks}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {percentage}%
                                </p>
                              </div>
                              <Badge className={`${gradeInfo.color} text-white border-0 font-semibold px-3 py-1.5 text-sm`}>
                                {gradeInfo.grade}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Demo Note */}
        <Card className="shadow-md border bg-blue-50 dark:bg-blue-950">
          <CardContent className="p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Demo Mode:</strong> This is mock result data for demonstration purposes only. No actual exam data is available.
            </p>
          </CardContent>
        </Card>
      </div>
    </StudentNav>
  );
};

export default Marks;
